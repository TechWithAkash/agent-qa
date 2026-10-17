"""
Browser context manager and hardening.
Section 7 and Section 15 of the Technical Architecture.
"""

import logging
from typing import AsyncGenerator
from urllib.parse import urlparse
from playwright.async_api import async_playwright, Browser, BrowserContext, Page, Playwright

logger = logging.getLogger("drishti.browser.context")

class BrowserManager:
    """Manages Playwright browser lifecycle and hardened isolated contexts."""

    def __init__(self, headless: bool = True):
        self.headless = headless
        self._playwright: Playwright | None = None
        self._browser: Browser | None = None

    async def initialize(self):
        """Start Playwright and launch Chromium."""
        if not self._playwright:
            self._playwright = await async_playwright().start()
            self._browser = await self._playwright.chromium.launch(
                headless=self.headless,
                args=[
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-gpu",
                ],
            )
            logger.info("Chromium browser instance launched.")

    async def close(self):
        """Shut down browser and Playwright."""
        if self._browser:
            await self._browser.close()
            self._browser = None
        if self._playwright:
            await self._playwright.stop()
            self._playwright = None
        logger.info("Chromium browser instance closed.")

    async def new_hardened_context(
        self,
        target_origin: str,
        allowlist: list[str] | None = None,
    ) -> BrowserContext:
        """
        Create a hardened, isolated browser context.
        Section 7 specifications:
        - service_workers="block"
        - accept_downloads=False
        - viewport: 1280x720
        - fixed locale and timezone
        - request interception to prevent origin escape
        """
        if not self._browser:
            await self.initialize()

        context = await self._browser.new_context(
            viewport={"width": 1280, "height": 720},
            locale="en-US",
            timezone_id="UTC",
            service_workers="block",
            accept_downloads=False,
            ignore_https_errors=False,
        )

        allowed_origins = [target_origin]
        if allowlist:
            allowed_origins.extend(allowlist)

        parsed_allowed = [urlparse(o).netloc or o for o in allowed_origins]

        async def route_handler(route):
            req = route.request
            req_url = req.url
            parsed = urlparse(req_url)

            # Block non-HTTP schemes (e.g. file://, gopher://)
            if parsed.scheme not in ("http", "https", "data"):
                logger.warning(f"Aborting disallowed scheme: {parsed.scheme} for {req_url}")
                await route.abort()
                return

            if parsed.scheme == "data":
                await route.continue_()
                return

            # Validate target host
            req_host = parsed.netloc.split(":")[0]
            is_allowed = any(
                req_host == allowed.split(":")[0] or req_host.endswith(f".{allowed.split(':')[0]}")
                for allowed in parsed_allowed
            )

            # Localhost / shoplite aliases in Docker network
            if req_host in ("localhost", "127.0.0.1", "shoplite"):
                is_allowed = True

            if not is_allowed:
                logger.warning(f"Blocking external network egress: {req_url}")
                await route.abort()
                return

            await route.continue_()

        await context.route("**/*", route_handler)
        return context
