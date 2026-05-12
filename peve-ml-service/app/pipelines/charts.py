from __future__ import annotations

import base64
import io

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt


def language_mix_png_base64(languages: dict[str, int], top_n: int = 10) -> str | None:
    """Matplotlib horizontal bar chart → PNG base64 for dashboards."""
    if not languages:
        return None
    items = sorted(languages.items(), key=lambda kv: kv[1], reverse=True)[:top_n]
    labels = [k for k, _ in items]
    values = [v for _, v in items]

    fig, ax = plt.subplots(figsize=(7, 3.2), dpi=120)
    fig.patch.set_facecolor("#0f1419")
    ax.set_facecolor("#10151d")
    ax.barh(labels[::-1], values[::-1], color="#00e8e8", alpha=0.85, height=0.65)
    ax.set_xlabel("Bytes (GitHub languages API)", color="#bfbfbf", fontsize=9)
    ax.tick_params(colors="#bfbfbf", labelsize=8)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    for spine in ax.spines.values():
        spine.set_color("#2a3340")
    ax.set_title("Language mix", color="#e8f0ff", fontsize=11, pad=8)
    plt.tight_layout()
    buf = io.BytesIO()
    fig.savefig(buf, format="png", facecolor=fig.get_facecolor())
    plt.close(fig)
    return base64.standard_b64encode(buf.getvalue()).decode("ascii")
