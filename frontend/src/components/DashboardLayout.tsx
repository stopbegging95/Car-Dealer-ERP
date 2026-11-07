"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FiChevronLeft,
  FiLogOut,
  FiSearch,
  FiBell,
  FiCheckCircle,
} from "react-icons/fi";
import { FaAward } from "react-icons/fa6";

export interface DashboardMenuItem {
  name: string;
  icon: React.ReactNode;
  badge?: string;
}

export interface DashboardLayoutProps {
  title: string;
  activeModule: string;
  onSelectModule: (module: string) => void;
  mainMenuItems: DashboardMenuItem[];
  systemMenuItems?: DashboardMenuItem[];
  branchName?: string;
  userRole?: string;
  userName?: string;
  userInitials?: string;
  onSearch?: (term: string) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  activeModule,
  onSelectModule,
  mainMenuItems,
  systemMenuItems = [],
  branchName = "HQ Branch (Victoria Island)",
  userRole = "Super Admin",
  userName = "Admin Panel",
  userInitials = "AP",
  onSearch,
  children,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className="flex bg-[#F8FAFC] selection:bg-[#2563EB] w-screen h-screen overflow-hidden font-sans text-[#0F172A] selection:text-[#FFFFFF]">
      {/* ========================================================================= */}
      {/* 1. FIXED REUSABLE SIDEBAR                                                 */}
      {/* ========================================================================= */}
      <aside className="z-30 flex flex-col justify-between bg-[#FFFFFF] p-3 border-[#E2E8F0] border-r w-60 h-screen max-h-screen overflow-y-auto shrink-0 shadow-xs">
        <div className="space-y-4">
          {/* Header Logo */}
          <div className="flex justify-between items-center px-2 pt-1 pb-2.5 border-[#E2E8F0] border-b">
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="flex justify-center items-center bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl w-7 h-7 group-hover:scale-105 transition-transform">
                <FaAward className="w-3.5 h-3.5 text-[#2563EB]" />
              </div>
              <span className="font-bold text-[#0F172A] text-base tracking-wide">
                LuxAuto
              </span>
            </Link>
            <Link
              href="/"
              className="p-1 text-[#64748B] hover:text-[#2563EB] text-xs transition-colors"
              title="Return to Public Website"
            >
              <FiChevronLeft className="w-4 h-4" />
            </Link>
          </div>

