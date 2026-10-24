"use client";

import { useState } from "react";
import { Terminal, Copy, Check, Sparkles } from "lucide-react";

export default function IsometricFlowCluster() {
  const [copied, setCopied] = useState(false);
  const commandText = "npx drishti-ai map https://your-app.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(commandText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Terminal Command Input Pill */}
      <div className="flex items-center gap-2 sm:gap-3 px-4 py-2 rounded-full bg-[#000000] text-white shadow-md border border-[#333333] mb-8 font-mono text-xs sm:text-sm select-all">
        <span className="text-[#2D9FFE] font-bold">&gt;</span>
        <span className="text-zinc-200">{commandText}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="ml-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          title="Copy command"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Isometric Vector Graph Illustration */}
      <div className="relative w-full max-w-[840px] aspect-[16/9] sm:aspect-[2.1/1] flex items-center justify-center">
        <svg
          viewBox="0 0 880 420"
          className="w-full h-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="flowSkyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2D9FFE" />
              <stop offset="100%" stopColor="#0b7ee6" />
            </linearGradient>

            <linearGradient id="nodeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2D9FFE" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#2D9FFE" stopOpacity="0" />
            </linearGradient>

            <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="3" stdDeviation="5" floodOpacity="0.05" />
            </filter>
          </defs>

          {/* Isometric Perspective Coordinate Web */}
          <g stroke="#E6E9EE" strokeWidth="1" strokeDasharray="3 3" opacity="0.75">
            <line x1="100" y1="210" x2="780" y2="210" />
            <line x1="440" y1="50" x2="440" y2="370" />
            <line x1="140" y1="80" x2="740" y2="340" />
            <line x1="140" y1="340" x2="740" y2="80" />
          </g>

          {/* Central Radial Ambient Rings */}
          <ellipse cx="440" cy="210" rx="320" ry="140" stroke="#F0F2F5" strokeWidth="1.5" />
          <ellipse cx="440" cy="210" rx="200" ry="90" stroke="#E6E9EE" strokeWidth="1.2" strokeDasharray="4 4" />
          <ellipse cx="440" cy="210" rx="90" ry="40" fill="url(#nodeGlow)" />

          {/* Radiating Flow Lines from Central Hub to Satellite Cards */}
          <g stroke="#2D9FFE" strokeWidth="1.2" strokeDasharray="3 3">
            <line x1="440" y1="210" x2="220" y2="120" />
            <line x1="440" y1="210" x2="200" y2="260" />
            <line x1="440" y1="210" x2="310" y2="330" />
            <line x1="440" y1="210" x2="570" y2="330" />
            <line x1="440" y1="210" x2="680" y2="260" />
            <line x1="440" y1="210" x2="660" y2="120" />
            <line x1="440" y1="210" x2="330" y2="90" />
            <line x1="440" y1="210" x2="550" y2="90" />
          </g>

          {/* Peripheral Node 1: Top-Left (/auth/signup) */}
          <g transform="translate(150, 95)" filter="url(#cardShadow)">
            <polygon points="20,25 75,0 130,25 75,50" fill="#FFFFFF" stroke="#E6E9EE" strokeWidth="1.2" />
            <circle cx="75" cy="25" r="4" fill="#10B981" />
            <text x="75" y="42" textAnchor="middle" fill="#262626" fontSize="8.5" fontFamily="system-ui" fontWeight="600">/auth/signup</text>
          </g>

          {/* Peripheral Node 2: Mid-Left (/checkout) */}
          <g transform="translate(130, 235)" filter="url(#cardShadow)">
            <polygon points="20,25 75,0 130,25 75,50" fill="#FFFFFF" stroke="#2D9FFE" strokeWidth="1.2" />
            <circle cx="75" cy="25" r="4" fill="#2D9FFE" />
            <text x="75" y="42" textAnchor="middle" fill="#000000" fontSize="8.5" fontFamily="system-ui" fontWeight="600">/checkout</text>
          </g>

          {/* Peripheral Node 3: Bottom-Left (/cart) */}
          <g transform="translate(250, 305)" filter="url(#cardShadow)">
            <polygon points="15,20 60,0 105,20 60,40" fill="#FFFFFF" stroke="#E6E9EE" strokeWidth="1" />
            <circle cx="60" cy="20" r="3" fill="#10B981" />
            <text x="60" y="34" textAnchor="middle" fill="#525252" fontSize="7.5" fontFamily="system-ui">/cart</text>
          </g>

          {/* Peripheral Node 4: Top-Right (/dashboard) */}
          <g transform="translate(590, 95)" filter="url(#cardShadow)">
            <polygon points="20,25 75,0 130,25 75,50" fill="#FFFFFF" stroke="#E6E9EE" strokeWidth="1.2" />
            <circle cx="75" cy="25" r="4" fill="#10B981" />
            <text x="75" y="42" textAnchor="middle" fill="#262626" fontSize="8.5" fontFamily="system-ui" fontWeight="600">/dashboard</text>
          </g>

          {/* Peripheral Node 5: Mid-Right (/settings) */}
          <g transform="translate(610, 235)" filter="url(#cardShadow)">
            <polygon points="20,25 75,0 130,25 75,50" fill="#FFFFFF" stroke="#E6E9EE" strokeWidth="1.2" />
            <circle cx="75" cy="25" r="4" fill="#10B981" />
            <text x="75" y="42" textAnchor="middle" fill="#262626" fontSize="8.5" fontFamily="system-ui" fontWeight="600">/settings</text>
          </g>

          {/* Peripheral Node 6: Bottom-Right (/api/health) */}
          <g transform="translate(520, 305)" filter="url(#cardShadow)">
            <polygon points="15,20 60,0 105,20 60,40" fill="#FFFFFF" stroke="#E6E9EE" strokeWidth="1" />
            <circle cx="60" cy="20" r="3" fill="#10B981" />
            <text x="60" y="34" textAnchor="middle" fill="#525252" fontSize="7.5" fontFamily="system-ui">/api/health</text>
          </g>

          {/* Top Orbit Small Nodes */}
          <g transform="translate(290, 65)">
            <polygon points="10,15 40,0 70,15 40,30" fill="#F8FAFC" stroke="#D6DBE1" strokeWidth="0.8" />
            <circle cx="40" cy="15" r="2.5" fill="#2D9FFE" />
          </g>

          <g transform="translate(510, 65)">
            <polygon points="10,15 40,0 70,15 40,30" fill="#F8FAFC" stroke="#D6DBE1" strokeWidth="0.8" />
            <circle cx="40" cy="15" r="2.5" fill="#10B981" />
          </g>

          {/* =========================================================================
              CENTRAL RUNNER CORE (The Engine Node)
              ========================================================================= */}
          <g transform="translate(390, 160)">
            {/* Ground Ring */}
            <ellipse cx="50" cy="50" rx="60" ry="25" fill="#EEF2F6" stroke="#D6DBE1" strokeWidth="1" />

            {/* Radiant Diamond Plinth */}
            <polygon points="10,48 50,22 90,48 50,74" fill="url(#flowSkyGrad)" stroke="#2D9FFE" strokeWidth="2" filter="url(#cardShadow)" />

            {/* Inner Brand Emblem */}
            <polygon points="25,48 50,32 75,48 50,64" fill="#FFFFFF" />
            <path d="M47,42 L53,42 L55,48 L52,48 L50,54 L47,54 Z" fill="#2D9FFE" />

            {/* Pulse Indicator Ping */}
            <circle cx="50" cy="48" r="3" fill="#2D9FFE" />
          </g>
        </svg>
      </div>
    </div>
  );
}
