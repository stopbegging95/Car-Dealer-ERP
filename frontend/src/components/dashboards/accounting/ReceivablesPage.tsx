"use client";

import React from "react";
import { Button, Badge, Card } from "@/components/ui";

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
}

export const ReceivablesPage: React.FC<ReceivablesPageProps> = ({
  receivablesList,
  onVerifyWire,
}) => {
  return (
    <Card className="space-y-3 shadow-xs p-4 sm:p-5">
      <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-2.5 border-b border-[#E2E8F0]">
        <div>
          <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
            Accounts Receivable (Client Bank Wire Verification & Clearing)
          </h3>
          <p className="text-[11px] text-[#64748B]">Verification of client bank remittances before issuing vehicle release passes</p>
        </div>
        <Badge variant="gold" size="sm">Central Clearing</Badge>
      </div>

      <div className="space-y-2.5 text-xs">
        {receivablesList.map((rec) => (
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

