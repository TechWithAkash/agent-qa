"use client";

import { useState } from "react";
import WorkspaceSidebar from "./WorkspaceSidebar";
import WorkspaceHeader from "./WorkspaceHeader";
import QuickLaunchModal from "./QuickLaunchModal";

export default function WorkspaceLayout({ children }) {
  const [isQuickLaunchOpen, setIsQuickLaunchOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white text-[#262626]">
      {/* Persistent Left Sidebar */}
      <WorkspaceSidebar
        onOpenQuickLaunch={() => setIsQuickLaunchOpen(true)}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Workspace Top Header Bar */}
        <WorkspaceHeader
          onOpenQuickLaunch={() => setIsQuickLaunchOpen(true)}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto bg-[#fafafa]/50">
          {children}
        </main>
      </div>

      {/* Quick Launch Modal */}
      <QuickLaunchModal
        isOpen={isQuickLaunchOpen}
        onClose={() => setIsQuickLaunchOpen(false)}
      />
    </div>
  );
}
