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

from dotenv import load_dotenv
from llm.schemas import PlannerOutput

logger = logging.getLogger("drishti.llm.gateway")

class LLMGateway:
    """Gateway for structured LLM completion with caching and offline replay support."""

    def __init__(self, cache_dir: str | None = None):
        # Load environment variables from .env and .env.local
        load_dotenv(".env")
        load_dotenv(".env.local")

        groq_key = os.getenv("GROQ_API_KEY", "").strip()
        openai_key = os.getenv("LLM_API_KEY", "").strip()

        # Prioritize Groq
        if groq_key or os.getenv("LLM_PROVIDER", "").lower() == "groq":
            self.provider = "groq"
            self.api_key = groq_key or openai_key
            self.base_url = os.getenv("LLM_BASE_URL", "https://api.groq.com/openai/v1")
            self.model = os.getenv("LLM_MODEL", "openai/gpt-oss-120b")
            logger.info(f"Initialized LLMGateway with Groq provider: model={self.model}")
        else:
            self.provider = os.getenv("LLM_PROVIDER", "openai").lower()
            self.api_key = openai_key
            self.base_url = os.getenv("LLM_BASE_URL", None)
            self.model = os.getenv("LLM_MODEL", "gpt-4o")
            logger.info(f"Initialized LLMGateway with provider={self.provider}: model={self.model}")

        self.mode = os.getenv("LLM_MODE", "live").lower()  # live, cache, replay
        self.cache_dir = cache_dir or os.getenv("LLM_CACHE_DIR", "./data/llm_cache")
        os.makedirs(self.cache_dir, exist_ok=True)
        self.total_tokens_used = 0

    def _cache_key(self, prompt: str) -> str:
        return hashlib.sha256(f"{self.provider}:{self.model}:{prompt}".encode("utf-8")).hexdigest()

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
                client_kwargs = {"api_key": self.api_key}
                if self.base_url:
                    client_kwargs["base_url"] = self.base_url

                client = AsyncOpenAI(**client_kwargs)

                response = await client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {
                            "role": "system",
                            "content": (
                                "You are DRISHTI AI, an autonomous QA test planner. "
                                "Analyze the discovered web application model and produce executable test scenarios. "
                                "Return ONLY valid JSON matching this schema:\n"
                                "{\n"
                                '  "journeys": ["Journey Name 1", "Journey Name 2"],\n'
                                '  "scenarios": [\n'
                                "    {\n"
                                '      "id": "sc_01",\n'
                                '      "journey": "Journey Name",\n'
                                '      "scenario_class": "happy",\n'
                                '      "steps": [\n'
                                '        {"n": 1, "action": "goto", "target": "/"},\n'
                                '        {"n": 2, "action": "click", "target": "#button-selector"},\n'
                                '        {"n": 3, "action": "fill", "target": "#input-selector", "value": "test-data"}\n'
                                "      ],\n"
                                '      "assertions": [\n'
                                '        {"id": "a_01", "type": "element_visible", "args": {"selector": "#target"}}\n'
                                "      ]\n"
                                "    }\n"
                                "  ]\n"
                                "}\n"
                                "Allowed actions: goto, click, fill, select, check, press, reload, back, wait_for.\n"
                                "Allowed scenario_class: happy, validation, boundary, negative, state."
                            ),
                        },
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
