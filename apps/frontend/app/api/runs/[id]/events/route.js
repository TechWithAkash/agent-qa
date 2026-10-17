import { NextResponse } from "next/server";
import { getStore } from "../../../store";

export async function GET(req, { params }) {
  const unwrappedParams = await params;
  const runId = unwrappedParams.id;
  const { searchParams } = new URL(req.url);
  const afterSeq = parseInt(searchParams.get("after") || "0", 10);

  const backendUrl = process.env.BACKEND_API_URL;
  if (backendUrl) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 800);

      const res = await fetch(`${backendUrl}/runs/${runId}/events?after=${afterSeq}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch (e) {
      // Fall through to in-memory store
    }
  }

  const store = getStore();
  const run = store.runs.get(runId);
  const allEvents = store.events.get(runId) || [];
  const deltaEvents = allEvents.filter((e) => e.seq > afterSeq);
  const nextAfter = deltaEvents.length > 0 ? deltaEvents[deltaEvents.length - 1].seq : afterSeq;

  return NextResponse.json({
    status: run?.status || "preflight",
    stage: run?.stage || "S1",
    events: deltaEvents,
    next_after: nextAfter,
  });
}
