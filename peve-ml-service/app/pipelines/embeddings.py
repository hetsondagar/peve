from __future__ import annotations

import numpy as np
from sentence_transformers import SentenceTransformer


def encode_texts(model: SentenceTransformer, texts: list[str]) -> np.ndarray:
    """L2-normalized sentence embeddings (NumPy-backed tensor → array)."""
    clean = [t.strip()[:8000] or " " for t in texts]
    emb = model.encode(clean, normalize_embeddings=True, show_progress_bar=False)
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
