import { NextResponse } from "next/server";
import { getStore } from "../../store";

export async function GET(req, { params }) {
  const unwrappedParams = await params;
  const runId = unwrappedParams.id;

  const backendUrl = process.env.BACKEND_API_URL;
  if (backendUrl) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 800);

      const res = await fetch(`${backendUrl}/runs/${runId}`, { signal: controller.signal });
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
  if (!run) {
    return NextResponse.json({ error: { message: "Run not found" } }, { status: 404 });
  }

  return NextResponse.json(run);
}
