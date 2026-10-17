"""
S3: Application Model Builder.
Section 5.7 of the Technical Architecture.
"""

from typing import Any

def build_app_model(
    run_id: str,
    raw_crawl_results: dict[str, Any],
) -> dict[str, Any]:
    """
    Normalize raw exploration observations into a compact, validated Application Model.
    """
    raw_states = raw_crawl_results.get("states", [])
    raw_transitions = raw_crawl_results.get("transitions", [])
    truncated = raw_crawl_results.get("truncated", False)

    # Collect unique route templates
    routes_set = set()
    normalized_states = []

    for s in raw_states:
        route_template = s.get("route_template", "")
        routes_set.add(route_template)

        # Retain elements with locator and safety class
        norm_elements = []
        for e in s.get("elements", []):
            norm_elements.append({
                "ref": e.get("ref"),
                "role": e.get("role"),
                "name": e.get("name"),
                "tag": e.get("tag"),
                "id": e.get("id"),
                "type": e.get("type"),
                "required": e.get("required", False),
                "minlength": e.get("minlength"),
                "safety": e.get("safety", "R"),
                "selector": e.get("selector"),
            })

        normalized_states.append({
            "id": s.get("id"),
            "fingerprint": s.get("fingerprint"),
            "route_template": route_template,
            "url": s.get("url"),
            "title": s.get("title", ""),
            "elements": norm_elements,
            "forms": s.get("forms", []),
            "signals": {"console_errors": 0, "failed_requests": 0},
        })

    return {
        "run_id": run_id,
        "truncated": truncated,
        "routes": sorted(list(routes_set)),
        "states": normalized_states,
        "transitions": raw_transitions,
        "blocked": [],
    }
