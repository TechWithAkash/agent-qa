"""
Runs API — POST /runs, GET /runs/{id}, GET /runs/{id}/events, etc.
Section 14 of the Technical Architecture.
"""

from datetime import datetime, timezone
from uuid import uuid4

from fastapi import APIRouter, HTTPException, Request

from app.schemas import (
    CreateRunRequest,
    CreateRunResponse,
    EventsResponse,
    HumanInputRequest,
    RunStatus,
    RunStatusResponse,
)

router = APIRouter(tags=["runs"])


def _make_id(prefix: str = "run") -> str:
    return f"{prefix}_{uuid4().hex[:12]}"


@router.post("/runs", status_code=202, response_model=CreateRunResponse)
async def create_run(body: CreateRunRequest, request: Request):
    """Create and queue a new test run."""
    db = request.app.state.db

    # SEC-1: Authorization attestation required
    if not body.authorization.confirmed:
        raise HTTPException(
            status_code=422,
            detail={"error": {"code": "attestation_required", "message": "Authorization attestation must be confirmed."}},
        )

    # TODO (M5-2): Full URL validation (SEC-2, SEC-3) — DNS, private IP checks
    if not body.target_url.startswith(("http://", "https://")):
        raise HTTPException(
            status_code=422,
            detail={"error": {"code": "invalid_url", "message": "Target URL must use http or https scheme."}},
        )

    run_id = _make_id("run")
    now = datetime.now(timezone.utc)

    run_doc = {
        "_id": run_id,
        "target_url": body.target_url,
        "description": body.description,
        "mode": body.mode.value,
        "status": RunStatus.queued.value,
        "stage": None,
        "config": {
            "limits": body.limits.model_dump(),
            "destructive_allowlist": body.destructive_allowlist,
            "guided": body.guided.model_dump(),
        },
        "build_label": body.build_label,
        "authorization": body.authorization.model_dump(),
        "credentials": None,  # SEC-11: credentials stay in memory, never persisted
        "stats": {
            "states": 0,
            "scenarios": 0,
            "findings_by_status": {},
            "llm_calls": 0,
            "tokens": 0,
            "wall_ms": 0,
        },
        "created_at": now,
        "updated_at": now,
    }

    # Create the job for the runner to pick up
    job_doc = {
        "_id": _make_id("job"),
        "run_id": run_id,
        "status": "queued",
        "lease_until": None,
        "heartbeat_at": None,
        "attempt": 0,
        "stage": None,
        "cancel_requested": False,
    }

    await db.runs.insert_one(run_doc)
    await db.jobs.insert_one(job_doc)

    # Audit log — SEC-15
    await db.audit_log.insert_one({
        "ts": now,
        "actor": "api",
        "action": "create_run",
        "run_id": run_id,
        "target": body.target_url,
        "attestation": body.authorization.model_dump(),
    })

    return CreateRunResponse(
        run_id=run_id,
        status=RunStatus.queued,
        events_url=f"/api/runs/{run_id}/events?after=0",
    )


@router.get("/runs/{run_id}", response_model=RunStatusResponse)
async def get_run(run_id: str, request: Request):
    """Get run status and counters."""
    db = request.app.state.db
    run = await db.runs.find_one({"_id": run_id})
    if not run:
        raise HTTPException(status_code=404, detail={"error": {"code": "not_found", "message": "Run not found."}})

    return RunStatusResponse(
        run_id=run["_id"],
        status=run["status"],
        stage=run.get("stage"),
        stats=run.get("stats"),
        created_at=run.get("created_at"),
        updated_at=run.get("updated_at"),
    )


@router.get("/runs/{run_id}/events", response_model=EventsResponse)
async def get_events(run_id: str, after: int = 0, request: Request = None):
    """Get progress events after a cursor. Section 12.2."""
    db = request.app.state.db

    run = await db.runs.find_one({"_id": run_id}, {"status": 1, "stage": 1, "stats": 1})
    if not run:
        raise HTTPException(status_code=404, detail={"error": {"code": "not_found", "message": "Run not found."}})

    cursor = db.run_events.find(
        {"run_id": run_id, "seq": {"$gt": after}},
    ).sort("seq", 1).limit(100)

    events = []
    max_seq = after
    async for doc in cursor:
        events.append({
            "seq": doc["seq"],
            "ts": doc["ts"],
            "stage": doc.get("stage"),
            "level": doc.get("level", "info"),
            "type": doc["type"],
            "message": doc["message"],
            "data": doc.get("data", {}),
        })
        max_seq = max(max_seq, doc["seq"])

    return EventsResponse(
        status=run["status"],
        stage=run.get("stage"),
        counters=run.get("stats"),
        events=events,
        next_after=max_seq,
    )


@router.post("/runs/{run_id}/cancel", status_code=200)
async def cancel_run(run_id: str, request: Request):
    """Request cancellation of a run."""
    db = request.app.state.db
    result = await db.jobs.update_one(
        {"run_id": run_id, "status": {"$nin": ["completed", "failed", "cancelled"]}},
        {"$set": {"cancel_requested": True}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail={"error": {"code": "not_found", "message": "Active job not found for this run."}})
    return {"message": "Cancellation requested."}


@router.post("/runs/{run_id}/human-input", status_code=200)
async def submit_human_input(run_id: str, body: HumanInputRequest, request: Request):
    """Supply credentials or a decision for a needs_human run."""
    db = request.app.state.db
    run = await db.runs.find_one({"_id": run_id, "status": "needs_human"})
    if not run:
        raise HTTPException(status_code=404, detail={"error": {"code": "not_found", "message": "Run not in needs_human state."}})

    # Store the human input for the runner to pick up
    await db.runs.update_one(
        {"_id": run_id},
        {"$set": {"human_input": body.model_dump(), "updated_at": datetime.now(timezone.utc)}},
    )
    return {"message": "Human input received."}


@router.get("/runs/{run_id}/model")
async def get_app_model(run_id: str, request: Request):
    """Get the Application Model for a run. Section 5.7."""
    db = request.app.state.db
    model = await db.app_models.find_one({"run_id": run_id})
    if not model:
        raise HTTPException(status_code=404, detail={"error": {"code": "not_found", "message": "Application model not found. Run may still be exploring."}})
    model.pop("_id", None)
    return model


@router.get("/runs/{run_id}/scenarios")
async def get_scenarios(run_id: str, request: Request):
    """Get planned scenarios and their outcomes."""
    db = request.app.state.db
    cursor = db.scenarios.find({"run_id": run_id})
    scenarios = []
    async for doc in cursor:
        doc.pop("_id", None)
        scenarios.append(doc)
    return {"scenarios": scenarios}
