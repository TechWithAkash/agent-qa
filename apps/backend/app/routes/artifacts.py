"""
Artifacts API — GET /artifacts/{id}.
SEC-14: Authenticated, path-sanitized, fixed content types, never executed.
"""

import os

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import FileResponse

router = APIRouter(tags=["artifacts"])

ARTIFACT_DIR = os.getenv("ARTIFACT_DIR", "./data/artifacts")

# SEC-14: Fixed content type mapping — never serve as executable
CONTENT_TYPES = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".txt": "text/plain; charset=utf-8",
    ".json": "application/json",
    ".md": "text/markdown; charset=utf-8",
    ".py": "text/plain; charset=utf-8",
    ".zip": "application/zip",
    ".html": "text/plain; charset=utf-8",  # Never serve HTML as renderable
}


@router.get("/artifacts/{artifact_id}")
async def get_artifact(artifact_id: str, request: Request):
    """Serve an artifact file. SEC-14: path-sanitized, fixed content types."""
    db = request.app.state.db
    doc = await db.evidence_artifacts.find_one({"_id": artifact_id})
    if not doc:
        raise HTTPException(status_code=404, detail={"error": {"code": "not_found", "message": "Artifact not found."}})

    rel_path = doc.get("path", "")

    # SEC-14: Path traversal protection
    safe_path = os.path.normpath(os.path.join(ARTIFACT_DIR, rel_path))
    if not safe_path.startswith(os.path.normpath(ARTIFACT_DIR)):
        raise HTTPException(status_code=403, detail={"error": {"code": "path_traversal", "message": "Access denied."}})

    if not os.path.isfile(safe_path):
        raise HTTPException(status_code=404, detail={"error": {"code": "file_missing", "message": "Artifact file not found on disk."}})

    ext = os.path.splitext(safe_path)[1].lower()
    content_type = CONTENT_TYPES.get(ext, "application/octet-stream")

    return FileResponse(
        safe_path,
        media_type=content_type,
        headers={"Content-Disposition": f"inline; filename={os.path.basename(safe_path)}"},
    )
