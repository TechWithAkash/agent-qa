"""
Pydantic schemas for the DRISHTI AI API.

These schemas define the request/response contracts for the REST API (Section 14)
and the internal data models stored in MongoDB (Section 13).
"""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, HttpUrl


# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------

class RunMode(str, Enum):
    safe = "safe"
    sandbox = "sandbox"


class RunStatus(str, Enum):
    queued = "queued"
    preflight = "preflight"
    exploring = "exploring"
    planning = "planning"
    executing = "executing"
    validating = "validating"
    reporting = "reporting"
    codifying = "codifying"
    verifying = "verifying"
    completed = "completed"
    completed_partial = "completed_partial"
    needs_human = "needs_human"
    cancelled = "cancelled"
    failed = "failed"


class FindingStatus(str, Enum):
    confirmed = "confirmed"
    suspected = "suspected"
    inconclusive = "inconclusive"
    rejected = "rejected"


class Severity(str, Enum):
    high = "high"
    medium = "medium"
    low = "low"


class TestKind(str, Enum):
    journey = "journey"
    bug = "bug"


class TestStatus(str, Enum):
    reliable = "reliable"
    unstable = "unstable"
    flaky = "flaky"


# ---------------------------------------------------------------------------
# Request schemas
# ---------------------------------------------------------------------------

class AuthorizationAttestation(BaseModel):
    confirmed: bool
    statement: str


class RunLimits(BaseModel):
    max_pages: int = Field(default=30, ge=1, le=100)
    max_actions: int = Field(default=150, ge=1, le=500)
    max_scenarios: int = Field(default=25, ge=1, le=100)
    explore_minutes: int = Field(default=10, ge=1, le=30)


class GuidedInput(BaseModel):
    journeys: list[str] = Field(default_factory=list)


class CreateRunRequest(BaseModel):
    """POST /api/runs — Section 14."""
    target_url: str
    description: str = ""
    mode: RunMode = RunMode.safe
    authorization: AuthorizationAttestation
    credentials: Optional[dict] = None
    limits: RunLimits = Field(default_factory=RunLimits)
    destructive_allowlist: list[str] = Field(default_factory=list)
    guided: GuidedInput = Field(default_factory=GuidedInput)
    build_label: Optional[str] = None


class HumanInputRequest(BaseModel):
    """POST /api/runs/{id}/human-input."""
    decision: str  # "skip" | "provide_credentials"
    credentials: Optional[dict] = None


class FindingResolutionRequest(BaseModel):
    """POST /api/findings/{id}/resolution."""
    status: str  # "open" | "resolved" | "wont_fix"


class CreateBenchmarkRequest(BaseModel):
    """POST /api/benchmarks."""
    bug_set: str = "all"
    run_count: int = Field(default=5, ge=1, le=20)


# ---------------------------------------------------------------------------
# Response schemas
# ---------------------------------------------------------------------------

class CreateRunResponse(BaseModel):
    run_id: str
    status: RunStatus
    events_url: str


class RunStatusResponse(BaseModel):
    run_id: str
    status: RunStatus
    stage: Optional[str] = None
    stats: Optional[dict] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class RunEvent(BaseModel):
    seq: int
    ts: datetime
    stage: Optional[str] = None
    level: str = "info"
    type: str
    message: str
    data: dict = Field(default_factory=dict)


class EventsResponse(BaseModel):
    status: RunStatus
    stage: Optional[str] = None
    counters: Optional[dict] = None
    events: list[RunEvent]
    next_after: int


class FindingSummary(BaseModel):
    id: str
    status: FindingStatus
    title: str
    route: Optional[str] = None
    suggested_severity: Optional[Severity] = None
    origin: str = "discovered"


class FindingDetail(BaseModel):
    """Full bug report — Section 8.8."""
    id: str
    status: FindingStatus
    title: str
    origin: str = "discovered"
    suggested_severity: Optional[Severity] = None
    route: Optional[str] = None
    steps_to_reproduce: list[str] = Field(default_factory=list)
    expected: Optional[dict] = None
    actual: Optional[dict] = None
    failed_assertions: list[str] = Field(default_factory=list)
    replay: Optional[dict] = None
    evidence: Optional[dict] = None
    build_label: Optional[str] = None
    browser: str = "chromium"
    hypothesis: Optional[str] = None
    recurrence: Optional[dict] = None
    regression_test: Optional[str] = None


class ErrorResponse(BaseModel):
    error: dict  # {"code": "...", "message": "..."}
