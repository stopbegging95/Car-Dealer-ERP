"use client";

import React from "react";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa6";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0F172A] border-t border-slate-800 text-slate-300 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800">
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <div className="text-lg font-black tracking-widest text-[#FFFFFF] uppercase">
                  PREMIER
                </div>
                <div className="text-[9px] font-bold tracking-widest text-[#38BDF8] uppercase -mt-0.5">
                  AUTO MOTORS &bull; LUXAUTO ERP
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              Nigeria&apos;s premier luxury vehicle dealership and automotive enterprise platform.
              Specializing in direct sales, VIP trade-ins, custom international brokering, and customs clearance.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/2348001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1E293B] text-[#38BDF8] border border-slate-700 hover:border-[#38BDF8] hover:bg-[#2563EB] hover:text-[#FFFFFF] text-xs font-semibold transition-all shadow-xs"
              >
                <FaWhatsapp className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Column 2: Vehicle Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#38BDF8] mb-3">
              Vehicle Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/inventory?cat=executive-class" className="hover:text-[#60A5FA] transition-colors">
                  Executive Class
                </Link>
              </li>
              <li>
                <Link href="/inventory?cat=sport-performance" className="hover:text-[#60A5FA] transition-colors">
                  Sport & Performance
                </Link>
              </li>
              <li>
                <Link href="/inventory?cat=premium-suvs" className="hover:text-[#60A5FA] transition-colors">
                  Premium SUVs
                </Link>
              </li>
              <li>
                <Link href="/inventory?cat=electric-vehicles" className="hover:text-[#60A5FA] transition-colors">
                  Electric Vehicles
                </Link>
              </li>
              <li>
                <Link href="/inventory?cat=power-bikes" className="hover:text-[#60A5FA] transition-colors">
                  Power Bikes
                </Link>
              </li>
              <li>
                <Link href="/inventory?cat=executive-buses" className="hover:text-[#60A5FA] transition-colors">
                  Executive Buses
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Automotive Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#38BDF8] mb-3">
              Automotive Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/services/ai-car-match" className="hover:text-[#60A5FA] transition-colors">
                  AI Car Match
                </Link>
              </li>
              <li>
                <Link href="/services/loan-calculator" className="hover:text-[#60A5FA] transition-colors">
                  Loan Financing Calculator
                </Link>
              </li>
              <li>
                <Link href="/services/compare" className="hover:text-[#60A5FA] transition-colors">
                  Compare Cars
                </Link>
              </li>
              <li>
                <Link href="/services/auto-brokers" className="hover:text-[#60A5FA] transition-colors">
                  Auto Brokers Sourcing
                </Link>
              </li>
              <li>
                <Link href="/services/customs-specialists" className="hover:text-[#60A5FA] transition-colors">
                  Customs Clearance
                </Link>
              </li>
              <li>
                <Link href="/services/sell-or-swap" className="hover:text-[#60A5FA] transition-colors">
                  Sell or Swap Trade-In
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Dealership Showrooms */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#38BDF8] mb-3">
              Showroom Suites
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div>
                <strong className="text-slate-200 block">Victoria Island Flagship:</strong>
                <span>Plot 1204, Adeola Odeku Street, VI, Lagos</span>
              </div>
              <div>
                <strong className="text-slate-200 block">Maitama Diplomatic Suite:</strong>
                <span>44 Gana Street, Maitama, Abuja</span>
              </div>
              <div className="pt-1">
                <span className="text-[10px] font-mono text-[#38BDF8]">Mon - Sat: 8:00 AM - 7:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Portals */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>&copy; 2026 Premier Auto Motors &bull; LuxAuto Enterprise ERP Platform. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs font-mono">
            <Link href="/portal" className="text-slate-400 hover:text-[#38BDF8] transition-colors">
              Customer Portal
            </Link>
            <span>&bull;</span>
            <Link href="/erp" className="text-[#38BDF8] hover:underline font-bold">
              Staff ERP Console
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
