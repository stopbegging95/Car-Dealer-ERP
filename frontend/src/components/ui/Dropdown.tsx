"use client";

import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiCheck, FiAlertCircle } from "react-icons/fi";

export interface DropdownOption {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface DropdownProps {
  label?: string;
  labelClassName?: string;
  triggerClassName?: string;
  placeholder?: string;
  options: DropdownOption[];
  value?: string | number;
  onChange: (value: string | number) => void;
  error?: string;
  helperText?: string;
  searchable?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  labelClassName = "",
  triggerClassName = "",
  placeholder = "Select an option",
  options,
  value,
  onChange,
  error,
  helperText,
  searchable = false,
  disabled = false,
  fullWidth = true,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  const handleSelect = (opt: DropdownOption) => {
    if (opt.disabled) return;
    onChange(opt.value);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div
      ref={dropdownRef}
      className={`${fullWidth ? "w-full" : "inline-block"} relative flex flex-col gap-1.5 ${
        isOpen ? "z-50" : "z-10"
      } ${className}`}
    >
      {label && (
        <label className={labelClassName || "text-xs sm:text-sm font-semibold text-[#0F172A]"}>
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between rounded-md bg-[#FFFFFF] text-[#0F172A] border transition-all duration-200 outline-none
          text-xs sm:text-sm px-3 h-10 text-left shadow-xs ${triggerClassName}
          ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              : isOpen
              ? "border-[#2563EB] ring-2 ring-[#2563EB]/20"
              : "border-[#CBD5E1] hover:border-[#2563EB]"
          }
          disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption?.icon && (
            <span className="shrink-0 text-[#2563EB]">{selectedOption.icon}</span>
          )}
          <span className={selectedOption ? "text-[#0F172A] font-medium" : "text-[#94A3B8]"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <FiChevronDown
          className={`w-4 h-4 text-[#64748B] transition-transform duration-200 shrink-0 ml-2 ${
            isOpen ? "rotate-180 text-[#2563EB]" : ""
          }`}
        />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 z-50 w-full mt-1.5 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {searchable && (
            <div className="p-2 border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-sm bg-[#FFFFFF] text-[#0F172A] placeholder-[#94A3B8] px-2.5 py-1.5 text-xs outline-none border border-[#CBD5E1] focus:border-[#2563EB]"
                autoFocus
              />
            </div>
          )}

          <div className="max-h-60 overflow-y-auto divide-y divide-[#F1F5F9] p-1">
            {filteredOptions.length === 0 ? (
              <div className="py-3 text-center text-xs text-[#94A3B8]">
                No options found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={String(opt.value)}
                    type="button"
                    disabled={opt.disabled}
                    onClick={() => handleSelect(opt)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm rounded transition-colors text-left
                      ${
                        isSelected
                          ? "bg-[#EFF6FF] text-[#2563EB] font-bold"
                          : "text-[#334155] hover:bg-[#F8FAFC] hover:text-[#2563EB]"
                      }
                      ${opt.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                      <span>{opt.label}</span>
                    </span>
                    {isSelected && (
                      <FiCheck className="w-4 h-4 text-[#2563EB] shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {error ? (
        <p className="text-[11px] sm:text-xs text-red-600 flex items-center gap-1.5 mt-0.5">
          <FiAlertCircle className="w-3.5 h-3.5 text-red-600" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="text-[11px] sm:text-xs text-[#64748B] mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
};
