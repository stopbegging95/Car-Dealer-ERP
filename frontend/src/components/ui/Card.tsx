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
      className={`bg-[#FFFFFF] border rounded-md sm:rounded-lg transition-all duration-300 relative overflow-hidden shadow-xs
        ${
          glow
            ? "border-[#2563EB]/50 shadow-[#2563EB]/10 shadow-lg"
            : "border-[#E2E8F0]"
        }
        ${
          hoverable
            ? "hover:border-[#2563EB] hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
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

// Re-export StatsCard and KPICard for consistent application-wide dashboard statistics
export { StatsCard, KPICard } from "./StatsCard";
export type { StatsCardProps, KPICardProps } from "./StatsCard";
