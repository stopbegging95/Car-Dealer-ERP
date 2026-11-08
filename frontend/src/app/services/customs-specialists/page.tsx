"use client";

import React, { useState, useMemo } from "react";
import {
  FiShield,
  FiFileText,
  FiDollarSign,
  FiAnchor,
  FiUploadCloud,
  FiCheck,
} from "react-icons/fi";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button, Input, Dropdown, Modal, PageBanner } from "@/components/ui";

export default function CustomsSpecialistsPage() {
  const [cifValueNGN, setCifValueNGN] = useState<number>(97500000);
  const [vehicleAgeYears, setVehicleAgeYears] = useState<string>("0-3");
  const [portDestination, setPortDestination] = useState<string>("Tin Can Island Port, Lagos");
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);

  // Customs calculations based on Nigeria Customs Service (NCS) Common External Tariff (CET)
  const dutyCalculation = useMemo(() => {
    const dutyRate = vehicleAgeYears === "0-3" ? 0.35 : 0.35; // 35% Duty
    const levyRate = vehicleAgeYears === "0-3" ? 0.05 : 0.20; // 5% Levy for new, 20% for older
    const vatRate = 0.075; // 7.5% VAT

    const importDuty = cifValueNGN * dutyRate;
    const automotiveLevy = cifValueNGN * levyRate;
    const vat = (cifValueNGN + importDuty + automotiveLevy) * vatRate;
    const terminalAndHandling = 1250000; // ~NGN 1.25M port handling & demurrage bond

    const totalEstimatedClearanceNGN =
      importDuty + automotiveLevy + vat + terminalAndHandling;

    return {
      cifNGN: Math.round(cifValueNGN),
      importDuty: Math.round(importDuty),
      automotiveLevy: Math.round(automotiveLevy),
      vat: Math.round(vat),
      terminalAndHandling: Math.round(terminalAndHandling),
      totalEstimatedClearanceNGN: Math.round(totalEstimatedClearanceNGN),
    };
  }, [cifValueNGN, vehicleAgeYears]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-[#2563EB] selection:text-[#FFFFFF]">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Banner */}
        <PageBanner
          badge="PORT OF LAGOS CLEARING"
          title="CUSTOMS & PORT"
          titleHighlight="LOGISTICS SPECIALISTS"
          subtitle="NCS fast-track green lane, single goods declarations (SGD), and zero-demurrage port handling."
          backgroundImage="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1920&q=80"
          breadcrumbs={[
            { label: "Logistics & Clearance" },
            { label: "Customs Clearance" },
          ]}
          stats={[
            { value: "48-72 Hours", label: "Fast-Track Clearance" },
            { value: "100%", label: "Genuine SGD Verification" },
            { value: "Tin Can & Apapa", label: "Dedicated Terminals" },
          ]}
        />

        {/* Duty Estimator and Form Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Real-Time Duty Estimator (6 cols) */}
          <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB] flex items-center gap-2">
              <FiDollarSign className="w-4 h-4 text-[#2563EB]" />
              <span>Indicative Port Duty & Clearance Estimator</span>
            </h3>

            <p className="text-xs text-[#475569]">
              Input vehicle CIF value to compute official NCS CET duty, automotive development levy, and port terminal fees.
            </p>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Input
                  label="Estimated CIF Value (₦ NGN)"
                  type="number"
                  value={cifValueNGN}
                  onChange={(e) => setCifValueNGN(Math.max(5000000, Number(e.target.value)))}
                  className="font-mono"
                  helperText="Nigeria Customs Service assessment CIF valuation in Nigerian Naira"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Dropdown
                  label="Vehicle Age"
                  value={vehicleAgeYears}
                  onChange={(val) => setVehicleAgeYears(String(val))}
                  options={[
                    { label: "0 - 3 Years (Brand New / Modern)", value: "0-3" },
                    { label: "4 - 8 Years (Foreign Used)", value: "4-8" },
                    { label: "8+ Years (Older Model)", value: "8+" },
                  ]}
                />

                <Dropdown
                  label="Port of Discharge"
                  value={portDestination}
                  onChange={(val) => setPortDestination(String(val))}
                  options={[
                    { label: "Tin Can Island Port, Lagos", value: "Tin Can Island Port, Lagos" },
                    { label: "Apapa Bulk Terminal, Lagos", value: "Apapa Bulk Terminal, Lagos" },
                    { label: "Onne Port, Port Harcourt", value: "Onne Port, Port Harcourt" },
                  ]}
                />
              </div>
            </div>

            {/* Computation Breakdown Card */}
            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-2 text-xs">
              <div className="flex justify-between text-[#475569]">
                <span>CET Import Duty (35%):</span>
                <span className="font-mono text-[#0F172A] font-medium">₦{dutyCalculation.importDuty.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#475569]">
                <span>Automotive Levy ({vehicleAgeYears === "0-3" ? "5%" : "20%"}):</span>
                <span className="font-mono text-[#0F172A] font-medium">₦{dutyCalculation.automotiveLevy.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#475569]">
                <span>Value Added Tax (7.5%):</span>
                <span className="font-mono text-[#0F172A] font-medium">₦{dutyCalculation.vat.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#475569]">
                <span>Terminal Handling & Inspection:</span>
                <span className="font-mono text-[#0F172A] font-medium">₦{dutyCalculation.terminalAndHandling.toLocaleString()}</span>
              </div>

              <div className="pt-2 border-t border-[#E2E8F0] flex justify-between items-center text-sm font-bold">
                <span className="text-[#0F172A]">Total Estimated Clearance:</span>
                <span className="font-mono text-[#1D4ED8] text-base">
                  ₦{dutyCalculation.totalEstimatedClearanceNGN.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Clearance Request & Document Submission Form (6 cols) */}
          <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB] flex items-center gap-2">
                <FiFileText className="w-4 h-4 text-[#2563EB]" />
                <span>Submit Clearance Request</span>
              </h3>
              <p className="text-xs text-[#475569] mt-0.5">
                Upload your shipping documentation for rapid terminal clearance and assessment.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsSubmitModalOpen(true);
              }}
              className="space-y-3.5"
            >
              <Input label="Vehicle VIN / Chassis Number" placeholder="e.g. WDD2230631A987654" required />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Make & Model" placeholder="e.g. Toyota Land Cruiser LC300" required />
                <Input label="Year of Manufacture" placeholder="e.g. 2024" required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Bill of Lading (B/L) Number" placeholder="e.g. MSCU12345678" required />
                <Input label="Shipping Line / Vessel Name" placeholder="e.g. Grimaldi Grande Lagos" required />
              </div>

              {/* Upload Dropzone */}
              <div>
                <label className="text-xs font-medium text-[#0F172A] block mb-1.5">
                  Attach Documents (Bill of Lading, Invoice, Export Title)
                </label>
                <div className="border-2 border-dashed border-[#CBD5E1] hover:border-[#2563EB] rounded-xl p-4 text-center cursor-pointer transition-colors bg-[#F8FAFC] hover:bg-[#EFF6FF]">
                  <FiUploadCloud className="w-6 h-6 text-[#2563EB] mx-auto mb-1" />
                  <span className="text-xs text-[#0F172A] font-medium block">
                    Click to browse or drop documents here
                  </span>
                  <span className="text-[10px] text-[#64748B] block mt-0.5">
                    PDF, JPG, PNG up to 15MB
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Consignee Name" placeholder="Chief Alexander Vance" required />
                <Input label="WhatsApp Phone Number" placeholder="+234 (0) 800 123 4567" required />
              </div>

              <div className="pt-2">
                <Button variant="primary" size="md" fullWidth type="submit">
                  Dispatch to Customs Clearance Desk
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        size="md"
        title="Customs Clearance Docket Created"
        description="Your vehicle documentation has been assigned to our licensed terminal agent."
        footer={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsSubmitModalOpen(false)}
            leftIcon={<FiCheck className="w-3.5 h-3.5 text-white" />}
          >
            Acknowledge & Close
          </Button>
        }
      >
        <div className="space-y-2 text-xs sm:text-sm text-[#334155]">
          <p>
            Your dossier is registered under Docket ID: <span className="font-mono text-[#2563EB] font-bold">CST-2026-8821</span> for discharge at <span className="text-[#1D4ED8] font-bold">{portDestination}</span>.
          </p>
          <p className="text-[#64748B] text-xs">
            Our agent will verify your Bill of Lading with the shipping line and generate your initial Single Goods Declaration (SGD) assessment within 4 business hours.
          </p>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
