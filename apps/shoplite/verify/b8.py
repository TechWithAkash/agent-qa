"""
Verification script for Bug B8: Checkout with empty cart causes TypeError / crash.
Pass means bug is absent (i.e. returns empty checkout prompt without server error).
"""

import sys
import urllib.request
import urllib.error

BASE_URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3001"

def test_b8():
    # Reset state to ensure cart is empty
    reset_req = urllib.request.Request(f"{BASE_URL}/__test/reset", method="POST")
    urllib.request.urlopen(reset_req)

    url = f"{BASE_URL}/checkout"
    req = urllib.request.Request(url, method="GET")

    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode("utf-8")
            if "Your Cart Is Empty" in html or "empty" in html.lower():
                print("[PASS] Bug B8 is ABSENT: Empty checkout displayed user-friendly empty message.")
                sys.exit(0)
            else:
                print("[FAIL] Unexpected response without error or empty cart message.")
                sys.exit(1)
    except urllib.error.HTTPError as e:
        if e.code == 500:
            print("[FAIL] Bug B8 is PRESENT: Empty checkout crashed with 500 TypeError.")
            sys.exit(1)
        else:
            print(f"[FAIL] Unexpected status code: {e.code}")
            sys.exit(1)

if __name__ == "__main__":
    test_b8()
