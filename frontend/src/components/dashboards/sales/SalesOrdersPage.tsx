"use client";

import React, { useState } from "react";
import {
  FiEye,
  FiCheckSquare,
  FiDownload,
  FiPlus,
  FiX,
  FiCheck,
} from "react-icons/fi";
import { Button, Badge, Card, Modal, Input, Dropdown } from "@/components/ui";

export interface OrderItem {
  id: string;
  client: string;
  car: string;
  amount: string;
  status: string;
  stage: string;
  rep: string;
  vin?: string;
  deposit?: string;
  balance?: string;
  deliveryDate?: string;
}

export interface SalesOrdersPageProps {
  orders: OrderItem[];
  onPreviewOrder: (order: OrderItem) => void;
  onInspectOrder: (order: OrderItem) => void;
  onDownloadPdf: (order: OrderItem) => void;
}

export const SalesOrdersPage: React.FC<SalesOrdersPageProps> = ({
  orders: initialOrders,
  onPreviewOrder,
  onInspectOrder,
  onDownloadPdf,
}) => {
  const [orders, setOrders] = useState<OrderItem[]>(initialOrders);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newClient, setNewClient] = useState("");
  const [newCar, setNewCar] = useState("2024 Mercedes-Maybach S580");
  const [newAmount, setNewAmount] = useState("165,000");
  const [newDeposit, setNewDeposit] = useState("50,000");
  const [newDeliveryDate, setNewDeliveryDate] = useState("2026-11-20");
  const [newRep, setNewRep] = useState("Senior Sales Liaison");
  const [newHub, setNewHub] = useState("VI");

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient) return;
    const newId = `ORD-2026-${String(orders.length + 1).padStart(3, "0")}`;
    const newEntry: OrderItem = {
      id: newId,
      client: newClient,
      car: newCar,
      amount: `$${Number(newAmount.replace(/[^0-9]/g, "") || 0).toLocaleString()}`,
      deposit: `$${Number(newDeposit.replace(/[^0-9]/g, "") || 0).toLocaleString()}`,
      balance: `$${(Number(newAmount.replace(/[^0-9]/g, "") || 0) - Number(newDeposit.replace(/[^0-9]/g, "") || 0)).toLocaleString()}`,
      status: "Wire Deposit Verified",
      stage: "Contract Signed & Delivery Prep",
      rep: newRep,
      deliveryDate: newDeliveryDate,
    };
    setOrders([newEntry, ...orders]);
    setIsCreateOpen(false);
    setNewClient("");
  };

  return (
    <Card className="space-y-3 shadow-xs p-4 sm:p-5">
      <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-2.5 border-[#E2E8F0] border-b">
        <div>
          <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">Active Luxury Sales Orders Pipeline</h3>
          <p className="text-[#64748B] text-[11px]">Audited contract commitments, bank escrow verification & delivery handover stages</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="gold" size="sm">Q4 FY 2026</Badge>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            leftIcon={<FiPlus className="w-3.5 h-3.5" />}
          >
            + Create Sales Order
          </Button>
        </div>
      </div>

      {/* Modal for Creating Sales Order */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Generate New Luxury Sales Order & Proforma"
        size="lg"
      >
        <form onSubmit={handleCreateOrder} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Client Name & Organization"
              placeholder="e.g. Chief Dr. Somoye / Zenith Partners"
              value={newClient}
              onChange={(e) => setNewClient(e.target.value)}
              required
            />
            <Dropdown
              label="Vehicle Acquired (Stock)"
              options={[
                { label: "2024 Mercedes-Maybach S580 (STK-001)", value: "2024 Mercedes-Maybach S580" },
                { label: "2024 Porsche 911 Turbo S (STK-002)", value: "2024 Porsche 911 Turbo S" },
                { label: "2023 Range Rover Autobiography (STK-003)", value: "2023 Range Rover Autobiography" },
                { label: "2024 Mercedes-AMG G63 Magno (STK-007)", value: "2024 Mercedes-AMG G63 Magno" },
              ]}
              value={newCar}
              onChange={(val) => setNewCar(String(val))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Agreed Contract Price ($)"
              type="text"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              required
            />
            <Input
              label="Initial Wire Deposit ($)"
              type="text"
              value={newDeposit}
              onChange={(e) => setNewDeposit(e.target.value)}
              required
            />
            <Input
              label="Handover Target Date"
              type="date"
              value={newDeliveryDate}
              onChange={(e) => setNewDeliveryDate(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Assigned Sales Representative"
              value={newRep}
              onChange={(e) => setNewRep(e.target.value)}
              required
            />
            <Dropdown
              label="Delivery Showroom Hub"
              options={[
                { label: "Victoria Island Flagship Showroom", value: "VI" },
                { label: "Maitama Diplomatic Suite, Abuja", value: "Abuja" },
                { label: "White-Glove Doorstep Delivery", value: "Home" },
              ]}
              value={newHub}
              onChange={(val) => setNewHub(String(val))}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" leftIcon={<FiCheck />}>
              Issue Sales Order & Proforma
            </Button>
          </div>
        </form>
      </Modal>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#F8FAFC] border-[#E2E8F0] border-b font-bold text-[#64748B] text-[10px] uppercase">
            <tr>
              <th className="px-3 py-2.5">Order ID</th>
              <th className="px-3 py-2.5">Client & Organization</th>
              <th className="px-3 py-2.5">Vehicle Acquired</th>
              <th className="px-3 py-2.5 font-mono">Contract Total</th>
              <th className="px-3 py-2.5">Workflow Stage</th>
              <th className="px-3 py-2.5">Assigned Rep</th>
              <th className="px-3 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="px-3 py-3 font-mono font-bold text-[#2563EB]">{order.id}</td>
                <td className="px-3 py-3 font-semibold text-[#0F172A]">{order.client}</td>
                <td className="px-3 py-3 text-[#475569]">{order.car}</td>
                <td className="px-3 py-3 font-mono font-bold text-[#1D4ED8]">{order.amount}</td>
                <td className="px-3 py-3">
                  <Badge variant="gold" size="sm" dot>
                    {order.status}
                  </Badge>
                  <span className="block mt-0.5 text-[#64748B] text-[10px]">{order.stage}</span>
                </td>
                <td className="px-3 py-3 font-medium text-[#0F172A]">{order.rep}</td>
                <td className="space-x-1.5 px-3 py-3 text-right whitespace-nowrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPreviewOrder(order)}
                    className="px-2 py-0.5 text-[11px]"
                    leftIcon={<FiEye className="w-3 h-3 text-[#2563EB]" />}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onInspectOrder(order)}
                    className="px-2 py-0.5 text-[11px]"
                    leftIcon={<FiCheckSquare className="w-3 h-3 text-[#2563EB]" />}
                  >
                    Inspect
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onDownloadPdf(order)}
                    className="px-2 py-0.5 text-[11px]"
                    leftIcon={<FiDownload className="w-3 h-3 text-[#FFFFFF]" />}
                  >
                    PDF
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

