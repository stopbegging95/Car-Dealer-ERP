"use client";

import React, { useState } from "react";
import { FiPlus, FiCheckCircle, FiDownload } from "react-icons/fi";
import { Button, Badge, Modal, Input, Dropdown, Table, Card } from "@/components/ui";
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
    {
      id: "SWP-4398",
      tradeCar: "2019 Range Rover Autobiography",
      tradeMileage: "56,000 KM • Single Owner",
      targetCar: "2024 Porsche 911 Turbo S",
      targetPriceUSD: 225000,
      approvedEquityUSD: 48000,
      balanceUSD: 177000,
      status: "Inspection Completed",
      milestone: "OBD-II Diagnostic 100% Cleared. Final Underwriting in Review.",
      showroomHub: "Maitama Diplomatic Zone Suite",
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

      <Card className="shadow-xs p-4 sm:p-5">
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
      </Card>

      <Table
        data={swaps}
        keyExtractor={(item) => item.id}
        pageSize={15}
        showSerialNumber={true}
        columns={[
          {
            key: "id",
            header: "Voucher ID",
            sortable: true,
            render: (item) => <span className="font-mono font-bold text-[#2563EB] text-xs">{item.id}</span>,
          },
          {
            key: "tradeCar",
            header: "Trade-In Vehicle",
            sortable: true,
            render: (item) => (
              <div>
                <span className="font-bold text-[#0F172A] text-xs">{item.tradeCar}</span>
                <span className="block text-[#64748B] text-[10px]">{item.tradeMileage}</span>
              </div>
            ),
          },
          {
            key: "targetCar",
            header: "Target Showroom Unit",
            sortable: true,
            render: (item) => (
              <div>
                <span className="font-bold text-[#0F172A] text-xs">{item.targetCar}</span>
                <span className="block font-mono text-[#64748B] text-[10px]">${item.targetPriceUSD.toLocaleString()}</span>
              </div>
            ),
          },
          {
            key: "approvedEquityUSD",
            header: "Approved Equity",
            sortable: true,
            render: (item) => (
              <span className="font-mono font-bold text-emerald-600 text-xs">
                ${item.approvedEquityUSD.toLocaleString()}
              </span>
            ),
          },
          {
            key: "balanceUSD",
            header: "Balance Due",
            sortable: true,
            render: (item) => (
              <div>
                <span className="font-mono font-bold text-[#1D4ED8] text-xs">${item.balanceUSD.toLocaleString()}</span>
                <span className="block font-mono text-[#64748B] text-[10px]">₦{(item.balanceUSD * 1500).toLocaleString()}</span>
              </div>
            ),
          },
          {
            key: "status",
            header: "Status",
            render: (item) => <Badge variant="gold" size="sm">{item.status}</Badge>,
          },
          {
            key: "milestone",
            header: "Audit Milestone",
            render: (item) => <span className="text-[#475569] text-xs">{item.milestone}</span>,
          },
          {
            key: "actions",
            header: "Action",
            render: (item) => (
              <Button
                variant="outline"
                size="sm"
                onClick={() => showToast(`Agreement quotation PDF for ${item.id} generated and sent to your email.`)}
                leftIcon={<FiDownload className="w-3.5 h-3.5 text-[#2563EB]" />}
              >
                Download PDF
              </Button>
            ),
          },
        ]}
      />

      {/* New Swap Request Modal */}
      <Modal
        isOpen={isNewSwapModalOpen}
        onClose={() => setIsNewSwapModalOpen(false)}
        size="lg"
        title="Initiate Vehicle Trade-In / Swap Valuation"
        description="Submit your current car details for instant equity pre-appraisal against any showroom stock."
      >
        <form onSubmit={handleCreateSwap} className="space-y-4">
          <div className="gap-3 grid grid-cols-1 sm:grid-cols-2">
            <Input
              label="Current Vehicle Year"
              value={currentCarYear}
              onChange={(e) => setCurrentCarYear(e.target.value)}
              required
            />
            <Input
              label="Current Vehicle Make & Model"
              placeholder="e.g. 2021 BMW X5 xDrive40i"
              value={currentCarMake}
              onChange={(e) => setCurrentCarMake(e.target.value)}
              required
            />
          </div>

          <div className="gap-3 grid grid-cols-1 sm:grid-cols-2">
            <Input
              label="Approximate Mileage"
              placeholder="e.g. 45,000 KM"
              value={currentCarMileage}
              onChange={(e) => setCurrentCarMileage(e.target.value)}
              required
            />
            <Input
              label="Vehicle VIN / Chassis Number"
              placeholder="e.g. WBA1120000000000"
              value={vinNumber}
              onChange={(e) => setVinNumber(e.target.value)}
              required
              helperText="Enables instant Carfax and Nigerian Customs SGD duty verification."
            />
          </div>

          <Dropdown
            label="Target Showroom Vehicle to Purchase"
            value={targetStockId}
            onChange={(val) => setTargetStockId(String(val))}
            options={VEHICLES.map((v) => ({
              label: `${v.year} ${v.make} ${v.model} - $${v.priceUSD.toLocaleString()} (${v.stockId})`,
              value: v.stockId,
            }))}
          />

          <Dropdown
            label="Preferred Inspection Center"
            value={selectedHub}
            onChange={(val) => setSelectedHub(String(val))}
            options={[
              { label: "Victoria Island Flagship Showroom, Lagos", value: "Victoria Island Flagship Showroom, Lagos" },
              { label: "Ikoyi Private Client VIP Lounge, Lagos", value: "Ikoyi Private Client VIP Lounge, Lagos" },
              { label: "Maitama Diplomatic Zone Suite, Abuja", value: "Maitama Diplomatic Zone Suite, Abuja" },
              { label: "Lekki Phase 1 Performance Center, Lagos", value: "Lekki Phase 1 Performance Center, Lagos" },
            ]}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsNewSwapModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Submit Appraisal
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
