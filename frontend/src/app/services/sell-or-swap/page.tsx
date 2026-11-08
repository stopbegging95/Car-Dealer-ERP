"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  FiRepeat,
  FiDollarSign,
  FiCalendar,
  FiUploadCloud,
  FiInfo,
  FiCheck,
} from "react-icons/fi";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button, Input, Dropdown, Modal } from "@/components/ui";
import { VEHICLES, Vehicle } from "@/data/vehicles";

export default function SellOrSwapPage() {
  const [mode, setMode] = useState<"swap" | "sell">("swap");
  const [selectedTargetStockId, setSelectedTargetStockId] = useState<string>("STK-2026-001");
  const [tradeInMake, setTradeInMake] = useState<string>("Mercedes-Benz");
  const [tradeInModel, setTradeInModel] = useState<string>("E-Class E350");
  const [tradeInYear, setTradeInYear] = useState<string>("2020");
  const [tradeInMileage, setTradeInMileage] = useState<string>("55000");
  const [tradeInEstimatedValueUSD, setTradeInEstimatedValueUSD] = useState<number>(45000);
  const [isBookedModalOpen, setIsBookedModalOpen] = useState<boolean>(false);

  const targetVehicle: Vehicle = useMemo(() => {
    return VEHICLES.find((v) => v.stockId === selectedTargetStockId) || VEHICLES[0];
  }, [selectedTargetStockId]);

  // Swap balance calculation:
  // Target Car Price - Trade In Valuation + Doc & Processing Fee ($2,500)
  const processingFeeUSD = 2500;
  const balancePayableUSD =
    targetVehicle.priceUSD - tradeInEstimatedValueUSD + processingFeeUSD;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-[#2563EB] selection:text-[#FFFFFF]">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header Block with Mode Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] text-xs font-bold mb-2">
              <FiRepeat className="w-3.5 h-3.5" />
              <span>Direct Dealership Exchange & Valuation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0F172A] uppercase tracking-tight">
              Sell or Swap Your Vehicle
            </h1>
            <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
              Upgrade seamlessly to approved inventory or receive an instant cash purchase offer within 2 hours.
            </p>
          </div>

          {/* Mode Segmented Switcher */}
          <div className="flex items-center bg-[#FFFFFF] p-1 rounded-xl border border-[#CBD5E1] shadow-xs self-start md:self-auto gap-1">
            <Button
              variant={mode === "swap" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setMode("swap")}
              leftIcon={<FiRepeat className="w-3.5 h-3.5" />}
            >
              Swap / Trade-In
            </Button>
            <Button
              variant={mode === "sell" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setMode("sell")}
              leftIcon={<FiDollarSign className="w-3.5 h-3.5" />}
            >
              Sell Direct for Cash
            </Button>
          </div>
        </div>

        {/* SWAP WORKFLOW */}
        {mode === "swap" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Step 1 & 2: Select Target Vehicle and Enter Trade-In (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              {/* Target Car Selector */}
              <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                    1. Choose Desired Target Vehicle
                  </h3>
                  <span className="text-[10px] font-mono text-[#64748B]">
                    Stock: {targetVehicle.stockId}
                  </span>
                </div>

                <Dropdown
                  value={selectedTargetStockId}
                  onChange={(val) => setSelectedTargetStockId(String(val))}
                  options={VEHICLES.map((v) => ({
                    label: `${v.year} ${v.make} ${v.model} ($${v.priceUSD.toLocaleString()})`,
                    value: v.stockId,
                  }))}
                />

                {/* Selected Car Preview Pill */}
                <div className="flex items-center gap-3 bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                  <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0 bg-[#E2E8F0]">
                    <Image src={targetVehicle.image} alt={targetVehicle.model} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#0F172A] truncate">
                      {targetVehicle.year} {targetVehicle.make} {targetVehicle.model}
                    </h4>
                    <span className="text-[11px] text-[#64748B] block">{targetVehicle.trim}</span>
                    <span className="text-xs font-extrabold font-mono text-[#1D4ED8]">
                      ${targetVehicle.priceUSD.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Your Trade-In Car Details */}
              <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-3.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                  2. Enter Your Current Vehicle Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Make"
                    placeholder="e.g. Mercedes-Benz"
                    value={tradeInMake}
                    onChange={(e) => setTradeInMake(e.target.value)}
                  />
                  <Input
                    label="Model & Trim"
                    placeholder="e.g. E-Class E350 AMG"
                    value={tradeInModel}
                    onChange={(e) => setTradeInModel(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    label="Year"
                    type="number"
                    value={tradeInYear}
                    onChange={(e) => setTradeInYear(e.target.value)}
                  />
                  <Input
                    label="Mileage (KM)"
                    type="number"
                    value={tradeInMileage}
                    onChange={(e) => setTradeInMileage(e.target.value)}
                  />
                  <Input
                    label="Est. Value ($ USD)"
                    type="number"
                    value={tradeInEstimatedValueUSD}
                    onChange={(e) => setTradeInEstimatedValueUSD(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#0F172A] block mb-1">
                    Upload Vehicle Photos (Exterior, Interior, Odometer)
                  </label>
                  <div className="border border-dashed border-[#CBD5E1] rounded-xl p-3 text-center cursor-pointer bg-[#F8FAFC] hover:bg-[#EFF6FF] transition-colors">
                    <FiUploadCloud className="w-5 h-5 text-[#2563EB] mx-auto mb-1" />
                    <span className="text-xs text-[#475569] block">
                      Click to upload photos (PNG, JPG up to 10MB)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Real-Time Swap Settlement Calculation Card (5 cols) */}
            <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-md space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB] flex items-center gap-2">
                <FiDollarSign className="w-4 h-4 text-[#2563EB]" />
                <span>Swap Settlement Summary</span>
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-[#475569]">
                  <span>Target Vehicle Price:</span>
                  <span className="font-mono text-[#0F172A] font-bold">
                    +${targetVehicle.priceUSD.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[#475569]">
                  <span>Less: Trade-In Valuation:</span>
                  <span className="font-mono text-[#2563EB] font-bold">
                    -${tradeInEstimatedValueUSD.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[#475569]">
                  <span>Documentation & Title Transfer:</span>
                  <span className="font-mono text-[#0F172A]">
                    +${processingFeeUSD.toLocaleString()}
                  </span>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0] flex justify-between items-center text-sm font-bold">
                  <span className="text-[#0F172A]">Net Settlement Payable:</span>
                  <span className="font-mono text-[#1D4ED8] text-xl">
                    ${balancePayableUSD.toLocaleString()}
                  </span>
                </div>
                <span className="text-[10px] text-[#64748B] block text-right font-mono">
                  (Approx. ₦{(balancePayableUSD * 1500).toLocaleString()} NGN)
                </span>
              </div>

              <div className="bg-[#EFF6FF] p-3 rounded-xl border border-[#BFDBFE] text-xs text-[#1E40AF] flex items-start gap-2">
                <FiInfo className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                <span>
                  Our chief appraiser will conduct a 150-point physical check at our showroom to confirm exact trade-in valuation.
                </span>
              </div>

              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() => setIsBookedModalOpen(true)}
                leftIcon={<FiCalendar className="w-4 h-4 text-[#FFFFFF]" />}
              >
                Schedule Physical Appraisal Inspection
              </Button>
            </div>
          </div>
        )}

        {/* SELL DIRECT WORKFLOW */}
        {mode === "sell" && (
          <div className="max-w-2xl mx-auto bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 shadow-md space-y-4">
            <div>
              <h3 className="text-base font-bold text-[#0F172A] uppercase tracking-tight">
                Sell Direct to Premier Auto Dealership
              </h3>
              <p className="text-xs text-[#475569] mt-0.5">
                We purchase verified executive luxury cars, foreign-used imports, and sports performance vehicles outright.
              </p>
            </div>

            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Make" placeholder="e.g. Porsche" />
                <Input label="Model" placeholder="e.g. Cayenne Turbo GT" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input label="Year" type="number" placeholder="2023" />
                <Input label="Mileage (KM)" type="number" placeholder="24000" />
                <Input label="Asking Price ($ USD)" type="number" placeholder="130000" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Your Name" placeholder="Chief Alexander Vance" />
                <Input label="WhatsApp Phone Number" placeholder="+234 (0) 800 123 4567" />
              </div>

              <div>
                <label className="text-xs font-medium text-[#0F172A] block mb-1">
                  Upload Vehicle Registration & Inspection Photos
                </label>
                <div className="border border-dashed border-[#CBD5E1] rounded-xl p-4 text-center cursor-pointer bg-[#F8FAFC] hover:bg-[#EFF6FF] transition-colors">
                  <FiUploadCloud className="w-6 h-6 text-[#2563EB] mx-auto mb-1" />
                  <span className="text-xs text-[#475569] block">
                    Upload vehicle photos and papers (up to 15MB)
                  </span>
                </div>
              </div>

              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() => setIsBookedModalOpen(true)}
              >
                Submit for Instant Purchase Offer
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isBookedModalOpen}
        onClose={() => setIsBookedModalOpen(false)}
        size="md"
        title="Appraisal Appointment Confirmed"
        description="Our valuation team has created your trade-in / direct sale inspection file."
        footer={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsBookedModalOpen(false)}
            leftIcon={<FiCheck className="w-3.5 h-3.5 text-white" />}
          >
            Acknowledge & Close
          </Button>
        }
      >
        <div className="space-y-2 text-xs sm:text-sm text-[#334155]">
          <p>
            Your vehicle file is registered under Docket ID: <span className="font-mono text-[#2563EB] font-bold">SWP-2026-9042</span>.
          </p>
          <p className="text-[#64748B] text-xs">
            Our valuation manager will send a confirmation on WhatsApp to finalize your preferred inspection hour at either our Lagos Victoria Island or Abuja Maitama showroom.
          </p>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
