"use client";

import React from "react";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  indeterminate?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  description,
  indeterminate = false,
  disabled = false,
  id,
  className = "",
  ...props
}) => {
  const checkboxId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <label
      htmlFor={checkboxId}
      className={`inline-flex items-start gap-2.5 cursor-pointer select-none ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      <div className="relative flex justify-center items-center mt-0.5 shrink-0">
        <input
          type="checkbox"
          id={checkboxId}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
          {...props}
        />
        <div
          className={`w-4 h-4 rounded-md border transition-colors flex items-center justify-center
            ${
              checked || indeterminate
                ? "bg-[#2563EB] border-[#2563EB] text-[#FFFFFF]"
                : "bg-[#FFFFFF] border-[#CBD5E1] hover:border-[#2563EB]"
            }`}
        >
          {indeterminate ? (
            <span className="bg-[#FFFFFF] rounded w-2 h-0.5" />
          ) : checked ? (
            <svg
              className="stroke-[3] w-3 h-3 text-[#FFFFFF]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : null}
        </div>
      </div>

      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-xs sm:text-sm font-semibold text-[#0F172A]">
              {label}
            </span>
          )}
          {description && (
            <span className="text-[11px] sm:text-xs text-[#64748B] mt-0.5">
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
};
