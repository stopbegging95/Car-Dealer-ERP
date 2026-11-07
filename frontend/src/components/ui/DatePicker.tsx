"use client";

import React from "react";
import { FiCalendar } from "react-icons/fi";

export interface DatePickerProps {
  label?: string;
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  minDate?: string;
  maxDate?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  error,
  helperText,
  disabled = false,
  fullWidth = true,
  className = "",
}) => {
  return (
    <div className={`${fullWidth ? "w-full" : "inline-block"} flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs sm:text-sm font-semibold text-[#0F172A]">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        <div className="absolute left-3.5 flex items-center pointer-events-none text-[#2563EB]">
          <FiCalendar className="w-4 h-4" />
        </div>

        <input
          type="date"
          value={value}
          min={minDate}
          max={maxDate}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-xl bg-[#FFFFFF] text-[#0F172A] placeholder-[#94A3B8] border transition-all duration-200 outline-none
            text-xs sm:text-sm py-2 sm:py-2.5 pl-10 pr-3.5 [color-scheme:light] shadow-xs
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                : "border-[#CBD5E1] hover:border-[#2563EB] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
            }
            disabled:opacity-50 disabled:cursor-not-allowed`}
        />
      </div>

      {error ? (
        <p className="text-[11px] sm:text-xs text-red-600 mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] sm:text-xs text-[#64748B] mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
};
