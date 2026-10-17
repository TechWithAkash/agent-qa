import { NextResponse } from "next/server";
import { createRun, getStore } from "../store";

export async function POST(req) {
  try {
    const body = await req.json();

    const backendUrl = process.env.BACKEND_API_URL;
    if (backendUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 800);

        const res = await fetch(`${backendUrl}/runs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          return NextResponse.json(data, { status: 202 });
        }
      } catch (e) {
        // Backend not responding, proceed to fallback in-memory engine
      }
    }

    // In-memory autonomous engine
    const runDoc = createRun(body);
    return NextResponse.json(
      {
        run_id: runDoc.run_id,
        status: "queued",
        events_url: `/api/runs/${runDoc.run_id}/events?after=0`,
      },
      { status: 202 }
    );
  } catch (err) {
    return NextResponse.json({ error: { message: err.message } }, { status: 500 });
  }
}

export async function GET() {
  const store = getStore();
  const runs = Array.from(store.runs.values());
  return NextResponse.json({ items: runs, total: runs.length });
}
