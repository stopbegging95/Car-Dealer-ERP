"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
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
  const [mounted, setMounted] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});
  const [openUpward, setOpenUpward] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  // Calculate position relative to viewport using getBoundingClientRect
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const estimatedHeight = Math.min(260, options.length * 38 + (searchable ? 45 : 10));

    const isUpward = spaceBelow < estimatedHeight && spaceAbove > spaceBelow;
    setOpenUpward(isUpward);

    let left = rect.left;
    const width = rect.width;
    // Prevent horizontal overflow
    if (left + width > viewportWidth - 8) {
      left = Math.max(8, viewportWidth - width - 8);
    }

    if (isUpward) {
      setPopoverStyle({
        position: "fixed",
        bottom: `${viewportHeight - rect.top + 4}px`,
        left: `${left}px`,
        width: `${width}px`,
        maxHeight: `${Math.min(260, spaceAbove - 12)}px`,
        zIndex: 99999,
      });
    } else {
      setPopoverStyle({
        position: "fixed",
        top: `${rect.bottom + 4}px`,
        left: `${left}px`,
        width: `${width}px`,
        maxHeight: `${Math.min(260, spaceBelow - 12)}px`,
        zIndex: 99999,
      });
    }
  }, [options.length, searchable]);

  // Recalculate position on open, scroll, or resize
  useEffect(() => {
    if (!isOpen) return;
    updatePosition();

    const handleScrollOrResize = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      // If trigger is scrolled out of viewport, close dropdown
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        setIsOpen(false);
      } else {
        updatePosition();
      }
    };

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen, updatePosition]);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        popoverRef.current &&
        !popoverRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

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
      className={`${fullWidth ? "w-full" : "inline-block"} relative flex flex-col gap-1.5 ${className}`}
    >
      {label && (
        <label className={labelClassName || "text-xs sm:text-sm font-semibold text-[#0F172A]"}>
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setIsOpen((prev) => !prev);
          }
        }}
        className={`w-full flex items-center justify-between rounded-md bg-[#FFFFFF] text-[#0F172A] border transition-all duration-200 outline-none
          text-xs sm:text-sm px-3 h-10 text-left shadow-xs cursor-pointer ${triggerClassName}
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

      {/* Portal-Mounted Popover Menu: Breaks out of all modal/card overflow-hidden containers */}
      {mounted &&
        isOpen &&
        createPortal(
          <div
            ref={popoverRef}
            style={popoverStyle}
            className={`rounded-md bg-[#FFFFFF] border border-[#CBD5E1] shadow-2xl overflow-hidden flex flex-col animate-in duration-100 ${
              openUpward ? "slide-in-from-bottom-2" : "slide-in-from-top-2"
            }`}
          >
            {searchable && (
              <div className="p-2 border-b border-[#E2E8F0] bg-[#F8FAFC] shrink-0">
                <input
                  type="text"
                  placeholder="Search options..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-sm bg-[#FFFFFF] text-[#0F172A] placeholder-[#94A3B8] px-2.5 py-1.5 text-xs outline-none border border-[#CBD5E1] focus:border-[#2563EB]"
                  autoFocus
                />
              </div>
            )}

            <div className="overflow-y-auto divide-y divide-[#F1F5F9] p-1 flex-1">
              {filteredOptions.length === 0 ? (
                <div className="py-3 text-center text-xs text-[#94A3B8]">
                  No matching options found
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
          </div>,
          document.body
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
