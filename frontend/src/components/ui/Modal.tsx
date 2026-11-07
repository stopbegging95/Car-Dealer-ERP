"use client";

import React, { useEffect, useRef } from "react";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

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

  const sizeClasses: Record<ModalSize, string> = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-6xl",
  };

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={closeOnBackdropClick ? onClose : undefined}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in duration-200 fade-in"
      />

      {/* Modal Dialog Container */}
      <div
        ref={modalRef}
        className={`relative w-full ${sizeClasses[size]} bg-[#FFFFFF] border border-[#CBD5E1] rounded-2xl shadow-2xl overflow-hidden z-10 my-auto animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] text-[#0F172A] ${className}`}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex justify-between items-start p-4 sm:p-6 border-[#E2E8F0] border-b">
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
              className="hover:bg-[#F1F5F9] ml-4 p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] transition-colors shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto text-[#334155] text-xs sm:text-sm">
          {children}
        </div>

        {/* Footer Actions */}
        {footer && (
          <div className="flex justify-end items-center gap-3 bg-[#F8FAFC] p-4 sm:p-6 border-[#E2E8F0] border-t shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
