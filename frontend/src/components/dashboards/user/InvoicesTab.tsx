"use client";

import React from "react";
import { FiDownload } from "react-icons/fi";
import { Button, Badge } from "@/components/ui";

export interface CustomerInvoice {
  id: string;
  description: string;
  vehicle: string;
  date: string;
  amountUSD: number;
  amountNGN: number;
  status: string;
  method: string;
}

export interface InvoicesTabProps {
  customerInvoices: CustomerInvoice[];
  selectedCurrency: "USD" | "NGN";
  onSelectCurrency: (curr: "USD" | "NGN") => void;
}

export const InvoicesTab: React.FC<InvoicesTabProps> = ({
  customerInvoices,
  selectedCurrency,
  onSelectCurrency,
}) => {
  return (
    <div className="space-y-4 bg-[#FFFFFF] shadow-sm p-4 sm:p-5 border border-[#E2E8F0] rounded-2xl">
      <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-3">
        <div>
          <h3 className="font-bold text-[#0F172A] text-base uppercase tracking-tight">
            Invoices & Payment Receipts
          </h3>
          <p className="text-[#64748B] text-xs">Official purchase agreements, initial deposits, and port duty receipts.</p>
        </div>

        <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 border border-[#CBD5E1] rounded-xl">
          <Button
            variant={selectedCurrency === "USD" ? "primary" : "ghost"}
            size="sm"
            onClick={() => onSelectCurrency("USD")}
            className="px-3 py-1 font-mono text-xs"
          >
            $ USD
          </Button>
          <Button
            variant={selectedCurrency === "NGN" ? "primary" : "ghost"}
            size="sm"
            onClick={() => onSelectCurrency("NGN")}
            className="px-3 py-1 font-mono text-xs"
          >
            ₦ NGN
          </Button>
        </div>
      </div>

      <div className="space-y-2.5">
        {customerInvoices.map((inv) => (
          <div
            key={inv.id}
            className="flex sm:flex-row flex-col justify-between sm:items-center gap-3 bg-[#F8FAFC] p-3.5 border border-[#E2E8F0] rounded-xl"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#2563EB] text-xs">{inv.id}</span>
                <span className="text-[#CBD5E1]">&bull;</span>
                <h4 className="font-bold text-[#0F172A] text-xs sm:text-sm">{inv.description}</h4>
              </div>
              <span className="block text-[#64748B] text-[11px]">
                Vehicle: {inv.vehicle} &bull; Method: {inv.method} &bull; Date: {inv.date}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-mono font-bold text-[#1D4ED8] text-sm">
                  {selectedCurrency === "USD"
                    ? `$${inv.amountUSD.toLocaleString()}`
                    : `₦${inv.amountNGN.toLocaleString()}`}
                </div>
                <Badge variant="gold" size="sm">{inv.status}</Badge>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => alert(`Downloading official PDF tax receipt for ${inv.id}...`)}
                title="Download PDF Receipt"
                className="p-2"
              >
                <FiDownload className="w-4 h-4 text-[#2563EB]" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

