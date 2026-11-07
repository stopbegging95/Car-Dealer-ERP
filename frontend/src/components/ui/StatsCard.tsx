"use client";

import React from "react";
import { Card } from "./Card";

export interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  badge?: string;
  subtitle?: string;
  sparklinePath?: string;
  onClick?: () => void;
  className?: string;
}

/**
 * Reusable high-density Statistics & KPI Card component for dealership and customer dashboards.
 * Strictly adheres to luxury styling tokens: reduced radius (rounded-md), crisp typography,
 * optional dynamic SVG trend sparklines, and icon pill container.
 */
export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  trend,
  icon,
  badge,
  subtitle,
  sparklinePath = "M0 18 Q 20 5, 40 14 T 80 4 T 120 10",
  onClick,
  className = "",
}) => {
  const isUp = trend ? trend === "up" : isPositive;

  return (
    <Card
      hoverable={!!onClick}
      onClick={onClick}
      className={`p-4 sm:p-5 relative bg-[#FFFFFF] border border-[#E2E8F0] rounded-md shadow-xs transition-all hover:border-[#BFDBFE] ${className}`}
    >
      {/* Subtle Blue ambient glow on top right */}
      <div className="-top-12 -right-12 absolute bg-[#2563EB]/10 blur-2xl rounded-full w-28 h-28 pointer-events-none" />

      {/* Top Row: Title + Icon / Badge */}
      <div className="flex justify-between items-center mb-2.5 sm:mb-3">
        <span className="pr-2 font-semibold text-[#64748B] text-xs sm:text-sm truncate">
          {title}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {badge && (
            <span className="bg-[#EFF6FF] px-1.5 py-0.5 border border-[#BFDBFE] rounded font-mono font-bold text-[#1D4ED8] text-[10px]">
              {badge}
            </span>
          )}
          {icon && (
            <div className="flex justify-center items-center bg-[#EFF6FF] shadow-xs border border-[#BFDBFE] rounded-md w-8 h-8 shrink-0">
              <span className="text-[#2563EB] text-sm">{icon}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Metric Row: Value + Sparkline/Trend */}
      <div className="flex justify-between items-end gap-2">
        <div className="min-w-0">
          <div className="font-extrabold text-[#0F172A] text-xl sm:text-2xl md:text-3xl truncate tracking-tight">
            {value}
          </div>
          {change && (
            <div
              className={`inline-flex items-center gap-1 mt-1 text-[11px] sm:text-xs font-bold ${
                isUp ? "text-[#2563EB]" : "text-[#64748B]"
              }`}
            >
              <span>{change}</span>
            </div>
          )}
          {subtitle && (
            <div className="mt-0.5 text-[#94A3B8] text-[10px] truncate">
              {subtitle}
            </div>
          )}
        </div>

        {/* Dynamic Blue Sparkline Curve */}
        {sparklinePath && (
          <div className="pb-1 shrink-0">
            <svg className="w-16 sm:w-20 md:w-24 h-6 sm:h-7" viewBox="0 0 120 24" fill="none">
              <path
                d={sparklinePath}
                stroke="#2563EB"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
    </Card>
  );
};

// KPICard alias for backward compatibility across all existing dashboard imports
export const KPICard = StatsCard;
export type KPICardProps = StatsCardProps;

