"""
Autonomous priority crawler.
Section 5 of the Technical Architecture.
"""

import logging
import asyncio
from typing import Any
from urllib.parse import urlparse, urljoin
from playwright.async_api import Page

from browser.observation import observe_page
from browser.actions import execute_action
from explore.fingerprint import compute_state_fingerprint, normalize_route_template
from explore.safety import classify_element_safety, is_action_allowed

logger = logging.getLogger("drishti.explore.crawler")

class AutonomousCrawler:
    """Explores web application deterministically within safety and budget limits."""

    def __init__(
        self,
        page: Page,
        start_url: str,
        mode: str = "sandbox",
        max_states: int = 20,
        max_actions: int = 60,
    ):
        self.page = page
        self.start_url = start_url
        self.target_origin = f"{urlparse(start_url).scheme}://{urlparse(start_url).netloc}"
        self.mode = mode
        self.max_states = max_states
        self.max_actions = max_actions

        self.visited_fingerprints: set[str] = set()
        self.route_template_counts: dict[str, int] = {}
        self.states: list[dict[str, Any]] = []
        self.transitions: list[dict[str, Any]] = []
        self.action_count = 0
        self.state_counter = 1

    async def crawl(self) -> dict[str, Any]:
        """Run the exploration loop starting from start_url."""
        logger.info(f"Starting autonomous crawl on {self.start_url}")
        frontier: list[str] = [self.start_url]

        # Initial navigation
        await self.page.goto(self.start_url, wait_until="domcontentloaded")

        consecutive_no_new_state = 0

        while frontier and len(self.states) < self.max_states and self.action_count < self.max_actions:
            current_target_url = frontier.pop(0)

            # Navigate to target if not already there
            if self.page.url != current_target_url:
                await self.page.goto(current_target_url, wait_until="domcontentloaded")

            obs = await observe_page(self.page)
            elements = obs["elements"]
            forms = obs["forms"]
            url = obs["url"]
            template = normalize_route_template(url)

            # Check route-template cap (max 3 per template)
            if self.route_template_counts.get(template, 0) >= 3:
                continue

            fp = compute_state_fingerprint(url, elements, forms)
            if fp in self.visited_fingerprints:
                continue

            # Record new state
            self.visited_fingerprints.add(fp)
            self.route_template_counts[template] = self.route_template_counts.get(template, 0) + 1
            state_id = f"st_{self.state_counter:02d}"
            self.state_counter += 1

            for elem in elements:
                elem["safety"] = classify_element_safety(elem)

            state_record = {
                "id": state_id,
                "fingerprint": fp,
                "route_template": template,
                "url": url,
                "title": obs["title"],
                "elements": elements,
                "forms": forms,
                "text_excerpt": obs["text_excerpt"],
            }
            self.states.append(state_record)
            logger.info(f"Discovered State {state_id}: {template} ({url}) with {len(elements)} elements")

            # Discover links to add to frontier
            for elem in elements:
                href = elem.get("href")
                if href and elem.get("role") == "link":
                    full_url = urljoin(url, href)
                    parsed_full = urlparse(full_url)
                    # Stay same origin
                    if parsed_full.netloc == urlparse(self.target_origin).netloc:
                        t_norm = normalize_route_template(full_url)
                        if self.route_template_counts.get(t_norm, 0) < 3 and full_url not in frontier:
                            frontier.append(full_url)

            # Try interactive actions in this state
            actions_tried = 0
            for elem in elements:
                if actions_tried >= 8 or self.action_count >= self.max_actions:
                    break

                safety = elem["safety"]
                allowed, reason = is_action_allowed(safety, self.mode, elem.get("name", ""))
                if not allowed:
                    continue

                # Form input or navigation click
                target_sel = elem.get("selector")
                if not target_sel:
                    continue

                if elem.get("role") == "button" or elem.get("tag") == "a":
                    actions_tried += 1
                    self.action_count += 1

                    prev_url = self.page.url
                    res = await execute_action(self.page, "click", target=target_sel)
                    if res["status"] == "ok":
                        new_obs = await observe_page(self.page)
                        new_fp = compute_state_fingerprint(new_obs["url"], new_obs["elements"], new_obs["forms"])

                        if new_fp not in self.visited_fingerprints:
                            consecutive_no_new_state = 0
                            frontier.insert(0, new_obs["url"])
                            self.transitions.append({
                                "from": state_id,
                                "to": f"st_{self.state_counter:02d}",
                                "action": {"kind": "click", "ref": elem["ref"], "name": elem["name"]},
                                "result_status": 200,
                            })
                            break
                        else:
                            consecutive_no_new_state += 1
                            if consecutive_no_new_state >= 5:
                                break

        logger.info(f"Crawl completed. Found {len(self.states)} states, {len(self.transitions)} transitions.")
        return {
            "truncated": len(self.states) >= self.max_states or self.action_count >= self.max_actions,
            "states": self.states,
            "transitions": self.transitions,
        }
