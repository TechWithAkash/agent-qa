"""
DRISHTI AI — Backend API

FastAPI application that manages runs, serves findings/artifacts,
and bridges the dashboard to the runner pipeline.
"""

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient

from app.routes import runs, findings, tests, artifacts, benchmarks


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Connect to MongoDB on startup, close on shutdown."""
    mongo_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/drishti")
    app.state.mongo_client = AsyncIOMotorClient(mongo_uri)
    app.state.db = app.state.mongo_client.get_default_database()

    # Ensure indexes
    await app.state.db.run_events.create_index([("run_id", 1), ("seq", 1)])
    await app.state.db.findings.create_index([("run_id", 1), ("status", 1)])
    await app.state.db.failure_records.create_index([("target_id", 1), ("fingerprint", 1)])
    await app.state.db.jobs.create_index([("status", 1), ("lease_until", 1)])

    yield

    app.state.mongo_client.close()


app = FastAPI(
    title="DRISHTI AI",
    description="Autonomous AI QA Engineer — Backend API",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS — allow the frontend in dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        os.getenv("FRONTEND_ORIGIN", "http://localhost:3000"),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount route modules
app.include_router(runs.router, prefix="/api")
app.include_router(findings.router, prefix="/api")
app.include_router(tests.router, prefix="/api")
app.include_router(artifacts.router, prefix="/api")
app.include_router(benchmarks.router, prefix="/api")


@app.get("/api/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok", "service": "drishti-backend"}
