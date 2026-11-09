"use client";

import React, { useState } from "react";
import { FiPlus, FiCheck } from "react-icons/fi";
import { Button, Badge, Card, Modal, Input, Dropdown, MasterDropdown, Table } from "@/components/ui";
import { TaxonomyManagerSection } from "../admin/MasterDataPage";

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
    { app: "FIN-2026-441", client: "Dr. K. Somoye", car: "2024 Porsche 911 Turbo S", bank: "Zenith Bank Asset Finance", loan: "₦209,250,000", tenor: "36 Mo @ 12.5%", status: "Pre-Approved" },
    { app: "FIN-2026-440", client: "Chief Vance", car: "2024 Mercedes-Maybach S580", bank: "Stanbic IBTC Private Banking", loan: "₦155,000,000", tenor: "24 Mo @ 11.8%", status: "Documentation Review" },
    { app: "FIN-2026-438", client: "Apex Dynamics Ltd", car: "2024 Mercedes-AMG G63", bank: "First Bank of Nigeria", loan: "₦248,000,000", tenor: "48 Mo @ 13.0%", status: "Approved & Funded" },
    { app: "INS-2026-102", client: "Senator Godswill O.", car: "2023 Range Rover Autobiography", bank: "Leadway Comprehensive Luxury", loan: "₦302,250,000 Value", tenor: "Annual 2.8% Premium", status: "Cover Note Issued" },
  ]);

  const [activeTab, setActiveTab] = useState<"deals" | "taxonomies">("deals");

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
      loan: `₦${Number(loanAmount.replace(/[^0-9]/g, "") || 0).toLocaleString()}`,
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
    <div className="space-y-4">
      {/* Sub-Tab Navigation Bar */}
      <Card className="shadow-xs p-3">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeTab === "deals" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("deals")}
            className="text-xs font-bold"
          >
            Auto Loan Underwriting Deals ({deals.length} Active)
          </Button>
          <Button
            variant={activeTab === "taxonomies" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("taxonomies")}
            className="text-xs font-bold"
          >
            Lending Banks & Payment Channels (2 Taxonomies)
          </Button>
        </div>
      </Card>

      {activeTab === "taxonomies" ? (
        <TaxonomyManagerSection
          allowedCategories={["banks", "payment_channels"]}
          title="Financing Lending Banks & Remittance Channels"
          description="Manage accredited underwriting banking partners and client credit remittance channels."
          headerBadge="F&I Desk Authorized"
          showToast={showToast}
        />
      ) : (
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

      {/* Section 11 F&I Deal Flow Pipeline Strip */}
      <div className="p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg">
        <div className="flex items-center justify-between pb-1.5 border-b border-[#BFDBFE] text-[10px] font-mono uppercase text-[#2563EB] font-bold">
          <span>Standard F&I Auto Loan Underwriting & Chattel Mortgage Protocol</span>
          <span className="text-[#1D4ED8]">Tier-1 Banking Partner Syndicate</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 text-[10px] font-semibold text-[#1E3A8A]">
          <div className="p-1.5 rounded bg-white border border-[#DBEAFE] text-center">1. Credit App Intake</div>
          <div className="p-1.5 rounded bg-white border border-[#DBEAFE] text-center">2. Bank Bureau Verification</div>
          <div className="p-1.5 rounded bg-white border border-[#DBEAFE] text-center">3. Underwriting Term Sheet</div>
          <div className="p-1.5 rounded bg-white border border-[#DBEAFE] text-center">4. Chattel Mortgage Sign</div>
          <div className="p-1.5 rounded bg-white border border-[#DBEAFE] text-center">5. Insurance Cover Bound</div>
          <div className="p-1.5 rounded bg-white border border-[#DBEAFE] text-center">6. Bank Wire Funded</div>
        </div>
      </div>

      {/* F&I Value-Add Products & Insurance Cover Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        <div className="p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#2563EB]">
            <span>Extended Warranty</span>
            <span>+₦6,975,000</span>
          </div>
          <div className="text-xs font-bold text-[#0F172A]">2-Year Factory Bumper-to-Bumper</div>
          <div className="text-[10px] text-[#64748B]">Zero deductible drivetrain coverage</div>
        </div>
        <div className="p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#2563EB]">
            <span>Paint Protection (PPF)</span>
            <span>+₦4,340,000</span>
          </div>
          <div className="text-xs font-bold text-[#0F172A]">Self-Healing Ceramic Armor</div>
          <div className="text-[10px] text-[#64748B]">Full frontal bumper & hood PPF</div>
        </div>
        <div className="p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#2563EB]">
            <span>Comprehensive Cover</span>
            <span>2.8% p.a.</span>
          </div>
          <div className="text-xs font-bold text-[#0F172A]">Leadway & AXA Mansard Luxury</div>
          <div className="text-[10px] text-[#64748B]">Full market replacement value</div>
        </div>
        <div className="p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#2563EB]">
            <span>Telematics & GPS</span>
            <span>+₦1,860,000</span>
          </div>
          <div className="text-xs font-bold text-[#0F172A]">Real-Time Satellite Recovery</div>
          <div className="text-[10px] text-[#64748B]">Remote engine immobilizer active</div>
        </div>
      </div>
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
            <MasterDropdown
              category="banks"
              label="Lending Banking Partner"
              value={bank}
              onChange={(val) => setBank(String(val))}
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Financed Principal (₦ NGN)"
              type="text"
              placeholder="e.g. 185,000,000"
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

      <Table
        data={deals}
        keyExtractor={(fin) => fin.app}
        pageSize={15}
        showSerialNumber={true}
        columns={[
          {
            key: "app",
            header: "Facility ID",
            sortable: true,
            render: (fin) => (
              <span className="font-mono font-bold text-[#2563EB]">{fin.app}</span>
            ),
          },
          {
            key: "client",
            header: "Applicant / Corporate Entity",
            sortable: true,
            render: (fin) => <span className="font-bold text-[#0F172A]">{fin.client}</span>,
          },
          {
            key: "car",
            header: "Acquisition Vehicle",
            sortable: true,
            render: (fin) => <span className="text-xs text-[#475569]">{fin.car}</span>,
          },
          {
            key: "bank",
            header: "Partner Bank & Tenor",
            sortable: true,
            render: (fin) => (
              <div>
                <span className="font-semibold text-xs text-[#0F172A]">{fin.bank}</span>
                <span className="block text-[10px] text-[#64748B]">{fin.tenor}</span>
              </div>
            ),
          },
          {
            key: "loan",
            header: "Principal Amount",
            sortable: true,
            render: (fin) => (
              <span className="font-mono font-bold text-[#1D4ED8]">{fin.loan}</span>
            ),
          },
          {
            key: "status",
            header: "Underwriting Stage",
            align: "right",
            render: (fin) => (
              <Badge
                variant={
                  fin.status.includes("Approved") || fin.status.includes("Issued")
                    ? "gold"
                    : "charcoal"
                }
                size="sm"
              >
                {fin.status}
              </Badge>
            ),
          },
        ]}
      />
    </Card>
      )}
    </div>
  );
};

