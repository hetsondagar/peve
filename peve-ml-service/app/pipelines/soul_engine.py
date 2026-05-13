from __future__ import annotations

import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

from app.pipelines.archetypes import ARCHETYPES
from app.schemas import RepositorySignals


def _infer_signal_narratives(signals: RepositorySignals) -> list[str]:
    """
    Deterministic, repo-grounded lines (topics, stack, activity, README depth).
    Complements embedding archetypes - specific, not generic output.
    """
    lines: list[str] = []
    topics_blob = " ".join(signals.topics).lower()
    stack = " ".join(signals.tech_stack).lower()
    feats = " ".join(signals.key_features).lower()
    blob = f"{topics_blob} {stack} {feats}"
    stars = int(signals.stars or 0)
    forks = int(signals.forks or 0)
    issues = int(signals.open_issues or 0)
    readme_len = len((signals.readme_excerpt or "").strip())
    stage = (signals.development_stage or "").lower()
    diff = (signals.difficulty_level or "").lower()

    if stars >= 500:
        lines.append(
            "Public traction is strong: many stars usually mean real users or teams depending on this work in production."
        )
    elif stars >= 80:
        lines.append(
            "The repo has meaningful attention - enough signal that quality and usefulness are being validated in the open."
        )
    elif stars < 8 and readme_len > 800:
        lines.append(
            "Documentation outpaces hype: a thorough README with modest stars often indicates depth-first engineering."
        )

    if forks >= 30:
        lines.append(
            "Fork volume suggests others extend or ship variants - a sign the design is legible enough to build on."
        )

    if issues >= 25:
        lines.append(
            "A busy issue surface usually means the project is evolving under real constraints rather than frozen as a demo."
        )
    elif issues <= 2 and stars > 40:
        lines.append(
            "Low open issues with steady stars can indicate a stable core and disciplined maintenance cadence."
        )

    if any(x in stack for x in ("kubernetes", "k8s", "docker")):
        lines.append(
            "Container and orchestration signals show operability is treated as part of the product, not an afterthought."
        )
    if any(x in stack for x in ("postgres", "mysql", "mongodb", "redis", "prisma", "drizzle")):
        lines.append(
            "Persistent data technologies in the stack point to stateful, long-lived systems thinking."
        )
    if any(x in stack for x in ("react", "next", "vue", "svelte", "tailwind")):
        lines.append(
            "Modern UI tooling suggests care for delivery surfaces and how the work is experienced, not only how it runs."
        )
    if any(x in stack for x in ("fastapi", "express", "nestjs", "django", "flask", "spring")):
        lines.append(
            "Application-layer frameworks imply explicit boundaries between transport, domain logic, and persistence."
        )
    if any(x in blob for x in ("test", "jest", "vitest", "pytest", "playwright", "cypress")):
        lines.append(
            "Testing-adjacent signals hint at verification habits - engineering maturity shows up in how change is guarded."
        )
    if any(x in blob for x in ("github-actions", "gitlab-ci", "circleci")):
        lines.append(
            "CI automation in metadata suggests repeatable pipelines and less reliance on manual release heroics."
        )

    if "machine-learning" in topics_blob or any(x in stack for x in ("torch", "tensorflow", "sklearn", "jax")):
        lines.append(
            "ML-adjacent framing indicates experimentation loops, evaluation discipline, or data-centric iteration."
        )

    if stage in ("ongoing", "completed") and readme_len > 1200:
        lines.append(
            "Maturity markers plus a rich narrative suggest sustained execution rather than a one-off spike of activity."
        )
    elif stage == "prototype":
        lines.append(
            "Prototype-stage labeling reads as velocity-first exploration - useful when validating direction before hardening."
        )

    if diff == "advanced" and len(signals.tech_stack) >= 6:
        lines.append(
            "Stack breadth with an advanced difficulty label implies comfort juggling multiple subsystems at once."
        )

    if readme_len < 200 and stars < 5:
        lines.append(
            "Sparse README with low surface metrics is common early on; the story of intent and tradeoffs may still be forming."
        )

    return lines[:6]


def infer_project_soul(
    readme_embedding: np.ndarray,
    archetype_embeddings: np.ndarray,
    archetype_keys: list[str],
    signals: RepositorySignals,
    *,
    threshold: float = 0.22,
    max_lines: int = 8,
) -> list[str]:
    """
    Signature 'project soul': embedding-aligned archetypes + repo-grounded narratives.
    """
    sims = cosine_similarity(readme_embedding.reshape(1, -1), archetype_embeddings)[0]
    order = np.argsort(-sims)
    arche_lines: list[str] = []
    for idx in order:
        if sims[idx] < threshold:
            break
        key = archetype_keys[int(idx)]
        text = next(t for k, t in ARCHETYPES if k == key)
        arche_lines.append(text)
        if len(arche_lines) >= 4:
            break

    sig_lines = _infer_signal_narratives(signals)

    merged: list[str] = []
    seen_sub: set[str] = set()
    for line in arche_lines + sig_lines:
        key = line[:72].strip().lower()
        if key in seen_sub:
            continue
        seen_sub.add(key)
        merged.append(line.strip())
        if len(merged) >= max_lines:
            break

    if not merged:
        merged.append(
            "The README signal is still forming a clear narrative - iterate on intent, users, and constraints."
        )
    return merged


def infer_project_soul_without_embeddings(
    signals: RepositorySignals,
    *,
    max_lines: int = 8,
) -> list[str]:
    """
    Low-memory fallback used when embedding model is disabled.
    Keeps showcase narrative usable with deterministic repo signals only.
    """
    lines = _infer_signal_narratives(signals)
    if not lines:
        lines = [
            "The repository metadata suggests an early-stage build; add richer README and topics for deeper intelligence."
        ]
    return lines[:max_lines]
