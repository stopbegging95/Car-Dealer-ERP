"use client";

import React, { useState } from "react";
import { FiArrowRight, FiPlus, FiCheck, FiCheckCircle, FiFileText } from "react-icons/fi";
import { Button, Badge, Modal, Input, Dropdown } from "@/components/ui";
import { VEHICLES } from "@/data/vehicles";

export interface SwapAppraisalItem {
  id: string;
  tradeCar: string;
  tradeMileage: string;
  targetCar: string;
  targetPriceUSD: number;
  approvedEquityUSD: number;
  balanceUSD: number;
  status: string;
  milestone: string;
  showroomHub: string;
}

export const TradeInsTab: React.FC = () => {
  const [swaps, setSwaps] = useState<SwapAppraisalItem[]>([
    {
      id: "SWP-4401",
      tradeCar: "2020 Mercedes-Benz E350 AMG",
      tradeMileage: "42,000 KM • Non-Accident Certified",
      targetCar: "2024 Mercedes-Maybach S580",
      targetPriceUSD: 165000,
      approvedEquityUSD: 32500,
      balanceUSD: 132500,
      status: "Appraisal Approved",
      milestone: "Two-Factor Director Approval Signed. Physical Handover Scheduled Nov 18.",
      showroomHub: "Victoria Island Flagship Showroom",
    },
  ]);

  const [isNewSwapModalOpen, setIsNewSwapModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [currentCarMake, setCurrentCarMake] = useState("");
  const [currentCarYear, setCurrentCarYear] = useState("2021");
  const [currentCarMileage, setCurrentCarMileage] = useState("35,000 KM");
  const [targetStockId, setTargetStockId] = useState<string>("STK-2026-002");
  const [selectedHub, setSelectedHub] = useState<string>("Victoria Island Flagship Showroom, Lagos");
  const [vinNumber, setVinNumber] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCreateSwap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCarMake) return;

    const targetVehicle = VEHICLES.find((v) => v.stockId === targetStockId) || VEHICLES[1];
    const newId = `SWP-${Math.floor(4000 + Math.random() * 5000)}`;
    const estimatedEquity = Math.round(targetVehicle.priceUSD * 0.22);
    const balance = targetVehicle.priceUSD - estimatedEquity;

    const newSwap: SwapAppraisalItem = {
      id: newId,
      tradeCar: `${currentCarYear} ${currentCarMake}`,
      tradeMileage: `${currentCarMileage} • Appraisal Pending`,
      targetCar: `${targetVehicle.year} ${targetVehicle.make} ${targetVehicle.model}`,
      targetPriceUSD: targetVehicle.priceUSD,
      approvedEquityUSD: estimatedEquity,
      balanceUSD: balance,
      status: "Inspection Scheduled",
      milestone: `Physical 150-point diagnostic inspection booked at ${selectedHub}.`,
      showroomHub: selectedHub,
    };

    setSwaps([newSwap, ...swaps]);
    setIsNewSwapModalOpen(false);
    showToast(`Vehicle trade-in appraisal ${newId} submitted for ${newSwap.tradeCar}!`);
    setCurrentCarMake("");
  };

  return (
    <div className="space-y-4">
      {toastMessage && (
        <div className="flex items-center gap-2 bg-[#EFF6FF] border border-[#2563EB] text-[#1E40AF] px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs animate-in fade-in duration-200">
          <FiCheckCircle className="w-4 h-4 text-[#2563EB] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="space-y-4 bg-[#FFFFFF] shadow-sm p-4 sm:p-5 border border-[#E2E8F0] rounded-2xl">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-3">
          <div>
            <h3 className="font-bold text-[#0F172A] text-base uppercase tracking-tight">
              Active Trade-In / Swap Valuations ({swaps.length})
            </h3>
            <p className="text-[#64748B] text-xs">Digital 150-point valuation appraisal and equity settlement.</p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsNewSwapModalOpen(true)}
            leftIcon={<FiPlus className="w-3.5 h-3.5" />}
          >
            + Start New Vehicle Swap
          </Button>
        </div>

        {/* Trade-In Card Details */}
        <div className="space-y-3">
          {swaps.map((item) => (
            <div key={item.id} className="space-y-3 bg-[#F8FAFC] p-4 border border-[#CBD5E1] rounded-xl hover:border-[#94A3B8] transition-colors">
              <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-2 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2">
                  <span className="font-bold font-mono text-[#2563EB] text-xs">{item.id}</span>
                  <span className="text-[#CBD5E1]">&bull;</span>
                  <h4 className="font-bold text-[#0F172A] text-sm">{item.tradeCar} &rarr; {item.targetCar}</h4>
                </div>
                <Badge variant="gold" size="sm">{item.status}</Badge>
              </div>

              <div className="gap-3 grid grid-cols-1 sm:grid-cols-3 text-xs">
                <div className="space-y-1 bg-[#FFFFFF] p-3 border border-[#E2E8F0] rounded-xl">
                  <span className="block font-bold text-[#64748B] text-[10px] uppercase">Trade-In Vehicle</span>
                  <div className="font-bold text-[#0F172A]">{item.tradeCar}</div>
                  <span className="text-[#64748B] text-[11px]">{item.tradeMileage}</span>
                </div>

                <div className="space-y-1 bg-[#FFFFFF] p-3 border border-[#E2E8F0] rounded-xl">
                  <span className="block font-bold text-[#64748B] text-[10px] uppercase">Target Showroom Model</span>
                  <div className="font-bold text-[#0F172A]">{item.targetCar}</div>
                  <span className="font-bold font-mono text-[#1D4ED8] text-[11px]">
                    Price: ${item.targetPriceUSD.toLocaleString()} USD
                  </span>
                </div>

                <div className="space-y-1 bg-[#EFF6FF] p-3 border border-[#BFDBFE] rounded-xl">
                  <span className="block font-bold text-[#2563EB] text-[10px] uppercase">Certified Swap Equity</span>
                  <div className="font-bold font-mono text-[#1D4ED8] text-sm">
                    ${item.approvedEquityUSD.toLocaleString()} Estimated
                  </div>
                  <span className="block font-bold text-[#1D4ED8] text-[11px]">
                    Balance Due: ${item.balanceUSD.toLocaleString()} (₦{(item.balanceUSD * 1500).toLocaleString()})
                  </span>
                </div>
              </div>

              <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pt-2 text-xs">
                <span className="text-[#64748B]">
                  Status: <strong className="text-[#0F172A]">{item.milestone}</strong>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => showToast(`Agreement quotation PDF for ${item.id} generated and sent to your email.`)}
                  rightIcon={<FiArrowRight className="w-3 h-3" />}
                  className="px-0 text-[#2563EB] self-start sm:self-auto"
                >
                  Download Agreement PDF
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Swap Appraisal Modal */}
      <Modal
        isOpen={isNewSwapModalOpen}
        onClose={() => setIsNewSwapModalOpen(false)}
        size="lg"
        title="Submit Vehicle Swap & Trade-In Appraisal"
        description="Exchange your current luxury vehicle toward any certified showroom inventory model."
      >
        <form onSubmit={handleCreateSwap} className="space-y-4">
          <div className="gap-3 grid grid-cols-1 sm:grid-cols-2">
            <Input
              label="Current Vehicle Make & Model"
              placeholder="e.g. BMW X7 M60i or Porsche Cayenne GTS"
              value={currentCarMake}
              onChange={(e) => setCurrentCarMake(e.target.value)}
              required
            />
            <Input
              label="Year of Manufacture"
              placeholder="2021"
              value={currentCarYear}
              onChange={(e) => setCurrentCarYear(e.target.value)}
              required
            />
          </div>

          <div className="gap-3 grid grid-cols-1 sm:grid-cols-2">
            <Input
              label="Current Mileage (KM)"
              placeholder="38,000 KM"
              value={currentCarMileage}
              onChange={(e) => setCurrentCarMileage(e.target.value)}
              required
            />
            <Input
              label="Vehicle VIN / Chassis Number"
              placeholder="WBA01..."
              value={vinNumber}
              onChange={(e) => setVinNumber(e.target.value)}
            />
          </div>

          <Dropdown
            label="Select Desired Upgrade Showroom Model"
            value={targetStockId}
            onChange={(val) => setTargetStockId(String(val))}
            options={VEHICLES.map((v) => ({
              label: `${v.year} ${v.make} ${v.model} (${v.stockId}) - $${v.priceUSD.toLocaleString()}`,
              value: v.stockId,
            }))}
          />

          <Dropdown
            label="Preferred Drop-off Inspection Hub"
            value={selectedHub}
            onChange={(val) => setSelectedHub(String(val))}
            options={[
              { label: "Victoria Island Flagship Showroom, Lagos", value: "Victoria Island Flagship Showroom, Lagos" },
              { label: "Maitama Diplomatic Zone Suite, Abuja", value: "Maitama Diplomatic Zone Suite, Abuja" },
            ]}
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsNewSwapModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" leftIcon={<FiCheck className="w-3.5 h-3.5" />}>
              Submit Swap Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
