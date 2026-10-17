"""
Action vocabulary and execution layer.
Section 7 of the Technical Architecture:
Allowed actions: goto, click, fill, select, check, press, reload, back, wait_for.
"""

import logging
from typing import Any
from playwright.async_api import Page

logger = logging.getLogger("drishti.browser.actions")

ALLOWED_ACTIONS = {
    "goto",
    "click",
    "fill",
    "select",
    "check",
    "press",
    "reload",
    "back",
    "wait_for",
}

async def execute_action(
    page: Page,
    action_type: str,
    target: str | None = None,
    value: str | None = None,
    timeout_ms: int = 5000,
) -> dict[str, Any]:
    """
    Execute a single standardized browser action.
    Target can be a CSS selector, element ID, or URL depending on action_type.
    """
    action_type = action_type.lower()
    if action_type not in ALLOWED_ACTIONS:
        return {"status": "error", "error": f"Disallowed action kind: {action_type}"}

    try:
        if action_type == "goto":
            if not target:
                return {"status": "error", "error": "goto requires a target URL"}
            await page.goto(target, timeout=timeout_ms, wait_until="domcontentloaded")

        elif action_type == "click":
            if not target:
                return {"status": "error", "error": "click requires a target selector"}
            await page.click(target, timeout=timeout_ms)

        elif action_type == "fill":
            if not target:
                return {"status": "error", "error": "fill requires a target selector"}
            await page.fill(target, value or "", timeout=timeout_ms)

        elif action_type == "select":
            if not target:
                return {"status": "error", "error": "select requires a target selector"}
            await page.select_option(target, value or "", timeout=timeout_ms)

        elif action_type == "check":
            if not target:
                return {"status": "error", "error": "check requires a target selector"}
            await page.check(target, timeout=timeout_ms)

        elif action_type == "press":
            key = value or "Enter"
            if target:
                await page.press(target, key, timeout=timeout_ms)
            else:
                await page.keyboard.press(key)

        elif action_type == "reload":
            await page.reload(timeout=timeout_ms, wait_until="domcontentloaded")

        elif action_type == "back":
            await page.go_back(timeout=timeout_ms, wait_until="domcontentloaded")

        elif action_type == "wait_for":
            if target:
                await page.wait_for_selector(target, timeout=timeout_ms)
            elif value:
                ms = int(value)
                await page.wait_for_timeout(ms)

        return {"status": "ok", "action": action_type, "target": target}

    except Exception as e:
        logger.warning(f"Action '{action_type}' failed on '{target}': {e}")
        return {"status": "failed", "action": action_type, "target": target, "error": str(e)}
