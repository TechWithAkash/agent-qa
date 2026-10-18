import { NextResponse } from "next/server";
import { captureRouteScreenshot } from "../playwright-service";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const targetUrl = searchParams.get("url");
    const route = searchParams.get("route") || "/";
    const action = searchParams.get("action") || "view";
    const selector = searchParams.get("selector") || "";

    if (!targetUrl) {
      return new NextResponse("Missing url parameter", { status: 400 });
    }

    const { buffer, contentType, fromCache } = await captureRouteScreenshot(
      targetUrl,
      route,
      {
        action,
        selector,
        waitMs: 900,
      }
    );

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType || "image/png",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        "X-Drishti-Engine": "Playwright-Chromium",
        "X-Cache-Hit": fromCache ? "HIT" : "MISS",
      },
    });
  } catch (err) {
    if (err?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw err;
    }
    console.error("[Screenshot API] Fatal error:", err);
    return new NextResponse("Failed to capture screenshot", { status: 500 });
  }
}
