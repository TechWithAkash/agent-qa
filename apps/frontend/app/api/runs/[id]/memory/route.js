import { NextResponse } from "next/server";
import { getStore } from "../../../store";

export async function GET(req, { params }) {
  try {
    const unwrappedParams = await params;
    const runId = unwrappedParams.id;
    const store = getStore();

    const memories = store.memories.get(runId) || [];
    const chains = store.healedChains.get(runId) || [];

    return NextResponse.json({
      run_id: runId,
      memories: memories,
      healed_chains: chains,
      total_memories: memories.length,
    });
  } catch (err) {
    return NextResponse.json({ error: { message: err.message } }, { status: 500 });
  }
}
