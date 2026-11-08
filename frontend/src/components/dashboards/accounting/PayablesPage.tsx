"use client";

import React, { useState } from "react";
import { FiPlus, FiCheck } from "react-icons/fi";
import { Button, Badge, Card, Modal, Input, Dropdown } from "@/components/ui";

export interface PayableItem {
  id: string;
  vendor: string;
  type: string;
  ref: string;
  amount: string;
  dueDate: string;
  status: string;
}

export interface PayablesPageProps {
  payablesList: PayableItem[];
  onDisburse: (id: string) => void;
  onCreatePayable?: (item: PayableItem) => void;
}

export const PayablesPage: React.FC<PayablesPageProps> = ({
  payablesList: initialList,
  onDisburse,
  onCreatePayable,
}) => {
  const [list, setList] = useState<PayableItem[]>(initialList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vendor, setVendor] = useState("");
  const [type, setType] = useState("Carrier Marine Freight");
  const [ref, setRef] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("2026-11-25");

  // Keep synced with parent updates
  React.useEffect(() => {
    setList(initialList);
  }, [initialList]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor || !amount) return;
    const newEntry: PayableItem = {
      id: `VCH-${String(list.length + 1).padStart(3, "0")}`,
      vendor,
      type,
      ref: ref || `REF-${Math.floor(1000 + Math.random() * 9000)}`,
      amount: `$${Number(amount.replace(/[^0-9]/g, "") || 0).toLocaleString()}`,
      dueDate,
      status: "Approved for Wire",
    };
    setList([newEntry, ...list]);
    if (onCreatePayable) onCreatePayable(newEntry);
    setIsModalOpen(false);
    setVendor("");
    setAmount("");
    setRef("");
  };

  return (
    <Card className="space-y-3 shadow-xs p-4 sm:p-5">
      <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-2.5 border-[#E2E8F0] border-b">
        <div>
          <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
            Accounts Payable (Vendor Disbursements & Port Escrow Releases)
          </h3>
          <p className="text-[#64748B] text-[11px]">Carrier freight, customs NCS duty assessments, and OEM parts supplier invoices</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="gold" size="sm">Treasury Clearing</Badge>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<FiPlus className="w-3.5 h-3.5" />}
          >
            + Create Payable Voucher
          </Button>
        </div>
      </div>

      {/* Modal for Creating Payable Voucher */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Authorize New Accounts Payable Voucher"
        size="md"
      >
        <form onSubmit={handleCreate} className="space-y-3">
          <Input
            label="Vendor / Payee Entity"
            placeholder="e.g. Grimaldi Shipping Line / NCS Tin Can Terminal"
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Dropdown
              label="Disbursement Category"
              options={[
                { label: "Carrier Marine Freight", value: "Carrier Marine Freight" },
                { label: "Customs NCS Duty Assessment", value: "Customs NCS Duty Assessment" },
                { label: "Port Terminal Demurrage Bond", value: "Port Terminal Demurrage Bond" },
                { label: "OEM Parts Consignment", value: "OEM Parts Consignment" },
                { label: "FOB Procurement Wire", value: "FOB Procurement Wire" },
              ]}
              value={type}
              onChange={(val) => setType(String(val))}
            />
            <Input
              label="Bill / Assessment Reference"
              placeholder="e.g. SGD-2026-991"
              value={ref}
              onChange={(e) => setRef(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Disbursement Amount ($)"
              type="text"
              placeholder="e.g. 18,500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <Input
              label="Payment Due Date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" leftIcon={<FiCheck />}>
              Create & Authorize Voucher
            </Button>
          </div>
        </form>
      </Modal>

      <div className="space-y-2.5 text-xs">
        {list.map((item) => (
          <div
            key={item.id}
            className="flex sm:flex-row flex-col justify-between sm:items-center gap-3 bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-md"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#2563EB]">{item.id}</span>
                <span className="font-bold text-[#0F172A]">{item.vendor}</span>
                <Badge variant={item.status === "Settled via Wire" ? "gold" : "charcoal"} size="sm">
                  {item.status}
                </Badge>
              </div>
              <span className="block mt-0.5 text-[#64748B] text-[11px]">
                {item.type} &bull; Ref: <span className="font-mono">{item.ref}</span> &bull; Due Date: {item.dueDate}
              </span>
            </div>

            <div className="flex items-center self-end sm:self-auto gap-3">
              <span className="font-mono font-bold text-[#0F172A] text-sm">{item.amount}</span>
              {item.status !== "Settled via Wire" && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onDisburse(item.id)}
                  className="text-xs"
                >
                  Authorize Wire Disbursement
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

