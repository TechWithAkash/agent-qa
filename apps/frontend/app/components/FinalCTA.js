"use client";

import { Play, ArrowUpRight, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export default function FinalCTA({ onLaunchClick }) {
  return (
    <section className="py-24 lg:py-32 bg-white border-t border-[#e6e9ee] text-center">
      <div className="mx-auto max-w-[800px] px-4 sm:px-6">
        <Badge variant="subtle" className="mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2D9FFE]" />
          <span>Autonomous Quality Engineering</span>
        </Badge>

        <h2 className="text-3xl sm:text-5xl font-semibold text-[#000000] tracking-tight max-w-2xl mx-auto leading-tight">
          Give your application a more independent QA engineer.
        </h2>

        <p className="mt-4 text-base text-[#525252] max-w-xl mx-auto leading-relaxed">
          Start with a URL, define the behavioral constraints that matter, and let DRISHTI autonomously explore, verify, and document.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            size="lg"
            onClick={onLaunchClick}
            className="w-full sm:w-auto text-xs sm:text-sm font-semibold shadow-xs"
          >
            <Play className="w-4 h-4 fill-current text-white" />
            <span>Launch a QA Run</span>
          </Button>

          <a
            href="https://github.com/TechWithAkash/agent-qa"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto"
          >
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-xs sm:text-sm font-medium"
            >
              <span>Read the Documentation</span>
              <ArrowUpRight className="w-4 h-4 text-[#737373]" />
            </Button>
          </a>
        </div>

        <div className="mt-10 text-xs text-[#737373] flex items-center justify-center gap-4">
          <span>Browser-based execution</span>
          <span>&bull;</span>
          <span>3× Replay Evidence</span>
          <span>&bull;</span>
          <span>Zero Flakiness</span>
        </div>
      </div>
    </section>
  );
}
