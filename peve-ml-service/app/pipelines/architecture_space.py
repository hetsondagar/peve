"""
Real ML architecture map: same SentenceTransformer space + PCA-2D of
[repository embedding | topic strings | tech strings | semantic anchor phrases].

No LLM — only embeddings already used for scoring + sklearn PCA.
"""

from __future__ import annotations

from typing import Any, Literal

import numpy as np
from sklearn.decomposition import PCA

from app.pipelines.embeddings import encode_texts

# Fixed semantic directions in embedding space (short, model-friendly phrases).
ANCHOR_TEXTS: tuple[tuple[str, str], ...] = (
    ("UI plane", "Web and mobile user interface components and client-side experience"),
    ("API plane", "HTTP APIs microservices server-side application logic and integrations"),
    ("Data plane", "Databases persistence caching data pipelines and storage systems"),
)


def build_architecture_space(
    model: Any,
    readme_embedding: np.ndarray,
    topics: list[str],
    tech_stack: list[str],
    *,
    batch_size: int = 8,
    max_topics: int = 10,
    max_tech: int = 14,
) -> list[dict[str, Any]]:
    """
    Returns [{label, x, y, kind}, ...] with x,y from PCA on stacked embeddings.
    """
    labels: list[str] = []
    kinds: list[Literal["repo", "topic", "tech", "anchor"]] = []
    matrices: list[np.ndarray] = []

    labels.append("Repository signal")
    kinds.append("repo")
    matrices.append(np.asarray(readme_embedding, dtype=np.float32).ravel())

    seen: set[str] = set()
    topic_texts: list[str] = []
    for raw in topics[:max_topics]:
        t = (raw or "").strip()
        if not t:
            continue
        key = t.lower()
        if key in seen:
            continue
        seen.add(key)
        labels.append(t if len(t) <= 48 else t[:45] + "…")
        kinds.append("topic")
        topic_texts.append(f"Open-source repository topic: {t}")

    tech_texts: list[str] = []
    for raw in tech_stack[:max_tech]:
        s = (raw or "").strip()
        if not s:
            continue
        key = s.lower()
        if key in seen:
            continue
        seen.add(key)
        labels.append(s if len(s) <= 48 else s[:45] + "…")
        kinds.append("tech")
        tech_texts.append(f"Software technology stack item: {s}")

    anchor_texts: list[str] = []
    for short, long_phrase in ANCHOR_TEXTS:
        labels.append(short)
        kinds.append("anchor")
        anchor_texts.append(long_phrase)

    to_encode = topic_texts + tech_texts + anchor_texts
    if to_encode:
        extra = encode_texts(model, to_encode, batch_size=batch_size)
        extra_arr = np.asarray(extra, dtype=np.float32)
        for i in range(extra_arr.shape[0]):
            matrices.append(extra_arr[i].ravel())

    X = np.stack(matrices, axis=0)
    n = X.shape[0]
    if n < 2:
        return [{"label": labels[0], "x": 0.0, "y": 0.0, "kind": kinds[0]}]

    pca = PCA(n_components=2, random_state=42)
    xy = pca.fit_transform(X.astype(np.float64))
    # Scale to a stable view box for charts
    span = np.max(np.abs(xy), axis=0).clip(1e-9, None)
    xy = xy / span

    out: list[dict[str, Any]] = []
    for i in range(n):
        out.append(
            {
                "label": labels[i],
                "x": float(xy[i, 0]),
                "y": float(xy[i, 1]),
                "kind": kinds[i],
            }
        )
    return out
