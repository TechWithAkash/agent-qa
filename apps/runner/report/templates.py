"""
S8: Report Generator.
Section 8.8 of the Technical Architecture.
"""

from typing import Any

def generate_markdown_report(finding: dict[str, Any], scenario: dict[str, Any]) -> str:
    """Generate Markdown report with steps to reproduce, evidence signals, and assertions."""
    fid = finding.get("id")
    journey = finding.get("journey", "Unknown Journey")
    status = finding.get("status", "suspected")
    severity = finding.get("severity", "medium")
    replay_rate = finding.get("replay_rate", "3/3")
    reason = finding.get("classification_reason", "")

    steps_md = []
    for step in scenario.get("steps", []):
        n = step.get("n", 1)
        action = step.get("action", "")
        target = step.get("target") or step.get("ref", "")
        val = f" with '{step.get('value')}'" if step.get("value") else ""
        steps_md.append(f"{n}. `{action}` {target}{val}")

    evidence = finding.get("evidence", {})
    server_errors = evidence.get("server_errors", [])
    page_errors = evidence.get("page_errors", [])

    signals_md = []
    signals_md.append(f"- **Replay Rate:** {replay_rate}")
    signals_md.append(f"- **Classification Reason:** {reason}")
    if server_errors:
        signals_md.append(f"- **Server Errors (5xx):** {len(server_errors)} encountered")
        for se in server_errors:
            signals_md.append(f"  - `{se.get('url')}` -> HTTP {se.get('status')}")
    if page_errors:
        signals_md.append(f"- **Uncaught Page Errors:** {len(page_errors)}")
        for pe in page_errors:
            signals_md.append(f"  - `{pe.get('message')}`")

    return f"""# DRISHTI AI Defect Report — {fid}

| Property | Value |
|---|---|
| **Journey** | {journey} |
| **Status** | **{status.upper()}** |
| **Suggested Severity** | {severity.capitalize()} |
| **Replay Consistency** | {replay_rate} |

## Steps to Reproduce
{chr(10).join(steps_md)}

## Evidence & Verification Signals
{chr(10).join(signals_md)}

## Environment Probes
- **Before Replay:** Status {finding.get('probe_before', {}).get('status', 'OK')} ({finding.get('probe_before', {}).get('latency_ms', 0)} ms)
- **After Replay:** Status {finding.get('probe_after', {}).get('status', 'OK')} ({finding.get('probe_after', {}).get('latency_ms', 0)} ms)
"""
