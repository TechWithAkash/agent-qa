"""
Evidence capture hooks and rolling buffer.
Section 7 and Section 9 of the Technical Architecture.
"""

import os
import hashlib
from datetime import datetime, timezone
from typing import Any
from playwright.async_api import Page, Response, ConsoleMessage

class EvidenceRecorder:
    """Attaches listeners to a Playwright page to record console, network, and page errors."""

    def __init__(self, page: Page, artifact_dir: str | None = None):
        self.page = page
        self.artifact_dir = artifact_dir or os.getenv("ARTIFACT_DIR", "/tmp/artifacts")
        self.console_logs: list[dict[str, Any]] = []
        self.page_errors: list[dict[str, Any]] = []
        self.failed_requests: list[dict[str, Any]] = []
        self.server_errors: list[dict[str, Any]] = []
        self.step_screenshots: list[str] = []
        self._setup_listeners()

    def _setup_listeners(self):
        self.page.on("console", self._handle_console)
        self.page.on("pageerror", self._handle_pageerror)
        self.page.on("requestfailed", self._handle_requestfailed)
        self.page.on("response", self._handle_response)

    def _handle_console(self, msg: ConsoleMessage):
        self.console_logs.append({
            "type": msg.type,
            "text": msg.text,
            "location": msg.location,
            "ts": datetime.now(timezone.utc).isoformat(),
        })

    def _handle_pageerror(self, err: Exception):
        self.page_errors.append({
            "message": str(err),
            "ts": datetime.now(timezone.utc).isoformat(),
        })

    def _handle_requestfailed(self, req):
        self.failed_requests.append({
            "url": req.url,
            "method": req.method,
            "failure": req.failure,
            "ts": datetime.now(timezone.utc).isoformat(),
        })

    async def _handle_response(self, resp: Response):
        status = resp.status
        if status >= 500:
            body_snippet = ""
            try:
                body = await resp.text()
                body_snippet = body[:2048]  # Truncate to 2KB per Section 7
            except Exception:
                pass
            self.server_errors.append({
                "url": resp.url,
                "status": status,
                "body_snippet": body_snippet,
                "ts": datetime.now(timezone.utc).isoformat(),
            })

    async def capture_screenshot(self, name_prefix: str = "step") -> str:
        """Capture screenshot and write to artifact dir with sha256."""
        os.makedirs(self.artifact_dir, exist_ok=True)
        img_bytes = await self.page.screenshot(full_page=False)
        sha = hashlib.sha256(img_bytes).hexdigest()[:12]
        filename = f"{name_prefix}_{sha}.png"
        filepath = os.path.join(self.artifact_dir, filename)
        with open(filepath, "wb") as f:
            f.write(img_bytes)
        self.step_screenshots.append(filepath)
        return filepath

    def get_summary(self) -> dict[str, Any]:
        """Return delta signals for current step or execution."""
        return {
            "console_logs": list(self.console_logs),
            "page_errors": list(self.page_errors),
            "failed_requests": list(self.failed_requests),
            "server_errors": list(self.server_errors),
            "screenshots": list(self.step_screenshots),
        }

    def clear(self):
        """Clear the buffers."""
        self.console_logs.clear()
        self.page_errors.clear()
        self.failed_requests.clear()
        self.server_errors.clear()
        self.step_screenshots.clear()
