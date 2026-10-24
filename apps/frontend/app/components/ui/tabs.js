"use client";

import { createContext, useContext, useState } from "react";
import { cn } from "../../lib/utils";

const TabsContext = createContext({
  activeTab: "",
  setActiveTab: () => {},
});

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  className,
  children,
}) {
  const [internalValue, setInternalValue] = useState(defaultValue || "");
  const currentTab = value !== undefined ? value : internalValue;

  const handleTabChange = (val) => {
    if (value === undefined) {
      setInternalValue(val);
    }
    if (onValueChange) {
      onValueChange(val);
    }
  };

  return (
    <TabsContext.Provider
      value={{ activeTab: currentTab, setActiveTab: handleTabChange }}
    >
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, children }) {
  return (
    <div
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-lg bg-[#f4f4f5] p-1 text-[#71717a]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({ value, className, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      onClick={() => setActiveTab(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-xs font-medium ring-offset-white transition-all cursor-pointer focus-visible:outline-hidden",
        isActive
          ? "bg-white text-[#09090b] shadow-2xs font-semibold"
          : "text-[#71717a] hover:text-[#09090b]",
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, className, children }) {
  const { activeTab } = useContext(TabsContext);
  if (activeTab !== value) return null;

  return (
    <div
      className={cn(
        "mt-2 ring-offset-white focus-visible:outline-hidden",
        className
      )}
    >
      {children}
    </div>
  );
}
