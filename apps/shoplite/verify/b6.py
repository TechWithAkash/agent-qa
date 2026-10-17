"""
Verification script for Bug B6: Quantity validation bypass (0 or negative accepted).
Pass means bug is absent (i.e. quantity 0 is rejected with 400).
"""

import sys
import json
import urllib.request
import urllib.error

BASE_URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3001"

def test_b6():
    # Reset state
    reset_req = urllib.request.Request(f"{BASE_URL}/__test/reset", method="POST")
    urllib.request.urlopen(reset_req)

    url = f"{BASE_URL}/api/cart/add"
    payload = json.dumps({"productId": "p1", "quantity": 0}).encode("utf-8")
    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"}, method="POST")

    try:
        with urllib.request.urlopen(req) as resp:
            print("[FAIL] Bug B6 is PRESENT: Quantity 0 was accepted with status 200.")
            sys.exit(1)
    except urllib.error.HTTPError as e:
        if e.code == 400:
            print("[PASS] Bug B6 is ABSENT: Quantity 0 was correctly rejected with 400.")
            sys.exit(0)
        else:
            print(f"[FAIL] Unexpected error status: {e.code}")
            sys.exit(1)

if __name__ == "__main__":
    test_b6()
