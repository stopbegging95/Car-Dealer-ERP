"use client";

import React from "react";
import { Button, Badge, Card } from "@/components/ui";

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
}

export const PayablesPage: React.FC<PayablesPageProps> = ({ payablesList, onDisburse }) => {
  return (
    <Card className="space-y-3 shadow-xs p-4 sm:p-5">
      <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-2.5 border-[#E2E8F0] border-b">
        <div>
          <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
            Accounts Payable (Vendor Disbursements & Port Escrow Releases)
          </h3>
          <p className="text-[#64748B] text-[11px]">Carrier freight, customs NCS duty assessments, and OEM parts supplier invoices</p>
        </div>
        <Badge variant="gold" size="sm">Treasury Clearing</Badge>
      </div>

      <div className="space-y-2.5 text-xs">
        {payablesList.map((item) => (
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

