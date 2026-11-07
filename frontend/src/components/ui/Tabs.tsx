"use client";

import React from "react";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

export type TabsVariant = "pills" | "underline" | "segmented";
export type TabsSize = "sm" | "md" | "lg";

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: TabsVariant;
  size?: TabsSize;
  fullWidth?: boolean;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = "pills",
  size = "md",
  fullWidth = false,
  className = "",
}) => {
  const sizeStyles: Record<TabsSize, string> = {
    sm: "text-xs py-1.5 px-3 gap-1.5",
    md: "text-xs sm:text-sm py-2 px-3.5 sm:px-4 gap-2",
    lg: "text-sm sm:text-base py-2.5 px-5 gap-2.5",
  };

  if (variant === "segmented") {
    return (
      <div
        className={`inline-flex p-1 rounded-md bg-[#F1F5F9] border border-[#CBD5E1] overflow-x-auto max-w-full ${
          fullWidth ? "w-full" : ""
        } ${className}`}
      >
        <div className="flex gap-1 min-w-full">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                disabled={tab.disabled}
                onClick={() => onChange(tab.id)}
                className={`flex items-center justify-center font-medium rounded transition-all duration-200 select-none whitespace-nowrap
                  ${sizeStyles[size]} ${fullWidth ? "flex-1" : ""}
                  ${
                    isActive
                      ? "bg-[#FFFFFF] text-[#2563EB] shadow-xs font-bold"
                      : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#FFFFFF]/60"
                  }
                  ${tab.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
              >
                {tab.icon && <span className="shrink-0">{tab.icon}</span>}
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isActive ? "bg-[#2563EB] text-[#FFFFFF]" : "bg-[#E2E8F0] text-[#64748B]"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (variant === "underline") {
    return (
      <div className={`border-b border-[#E2E8F0] overflow-x-auto ${className}`}>
        <nav className="flex gap-4 sm:gap-6 min-w-max">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                disabled={tab.disabled}
                onClick={() => onChange(tab.id)}
                className={`group relative flex items-center gap-2 pb-3 pt-2 font-medium transition-colors select-none whitespace-nowrap
                  text-xs sm:text-sm
                  ${
                    isActive
                      ? "text-[#2563EB] font-bold"
                      : "text-[#64748B] hover:text-[#0F172A]"
                  }
                  ${tab.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
              >
                {tab.icon && <span className="shrink-0">{tab.icon}</span>}
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                      isActive ? "bg-[#2563EB] text-[#FFFFFF]" : "bg-[#F1F5F9] text-[#64748B] border border-[#CBD5E1]"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
                {/* Active Indicator Bar */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] rounded-t-full shadow-xs" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    );
  }

  // Default: Pills
  return (
    <div className={`flex items-center gap-2 overflow-x-auto max-w-full pb-1 ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={`flex items-center justify-center font-medium rounded-md transition-all duration-200 select-none whitespace-nowrap
              ${sizeStyles[size]}
              ${
                isActive
                  ? "bg-[#2563EB] text-[#FFFFFF] font-bold shadow-md shadow-[#2563EB]/20 border border-[#2563EB]"
                  : "bg-[#FFFFFF] text-[#64748B] hover:text-[#2563EB] hover:border-[#2563EB] border border-[#CBD5E1] shadow-xs"
              }
              ${tab.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isActive ? "bg-[#FFFFFF] text-[#2563EB]" : "bg-[#F1F5F9] text-[#64748B] border border-[#CBD5E1]"
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
