from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    host: str = "0.0.0.0"
    port: int = 8090
    redis_url: str | None = None
    cache_ttl_seconds: int = 3600
    embedding_store_path: str = "data/repository_embeddings.sqlite3"
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    summarizer_model: str = "sshleifer/distilbart-cnn-12-6"
    skip_summarization: bool = False
    extractive_summary_fallback: bool = False
    embedding_encode_batch_size: int = 32
    """Skip Matplotlib language chart (saves RAM on 512Mi-class hosts)."""
    skip_language_chart: bool = False
    """Cap rows read for semantic neighbor search (full table scan OOMs at scale)."""
    neighbor_search_pool: int = 600
    api_key: str | None = None

    @field_validator("api_key", "redis_url", mode="before")
    @classmethod
    def empty_str_to_none(cls, v: object) -> object:
        if v == "":
            return None
        return v


@lru_cache
def get_settings() -> Settings:
    return Settings()
