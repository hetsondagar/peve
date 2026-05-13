"""GitHub URL parsing aligned with backend `parseGithubRepoUrl` behavior."""

from __future__ import annotations

from dataclasses import dataclass
from urllib.parse import urlparse


@dataclass(frozen=True, slots=True)
class ParsedRepo:
    owner: str
    repo: str
    html_url: str


def parse_github_repo_url(raw_input: str) -> ParsedRepo | None:
    raw = (raw_input or "").strip()
    if not raw:
        return None
    try:
        u = urlparse(raw if raw.startswith("http") else f"https://{raw}")
    except ValueError:
        return None
    host = (u.hostname or "").lower().removeprefix("www.")
    if host != "github.com":
        return None
    parts = [p for p in (u.path or "").strip("/").split("/") if p]
    if len(parts) < 2:
        return None
    owner, repo = parts[0], parts[1]
    if repo.endswith(".git"):
        repo = repo[:-4]
    return ParsedRepo(
        owner=owner,
        repo=repo,
        html_url=f"https://github.com/{owner}/{repo}",
    )
