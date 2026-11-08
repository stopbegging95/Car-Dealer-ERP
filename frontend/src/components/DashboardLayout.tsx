"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FiChevronLeft,
  FiLogOut,
  FiSearch,
  FiBell,
  FiCheckCircle,
  FiChevronDown,
  FiUser,
  FiClock,
  FiGlobe,
  FiMail,
} from "react-icons/fi";
import { FaAward } from "react-icons/fa6";
import { Button } from "./ui";

export interface DashboardMenuItem {
  name: string;
  icon: React.ReactNode;
  badge?: string;
}

export interface DashboardRoleSummary {
  id: string;
  name: string;
  badge: string;
  department: string;
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
  userEmail?: string;
  userInitials?: string;
  departmentName?: string;
  availableRoles?: DashboardRoleSummary[];
  activeRoleId?: string;
  onSelectRole?: (roleId: string) => void;
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
  userEmail = "admin@luxauto.dealers.com",
  userInitials = "AP",
  departmentName,
  onSearch,
  children,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeCurrency] = useState<"NGN">("NGN");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: "NOTIF-01",
      title: "Discount Ceiling Approval Required",
      type: "Rule 4 Authorization",
      detail: "Order ORD-9914 (2024 Mercedes-Maybach S580) discount 4.5% exceeds 3% ceiling. Rep: Chukwudi N.",
      priority: "High",
      time: "8 mins ago",
      read: false,
    },
    {
      id: "NOTIF-02",
      title: "High-Value Acquisition Gate",
      type: "Rule 5 PO Sign-off",
      detail: "PO-2026-092 for 2x Range Rover SV (₦372,000,000) requires Executive Management clearance.",
      priority: "Critical",
      time: "24 mins ago",
      read: false,
    },
    {
      id: "NOTIF-03",
      title: "Vehicle Reservation Expiration",
      type: "Rule 3 Countdown",
      detail: "Stock LX-2024-001 (2024 Porsche 911 Turbo S) reservation expires in 14 hours. Deposit pending.",
      priority: "Medium",
      time: "1 hour ago",
      read: false,
    },
    {
      id: "NOTIF-04",
      title: "Port Demurrage Free-Time Alert",
      type: "Demurrage Radar",
      detail: "Vessel MSC Positano (B/L MSC-TIN-88912) free-time ends in 3 days at Tin Can Island Terminal.",
      priority: "High",
      time: "2 hours ago",
      read: false,
    },
    {
      id: "NOTIF-05",
      title: "Stock Aging Warning (90+ Days)",
      type: "Inventory Alert",
      detail: "Stock LX-2023-089 (2023 Bentley Flying Spur) in stock for 92 days. Holding cost: ₦7,130,000.",
      priority: "Medium",
      time: "Yesterday",
      read: true,
    },
    {
      id: "NOTIF-06",
      title: "Statutory License Renewal",
      type: "Compliance Notice",
      detail: "Expatriate Quota & CERPAC cards renewal due in 28 days. Document vault docket active.",
      priority: "Low",
      time: "2 days ago",
      read: true,
    },
  ]);

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
        <div className="space-y-3">
          {/* Header Logo */}
          <div className="flex justify-between items-center px-2 pt-1 pb-2 border-[#E2E8F0] border-b">
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

          {/* Department Desk Pill */}
          <div className="px-2.5 py-1.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-[11px]">
            <div className="font-bold text-[#64748B] text-[9px] uppercase tracking-wider flex items-center justify-between">
              <span>Department Desk</span>
              <span className="font-mono text-[#2563EB] font-bold">{userRole}</span>
            </div>
            <div className="text-[#0F172A] font-bold truncate mt-0.5" title={departmentName || branchName}>
              {departmentName || branchName}
            </div>
          </div>

          {/* MAIN MENU */}
          <div>
            <div className="mb-1.5 px-3 flex items-center justify-between">
              <p className="font-bold text-[#94A3B8] text-[10px] uppercase tracking-widest">
                MAIN MENU
              </p>
              <span className="text-[9px] font-mono text-[#64748B]">
                {mainMenuItems.length} Desks
              </span>
            </div>
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
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="shrink-0">{item.icon}</span>
                      <span className="truncate">{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full shrink-0 ${
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

          {/* SYSTEM & ROLES MENU (Filtered per role) */}
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
                      <span className="truncate">{item.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          )}

          {/* USER ACCOUNT & AUDIT MENU */}
          <div>
            <p className="mb-1.5 px-3 font-bold text-[#94A3B8] text-[10px] uppercase tracking-widest">
              ACCOUNT & AUDIT
            </p>
            <nav className="space-y-1">
              <button
                type="button"
                onClick={() => onSelectModule("Personal Staff Dashboard")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeModule === "Personal Staff Dashboard"
                    ? "bg-[#2563EB] text-[#FFFFFF] shadow-md shadow-[#2563EB]/25"
                    : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#2563EB]"
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <FiCheckCircle className="w-4 h-4 shrink-0" />
                  <span className="truncate">Staff Work Desk</span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-[#EFF6FF] text-[#1D4ED8] font-bold shrink-0">
                  L3
                </span>
              </button>

              <button
                type="button"
                onClick={() => onSelectModule("My Profile")}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeModule === "My Profile"
                    ? "bg-[#2563EB] text-[#FFFFFF] shadow-md shadow-[#2563EB]/25"
                    : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#2563EB]"
                }`}
              >
                <FiUser className="w-4 h-4 shrink-0" />
                <span>My Profile</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectModule("Session History")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeModule === "Session History"
                    ? "bg-[#2563EB] text-[#FFFFFF] shadow-md shadow-[#2563EB]/25"
                    : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#2563EB]"
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <FiClock className="w-4 h-4 shrink-0" />
                  <span className="truncate">Session History</span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-[#EFF6FF] text-[#1D4ED8] font-bold shrink-0">
                  WORM
                </span>
              </button>
            </nav>
          </div>
        </div>

        {/* Bottom Actions: Return to website & Logout */}
        <div className="space-y-1 pt-2.5 border-[#E2E8F0] border-t">
          <Link
            href="/"
            className="flex items-center gap-2 hover:bg-[#EFF6FF] px-3 py-1.5 rounded-md w-full font-semibold text-[#2563EB] text-xs transition-colors"
          >
            <FiChevronLeft className="w-3.5 h-3.5" />
            <span>Public Website</span>
          </Link>

          <button
            onClick={() => alert("Session securely signed out. Telemetry logged to immutable audit ledger.")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md w-full font-semibold text-[#64748B] hover:text-red-600 text-xs transition-colors cursor-pointer"
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
            <span className="bg-[#EFF6FF] px-2.5 py-0.5 border border-[#BFDBFE] rounded-md font-mono text-[#1D4ED8] text-[10px] font-bold hidden sm:inline">
              {branchName}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Search Bar */}
            <div className="flex items-center bg-[#F8FAFC] p-0.5 pl-3 border border-[#CBD5E1] focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB] rounded-md">
              <FiSearch className="mr-2 w-3.5 h-3.5 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search VIN, stock, client..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="bg-transparent outline-none w-28 sm:w-44 text-[#0F172A] text-xs placeholder-[#94A3B8]"
              />
              <Button
                variant="secondary"
                size="sm"
                className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs"
              >
                Search
              </Button>
            </div>

            {/* Platform Currency: Nigerian Naira (₦ NGN) */}
            <div className="flex items-center gap-1.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-md px-2.5 py-1 text-xs">
              <span className="font-bold text-[11px] text-[#2563EB] font-mono">
                ₦ NGN
              </span>
              <span className="hidden sm:inline text-[10px] text-[#64748B] font-medium">
                (Nigerian Naira)
              </span>
            </div>

            {/* Notification Bell & Interactive Drawer */}
            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                aria-label="Notifications"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative rounded-full w-8 h-8 text-[#64748B] hover:text-[#2563EB]"
              >
                <FiBell className="w-3.5 h-3.5" />
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="top-1 right-1 absolute bg-red-500 rounded-full w-2 h-2 animate-pulse" />
                )}
              </Button>

              {/* CENTRAL NOTIFICATIONS DRAWER */}
              {isNotificationsOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[#FFFFFF] border border-[#CBD5E1] rounded-md shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                    <div className="flex items-center gap-1.5">
                      <FiBell className="w-4 h-4 text-[#2563EB]" />
                      <span className="font-bold text-xs text-[#0F172A]">Central Notifications</span>
                      <span className="text-[10px] font-mono bg-[#EFF6FF] text-[#2563EB] font-bold px-1.5 rounded">
                        {notifications.filter((n) => !n.read).length} new
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
                      }
                      className="text-[10px] text-[#2563EB] hover:underline font-semibold cursor-pointer"
                    >
                      Mark all read
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-[#E2E8F0] my-1">
                    {notifications.map((item) => (
                      <div
                        key={item.id}
                        className={`p-2.5 transition-colors text-xs ${
                          item.read ? "bg-white opacity-70" : "bg-[#F8FAFC]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-bold text-[#0F172A] truncate">{item.title}</span>
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-bold shrink-0 ${
                              item.priority === "Critical"
                                ? "bg-red-100 text-red-700"
                                : item.priority === "High"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {item.priority}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#475569] leading-snug mb-1.5">
                          {item.detail}
                        </p>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-[#94A3B8] font-mono">{item.time}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[9px] text-[#2563EB] font-semibold bg-[#EFF6FF] px-1 rounded border border-[#BFDBFE]">
                              {item.type}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setNotifications((prev) =>
                                  prev.filter((n) => n.id !== item.id)
                                );
                              }}
                              className="text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                              title="Dismiss notification"
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#E2E8F0] text-center">
                    <button
                      type="button"
                      onClick={() => setIsNotificationsOpen(false)}
                      className="text-xs text-[#64748B] hover:text-[#0F172A] font-semibold cursor-pointer"
                    >
                      Close Drawer
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Pill & Dropdown (Email, Name, Profile, Logout) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className={`flex items-center gap-2 bg-[#FFFFFF] py-0.5 pr-2.5 pl-1 border border-[#CBD5E1] hover:border-[#2563EB] rounded-full shadow-xs cursor-pointer transition-colors ${
                  isProfileDropdownOpen ? "ring-2 ring-[#2563EB]/20 border-[#2563EB]" : ""
                }`}
                title="Account Menu"
              >
                <div className="flex justify-center items-center bg-[#EFF6FF] border border-[#BFDBFE] rounded-full w-6 h-6 font-bold text-[#2563EB] text-[10px]">
                  {userInitials}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="block font-semibold text-[#0F172A] text-xs leading-tight">
                    {userName}
                  </span>
                  <span className="block font-mono text-[#2563EB] text-[9px] leading-none font-bold">
                    {userRole}
                  </span>
                </div>
                <FiChevronDown
                  className={`w-3.5 h-3.5 text-[#64748B] transition-transform duration-150 ${
                    isProfileDropdownOpen ? "rotate-180 text-[#2563EB]" : ""
                  }`}
                />
              </button>

              {/* USER PROFILE DROPDOWN (Shows Email, Name, Profile, Session Logs, Sign Out - NO dashboard list) */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-[#FFFFFF] border border-[#CBD5E1] rounded-md shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* User Profile Header */}
                  <div className="pb-3 border-b border-[#E2E8F0] flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center font-bold text-[#2563EB] text-sm shrink-0">
                      {userInitials}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-[#0F172A] truncate">{userName}</div>
                      <div className="text-[11px] text-[#64748B] truncate flex items-center gap-1 mt-0.5">
                        <FiMail className="w-3 h-3 text-[#2563EB] shrink-0" />
                        <span className="truncate">{userEmail}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#EFF6FF] text-[#1D4ED8] font-bold border border-[#BFDBFE]">
                          {userRole}
                        </span>
                        <span className="flex items-center gap-1 text-[9px] text-emerald-600 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Online
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Menu */}
                  <div className="py-2 space-y-1 border-b border-[#E2E8F0]">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectModule("My Profile");
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-[#F8FAFC] text-xs font-semibold text-[#0F172A] hover:text-[#2563EB] flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <FiUser className="w-4 h-4 text-[#2563EB]" />
                      <span>My Profile & Security</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectModule("Session History");
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-[#F8FAFC] text-xs font-semibold text-[#0F172A] hover:text-[#2563EB] flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <FiClock className="w-4 h-4 text-[#2563EB]" />
                        <span>Login & Session Logs</span>
                      </div>
                      <span className="text-[9px] font-mono text-[#1D4ED8] bg-[#EFF6FF] px-1.5 py-0.2 rounded">
                        Audited
                      </span>
                    </button>

                    <Link
                      href="/"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-[#F8FAFC] text-xs font-semibold text-[#0F172A] hover:text-[#2563EB] flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <FiGlobe className="w-4 h-4 text-[#64748B]" />
                      <span>Public Showroom Website</span>
                    </Link>
                  </div>

                  {/* Sign Out Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        alert("Session securely terminated. Logout event cryptographically recorded.");
                      }}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-red-50 text-xs font-bold text-red-600 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <FiLogOut className="w-4 h-4 text-red-600" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* SCROLLABLE MAIN CONTENT */}
        <main className="flex-1 p-4 sm:p-5 overflow-y-auto bg-[#F8FAFC]">
          {children}
        </main>

        {/* FIXED FOOTER */}
        <footer className="z-20 flex justify-between items-center bg-[#FFFFFF] px-4 sm:px-6 border-[#E2E8F0] border-t h-8 font-mono text-[#64748B] text-[11px] shrink-0">
          <div className="flex items-center gap-2">
            <span className="bg-[#2563EB] rounded-full w-2 h-2 animate-pulse" />
            <span className="text-[#334155] font-medium">
              LuxAuto ERP v2.4 (Enterprise Edition)
            </span>
            <span className="text-[#CBD5E1]">&bull;</span>
            <span className="text-[#2563EB] font-bold">User: {userName} ({userEmail})</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline flex items-center gap-1 text-[#64748B]">
              <FiCheckCircle className="w-3 h-3 text-[#2563EB]" />
              Immutable Session Audit Active
            </span>
            <span>&copy; 2026 Premier Auto Group</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
