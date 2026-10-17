"""
Verification script for Bug B3: Case-sensitive email matching.
Pass means bug is absent (i.e. user can log in with uppercase/mixed case email).
"""

import sys
import json
import urllib.request
import urllib.error

BASE_URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3001"

def test_b3():
    # Reset state
    reset_req = urllib.request.Request(f"{BASE_URL}/__test/reset", method="POST")
    urllib.request.urlopen(reset_req)

    # 1. Register with lowercase email
    signup_url = f"{BASE_URL}/api/signup"
    signup_payload = json.dumps({"email": "caseuser@example.com", "password": "password123"}).encode("utf-8")
    req1 = urllib.request.Request(signup_url, data=signup_payload, headers={"Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req1) as resp:
        if resp.status != 201:
            print(f"[ERROR] Failed initial registration: {resp.status}")
            sys.exit(2)

    # 2. Login with uppercase email
    login_url = f"{BASE_URL}/api/login"
    login_payload = json.dumps({"email": "CASEUSER@EXAMPLE.COM", "password": "password123"}).encode("utf-8")
    req2 = urllib.request.Request(login_url, data=login_payload, headers={"Content-Type": "application/json"}, method="POST")
    
    try:
        with urllib.request.urlopen(req2) as resp:
            if resp.status == 200:
                print("[PASS] Bug B3 is ABSENT: Uppercase email login succeeded as expected.")
                sys.exit(0)
            else:
                print(f"[FAIL] Unexpected response status: {resp.status}")
                sys.exit(1)
    except urllib.error.HTTPError as e:
        if e.code == 401:
            print("[FAIL] Bug B3 is PRESENT: Uppercase email login was rejected with 401.")
            sys.exit(1)
        else:
            print(f"[FAIL] Unexpected error status: {e.code}")
            sys.exit(1)

if __name__ == "__main__":
    test_b3()
