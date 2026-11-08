"use client";

import React, { useState } from "react";
import {
  FiCompass,
  FiGlobe,
  FiCheckCircle,
  FiFileText,
  FiCheck,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button, Input, Dropdown, Modal, PageBanner } from "@/components/ui";

export default function AutoBrokersPage() {
  const [targetMake, setTargetMake] = useState("");
  const [targetModel, setTargetModel] = useState("");
  const [minYear, setMinYear] = useState("2023");
  const [budgetUSD, setBudgetUSD] = useState("180000");
  const [sourcingMarket, setSourcingMarket] = useState("USA");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const stages = [
    { num: 1, title: "Sourcing Request", desc: "Specifications & budget locked with assigned concierge", done: true },
    { num: 2, title: "Global Market Scan", desc: "Auction & private dealer screening across US/EU/UAE", done: true },
    { num: 3, title: "Physical Inspection", desc: "150-point report, diagnostic scans & paint meter checks", active: true },
    { num: 4, title: "Purchase & Title Lock", desc: "Wire escrow settlement and original export title secured" },
    { num: 5, title: "Container Shipping", desc: "RORO or dedicated 20ft container vessel transit" },
    { num: 6, title: "Customs Port Clearance", desc: "Lagos/Tin Can terminal assessment and duty clearance" },
    { num: 7, title: "White-Glove Handover", desc: "Detailing, ceramic coating and delivery to your residence" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-[#2563EB] selection:text-[#FFFFFF]">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Banner */}
        <PageBanner
          badge="INTERNATIONAL BESPOKE SOURCING"
          title="GLOBAL AUTO"
          titleHighlight="BROKER DESK"
          subtitle="Direct private scans across German, Belgian, and UAE dealership networks with doorstep delivery and verified title."
          backgroundImage="https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1920&q=80"
          breadcrumbs={[
            { label: "Sourcing & Logistics" },
            { label: "Auto Broker Concierge" },
          ]}
          stats={[
            { value: "14 Days", label: "Average Sourcing Window" },
            { value: "3 Continents", label: "Direct Dealer Auctions" },
            { value: "100%", label: "Clean Title & CARFAX" },
          ]}
          actions={
            <a
              href="https://wa.me/2348001234567?text=Hello%20Premier%20Auto%20Broker%20Concierge"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#22C55E] text-white hover:bg-[#16A34A] text-xs font-bold shadow-md transition-all"
            >
              <FaWhatsapp className="w-4 h-4 text-white" />
              <span>Direct WhatsApp Desk</span>
            </a>
          }
        />

        {/* Form and Pipeline Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Sourcing Form Card (7 cols) */}
          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB] flex items-center gap-2">
                <FiFileText className="w-4 h-4 text-[#2563EB]" />
                <span>Submit Vehicle Sourcing Brief</span>
              </h3>
              <p className="text-xs text-[#475569] mt-0.5">
                Our global buying desk will send vetted auction listings and dealer matches within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Target Make"
                  placeholder="e.g. Porsche, Bentley, Ferrari"
                  value={targetMake}
                  onChange={(e) => setTargetMake(e.target.value)}
                  required
                />
                <Input
                  label="Target Model & Trim"
                  placeholder="e.g. 911 GT3 RS Weissach"
                  value={targetModel}
                  onChange={(e) => setTargetModel(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Dropdown
                  label="Minimum Year"
                  value={minYear}
                  onChange={(val) => setMinYear(String(val))}
                  options={[
                    { label: "2025 (Brand New)", value: "2025" },
                    { label: "2024", value: "2024" },
                    { label: "2023", value: "2023" },
                    { label: "2022", value: "2022" },
                    { label: "Classic / Heritage", value: "classic" },
                  ]}
                />

                <Input
                  label="Budget Ceiling ($ USD)"
                  type="number"
                  placeholder="180,000"
                  value={budgetUSD}
                  onChange={(e) => setBudgetUSD(e.target.value)}
                  required
                />

                <Dropdown
                  label="Preferred Sourcing Market"
                  value={sourcingMarket}
                  onChange={(val) => setSourcingMarket(String(val))}
                  options={[
                    { label: "United States (Manheim/Dealer)", value: "USA" },
                    { label: "Germany / Europe (Mobile.de)", value: "Europe" },
                    { label: "United Arab Emirates (Dubai)", value: "UAE" },
                    { label: "Japan (Auction Grade 4.5+)", value: "Japan" },
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Your Full Name" placeholder="Chief Alexander Vance" required />
                <Input label="Phone / WhatsApp Contact" placeholder="+234 (0) 800 123 4567" required />
              </div>

              <Input label="Email Address" type="email" placeholder="alexander@company.com" required />

              <div className="pt-2">
                <Button variant="primary" size="md" fullWidth type="submit">
                  Transmit Sourcing Brief to Buying Desk
                </Button>
              </div>
            </form>
          </div>

          {/* Sourcing Stage Tracker (5 cols) */}
          <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB] flex items-center gap-2">
              <FiGlobe className="w-4 h-4 text-[#2563EB]" />
              <span>7-Stage Sourcing Pipeline</span>
            </h3>

            <p className="text-xs text-[#475569]">
              Live status tracking from international market sourcing to port clearance and white-glove delivery.
            </p>

            <div className="space-y-3 pt-1">
              {stages.map((stg) => (
                <div
                  key={stg.num}
                  className={`flex items-start gap-3 p-2.5 rounded-xl border text-xs transition-colors ${
                    stg.active
                      ? "bg-[#EFF6FF] border-[#2563EB]"
                      : stg.done
                      ? "bg-[#F8FAFC] border-[#E2E8F0]"
                      : "bg-[#FFFFFF] border-[#E2E8F0] opacity-50"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 ${
                      stg.active
                        ? "bg-[#2563EB] text-[#FFFFFF]"
                        : stg.done
                        ? "bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]"
                        : "bg-[#F1F5F9] text-[#94A3B8]"
                    }`}
                  >
                    {stg.done ? <FiCheckCircle className="w-3.5 h-3.5" /> : stg.num}
                  </div>
                  <div>
                    <span className="font-bold text-[#0F172A] block">{stg.title}</span>
                    <span className="text-[11px] text-[#475569] block">{stg.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        size="md"
        title="Sourcing Request Registered"
        description="Your vehicle brief has been received by our head of international acquisitions."
        footer={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsSuccessModalOpen(false)}
            leftIcon={<FiCheck className="w-3.5 h-3.5 text-white" />}
          >
            Acknowledge & Done
          </Button>
        }
      >
        <div className="space-y-2 text-xs sm:text-sm text-[#334155]">
          <p>
            An executive auto broker has been assigned to scan official auction channels in <span className="text-[#2563EB] font-bold">{sourcingMarket}</span> for your requested <span className="text-[#2563EB] font-bold">{targetMake || "target vehicle"}</span>.
          </p>
          <p className="text-[#64748B] text-xs">
            You will receive a confidential PDF dossier containing verified condition reports, Carfax/AutoDNA records, and estimated landed delivery quotes.
          </p>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
