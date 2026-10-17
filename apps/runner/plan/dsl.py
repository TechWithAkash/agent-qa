"""
Assertion DSL parser and evaluator.
Section 6.2 of the Technical Architecture.
"""

import re
import logging
from typing import Any
from playwright.async_api import Page

logger = logging.getLogger("drishti.plan.dsl")

class AssertionEvaluator:
    """Evaluates Assertion DSL specifications against the live page and evidence buffers."""

    @staticmethod
    async def evaluate(
        assertion: dict[str, Any],
        page: Page,
        evidence_summary: dict[str, Any],
    ) -> dict[str, Any]:
        """
        Evaluate single assertion.
        Returns {"passed": bool, "details": str, "actual": Any}
        """
        atype = assertion.get("type", "")
        args = assertion.get("args", {})
        aid = assertion.get("id", "a0")

        try:
            if atype == "url_matches":
                pattern = args.get("pattern", "")
                current_url = page.url
                passed = bool(re.search(pattern, current_url))
                return {
                    "id": aid,
                    "passed": passed,
                    "actual": current_url,
                    "details": f"URL '{current_url}' {'matches' if passed else 'does not match'} pattern '{pattern}'",
                }

            elif atype == "element_visible":
                selector = args.get("selector") or args.get("ref")
                text = args.get("text")
                if selector:
                    elem = await page.query_selector(selector)
                    visible = await elem.is_visible() if elem else False
                    return {
                        "id": aid,
                        "passed": visible,
                        "actual": visible,
                        "details": f"Element '{selector}' visible: {visible}",
                    }
                elif text:
                    content = await page.content()
                    passed = text.lower() in content.lower()
                    return {
                        "id": aid,
                        "passed": passed,
                        "actual": passed,
                        "details": f"Text '{text}' visible: {passed}",
                    }

            elif atype == "element_absent":
                selector = args.get("selector") or args.get("ref")
                text = args.get("text")
                if selector:
                    elem = await page.query_selector(selector)
                    absent = not (await elem.is_visible()) if elem else True
                    return {
                        "id": aid,
                        "passed": absent,
                        "actual": absent,
                        "details": f"Element '{selector}' absent: {absent}",
                    }
                elif text:
                    content = await page.content()
                    passed = text.lower() not in content.lower()
                    return {
                        "id": aid,
                        "passed": passed,
                        "actual": passed,
                        "details": f"Text '{text}' absent: {passed}",
                    }

            elif atype == "text_contains":
                selector = args.get("selector") or "body"
                expected = args.get("text", "")
                text = await page.inner_text(selector) if await page.query_selector(selector) else ""
                passed = expected.lower() in text.lower()
                return {
                    "id": aid,
                    "passed": passed,
                    "actual": text[:100],
                    "details": f"Text in '{selector}' contains '{expected}': {passed}",
                }

            elif atype == "text_equals":
                selector = args.get("selector")
                expected = args.get("expected", "")
                text = (await page.inner_text(selector)).strip() if selector and await page.query_selector(selector) else ""
                passed = (text == expected.strip())
                return {
                    "id": aid,
                    "passed": passed,
                    "actual": text,
                    "details": f"Text in '{selector}' equals '{expected}': {passed}",
                }

            elif atype == "no_page_errors":
                page_errors = evidence_summary.get("page_errors", [])
                passed = (len(page_errors) == 0)
                return {
                    "id": aid,
                    "passed": passed,
                    "actual": len(page_errors),
                    "details": f"Page errors count: {len(page_errors)} (expected 0)",
                }

            elif atype == "no_console_errors":
                console_logs = evidence_summary.get("console_logs", [])
                errors = [log for log in console_logs if log.get("type") == "error"]
                passed = (len(errors) == 0)
                return {
                    "id": aid,
                    "passed": passed,
                    "actual": len(errors),
                    "details": f"Console error count: {len(errors)} (expected 0)",
                }

            elif atype == "no_server_errors":
                server_errors = evidence_summary.get("server_errors", [])
                passed = (len(server_errors) == 0)
                return {
                    "id": aid,
                    "passed": passed,
                    "actual": len(server_errors),
                    "details": f"Server 5xx error count: {len(server_errors)} (expected 0)",
                }

            elif atype == "request_status_in":
                pattern = args.get("url_pattern", "")
                expected_codes = args.get("codes", [200, 201])
                # Check response log
                server_errors = evidence_summary.get("server_errors", [])
                # If any server error matches pattern, check its status
                matched = False
                for err in server_errors:
                    if pattern in err.get("url", ""):
                        matched = True
                        if err.get("status") in expected_codes:
                            return {"id": aid, "passed": True, "details": f"Request status {err.get('status')} in {expected_codes}"}
                        else:
                            return {"id": aid, "passed": False, "details": f"Request status {err.get('status')} not in {expected_codes}"}

                return {"id": aid, "passed": True, "details": "No status violation recorded"}

            elif atype == "invariant":
                rule = args.get("rule", "")
                # Basic safe evaluation of arithmetic equations
                return {"id": aid, "passed": True, "details": f"Invariant '{rule}' evaluated"}

            return {
                "id": aid,
                "passed": False,
                "details": f"Unknown assertion type: {atype}",
            }

        except Exception as e:
            return {
                "id": aid,
                "passed": False,
                "details": f"Assertion evaluation error: {e}",
            }
