"use client";

import React, { useState } from "react";
import { FiPlus, FiCheck } from "react-icons/fi";
import { Button, Badge, Card, Modal, Input, Dropdown } from "@/components/ui";

export interface FinanceDealItem {
  app: string;
  client: string;
  car: string;
  bank: string;
  loan: string;
  tenor: string;
  status: string;
}

export interface FinancingUnderwritingPageProps {
  showToast: (msg: string) => void;
}

export const FinancingUnderwritingPage: React.FC<FinancingUnderwritingPageProps> = ({ showToast }) => {
  const [deals, setDeals] = useState<FinanceDealItem[]>([
    { app: "FIN-2026-441", client: "Dr. K. Somoye", car: "2024 Porsche 911 Turbo S", bank: "Zenith Bank Asset Finance", loan: "$135,000", tenor: "36 Mo @ 12.5%", status: "Pre-Approved" },
    { app: "FIN-2026-440", client: "Chief Vance", car: "2024 Mercedes-Maybach S580", bank: "Stanbic IBTC Private Banking", loan: "$100,000", tenor: "24 Mo @ 11.8%", status: "Documentation Review" },
    { app: "FIN-2026-438", client: "Apex Dynamics Ltd", car: "2024 Mercedes-AMG G63", bank: "First Bank of Nigeria", loan: "$160,000", tenor: "48 Mo @ 13.0%", status: "Approved & Funded" },
    { app: "INS-2026-102", client: "Senator Godswill O.", car: "2023 Range Rover Autobiography", bank: "Leadway Comprehensive Luxury", loan: "$195,000 Value", tenor: "Annual 2.8% Premium", status: "Cover Note Issued" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [client, setClient] = useState("");
  const [car, setCar] = useState("2024 Mercedes-Maybach S580");
  const [bank, setBank] = useState("Zenith Bank Asset Finance");
  const [loanAmount, setLoanAmount] = useState("");
  const [tenorMonths, setTenorMonths] = useState("36");
  const [apr, setApr] = useState("11.5");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!client || !loanAmount) return;
    const newEntry: FinanceDealItem = {
      app: `FIN-2026-${String(deals.length + 442)}`,
      client,
      car,
      bank,
      loan: `$${Number(loanAmount.replace(/[^0-9]/g, "") || 0).toLocaleString()}`,
      tenor: `${tenorMonths} Mo @ ${apr}%`,
      status: "Pre-Approval Issued",
    };
    setDeals([newEntry, ...deals]);
    setIsModalOpen(false);
    showToast(`Underwriting facility approved for ${client} via ${bank}.`);
    setClient("");
    setLoanAmount("");
  };

  return (
    <Card className="space-y-3 shadow-xs p-4 sm:p-5">
      <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-2.5 border-[#E2E8F0] border-b">
        <div>
          <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">Auto Loan Underwriting, Leasing & Credit Facilities</h3>
          <p className="text-[#64748B] text-[11px]">Bank facilities, chattel mortgages, down payment plans, and loan amortization schedules</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<FiPlus className="w-3.5 h-3.5 text-[#FFFFFF]" />}
        >
          New Financing Application
        </Button>
      </div>

      {/* Modal for New Finance Application */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Underwrite New Vehicle Financing Facility"
        size="md"
      >
        <form onSubmit={handleCreate} className="space-y-3">
          <Input
            label="Applicant / Entity Name"
            placeholder="e.g. Alhaji Bello & Sons Ltd"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Dropdown
              label="Selected Vehicle Model"
              options={[
                { label: "2024 Mercedes-Maybach S580", value: "2024 Mercedes-Maybach S580" },
                { label: "2024 Porsche 911 Turbo S", value: "2024 Porsche 911 Turbo S" },
                { label: "2023 Range Rover Autobiography", value: "2023 Range Rover Autobiography" },
                { label: "2024 Mercedes-AMG G63 Magno", value: "2024 Mercedes-AMG G63 Magno" },
              ]}
              value={car}
              onChange={(val) => setCar(String(val))}
            />
            <Dropdown
              label="Lending Banking Partner"
              options={[
                { label: "Zenith Bank Asset Finance", value: "Zenith Bank Asset Finance" },
                { label: "Stanbic IBTC Private Banking", value: "Stanbic IBTC Private Banking" },
                { label: "First Bank of Nigeria Facility", value: "First Bank of Nigeria" },
                { label: "Access Bank Commercial Loans", value: "Access Bank Commercial" },
              ]}
              value={bank}
              onChange={(val) => setBank(String(val))}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Financed Principal ($)"
              type="text"
              placeholder="e.g. 120,000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              required
            />
            <Dropdown
              label="Loan Tenor"
              options={[
                { label: "12 Months (1 Year)", value: "12" },
                { label: "24 Months (2 Years)", value: "24" },
                { label: "36 Months (3 Years)", value: "36" },
                { label: "48 Months (4 Years)", value: "48" },
                { label: "60 Months (5 Years)", value: "60" },
              ]}
              value={tenorMonths}
              onChange={(val) => setTenorMonths(String(val))}
            />
            <Input
              label="Indicative APR (%)"
              type="text"
              value={apr}
              onChange={(e) => setApr(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" leftIcon={<FiCheck />}>
              Issue Pre-Approval & Term Sheet
            </Button>
          </div>
        </form>
      </Modal>

      <div className="space-y-2 text-xs">
        {deals.map((fin, fi) => (
          <div key={fi} className="flex sm:flex-row flex-col justify-between sm:items-center gap-2.5 bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-md">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#2563EB]">{fin.app}</span>
                <span className="font-bold text-[#0F172A]">{fin.client}</span>
              </div>
              <span className="block mt-0.5 text-[#64748B] text-[11px]">
                {fin.car} &bull; <strong className="text-[#0F172A]">{fin.bank}</strong> ({fin.tenor})
              </span>
            </div>
            <div className="flex items-center self-end sm:self-auto gap-3">
              <span className="font-mono font-bold text-[#0F172A] text-sm">{fin.loan}</span>
              <Badge variant={fin.status.includes("Approved") || fin.status.includes("Issued") ? "gold" : "charcoal"} size="sm">
                {fin.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

