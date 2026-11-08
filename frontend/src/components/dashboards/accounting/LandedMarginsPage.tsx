"use client";

import React from "react";
import { Button, Badge, Card } from "@/components/ui";

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
      fob: "$118,500",
      freight: "$4,800",
      duty: "$16,200",
      recon: "$1,200",
      landedCost: "$140,700",
      soldPrice: "$165,000",
      netMargin: "+$24,300",
      marginPct: "14.7%",
      client: "Alhaji Bello & Sons Ltd",
      soldDate: "2026-11-04",
      status: "Audited & Certified",
    },
    {
      stockId: "STK-2026-002",
      model: "2024 Porsche 911 Turbo S",
      fob: "$168,000",
      freight: "$5,200",
      duty: "$22,500",
      recon: "$1,500",
      landedCost: "$197,200",
      soldPrice: "$225,000",
      netMargin: "+$27,800",
      marginPct: "12.4%",
      client: "Dr. K. Somoye",
      soldDate: "2026-10-31",
      status: "Audited & Certified",
    },
    {
      stockId: "STK-2026-003",
      model: "2023 Range Rover Autobiography",
      fob: "$142,000",
      freight: "$4,900",
      duty: "$18,800",
      recon: "$1,800",
      landedCost: "$167,500",
      soldPrice: "$195,000",
      netMargin: "+$27,500",
      marginPct: "14.1%",
      client: "Zenith Capital Partners",
      soldDate: "2026-10-28",
      status: "Audited & Certified",
    },
    {
      stockId: "STK-2026-007",
      model: "2024 Mercedes-AMG G63 Magno",
      fob: "$176,000",
      freight: "$5,800",
      duty: "$24,200",
      recon: "$2,100",
      landedCost: "$208,100",
      soldPrice: "$240,000",
      netMargin: "+$31,900",
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

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#F8FAFC] border-[#E2E8F0] border-b font-bold text-[#64748B] text-[10px] uppercase">
            <tr>
              <th className="px-3 py-2.5">Stock & Model</th>
              <th className="px-3 py-2.5">FOB Purchase</th>
              <th className="px-3 py-2.5">Sea Freight</th>
              <th className="px-3 py-2.5">Customs (35%)</th>
              <th className="px-3 py-2.5">Recon Prep</th>
              <th className="px-3 py-2.5 font-bold text-[#0F172A]">Landed Cost</th>
              <th className="px-3 py-2.5 font-bold text-[#1D4ED8]">Sold Price</th>
              <th className="px-3 py-2.5 font-bold text-emerald-700">Net Margin</th>
              <th className="px-3 py-2.5 text-right">Audit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {marginRows.map((row) => (
              <tr key={row.stockId} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="px-3 py-3">
                  <div className="font-bold text-[#0F172A]">{row.model}</div>
                  <span className="font-mono text-[#2563EB] text-[10px]">{row.stockId}</span>
                </td>
                <td className="px-3 py-3 font-mono">{row.fob}</td>
                <td className="px-3 py-3 font-mono">{row.freight}</td>
                <td className="px-3 py-3 font-mono">{row.duty}</td>
                <td className="px-3 py-3 font-mono">{row.recon}</td>
                <td className="px-3 py-3 font-mono font-bold text-[#0F172A]">{row.landedCost}</td>
                <td className="px-3 py-3 font-mono font-bold text-[#1D4ED8]">{row.soldPrice}</td>
                <td className="px-3 py-3">
                  <span className="bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded font-mono font-bold text-emerald-700">
                    {row.netMargin} ({row.marginPct})
                  </span>
                </td>
                <td className="px-3 py-3 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAuditVoucher(row)}
                    className="px-2.5 py-0.5 text-[11px]"
                  >
                    Audit Voucher
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

