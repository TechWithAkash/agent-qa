"use client";

import { X, ExternalLink } from "lucide-react";

export default function ScreenshotLightbox({ fullImageModal, setFullImageModal }) {
  if (!fullImageModal) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-[#e6e9ee] overflow-hidden">
        {/* Modal Browser Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#e6e9ee] bg-[#fafafa]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56]"></span>
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e]"></span>
              <span className="w-3 h-3 rounded-full bg-[#27c93f]"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#000000]">{fullImageModal.title}</span>
                {fullImageModal.route && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white text-[#000000] font-semibold border border-[#e6e9ee]">
                    {fullImageModal.route}
                  </span>
                )}
              </div>
              {fullImageModal.description && (
                <p className="text-[11px] text-[#737373] font-mono mt-0.5 truncate max-w-xl">
                  {fullImageModal.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={fullImageModal.src}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-[#e6e9ee] hover:bg-[#fafafa] text-[#525252] text-xs font-mono transition-colors shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#737373]" />
              <span>Open Raw</span>
            </a>
            <button
              type="button"
              onClick={() => setFullImageModal(null)}
              className="p-1.5 rounded-lg text-[#737373] hover:text-[#000000] hover:bg-[#fafafa] transition-colors cursor-pointer"
              title="Close Fullscreen Viewport"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Image Viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-zinc-100 flex justify-center items-start">
          <div className="relative w-full max-w-5xl shadow-lg rounded-xl overflow-hidden border border-[#e6e9ee] bg-white">
            <img
              src={fullImageModal.src}
              alt={fullImageModal.title}
              className="w-full h-auto block select-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
