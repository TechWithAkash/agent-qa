# ShopLite — Application Description & Rules

## Overview
ShopLite is a modern e-commerce storefront allowing customers to browse products, manage shopping carts, apply discounts, and complete purchases.

## Authentication & User Accounts
- **Sign-Up**:
  - Requires a valid email address containing an `@` symbol and a valid domain format.
  - Requires a secure password with a minimum length of 8 characters.
  - Duplicate registration with an already registered email must be rejected with a user-friendly message informing the user that an account exists.
  - Upon successful registration, the user is redirected to the `/account` dashboard.
- **Login**:
  - Requires registered email and password.
  - Email addresses are strictly case-insensitive (`user@example.com` and `USER@example.com` refer to the same account).
  - Failed logins should display "Invalid email or password".
  - "Forgot password?" link on the login page directs to `/forgot-password` to allow password recovery.
- **Account Dashboard**:
  - Displays authenticated user details and active session status.

## Catalog & Search
- Customers can search for items by name or category.
- Search queries ignore leading and trailing whitespace.
- Clicking any product displays the item detail page with full description and quantity selector.

## Shopping Cart & Checkout
- **Cart**:
  - Product quantities in cart must always be positive integers (minimum quantity: 1).
  - The cart subtotal must equal the sum of each item's price multiplied by its quantity.
- **Checkout**:
  - Checkout is only valid for carts containing at least one item. Attempting to access checkout with an empty cart displays a prompt instructing the user to add items.
  - Promo coupons: Entering code `SAVE10` provides a 10% discount on the cart subtotal. The coupon applies once per order and does not stack upon multiple submissions.
  - Completing checkout generates an order confirmation receipt and clears the cart.
