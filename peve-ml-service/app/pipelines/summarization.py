from __future__ import annotations

import re
from typing import Any


def _strip_markdown_noise(s: str) -> str:
    s = re.sub(r"```[\s\S]*?```", " ", s)
    s = re.sub(r"`[^`]+`", " ", s)
    s = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", s)
    s = re.sub(r"[#>*_\-]{1,6}\s?", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def extractive_readme_blurb(text: str, *, max_chars: int = 420) -> str | None:
    """Lightweight README gist when no seq2seq model is loaded (fits small RAM tiers)."""
    if not text.strip():
        return None
    flat = _strip_markdown_noise(text)
    if len(flat) < 80:
        return None
    # Scan only an early window — keeps CPU/RAM predictable on huge READMEs
    chunk = flat[:4800]
    sentences = re.split(r"(?<=[.!?])\s+", chunk)
    out_parts: list[str] = []
    n = 0
    for sent in sentences:
        t = sent.strip()
        if len(t) < 20:
            continue
        out_parts.append(t)
        n += len(t) + 1
        if n >= max_chars or len(out_parts) >= 4:
            break
    blurb = " ".join(out_parts).strip()
    if len(blurb) < 60:
        blurb = flat[:max_chars].rsplit(" ", 1)[0].strip()
    if len(blurb) < 40:
        return None
    if len(blurb) <= max_chars:
        return blurb
    cut = blurb[: max_chars - 1].rsplit(" ", 1)[0].strip()
    return f"{cut}…" if cut else None


def summarize_readme(
    summarizer: Any | None,
    text: str,
    max_input_chars: int = 1800,
    *,
    extractive_fallback: bool = False,
) -> str | None:
    """DistilBART summarization when loaded; optional extractive gist for low-memory hosts."""
    if not text.strip():
        return None
    chunk = " ".join(text.split())[:max_input_chars]
    if summarizer is not None and len(chunk) >= 120:
        try:
            out = summarizer(
                chunk,
                max_length=120,
                min_length=24,
                do_sample=False,
                truncation=True,
            )
            if isinstance(out, list) and out and "summary_text" in out[0]:
                got = str(out[0]["summary_text"]).strip()
                if got:
                    return got
        except Exception:
            pass
    if extractive_fallback:
        return extractive_readme_blurb(text)
    return None
