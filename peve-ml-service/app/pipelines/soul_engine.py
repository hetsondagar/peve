from __future__ import annotations

import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

from app.pipelines.archetypes import ARCHETYPES


def infer_project_soul(
    readme_embedding: np.ndarray,
    archetype_embeddings: np.ndarray,
    archetype_keys: list[str],
    threshold: float = 0.28,
    max_lines: int = 4,
) -> list[str]:
    """Align README embedding to archetype vectors (scikit-learn cosine similarity)."""
    sims = cosine_similarity(readme_embedding.reshape(1, -1), archetype_embeddings)[0]
    order = np.argsort(-sims)
    lines: list[str] = []
    for idx in order:
        if sims[idx] < threshold:
            break
        key = archetype_keys[int(idx)]
        text = next(t for k, t in ARCHETYPES if k == key)
        lines.append(text)
        if len(lines) >= max_lines:
            break
    if not lines:
        lines.append(
            "The README signal is still forming a clear narrative — iterate on intent, users, and constraints."
        )
    return lines
