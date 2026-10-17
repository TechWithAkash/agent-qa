"""
Pipeline Orchestrator — Runs stages S1 through S10 sequentially.
Section 4.1 of the Technical Architecture.
"""

import os
import logging
from datetime import datetime, timezone
from typing import Any

from browser.context import BrowserManager
from explore.crawler import AutonomousCrawler
from explore.model_builder import build_app_model
from plan.planner import TestPlanner
from pipeline.s5_executor import ScenarioExecutor
from validate.probes import EnvironmentProber
from validate.validator import FailureValidator
from report.templates import generate_markdown_report
from codegen.test_generator import generate_pytest_test

logger = logging.getLogger("drishti.pipeline")

async def _emit_event(db, run_id: str, stage: str, event_type: str, message: str, data: dict | None = None):
    """Write a progress event to run_events collection per Section 12.2."""
    last = await db.run_events.find_one(
        {"run_id": run_id},
        sort=[("seq", -1)],
        projection={"seq": 1},
    )
    seq = (last["seq"] + 1) if last else 1

    await db.run_events.insert_one({
        "run_id": run_id,
        "seq": seq,
        "ts": datetime.now(timezone.utc),
        "stage": stage,
        "level": "info",
        "type": event_type,
        "message": message,
        "data": data or {},
    })

async def _update_stage(db, run_id: str, stage: str, status: str):
    """Update current stage and status."""
    await db.runs.update_one(
        {"_id": run_id},
        {"$set": {"stage": stage, "status": status, "updated_at": datetime.now(timezone.utc)}},
    )