          {/* MAIN MENU */}
          <div>
            <p className="mb-1.5 px-3 font-bold text-[#94A3B8] text-[10px] uppercase tracking-widest">
              MAIN MENU
            </p>
            <nav className="space-y-1">
              {mainMenuItems.map((item) => {
                const isActive = activeModule === item.name;
                return (
                  <button
                    key={item.name}
                    onClick={() => onSelectModule(item.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#2563EB] text-[#FFFFFF] shadow-md shadow-[#2563EB]/25"
                        : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#2563EB]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="shrink-0">{item.icon}</span>
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full ${
                          isActive
                            ? "bg-[#FFFFFF] text-[#2563EB]"
                            : "bg-[#F1F5F9] text-[#64748B]"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* SYSTEM & ROLES MENU */}
          {systemMenuItems.length > 0 && (
            <div>
              <p className="mb-1.5 px-3 font-bold text-[#94A3B8] text-[10px] uppercase tracking-widest">
                SYSTEM & SETTINGS
              </p>
              <nav className="space-y-1">
                {systemMenuItems.map((item) => {
                  const isActive = activeModule === item.name;
                  return (
                    <button
                      key={item.name}
                      onClick={() => onSelectModule(item.name)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#2563EB] text-[#FFFFFF] shadow-md shadow-[#2563EB]/25"
                          : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#2563EB]"
                      }`}
                    >
                      <span className="shrink-0">{item.icon}</span>
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          )}
        </div>

        {/* Bottom Actions: Return to website & Logout */}
        <div className="space-y-1 pt-2.5 border-[#E2E8F0] border-t">
          <Link
            href="/"
            className="flex items-center gap-2 hover:bg-[#EFF6FF] px-3 py-1.5 rounded-xl w-full font-semibold text-[#2563EB] text-xs transition-colors"
          >
            <FiChevronLeft className="w-3.5 h-3.5" />
            <span>Public Website</span>
          </Link>

          <button
            onClick={() => alert("Session securely signed out.")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl w-full font-semibold text-[#64748B] hover:text-red-600 text-xs transition-colors cursor-pointer"
          >
            <FiLogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN VIEWPORT (Fixed Header, Scrollable Content, Fixed Footer)          */}
      {/* ========================================================================= */}
      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
        {/* FIXED HEADER */}
        <header className="z-20 flex justify-between items-center bg-[#FFFFFF] px-4 sm:px-6 border-[#E2E8F0] border-b h-13 shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-[#0F172A] text-base sm:text-lg tracking-tight">
              {title}
            </h2>
            <span className="bg-[#EFF6FF] px-2.5 py-0.5 border border-[#BFDBFE] rounded-md font-mono text-[#1D4ED8] text-[10px] font-bold">
              {branchName}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="flex items-center bg-[#F8FAFC] p-0.5 pl-3 border border-[#CBD5E1] focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB] rounded-md">
              <FiSearch className="mr-2 w-3.5 h-3.5 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search VIN, stock, client..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="bg-transparent outline-none w-32 sm:w-44 text-[#0F172A] text-xs placeholder-[#94A3B8]"
              />
              <button className="bg-[#FFFFFF] px-2.5 py-1 border border-[#CBD5E1] rounded font-semibold text-[#0F172A] hover:text-[#2563EB] text-xs shadow-xs cursor-pointer">
                Search
              </button>
            </div>

            {/* Notification Bell */}
            <button className="relative flex justify-center items-center bg-[#FFFFFF] border border-[#CBD5E1] rounded-full w-8 h-8 text-[#64748B] hover:text-[#2563EB] shadow-xs cursor-pointer">
              <FiBell className="w-3.5 h-3.5" />
              <span className="top-1.5 right-1.5 absolute bg-[#2563EB] rounded-full w-1.5 h-1.5" />
            </button>

            {/* Profile Pill */}
            <div className="flex items-center gap-2 bg-[#FFFFFF] py-0.5 pr-3 pl-1 border border-[#CBD5E1] rounded-full shadow-xs">
              <div className="flex justify-center items-center bg-[#EFF6FF] border border-[#BFDBFE] rounded-full w-6 h-6 font-bold text-[#2563EB] text-[10px]">
                {userInitials}
              </div>
              <div className="text-left">
                <span className="block font-semibold text-[#0F172A] text-xs leading-tight">
                  {userName}
                </span>
                <span className="block font-mono text-[#2563EB] text-[9px] leading-none font-bold">
                  {userRole}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* SCROLLABLE MAIN CONTENT (fits within 1366x768 height) */}
        <main className="flex-1 p-4 sm:p-5 overflow-y-auto bg-[#F8FAFC]">
          {children}
        </main>

        {/* FIXED FOOTER (Fixed to bottom of screen) */}
        <footer className="z-20 flex justify-between items-center bg-[#FFFFFF] px-4 sm:px-6 border-[#E2E8F0] border-t h-8 font-mono text-[#64748B] text-[11px] shrink-0">
          <div className="flex items-center gap-2">
            <span className="bg-[#2563EB] rounded-full w-2 h-2 animate-pulse" />
            <span className="text-[#334155] font-medium">
              LuxAuto ERP v2.4
            </span>
            <span className="text-[#CBD5E1]">&bull;</span>
            <span className="text-[#2563EB] font-bold">All Core Systems Operational</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline flex items-center gap-1 text-[#64748B]">
              <FiCheckCircle className="w-3 h-3 text-[#2563EB]" />
              Lagos HQ & Abuja Diplomatic Nodes Synced
            </span>
            <span>&copy; 2026 Premier Auto Group</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

