"use client";

import React from "react";
import { Card } from "./Card";
import {
  FiDollarSign,
  FiShoppingBag,
  FiTruck,
  FiUsers,
  FiTool,
  FiBox,
  FiCheckSquare,
  FiClock,
  FiShield,
  FiLayers,
  FiPercent,
  FiFileText,
} from "react-icons/fi";
import { FaCar } from "react-icons/fa6";

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
 * Intelligent fallback resolver that matches an icon demonstrating what the card details are talking about.
 */
function resolveDetailIcon(title: string): React.ReactNode {
  const lower = title.toLowerCase();
  if (lower.includes("margin") || lower.includes("percent") || lower.includes("rate") || lower.includes("pass")) {
    return <FiPercent className="w-5 h-5 text-[#2563EB]" />;
  }
  if (
    lower.includes("revenue") ||
    lower.includes("valuation") ||
    lower.includes("dollar") ||
    lower.includes("cost") ||
    lower.includes("portfolio") ||
    lower.includes("receivable") ||
    lower.includes("equity")
  ) {
    return <FiDollarSign className="w-5 h-5 text-[#2563EB]" />;
  }
  if (
    lower.includes("order") ||
    lower.includes("purchase") ||
    lower.includes("sales") ||
    lower.includes("transaction") ||
    lower.includes("pipeline") ||
    lower.includes("contract")
  ) {
    return <FiShoppingBag className="w-5 h-5 text-[#2563EB]" />;
  }
  if (
    lower.includes("deliver") ||
    lower.includes("transit") ||
    lower.includes("vessel") ||
    lower.includes("port") ||
    lower.includes("customs") ||
    lower.includes("discharge")
  ) {
    return <FiTruck className="w-5 h-5 text-[#2563EB]" />;
  }
  if (
    lower.includes("car") ||
    lower.includes("vehicle") ||
    lower.includes("fleet") ||
    lower.includes("garage") ||
    lower.includes("stock")
  ) {
    return <FaCar className="w-5 h-5 text-[#2563EB]" />;
  }
  if (
    lower.includes("user") ||
    lower.includes("client") ||
    lower.includes("customer") ||
    lower.includes("csat") ||
    lower.includes("commission") ||
    lower.includes("rep") ||
    lower.includes("team")
  ) {
    return <FiUsers className="w-5 h-5 text-[#2563EB]" />;
  }
  if (
    lower.includes("workshop") ||
    lower.includes("service") ||
    lower.includes("bay") ||
    lower.includes("repair") ||
    lower.includes("job")
  ) {
    return <FiTool className="w-5 h-5 text-[#2563EB]" />;
  }
  if (lower.includes("part") || lower.includes("sku") || lower.includes("moving")) {
    return <FiBox className="w-5 h-5 text-[#2563EB]" />;
  }
  if (
    lower.includes("pdi") ||
    lower.includes("recon") ||
    lower.includes("detailing") ||
    lower.includes("inspection") ||
    lower.includes("checklist")
  ) {
    return <FiCheckSquare className="w-5 h-5 text-[#2563EB]" />;
  }
  if (
    lower.includes("mfa") ||
    lower.includes("security") ||
    lower.includes("shield") ||
    lower.includes("integrity") ||
    lower.includes("insurance") ||
    lower.includes("policy") ||
    lower.includes("lock")
  ) {
    return <FiShield className="w-5 h-5 text-[#2563EB]" />;
  }
  if (
    lower.includes("session") ||
    lower.includes("log") ||
    lower.includes("audit") ||
    lower.includes("layer")
  ) {
    return <FiLayers className="w-5 h-5 text-[#2563EB]" />;
  }
  if (
    lower.includes("hour") ||
    lower.includes("time") ||
    lower.includes("cycle") ||
    lower.includes("day") ||
    lower.includes("schedule") ||
    lower.includes("pending")
  ) {
    return <FiClock className="w-5 h-5 text-[#2563EB]" />;
  }
  return <FiFileText className="w-5 h-5 text-[#2563EB]" />;
}

/**
 * Reusable high-density Statistics & KPI Card component for dealership and customer dashboards.
 * Strictly adheres to luxury styling tokens: reduced radius (rounded-md), crisp typography,
 * and a prominent thematic icon container that directly communicates the metric's subject matter.
 * Trend line/icon has been replaced with the dedicated thematic icon.
 */
export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
  badge,
  subtitle,
  onClick,
  className = "",
}) => {
  const displayIcon = icon || resolveDetailIcon(title);

  return (
    <Card
      hoverable={!!onClick}
      onClick={onClick}
      className={`p-4 sm:p-5 relative bg-[#FFFFFF] border border-[#E2E8F0] rounded-md shadow-xs transition-all hover:border-[#BFDBFE] ${className}`}
    >
      {/* Subtle Blue ambient glow on top right */}
      <div className="-top-12 -right-12 absolute bg-[#2563EB]/10 blur-2xl rounded-full w-28 h-28 pointer-events-none" />

      <div className="flex items-center justify-between gap-3">
        {/* Metric Information */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="font-semibold text-[#64748B] text-xs sm:text-sm truncate">
              {title}
            </span>
            {badge && (
              <span className="bg-[#EFF6FF] px-1.5 py-0.5 border border-[#BFDBFE] rounded font-mono font-bold text-[#1D4ED8] text-[10px]">
                {badge}
              </span>
            )}
          </div>

          <div className="font-extrabold text-[#0F172A] text-xl sm:text-2xl md:text-3xl truncate tracking-tight">
            {value}
          </div>

          {change && (
            <div
              className={`inline-flex items-center gap-1 mt-1 text-[11px] sm:text-xs font-bold ${
                isPositive ? "text-[#2563EB]" : "text-[#64748B]"
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

        {/* Thematic Icon demonstrating what the card details are talking about (Replacing the trend icon) */}
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB] text-xl shrink-0 shadow-xs">
          {displayIcon}
        </div>
      </div>
    </Card>
  );
};

// KPICard alias for backward compatibility across all existing dashboard imports
export const KPICard = StatsCard;
export type KPICardProps = StatsCardProps;
