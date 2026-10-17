"""
Findings API — GET /findings, GET /findings/{id}, POST /findings/{id}/resolution, etc.
"""

from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Request

from app.schemas import FindingDetail, FindingResolutionRequest, FindingSummary

router = APIRouter(tags=["findings"])


@router.get("/runs/{run_id}/findings")
async def list_findings(run_id: str, status: str | None = None, request: Request = None):
    """List findings for a run, optionally filtered by status."""
    db = request.app.state.db
    query = {"run_id": run_id}
    if status:
        query["status"] = status

    cursor = db.findings.find(query)
    findings = []
    async for doc in cursor:
        findings.append(FindingSummary(
            id=doc["_id"],
            status=doc["status"],
            title=doc.get("title", "Untitled finding"),
            route=doc.get("route"),
            suggested_severity=doc.get("suggested_severity"),
            origin=doc.get("origin", "discovered"),
        ))
    return {"findings": findings}


@router.get("/findings/{finding_id}", response_model=FindingDetail)
async def get_finding(finding_id: str, request: Request):
    """Get full bug report with evidence. Section 8.8."""
    db = request.app.state.db
    doc = await db.findings.find_one({"_id": finding_id})
    if not doc:
        raise HTTPException(status_code=404, detail={"error": {"code": "not_found", "message": "Finding not found."}})

    return FindingDetail(
        id=doc["_id"],
        status=doc["status"],
        title=doc.get("title", ""),
        origin=doc.get("origin", "discovered"),
        suggested_severity=doc.get("suggested_severity"),
        route=doc.get("route"),
        steps_to_reproduce=doc.get("steps_to_reproduce", []),
        expected=doc.get("expected"),
        actual=doc.get("actual"),
        failed_assertions=doc.get("failed_assertions", []),
        replay=doc.get("replay"),
        evidence=doc.get("evidence"),
        build_label=doc.get("build_label"),
        browser=doc.get("browser", "chromium"),
        hypothesis=doc.get("hypothesis"),
        recurrence=doc.get("recurrence"),
        regression_test=doc.get("regression_test"),
    )


@router.post("/findings/{finding_id}/replay", status_code=202)
async def queue_replay(finding_id: str, request: Request):
    """Queue a verification replay for a finding."""
    db = request.app.state.db
    doc = await db.findings.find_one({"_id": finding_id})
    if not doc:
        raise HTTPException(status_code=404, detail={"error": {"code": "not_found", "message": "Finding not found."}})

    # TODO: Create a replay job for the runner
    return {"message": "Replay queued.", "finding_id": finding_id}


@router.post("/findings/{finding_id}/resolution", status_code=200)
async def set_resolution(finding_id: str, body: FindingResolutionRequest, request: Request):
    """Human sets finding resolution: open, resolved, wont_fix."""
    db = request.app.state.db
    result = await db.findings.update_one(
        {"_id": finding_id},
        {"$set": {
            "resolution": {"status": body.status, "updated_by": "human", "at": datetime.now(timezone.utc)},
        }},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail={"error": {"code": "not_found", "message": "Finding not found."}})
    return {"message": f"Finding resolution set to {body.status}."}
