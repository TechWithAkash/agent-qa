"""
Tests API — GET /tests/{id}, GET /runs/{id}/tests.zip, POST /test-runs.
"""

import io
import os
import zipfile

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse

router = APIRouter(tags=["tests"])

ARTIFACT_DIR = os.getenv("ARTIFACT_DIR", "./data/artifacts")


@router.get("/tests/{test_id}")
async def get_test(test_id: str, request: Request):
    """Download a single generated test file."""
    db = request.app.state.db
    doc = await db.regression_tests.find_one({"_id": test_id})
    if not doc:
        raise HTTPException(status_code=404, detail={"error": {"code": "not_found", "message": "Test not found."}})

    file_path = os.path.join(ARTIFACT_DIR, doc.get("path", ""))
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail={"error": {"code": "file_missing", "message": "Test file not found on disk."}})

    with open(file_path, "r") as f:
        content = f.read()

    return {"test_id": test_id, "path": doc.get("path"), "content": content, "status": doc.get("status")}


@router.get("/runs/{run_id}/tests.zip")
async def download_tests_zip(run_id: str, request: Request):
    """Download all generated tests for a run as a ZIP archive."""
    db = request.app.state.db

    cursor = db.regression_tests.find({"run_id": run_id})
    tests = []
    async for doc in cursor:
        tests.append(doc)

    if not tests:
        raise HTTPException(status_code=404, detail={"error": {"code": "not_found", "message": "No tests found for this run."}})

    # Build ZIP in memory
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        for t in tests:
            file_path = os.path.join(ARTIFACT_DIR, t.get("path", ""))
            if os.path.isfile(file_path):
                arcname = os.path.basename(t["path"])
                zf.write(file_path, arcname)

    buf.seek(0)
    return StreamingResponse(
        buf,
        media_type="application/zip",
        headers={"Content-Disposition": f"attachment; filename=drishti_tests_{run_id}.zip"},
    )


@router.post("/test-runs", status_code=202)
async def create_test_run(request: Request):
    """Replay saved tests against a build_label."""
    # TODO: Create a test-run job for the runner
    return {"message": "Test run queued."}
