"use client";

import React from "react";

export interface RadioOption {
  value: string | number;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value: string | number;
  onChange: (value: string | number) => void;
  label?: string;
  error?: string;
  cardVariant?: boolean;
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  onChange,
  label,
  error,
  cardVariant = false,
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <span className="font-semibold text-[#0F172A] text-xs sm:text-sm">
          {label}
        </span>
      )}

      <div className={cardVariant ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5" : "flex flex-col gap-2"}>
        {options.map((opt) => {
          const isSelected = opt.value === value;
          const inputId = `${name}-${opt.value}`;

          if (cardVariant) {
            return (
              <label
                key={String(opt.value)}
                htmlFor={inputId}
                className={`relative flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer select-none
                  ${isSelected
                    ? "bg-[#EFF6FF] border-[#2563EB] shadow-xs"
                    : "bg-[#FFFFFF] border-[#CBD5E1] hover:border-[#2563EB]"
                  }
                  ${opt.disabled ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                <input
                  type="radio"
                  id={inputId}
                  name={name}
                  value={opt.value}
                  checked={isSelected}
                  disabled={opt.disabled}
                  onChange={() => onChange(opt.value)}
                  className="sr-only"
                />

                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors
                    ${isSelected
                      ? "border-[#2563EB] bg-[#2563EB]"
                      : "border-[#CBD5E1] bg-[#FFFFFF]"
                    }`}
                >
                  {isSelected && <span className="bg-[#FFFFFF] rounded-full w-1.5 h-1.5" />}
                </div>

                <div className="flex flex-col flex-1">
                  <div className="flex items-center gap-2">
                    {opt.icon && <span className="text-[#2563EB] shrink-0">{opt.icon}</span>}
                    <span
                      className={`text-xs sm:text-sm font-semibold ${isSelected ? "text-[#2563EB]" : "text-[#0F172A]"
                        }`}
                    >
                      {opt.label}
                    </span>
                  </div>
                  {opt.description && (
                    <span className="mt-0.5 text-[#64748B] text-[11px] sm:text-xs">
                      {opt.description}
                    </span>
                  )}
                </div>
              </label>
            );
          }

          // Standard Radio Style
          return (
            <label
              key={String(opt.value)}
              htmlFor={inputId}
              className={`inline-flex items-center gap-2.5 cursor-pointer select-none py-1 ${opt.disabled ? "opacity-40 cursor-not-allowed" : ""
                }`}
            >
              <input
                type="radio"
                id={inputId}
                name={name}
                value={opt.value}
                checked={isSelected}
                disabled={opt.disabled}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />

              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors
                  ${isSelected
                    ? "border-[#2563EB] bg-[#2563EB]"
                    : "border-[#CBD5E1] bg-[#FFFFFF] hover:border-[#2563EB]"
                  }`}
              >
                {isSelected && <span className="bg-[#FFFFFF] rounded-full w-1.5 h-1.5" />}
              </div>

              <div className="flex flex-col">
                <span className="font-semibold text-[#0F172A] text-xs sm:text-sm">
                  {opt.label}
                </span>
                {opt.description && (
                  <span className="text-[#64748B] text-[11px] sm:text-xs">
                    {opt.description}
                  </span>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {error && <span className="text-[11px] sm:text-xs text-red-600">{error}</span>}
    </div>
  );
};
