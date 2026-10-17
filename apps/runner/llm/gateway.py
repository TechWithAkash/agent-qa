"""
LLM Gateway with schema validation, cache, retry, and token accounting.
Section 3.3 and Section 6 of the Technical Architecture.
"""

import hashlib
import json
import logging
import os
from typing import Any
from pydantic import ValidationError

from llm.schemas import PlannerOutput

logger = logging.getLogger("drishti.llm.gateway")

class LLMGateway:
    """Gateway for structured LLM completion with caching and offline replay support."""

    def __init__(self, cache_dir: str | None = None):
        self.api_key = os.getenv("LLM_API_KEY", "")
        self.provider = os.getenv("LLM_PROVIDER", "openai").lower()
        self.model = os.getenv("LLM_MODEL", "gpt-4o")
        self.mode = os.getenv("LLM_MODE", "live").lower()  # live, cache, replay
        self.cache_dir = cache_dir or os.getenv("LLM_CACHE_DIR", "./data/llm_cache")
        os.makedirs(self.cache_dir, exist_ok=True)
        self.total_tokens_used = 0

    def _cache_key(self, prompt: str) -> str:
        return hashlib.sha256(f"{self.model}:{prompt}".encode("utf-8")).hexdigest()

    async def generate_plan(self, prompt: str) -> PlannerOutput | None:
        """Call LLM with structured output or retrieve from cache."""
        ckey = self._cache_key(prompt)
        cache_path = os.path.join(self.cache_dir, f"{ckey}.json")

        # Cache check
        if os.path.exists(cache_path) and self.mode in ("cache", "replay", "live"):
            try:
                with open(cache_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    logger.info(f"LLM cache hit: {ckey[:8]}")
                    return PlannerOutput.model_validate(data)
            except Exception as e:
                logger.warning(f"Error reading LLM cache: {e}")

        # Live call if API key exists
        if self.api_key and self.mode != "replay":
            try:
                from openai import AsyncOpenAI
                client = AsyncOpenAI(api_key=self.api_key)

                response = await client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "You are DRISHTI AI, an autonomous QA test planner. Return ONLY valid JSON matching the PlannerOutput schema."},
                        {"role": "user", "content": prompt},
                    ],
                    response_format={"type": "json_object"},
                    temperature=0.1,
                )

                content = response.choices[0].message.content or "{}"
                if response.usage:
                    self.total_tokens_used += response.usage.total_tokens

                parsed_json = json.loads(content)
                plan = PlannerOutput.model_validate(parsed_json)

                # Save to cache
                with open(cache_path, "w", encoding="utf-8") as f:
                    json.dump(plan.model_dump(), f, indent=2)

                return plan

            except Exception as e:
                logger.error(f"Live LLM call failed: {e}")

        logger.info("Falling back to deterministic heuristic scenario planning")
        return None
