from __future__ import annotations

import hashlib
import json
import logging
from contextlib import asynccontextmanager
from typing import Annotated, Any

import numpy as np
from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from transformers import pipeline

from app.config import Settings, get_settings
from app.pipelines.archetypes import ARCHETYPES
from app.pipelines.charts import language_mix_png_base64
from app.pipelines.embeddings import encode_texts, projection_preview
from app.pipelines.features import signals_to_feature_frame
from app.pipelines.score_model import build_score_model, compute_ml_peve_score
from app.pipelines.soul_engine import infer_project_soul
from app.pipelines.vector_store import RepositoryVectorStore
from app.pipelines.summarization import summarize_readme
from app.schemas import RepositoryIntelligenceResponse, RepositorySignals
from app.util_github import parse_github_repo_url

logger = logging.getLogger("peve_ml")


class AppState:
    st_model: SentenceTransformer | None = None
    archetype_embeddings: np.ndarray | None = None
    archetype_keys: list[str] = []
    summarizer: Any = None
    vector_store: RepositoryVectorStore | None = None
    score_model: Any = None


state = AppState()


def architecture_hints(signals: RepositorySignals) -> list[str]:
    hints: list[str] = []
    blob = " ".join(signals.topics + signals.tech_stack).lower()
    if any(x in blob for x in ("docker", "kubernetes", "k8s")):
        hints.append("Container / orchestration signals detected — deployment path likely considered.")
    if any(x in blob for x in ("github-actions", "ci", "gitlab-ci")):
        hints.append("Automation / CI adjacent tooling appears in metadata.")
    if any(x in blob for x in ("react", "next", "vue", "svelte")):
        hints.append("Modern UI stack patterns inferred from declared technologies.")
    if any(x in blob for x in ("postgres", "mongodb", "mysql", "redis", "prisma")):
        hints.append("Persistent data layer technologies are visible in the stack signal.")
    if not hints:
        hints.append("Add topics and richer README sections to sharpen architecture inference.")
    return hints[:6]


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    logger.info("Loading sentence-transformers model: %s", settings.embedding_model)
    state.st_model = SentenceTransformer(settings.embedding_model)
    state.vector_store = RepositoryVectorStore(settings.embedding_store_path)
    state.archetype_keys = [k for k, _ in ARCHETYPES]
    texts = [t for _, t in ARCHETYPES]
    bs = settings.embedding_encode_batch_size
    state.archetype_embeddings = encode_texts(state.st_model, texts, batch_size=bs)

    historical_rows = state.vector_store.fetch_training_rows(limit=1200) if state.vector_store else []
    state.score_model = build_score_model(historical_rows)

    if not settings.skip_summarization:
        logger.info("Loading summarization pipeline: %s", settings.summarizer_model)
        try:
            state.summarizer = pipeline(
                "summarization",
                model=settings.summarizer_model,
                device=-1,
            )
        except Exception as e:
            logger.warning("Summarization disabled after load error: %s", e)
            state.summarizer = None
    else:
        state.summarizer = None

    yield

    state.summarizer = None
    state.st_model = None
    state.archetype_embeddings = None
    state.vector_store = None
    state.score_model = None


def verify_api_key(
    settings: Annotated[Settings, Depends(get_settings)],
    x_api_key: str | None = Header(default=None, alias="X-API-Key"),
) -> None:
    if settings.api_key and x_api_key != settings.api_key:
        raise HTTPException(status_code=401, detail="Invalid or missing API key")


