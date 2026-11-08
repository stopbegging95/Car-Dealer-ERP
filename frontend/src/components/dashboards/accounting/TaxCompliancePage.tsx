"use client";

import React from "react";
import { FiDownload } from "react-icons/fi";
import { Button, Card, Badge, Table } from "@/components/ui";

export interface TaxCompliancePageProps {
  showToast: (msg: string) => void;
}

export const TaxCompliancePage: React.FC<TaxCompliancePageProps> = ({ showToast }) => {
  const taxFilings = [
    { period: "October 2026", output: "₦397,575,000", input: "₦96,720,000", net: "₦300,855,000", dueDate: "2026-11-21", ref: "FIRS-VAT-2026-10", status: "Audit Cleared" },
    { period: "September 2026", output: "₦440,200,000", input: "₦110,360,000", net: "₦329,840,000", dueDate: "2026-10-21", ref: "FIRS-VAT-2026-09", status: "Remitted & Verified" },
    { period: "August 2026", output: "₦326,275,000", input: "₦83,700,000", net: "₦242,575,000", dueDate: "2026-09-21", ref: "FIRS-VAT-2026-08", status: "Remitted & Verified" },
    { period: "July 2026", output: "₦480,500,000", input: "₦137,175,000", net: "₦343,325,000", dueDate: "2026-08-21", ref: "FIRS-VAT-2026-07", status: "Remitted & Verified" },
  ];

  return (
    <Card className="space-y-4 shadow-xs p-4 sm:p-5">
      <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-2.5 border-[#E2E8F0] border-b">
        <div>
          <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
            Federal Inland Revenue Service (FIRS) 7.5% VAT Compliance
          </h3>
          <p className="text-[#64748B] text-[11px]">Real-time output VAT collected on retail sales vs input VAT deducted on clearing</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => showToast("FIRS Tax Clearance Docket PDF dispatched to secure download queue.")}
          leftIcon={<FiDownload className="w-3.5 h-3.5 text-[#2563EB]" />}
        >
          Download Tax Clearance Docket
        </Button>
      </div>

      <div className="gap-3 grid grid-cols-1 sm:grid-cols-3 text-xs">
        <div className="space-y-1 bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-md">
          <span className="block text-[#64748B] text-[10px] uppercase">Gross Output VAT (7.5%)</span>
          <div className="font-mono font-bold text-[#0F172A] text-base">₦397,575,000</div>
          <span className="block text-[#64748B] text-[10px]">Collected on ₦5.3B MTD Sales</span>
        </div>
        <div className="space-y-1 bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-md">
          <span className="block text-[#64748B] text-[10px] uppercase">Input VAT Offset Credits</span>
          <div className="font-mono font-bold text-emerald-700 text-base">-₦96,720,000</div>
          <span className="block text-[#64748B] text-[10px]">Paid at Port SGD Assessment</span>
        </div>
        <div className="space-y-1 bg-[#EFF6FF] p-3 border border-[#BFDBFE] rounded-md">
          <span className="block font-bold text-[#1D4ED8] text-[10px] uppercase">Net VAT Remittance Due</span>
          <div className="font-mono font-bold text-[#1D4ED8] text-base">₦300,855,000</div>
          <span className="block text-[#1D4ED8] text-[10px]">Due: 21st of November, 2026</span>
        </div>
      </div>

      <Table
        data={taxFilings}
        keyExtractor={(item) => item.period}
        pageSize={15}
        showSerialNumber={true}
        columns={[
          {
            key: "period",
            header: "Assessment Period",
            sortable: true,
            render: (item) => <span className="font-bold text-[#0F172A]">{item.period}</span>,
          },
          {
            key: "ref",
            header: "FIRS Filing Ref",
            render: (item) => <span className="font-mono text-[#2563EB] text-xs">{item.ref}</span>,
          },
          {
            key: "output",
            header: "Output VAT (7.5%)",
            sortable: true,
            render: (item) => <span className="font-mono font-bold text-[#0F172A]">{item.output}</span>,
          },
          {
            key: "input",
            header: "Input Credit (Port)",
            sortable: true,
            render: (item) => <span className="font-mono text-emerald-600 font-semibold">{item.input}</span>,
          },
          {
            key: "net",
            header: "Net Payable",
            sortable: true,
            render: (item) => <span className="font-mono font-bold text-[#1D4ED8]">{item.net}</span>,
          },
          {
            key: "dueDate",
            header: "Filing Deadline",
            sortable: true,
            render: (item) => <span className="text-[#475569] text-xs">{item.dueDate}</span>,
          },
          {
            key: "status",
            header: "Compliance Status",
            align: "right",
            render: (item) => (
              <Badge variant={item.status === "Audit Cleared" ? "gold" : "charcoal"} size="sm">
                {item.status}
              </Badge>
            ),
          },
        ]}
      />
    </Card>
  );
};

