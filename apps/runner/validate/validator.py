"""
S6: Failure Validation and Status Classification.
Section 8.1 - 8.3 of the Technical Architecture.
"""

import logging
from typing import Any
from validate.probes import EnvironmentProber
from pipeline.s5_executor import ScenarioExecutor

logger = logging.getLogger("drishti.validate.validator")

class FailureValidator:
    """Validates candidate defect findings via 3x replay in fresh contexts."""

    def __init__(self, executor: ScenarioExecutor, prober: EnvironmentProber):
        self.executor = executor
        self.prober = prober

    async def validate_candidates(
        self,
        candidate_findings: list[dict[str, Any]],
        scenario_map: dict[str, dict[str, Any]],
    ) -> list[dict[str, Any]]:
        """Validate all candidate findings and classify status."""
        probe_before = self.prober.probe()
        validated_findings = []

        for candidate in candidate_findings:
            scenario_id = candidate["scenario_id"]
            scenario = scenario_map.get(scenario_id)
            if not scenario:
                continue

            logger.info(f"Validating finding for {scenario_id} via 3x replay...")
            reproduced_count = 0
            replay_evidence = []

            for i in range(3):
                rec = await self.executor.execute_scenario(scenario)
                if rec["status"] == "failed":
                    reproduced_count += 1
                replay_evidence.append(rec["evidence"])

            probe_after = self.prober.probe()

            # Determine assertion provenance
            trusted_source = True
            for ar in candidate.get("assertion_results", []):
                assertion = ar.get("assertion", {})
                source = assertion.get("source", "description")
                if source == "llm_inference":
                    trusted_source = False

            # Classification rules per Section 8.1 - 8.3
            status = "inconclusive"
            if not probe_before.get("healthy") or not probe_after.get("healthy"):
                status = "inconclusive"
                reason = "Environment probe degraded before or after replay"
            elif reproduced_count == 3:
                if trusted_source:
                    status = "confirmed"
                    reason = "3/3 replays reproduced with healthy environment and trusted assertion source"
                else:
                    status = "suspected"
                    reason = "3/3 replays reproduced but assertion source is unverified llm_inference"
            elif reproduced_count in (1, 2):
                status = "suspected"
                reason = f"Flaky defect: reproduced {reproduced_count}/3 times"
            else:
                status = "inconclusive"
                reason = "Defect could not be reproduced (0/3 replays)"

            # Suggested severity heuristic per Section 8.6
            severity = "medium"
            ev = candidate.get("evidence", {})
            if ev.get("server_errors") or ev.get("page_errors"):
                severity = "high"
            elif candidate.get("scenario_class") == "edge_case" or candidate.get("scenario_class") == "navigation":
                severity = "low"

            finding_doc = {
                "id": f"find_{scenario_id}",
                "scenario_id": scenario_id,
                "journey": candidate.get("journey"),
                "status": status,
                "classification_reason": reason,
                "severity": severity,
                "replay_rate": f"{reproduced_count}/3",
                "evidence": candidate.get("evidence"),
                "probe_before": probe_before,
                "probe_after": probe_after,
            }
            validated_findings.append(finding_doc)
            logger.info(f"Finding for {scenario_id} classified as: {status} ({severity})")

        return validated_findings
