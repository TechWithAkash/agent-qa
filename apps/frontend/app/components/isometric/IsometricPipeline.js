"use client";

import { GitPullRequest, Clock, Bell, CheckCircle2 } from "lucide-react";

export default function IsometricPipeline() {
  const steps = [
    {
      icon: GitPullRequest,
      title: "PR & Commit CI",
      desc: "Automatically tests user flows on every pull request before code is merged.",
    },
    {
      icon: Clock,
      title: "Scheduled Audits",
      desc: "Runs continuous background health sweeps on staging and production environments.",
    },
    {
      icon: Bell,
      title: "Slack & Webhook Dispatch",
      desc: "Instantly alerts your engineering team with video replay, DOM selectors, and stack traces.",
    },
  ];

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
      {/* Left Column: Stepwise Workflow List */}
      <div className="lg:col-span-5 space-y-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={idx} className="flex gap-4 group">
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#e6e9ee] bg-white text-[#2D9FFE] shadow-2xs group-hover:border-[#2D9FFE] transition-colors">
                  <Icon className="h-4 w-4" />
                </div>
                {idx < steps.length - 1 && (
                  <div className="w-px flex-1 bg-[#e6e9ee] my-2" />
                )}
              </div>
              <div className="pb-2">
                <h4 className="text-sm font-semibold text-[#000000] mb-1">
                  {step.title}
                </h4>
                <p className="text-xs text-[#525252] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Right Column: Isometric Multi-Tier Cloud Runner SVG */}
      <div className="lg:col-span-7 flex items-center justify-center">
        <div className="relative w-full max-w-[540px] aspect-[16/11] flex items-center justify-center">
          <svg
            viewBox="0 0 560 380"
            className="w-full h-full overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="pipeSky" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2D9FFE" />
                <stop offset="100%" stopColor="#0b7ee6" />
              </linearGradient>

              <filter id="pipeShadow" x="-10%" y="-10%" width="120%" height="130%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.05" />
              </filter>
            </defs>

            {/* Isometric Ray Matrix */}
            <g stroke="#E6E9EE" strokeWidth="1" strokeDasharray="3 3">
              <line x1="80" y1="190" x2="480" y2="190" />
              <line x1="120" y1="90" x2="440" y2="290" />
              <line x1="120" y1="290" x2="440" y2="90" />
            </g>

            {/* TOP TIER: Dark CI Host Block (e.g. GitHub Actions / Cloud Runner) */}
            <g transform="translate(240, 40)" filter="url(#pipeShadow)">
              {/* Box Top */}
              <polygon points="60,35 120,10 180,35 120,60" fill="#000000" stroke="#000000" strokeWidth="1" />
              {/* Box Left Side */}
              <polygon points="60,35 120,60 120,80 60,55" fill="#171717" stroke="#000000" strokeWidth="1" />
              {/* Box Right Side */}
              <polygon points="180,35 120,60 120,80 180,55" fill="#262626" stroke="#000000" strokeWidth="1" />

              {/* Status Indicator */}
              <circle cx="120" cy="35" r="4" fill="#10B981" />
              <text x="120" y="24" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontFamily="system-ui" fontWeight="600">CI Runner</text>
            </g>

            {/* Conduit Pipe Downward */}
            <path
              d="M360,110 L360,150 L280,190"
              stroke="#2D9FFE"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* MIDDLE TIER: Isometric Flow Stage Platters */}
            <g transform="translate(140, 140)">
              {/* Platform 1 */}
              <polygon points="40,60 90,35 140,60 90,85" fill="#FFFFFF" stroke="#E6E9EE" strokeWidth="1.2" />
              <circle cx="90" cy="60" r="3" fill="#2D9FFE" />
              <text x="90" y="50" textAnchor="middle" fill="#525252" fontSize="7.5" fontFamily="system-ui">Route Graph</text>
            </g>

            <g transform="translate(280, 180)">
              {/* Platform 2 (Middle) */}
              <polygon points="40,60 90,35 140,60 90,85" fill="#FFFFFF" stroke="#2D9FFE" strokeWidth="1.2" />
              <circle cx="90" cy="60" r="3" fill="#10B981" />
              <text x="90" y="50" textAnchor="middle" fill="#000000" fontSize="7.5" fontFamily="system-ui" fontWeight="600">3× Replay</text>
            </g>

            {/* Connecting Rays */}
            <line x1="230" y1="200" x2="330" y2="240" stroke="#CBD5E1" strokeWidth="1.5" />

            {/* BOTTOM TIER: DRISHTI Core Agent Plinth (Cyan/Blue Diamond) */}
            <g transform="translate(320, 240)" filter="url(#pipeShadow)">
              <polygon points="40,50 90,25 140,50 90,75" fill="url(#pipeSky)" stroke="#2D9FFE" strokeWidth="1.5" />
              <polygon points="55,50 90,33 125,50 90,67" fill="#FFFFFF" />
              <text x="90" y="53" textAnchor="middle" fill="#0b7ee6" fontSize="8" fontFamily="system-ui" fontWeight="bold">DRISHTI</text>
            </g>

            {/* Leftmost Edge Trigger Node (Slack/Webhook notification) */}
            <g transform="translate(80, 220)">
              <polygon points="30,40 70,20 110,40 70,60" fill="#FFFFFF" stroke="#E6E9EE" strokeWidth="1" />
              <circle cx="70" cy="40" r="3" fill="#10B981" />
              <text x="70" y="32" textAnchor="middle" fill="#262626" fontSize="7" fontFamily="system-ui">Slack Alert</text>
              <line x1="150" y1="260" x2="230" y2="200" stroke="#2D9FFE" strokeWidth="1.2" strokeDasharray="3 3" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
