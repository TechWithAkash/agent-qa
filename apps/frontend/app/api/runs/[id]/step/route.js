import { NextResponse } from "next/server";
import { executeNaturalLanguageStep, getStore } from "../../../store";

export async function POST(req, { params }) {
  try {
    const unwrappedParams = await params;
    const runId = unwrappedParams.id;
    const body = await req.json();

    const stepText = body.step_text || body.step || "Assert primary headline is visible";
    const result = await executeNaturalLanguageStep(runId, stepText);

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
    const steps = store.nlSteps.get(runId) || [];

    return NextResponse.json({ steps });
  } catch (err) {
    return NextResponse.json({ error: { message: err.message } }, { status: 500 });
  }
}
