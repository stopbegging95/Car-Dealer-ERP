"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FiChevronLeft,
  FiChevronRight,
  FiLogOut,
  FiBell,
  FiCheckCircle,
  FiChevronDown,
  FiUser,
  FiClock,
  FiGlobe,
  FiMail,
  FiMessageSquare,
} from "react-icons/fi";
import { FaAward } from "react-icons/fa6";
import { Button, Modal } from "./ui";
import { play4SecondNotificationSound } from "@/utils/audioAlert";
import { BiometricFaceCaptureModal } from "@/components/BiometricFaceCaptureModal";
import { recordLogoutBiometric, clearBiometricVerification } from "@/utils/sessionAuditHelper";
import { clearStoredToken } from "@/lib/api";

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
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isBiometricLogoutOpen, setIsBiometricLogoutOpen] = useState(false);
  const [isPlayingAudioAlert, setIsPlayingAudioAlert] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Listen for notification audio events and play 4-second executive chime
  React.useEffect(() => {
    const handleTriggerAudio = () => {
      setIsPlayingAudioAlert(true);
      play4SecondNotificationSound().finally(() => setIsPlayingAudioAlert(false));
    };
    window.addEventListener("cardeals_notification_sound", handleTriggerAudio);
    return () => window.removeEventListener("cardeals_notification_sound", handleTriggerAudio);
  }, []);
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

  return (
    <div className="flex bg-[#F8FAFC] selection:bg-[#2563EB] w-screen h-screen overflow-hidden font-sans text-[#0F172A] selection:text-[#FFFFFF]">
      {/* ========================================================================= */}
      {/* 1. FIXED REUSABLE SIDEBAR (Collapsible / Expandable)                       */}
      {/* ========================================================================= */}
      <aside
        className={`z-30 flex flex-col justify-between bg-[#FFFFFF] border-[#E2E8F0] border-r h-screen max-h-screen overflow-y-auto shrink-0 shadow-xs transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "w-20 p-2.5 items-center" : "w-60 sm:w-64 p-3"
        }`}
      >
        <div className={`space-y-3 w-full ${isSidebarCollapsed ? "flex flex-col items-center" : ""}`}>
          {/* Header Logo & Sidebar Toggle */}
          <div
            className={`flex items-center pb-2.5 border-[#E2E8F0] border-b w-full ${
              isSidebarCollapsed
                ? "flex-col justify-center gap-2 pt-1 px-1 text-center"
                : "justify-between px-2 pt-1"
            }`}
          >
            <Link
              href="/"
              className="group flex items-center gap-2.5 shrink-0"
              title="LuxAuto Dealership Master HQ"
            >
              <div className="flex justify-center items-center bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl w-7 h-7 group-hover:scale-105 transition-transform shrink-0">
                <FaAward className="w-3.5 h-3.5 text-[#2563EB]" />
              </div>
              {!isSidebarCollapsed && (
                <span className="font-bold text-[#0F172A] text-base tracking-wide">
                  LuxAuto
                </span>
              )}
            </Link>

            {/* Toggle expansion button: Toggles sidebar state, does NOT navigate away */}
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed((prev) => !prev)}
              className="p-1.5 text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] rounded-md transition-colors cursor-pointer shrink-0"
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              aria-label={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isSidebarCollapsed ? (
                <FiChevronRight className="w-4 h-4 text-[#2563EB]" />
              ) : (
                <FiChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Department Desk Pill */}
          {isSidebarCollapsed ? (
            <div
              className="flex justify-center items-center py-1 w-full cursor-help"
              title={`Department Desk: ${departmentName || branchName} (${userRole})`}
            >
              <span className="font-mono text-[#2563EB] text-[10px] font-bold bg-[#EFF6FF] border border-[#BFDBFE] px-1.5 py-0.5 rounded truncate max-w-full text-center">
                {userRole ? userRole.split(" ")[0].slice(0, 4) : "HQ"}
              </span>
            </div>
          ) : (
            <div className="px-2.5 py-1.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-[11px]">
              <div className="font-bold text-[#64748B] text-[9px] uppercase tracking-wider flex items-center justify-between">
                <span>Department Desk</span>
                <span className="font-mono text-[#2563EB] font-bold">{userRole}</span>
              </div>
              <div
                className="text-[#0F172A] font-bold truncate mt-0.5"
                title={departmentName || branchName}
              >
                {departmentName || branchName}
              </div>
            </div>
          )}

          {/* MAIN MENU */}
          <div className="w-full">
            {!isSidebarCollapsed ? (
              <div className="mb-1.5 px-3 flex items-center justify-between">
                <p className="font-bold text-[#94A3B8] text-[10px] uppercase tracking-widest">
                  MAIN MENU
                </p>
                <span className="text-[9px] font-mono text-[#64748B]">
                  {mainMenuItems.length} Desks
                </span>
              </div>
            ) : (
              <div className="h-px bg-[#E2E8F0] my-2 w-full" />
            )}
            <nav className="space-y-1 w-full">
              {mainMenuItems.map((item) => {
                const isActive = activeModule === item.name;
                return (
                  <button
                    key={item.name}
                    onClick={() => onSelectModule(item.name)}
                    title={item.name}
                    className={`w-full flex items-center rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      isSidebarCollapsed
                        ? "justify-center p-2.5"
                        : "justify-between px-3 py-2"
                    } ${
                      isActive
                        ? "bg-[#2563EB] text-[#FFFFFF] shadow-md shadow-[#2563EB]/25"
                        : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#2563EB]"
                    }`}
                  >
                    <div className={`flex items-center gap-2.5 ${isSidebarCollapsed ? "justify-center" : "truncate"}`}>
                      <span className="shrink-0">{item.icon}</span>
                      {!isSidebarCollapsed && <span className="truncate">{item.name}</span>}
                    </div>
                    {!isSidebarCollapsed && item.badge && (
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
            <div className="w-full">
              {!isSidebarCollapsed ? (
                <p className="mb-1.5 px-3 font-bold text-[#94A3B8] text-[10px] uppercase tracking-widest">
                  SYSTEM & SETTINGS
                </p>
              ) : (
                <div className="h-px bg-[#E2E8F0] my-2 w-full" />
              )}
              <nav className="space-y-1 w-full">
                {systemMenuItems.map((item) => {
                  const isActive = activeModule === item.name;
                  return (
                    <button
                      key={item.name}
                      onClick={() => onSelectModule(item.name)}
                      title={item.name}
                      className={`w-full flex items-center rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        isSidebarCollapsed
                          ? "justify-center p-2.5"
                          : "gap-2.5 px-3 py-2"
                      } ${
                        isActive
                          ? "bg-[#2563EB] text-[#FFFFFF] shadow-md shadow-[#2563EB]/25"
                          : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#2563EB]"
                      }`}
                    >
                      <span className="shrink-0">{item.icon}</span>
                      {!isSidebarCollapsed && <span className="truncate">{item.name}</span>}
                    </button>
                  );
                })}
              </nav>
            </div>
          )}

          {/* USER ACCOUNT & AUDIT MENU */}
          <div className="w-full">
            {!isSidebarCollapsed ? (
              <p className="mb-1.5 px-3 font-bold text-[#94A3B8] text-[10px] uppercase tracking-widest">
                ACCOUNT & AUDIT
              </p>
            ) : (
              <div className="h-px bg-[#E2E8F0] my-2 w-full" />
            )}
            <nav className="space-y-1 w-full">
              <button
                type="button"
                onClick={() => onSelectModule("Personal Staff Dashboard")}
                title="Staff Work Desk"
                className={`w-full flex items-center rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  isSidebarCollapsed
                    ? "justify-center p-2.5"
                    : "justify-between px-3 py-2"
                } ${
                  activeModule === "Personal Staff Dashboard"
                    ? "bg-[#2563EB] text-[#FFFFFF] shadow-md shadow-[#2563EB]/25"
                    : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#2563EB]"
                }`}
              >
                <div className={`flex items-center gap-2.5 ${isSidebarCollapsed ? "justify-center" : "truncate"}`}>
                  <FiCheckCircle className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">Staff Work Desk</span>}
                </div>
                {!isSidebarCollapsed && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-[#EFF6FF] text-[#1D4ED8] font-bold shrink-0">
                    L3
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => onSelectModule("My Profile")}
                title="My Profile"
                className={`w-full flex items-center rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  isSidebarCollapsed
                    ? "justify-center p-2.5"
                    : "gap-2.5 px-3 py-2"
                } ${
                  activeModule === "My Profile"
                    ? "bg-[#2563EB] text-[#FFFFFF] shadow-md shadow-[#2563EB]/25"
                    : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#2563EB]"
                }`}
              >
                <span className="shrink-0"><FiUser className="w-4 h-4 shrink-0" /></span>
                {!isSidebarCollapsed && <span>My Profile</span>}
              </button>

              <button
                type="button"
                onClick={() => onSelectModule("Session History")}
                title="Session History"
                className={`w-full flex items-center rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  isSidebarCollapsed
                    ? "justify-center p-2.5"
                    : "justify-between px-3 py-2"
                } ${
                  activeModule === "Session History"
                    ? "bg-[#2563EB] text-[#FFFFFF] shadow-md shadow-[#2563EB]/25"
                    : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#2563EB]"
                }`}
              >
                <div className={`flex items-center gap-2.5 ${isSidebarCollapsed ? "justify-center" : "truncate"}`}>
                  <FiClock className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">Session History</span>}
                </div>
                {!isSidebarCollapsed && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-[#EFF6FF] text-[#1D4ED8] font-bold shrink-0">
                    WORM
                  </span>
                )}
              </button>

              {/* Internal Staff-to-Staff Team Chat (Strictly hidden for customers) */}
              {userRole !== "Customer" && userRole !== "user" && (
                <button
                  type="button"
                  onClick={() => onSelectModule("Staff Team Chat")}
                  title="Internal Staff Comms & Chat"
                  className={`w-full flex items-center rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    isSidebarCollapsed
                      ? "justify-center p-2.5"
                      : "justify-between px-3 py-2"
                  } ${
                    activeModule === "Staff Team Chat" || activeModule === "Staff Chat" || activeModule === "Team Chat"
                      ? "bg-[#2563EB] text-[#FFFFFF] shadow-md shadow-[#2563EB]/25"
                      : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#2563EB]"
                  }`}
                >
                  <div className={`flex items-center gap-2.5 ${isSidebarCollapsed ? "justify-center" : "truncate"}`}>
                    <FiMessageSquare className="w-4 h-4 shrink-0 text-[#2563EB]" />
                    {!isSidebarCollapsed && <span className="truncate">Staff Team Chat</span>}
                  </div>
                  {!isSidebarCollapsed && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold shrink-0">
                      Live
                    </span>
                  )}
                </button>
              )}
            </nav>
          </div>
        </div>

        {/* Bottom Actions: Return to website & Logout */}
        <div className="space-y-1 pt-2.5 border-[#E2E8F0] border-t w-full">
          <Link
            href="/"
            title="Public Showroom Website"
            className={`flex items-center hover:bg-[#EFF6FF] rounded-md w-full font-semibold text-[#2563EB] text-xs transition-colors ${
              isSidebarCollapsed
                ? "justify-center p-2.5"
                : "gap-2 px-3 py-2"
            }`}
          >
            <FiGlobe className="w-4 h-4 shrink-0" />
            {!isSidebarCollapsed && <span>Public Website</span>}
          </Link>

          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(true)}
            title="Sign Out"
            className={`flex items-center rounded-md w-full font-semibold text-[#64748B] hover:text-red-600 hover:bg-red-50 text-xs transition-colors cursor-pointer ${
              isSidebarCollapsed
                ? "justify-center p-2.5"
                : "gap-2 px-3 py-2"
            }`}
          >
            <FiLogOut className="w-4 h-4 shrink-0" />
            {!isSidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN VIEWPORT (Fixed Header, Scrollable Content, Fixed Footer)          */}
      {/* ========================================================================= */}
      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
        {/* FIXED HEADER - Executive Proportional Height (min 76px - 80px) */}
        <header className="z-20 flex justify-between items-center bg-[#FFFFFF] px-5 sm:px-8 border-[#E2E8F0] border-b min-h-[76px] sm:min-h-[80px] h-20 shrink-0 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div>
              <h2 className="font-bold text-[#0F172A] text-lg sm:text-xl tracking-tight flex items-center gap-2">
                {title === "Dashboard" || title === "Customer Portal" ? (
                  <>
                    Welcome back, <span className="text-[#2563EB]">{userName}</span>
                  </>
                ) : (
                  <>
                    <span>{title}</span>
                    <span className="text-xs font-normal text-[#64748B] hidden md:inline ml-2.5">
                      &bull; Welcome back, <span className="text-[#2563EB] font-semibold">{userName}</span>
                    </span>
                  </>
                )}
              </h2>
              <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#64748B] mt-1">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium text-[#0F172A]">{departmentName || branchName}</span>
                <span className="text-[#CBD5E1]">&bull;</span>
                <span className="font-mono text-[#2563EB] font-bold">{userRole}</span>
                <span className="hidden lg:inline text-[#94A3B8]">&bull; Victoria Island Flagship HQ</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Bell & Interactive Drawer */}
            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                aria-label="Notifications"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative rounded-full w-9 h-9 sm:w-10 sm:h-10 text-[#64748B] hover:text-[#2563EB] hover:border-[#BFDBFE]"
              >
                <FiBell className="w-4 h-4" />
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="top-1.5 right-1.5 absolute bg-red-500 rounded-full w-2.5 h-2.5 ring-2 ring-white animate-pulse" />
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
                    <div className="flex items-center gap-1.5">
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
                className={`flex items-center gap-2.5 bg-[#FFFFFF] py-1.5 pr-3 pl-1.5 border border-[#CBD5E1] hover:border-[#2563EB] rounded-full shadow-xs cursor-pointer transition-colors ${
                  isProfileDropdownOpen ? "ring-2 ring-[#2563EB]/20 border-[#2563EB]" : ""
                }`}
                title="Account Menu"
              >
                <div className="flex justify-center items-center bg-[#EFF6FF] border border-[#BFDBFE] rounded-full w-8 h-8 font-bold text-[#2563EB] text-xs">
                  {userInitials}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="block font-semibold text-[#0F172A] text-xs leading-tight">
                    {userName}
                  </span>
                  <span className="block font-mono text-[#2563EB] text-[10px] leading-none font-bold mt-0.5">
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
                        setIsLogoutModalOpen(true);
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
        <footer className="z-20 flex justify-end items-center bg-[#FFFFFF] px-4 sm:px-6 border-[#E2E8F0] border-t h-8 font-mono text-[#64748B] text-[11px] shrink-0">
          <span>&copy; 2026 Premier Auto Group</span>
        </footer>
      </div>

      {/* Session Sign Out Confirmation Modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Confirm Session Sign Out"
        description="Terminating active enterprise session."
        size="sm"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLogoutModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setIsLogoutModalOpen(false);
                const isCustomer = userRole === "Customer" || userRole === "user";
                if (isCustomer) {
                  clearStoredToken();
                  clearBiometricVerification();
                  window.location.href = "/auth/login";
                } else {
                  // Open mandatory biometric face capture for staff logout
                  setIsBiometricLogoutOpen(true);
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
              leftIcon={<FiLogOut className="w-3.5 h-3.5 text-white" />}
            >
              {userRole === "Customer" || userRole === "user" ? "Confirm Sign Out" : "Verify Face & Sign Out"}
            </Button>
          </div>
        }
      >
        <div className="space-y-3 text-xs text-[#475569]">
          <p>
            Are you sure you want to log out of your <strong className="text-[#0F172A]">{userRole}</strong> session (<span className="text-[#2563EB]">{userEmail}</span>)?
          </p>
          <div className="p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg text-[11px] text-[#1D4ED8] flex items-start gap-2">
            <FiCheckCircle className="w-4 h-4 shrink-0 text-[#2563EB] mt-0.5" />
            <span>
              {userRole === "Customer" || userRole === "user"
                ? "Session tokens will be safely cleared."
                : "Staff security protocol requires camera face capture to finalize official departure and write departure timestamp into the WORM audit ledger."}
            </span>
          </div>
        </div>
      </Modal>

      {/* Staff Mandatory Logout Biometric Face Capture Modal */}
      <BiometricFaceCaptureModal
        isOpen={isBiometricLogoutOpen}
        mode="logout"
        isMandatory={false}
        user={{
          name: userName,
          email: userEmail,
          role: userRole,
          department: departmentName,
        }}
        onCaptureSuccess={(photo, timestamp) => {
          recordLogoutBiometric(photo, timestamp);
          clearStoredToken();
          clearBiometricVerification();
          setIsBiometricLogoutOpen(false);
          window.location.href = "/auth/dashboard-login";
        }}
        onCancel={() => setIsBiometricLogoutOpen(false)}
      />
    </div>
  );
};
