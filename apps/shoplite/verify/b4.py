"""
Verification script for Bug B4: Forgot password link returns 404.
Pass means bug is absent (i.e. /forgot-password returns 200 OK).
"""

import sys
import urllib.request
import urllib.error

BASE_URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3001"

def test_b4():
    url = f"{BASE_URL}/forgot-password"
    req = urllib.request.Request(url, method="GET")

    try:
        with urllib.request.urlopen(req) as resp:
            if resp.status == 200:
                print("[PASS] Bug B4 is ABSENT: /forgot-password returned 200 OK.")
                sys.exit(0)
            else:
                print(f"[FAIL] Unexpected response status: {resp.status}")
                sys.exit(1)
    except urllib.error.HTTPError as e:
        if e.code == 404:
            print("[FAIL] Bug B4 is PRESENT: /forgot-password returned 404 Not Found.")
            sys.exit(1)
        else:
            print(f"[FAIL] Unexpected error status: {e.code}")
            sys.exit(1)

if __name__ == "__main__":
    test_b4()