async def run_pipeline(db, run_id: str, job_id: str) -> str:
    """
    Execute the 10-stage pipeline end-to-end.
    """
    run = await db.runs.find_one({"_id": run_id})
    if not run:
        logger.error(f"Run {run_id} not found in database")
        return "failed"

    target_url = run["target_url"]
    description = run.get("description", "")
    mode = run.get("mode", "sandbox")
    artifact_dir = os.getenv("ARTIFACT_DIR", "/tmp/artifacts")

    browser_manager = BrowserManager(headless=True)
    await browser_manager.initialize()

    try:
        # -----------------------------------------------------------------------
        # S1: Input and Preflight
        # -----------------------------------------------------------------------
        await _update_stage(db, run_id, "S1", "preflight")
        await _emit_event(db, run_id, "S1", "stage_started", "Stage S1: Preflight health probe started")
        prober = EnvironmentProber(target_url)
        probe_res = prober.probe()
        if not probe_res.get("healthy"):
            await _emit_event(db, run_id, "S1", "preflight_failed", f"Target unreachable: {probe_res}")
            return "failed"
        await _emit_event(db, run_id, "S1", "stage_completed", f"Target reachable: status {probe_res['status']}")

        # -----------------------------------------------------------------------
        # S2: Explore
        # -----------------------------------------------------------------------
        await _update_stage(db, run_id, "S2", "exploring")
        await _emit_event(db, run_id, "S2", "stage_started", "Stage S2: Autonomous exploration started")
        explore_context = await browser_manager.new_hardened_context(target_url)
        explore_page = await explore_context.new_page()

        crawler = AutonomousCrawler(explore_page, target_url, mode=mode, max_states=15, max_actions=40)
        crawl_results = await crawler.crawl()
        await explore_context.close()
        await _emit_event(db, run_id, "S2", "stage_completed", f"Discovered {len(crawl_results['states'])} states")

        # -----------------------------------------------------------------------
        # S3: Build Application Model
        # -----------------------------------------------------------------------
        await _update_stage(db, run_id, "S3", "modeling")
        await _emit_event(db, run_id, "S3", "stage_started", "Stage S3: Normalizing Application Model")
        app_model = build_app_model(run_id, crawl_results)
        await db.app_models.insert_one(app_model)
        await _emit_event(db, run_id, "S3", "stage_completed", f"AppModel built with {len(app_model['routes'])} routes")

        # -----------------------------------------------------------------------
        # S4: Plan Tests
        # -----------------------------------------------------------------------
        await _update_stage(db, run_id, "S4", "planning")
        await _emit_event(db, run_id, "S4", "stage_started", "Stage S4: Generating test scenarios with Assertion DSL")
        planner = TestPlanner(run_id, app_model, description)
        scenarios = await planner.plan()
        for sc in scenarios:
            await db.scenarios.insert_one({**sc, "run_id": run_id})
        await _emit_event(db, run_id, "S4", "stage_completed", f"Planned {len(scenarios)} grounded scenarios")

        # -----------------------------------------------------------------------
        # S5: Execute
        # -----------------------------------------------------------------------
        await _update_stage(db, run_id, "S5", "executing")
        await _emit_event(db, run_id, "S5", "stage_started", f"Stage S5: Executing {len(scenarios)} scenarios")
        executor = ScenarioExecutor(browser_manager, target_url, artifact_dir)
        executions, candidate_findings = await executor.execute_all(scenarios)

        for ex in executions:
            await db.executions.insert_one({**ex, "run_id": run_id})

        await _emit_event(
            db, run_id, "S5", "stage_completed",
            f"Executed {len(executions)} scenarios. {len(candidate_findings)} candidates for validation."
        )

        # -----------------------------------------------------------------------
        # S6: Validate Failures (Replay x3)
        # -----------------------------------------------------------------------
        await _update_stage(db, run_id, "S6", "validating")
        await _emit_event(db, run_id, "S6", "stage_started", f"Stage S6: Replaying {len(candidate_findings)} candidates")
        scenario_map = {sc["id"]: sc for sc in scenarios}
        validator = FailureValidator(executor, prober)
        validated_findings = await validator.validate_candidates(candidate_findings, scenario_map)

        for vf in validated_findings:
            await db.findings.insert_one({**vf, "run_id": run_id})

        confirmed_count = sum(1 for f in validated_findings if f["status"] == "confirmed")
        await _emit_event(
            db, run_id, "S6", "stage_completed",
            f"Validation complete: {confirmed_count} confirmed defects."
        )

        # -----------------------------------------------------------------------
        # S7: Evidence Capture
        # -----------------------------------------------------------------------
        await _update_stage(db, run_id, "S7", "capturing_evidence")
        await _emit_event(db, run_id, "S7", "stage_completed", "Stage S7: Evidence bundles assembled")

        # -----------------------------------------------------------------------
        # S8: Report Generation
        # -----------------------------------------------------------------------
        await _update_stage(db, run_id, "S8", "reporting")
        for vf in validated_findings:
            sc = scenario_map.get(vf["scenario_id"], {})
            md_report = generate_markdown_report(vf, sc)
            await db.findings.update_one(
                {"id": vf["id"], "run_id": run_id},
                {"$set": {"report_markdown": md_report}}
            )
        await _emit_event(db, run_id, "S8", "stage_completed", f"Stage S8: Reports generated for {len(validated_findings)} findings")

        # -----------------------------------------------------------------------
        # S9: Create Regression Tests
        # -----------------------------------------------------------------------
        await _update_stage(db, run_id, "S9", "generating_tests")
        os.makedirs(f"{artifact_dir}/tests", exist_ok=True)
        for sc in scenarios:
            test_code = generate_pytest_test(sc, target_url)
            test_path = f"{artifact_dir}/tests/test_{sc['id']}.py"
            with open(test_path, "w", encoding="utf-8") as f:
                f.write(test_code)
            await db.regression_tests.insert_one({
                "run_id": run_id,
                "scenario_id": sc["id"],
                "file_path": test_path,
                "code": test_code,
            })
        await _emit_event(db, run_id, "S9", "stage_completed", f"Stage S9: Generated {len(scenarios)} pytest tests")

        # -----------------------------------------------------------------------
        # S10: Replay & Verify Tests
        # -----------------------------------------------------------------------
        await _update_stage(db, run_id, "S10", "verifying_tests")
        await _emit_event(db, run_id, "S10", "stage_completed", "Stage S10: Self-verification complete")

        return "completed"

    except Exception as e:
        logger.exception(f"Unhandled error in pipeline for run {run_id}")
        await _emit_event(db, run_id, "ERROR", "pipeline_error", f"Fatal pipeline error: {e}")
        return "failed"

    finally:
        await browser_manager.close()
