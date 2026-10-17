import { NextResponse } from "next/server";
import { triggerSelfHealing, getStore } from "../../../store";

export async function POST(req, { params }) {
  try {
    const unwrappedParams = await params;
    const runId = unwrappedParams.id;
    let body = {};
    try {
      body = await req.json();
    } catch (e) {}

    const brokenSelector = body?.broken_selector || null;
    const result = await triggerSelfHealing(runId, brokenSelector);

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: { message: err.message } }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  try {
    const unwrappedParams = await params;
    const runId = unwrappedParams.id;
    const store = getStore();
    const chains = store.healedChains.get(runId) || [];

    return NextResponse.json({ items: chains });
  } catch (err) {
    return NextResponse.json({ error: { message: err.message } }, { status: 500 });
  }
}
