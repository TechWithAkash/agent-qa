"""
State fingerprinting and normalization.
Section 5.2 of the Technical Architecture.
"""

import hashlib
import re
from urllib.parse import urlparse, parse_qs
from typing import Any

UUID_REGEX = re.compile(r"[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}", re.I)
NUMERIC_ID_REGEX = re.compile(r"(?<=/)\d+(?=(/|$))")
PRODUCT_ID_REGEX = re.compile(r"(?<=/)[a-z]\d+(?=(/|$))", re.I)

def normalize_route_template(url: str) -> str:
    """
    Normalize URL path template by replacing IDs, UUIDs, and keys with :id.
    Query values are stripped, keeping only query parameter names.
    Examples:
      /products/p1 -> /products/:id
      /users/123 -> /users/:id
      /products?q=coffee -> /products?q
    """
    parsed = urlparse(url)
    path = parsed.path

    # Normalize IDs
    path = UUID_REGEX.sub(":id", path)
    path = NUMERIC_ID_REGEX.sub(":id", path)
    path = PRODUCT_ID_REGEX.sub(":id", path)

    if parsed.query:
        qs = parse_qs(parsed.query)
        sorted_keys = sorted(qs.keys())
        query_sig = "&".join(sorted_keys)
        return f"{path}?{query_sig}"

    return path

def compute_state_fingerprint(
    url: str,
    elements: list[dict[str, Any]],
    forms: list[dict[str, Any]],
) -> str:
    """
    Compute state fingerprint:
    hash(normalized_path + sorted_interactive_elements + form_structure)
    """
    norm_path = normalize_route_template(url)

    # Sorted multiset of (role, accessible name)
    elem_tuples = []
    for e in elements:
        role = e.get("role", "")
        name = e.get("name", "").strip().lower()
        elem_tuples.append(f"{role}:{name}")
    elem_tuples.sort()

    # Form structure
    form_tuples = []
    for f in forms:
        method = f.get("method", "GET").upper()
        field_count = len(f.get("field_ids", []))
        form_tuples.append(f"{method}:{field_count}")
    form_tuples.sort()

    payload = f"{norm_path}|{'#'.join(elem_tuples)}|{'#'.join(form_tuples)}"
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()[:16]
