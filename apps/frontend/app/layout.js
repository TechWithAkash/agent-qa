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
    <html lang="en" className="h-full" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col antialiased bg-white text-[#262626] selection:bg-[#2D9FFE]/20 selection:text-[#000000]">
        {/* Floating Capsule Dock Navigation */}
        <Suspense fallback={<div className="h-16" />}>
          <Navbar />
        </Suspense>

        {/* Main Application Body */}
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
