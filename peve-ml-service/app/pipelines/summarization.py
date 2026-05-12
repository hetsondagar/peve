from __future__ import annotations

from typing import Any


def summarize_readme(summarizer: Any | None, text: str, max_input_chars: int = 1800) -> str | None:
    """Transformers distilbart summarization (optional — heavy on first load)."""
    if summarizer is None or not text.strip():
        return None
    chunk = " ".join(text.split())[:max_input_chars]
    if len(chunk) < 120:
        return None
    try:
        out = summarizer(
            chunk,
            max_length=120,
            min_length=24,
            do_sample=False,
            truncation=True,
        )
        if isinstance(out, list) and out and "summary_text" in out[0]:
            return str(out[0]["summary_text"]).strip()
    except Exception:
        return None
    return None
