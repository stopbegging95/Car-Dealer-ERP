"use client";

import React from "react";

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = "md",
  className = "",
}) => {
  const sizeStyles = {
    sm: { track: "w-8 h-4", knob: "w-3 h-3", translate: "translate-x-4" },
    md: { track: "w-11 h-6", knob: "w-4 h-4", translate: "translate-x-5" },
    lg: { track: "w-14 h-7", knob: "w-5 h-5", translate: "translate-x-7" },
  };

  const currentSize = sizeStyles[size];

  return (
    <label
      className={`inline-flex items-start gap-3 cursor-pointer select-none ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex shrink-0 ${currentSize.track} rounded-full border transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2 focus:ring-offset-white
          ${
            checked
              ? "bg-[#2563EB] border-[#2563EB]"
              : "bg-[#E2E8F0] border-[#CBD5E1] hover:border-[#94A3B8]"
          }`}
      >
        <span
          className={`inline-block ${currentSize.knob} transform rounded-full transition-transform duration-200 ease-in-out m-0.5
            ${
              checked
                ? `${currentSize.translate} bg-[#FFFFFF] shadow-sm`
                : "translate-x-0.5 bg-[#FFFFFF] shadow-xs"
            }`}
        />
      </button>

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
