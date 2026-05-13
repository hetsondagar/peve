from __future__ import annotations

from dataclasses import dataclass
from typing import Any

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor


FEATURE_COLUMNS = [
    "log_stars",
    "log_forks",
    "log_issues",
    "n_langs",
    "n_tech",
    "n_topics",
    "n_features",
    "readme_len_norm",
    "lang_concentration",
    "semantic_mass",
    "neighbor_similarity",
]


@dataclass(slots=True)
class ScoreModelResult:
    score: float
    breakdown: dict[str, float]
    rationale: str


def _bootstrap_training_frame(seed: int = 7, size: int = 900) -> pd.DataFrame:
    rng = np.random.default_rng(seed)
    rows: list[dict[str, float]] = []
    for _ in range(size):
        log_stars = float(rng.gamma(1.8, 0.9))
        log_forks = float(max(0.0, log_stars * 0.72 + rng.normal(0.0, 0.35)))
        log_issues = float(max(0.0, rng.normal(0.9, 0.7)))
        n_langs = float(np.clip(rng.integers(1, 9), 1, 8))
        n_tech = float(np.clip(rng.integers(1, 16), 1, 15))
        n_topics = float(np.clip(rng.integers(0, 9), 0, 8))
        n_features = float(np.clip(rng.integers(0, 11), 0, 10))
        readme_len_norm = float(np.clip(rng.beta(2.5, 1.9), 0.0, 1.0))
        lang_concentration = float(np.clip(rng.beta(2.0, 2.4), 0.0, 1.0))
        semantic_mass = float(np.clip(rng.beta(2.7, 1.8), 0.0, 1.0))
        neighbor_similarity = float(np.clip(rng.beta(1.8, 3.4), 0.0, 1.0))

        score = (
            18.0
            + 8.5 * min(log_stars, 6.0)
            + 4.5 * min(log_forks, 5.0)
            - 1.8 * min(log_issues, 5.0)
            + 4.4 * n_langs
            + 3.1 * n_tech
            + 2.4 * n_topics
            + 2.0 * n_features
            + 16.0 * readme_len_norm
            + 10.0 * semantic_mass
            + 4.0 * neighbor_similarity
            - 6.0 * lang_concentration
        )
        rows.append(
            {
                "log_stars": log_stars,
                "log_forks": log_forks,
                "log_issues": log_issues,
                "n_langs": n_langs,
                "n_tech": n_tech,
                "n_topics": n_topics,
                "n_features": n_features,
                "readme_len_norm": readme_len_norm,
                "lang_concentration": lang_concentration,
                "semantic_mass": semantic_mass,
                "neighbor_similarity": neighbor_similarity,
                "label": float(np.clip(score, 0.0, 100.0)),
            }
        )
    return pd.DataFrame(rows)


def build_score_model(historical_rows: list[dict[str, Any]] | None = None) -> RandomForestRegressor:
    bootstrap = _bootstrap_training_frame()
    if historical_rows:
        hist = pd.DataFrame(historical_rows)
        missing = [col for col in FEATURE_COLUMNS + ["label"] if col not in hist.columns]
        if not missing:
            bootstrap = pd.concat([bootstrap, hist[FEATURE_COLUMNS + ["label"]]], ignore_index=True)

    model = RandomForestRegressor(
        n_estimators=96,
        random_state=7,
        min_samples_leaf=3,
        n_jobs=1,
    )
    model.fit(bootstrap[FEATURE_COLUMNS], bootstrap["label"])
    return model


def _ablation_score(model: RandomForestRegressor, row: pd.Series, zero_columns: list[str]) -> float:
    sample = row.copy()
    for column in zero_columns:
        sample[column] = 0.0
    frame = pd.DataFrame([sample[FEATURE_COLUMNS]])
    return float(model.predict(frame)[0])


def compute_ml_peve_score(
    df: pd.DataFrame,
    model: RandomForestRegressor,
) -> tuple[float, dict[str, float], str]:
    row = df.iloc[0]
    base = float(model.predict(df[FEATURE_COLUMNS])[0])

    architecture = base - _ablation_score(model, row, ["n_langs", "n_tech", "lang_concentration"])
    documentation = base - _ablation_score(model, row, ["readme_len_norm", "n_features"])
    stack_breadth = base - _ablation_score(model, row, ["n_tech", "n_langs"])
    community = base - _ablation_score(model, row, ["log_stars", "log_forks", "log_issues"])
    innovation = base - _ablation_score(model, row, ["n_topics", "semantic_mass", "neighbor_similarity"])

    breakdown_raw = np.array([architecture, documentation, stack_breadth, community, innovation], dtype=np.float64)
    breakdown_raw = np.clip(breakdown_raw, 0.0, None)
    if float(breakdown_raw.sum()) <= 1e-6:
        breakdown_raw = np.ones_like(breakdown_raw)
    breakdown_scaled = (breakdown_raw / float(breakdown_raw.sum())) * 100.0

    score = float(np.clip(base, 0.0, 100.0))
    breakdown = {
        "architecture": round(float(breakdown_scaled[0]), 1),
        "documentation": round(float(breakdown_scaled[1]), 1),
        "stack_breadth": round(float(breakdown_scaled[2]), 1),
        "community": round(float(breakdown_scaled[3]), 1),
        "innovation": round(float(breakdown_scaled[4]), 1),
    }
    rationale = (
        "Peve ML score is predicted by a trained scikit-learn random forest over repository signals, "
        "semantic embedding mass, and neighbor similarity from the persistent embedding store. "
        "Category breakdown uses model ablation, not fixed scoring weights."
    )
    return round(score, 1), breakdown, rationale