def _cache_key(body: RepositorySignals) -> str:
    raw = json.dumps(body.model_dump(), sort_keys=True, ensure_ascii=False)
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def run_intelligence(body: RepositorySignals, settings: Settings) -> RepositoryIntelligenceResponse:
    if state.st_model is None or state.archetype_embeddings is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    readme_text = (body.readme_excerpt or "").strip()
    commits_tail = (body.commit_messages_sample or "").strip()
    if commits_tail:
        readme_text = (
            f"{readme_text}\n\nRecent commit subjects (public metadata only):\n{commits_tail[:3000]}"
        ).strip()
    desc_text = (body.description or "").strip()
    combined_text = "\n\n".join(
        part
        for part in [
            body.category.strip(),
            " ".join(body.topics),
            " ".join(body.key_features),
            " ".join(body.tech_stack),
            desc_text,
            readme_text,
        ]
        if part.strip()
    ).strip() or "repository overview unavailable"

    bs = settings.embedding_encode_batch_size
    readme_only_emb = encode_texts(state.st_model, [combined_text], batch_size=bs)[0]
    desc_emb = encode_texts(state.st_model, [desc_text or " "], batch_size=bs)[0]

    if desc_text:
        sem_mass = float(
            np.clip(
                cosine_similarity(
                    readme_only_emb.reshape(1, -1),
                    desc_emb.reshape(1, -1),
                )[0, 0],
                0,
                1,
            )
        )
    else:
        sem_mass = float(np.clip(len(readme_text) / 6000.0, 0, 1))

    neighbor_similarity = 0.0
    similar_repos = []
    if state.vector_store is not None:
        similar_repos = state.vector_store.search_similar(
            readme_only_emb,
            limit=3,
            exclude_repo_url=body.repo_url,
        )
        if similar_repos:
            neighbor_similarity = similar_repos[0].similarity

    df = signals_to_feature_frame(body, semantic_mass=sem_mass, neighbor_similarity=neighbor_similarity)
    score, breakdown, rationale = compute_ml_peve_score(df, state.score_model)

    soul = infer_project_soul(
        readme_only_emb,
        state.archetype_embeddings,
        state.archetype_keys,
    )

    tech_summary = summarize_readme(
        state.summarizer,
        readme_text,
        extractive_fallback=settings.extractive_summary_fallback,
    )
    chart_b64 = language_mix_png_base64(body.languages or {})
    proj = projection_preview(readme_only_emb, 8)

    if state.vector_store is not None:
        parsed_repo = parse_github_repo_url(body.repo_url)
        state.vector_store.upsert_analysis(
            repo_url=body.repo_url,
            title=(parsed_repo.repo if parsed_repo else body.repo_url.rsplit('/', 1)[-1]) or body.repo_url,
            tagline=(body.description[:240] or body.category or body.repo_url),
            category=body.category or "Web Application",
            peve_score_ml=score,
            embedding=readme_only_emb,
            feature_row=df.iloc[0].to_dict(),
            intelligence={
                "peve_score_ml": score,
                "score_breakdown": breakdown,
                "score_rationale_ml": rationale,
                "project_soul": soul,
                "technical_summary": tech_summary,
                "architecture_hints": architecture_hints(body),
                "embedding_projection": proj,
            },
        )

    return RepositoryIntelligenceResponse(
        peve_score_ml=score,
        score_breakdown=breakdown,
        score_rationale_ml=rationale,
        project_soul=soul,
        technical_summary=tech_summary,
        architecture_hints=architecture_hints(body),
        embedding_projection=proj,
        chart_language_mix_png_base64=chart_b64,
        semantic_neighbors=[
            {
                "repo_url": item.repo_url,
                "title": item.title,
                "tagline": item.tagline,
                "category": item.category,
                "peve_score_ml": item.peve_score_ml,
                "similarity": item.similarity,
                "updated_at": item.updated_at,
            }
            for item in similar_repos
        ],
        model_versions={
            "sentence_transformers": settings.embedding_model,
            "summarizer": (
                settings.summarizer_model
                if state.summarizer
                else (
                    "extractive-heuristic"
                    if settings.extractive_summary_fallback
                    else "disabled"
                )
            ),
            "score_model": "RandomForestRegressor(calibrated)",
            "embedding_store": settings.embedding_store_path,
        },
    )


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title="Peve ML Service", version="0.1.0", lifespan=lifespan)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok", "models": "loaded" if state.st_model else "loading"}

    @app.post("/v1/repository-intelligence", response_model=RepositoryIntelligenceResponse)
    def repository_intelligence(
        body: RepositorySignals,
        _: Annotated[None, Depends(verify_api_key)],
        settings: Annotated[Settings, Depends(get_settings)],
    ) -> RepositoryIntelligenceResponse:
        redis_client = None
        if settings.redis_url:
            try:
                import redis

                redis_client = redis.Redis.from_url(settings.redis_url, decode_responses=True)
            except Exception as e:
                logger.warning("Redis unavailable: %s", e)

        cache_key = f"peve:repo_intel:{_cache_key(body)}"
        if redis_client:
            try:
                hit = redis_client.get(cache_key)
                if hit:
                    return RepositoryIntelligenceResponse.model_validate_json(hit)
            except Exception as e:
                logger.warning("Redis get failed: %s", e)

        out = run_intelligence(body, settings)

        if redis_client:
            try:
                redis_client.setex(
                    cache_key,
                    settings.cache_ttl_seconds,
                    out.model_dump_json(),
                )
            except Exception as e:
                logger.warning("Redis set failed: %s", e)

        return out

    return app


app = create_app()
