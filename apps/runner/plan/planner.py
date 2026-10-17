"""
S4: Test Planner.
Section 6 of the Technical Architecture.
"""

import logging
from typing import Any

from llm.gateway import LLMGateway
from plan.generators import DataFactory
from plan.grounding import ground_scenario, dedupe_and_cap_scenarios

logger = logging.getLogger("drishti.plan.planner")

class TestPlanner:
    """Plans test scenarios from the AppModel and application description."""

    def __init__(self, run_id: str, app_model: dict[str, Any], description: str = ""):
        self.run_id = run_id
        self.app_model = app_model
        self.description = description
        self.data_factory = DataFactory(run_id)
        self.llm_gateway = LLMGateway()

    async def plan(self) -> list[dict[str, Any]]:
        """Generate, ground, deduplicate, and prioritize test scenarios."""
        logger.info(f"Planning scenarios for run {self.run_id}")

        # Try LLM generation first
        prompt = f"""
Application Description:
{self.description}

Discovered Routes and Elements:
Routes: {self.app_model.get('routes', [])}
States count: {len(self.app_model.get('states', []))}

Generate structured test scenarios with Assertion DSL expectations.
"""
        llm_output = await self.llm_gateway.generate_plan(prompt)

        raw_scenarios = []
        if llm_output and llm_output.scenarios:
            for s in llm_output.scenarios:
                raw_scenarios.append(s.model_dump())
        else:
            # Fallback to deterministic comprehensive scenario templates
            raw_scenarios = self._generate_template_scenarios()

        # Ground against AppModel
        grounded = []
        for sc in raw_scenarios:
            g = ground_scenario(sc, self.app_model)
            if g:
                grounded.append(g)

        # Dedupe and cap
        final_scenarios = dedupe_and_cap_scenarios(grounded, max_scenarios=25)
        logger.info(f"Planned {len(final_scenarios)} final scenarios for execution.")
        return final_scenarios

    def _generate_template_scenarios(self) -> list[dict[str, Any]]:
        """Generate high-coverage scenario classes based on discovered forms and rules."""
        scenarios = []
        v_email = self.data_factory.valid_email()
        v_pass = self.data_factory.valid_password()

        # 1. J1: Happy path sign-up
        scenarios.append({
            "id": "sc_signup_happy",
            "journey": "User Registration",
            "scenario_class": "happy",
            "preconditions": ["reset_state"],
            "steps": [
                {"n": 1, "action": "goto", "target": "/signup"},
                {"n": 2, "action": "fill", "target": "#email", "value": v_email},
                {"n": 3, "action": "fill", "target": "#password", "value": v_pass},
                {"n": 4, "action": "click", "target": "#signup-btn"},
            ],
            "assertions": [
                {
                    "id": "a_signup_url",
                    "type": "url_matches",
                    "args": {"pattern": "/account"},
                    "source": "description",
                    "evidence_quote": "redirected to the /account dashboard",
                },
                {
                    "id": "a_signup_no_500",
                    "type": "no_server_errors",
                    "args": {},
                    "source": "convention",
                },
            ],
        })

        # 2. J1: Validation (B1) — Malformed email
        scenarios.append({
            "id": "sc_signup_malformed_email",
            "journey": "User Registration",
            "scenario_class": "validation",
            "preconditions": ["reset_state"],
            "steps": [
                {"n": 1, "action": "goto", "target": "/signup"},
                {"n": 2, "action": "fill", "target": "#email", "value": "invalid-email-address"},
                {"n": 3, "action": "fill", "target": "#password", "value": v_pass},
                {"n": 4, "action": "click", "target": "#signup-btn"},
            ],
            "assertions": [
                {
                    "id": "a_b1_stays_on_signup",
                    "type": "url_matches",
                    "args": {"pattern": "/signup"},
                    "source": "description",
                    "evidence_quote": "Requires a valid email address containing an @ symbol",
                },
                {
                    "id": "a_b1_no_account_redirect",
                    "type": "element_absent",
                    "args": {"text": "Account Dashboard"},
                    "source": "description",
                    "evidence_quote": "Requires a valid email address",
                },
            ],
        })

        # 3. J1: Duplicate registration (B2)
        scenarios.append({
            "id": "sc_signup_duplicate",
            "journey": "User Registration",
            "scenario_class": "negative",
            "preconditions": ["reset_state"],
            "steps": [
                {"n": 1, "action": "goto", "target": "/signup"},
                {"n": 2, "action": "fill", "target": "#email", "value": "dup@example.com"},
                {"n": 3, "action": "fill", "target": "#password", "value": v_pass},
                {"n": 4, "action": "click", "target": "#signup-btn"},
                {"n": 5, "action": "goto", "target": "/signup"},
                {"n": 6, "action": "fill", "target": "#email", "value": "dup@example.com"},
                {"n": 7, "action": "fill", "target": "#password", "value": v_pass},
                {"n": 8, "action": "click", "target": "#signup-btn"},
            ],
            "assertions": [
                {
                    "id": "a_b2_no_server_error",
                    "type": "no_server_errors",
                    "args": {},
                    "source": "convention",
                    "evidence_quote": "no server error",
                },
            ],
        })

        # 4. J2: Case-insensitive login (B3)
        scenarios.append({
            "id": "sc_login_case_insensitive",
            "journey": "User Login",
            "scenario_class": "logic",
            "preconditions": ["reset_state"],
            "steps": [
                {"n": 1, "action": "goto", "target": "/signup"},
                {"n": 2, "action": "fill", "target": "#email", "value": "caseuser@example.com"},
                {"n": 3, "action": "fill", "target": "#password", "value": v_pass},
                {"n": 4, "action": "click", "target": "#signup-btn"},
                {"n": 5, "action": "goto", "target": "/login"},
                {"n": 6, "action": "fill", "target": "#email", "value": "CASEUSER@EXAMPLE.COM"},
                {"n": 7, "action": "fill", "target": "#password", "value": v_pass},
                {"n": 8, "action": "click", "target": "#login-btn"},
            ],
            "assertions": [
                {
                    "id": "a_b3_login_success",
                    "type": "url_matches",
                    "args": {"pattern": "/account"},
                    "source": "description",
                    "evidence_quote": "Email addresses are strictly case-insensitive",
                },
            ],
        })

        # 5. J2: Forgot password navigation (B4)
        scenarios.append({
            "id": "sc_forgot_password_navigation",
            "journey": "User Login",
            "scenario_class": "navigation",
            "steps": [
                {"n": 1, "action": "goto", "target": "/login"},
                {"n": 2, "action": "click", "target": "#link-forgot-password"},
            ],
            "assertions": [
                {
                    "id": "a_b4_no_dead_link",
                    "type": "element_absent",
                    "args": {"text": "404"},
                    "source": "convention",
                    "evidence_quote": "link opens a reset page",
                },
            ],
        })

        # 6. J3: Search with whitespace (B5)
        scenarios.append({
            "id": "sc_search_whitespace",
            "journey": "Product Search & Browse",
            "scenario_class": "edge_case",
            "steps": [
                {"n": 1, "action": "goto", "target": "/products"},
                {"n": 2, "action": "fill", "target": "#search-input", "value": "Coffee "},
                {"n": 3, "action": "click", "target": "#search-btn"},
            ],
            "assertions": [
                {
                    "id": "a_b5_search_found",
                    "type": "element_visible",
                    "args": {"text": "Coffee Maker"},
                    "source": "description",
                    "evidence_quote": "Search queries ignore leading and trailing whitespace",
                },
            ],
        })

        # 7. J4: Quantity validation (B6)
        scenarios.append({
            "id": "sc_cart_zero_quantity",
            "journey": "Cart Management",
            "scenario_class": "validation",
            "steps": [
                {"n": 1, "action": "goto", "target": "/products/p1"},
                {"n": 2, "action": "fill", "target": "#detail-qty", "value": "0"},
                {"n": 3, "action": "click", "target": "#detail-add-btn"},
            ],
            "assertions": [
                {
                    "id": "a_b6_no_zero_qty",
                    "type": "no_server_errors",
                    "args": {},
                    "source": "convention",
                },
            ],
        })

        # 8. J5: Empty cart checkout (B8)
        scenarios.append({
            "id": "sc_checkout_empty",
            "journey": "Checkout & Order Placement",
            "scenario_class": "crash",
            "preconditions": ["reset_state"],
            "steps": [
                {"n": 1, "action": "goto", "target": "/checkout"},
            ],
            "assertions": [
                {
                    "id": "a_b8_no_page_error",
                    "type": "no_page_errors",
                    "args": {},
                    "source": "convention",
                    "evidence_quote": "no page errors",
                },
                {
                    "id": "a_b8_no_server_error",
                    "type": "no_server_errors",
                    "args": {},
                    "source": "convention",
                },
            ],
        })

        return scenarios
