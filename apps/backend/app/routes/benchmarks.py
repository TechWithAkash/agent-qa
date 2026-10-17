"""
Benchmarks API — POST /benchmarks, GET /benchmarks/{id}.
"""

from fastapi import APIRouter, HTTPException, Request

from app.schemas import CreateBenchmarkRequest

router = APIRouter(tags=["benchmarks"])


@router.post("/benchmarks", status_code=202)
async def create_benchmark(body: CreateBenchmarkRequest, request: Request):
    """Start a benchmark run against ShopLite. Section 16."""
    # TODO: Create benchmark job(s) for the runner
    return {"message": "Benchmark queued.", "bug_set": body.bug_set, "run_count": body.run_count}


@router.get("/benchmarks/{benchmark_id}")
async def get_benchmark(benchmark_id: str, request: Request):
    """Get benchmark scorecard."""
    db = request.app.state.db
    doc = await db.benchmark_results.find_one({"_id": benchmark_id})
    if not doc:
        raise HTTPException(status_code=404, detail={"error": {"code": "not_found", "message": "Benchmark not found."}})
    doc.pop("_id", None)
    return doc
