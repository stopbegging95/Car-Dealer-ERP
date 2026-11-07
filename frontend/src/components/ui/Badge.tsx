"use client";

import React from "react";

export type BadgeVariant = "gold" | "warmGold" | "dark" | "charcoal" | "light" | "outline";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "gold",
  size = "md",
  dot = false,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center font-medium tracking-wide uppercase rounded-full select-none transition-colors";

  const variantStyles: Record<BadgeVariant, string> = {
    gold: "bg-[#2563EB] text-[#FFFFFF] border border-[#2563EB] shadow-xs font-bold",
    warmGold: "bg-[#0F172A] text-[#FFFFFF] border border-[#1E293B] shadow-xs font-bold",
    charcoal: "bg-[#F1F5F9] text-[#334155] border border-[#CBD5E1]",
    dark: "bg-[#0F172A] text-[#FFFFFF] border border-[#1E293B]",
    light: "bg-[#FFFFFF] text-[#0F172A] border border-[#E2E8F0] font-semibold shadow-xs",
    outline: "bg-transparent text-[#2563EB] border border-[#93C5FD]",
  };

  const sizeStyles: Record<BadgeSize, string> = {
    sm: "text-[9px] sm:text-[10px] px-2 py-0.5 gap-1",
    md: "text-[10px] sm:text-xs px-2.5 py-1 gap-1.5",
    lg: "text-xs sm:text-sm px-3.5 py-1.5 gap-2",
  };

  const dotColors: Record<BadgeVariant, string> = {
    gold: "bg-[#60A5FA]",
    warmGold: "bg-[#38BDF8]",
    charcoal: "bg-[#64748B]",
    dark: "bg-[#38BDF8]",
    light: "bg-[#2563EB]",
    outline: "bg-[#2563EB]",
  };

  return (
    <span
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]} animate-pulse`}
        />
      )}
      {children}
    </span>
  );
};
