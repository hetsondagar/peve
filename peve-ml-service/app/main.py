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
from app.pipelines.scoring import compute_ml_peve_score
from app.pipelines.soul_engine import infer_project_soul
from app.pipelines.summarization import summarize_readme
from app.schemas import RepositoryIntelligenceResponse, RepositorySignals

logger = logging.getLogger("peve_ml")


class AppState:
    st_model: SentenceTransformer | None = None
    archetype_embeddings: np.ndarray | None = None
    archetype_keys: list[str] = []
    summarizer: Any = None


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
    state.archetype_keys = [k for k, _ in ARCHETYPES]
    texts = [t for _, t in ARCHETYPES]
    state.archetype_embeddings = encode_texts(state.st_model, texts)

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

    readme_only_emb = encode_texts(state.st_model, [readme_text or "overview unavailable"])[0]
    desc_emb = encode_texts(state.st_model, [desc_text or " "])[0]

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

    df = signals_to_feature_frame(body)
    score, breakdown, rationale = compute_ml_peve_score(df, sem_mass)

    soul = infer_project_soul(
        readme_only_emb,
        state.archetype_embeddings,
        state.archetype_keys,
    )

    tech_summary = summarize_readme(state.summarizer, readme_text)
    chart_b64 = language_mix_png_base64(body.languages or {})
    proj = projection_preview(readme_only_emb, 8)

    return RepositoryIntelligenceResponse(
        peve_score_ml=score,
        score_breakdown=breakdown,
        score_rationale_ml=rationale,
        project_soul=soul,
        technical_summary=tech_summary,
        architecture_hints=architecture_hints(body),
        embedding_projection=proj,
        chart_language_mix_png_base64=chart_b64,
        model_versions={
            "sentence_transformers": settings.embedding_model,
            "summarizer": settings.summarizer_model if state.summarizer else "disabled",
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
