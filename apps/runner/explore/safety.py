"""
Safety classification and Policy Engine.
Section 5.4 of the Technical Architecture.
"""

import re
from typing import Any

# Classification heuristics
DESTRUCTIVE_KEYWORDS = re.compile(
    r"\b(delete|remove|destroy|terminate|cancel account|pay now|checkout|place order)\b",
    re.I,
)
MUTATION_KEYWORDS = re.compile(
    r"\b(sign up|register|create account|save|submit|post|update|edit)\b",
    re.I,
)
SESSION_KEYWORDS = re.compile(
    r"\b(add to cart|filter|apply|login|log in|sign in)\b",
    re.I,
)

def classify_element_safety(element: dict[str, Any]) -> str:
    """
    Deterministic safety classification (R, S, M, D) based on
    element role, tag, accessible name, and form context.
    """
    name = element.get("name", "").lower()
    tag = element.get("tag", "").lower()
    role = element.get("role", "").lower()
    elem_type = element.get("type", "").lower()

    if DESTRUCTIVE_KEYWORDS.search(name):
        return "D"

    if elem_type == "submit" or MUTATION_KEYWORDS.search(name):
        return "M"

    if SESSION_KEYWORDS.search(name):
        return "S"

    if role == "link" or tag == "a":
        return "R"

    if role == "textbox" or tag in ("input", "textarea", "select"):
        return "S"

    return "R"

def is_action_allowed(
    safety_class: str,
    mode: str = "sandbox",
    action_name: str = "",
    allowlist: list[str] | None = None,
) -> tuple[bool, str]:
    """
    Check if an action is allowed under the current run mode.
    Modes:
      - 'safe': Only 'R' actions allowed.
      - 'sandbox': 'R', 'S', and 'M' allowed. 'D' only if matching allowlist.
    """
    allowlist = allowlist or ["place order", "place-order"]
    action_lower = action_name.lower()

    if safety_class == "R":
        return True, "Read-only allowed"

    if mode == "safe":
        return False, f"Action class {safety_class} rejected in safe mode"

    if mode == "sandbox":
        if safety_class in ("S", "M"):
            return True, f"Action class {safety_class} allowed in sandbox"

        if safety_class == "D":
            # Check allowlist
            if any(term in action_lower for term in allowlist):
                return True, f"Destructive action '{action_name}' permitted by explicit allowlist"
            return False, f"Destructive action '{action_name}' rejected by safety policy"

    return False, f"Action rejected under mode {mode}"
