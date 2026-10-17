"""
Environment Probes.
Section 8.4 of the Technical Architecture.
"""

import time
import urllib.request
import urllib.error
import logging
from typing import Any

logger = logging.getLogger("drishti.validate.probes")

class EnvironmentProber:
    """Measures target status and latency before and after test replay."""

    def __init__(self, target_url: str):
        self.target_url = target_url

    def probe(self) -> dict[str, Any]:
        """
        Check that target is reachable and measures response latency.
        Returns {"healthy": bool, "status": int, "latency_ms": float}
        """
        start = time.time()
        try:
            req = urllib.request.Request(self.target_url, headers={"User-Agent": "DRISHTI-Probe/1.0"})
            with urllib.request.urlopen(req, timeout=5) as resp:
                elapsed_ms = (time.time() - start) * 1000
                status = resp.status
                healthy = (200 <= status < 400)
                return {
                    "healthy": healthy,
                    "status": status,
                    "latency_ms": round(elapsed_ms, 2),
                }
        except urllib.error.HTTPError as e:
            elapsed_ms = (time.time() - start) * 1000
            return {
                "healthy": (e.code < 500),
                "status": e.code,
                "latency_ms": round(elapsed_ms, 2),
            }
        except Exception as e:
            elapsed_ms = (time.time() - start) * 1000
            return {
                "healthy": False,
                "status": 0,
                "error": str(e),
                "latency_ms": round(elapsed_ms, 2),
            }
