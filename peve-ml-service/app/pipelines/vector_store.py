from __future__ import annotations

import hashlib
import json
import sqlite3
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import numpy as np


@dataclass(slots=True)
class StoredNeighbor:
    repo_url: str
    title: str
    tagline: str
    category: str
    peve_score_ml: float
    similarity: float
    updated_at: str


class RepositoryVectorStore:
    """Tiny persistent embedding store for privacy-preserving semantic search.

    Stores embeddings, distilled metadata, and lightweight training rows in SQLite.
    No raw source code is persisted.
    """

    def __init__(self, db_path: str | Path) -> None:
        self.path = Path(db_path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self._ensure_schema()

    @staticmethod
    def _hash_repo_url(repo_url: str) -> str:
        return hashlib.sha256(repo_url.strip().lower().encode("utf-8")).hexdigest()

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.path)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode=WAL")
        conn.execute("PRAGMA synchronous=NORMAL")
        return conn

    def _ensure_schema(self) -> None:
        with self._connect() as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS repo_embeddings (
                  repo_hash TEXT PRIMARY KEY,
                  repo_url TEXT NOT NULL,
                  title TEXT NOT NULL,
                  tagline TEXT NOT NULL,
                  category TEXT NOT NULL,
                  peve_score_ml REAL NOT NULL,
                  embedding BLOB NOT NULL,
                  feature_json TEXT NOT NULL,
                  intelligence_json TEXT NOT NULL,
                  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
                )
                """
            )
            conn.execute("CREATE INDEX IF NOT EXISTS idx_repo_embeddings_url ON repo_embeddings(repo_url)")

    @staticmethod
    def _vector_to_blob(vector: np.ndarray) -> bytes:
        arr = np.asarray(vector, dtype=np.float32).ravel()
        return arr.tobytes()

    @staticmethod
    def _blob_to_vector(blob: bytes) -> np.ndarray:
        return np.frombuffer(blob, dtype=np.float32)

    def upsert_analysis(
        self,
        *,
        repo_url: str,
        title: str,
        tagline: str,
        category: str,
        peve_score_ml: float,
        embedding: np.ndarray,
        feature_row: dict[str, Any],
        intelligence: dict[str, Any],
    ) -> None:
        repo_hash = self._hash_repo_url(repo_url)
        with self._connect() as conn:
            conn.execute(
                """
                INSERT INTO repo_embeddings (
                  repo_hash, repo_url, title, tagline, category, peve_score_ml,
                  embedding, feature_json, intelligence_json, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(repo_hash) DO UPDATE SET
                  repo_url=excluded.repo_url,
                  title=excluded.title,
                  tagline=excluded.tagline,
                  category=excluded.category,
                  peve_score_ml=excluded.peve_score_ml,
                  embedding=excluded.embedding,
                  feature_json=excluded.feature_json,
                  intelligence_json=excluded.intelligence_json,
                  updated_at=CURRENT_TIMESTAMP
                """,
                (
                    repo_hash,
                    repo_url,
                    title,
                    tagline,
                    category,
                    float(peve_score_ml),
                    self._vector_to_blob(embedding),
                    json.dumps(feature_row, ensure_ascii=False),
                    json.dumps(intelligence, ensure_ascii=False),
                ),
            )

    def fetch_training_rows(self, limit: int = 1000) -> list[dict[str, Any]]:
        with self._connect() as conn:
            rows = conn.execute(
                """
                SELECT feature_json, peve_score_ml, intelligence_json
                FROM repo_embeddings
                ORDER BY updated_at DESC
                LIMIT ?
                """,
                (limit,),
            ).fetchall()

        out: list[dict[str, Any]] = []
        for row in rows:
            try:
                features = json.loads(row["feature_json"])
                if isinstance(features, dict):
                    features = dict(features)
                    features["label"] = float(row["peve_score_ml"])
                    out.append(features)
            except Exception:
                continue
        return out

    def search_similar(
        self,
        embedding: np.ndarray,
        *,
        limit: int = 3,
        exclude_repo_url: str | None = None,
    ) -> list[StoredNeighbor]:
        query = "SELECT repo_url, title, tagline, category, peve_score_ml, embedding, updated_at FROM repo_embeddings"
        with self._connect() as conn:
            rows = conn.execute(query).fetchall()

        if not rows:
            return []

        vec = np.asarray(embedding, dtype=np.float32).ravel()
        vec_norm = float(np.linalg.norm(vec) + 1e-9)
        results: list[StoredNeighbor] = []
        for row in rows:
            repo_url = str(row["repo_url"])
            if exclude_repo_url and repo_url.strip().lower() == exclude_repo_url.strip().lower():
                continue
            other = self._blob_to_vector(row["embedding"])
            denom = float((np.linalg.norm(other) + 1e-9) * vec_norm)
            if denom <= 0:
                continue
            similarity = float(np.clip(np.dot(vec, other) / denom, -1.0, 1.0))
            results.append(
                StoredNeighbor(
                    repo_url=repo_url,
                    title=str(row["title"]),
                    tagline=str(row["tagline"]),
                    category=str(row["category"]),
                    peve_score_ml=float(row["peve_score_ml"]),
                    similarity=max(0.0, similarity),
                    updated_at=str(row["updated_at"]),
                )
            )

        results.sort(key=lambda item: item.similarity, reverse=True)
        return results[:limit]