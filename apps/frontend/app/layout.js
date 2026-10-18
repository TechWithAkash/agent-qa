import "./globals.css";
import { Suspense } from "react";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "DRISHTI AI — Autonomous AI QA Engineer",
  description:
    "Autonomous QA platform: deterministic graph exploration, grounded assertion planning, 3x replay failure verification, and standalone pytest-playwright regression suite generation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col antialiased bg-[#FAFAF9] text-[#171717] selection:bg-[#F97316]/20 selection:text-[#171717]">
        {/* Top Navigation - Interactive with localStorage session sync */}
        <Suspense fallback={<div className="h-14 border-b border-[#E5E5E5] bg-[#FAFAF9]" />}>
          <Navbar />
        </Suspense>

        {/* Main Application Body */}
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
