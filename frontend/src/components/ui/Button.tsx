"use client";

import React, { forwardRef } from "react";
import { CgSpinner } from "react-icons/cg";

export type ButtonVariant = "primary" | "secondary" | "destructive" | "outline" | "ghost" | "warmGold" | "gold";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    // Base styles with responsive typography and smooth transitions
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-md transition-all duration-200 select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2 focus:ring-offset-[#F8FAFC] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

    // Using Cobalt Blue (#2563EB), Deep Blue (#1D4ED8), Slate (#0F172A), and Light (#F1F5F9)
    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        "bg-[#2563EB] text-[#FFFFFF] hover:bg-[#1D4ED8] shadow-md shadow-[#2563EB]/25 border border-[#2563EB]",
      warmGold:
        "bg-[#0F172A] text-[#FFFFFF] hover:bg-[#1E293B] shadow-md shadow-[#0F172A]/25 border border-[#1E293B] font-bold",
      gold:
        "bg-[#0F172A] text-[#FFFFFF] hover:bg-[#1E293B] shadow-md shadow-[#0F172A]/25 border border-[#1E293B] font-bold",
      secondary:
        "bg-[#F1F5F9] text-[#0F172A] hover:bg-[#E2E8F0] border border-[#CBD5E1] shadow-sm font-semibold",
      destructive:
        "bg-[#EF4444] text-[#FFFFFF] hover:bg-[#DC2626] border border-[#EF4444] shadow-sm",
      outline:
        "bg-transparent text-[#0F172A] border border-[#CBD5E1] hover:border-[#2563EB] hover:text-[#2563EB] hover:bg-[#EFF6FF]",
      ghost:
        "bg-transparent text-[#475569] hover:text-[#2563EB] hover:bg-[#EFF6FF] border border-transparent",
    };

    // Responsive size mappings with scaling padding & font-size
    const sizeStyles: Record<ButtonSize, string> = {
      sm: "text-xs px-2.5 py-1.5 gap-1.5",
      md: "text-xs sm:text-sm px-3.5 sm:px-4 py-2 sm:py-2.5 gap-2",
      lg: "text-sm sm:text-base px-5 sm:px-6 py-2.5 sm:py-3.5 gap-2.5",
      icon: "p-2 sm:p-2.5 aspect-square text-sm sm:text-base",
    };

    const widthStyle = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
        {...props}
      >
        {isLoading ? (
          <CgSpinner className="animate-spin w-4 h-4 text-current" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
