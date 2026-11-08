"use client";

import React, { useState } from "react";
import {
  FiCheckSquare,
  FiPlus,
  FiCheck,
  FiShield,
  FiDollarSign,
  FiTruck,
  FiFileText,
  FiCheckCircle,
  FiAlertTriangle,
} from "react-icons/fi";
import { Button, Badge, Card, Modal, Input, Dropdown, Table, KPICard } from "@/components/ui";

export interface TradeInItem {
  id: string;
  client: string;
  carOffered: string;
  target: string;
  targetPriceUSD: number;
  valuationUSD: number;
  payableDiffUSD: number;
  status: string;
  linkedStock?: string;
  inspectionSigned: boolean;
  intakeStatus: "Pending Intake" | "Ingested into Inventory";
  projectedResaleUSD?: number;
  reconBudgetUSD?: number;
}

export interface TradeInsAppraisalsPageProps {
  onInspectTradeIn: (item: TradeInItem) => void;
  onIntakeSuccess?: (stockId: string) => void;
}

export const TradeInsAppraisalsPage: React.FC<TradeInsAppraisalsPageProps> = ({
  onInspectTradeIn,
  onIntakeSuccess,
}) => {
  const [tradeIns, setTradeIns] = useState<TradeInItem[]>([
    {
      id: "TRD-2026-001",
      client: "Alhaji Bello & Sons Ltd",
      carOffered: "2021 Mercedes-Benz S500 4MATIC (42,000 KM)",
      target: "2024 Mercedes-Maybach S580 (Dual-Tone)",
      targetPriceUSD: 165000,
      valuationUSD: 45000,
      payableDiffUSD: 120000,
      status: "Physical Appraisal Complete",
      linkedStock: "STK-2026-001",
      inspectionSigned: true,
      intakeStatus: "Pending Intake",
      projectedResaleUSD: 62000,
      reconBudgetUSD: 3500,
    },
    {
      id: "TRD-2026-002",
      client: "Dr. K. Somoye",
      carOffered: "2020 Porsche Carrera 4S (31,000 KM)",
      target: "2024 Porsche 911 Turbo S",
      targetPriceUSD: 225000,
      valuationUSD: 76500,
      payableDiffUSD: 148500,
      status: "OBD Diagnostics Passed",
      linkedStock: "STK-2026-002",
      inspectionSigned: true,
      intakeStatus: "Pending Intake",
      projectedResaleUSD: 98000,
      reconBudgetUSD: 4200,
    },
    {
      id: "TRD-2026-003",
      client: "Senator Godswill O.",
      carOffered: "2019 Range Rover Vogue SE (68,000 KM)",
      target: "2024 Mercedes-AMG G63 Magno",
      targetPriceUSD: 240000,
      valuationUSD: 38000,
      payableDiffUSD: 202000,
      status: "Under Paint Gauge Audit",
      linkedStock: "STK-2026-007",
      inspectionSigned: false,
      intakeStatus: "Pending Intake",
      projectedResaleUSD: 52000,
      reconBudgetUSD: 5000,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [selectedForCalc, setSelectedForCalc] = useState<TradeInItem | null>(null);

  // New Appraisal Form
  const [client, setClient] = useState("");
  const [carOffered, setCarOffered] = useState("");
  const [target, setTarget] = useState("2024 Mercedes-Maybach S580");
  const [targetPrice, setTargetPrice] = useState("165,000");
  const [valuation, setValuation] = useState("45,000");

  // Calculator Form
  const [calcTargetPrice, setCalcTargetPrice] = useState(165000);
  const [calcTradeValuation, setCalcTradeValuation] = useState(45000);
  const [calcDiscount, setCalcDiscount] = useState(3000);
  const [calcStatutoryFee, setCalcStatutoryFee] = useState(1500);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!client || !carOffered) return;
    const valNum = Number(valuation.replace(/[^0-9]/g, "") || 0);
    const tarNum = Number(targetPrice.replace(/[^0-9]/g, "") || 0);
    const diffNum = Math.max(0, tarNum - valNum);

    const newEntry: TradeInItem = {
      id: `TRD-2026-${String(tradeIns.length + 1).padStart(3, "0")}`,
      client,
      carOffered,
      target,
      targetPriceUSD: tarNum,
      valuationUSD: valNum,
      payableDiffUSD: diffNum,
      status: "Initial Appraisal Registered",
      linkedStock: "STK-2026-001",
      inspectionSigned: false,
      intakeStatus: "Pending Intake",
      projectedResaleUSD: Math.round(valNum * 1.25),
      reconBudgetUSD: 3000,
    };
    setTradeIns([newEntry, ...tradeIns]);
    setIsModalOpen(false);
    showToast(`Appraisal ${newEntry.id} registered for ${client}. Awaiting Rule 6 inspection certification.`);
    setClient("");
    setCarOffered("");
  };

  const handleIntakeToMasterInventory = (item: TradeInItem) => {
    // Rule 6: Inspection Prerequisite check
    if (!item.inspectionSigned) {
      showToast(`Policy Violation (Rule 6): Cannot intake ${item.id} without signed physical 150-point inspection and appraisal.`);
      return;
    }

    setTradeIns((prev) =>
      prev.map((t) =>
        t.id === item.id ? { ...t, intakeStatus: "Ingested into Inventory", status: "Transferred to Stock" } : t
      )
    );

    const generatedStockId = `STK-TRD-${Math.floor(100 + Math.random() * 900)}`;
    showToast(`Vehicle ${item.carOffered} ingested into Master Inventory as ${generatedStockId} (Status: Awaiting Inspection).`);
    if (onIntakeSuccess) onIntakeSuccess(generatedStockId);
  };

  const openDifferentialCalculator = (item: TradeInItem) => {
    setSelectedForCalc(item);
    setCalcTargetPrice(item.targetPriceUSD);
    setCalcTradeValuation(item.valuationUSD);
    setCalcDiscount(2500);
    setCalcStatutoryFee(1250);
    setIsCalculatorOpen(true);
  };

  const calculatedNetPayable = Math.max(
    0,
    calcTargetPrice - calcTradeValuation - calcDiscount + calcStatutoryFee
  );

  return (
    <div className="space-y-4">
      {toastMessage && (
        <div className="flex items-center gap-2 bg-[#EFF6FF] border border-[#2563EB] text-[#1E40AF] px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs animate-in fade-in duration-200">
          <FiCheck className="w-4 h-4 text-[#2563EB] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <Card className="space-y-4 shadow-xs p-4 sm:p-5">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-2.5 border-[#E2E8F0] border-b">
          <div>
            <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
              Client Trade-In Appraisals & Vehicle Swap Queue
            </h3>
            <p className="text-[#64748B] text-[11px]">
              Enforcing Business Rule 6 (Mandatory Pre-Valuation Inspection) and Automated Swap Differential Calculations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              leftIcon={<FiPlus className="w-3.5 h-3.5" />}
            >
              + New Vehicle Appraisal
            </Button>
          </div>
        </div>

        {/* Section 5 Pre-Owned Trade-In Lifecycle Protocol Strip */}
        <div className="p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#BFDBFE] text-[10px] font-mono uppercase text-[#2563EB] font-bold">
            <span>Standard Certified Pre-Owned (CPO) Intake & Swap Lifecycle</span>
            <span className="text-[#1D4ED8]">Rule 6 Enforced: 150-Point Digital Appraisal Prerequisite</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-2 text-[10px] font-semibold text-[#1E3A8A]">
            <div className="p-1.5 rounded bg-white border border-[#DBEAFE] text-center">1. Physical Intake</div>
            <div className="p-1.5 rounded bg-white border border-[#DBEAFE] text-center">2. 150-Pt Laser & OBD</div>
            <div className="p-1.5 rounded bg-white border border-[#DBEAFE] text-center">3. Trade Equity Lock</div>
            <div className="p-1.5 rounded bg-white border border-[#DBEAFE] text-center">4. Master Stock Intake</div>
            <div className="p-1.5 rounded bg-white border border-[#DBEAFE] text-center">5. Showroom Staged</div>
          </div>
        </div>

        <Table
          data={tradeIns}
          keyExtractor={(item) => item.id}
          pageSize={15}
          showSerialNumber={true}
          columns={[
            {
              key: "id",
              header: "Appraisal ID",
              sortable: true,
              render: (item) => <span className="font-mono font-bold text-[#2563EB] text-xs">{item.id}</span>,
            },
            {
              key: "client",
              header: "Client & Trade-In Offered",
              sortable: true,
              render: (item) => (
                <div>
                  <span className="font-bold text-[#0F172A] text-xs">{item.client}</span>
                  <span className="block text-[11px] text-[#475569]">{item.carOffered}</span>
                </div>
              ),
            },
            {
              key: "target",
              header: "Target Showroom Vehicle",
              sortable: true,
              render: (item) => (
                <div>
                  <span className="font-semibold text-[#1D4ED8] text-xs">{item.target}</span>
                  <span className="block font-mono text-[10px] text-[#64748B]">${item.targetPriceUSD.toLocaleString()}</span>
                </div>
              ),
            },
            {
              key: "valuationUSD",
              header: "Approved Trade Credit",
              sortable: true,
              render: (item) => (
                <div>
                  <span className="font-mono font-bold text-emerald-700 text-xs">${item.valuationUSD.toLocaleString()}</span>
                  <span className="block text-[10px] text-[#64748B]">
                    {item.inspectionSigned ? "Rule 6 Verified" : "Pending Inspection"}
                  </span>
                </div>
              ),
            },
            {
              key: "payableDiffUSD",
              header: "Payable Difference",
              sortable: true,
              render: (item) => (
                <span className="font-mono font-bold text-[#0F172A] text-xs">
                  ${item.payableDiffUSD.toLocaleString()}
                </span>
              ),
            },
            {
              key: "status",
              header: "Appraisal Status",
              render: (item) => (
                <div>
                  <Badge variant="gold" size="sm">{item.status}</Badge>
                  {item.intakeStatus === "Ingested into Inventory" && (
                    <span className="block text-[10px] text-emerald-700 font-bold mt-0.5">In Stock</span>
                  )}
                </div>
              ),
            },
            {
              key: "action",
              header: "Audit / Calculator",
              align: "right",
              render: (item) => (
                <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDifferentialCalculator(item)}
                    className="px-2 py-0.5 text-[11px]"
                    leftIcon={<FiDollarSign className="w-3 h-3 text-[#2563EB]" />}
                  >
                    Calculator
                  </Button>
                  {item.intakeStatus !== "Ingested into Inventory" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleIntakeToMasterInventory(item)}
                      className="px-2 py-0.5 text-[11px]"
                      leftIcon={<FiTruck className="w-3 h-3 text-emerald-600" />}
                    >
                      Intake Stock
                    </Button>
                  ) : null}
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onInspectTradeIn(item)}
                    className="px-2 py-0.5 text-[11px]"
                    leftIcon={<FiCheckSquare className="w-3 h-3 text-white" />}
                  >
                    Sheet
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </Card>

      {/* Modal: New Appraisal Dossier */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register Vehicle Trade-In & Valuation Dossier"
        description="Creates an intake appraisal record subject to mandatory Rule 6 pre-valuation physical inspection."
        size="md"
      >
        <form onSubmit={handleCreate} className="space-y-3">
          <Input
            label="Client / Vehicle Owner Name"
            placeholder="e.g. Alhaji Bello & Sons Ltd"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            required
          />
          <Input
            label="Trade-In Vehicle Offered (Make, Model, Year, Mileage)"
            placeholder="e.g. 2021 Mercedes-Benz S500 4MATIC (42,000 KM)"
            value={carOffered}
            onChange={(e) => setCarOffered(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Dropdown
              label="Target Showroom Vehicle"
              options={[
                { label: "2024 Mercedes-Maybach S580", value: "2024 Mercedes-Maybach S580" },
                { label: "2024 Porsche 911 Turbo S", value: "2024 Porsche 911 Turbo S" },
                { label: "2023 Range Rover Autobiography", value: "2023 Range Rover Autobiography" },
                { label: "2024 Mercedes-AMG G63 Magno", value: "2024 Mercedes-AMG G63 Magno" },
              ]}
              value={target}
              onChange={(val) => setTarget(String(val))}
            />
            <Input
              label="Approved Trade Valuation ($)"
              type="text"
              placeholder="e.g. 48,000"
              value={valuation}
              onChange={(e) => setValuation(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" leftIcon={<FiCheck />}>
              Generate Appraisal Dossier
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Interactive Swap Differential Financial Calculator */}
      {selectedForCalc && (
        <Modal
          isOpen={isCalculatorOpen}
          onClose={() => setIsCalculatorOpen(false)}
          title={`Swap Differential Calculator: ${selectedForCalc.id}`}
          description={`Formula: Selling Price - Trade Valuation - Discounts + Fees = Net Payable`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Target Vehicle Showroom Price ($)"
                type="number"
                value={String(calcTargetPrice)}
                onChange={(e) => setCalcTargetPrice(Number(e.target.value))}
              />
              <Input
                label="Certified Trade-In Equity Credit ($)"
                type="number"
                value={String(calcTradeValuation)}
                onChange={(e) => setCalcTradeValuation(Number(e.target.value))}
              />
              <Input
                label="Authorized Dealership Discount ($)"
                type="number"
                value={String(calcDiscount)}
                onChange={(e) => setCalcDiscount(Number(e.target.value))}
              />
              <Input
                label="Registration & Statutory Documentation Fees ($)"
                type="number"
                value={String(calcStatutoryFee)}
                onChange={(e) => setCalcStatutoryFee(Number(e.target.value))}
              />
            </div>

            {/* Calculated Breakdown Card */}
            <div className="p-4 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                <span className="text-[#64748B]">Showroom Car Gross:</span>
                <span className="font-mono font-bold text-[#0F172A]">${calcTargetPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                <span className="text-emerald-700 font-semibold">Less Customer Trade Equity:</span>
                <span className="font-mono font-bold text-emerald-700">-${calcTradeValuation.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                <span className="text-[#64748B]">Less Authorized Discount:</span>
                <span className="font-mono text-[#0F172A]">-${calcDiscount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                <span className="text-[#64748B]">Plus Registration & CMR Fees:</span>
                <span className="font-mono text-[#0F172A]">+${calcStatutoryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 text-sm font-bold">
                <span className="text-[#2563EB]">Net Customer Balance Payable:</span>
                <span className="font-mono font-bold text-[#1D4ED8] text-base">${calculatedNetPayable.toLocaleString()}</span>
              </div>
            </div>

            {/* Resale Margin & Profitability Forecast */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
              <span className="font-bold block uppercase tracking-wide text-[10px]">Trade-In Resale Margin Forecast</span>
              <p>
                Incoming Car Valuation: <strong>${calcTradeValuation.toLocaleString()}</strong> | Recon Budget: <strong>$3,500</strong> | Projected CPO Resale: <strong>${Math.round(calcTradeValuation * 1.25).toLocaleString()}</strong>
              </p>
              <p className="font-semibold text-emerald-800">
                Projected Resale Margin on Acquired Unit: +${Math.round(calcTradeValuation * 0.25 - 3500).toLocaleString()} (approx. +17.5% net ROI).
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
              <Button variant="outline" size="sm" onClick={() => setIsCalculatorOpen(false)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setTradeIns((prev) =>
                    prev.map((t) =>
                      t.id === selectedForCalc.id
                        ? {
                            ...t,
                            targetPriceUSD: calcTargetPrice,
                            valuationUSD: calcTradeValuation,
                            payableDiffUSD: calculatedNetPayable,
                          }
                        : t
                    )
                  );
                  setIsCalculatorOpen(false);
                  showToast(`Recalculated settlement balance for ${selectedForCalc.id}: $${calculatedNetPayable.toLocaleString()}.`);
                }}
              >
                Apply Adjusted Figures
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
