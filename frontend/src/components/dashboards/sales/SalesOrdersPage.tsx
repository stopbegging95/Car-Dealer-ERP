"use client";

import React from "react";
import {
  FiEye,
  FiCheckSquare,
  FiDownload,
} from "react-icons/fi";
import { Button, Badge, Card } from "@/components/ui";

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
  orders,
  onPreviewOrder,
  onInspectOrder,
  onDownloadPdf,
}) => {
  return (
    <Card className="space-y-3 shadow-xs p-4 sm:p-5">
      <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-2.5 border-[#E2E8F0] border-b">
        <div>
          <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">Active Luxury Sales Orders Pipeline</h3>
          <p className="text-[#64748B] text-[11px]">Audited contract commitments, bank escrow verification & delivery handover stages</p>
        </div>
        <Badge variant="gold" size="sm">Q4 FY 2026</Badge>
      </div>

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

