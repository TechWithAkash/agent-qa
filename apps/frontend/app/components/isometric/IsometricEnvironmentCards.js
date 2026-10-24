"use client";

import { Monitor, Smartphone, CheckCircle2, ShieldCheck } from "lucide-react";

export default function IsometricEnvironmentCards() {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
      {/* =========================================================================
          CARD 1: DESKTOP BROWSER ENVIRONMENT (Web Viewport)
          ========================================================================= */}
      <div className="relative rounded-2xl border border-[#e6e9ee] bg-white p-6 sm:p-8 shadow-xs hover:border-[#cbd5e1] transition-all flex flex-col justify-between">
        {/* Top Badges */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2D9FFE]/10 text-[#2D9FFE]">
              <Monitor className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#000000]">
                Desktop Chromium &amp; WebKit
              </h4>
              <span className="text-[11px] font-mono text-[#737373]">
                1440×900 • 3× Replay Isolation
              </span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" />
            100% Passed
          </span>
        </div>

        {/* Isometric SVG Illustration of Desktop Laptop Viewport */}
        <div className="relative w-full aspect-[16/10] flex items-center justify-center my-2">
          <svg
            viewBox="0 0 460 260"
            className="w-full h-full overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Perspective Grid Plane */}
            <g stroke="#F0F2F5" strokeWidth="1" strokeDasharray="3 3">
              <line x1="40" y1="130" x2="420" y2="130" />
              <line x1="70" y1="60" x2="390" y2="200" />
              <line x1="70" y1="200" x2="390" y2="60" />
            </g>

            {/* Elevated Isometric Base Plinth */}
            <polygon
              points="60,140 230,65 400,140 230,215"
              fill="#FFFFFF"
              stroke="#E6E9EE"
              strokeWidth="1.2"
            />
            <polygon
              points="80,140 230,75 380,140 230,205"
              stroke="#F0F2F5"
              strokeWidth="1"
            />

            {/* Laptop Base */}
            <polygon
              points="120,145 230,95 340,145 230,195"
              fill="#F8FAFC"
              stroke="#CBD5E1"
              strokeWidth="1.2"
            />

            {/* Laptop Open Display Screen */}
            <polygon
              points="140,135 140,30 320,65 320,145"
              fill="#0F172A"
              stroke="#000000"
              strokeWidth="1.5"
            />
            {/* Screen Panel */}
            <polygon
              points="146,130 146,38 314,71 314,140"
              fill="#FFFFFF"
            />

            {/* Simulated UI layout on Screen */}
            <line x1="154" y1="52" x2="306" y2="83" stroke="#E2E8F0" strokeWidth="1.5" />
            <rect x="156" y="62" width="55" height="18" fill="#EFF6FF" stroke="#2D9FFE" strokeWidth="0.8" rx="2" transform="skewY(12)" />
            <rect x="220" y="74" width="75" height="18" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="0.8" rx="2" transform="skewY(12)" />
            <rect x="156" y="90" width="138" height="30" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="0.8" rx="2" transform="skewY(12)" />

            {/* Radiant Verified Nodes on Base */}
            <circle cx="110" cy="140" r="5" fill="#2D9FFE" />
            <circle cx="110" cy="140" r="2" fill="#FFFFFF" />
            <circle cx="350" cy="140" r="5" fill="#10B981" />
            <circle cx="350" cy="140" r="2" fill="#FFFFFF" />

            <path
              d="M110,140 L230,195 L350,140"
              stroke="#2D9FFE"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />
          </svg>
        </div>

        {/* Feature Checkpoints */}
        <div className="mt-4 pt-4 border-t border-[#f0f0f0] grid grid-cols-2 gap-2 text-xs text-[#525252]">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Full SPA Navigation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>DOM Accessibility Tree</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          CARD 2: MOBILE VIEWPORT ENVIRONMENT (Mobile Safari & Chrome)
          ========================================================================= */}
      <div className="relative rounded-2xl border border-[#e6e9ee] bg-white p-6 sm:p-8 shadow-xs hover:border-[#cbd5e1] transition-all flex flex-col justify-between">
        {/* Top Badges */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2D9FFE]/10 text-[#2D9FFE]">
              <Smartphone className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#000000]">
                Mobile iOS &amp; Android
              </h4>
              <span className="text-[11px] font-mono text-[#737373]">
                390×844 • Touch Gestures &amp; Tap Targets
              </span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" />
            100% Passed
          </span>
        </div>

        {/* Isometric SVG Illustration of Mobile Viewport Stand */}
        <div className="relative w-full aspect-[16/10] flex items-center justify-center my-2">
          <svg
            viewBox="0 0 460 260"
            className="w-full h-full overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Grid Coordinates */}
            <g stroke="#F0F2F5" strokeWidth="1" strokeDasharray="3 3">
              <line x1="40" y1="130" x2="420" y2="130" />
              <line x1="70" y1="60" x2="390" y2="200" />
              <line x1="70" y1="200" x2="390" y2="60" />
            </g>

            {/* Elevated Platform */}
            <polygon
              points="70,140 230,70 390,140 230,210"
              fill="#FFFFFF"
              stroke="#E6E9EE"
              strokeWidth="1.2"
            />

            {/* Mobile Device Stand Base */}
            <polygon
              points="180,165 230,145 280,165 230,185"
              fill="#F1F5F9"
              stroke="#CBD5E1"
              strokeWidth="1"
            />

            {/* Upright Phone Chassis */}
            <polygon
              points="195,155 195,35 265,50 265,170"
              fill="#000000"
              stroke="#000000"
              strokeWidth="1.5"
            />
            {/* Screen Panel */}
            <polygon
              points="198,150 198,40 262,54 262,164"
              fill="#FFFFFF"
            />

            {/* Mobile App Screen Wireframe */}
            <line x1="204" y1="58" x2="256" y2="68" stroke="#2D9FFE" strokeWidth="2" strokeLinecap="round" />
            <rect x="204" y="74" width="48" height="20" fill="#F8FAFC" stroke="#E2E8F0" rx="2" transform="skewY(12)" />
            <rect x="204" y="104" width="48" height="20" fill="#EFF6FF" stroke="#2D9FFE" strokeWidth="0.8" rx="2" transform="skewY(12)" />

            {/* Connecting Isometric Line Nodes */}
            <circle cx="140" cy="150" r="4" fill="#2D9FFE" />
            <circle cx="320" cy="150" r="4" fill="#10B981" />
            <path
              d="M140,150 L230,185 L320,150"
              stroke="#2D9FFE"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />
          </svg>
        </div>

        {/* Feature Checkpoints */}
        <div className="mt-4 pt-4 border-t border-[#f0f0f0] grid grid-cols-2 gap-2 text-xs text-[#525252]">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Responsive Breakpoints</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Form &amp; Modal Overlays</span>
          </div>
        </div>
      </div>
    </div>
  );
}
