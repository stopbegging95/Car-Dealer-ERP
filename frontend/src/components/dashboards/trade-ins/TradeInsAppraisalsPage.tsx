"use client";

import React, { useState } from "react";
import { FiCheckSquare, FiPlus, FiCheck } from "react-icons/fi";
import { Button, Badge, Card, Modal, Input, Dropdown } from "@/components/ui";

export interface TradeInItem {
  id: string;
  client: string;
  carOffered: string;
  target: string;
  valuation: string;
  diff: string;
  status: string;
  linkedStock?: string;
}

export interface TradeInsAppraisalsPageProps {
  onInspectTradeIn: (item: TradeInItem) => void;
}

export const TradeInsAppraisalsPage: React.FC<TradeInsAppraisalsPageProps> = ({
  onInspectTradeIn,
}) => {
  const [tradeIns, setTradeIns] = useState<TradeInItem[]>([
    {
      id: "TRD-2026-001",
      client: "Alhaji Bello & Sons Ltd",
      carOffered: "2021 Mercedes-Benz S500 4MATIC (42,000 KM)",
      target: "2024 Mercedes-Maybach S580 (Dual-Tone)",
      valuation: "$45,000",
      diff: "$120,000 (To Pay)",
      status: "Physical Appraisal Complete",
      linkedStock: "STK-2026-001",
    },
    {
      id: "TRD-2026-002",
      client: "Dr. K. Somoye",
      carOffered: "2020 Porsche Carrera 4S (31,000 KM)",
      target: "2024 Porsche 911 Turbo S",
      valuation: "$76,500",
      diff: "$148,500 (To Pay)",
      status: "OBD Diagnostics Passed",
      linkedStock: "STK-2026-002",
    },
    {
      id: "TRD-2026-003",
      client: "Senator Godswill O.",
      carOffered: "2019 Range Rover Vogue SE (68,000 KM)",
      target: "2024 Mercedes-AMG G63 Magno",
      valuation: "$38,000",
      diff: "$202,000 (To Pay)",
      status: "Under Paint Gauge Audit",
      linkedStock: "STK-2026-007",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [client, setClient] = useState("");
  const [carOffered, setCarOffered] = useState("");
  const [target, setTarget] = useState("2024 Mercedes-Maybach S580");
  const [valuation, setValuation] = useState("");
  const [targetPrice, setTargetPrice] = useState("165,000");

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
      valuation: `$${valNum.toLocaleString()}`,
      diff: `$${diffNum.toLocaleString()} (To Pay)`,
      status: "Initial Appraisal Registered",
      linkedStock: "STK-2026-001",
    };
    setTradeIns([newEntry, ...tradeIns]);
    setIsModalOpen(false);
    setClient("");
    setCarOffered("");
    setValuation("");
  };

  return (
    <Card className="space-y-4 shadow-xs p-4 sm:p-5">
      <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-2.5 border-[#E2E8F0] border-b">
        <div>
          <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
            Client Trade-In Appraisals & Vehicle Swap Queue
          </h3>
          <p className="text-[#64748B] text-[11px]">
            Auction market comp valuations, laser paint micrometer verification, and equity delta settlement
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="gold" size="sm">Certified Pre-Owned Standards</Badge>
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

      {/* Modal for Creating New Vehicle Appraisal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register Vehicle Trade-In & Valuation Dossier"
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

      <div className="space-y-3">
        {tradeIns.map((item) => (
          <div
            key={item.id}
            className="space-y-3 bg-[#F8FAFC] p-3.5 border border-[#E2E8F0] rounded-md text-xs"
          >
            <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#2563EB]">{item.id}</span>
                  <span className="font-bold text-[#0F172A]">{item.client}</span>
                  <Badge variant="gold" size="sm">{item.status}</Badge>
                </div>
                <div className="mt-1 font-semibold text-[#0F172A] text-sm">
                  Offered: {item.carOffered}
                </div>
                <span className="block mt-0.5 text-[#64748B] text-[11px]">
                  Target Acquisition: <strong className="text-[#1D4ED8]">{item.target}</strong>
                </span>
              </div>

              <div className="flex items-center self-end sm:self-auto gap-2.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onInspectTradeIn(item)}
                  className="px-2.5 py-1 text-xs"
                  leftIcon={<FiCheckSquare className="w-3.5 h-3.5 text-[#2563EB]" />}
                >
                  Appraisal Sheet
                </Button>
              </div>
            </div>

            {/* Valuation Delta Summary */}
            <div className="gap-2.5 grid grid-cols-1 sm:grid-cols-2 bg-[#FFFFFF] p-2.5 border border-[#E2E8F0] rounded text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Appraised Trade-In Credit:</span>
                <span className="font-mono font-bold text-[#1D4ED8] text-sm">{item.valuation}</span>
              </div>
              <div className="flex justify-between items-center sm:pl-3 sm:border-[#E2E8F0] sm:border-l">
                <span className="text-[#64748B]">Remaining Client Balance:</span>
                <span className="font-mono font-bold text-[#0F172A] text-sm">{item.diff}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

