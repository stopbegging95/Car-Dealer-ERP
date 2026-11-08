"use client";

import React from "react";
import { FiDownload } from "react-icons/fi";
import { Button, Badge, Table } from "@/components/ui";

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
  onDownloadReceipt?: (inv: CustomerInvoice) => void;
}

export const InvoicesTab: React.FC<InvoicesTabProps> = ({
  customerInvoices,
  selectedCurrency,
  onSelectCurrency,
  onDownloadReceipt,
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

      <Table
        data={customerInvoices}
        keyExtractor={(inv) => inv.id}
        pageSize={15}
        showSerialNumber={true}
        columns={[
          {
            key: "id",
            header: "Invoice Ref",
            sortable: true,
            render: (inv) => <span className="font-mono font-bold text-[#2563EB] text-xs">{inv.id}</span>,
          },
          {
            key: "description",
            header: "Invoice Description",
            sortable: true,
            render: (inv) => (
              <div>
                <span className="font-bold text-[#0F172A] text-xs">{inv.description}</span>
                <span className="block text-[#64748B] text-[10px]">{inv.vehicle}</span>
              </div>
            ),
          },
          {
            key: "method",
            header: "Payment Channel",
            render: (inv) => <span className="text-[#475569] text-xs">{inv.method}</span>,
          },
          {
            key: "date",
            header: "Issue Date",
            sortable: true,
            render: (inv) => <span className="font-mono text-xs text-[#64748B]">{inv.date}</span>,
          },
          {
            key: "amount",
            header: "Amount",
            sortable: true,
            render: (inv) => (
              <span className="font-mono font-bold text-[#1D4ED8] text-xs">
                {selectedCurrency === "USD"
                  ? `$${inv.amountUSD.toLocaleString()}`
                  : `₦${inv.amountNGN.toLocaleString()}`}
              </span>
            ),
          },
          {
            key: "status",
            header: "Receipt Status",
            render: (inv) => <Badge variant="gold" size="sm">{inv.status}</Badge>,
          },
          {
            key: "action",
            header: "PDF",
            align: "right",
            render: (inv) => (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (onDownloadReceipt) onDownloadReceipt(inv);
                }}
                className="px-2.5 py-1 text-xs"
                leftIcon={<FiDownload className="w-3 h-3 text-[#2563EB]" />}
              >
                Receipt
              </Button>
            ),
          },
        ]}
      />
    </div>
  );
};

