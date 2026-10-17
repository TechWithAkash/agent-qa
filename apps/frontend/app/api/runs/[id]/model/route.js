import { NextResponse } from "next/server";
import { getStore } from "../../../store";

export async function GET(req, { params }) {
  const unwrappedParams = await params;
  const runId = unwrappedParams.id;

  const store = getStore();
  const model = store.models.get(runId);
  const run = store.runs.get(runId);

  if (model) {
    return NextResponse.json(model);
  }

  const targetUrl = run?.target_url || "Target Application";
  let host = "Target";
  try {
    host = new URL(targetUrl).hostname;
  } catch (e) {}

  return NextResponse.json({
    run_id: runId,
    target_url: targetUrl,
    title: `${host} Model`,
    truncated: false,
    routes: ["/"],
    states: [
      { id: "st_01", route_template: "/", title: `${host} Root` },
    ],
    headings: [],
    buttons: [],
    inputs: [],
    discoveredElements: [],
  });
}
