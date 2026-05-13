from __future__ import annotations

from typing import Any

import numpy as np


def encode_texts(
    model: Any,
    texts: list[str],
    *,
    batch_size: int = 32,
) -> np.ndarray:
    """L2-normalized sentence embeddings (NumPy-backed tensor → array)."""
    import torch

    clean = [t.strip()[:8000] or " " for t in texts]
    with torch.inference_mode():
        emb = model.encode(
            clean,
            normalize_embeddings=True,
            show_progress_bar=False,
            batch_size=max(1, batch_size),
        )
    return np.asarray(emb, dtype=np.float32)


def projection_preview(vec: np.ndarray, out_dim: int = 8) -> list[float]:
    """
    Lightweight preview vector for UI (first dimensions of normalized slice).
    Not a stored full embedding — privacy-preserving preview only.
    """
    v = np.asarray(vec, dtype=np.float32).ravel()
    if v.size == 0:
        return [0.0] * out_dim
    take = min(out_dim, v.size)
    head = v[:take].copy()
    if take < out_dim:
        head = np.pad(head, (0, out_dim - take))
    n = float(np.linalg.norm(head) + 1e-9)
    return (head / n).tolist()
