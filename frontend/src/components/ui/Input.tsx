"use client";

import React, { forwardRef } from "react";
import { FiAlertCircle } from "react-icons/fi";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = true,
      className = "",
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className={`${fullWidth ? "w-full" : "inline-block"} flex flex-col gap-1.5`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs sm:text-sm font-semibold text-[#0F172A] flex items-center justify-between"
          >
            <span>{label}</span>
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[#64748B]">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`w-full rounded-md bg-[#FFFFFF] text-[#0F172A] placeholder-[#94A3B8] border transition-all duration-200 outline-none
              text-xs sm:text-sm py-1.5 sm:py-2 shadow-xs
              ${leftIcon ? "pl-10" : "pl-3"} 
              ${rightIcon ? "pr-10" : "pr-3"}
              ${
                error
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-[#CBD5E1] hover:border-[#2563EB] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
              }
              disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 flex items-center text-[#64748B]">
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p className="text-[11px] sm:text-xs text-red-600 flex items-center gap-1.5 mt-0.5">
            <FiAlertCircle className="w-3.5 h-3.5 shrink-0 text-red-600" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p className="text-[11px] sm:text-xs text-[#64748B] mt-0.5">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = true,
      className = "",
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className={`${fullWidth ? "w-full" : "inline-block"} flex flex-col gap-1.5`}>
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs sm:text-sm font-semibold text-[#0F172A] flex items-center justify-between"
          >
            <span>{label}</span>
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          className={`w-full rounded-md bg-[#FFFFFF] text-[#0F172A] placeholder-[#94A3B8] border transition-all duration-200 outline-none
            text-xs sm:text-sm p-3 shadow-xs
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                : "border-[#CBD5E1] hover:border-[#2563EB] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
            }
            disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
          {...props}
        />

        {error ? (
          <p className="text-[11px] sm:text-xs text-red-600 flex items-center gap-1.5 mt-0.5">
            <FiAlertCircle className="w-3.5 h-3.5 shrink-0 text-red-600" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p className="text-[11px] sm:text-xs text-[#64748B] mt-0.5">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
