"""
Verification script for Bug B2: Duplicate email causes 500 error.
Pass means bug is absent (i.e. duplicate email returns a clean 409 error instead of 500).
"""

import sys
import json
import urllib.request
import urllib.error

BASE_URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3001"

def test_b2():
    # Reset state
    reset_req = urllib.request.Request(f"{BASE_URL}/__test/reset", method="POST")
    urllib.request.urlopen(reset_req)

    url = f"{BASE_URL}/api/signup"
    payload = json.dumps({"email": "dup@example.com", "password": "password123"}).encode("utf-8")
    
    # First registration
    req1 = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req1) as resp:
        if resp.status != 201:
            print(f"[ERROR] Failed initial setup registration: status {resp.status}")
            sys.exit(2)

    # Second registration with identical email
    req2 = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req2) as resp:
            print(f"[FAIL] Duplicate registration succeeded unexpectedly: {resp.status}")
            sys.exit(1)
    except urllib.error.HTTPError as e:
        if e.code == 500:
            print("[FAIL] Bug B2 is PRESENT: Duplicate email triggered HTTP 500 internal server error.")
            sys.exit(1)
        elif e.code == 409:
            print("[PASS] Bug B2 is ABSENT: Duplicate email correctly returned 409 Conflict.")
            sys.exit(0)
        else:
            print(f"[FAIL] Unexpected error status: {e.code}")
            sys.exit(1)

if __name__ == "__main__":
    test_b2()
