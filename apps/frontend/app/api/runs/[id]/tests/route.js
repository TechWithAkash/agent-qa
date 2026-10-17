import { NextResponse } from "next/server";
import { getStore } from "../../../store";

export async function GET(req, { params }) {
  const unwrappedParams = await params;
  const runId = unwrappedParams.id;

  const store = getStore();
  const testCode = store.generatedTests?.get(runId);
  const telemetry = store.telemetry?.get(runId);
  const model = store.models?.get(runId);

  return NextResponse.json({
    run_id: runId,
    test_code: testCode || null,
    telemetry: telemetry || null,
    model: model || null,
  });
}
