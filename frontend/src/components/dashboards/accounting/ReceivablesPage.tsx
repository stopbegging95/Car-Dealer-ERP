"use client";

import React, { useState } from "react";
import { FiPlus, FiCheck } from "react-icons/fi";
import { Button, Badge, Card, Modal, Input, Dropdown } from "@/components/ui";

export interface ReceivableItem {
  id: string;
  client: string;
  car: string;
  balance: string;
  bank: string;
  wireRef: string;
  status: string;
}

export interface ReceivablesPageProps {
  receivablesList: ReceivableItem[];
  onVerifyWire: (id: string) => void;
  onCreateReceivable?: (item: ReceivableItem) => void;
}

export const ReceivablesPage: React.FC<ReceivablesPageProps> = ({
  receivablesList: initialList,
  onVerifyWire,
  onCreateReceivable,
}) => {
  const [list, setList] = useState<ReceivableItem[]>(initialList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [client, setClient] = useState("");
  const [car, setCar] = useState("2024 Mercedes-Maybach S580");
  const [balance, setBalance] = useState("");
  const [bank, setBank] = useState("Zenith Bank Escrow");
  const [wireRef, setWireRef] = useState("");

  React.useEffect(() => {
    setList(initialList);
  }, [initialList]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!client || !balance) return;
    const newEntry: ReceivableItem = {
      id: `REC-2026-${String(list.length + 1).padStart(3, "0")}`,
      client,
      car,
      balance: `$${Number(balance.replace(/[^0-9]/g, "") || 0).toLocaleString()}`,
      bank,
      wireRef: wireRef || `WT-ZEN-${Math.floor(100000 + Math.random() * 900000)}`,
      status: "Inbound Wire Pending Clearing",
    };
    setList([newEntry, ...list]);
    if (onCreateReceivable) onCreateReceivable(newEntry);
    setIsModalOpen(false);
    setClient("");
    setBalance("");
    setWireRef("");
  };

  return (
    <Card className="space-y-3 shadow-xs p-4 sm:p-5">
      <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-2.5 border-b border-[#E2E8F0]">
        <div>
          <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
            Accounts Receivable (Client Bank Wire Verification & Clearing)
          </h3>
          <p className="text-[11px] text-[#64748B]">Verification of client bank remittances before issuing vehicle release passes</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="gold" size="sm">Central Clearing</Badge>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<FiPlus className="w-3.5 h-3.5" />}
          >
            + Record Inbound Wire
          </Button>
        </div>
      </div>

      {/* Modal for Recording Inbound Wire */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record Client Inbound Wire Remittance"
        size="md"
      >
        <form onSubmit={handleCreate} className="space-y-3">
          <Input
            label="Client / Remitting Organization"
            placeholder="e.g. Chief Dr. Somoye / Embassy of UAE"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Dropdown
              label="Vehicle Assigned"
              options={[
                { label: "2024 Mercedes-Maybach S580", value: "2024 Mercedes-Maybach S580" },
                { label: "2024 Porsche 911 Turbo S", value: "2024 Porsche 911 Turbo S" },
                { label: "2023 Range Rover Autobiography", value: "2023 Range Rover Autobiography" },
                { label: "2024 Mercedes-AMG G63 Magno", value: "2024 Mercedes-AMG G63 Magno" },
              ]}
              value={car}
              onChange={(val) => setCar(String(val))}
            />
            <Dropdown
              label="Receiving Escrow Bank"
              options={[
                { label: "Zenith Bank Plc (Treasury Escrow)", value: "Zenith Bank Escrow" },
                { label: "GTBank Offshore USD Account", value: "GTBank Offshore USD" },
                { label: "Standard Chartered Private Banking", value: "Standard Chartered" },
              ]}
              value={bank}
              onChange={(val) => setBank(String(val))}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Remittance Balance ($)"
              type="text"
              placeholder="e.g. 115,000"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              required
            />
            <Input
              label="Bank Swift / NIBSS Reference"
              placeholder="e.g. WT-ZEN-881923"
              value={wireRef}
              onChange={(e) => setWireRef(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" leftIcon={<FiCheck />}>
              Record & Queue for GL Clearing
            </Button>
          </div>
        </form>
      </Modal>

      <div className="space-y-2.5 text-xs">
        {list.map((rec) => (
          <div
            key={rec.id}
            className="flex sm:flex-row flex-col justify-between sm:items-center gap-3 bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-md"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold font-mono text-[#2563EB]">{rec.id}</span>
                <span className="font-bold text-[#0F172A]">{rec.client}</span>
                <Badge variant={rec.status === "Verified & Reconciled to GL" ? "gold" : "charcoal"} size="sm">
                  {rec.status}
                </Badge>
              </div>
              <span className="block mt-0.5 text-[#64748B] text-[11px]">
                Vehicle: {rec.car} &bull; Bank: {rec.bank} &bull; Wire Ref: <span className="font-bold font-mono">{rec.wireRef}</span>
              </span>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <span className="font-bold font-mono text-[#1D4ED8] text-sm">{rec.balance}</span>
              {rec.status !== "Verified & Reconciled to GL" && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onVerifyWire(rec.id)}
                  className="text-xs"
                >
                  Verify Bank Wire
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

