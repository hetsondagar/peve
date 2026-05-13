from typing import Literal

from pydantic import BaseModel, Field


class RepositorySignals(BaseModel):
    """Public metadata + README excerpt only — no full source tree."""

    repo_url: str = Field(..., description="Canonical GitHub HTML URL")
    readme_excerpt: str = ""
    description: str = ""
    languages: dict[str, int] = Field(default_factory=dict)
    topics: list[str] = Field(default_factory=list)
    stars: int = 0
    forks: int = 0
    open_issues: int = 0
    default_branch: str = "main"
    key_features: list[str] = Field(default_factory=list)
    tech_stack: list[str] = Field(default_factory=list)
    category: str = ""
    difficulty_level: str = ""
    development_stage: str = ""
    commit_messages_sample: str = ""


class ScoreBreakdown(BaseModel):
    architecture: float
    documentation: float
    stack_breadth: float
    community: float
    innovation: float


class SemanticNeighbor(BaseModel):
    repo_url: str
    title: str
    tagline: str
    category: str
    peve_score_ml: float
    similarity: float = Field(..., description="Cosine similarity to the current repository")
    updated_at: str


class ArchitectureSpacePoint(BaseModel):
    """2D PCA of SentenceTransformer vectors — topics, tech, repo + semantic anchors."""

    label: str
    x: float
    y: float
    kind: Literal["repo", "topic", "tech", "anchor"] = "tech"


class RepositoryIntelligenceResponse(BaseModel):
    peve_score_ml: float = Field(..., description="Model-assisted score 0–100")
    score_breakdown: ScoreBreakdown
    score_rationale_ml: str
    project_soul: list[str]
    technical_summary: str | None = None
    architecture_hints: list[str]
    embedding_projection: list[float] = Field(
        default_factory=list,
        description="8-dim PCA-style projection for UI (not full embedding)",
    )
    architecture_space: list[ArchitectureSpacePoint] = Field(
        default_factory=list,
        description="PCA 2D map of repo + topic + tech embeddings vs semantic anchors (real ML)",
    )
    chart_language_mix_png_base64: str | None = None
    semantic_neighbors: list[SemanticNeighbor] = Field(default_factory=list)
    model_versions: dict[str, str] = Field(default_factory=dict)
