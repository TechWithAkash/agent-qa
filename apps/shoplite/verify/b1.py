"""
Verification script for Bug B1: Malformed email accepted.
Pass means bug is absent (i.e. malformed email is correctly rejected).
"""

import sys
import json
import urllib.request
import urllib.error

BASE_URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3001"

def test_b1():
    # Reset state
    reset_req = urllib.request.Request(f"{BASE_URL}/__test/reset", method="POST")
    urllib.request.urlopen(reset_req)

    url = f"{BASE_URL}/api/signup"
    payload = json.dumps({"email": "invalid-email-address", "password": "password123"}).encode("utf-8")
    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"}, method="POST")

    try:
        with urllib.request.urlopen(req) as resp:
            # If 201 or 200 returned, bug is present!
            data = json.loads(resp.read().decode("utf-8"))
            print(f"[FAIL] Bug B1 is PRESENT: Malformed email was accepted with status {resp.status}: {data}")
            sys.exit(1)
    except urllib.error.HTTPError as e:
        if e.code == 400:
            print("[PASS] Bug B1 is ABSENT: Malformed email was correctly rejected with 400.")
            sys.exit(0)
        else:
            print(f"[FAIL] Unexpected error status: {e.code}")
            sys.exit(1)

if __name__ == "__main__":
    test_b1()
