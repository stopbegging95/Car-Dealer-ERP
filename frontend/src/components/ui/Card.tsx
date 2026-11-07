"use client";

import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  glow = false,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`bg-[#FFFFFF] border rounded-xl sm:rounded-2xl transition-all duration-300 relative overflow-hidden shadow-sm
        ${
          glow
            ? "border-[#2563EB]/50 shadow-[#2563EB]/10 shadow-lg"
            : "border-[#E2E8F0]"
        }
        ${
          hoverable
            ? "hover:border-[#2563EB] hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
            : ""
        }
        ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <div className={`p-4 sm:p-6 pb-2 sm:pb-3 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <h3
    className={`text-sm sm:text-base md:text-lg font-bold text-[#0F172A] tracking-tight ${className}`}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <p
    className={`text-xs sm:text-sm text-[#64748B] mt-0.5 sm:mt-1 ${className}`}
    {...props}
  >
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <div className={`p-4 sm:p-6 pt-2 sm:pt-3 text-xs sm:text-sm text-[#334155] ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <div
    className={`p-4 sm:p-6 pt-0 border-t border-[#E2E8F0] flex items-center justify-between ${className}`}
    {...props}
  >
    {children}
  </div>
);

// KPI Stat Card replicating the exact LuxAuto dashboard style from dashboard.jpg
export interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
  sparklinePath?: string;
  className?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
  sparklinePath = "M0 18 Q 20 5, 40 14 T 80 4 T 120 10",
  className = "",
}) => {
  return (
    <Card hoverable className={`p-4 sm:p-5 relative ${className}`}>
      {/* Subtle Blue ambient glow on top right */}
      <div className="-top-12 -right-12 absolute bg-[#2563EB]/10 blur-2xl rounded-full w-28 h-28 pointer-events-none" />

      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <span className="pr-2 font-semibold text-[#64748B] text-xs sm:text-sm truncate">
          {title}
        </span>
        {icon && (
          <div className="flex justify-center items-center bg-[#EFF6FF] shadow-xs border border-[#BFDBFE] rounded-full w-8 sm:w-9 h-8 sm:h-9 shrink-0">
            <span className="text-[#2563EB]">{icon}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-end gap-2">
        <div>
          <div className="font-extrabold text-[#0F172A] text-xl sm:text-2xl md:text-3xl tracking-tight">
            {value}
          </div>
          {change && (
            <div
              className={`inline-block mt-1 text-[11px] sm:text-xs font-bold ${
                isPositive ? "text-[#2563EB]" : "text-[#64748B]"
              }`}
            >
              {change}
            </div>
          )}
        </div>

        {/* Dynamic Blue Sparkline Curve */}
        <div className="pb-1 shrink-0">
          <svg className="w-20 sm:w-24 md:w-28 h-7 sm:h-8" viewBox="0 0 120 24" fill="none">
            <path
              d={sparklinePath}
              stroke="#2563EB"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </Card>
  );
};
