from __future__ import annotations

import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler

from app.schemas import ScoreBreakdown


def compute_ml_peve_score(
    df: pd.DataFrame,
    readme_semantic_mass: float,
) -> tuple[float, ScoreBreakdown, str]:
    """
    Explainable blend: MinMax-scaled tabular features (sklearn) + semantic mass from embeddings.
    """
    X = df.astype(np.float64).values
    scaler = MinMaxScaler()
    xn = scaler.fit_transform(X)[0]

    # Hand-tuned positive weights on normalized axes (engineering interpretability)
    w = np.array([0.12, 0.10, 0.05, 0.14, 0.16, 0.07, 0.08, 0.18, 0.10], dtype=np.float64)
    tab = float(np.dot(xn, w[: xn.shape[0]]))

    sem = float(np.clip(readme_semantic_mass, 0.0, 1.0))
    blended = 0.72 * tab + 0.28 * sem
    score = float(np.clip(22.0 + blended * 78.0, 18.0, 100.0))

    arch = float(np.clip(12 + 35 * xn[3] + 25 * xn[8], 0, 100))
    doc = float(np.clip(10 + 45 * xn[6] + 30 * sem, 0, 100))
    stack = float(np.clip(8 + 40 * xn[4] + 20 * xn[3], 0, 100))
    community = float(np.clip(5 + 40 * (xn[0] + xn[1]) / 2 + 15 * xn[2], 0, 100))
    innov = float(np.clip(10 + 35 * xn[5] + 25 * xn[7], 0, 100))

    breakdown = ScoreBreakdown(
        architecture=round(arch, 1),
        documentation=round(doc, 1),
        stack_breadth=round(stack, 1),
        community=round(community, 1),
        innovation=round(innov, 1),
    )
    rationale = (
        "Peve ML score combines normalized repository signals (stars, forks, languages, stack breadth) "
        "with README semantic density from sentence embeddings. No proprietary source code is required."
    )
    return round(score, 1), breakdown, rationale
