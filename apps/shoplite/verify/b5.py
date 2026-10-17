"""
Verification script for Bug B5: Search trailing whitespace causes zero results.
Pass means bug is absent (i.e. query 'Coffee ' returns matching products).
"""

import sys
import urllib.request
import urllib.parse
import re

BASE_URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3001"

def test_b5():
    query = urllib.parse.quote("Coffee ")
    url = f"{BASE_URL}/products?q={query}"
    req = urllib.request.Request(url, method="GET")

    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode("utf-8")
        if "Coffee Maker" in html:
            print("[PASS] Bug B5 is ABSENT: Search with trailing whitespace matched 'Coffee Maker'.")
            sys.exit(0)
        elif "No products found" in html:
            print("[FAIL] Bug B5 is PRESENT: Search with trailing whitespace returned 0 results.")
            sys.exit(1)
        else:
            print("[FAIL] Unexpected response.")
            sys.exit(1)

if __name__ == "__main__":
    test_b5()
