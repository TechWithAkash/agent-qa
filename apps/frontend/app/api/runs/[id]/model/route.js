import { NextResponse } from "next/server";
import { getStore } from "../../../store";

export async function GET(req, { params }) {
  const unwrappedParams = await params;
  const runId = unwrappedParams.id;

  const store = getStore();
  const model = store.models.get(runId);

  if (model) {
    return NextResponse.json(model);
  }

  // Fallback default
  return NextResponse.json({
    run_id: runId,
    truncated: false,
    routes: ["/", "/about", "/contact", "/pricing"],
    states: [
      { id: "st_01", route_template: "/", title: "Home" },
      { id: "st_02", route_template: "/about", title: "About" },
      { id: "st_03", route_template: "/contact", title: "Contact" },
      { id: "st_04", route_template: "/pricing", title: "Pricing" },
    ],
  });
}
