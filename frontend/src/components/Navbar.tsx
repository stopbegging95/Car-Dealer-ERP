"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiPhone,
  FiCalendar,
  FiChevronDown,
  FiMenu,
  FiX,
  FiShield,
} from "react-icons/fi";
import { FaCar } from "react-icons/fa6";
import { Button } from "./ui";

export interface NavbarProps {
  onBookTestDrive?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onBookTestDrive }) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const servicesList = [
    { title: "AI Car Match", href: "/services/ai-car-match", desc: "Find your ideal car with smart preference matching" },
    { title: "Loan Calculator", href: "/services/loan-calculator", desc: "Calculate monthly payments and financing estimates" },
    { title: "Compare Cars", href: "/services/compare", desc: "Side-by-side vehicle specification comparisons" },
    { title: "Auto Brokers", href: "/services/auto-brokers", desc: "Custom vehicle sourcing and auction concierge" },
    { title: "Customs Specialists", href: "/services/customs-specialists", desc: "Import clearance, port logistics and duty coordination" },
    { title: "Sell or Swap", href: "/services/sell-or-swap", desc: "Instant trade-in valuation and vehicle exchange engine" },
  ];

  const companyList = [
    { title: "About Us", href: "/about", desc: "Our heritage, mission and luxury showrooms" },
    { title: "News & Events", href: "/news", desc: "Latest arrivals, automotive exhibitions and press" },
    { title: "Careers", href: "/careers", desc: "Join our executive sales and logistics team" },
    { title: "Contact Us", href: "/contact", desc: "Showroom directory, WhatsApp chat and enquiries" },
  ];

  return (
    <div className="sticky top-0 z-40">
      {/* 1. Top Utility Bar: Phone & Book a Test Drive per user instructions */}
      <div className="bg-[#0F172A] border-b border-slate-800 px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
          <span className="text-[11px] font-mono tracking-wider text-slate-300 uppercase font-bold">
            PREMIER AUTO MOTORS &bull; SHOWROOMS IN VICTORIA ISLAND & MAITAMA ABUJA
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-200">
            <FiPhone className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>(123) 456-7890</span>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={onBookTestDrive}
            leftIcon={<FiCalendar className="w-3.5 h-3.5" />}
          >
            Book a Test Drive
          </Button>
        </div>
      </div>

      {/* 2. Main Public Navigation Header with Dashboard Logins Dropdown */}
      <header className="border-b border-[#E2E8F0] bg-[#FFFFFF]/95 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between relative shadow-xs">
        {/* Brand Logo (PREMIER AUTO MOTORS in Deep Slate & Cobalt Blue) */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex flex-col items-center">
            <svg
              className="w-8 h-4 text-[#2563EB] group-hover:scale-105 transition-transform"
              viewBox="0 0 60 20"
              fill="currentColor"
            >
              <path d="M5 15 C 15 2, 45 2, 55 15 C 45 12, 15 12, 5 15 Z" />
            </svg>
            <div className="text-sm sm:text-base font-black tracking-widest text-[#0F172A] uppercase">
              PREMIER
            </div>
            <div className="text-[8px] font-bold tracking-widest text-[#2563EB] uppercase -mt-0.5">
              AUTO MOTORS
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs sm:text-sm font-semibold">
          <Link
            href="/"
            className={`py-1 transition-colors relative ${
              isActive("/") ? "text-[#2563EB] font-bold" : "text-[#475569] hover:text-[#2563EB]"
            }`}
          >
            Home
            {isActive("/") && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full" />}
          </Link>

          <Link
            href="/inventory"
            className={`py-1 transition-colors relative ${
              isActive("/inventory") ? "text-[#2563EB] font-bold" : "text-[#475569] hover:text-[#2563EB]"
            }`}
          >
            Inventory
            {isActive("/inventory") && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full" />}
          </Link>

          <Link
            href="/services/loan-calculator"
            className={`py-1 transition-colors relative ${
              pathname.startsWith("/services/loan-calculator") ? "text-[#2563EB] font-bold" : "text-[#475569] hover:text-[#2563EB]"
            }`}
          >
            Finance
          </Link>

          {/* Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setServicesDropdownOpen(true)}
            onMouseLeave={() => setServicesDropdownOpen(false)}
          >
            <button
              className={`py-1 flex items-center gap-1 transition-colors ${
                pathname.startsWith("/services") && !pathname.startsWith("/services/loan-calculator")
                  ? "text-[#2563EB] font-bold"
                  : "text-[#475569] hover:text-[#2563EB]"
              }`}
            >
              <span>Services</span>
              <FiChevronDown className="w-3.5 h-3.5" />
            </button>

            {servicesDropdownOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-80 bg-[#FFFFFF] border border-[#CBD5E1] rounded-2xl shadow-2xl p-3 grid gap-1 animate-in fade-in zoom-in-95 duration-150 z-50">
                {servicesList.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    onClick={() => setServicesDropdownOpen(false)}
                    className="p-2.5 rounded-xl hover:bg-[#EFF6FF] transition-colors group block"
                  >
                    <div className="text-xs font-bold text-[#0F172A] group-hover:text-[#2563EB]">
                      {s.title}
                    </div>
                    <div className="text-[10px] text-[#64748B] mt-0.5 line-clamp-1">
                      {s.desc}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/portal"
            className={`py-1 transition-colors ${
              pathname.startsWith("/portal") ? "text-[#2563EB] font-bold" : "text-[#475569] hover:text-[#2563EB]"
            }`}
          >
            My Portal
          </Link>

          {/* Company Dropdown / About Us / Contact */}
          <div
            className="relative"
            onMouseEnter={() => setCompanyDropdownOpen(true)}
            onMouseLeave={() => setCompanyDropdownOpen(false)}
          >
            <button
              className={`py-1 flex items-center gap-1 transition-colors ${
                ["/about", "/news", "/careers", "/contact"].some((p) => pathname.startsWith(p))
                  ? "text-[#2563EB] font-bold"
                  : "text-[#475569] hover:text-[#2563EB]"
              }`}
            >
              <span>Company</span>
              <FiChevronDown className="w-3.5 h-3.5" />
            </button>

            {companyDropdownOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-72 bg-[#FFFFFF] border border-[#CBD5E1] rounded-2xl shadow-2xl p-3 grid gap-1 animate-in fade-in zoom-in-95 duration-150 z-50">
                {companyList.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    onClick={() => setCompanyDropdownOpen(false)}
                    className="p-2.5 rounded-xl hover:bg-[#EFF6FF] transition-colors group block"
                  >
                    <div className="text-xs font-bold text-[#0F172A] group-hover:text-[#2563EB]">
                      {c.title}
                    </div>
                    <div className="text-[10px] text-[#64748B] mt-0.5 line-clamp-1">
                      {c.desc}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/contact"
            className={`py-1 transition-colors ${
              pathname.startsWith("/contact") ? "text-[#2563EB] font-bold" : "text-[#475569] hover:text-[#2563EB]"
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Right Action CTAs: Dashboard Logins Dropdown */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-bold bg-[#0F172A] border border-[#0F172A] text-[#FFFFFF] hover:bg-[#1E293B] shadow-xs transition-all select-none cursor-pointer"
            >
              <FiShield className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Dashboard Logins</span>
              <FiChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${loginDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {loginDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg shadow-2xl p-2.5 grid gap-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1.5 border-b border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#2563EB] font-bold">
                    Enterprise Portals
                  </span>
                  <span className="text-[10px] font-mono text-[#64748B]">Direct Access</span>
                </div>

                {[
                  {
                    title: "Admin Dashboard",
                    subtitle: "Dealership ERP Console",
                    href: "/erp",
                    badge: "Admin & Staff",
                    desc: "Executive analytics, master inventory control, sales, imports & financial ledger",
                    icon: <FiShield className="w-4 h-4 text-[#2563EB]" />,
                  },
                  {
                    title: "User Dashboard",
                    subtitle: "Customer VIP Portal",
                    href: "/portal",
                    badge: "Customer",
                    desc: "Saved garage, test drive bookings, trade-in valuations & personal document vault",
                    icon: <FaCar className="w-4 h-4 text-[#2563EB]" />,
                  },
                ].map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={() => setLoginDropdownOpen(false)}
                    className="p-3 rounded-md hover:bg-[#EFF6FF] border border-transparent hover:border-[#BFDBFE] transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-[#FFFFFF] transition-colors shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors flex items-center gap-1.5">
                          <span>{item.title}</span>
                          <span className="text-[10px] text-[#64748B] font-normal">({item.subtitle})</span>
                        </div>
                        <div className="text-[10px] text-[#64748B] mt-0.5 line-clamp-1">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] shrink-0 font-bold">
                      {item.badge}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl bg-[#FFFFFF] text-[#0F172A] border border-[#CBD5E1] hover:border-[#2563EB]"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFFFFF] border-b border-[#E2E8F0] px-4 py-4 space-y-2 animate-in slide-in-from-top-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-xs font-semibold text-[#0F172A] hover:bg-[#EFF6FF] hover:text-[#2563EB]"
          >
            Home
          </Link>
          <Link
            href="/inventory"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-xs font-semibold text-[#0F172A] hover:bg-[#EFF6FF] hover:text-[#2563EB]"
          >
            Inventory
          </Link>
          <div className="pt-2 border-t border-[#E2E8F0] space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] block px-3">
              Dashboards
            </span>
            <Link
              href="/erp"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-md text-xs font-bold text-[#FFFFFF] bg-[#0F172A]"
            >
              <span>Admin Dashboard</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#2563EB] text-[#FFFFFF]">ERP</span>
            </Link>
            <Link
              href="/portal"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-md text-xs font-bold text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE]"
            >
              <span>User Dashboard</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#2563EB]/15 text-[#2563EB]">Customer</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
