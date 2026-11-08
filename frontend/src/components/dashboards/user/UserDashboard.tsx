"use client";

import React, { useState } from "react";
import {
  FiLayers,
  FiHeart,
  FiCompass,
  FiFileText,
  FiDollarSign,
  FiCalendar,
  FiRepeat,
  FiShield,
  FiSettings,
  FiTruck,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { Button, Badge, Modal, Input, Dropdown } from "@/components/ui";
import { DashboardLayout } from "@/components/DashboardLayout";
import { VEHICLES, Vehicle } from "@/data/vehicles";
import { OverviewTab, ActiveRequestItem } from "./OverviewTab";
import { GarageTab } from "./GarageTab";
import { TestDrivesTab, TestDriveItem } from "./TestDrivesTab";
import { TradeInsTab } from "./TradeInsTab";
import { SourcingBriefsTab } from "./SourcingBriefsTab";
import { CustomsTrackerTab, CustomsTrackingItem } from "./CustomsTrackerTab";
import { InvoicesTab, CustomerInvoice } from "./InvoicesTab";
import { DocumentVaultTab, CustomerDocument } from "./DocumentVaultTab";
import { SecuritySettingsTab } from "./SecuritySettingsTab";

export function UserDashboard({ initialTab = "Overview" }: { initialTab?: string }) {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [isNewBriefModalOpen, setIsNewBriefModalOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<"USD" | "NGN">("USD");

  const savedVehicles: Vehicle[] = VEHICLES.slice(0, 3);

  const activeRequests: ActiveRequestItem[] = [
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

  const testDriveBookings: TestDriveItem[] = [
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

  const customsTracking: CustomsTrackingItem[] = [
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

  const customerInvoices: CustomerInvoice[] = [
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

  const documents: CustomerDocument[] = [
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
        <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-4 bg-[#FFFFFF] shadow-sm p-4 sm:p-5 border border-[#CBD5E1] rounded-2xl">
          <div className="flex items-center gap-3.5">
            <div className="flex justify-center items-center bg-[#EFF6FF] border-[#2563EB] border-2 rounded-full w-12 h-12 font-bold text-[#2563EB] text-sm">
              AV
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-[#0F172A] text-base sm:text-lg">Chief Alexander Vance</h1>
                <Badge variant="gold" size="sm">
                  VIP Black Tier
                </Badge>
              </div>
              <p className="mt-0.5 text-[#64748B] text-xs">
                alexander.vance@executive.com &bull; Client ID: LUX-88029 &bull; Verified Diplomatic KYC
              </p>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="bg-[#F8FAFC] px-3 py-1.5 border border-[#E2E8F0] rounded-xl text-center">
              <span className="block text-[#64748B] text-[10px]">Saved Cars</span>
              <span className="font-bold text-[#2563EB] text-sm">{savedVehicles.length}</span>
            </div>
            <div className="bg-[#F8FAFC] px-3 py-1.5 border border-[#E2E8F0] rounded-xl text-center">
              <span className="block text-[#64748B] text-[10px]">Active Briefs</span>
              <span className="font-bold text-[#2563EB] text-sm">{activeRequests.length}</span>
            </div>
            <div className="bg-[#F8FAFC] px-3 py-1.5 border border-[#E2E8F0] rounded-xl text-center">
              <span className="block text-[#64748B] text-[10px]">Vault Files</span>
              <span className="font-bold text-[#0F172A] text-sm">{documents.length}</span>
            </div>
          </div>
        </div>

        {/* Separated Sub-Pages / Tabs */}
        {activeTab === "Overview" && (
          <OverviewTab
            savedVehicles={savedVehicles}
            activeRequests={activeRequests}
            documentsCount={documents.length}
            onOpenNewBriefModal={() => setIsNewBriefModalOpen(true)}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === "My Garage & Saved Cars" && (
          <GarageTab savedVehicles={savedVehicles} />
        )}

        {activeTab === "Active Test Drives" && (
          <TestDrivesTab testDriveBookings={testDriveBookings} />
        )}

        {activeTab === "Trade-In & Swap Tracker" && (
          <TradeInsTab />
        )}

        {activeTab === "Auto Broker Sourcing" && (
          <SourcingBriefsTab
            activeRequests={activeRequests}
            onOpenNewBriefModal={() => setIsNewBriefModalOpen(true)}
          />
        )}

        {activeTab === "Customs Import Tracker" && (
          <CustomsTrackerTab customsTracking={customsTracking} />
        )}

        {activeTab === "Invoices & Receipts" && (
          <InvoicesTab
            customerInvoices={customerInvoices}
            selectedCurrency={selectedCurrency}
            onSelectCurrency={setSelectedCurrency}
          />
        )}

        {activeTab === "Document Vault" && (
          <DocumentVaultTab documents={documents} />
        )}

        {["KYC & Verification", "Security & Settings"].includes(activeTab) && (
          <SecuritySettingsTab onReturnToOverview={() => setActiveTab("Overview")} />
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
          <div className="gap-3 grid grid-cols-1 sm:grid-cols-2">
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

