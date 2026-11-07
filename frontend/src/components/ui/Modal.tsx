"use client";

import React, { useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "2xl" | "fit" | "full";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  closeOnBackdropClick?: boolean;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  closeOnBackdropClick = true,
  className = "",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Adaptive size classes providing generous width to prevent cramped content
  const sizeClasses: Record<ModalSize, string> = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-3xl",
    xl: "max-w-4xl",
    "2xl": "max-w-5xl",
    fit: "w-auto min-w-[320px] max-w-[95vw]",
    full: "max-w-6xl",
  };

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center p-3 sm:p-5 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={closeOnBackdropClick ? onClose : undefined}
        className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-xs transition-opacity animate-in duration-200 fade-in"
      />

      {/* Modal Dialog Container - reduced radius (rounded-lg), adaptive width, clean shadow */}
      <div
        ref={modalRef}
        className={`relative w-full ${sizeClasses[size]} bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg shadow-2xl overflow-hidden z-10 my-auto animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh] text-[#0F172A] ${className}`}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex justify-between items-start p-4 sm:p-5 md:p-6 border-[#E2E8F0] border-b bg-[#FFFFFF]">
            <div>
              {title && (
                <h3 className="font-bold text-[#0F172A] text-base sm:text-lg md:text-xl tracking-tight">
                  {title}
                </h3>
              )}
              {description && (
                <p className="mt-1 text-[#64748B] text-xs sm:text-sm">
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="hover:bg-[#EFF6FF] ml-4 p-1.5 rounded-md text-[#64748B] hover:text-[#2563EB] transition-colors shrink-0 cursor-pointer border border-transparent hover:border-[#BFDBFE]"
              title="Close Modal"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Body Content with spacious padding & scrolling */}
        <div className="p-4 sm:p-6 overflow-y-auto text-[#334155] text-xs sm:text-sm">
          {children}
        </div>

        {/* Footer Actions */}
        {footer && (
          <div className="flex flex-wrap justify-end items-center gap-2.5 bg-[#F8FAFC] p-4 sm:p-5 border-[#E2E8F0] border-t shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
