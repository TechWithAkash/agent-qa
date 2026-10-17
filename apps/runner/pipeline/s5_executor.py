"""
S5: Scenario Execution Engine.
Section 7 of the Technical Architecture.
"""

import logging
import urllib.request
from typing import Any
from urllib.parse import urljoin

from browser.context import BrowserManager
from browser.actions import execute_action
from browser.evidence import EvidenceRecorder
from plan.dsl import AssertionEvaluator

logger = logging.getLogger("drishti.pipeline.executor")

class ScenarioExecutor:
    """Executes planned scenarios in isolated contexts and evaluates assertions."""

    def __init__(
        self,
        browser_manager: BrowserManager,
        target_url: str,
        artifact_dir: str = "/tmp/artifacts",
    ):
        self.browser_manager = browser_manager
        self.target_url = target_url
        self.artifact_dir = artifact_dir

    def _reset_target_state(self):
        """Invoke test reset endpoint if available."""
        try:
            reset_url = urljoin(self.target_url, "/__test/reset")
            req = urllib.request.Request(reset_url, method="POST")
            urllib.request.urlopen(req, timeout=3)
        except Exception:
            pass

    async def execute_scenario(self, scenario: dict[str, Any]) -> dict[str, Any]:
        """Execute a single scenario in a fresh hardened context."""
        scenario_id = scenario.get("id", "sc_0")
        logger.info(f"Executing scenario: {scenario_id} ({scenario.get('journey')})")

        # Handle reset precondition
        if "reset_state" in scenario.get("preconditions", []):
            self._reset_target_state()

        context = await self.browser_manager.new_hardened_context(self.target_url)
        page = await context.new_page()
        evidence_recorder = EvidenceRecorder(page, self.artifact_dir)

        step_results = []
        try:
            for step in scenario.get("steps", []):
                n = step.get("n", 1)
                action = step.get("action", "")
                target = step.get("target") or step.get("ref")
                value = step.get("value")

                # Resolve relative URLs
                if action == "goto" and target and target.startswith("/"):
                    target = urljoin(self.target_url, target)

                res = await execute_action(page, action, target=target, value=value)
                screenshot_path = await evidence_recorder.capture_screenshot(f"{scenario_id}_step{n}")

                step_results.append({
                    "n": n,
                    "action": action,
                    "target": target,
                    "status": res.get("status"),
                    "screenshot": screenshot_path,
                })

                if res.get("status") == "failed":
                    logger.warning(f"Step {n} failed in scenario {scenario_id}: {res.get('error')}")
                    break

            evidence_summary = evidence_recorder.get_summary()

            # Evaluate assertions
            assertion_results = []
            has_failures = False

            for assertion in scenario.get("assertions", []):
                eval_res = await AssertionEvaluator.evaluate(assertion, page, evidence_summary)
                assertion_results.append({
                    "assertion": assertion,
                    "result": eval_res,
                })
                if not eval_res.get("passed"):
                    has_failures = True

            # Check hard signals (e.g. 500 error or page error)
            if evidence_summary.get("page_errors") or evidence_summary.get("server_errors"):
                has_failures = True

            execution_record = {
                "scenario_id": scenario_id,
                "journey": scenario.get("journey"),
                "scenario_class": scenario.get("scenario_class"),
                "status": "failed" if has_failures else "passed",
                "step_results": step_results,
                "assertion_results": assertion_results,
                "evidence": evidence_summary,
            }

            return execution_record

        finally:
            await context.close()

    async def execute_all(self, scenarios: list[dict[str, Any]]) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
        """Execute all scenarios and collect candidate findings."""
        executions = []
        candidate_findings = []

        for sc in scenarios:
            rec = await self.execute_scenario(sc)
            executions.append(rec)

            if rec["status"] == "failed":
                candidate_findings.append({
                    "scenario_id": rec["scenario_id"],
                    "journey": rec["journey"],
                    "scenario_class": rec["scenario_class"],
                    "assertion_results": rec["assertion_results"],
                    "evidence": rec["evidence"],
                })

        return executions, candidate_findings
