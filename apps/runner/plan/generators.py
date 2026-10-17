"""
Data Factory for synthetic test data.
Section 6.1 and Section 7 of the Technical Architecture.
"""

import uuid

class DataFactory:
    """Generates synthetic, deterministic values with run-scoped suffixes."""

    def __init__(self, run_id: str):
        self.run_id = run_id
        self.suffix = run_id[:8] if len(run_id) >= 8 else str(uuid.uuid4())[:6]
        self._seq = 1

    def valid_email(self) -> str:
        email = f"user_{self.suffix}_{self._seq}@example.com"
        self._seq += 1
        return email

    def uppercase_email(self) -> str:
        return f"USER_{self.suffix}@EXAMPLE.COM"

    def invalid_email(self, variant: str = "missing_at") -> str:
        if variant == "missing_at":
            return f"user_{self.suffix}.example.com"
        elif variant == "missing_domain":
            return f"user_{self.suffix}@"
        return f"invalid-email-{self.suffix}"

    def valid_password(self) -> str:
        return "SecurePassword123!"

    def short_password(self) -> str:
        return "Pass1"  # 5 characters, violates min 8

    def quantity(self, value: int = 1) -> str:
        return str(value)

    def search_query(self, query: str = "Coffee ", trailing_space: bool = False) -> str:
        return query if trailing_space else query.strip()
