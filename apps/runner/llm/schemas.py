"""
Pydantic schemas for LLM inputs and outputs.
Section 6 of the Technical Architecture.
"""

from typing import Any, Literal
from pydantic import BaseModel, Field, field_validator

class AssertionSpec(BaseModel):
    id: str = "a_01"
    type: str = "element_visible"  # url_matches, element_visible, text_contains, no_page_errors, etc.
    args: dict[str, Any] = Field(default_factory=dict)
    source: Literal["description", "ui_contract", "convention", "llm_inference"] = "description"
    evidence_quote: str = ""
    rationale: str = ""

    @field_validator("source", mode="before")
    @classmethod
    def normalize_source(cls, v: Any) -> str:
        if v not in ("description", "ui_contract", "convention", "llm_inference"):
            return "llm_inference"
        return str(v)

class StepSpec(BaseModel):
    n: int = 1
    action: Literal["goto", "click", "fill", "select", "check", "press", "reload", "back", "wait_for"] = "goto"
    target: str | None = None
    ref: str | None = None
    value: str | None = None
    value_spec: dict[str, Any] | None = None

    @field_validator("action", mode="before")
    @classmethod
    def normalize_action(cls, v: Any) -> str:
        val = str(v).lower().strip()
        mapping = {
            "navigate": "goto",
            "open": "goto",
            "visit": "goto",
            "type": "fill",
            "input": "fill",
            "enter": "fill",
            "tap": "click",
            "press_key": "press",
            "hover": "wait_for",
            "wait": "wait_for",
        }
        return mapping.get(val, val if val in ("goto", "click", "fill", "select", "check", "press", "reload", "back", "wait_for") else "goto")

class ScenarioPlan(BaseModel):
    id: str = "sc_01"
    journey: str = "General Journey"
    scenario_class: Literal["happy", "validation", "boundary", "negative", "state"] = "happy"
    preconditions: list[str] = Field(default_factory=list)
    steps: list[StepSpec] = Field(default_factory=list)
    assertions: list[AssertionSpec] = Field(default_factory=list)

    @field_validator("scenario_class", mode="before")
    @classmethod
    def normalize_class(cls, v: Any) -> str:
        val = str(v).lower().strip()
        if val not in ("happy", "validation", "boundary", "negative", "state"):
            return "happy"
        return val

    @field_validator("steps", mode="after")
    @classmethod
    def ensure_step_numbers(cls, steps: list[StepSpec]) -> list[StepSpec]:
        for i, st in enumerate(steps, 1):
            if not st.n or st.n <= 0:
                st.n = i
        return steps

class PlannerOutput(BaseModel):
    journeys: list[str] = Field(default_factory=list)
    scenarios: list[ScenarioPlan] = Field(default_factory=list)
