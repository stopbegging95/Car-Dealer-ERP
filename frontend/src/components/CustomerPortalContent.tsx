"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiLayers,
  FiHeart,
  FiCompass,
  FiFileText,
  FiDownload,
  FiCalendar,
  FiRepeat,
  FiShield,
  FiSettings,
  FiTruck,
  FiDollarSign,
  FiCheckCircle,
  FiClock,
  FiPlus,
  FiMapPin,
  FiPhone,
  FiCheck,
  FiX,
  FiArrowRight,
} from "react-icons/fi";
import { Button, Badge, KPICard, Modal, Input, Dropdown } from "@/components/ui";
import { DashboardLayout } from "@/components/DashboardLayout";
import { VEHICLES, Vehicle } from "@/data/vehicles";

export function CustomerPortalContent({ initialTab = "Overview" }: { initialTab?: string }) {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [isNewBriefModalOpen, setIsNewBriefModalOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<"USD" | "NGN">("USD");

  const savedVehicles: Vehicle[] = VEHICLES.slice(0, 3);

  const activeRequests = [
    {
      id: "REQ-7782",
      type: "Auto Broker Sourcing",
      vehicle: "Porsche 911 GT3 RS (2024)",
      stage: "Physical Inspection in Munich",
      status: "In Progress",
      date: "Nov 04, 2026",
      market: "Germany (Stuttgart)",
      budget: "$340,000",
      broker: "Marcus V. (Antwerp Desk)",
    },
    {
      id: "REQ-6190",
      type: "Trade-In Swap",
      vehicle: "Mercedes-Benz E350 -> S580",
      stage: "Showroom Physical Appraisal Scheduled",
      status: "Action Required",
      date: "Nov 02, 2026",
      market: "Lagos Flagship",
      budget: "$132,500 Balance",
      broker: "Emeka O. (VIP Sales)",
    },
  ];

  const testDriveBookings = [
    {
      id: "TD-881",
      vehicle: "2024 Mercedes-Maybach S580",
      stockId: "STK-2026-001",
      date: "Nov 15, 2026 at 2:00 PM",
      showroom: "Victoria Island Flagship Showroom, Lagos",
      liaison: "Senior Executive Emeka O.",
      phone: "+234 (0) 800 123 4567",
      status: "Confirmed",
    },
    {
      id: "TD-884",
      vehicle: "2024 Porsche 911 Turbo S",
      stockId: "STK-2026-002",
      date: "Nov 22, 2026 at 11:30 AM",
      showroom: "Maitama Diplomatic Zone Suite, Abuja",
      liaison: "VIP Relations Aisha M.",
      phone: "+234 (0) 800 987 6543",
      status: "Pending VIP Clearance",
    },
  ];

  const customsTracking = [
    {
      ref: "CUS-9918",
      vehicle: "2024 Mercedes-Maybach S580 (Dual-Tone)",
      vessel: "MSC ALTAIR V.98",
      container: "MSCU-9283710",
      bol: "MEDUAN882910",
      portLoading: "Antwerp, Belgium",
      portDischarge: "Tin Can Island Container Terminal (TCIT), Lagos",
      eta: "Nov 12, 2026",
      stages: [
        { label: "Loaded & Shipped", date: "Oct 20", done: true },
        { label: "Atlantic Transit", date: "Nov 01", done: true },
        { label: "Lagos Port Berth", date: "Nov 06", done: true },
        { label: "Customs SGD Assessment", date: "Nov 09", current: true },
        { label: "Showroom Handover", date: "Nov 12", done: false },
      ],
      clearingOfficer: "Lead Officer Babatunde E.",
    },
  ];

  const customerInvoices = [
    {
      id: "INV-2026-9912",
      description: "Initial Commitment Deposit (Mercedes-Maybach S580)",
      vehicle: "STK-2026-001",
      date: "Nov 01, 2026",
      amountUSD: 30000,
      amountNGN: 45000000,
      status: "Paid",
      method: "Wire Transfer (First Bank)",
    },
    {
      id: "INV-2026-9844",
      description: "Auto Broker Sourcing Retainer & German Inspection Fee",
      vehicle: "Porsche 911 GT3 RS",
      date: "Oct 25, 2026",
      amountUSD: 15000,
      amountNGN: 22500000,
      status: "Paid",
      method: "USD Nostro Account",
    },
    {
      id: "INV-2026-9720",
      description: "Single Goods Declaration (SGD) Port Customs CET Duty",
      vehicle: "Tin Can Assessment",
      date: "Oct 20, 2026",
      amountUSD: 22750,
      amountNGN: 34125000,
      status: "Settled",
      method: "NCS Direct Remittance",
    },
  ];

  const documents = [
    {
      name: "Sales Agreement & Title Transfer (Mercedes-Benz S580)",
      type: "Sales Contract",
      date: "Nov 01, 2026",
      size: "2.4 MB PDF",
    },
    {
      name: "Single Goods Declaration (SGD) - Port Customs Release",
      type: "Customs Duty Certificate",
      date: "Oct 25, 2026",
      size: "1.8 MB PDF",
    },
    {
      name: "150-Point Dealership Diagnostic & Health Seal",
      type: "Inspection Report",
      date: "Oct 20, 2026",
      size: "3.1 MB PDF",
    },
    {
      name: "Marine Bill of Lading (B/L) - Antwerp Discharge",
      type: "Shipping Document",
      date: "Oct 18, 2026",
      size: "1.4 MB PDF",
    },
  ];

  const mainMenuItems = [
    { name: "Overview", icon: <FiLayers className="w-4 h-4 shrink-0" /> },
    { name: "My Garage & Saved Cars", icon: <FiHeart className="w-4 h-4 shrink-0" />, badge: `${savedVehicles.length}` },
    { name: "Active Test Drives", icon: <FiCalendar className="w-4 h-4 shrink-0" />, badge: `${testDriveBookings.length}` },
    { name: "Trade-In & Swap Tracker", icon: <FiRepeat className="w-4 h-4 shrink-0" /> },
    { name: "Auto Broker Sourcing", icon: <FiCompass className="w-4 h-4 shrink-0" />, badge: `${activeRequests.length}` },
    { name: "Customs Import Tracker", icon: <FiTruck className="w-4 h-4 shrink-0" />, badge: "1 Vessel" },
    { name: "Invoices & Receipts", icon: <FiDollarSign className="w-4 h-4 shrink-0" /> },
    { name: "Document Vault", icon: <FiFileText className="w-4 h-4 shrink-0" />, badge: `${documents.length}` },
  ];

  const systemMenuItems = [
    { name: "KYC & Verification", icon: <FiShield className="w-4 h-4 shrink-0" /> },
    { name: "Security & Settings", icon: <FiSettings className="w-4 h-4 shrink-0" /> },
  ];

  return (
    <DashboardLayout
      title="Customer Portal"
      activeModule={activeTab}
      onSelectModule={setActiveTab}
      mainMenuItems={mainMenuItems}
      systemMenuItems={systemMenuItems}
      branchName="VIP Private Client Desk"
      userRole="VIP Black Tier"
      userName="Chief Alexander Vance"
      userInitials="AV"
    >
      <div className="space-y-5">
        {/* Customer Identity Banner (VIP Black Tier) */}
        <div className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-[#EFF6FF] border-2 border-[#2563EB] flex items-center justify-center text-sm font-bold text-[#2563EB]">
              AV
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-[#0F172A]">Chief Alexander Vance</h1>
                <Badge variant="gold" size="sm">
                  VIP Black Tier
                </Badge>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                alexander.vance@executive.com &bull; Client ID: LUX-88029 &bull; Verified Diplomatic KYC
              </p>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="bg-[#F8FAFC] px-3 py-1.5 rounded-xl border border-[#E2E8F0] text-center">
              <span className="text-[10px] text-[#64748B] block">Saved Cars</span>
              <span className="font-bold text-[#2563EB] text-sm">{savedVehicles.length}</span>
            </div>
            <div className="bg-[#F8FAFC] px-3 py-1.5 rounded-xl border border-[#E2E8F0] text-center">
              <span className="text-[10px] text-[#64748B] block">Active Briefs</span>
              <span className="font-bold text-[#2563EB] text-sm">{activeRequests.length}</span>
            </div>
            <div className="bg-[#F8FAFC] px-3 py-1.5 rounded-xl border border-[#E2E8F0] text-center">
              <span className="text-[10px] text-[#64748B] block">Vault Files</span>
              <span className="font-bold text-[#0F172A] text-sm">{documents.length}</span>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* MODULE 1: CUSTOMER OVERVIEW [CP-02]                               */}
        {/* ================================================================= */}
        {activeTab === "Overview" && (
          <div className="space-y-4">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <KPICard
                title="Active Acquisitions"
                value="2 Units"
                change="1 En Route to Lagos"
                icon={<FiCompass className="w-4 h-4" />}
              />
              <KPICard
                title="Trade-In Equity Approved"
                value="$45,000"
                change="Locked for 14 Days"
                icon={<FiRepeat className="w-4 h-4" />}
              />
              <KPICard
                title="Test Drives Scheduled"
                value="1 Booking"
                change="Nov 15, Victoria Island"
                icon={<FiCalendar className="w-4 h-4" />}
              />
              <KPICard
                title="Customs Duty Status"
                value="SGD Cleared"
                change="Tin Can Berth Discharged"
                icon={<FiTruck className="w-4 h-4" />}
              />
            </div>

            {/* Live Vehicle Order & Sourcing Timeline */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB]">
                    Active Acquisition & Sourcing Status
                  </h3>
                  <p className="text-[11px] text-[#64748B]">Real-time logistics, inspection, and delivery timeline</p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsNewBriefModalOpen(true)}
                  leftIcon={<FiPlus className="w-3.5 h-3.5" />}
                >
                  New Sourcing Brief
                </Button>
              </div>

              <div className="space-y-2.5">
                {activeRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#2563EB]">{req.id}</span>
                        <span className="text-[#CBD5E1]">&bull;</span>
                        <span className="text-xs text-[#0F172A] font-bold">{req.vehicle}</span>
                      </div>
                      <span className="text-[11px] text-[#64748B] mt-0.5 block">
                        Stage: <strong className="text-[#0F172A]">{req.stage}</strong> &bull; Broker: {req.broker} &bull; Budget: {req.budget}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant="gold" size="sm" dot>
                        {req.status}
                      </Badge>
                      <span className="text-[10px] text-[#64748B] font-mono">{req.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 space-y-2 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB]">
                  <FiHeart className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-[#0F172A]">Saved Garage Vehicles</h4>
                <p className="text-xs text-[#64748B]">
                  Review your {savedVehicles.length} bookmarked showroom models and run loan estimations.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab("My Garage & Saved Cars")}
                  rightIcon={<FiArrowRight className="w-3 h-3" />}
                  className="text-[#2563EB] px-0 pt-1"
                >
                  View Saved Garage
                </Button>
              </div>

              <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 space-y-2 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB]">
                  <FiTruck className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-[#0F172A]">Port Customs Tracking</h4>
                <p className="text-xs text-[#64748B]">
                  Live single goods declaration status and vessel progress for your imported models.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab("Customs Import Tracker")}
                  rightIcon={<FiArrowRight className="w-3 h-3" />}
                  className="text-[#2563EB] px-0 pt-1"
                >
                  Track Shipments
                </Button>
              </div>

              <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 space-y-2 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB]">
                  <FiFileText className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-[#0F172A]">Vault Documents</h4>
                <p className="text-xs text-[#64748B]">
                  Download encrypted purchase contracts, PDI health certificates, and customs tax receipts.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab("Document Vault")}
                  rightIcon={<FiArrowRight className="w-3 h-3" />}
                  className="text-[#2563EB] px-0 pt-1"
                >
                  Open Vault
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODULE 2: MY GARAGE & SAVED VEHICLES [CP-03]                      */}
        {/* ================================================================= */}
        {activeTab === "My Garage & Saved Cars" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FFFFFF] p-4 rounded-2xl border border-[#E2E8F0] shadow-sm">
              <div>
                <h3 className="text-base font-bold text-[#0F172A] uppercase tracking-tight">
                  My Saved Garage ({savedVehicles.length})
                </h3>
                <p className="text-xs text-[#64748B]">Bookmarked models with real-time price monitoring and comparison.</p>
              </div>

              <div className="flex items-center gap-2">
                <Link href="/services/compare">
                  <Button variant="outline" size="sm">
                    Compare All 3 Vehicles
                  </Button>
                </Link>
                <Link href="/inventory">
                  <Button variant="primary" size="sm">
                    Browse More Cars
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {savedVehicles.map((car) => (
                <div
                  key={car.stockId}
                  className="bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#2563EB] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 w-full bg-[#0F172A]">
                      <Image
                        src={car.image}
                        alt={car.model}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized
                        className="object-cover"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2 py-0.5 rounded bg-[#000000]/85 text-white font-mono text-[10px] font-bold border border-white/20">
                          {car.stockId}
                        </span>
                      </div>
                      <div className="absolute top-2.5 right-2.5">
                        <Badge variant="gold" size="sm">
                          {car.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4 space-y-1.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB]">
                        {car.category}
                      </div>
                      <h4 className="text-sm font-bold text-[#0F172A] truncate">
                        {car.make} {car.model}
                      </h4>
                      <p className="text-xs text-[#64748B] truncate">{car.trim}</p>

                      <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-mono font-bold text-[#1D4ED8]">
                        <span>${car.priceUSD.toLocaleString()}</span>
                        <span className="text-[#64748B] font-normal text-[11px]">{car.year} &bull; {car.mileage.toLocaleString()} KM</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                    <Link href={`/inventory/${car.stockId}`} className="w-full">
                      <Button variant="primary" size="sm" fullWidth>
                        Details
                      </Button>
                    </Link>
                    <Link href={`/services/loan-calculator?price=${car.priceUSD}`} className="w-full">
                      <Button variant="outline" size="sm" fullWidth>
                        Finance
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODULE 3: ACTIVE TEST DRIVE APPOINTMENTS [CP-04]                   */}
        {/* ================================================================= */}
        {activeTab === "Active Test Drives" && (
          <div className="space-y-4">
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#0F172A] uppercase tracking-tight">
                    VIP Test Drive Appointments ({testDriveBookings.length})
                  </h3>
                  <p className="text-xs text-[#64748B]">Scheduled private showroom viewings with assigned client relations liaisons.</p>
                </div>
                <Link href="/inventory">
                  <Button variant="primary" size="sm" leftIcon={<FiPlus className="w-3.5 h-3.5" />}>
                    Book Another Test Drive
                  </Button>
                </Link>
              </div>

              <div className="space-y-3 pt-1">
                {testDriveBookings.map((td) => (
                  <div
                    key={td.id}
                    className="p-4 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#2563EB]">{td.id}</span>
                        <span className="text-[#CBD5E1]">&bull;</span>
                        <h4 className="text-sm font-bold text-[#0F172A]">{td.vehicle}</h4>
                        <Badge variant="gold" size="sm">{td.status}</Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#475569] pt-1">
                        <span className="flex items-center gap-1 font-semibold text-[#0F172A]">
                          <FiCalendar className="w-3.5 h-3.5 text-[#2563EB]" />
                          {td.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiMapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                          {td.showroom}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiPhone className="w-3.5 h-3.5 text-[#2563EB]" />
                          {td.liaison} ({td.phone})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-auto">
                      <Link href={`/inventory/${td.stockId}`}>
                        <Button variant="outline" size="sm">
                          Car Specs
                        </Button>
                      </Link>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => alert(`Reschedule request submitted for ${td.vehicle}. Your liaison will call you shortly.`)}
                      >
                        Reschedule
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODULE 4: TRADE-IN & SWAP TRACKER [CP-05]                         */}
        {/* ================================================================= */}
        {activeTab === "Trade-In & Swap Tracker" && (
          <div className="space-y-4">
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-[#0F172A] uppercase tracking-tight">
                    Active Trade-In / Swap Valuations
                  </h3>
                  <p className="text-xs text-[#64748B]">Digital 150-point valuation appraisal and equity settlement.</p>
                </div>
                <Link href="/services/sell-or-swap">
                  <Button variant="primary" size="sm">
                    + Start New Vehicle Swap
                  </Button>
                </Link>
              </div>

              {/* Trade-In Card Details */}
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#2563EB]">SWP-4401</span>
                    <h4 className="text-sm font-bold text-[#0F172A]">Trade-In & Upgrade Agreement</h4>
                  </div>
                  <Badge variant="gold" size="sm">Appraisal Approved</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] space-y-1">
                    <span className="text-[10px] text-[#64748B] uppercase font-bold block">Trade-In Vehicle</span>
                    <div className="font-bold text-[#0F172A]">2020 Mercedes-Benz E350 AMG</div>
                    <span className="text-[11px] text-[#64748B]">Mileage: 42,000 KM &bull; Non-Accident</span>
                  </div>

                  <div className="p-3 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] space-y-1">
                    <span className="text-[10px] text-[#64748B] uppercase font-bold block">Target Showroom Model</span>
                    <div className="font-bold text-[#0F172A]">2024 Mercedes-Maybach S580</div>
                    <span className="text-[11px] text-[#1D4ED8] font-mono font-bold">Price: $165,000 USD</span>
                  </div>

                  <div className="p-3 bg-[#EFF6FF] rounded-xl border border-[#BFDBFE] space-y-1">
                    <span className="text-[10px] text-[#2563EB] uppercase font-bold block">Certified Swap Equity</span>
                    <div className="font-bold text-[#1D4ED8] text-sm font-mono">$32,500 Approved</div>
                    <span className="text-[11px] text-[#1D4ED8] font-bold block">
                      Balance Due: $132,500 (₦198,750,000)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2">
                  <span className="text-[#64748B]">
                    Status: <strong className="text-[#0F172A]">Two-Factor Director Approval Signed. Physical Handover Scheduled Nov 18.</strong>
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => alert("Downloading signed swap quotation...")}
                    rightIcon={<FiArrowRight className="w-3 h-3" />}
                    className="text-[#2563EB] px-0"
                  >
                    Download Agreement PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODULE 5: AUTO BROKER SOURCING REQUESTS [CP-06]                   */}
        {/* ================================================================= */}
        {activeTab === "Auto Broker Sourcing" && (
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-[#0F172A] uppercase tracking-tight">
                  International Auto Broker Briefs
                </h3>
                <p className="text-xs text-[#64748B]">Active vehicle sourcing scans across German, Belgian, and UAE dealer networks.</p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsNewBriefModalOpen(true)}
                leftIcon={<FiPlus className="w-3.5 h-3.5" />}
              >
                + New Sourcing Brief
              </Button>
            </div>

            <div className="space-y-3">
              {activeRequests.map((req) => (
                <div key={req.id} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#2563EB]">{req.id}</span>
                      <span className="text-[#CBD5E1]">&bull;</span>
                      <h4 className="text-sm font-bold text-[#0F172A]">{req.vehicle}</h4>
                    </div>
                    <Badge variant="gold" size="sm">{req.status}</Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#475569] pt-2 border-t border-[#E2E8F0]">
                    <div><strong>Target Market:</strong> {req.market}</div>
                    <div><strong>Budget Ceiling:</strong> <span className="font-mono text-[#1D4ED8] font-bold">{req.budget}</span></div>
                    <div><strong>Broker Desk:</strong> {req.broker}</div>
                  </div>

                  <p className="text-xs text-[#0F172A] pt-1">
                    Current Milestone: <strong className="text-[#2563EB]">{req.stage}</strong> (Paint depth & engine ECU diagnostic certified).
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODULE 6: CUSTOMS IMPORT PROGRESS TRACKER [CP-07]                 */}
        {/* ================================================================= */}
        {activeTab === "Customs Import Tracker" && (
          <div className="space-y-4">
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#0F172A] uppercase tracking-tight">
                  Live Customs Import & Vessel Tracker
                </h3>
                <p className="text-xs text-[#64748B]">Real-time ocean transit, Tin Can Island port discharge, and customs clearance status.</p>
              </div>

              {customsTracking.map((item) => (
                <div key={item.ref} className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E2E8F0]">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#2563EB] mr-2">{item.ref}</span>
                      <h4 className="text-base font-bold text-[#0F172A] inline">{item.vehicle}</h4>
                    </div>
                    <Badge variant="gold" size="sm">ETA: {item.eta}</Badge>
                  </div>

                  {/* 5-Step Visual Stepper */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2">
                    {item.stages.map((stg, i) => (
                      <div
                        key={i}
                        className={`p-2.5 rounded-xl border text-center space-y-1 ${
                          stg.done
                            ? "bg-[#EFF6FF] border-[#BFDBFE] text-[#2563EB]"
                            : stg.current
                            ? "bg-[#2563EB] text-[#FFFFFF] border-[#2563EB] shadow-md shadow-[#2563EB]/25"
                            : "bg-[#FFFFFF] border-[#E2E8F0] text-[#94A3B8]"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1 text-[11px] font-bold">
                          {stg.done && <FiCheckCircle className="w-3.5 h-3.5 text-[#2563EB]" />}
                          {stg.current && <FiClock className="w-3.5 h-3.5 text-white animate-spin" />}
                          <span>Step {i + 1}</span>
                        </div>
                        <div className="text-xs font-semibold">{stg.label}</div>
                        <div className="text-[10px] font-mono opacity-80">{stg.date}</div>
                      </div>
                    ))}
                  </div>

                  {/* Shipment Particulars */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#E2E8F0] text-xs">
                    <div>
                      <span className="text-[10px] text-[#64748B] block">Vessel Name</span>
                      <strong className="text-[#0F172A]">{item.vessel}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#64748B] block">Container No</span>
                      <strong className="text-[#0F172A] font-mono">{item.container}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#64748B] block">Bill of Lading</span>
                      <strong className="text-[#0F172A] font-mono">{item.bol}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#64748B] block">Clearing Officer</span>
                      <strong className="text-[#2563EB]">{item.clearingOfficer}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODULE 7: INVOICES & PAYMENT RECEIPTS [CP-08]                     */}
        {/* ================================================================= */}
        {activeTab === "Invoices & Receipts" && (
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-[#0F172A] uppercase tracking-tight">
                  Invoices & Payment Receipts
                </h3>
                <p className="text-xs text-[#64748B]">Official purchase agreements, initial deposits, and port duty receipts.</p>
              </div>

              <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl border border-[#CBD5E1]">
                <Button
                  variant={selectedCurrency === "USD" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCurrency("USD")}
                  className="font-mono text-xs px-3 py-1"
                >
                  $ USD
                </Button>
                <Button
                  variant={selectedCurrency === "NGN" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCurrency("NGN")}
                  className="font-mono text-xs px-3 py-1"
                >
                  ₦ NGN
                </Button>
              </div>
            </div>

            <div className="space-y-2.5">
              {customerInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#2563EB]">{inv.id}</span>
                      <span className="text-[#CBD5E1]">&bull;</span>
                      <h4 className="text-xs sm:text-sm font-bold text-[#0F172A]">{inv.description}</h4>
                    </div>
                    <span className="text-[11px] text-[#64748B] block">
                      Vehicle: {inv.vehicle} &bull; Method: {inv.method} &bull; Date: {inv.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-mono font-bold text-[#1D4ED8]">
                        {selectedCurrency === "USD"
                          ? `$${inv.amountUSD.toLocaleString()}`
                          : `₦${inv.amountNGN.toLocaleString()}`}
                      </div>
                      <Badge variant="gold" size="sm">{inv.status}</Badge>
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => alert(`Downloading official PDF tax receipt for ${inv.id}...`)}
                      title="Download PDF Receipt"
                      className="p-2"
                    >
                      <FiDownload className="w-4 h-4 text-[#2563EB]" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODULE 8: DOCUMENT VAULT [CP-08]                                  */}
        {/* ================================================================= */}
        {activeTab === "Document Vault" && (
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-[#0F172A] uppercase tracking-tight">
                Encrypted Vehicle Document Vault
              </h3>
              <p className="text-xs text-[#64748B]">
                Official title transfers, Single Goods Declarations (SGDs), and pre-delivery inspection health sheets.
              </p>
            </div>

            <div className="space-y-2.5">
              {documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] shrink-0">
                      <FiFileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0F172A]">{doc.name}</h4>
                      <span className="text-[10px] text-[#64748B] block">
                        {doc.type} &bull; {doc.date} &bull; {doc.size}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => alert(`Downloading ${doc.name}...`)}
                    leftIcon={<FiDownload className="w-3.5 h-3.5" />}
                  >
                    Download PDF
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODULE 9: KYC & SECURITY SETTINGS [CP-09]                         */}
        {/* ================================================================= */}
        {["KYC & Verification", "Security & Settings"].includes(activeTab) && (
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-3.5 pb-4 border-b border-[#E2E8F0]">
              <div className="w-12 h-12 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB]">
                <FiShield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">VIP Diplomatic & KYC Verification</h3>
                <p className="text-xs text-[#64748B]">Profile status: Tier-3 Verified under LuxAuto Security Protocols.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-2">
                <span className="font-bold text-[#0F172A] block">Identity Documents</span>
                <div className="flex items-center justify-between text-[#475569]">
                  <span>Diplomatic Passport Verified:</span>
                  <Badge variant="gold" size="sm">Active (2029)</Badge>
                </div>
                <div className="flex items-center justify-between text-[#475569]">
                  <span>Proof of Address (Victoria Island):</span>
                  <Badge variant="gold" size="sm">Verified</Badge>
                </div>
              </div>

              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-2">
                <span className="font-bold text-[#0F172A] block">Security Protocols</span>
                <div className="flex items-center justify-between text-[#475569]">
                  <span>Two-Factor Authentication:</span>
                  <Badge variant="gold" size="sm">Enabled (SMS + App)</Badge>
                </div>
                <div className="flex items-center justify-between text-[#475569]">
                  <span>Encrypted Vault Access:</span>
                  <Badge variant="gold" size="sm">256-Bit SSL</Badge>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button variant="primary" size="sm" onClick={() => setActiveTab("Overview")}>
                Return to Garage Overview
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* New Sourcing Brief Modal */}
      <Modal
        isOpen={isNewBriefModalOpen}
        onClose={() => setIsNewBriefModalOpen(false)}
        size="lg"
        title="Submit Bespoke Vehicle Sourcing Brief"
        description="Our European and American buying desks will scan private auctions and certified dealerships for your vehicle."
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsNewBriefModalOpen(false)}
              leftIcon={<FiX className="w-3.5 h-3.5 text-[#64748B]" />}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                alert("Sourcing brief submitted! Your assigned broker will contact you within 4 hours.");
                setIsNewBriefModalOpen(false);
              }}
              leftIcon={<FiCheck className="w-3.5 h-3.5 text-[#FFFFFF]" />}
            >
              Submit Brief
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input label="Target Make & Model" placeholder="e.g. Ferrari Purosangue or Porsche 911 Dakar" required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Year Range" placeholder="2023 - 2025" required />
            <Input label="Maximum Budget ($ USD)" placeholder="$350,000" required />
          </div>
          <Dropdown
            label="Preferred Sourcing Market"
            options={[
              { label: "Germany (Stuttgart / Munich)", value: "Germany" },
              { label: "United States (California / Florida)", value: "USA" },
              { label: "United Arab Emirates (Dubai)", value: "UAE" },
              { label: "United Kingdom (London)", value: "UK" },
            ]}
            onChange={() => {}}
          />
          <Input label="Special Exterior / Interior Color Preferences" placeholder="e.g. British Racing Green / Tan Leather" />
        </div>
      </Modal>
    </DashboardLayout>
  );
}
