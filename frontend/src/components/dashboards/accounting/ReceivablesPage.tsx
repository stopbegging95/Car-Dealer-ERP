"use client";

import React, { useState } from "react";
import { FiPlus, FiCheck } from "react-icons/fi";
import { Button, Badge, Card, Modal, Input, Dropdown, Table } from "@/components/ui";

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

      <Table
        data={list}
        keyExtractor={(rec) => rec.id}
        pageSize={15}
        showSerialNumber={true}
        columns={[
          {
            key: "id",
            header: "Receivable ID",
            sortable: true,
            render: (rec) => (
              <span className="font-mono font-bold text-[#2563EB]">{rec.id}</span>
            ),
          },
          {
            key: "client",
            header: "Client & Vehicle",
            sortable: true,
            render: (rec) => (
              <div>
                <span className="font-bold text-[#0F172A]">{rec.client}</span>
                <span className="block text-[10px] text-[#64748B]">{rec.car}</span>
              </div>
            ),
          },
          {
            key: "bank",
            header: "Receiving Escrow Bank",
            sortable: true,
            render: (rec) => <span className="text-xs text-[#475569]">{rec.bank}</span>,
          },
          {
            key: "wireRef",
            header: "Bank Wire Ref",
            render: (rec) => (
              <span className="font-mono font-bold text-[#2563EB] text-xs">{rec.wireRef}</span>
            ),
          },
          {
            key: "balance",
            header: "Remittance Balance",
            sortable: true,
            render: (rec) => (
              <span className="font-mono font-bold text-[#1D4ED8]">{rec.balance}</span>
            ),
          },
          {
            key: "status",
            header: "Status",
            render: (rec) => (
              <Badge variant={rec.status === "Verified & Reconciled to GL" ? "gold" : "charcoal"} size="sm">
                {rec.status}
              </Badge>
            ),
          },
          {
            key: "action",
            header: "Verification",
            align: "right",
            render: (rec) =>
              rec.status !== "Verified & Reconciled to GL" ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onVerifyWire(rec.id)}
                  className="text-xs"
                >
                  Verify Bank Wire
                </Button>
              ) : (
                <span className="font-mono text-emerald-600 font-semibold text-xs">Reconciled to GL</span>
              ),
          },
        ]}
      />
    </Card>
  );
};

