"""
Scenario grounding, deduplication, and capping.
Section 6.3 of the Technical Architecture.
"""

import hashlib
import logging
from typing import Any

logger = logging.getLogger("drishti.plan.grounding")

def ground_scenario(scenario: dict[str, Any], app_model: dict[str, Any]) -> dict[str, Any] | None:
    """
    Ensure every step references a known element ref, selector, or valid route.
    Drops ungrounded steps and logs them.
    """
    known_routes = set(app_model.get("routes", []))
    known_selectors = set()
    known_refs = set()

    for st in app_model.get("states", []):
        for elem in st.get("elements", []):
            if elem.get("ref"):
                known_refs.add(elem["ref"])
            if elem.get("selector"):
                known_selectors.add(elem["selector"])
            if elem.get("id"):
                known_selectors.add(f"#{elem['id']}")

    grounded_steps = []
    for step in scenario.get("steps", []):
        action = step.get("action")
        target = step.get("target") or step.get("ref")

        if action == "goto":
            grounded_steps.append(step)
        elif target in known_refs or target in known_selectors or target.startswith("#") or target.startswith("."):
            grounded_steps.append(step)
        else:
            logger.warning(f"Dropping ungrounded step: {step}")

    if not grounded_steps:
        return None

    scenario["steps"] = grounded_steps
    return scenario

def dedupe_and_cap_scenarios(
    scenarios: list[dict[str, Any]],
    max_scenarios: int = 25,
) -> list[dict[str, Any]]:
    """
    Deduplicate scenarios by fingerprint (journey, class, form/target) and cap.
    Section 6.1 step 5.
    """
    seen_fingerprints = set()
    result = []

    for sc in scenarios:
        journey = sc.get("journey", "")
        sclass = sc.get("scenario_class", "happy")
        first_target = sc["steps"][0].get("target", "") if sc.get("steps") else ""
        fp = hashlib.sha256(f"{journey}|{sclass}|{first_target}".encode("utf-8")).hexdigest()[:12]

        if fp in seen_fingerprints:
            continue

        seen_fingerprints.add(fp)
        sc["fingerprint"] = fp
        result.append(sc)

        if len(result) >= max_scenarios:
            break

    return result
