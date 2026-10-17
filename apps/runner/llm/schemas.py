"""
Pydantic schemas for LLM inputs and outputs.
Section 6 of the Technical Architecture.
"""

from typing import Any, Literal
from pydantic import BaseModel, Field

class AssertionSpec(BaseModel):
    id: str
    type: str  # url_matches, element_visible, text_contains, no_page_errors, etc.
    args: dict[str, Any] = Field(default_factory=dict)
    source: Literal["description", "ui_contract", "convention", "llm_inference"] = "description"
    evidence_quote: str = ""
    rationale: str = ""

class StepSpec(BaseModel):
    n: int
    action: Literal["goto", "click", "fill", "select", "check", "press", "reload", "back", "wait_for"]
    target: str | None = None
    ref: str | None = None
    value: str | None = None
    value_spec: dict[str, Any] | None = None

class ScenarioPlan(BaseModel):
    id: str
    journey: str
    scenario_class: Literal["happy", "validation", "boundary", "negative", "state"]
    preconditions: list[str] = Field(default_factory=list)
    steps: list[StepSpec]
    assertions: list[AssertionSpec]

class PlannerOutput(BaseModel):
    journeys: list[str]
    scenarios: list[ScenarioPlan]
