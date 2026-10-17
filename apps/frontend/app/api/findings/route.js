import { NextResponse } from "next/server";
import { getStore } from "../store";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const runId = searchParams.get("run_id");

  const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8000/api";
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 800);

    const res = await fetch(`${backendUrl}/findings?run_id=${runId || ""}`, {
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

  const store = getStore();
  const findings = runId ? store.findings.get(runId) || [] : [];
  return NextResponse.json({
    items: findings,
    total: findings.length,
  });
}
