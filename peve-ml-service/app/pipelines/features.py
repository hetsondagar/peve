from __future__ import annotations

import numpy as np
import pandas as pd

from app.schemas import RepositorySignals


def signals_to_feature_frame(
    signals: RepositorySignals,
    *,
    semantic_mass: float = 0.0,
    neighbor_similarity: float = 0.0,
) -> pd.DataFrame:
    """Tabular feature row for sklearn / numpy scoring (Pandas)."""
    langs = signals.languages or {}
    total = float(sum(langs.values())) or 1.0
    top_share = max(langs.values(), default=0) / total

    row = {
        "log_stars": np.log1p(max(signals.stars, 0)),
        "log_forks": np.log1p(max(signals.forks, 0)),
        "log_issues": np.log1p(max(signals.open_issues, 0)),
        "n_langs": float(len(langs)),
        "n_tech": float(len(signals.tech_stack)),
        "n_topics": float(len(signals.topics)),
        "n_features": float(len(signals.key_features)),
        "readme_len_norm": min(len(signals.readme_excerpt), 50_000) / 50_000.0,
        "lang_concentration": float(top_share),
        "semantic_mass": float(np.clip(semantic_mass, 0.0, 1.0)),
        "neighbor_similarity": float(np.clip(neighbor_similarity, 0.0, 1.0)),
    }
    return pd.DataFrame([row])
