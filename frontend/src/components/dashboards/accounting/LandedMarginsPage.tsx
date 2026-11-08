"use client";

import React from "react";
import { Button, Badge, Card, Table } from "@/components/ui";

export interface LandedMarginVoucher {
  stockId: string;
  model: string;
  fob: string;
  freight: string;
  duty: string;
  recon: string;
  landedCost: string;
  soldPrice: string;
  netMargin: string;
  marginPct: string;
  client: string;
  soldDate: string;
  status: string;
}

export interface LandedMarginsPageProps {
  onAuditVoucher: (voucher: LandedMarginVoucher) => void;
}

export const LandedMarginsPage: React.FC<LandedMarginsPageProps> = ({ onAuditVoucher }) => {
  const marginRows: LandedMarginVoucher[] = [
    {
      stockId: "STK-2026-001",
      model: "2024 Mercedes-Maybach S580",
      fob: "₦183,675,000",
      freight: "₦7,440,000",
      duty: "₦25,110,000",
      recon: "₦1,860,000",
      landedCost: "₦218,085,000",
      soldPrice: "₦255,750,000",
      netMargin: "+₦37,665,000",
      marginPct: "14.7%",
      client: "Alhaji Bello & Sons Ltd",
      soldDate: "2026-11-04",
      status: "Audited & Certified",
    },
    {
      stockId: "STK-2026-002",
      model: "2024 Porsche 911 Turbo S",
      fob: "₦260,400,000",
      freight: "₦8,060,000",
      duty: "₦34,875,000",
      recon: "₦2,325,000",
      landedCost: "₦305,660,000",
      soldPrice: "₦348,750,000",
      netMargin: "+₦43,090,000",
      marginPct: "12.4%",
      client: "Dr. K. Somoye",
      soldDate: "2026-10-31",
      status: "Audited & Certified",
    },
    {
      stockId: "STK-2026-003",
      model: "2023 Range Rover Autobiography",
      fob: "₦220,100,000",
      freight: "₦7,595,000",
      duty: "₦29,140,000",
      recon: "₦2,790,000",
      landedCost: "₦259,625,000",
      soldPrice: "₦302,250,000",
      netMargin: "+₦42,625,000",
      marginPct: "14.1%",
      client: "Zenith Capital Partners",
      soldDate: "2026-10-28",
      status: "Audited & Certified",
    },
    {
      stockId: "STK-2026-007",
      model: "2024 Mercedes-AMG G63 Magno",
      fob: "₦272,800,000",
      freight: "₦8,990,000",
      duty: "₦37,510,000",
      recon: "₦3,255,000",
      landedCost: "₦322,555,000",
      soldPrice: "₦372,000,000",
      netMargin: "+₦49,445,000",
      marginPct: "13.3%",
      client: "Senator Godswill O.",
      soldDate: "2026-10-22",
      status: "Audited & Certified",
    },
  ];

  return (
    <Card className="space-y-3 shadow-xs p-4 sm:p-5">
      <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-2.5 border-[#E2E8F0] border-b">
        <div>
          <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
            Vehicle Landed Cost & Gross Margin Reconciliation Ledger
          </h3>
          <p className="text-[#64748B] text-[11px]">Audited FOB procurement + Atlantic Sea freight + Port Customs SGD (35%) + Recon prep vs Sold price</p>
        </div>
        <Badge variant="gold" size="sm">Audited by Chief Accountant</Badge>
      </div>

      <Table
        data={marginRows}
        keyExtractor={(row) => row.stockId}
        pageSize={15}
        showSerialNumber={true}
        columns={[
          {
            key: "model",
            header: "Stock & Model",
            sortable: true,
            render: (row) => (
              <div>
                <div className="font-bold text-[#0F172A]">{row.model}</div>
                <span className="font-mono text-[#2563EB] text-[10px]">{row.stockId}</span>
              </div>
            ),
          },
          {
            key: "fob",
            header: "FOB Purchase",
            sortable: true,
            render: (row) => <span className="font-mono">{row.fob}</span>,
          },
          {
            key: "freight",
            header: "Sea Freight",
            sortable: true,
            render: (row) => <span className="font-mono">{row.freight}</span>,
          },
          {
            key: "duty",
            header: "Customs (35%)",
            sortable: true,
            render: (row) => <span className="font-mono">{row.duty}</span>,
          },
          {
            key: "recon",
            header: "Recon Prep",
            sortable: true,
            render: (row) => <span className="font-mono">{row.recon}</span>,
          },
          {
            key: "landedCost",
            header: "Landed Cost",
            sortable: true,
            render: (row) => (
              <span className="font-mono font-bold text-[#0F172A]">{row.landedCost}</span>
            ),
          },
          {
            key: "soldPrice",
            header: "Sold Price",
            sortable: true,
            render: (row) => (
              <span className="font-mono font-bold text-[#1D4ED8]">{row.soldPrice}</span>
            ),
          },
          {
            key: "netMargin",
            header: "Net Margin",
            sortable: true,
            render: (row) => (
              <span className="bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded font-mono font-bold text-emerald-700">
                {row.netMargin} ({row.marginPct})
              </span>
            ),
          },
          {
            key: "action",
            header: "Audit",
            align: "right",
            render: (row) => (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAuditVoucher(row)}
                className="px-2.5 py-0.5 text-[11px]"
              >
                Audit Voucher
              </Button>
            ),
          },
        ]}
      />
    </Card>
  );
};

