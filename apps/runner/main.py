"""
DRISHTI AI — Runner Entry Point

The runner claims jobs from the MongoDB queue and executes the 10-stage pipeline:
S1 (Preflight) → S2 (Explore) → S3 (Model) → S4 (Plan) → S5 (Execute) →
S6 (Validate) → S7 (Evidence) → S8 (Report) → S9 (Codegen) → S10 (Replay)

Section 4 + Section 12 of the Technical Architecture.
"""

import asyncio
import logging
import os
import signal
import sys
from datetime import datetime, timezone, timedelta

from motor.motor_asyncio import AsyncIOMotorClient

from pipeline.orchestrator import run_pipeline

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("drishti.runner")

HEARTBEAT_INTERVAL = 5  # seconds
LEASE_DURATION = 60  # seconds — renewed by heartbeat
POLL_INTERVAL = 2  # seconds between job-claim attempts


class Runner:
    """Single-job runner that claims from the MongoDB queue."""

    def __init__(self):
        mongo_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/drishti")
        self.client = AsyncIOMotorClient(mongo_uri)
        self.db = self.client.get_default_database()
        self._shutdown = False

    async def start(self):
        """Main loop: poll for jobs and run them one at a time."""
        logger.info("Runner started. Polling for jobs...")

        # Handle graceful shutdown
        loop = asyncio.get_event_loop()
        for sig in (signal.SIGINT, signal.SIGTERM):
            loop.add_signal_handler(sig, self._request_shutdown)

        while not self._shutdown:
            job = await self._claim_job()
            if job:
                logger.info(f"Claimed job {job['_id']} for run {job['run_id']}")
                try:
                    await self._execute_job(job)
                except Exception:
                    logger.exception(f"Job {job['_id']} failed with unhandled error")
                    await self._mark_failed(job, "unhandled_error")
            else:
                await asyncio.sleep(POLL_INTERVAL)

        logger.info("Runner shutting down.")
        self.client.close()

    async def _claim_job(self):
        """Atomically claim the oldest queued job. Section 12.2."""
        now = datetime.now(timezone.utc)
        lease_until = now + timedelta(seconds=LEASE_DURATION)

        # Claim: queued jobs, or expired-lease jobs (stale runner)
        result = await self.db.jobs.find_one_and_update(
            {
                "$or": [
                    {"status": "queued"},
                    {"status": {"$nin": ["completed", "failed", "cancelled"]}, "lease_until": {"$lt": now}},
                ],
            },
            {
                "$set": {
                    "status": "claimed",
                    "lease_until": lease_until,
                    "heartbeat_at": now,
                },
                "$inc": {"attempt": 1},
            },
            sort=[("_id", 1)],
            return_document=True,
        )
        return result

    async def _execute_job(self, job: dict):
        """Run the full pipeline for a job. Heartbeat runs in background."""
        run_id = job["run_id"]
        job_id = job["_id"]

        # Start heartbeat task
        heartbeat_task = asyncio.create_task(self._heartbeat_loop(job_id))

        try:
            # Update run status
            await self.db.runs.update_one(
                {"_id": run_id},
                {"$set": {"status": "preflight", "stage": "S1", "updated_at": datetime.now(timezone.utc)}},
            )

            # Run the pipeline
            final_status = await run_pipeline(self.db, run_id, job_id)

            # Update final status
            await self.db.runs.update_one(
                {"_id": run_id},
                {"$set": {"status": final_status, "updated_at": datetime.now(timezone.utc)}},
            )
            await self.db.jobs.update_one(
                {"_id": job_id},
                {"$set": {"status": final_status}},
            )
            logger.info(f"Job {job_id} completed with status: {final_status}")

        except asyncio.CancelledError:
            await self._mark_cancelled(job)
        finally:
            heartbeat_task.cancel()
            try:
                await heartbeat_task
            except asyncio.CancelledError:
                pass

    async def _heartbeat_loop(self, job_id: str):
        """Update heartbeat and lease every HEARTBEAT_INTERVAL seconds."""
        while True:
            await asyncio.sleep(HEARTBEAT_INTERVAL)
            now = datetime.now(timezone.utc)
            await self.db.jobs.update_one(
                {"_id": job_id},
                {"$set": {
                    "heartbeat_at": now,
                    "lease_until": now + timedelta(seconds=LEASE_DURATION),
                }},
            )

    async def _check_cancel(self, job_id: str) -> bool:
        """Check if cancellation was requested."""
        job = await self.db.jobs.find_one({"_id": job_id}, {"cancel_requested": 1})
        return job and job.get("cancel_requested", False)

    async def _mark_failed(self, job: dict, reason: str):
        now = datetime.now(timezone.utc)
        await self.db.runs.update_one(
            {"_id": job["run_id"]},
            {"$set": {"status": "failed", "failure_reason": reason, "updated_at": now}},
        )
        await self.db.jobs.update_one(
            {"_id": job["_id"]},
            {"$set": {"status": "failed"}},
        )

    async def _mark_cancelled(self, job: dict):
        now = datetime.now(timezone.utc)
        await self.db.runs.update_one(
            {"_id": job["run_id"]},
            {"$set": {"status": "cancelled", "updated_at": now}},
        )
        await self.db.jobs.update_one(
            {"_id": job["_id"]},
            {"$set": {"status": "cancelled"}},
        )

    def _request_shutdown(self):
        logger.info("Shutdown requested")
        self._shutdown = True


async def main():
    runner = Runner()
    await runner.start()


if __name__ == "__main__":
    asyncio.run(main())
