import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const unwrappedParams = await params;
  const runId = unwrappedParams.id;

  // Discovered application model
  return NextResponse.json({
    run_id: runId,
    truncated: false,
    routes: [
      "/",
      "/signup",
      "/login",
      "/forgot-password",
      "/account",
      "/products",
      "/products/:id",
      "/cart",
      "/checkout",
    ],
    states: [
      { id: "st_01", route_template: "/", title: "Home" },
      { id: "st_02", route_template: "/signup", title: "Create Account" },
      { id: "st_03", route_template: "/login", title: "Login" },
      { id: "st_04", route_template: "/forgot-password", title: "Forgot Password" },
      { id: "st_05", route_template: "/account", title: "Account Dashboard" },
      { id: "st_06", route_template: "/products", title: "Products" },
      { id: "st_07", route_template: "/cart", title: "Shopping Cart" },
      { id: "st_08", route_template: "/checkout", title: "Checkout" },
    ],
  });
}
