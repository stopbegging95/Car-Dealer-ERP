"use client";

import React from "react";
import {
  FiDollarSign,
  FiPercent,
  FiClock,
  FiShield,
  FiDownload,
  FiLock,
  FiCheckCircle,
} from "react-icons/fi";
import { Button, Badge, KPICard, Card } from "@/components/ui";
import { LandedMarginsPage, LandedMarginVoucher } from "./LandedMarginsPage";
import { PayablesPage, PayableItem } from "./PayablesPage";
import { ReceivablesPage, ReceivableItem } from "./ReceivablesPage";
import { TaxCompliancePage } from "./TaxCompliancePage";

export interface AccountingDashboardProps {
  payablesList: PayableItem[];
  receivablesList: ReceivableItem[];
  accountingTab: "margins" | "payables" | "receivables" | "tax";
  onTabChange: (tab: "margins" | "payables" | "receivables" | "tax") => void;
  onAuditVoucher: (voucher: LandedMarginVoucher) => void;
  onDisburse: (id: string) => void;
  onVerifyWire: (id: string) => void;
  onLockPeriod: () => void;
  fiscalPeriodLocked: boolean;
  showToast: (msg: string) => void;
}

export const AccountingDashboard: React.FC<AccountingDashboardProps> = ({
  payablesList,
  receivablesList,
  accountingTab,
  onTabChange,
  onAuditVoucher,
  onDisburse,
  onVerifyWire,
  onLockPeriod,
  fiscalPeriodLocked,
  showToast,
}) => {
  return (
    <div className="space-y-4">
      {/* Accounting KPI Summary Cards */}
      <div className="gap-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Gross Landed Margin"
          value="$111,500"
          change="Average 13.8% Margin"
          icon={<FiDollarSign className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Accounts Payable (AP)"
          value="$127,200"
          change="4 Due Wires Pending"
          icon={<FiClock className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Accounts Receivable (AR)"
          value="$382,000"
          change="3 Inbound Wires to Clear"
          icon={<FiCheckCircle className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Output VAT (7.5%)"
          value="$194,100"
          change="Net Due 21st Nov 2026"
          icon={<FiPercent className="w-5 h-5 text-[#2563EB]" />}
        />
      </div>

      {/* Dealership Treasury & Liquidity Bar */}
      <Card className="shadow-xs p-4 sm:p-5">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#EFF6FF] p-1.5 border border-[#BFDBFE] rounded text-[#2563EB]">
                <FiShield className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider">
                Dealership Treasury, Cash Liquidity & Fiscal Period Lock
              </h3>
            </div>
            <p className="mt-0.5 text-[11px] text-[#64748B]">
              Real-time liquidity across Nigerian Naira (Zenith / GTBank) and US Dollar offshore clearing accounts
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => showToast("Financial Statement PDF generated and exported to secure vault.")}
              leftIcon={<FiDownload className="w-3.5 h-3.5 text-[#2563EB]" />}
            >
              Export Financial PDF
            </Button>
            <Button
              variant={fiscalPeriodLocked ? "outline" : "primary"}
              size="sm"
              onClick={onLockPeriod}
              leftIcon={<FiLock className="w-3.5 h-3.5" />}
            >
              {fiscalPeriodLocked ? "Period Locked (Click to Unlock)" : "Cryptographically Lock Period"}
            </Button>
          </div>
        </div>

        {/* Bank Liquidity Grid */}
        <div className="gap-3 grid grid-cols-1 sm:grid-cols-3 pt-3 border-t border-[#E2E8F0] text-xs">
          <div className="space-y-1 bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-md">
            <span className="block text-[10px] text-[#64748B] uppercase">USD Treasury Escrow (Antwerp / Dubai)</span>
            <div className="font-bold font-mono text-[#0F172A] text-base">$3,842,500.00</div>
            <span className="block text-[10px] text-emerald-700 font-bold">Unencumbered Operating Cash</span>
          </div>

          <div className="space-y-1 bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-md">
            <span className="block text-[10px] text-[#64748B] uppercase">NGN Operational Reserve (Lagos HQ)</span>
            <div className="font-bold font-mono text-[#0F172A] text-base">₦4,210,800,000.00</div>
            <span className="block text-[10px] text-[#64748B]">Across Zenith Bank & GTBank Plc</span>
          </div>

          <div className="space-y-1 bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-md">
            <span className="block text-[10px] text-[#64748B] uppercase">Customs SGD Duty Escrow Account</span>
            <div className="font-bold font-mono text-[#1D4ED8] text-base">₦340,500,000.00</div>
            <span className="block text-[10px] text-[#2563EB]">Dedicated Tin Can Port NCS Account</span>
          </div>
        </div>
      </Card>

      {/* Accounting Sub-Pages Navigation Tabs */}
      <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 bg-[#FFFFFF] shadow-xs p-1.5 border border-[#E2E8F0] rounded-md">
        <div className="flex flex-wrap gap-1">
          {[
            { id: "margins", label: "Landed Margins Ledger" },
            { id: "payables", label: `Accounts Payable (${payablesList.filter(p => p.status !== "Settled via Wire").length} Due)` },
            { id: "receivables", label: `Accounts Receivable (${receivablesList.filter(r => r.status !== "Verified & Reconciled to GL").length} Pending)` },
            { id: "tax", label: "FIRS VAT & Tax Compliance" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id as any)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                accountingTab === tab.id
                  ? "bg-[#2563EB] text-[#FFFFFF] shadow-xs"
                  : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="pr-2">
          {fiscalPeriodLocked ? (
            <span className="flex items-center gap-1 font-bold font-mono text-[10px] text-amber-700">
              <FiLock className="w-3.5 h-3.5 text-amber-600" />
              <span>FY 2026 Q4 LOCKED</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 font-bold font-mono text-[10px] text-emerald-700">
              <span className="bg-emerald-500 rounded-full w-1.5 h-1.5 animate-pulse" />
              <span>Fiscal Period Open</span>
            </span>
          )}
        </div>
      </div>

      {/* Render Selected Sub-Page */}
      {accountingTab === "margins" && (
        <LandedMarginsPage onAuditVoucher={onAuditVoucher} />
      )}

      {accountingTab === "payables" && (
        <PayablesPage payablesList={payablesList} onDisburse={onDisburse} />
      )}

      {accountingTab === "receivables" && (
        <ReceivablesPage receivablesList={receivablesList} onVerifyWire={onVerifyWire} />
      )}

      {accountingTab === "tax" && (
        <TaxCompliancePage showToast={showToast} />
      )}
    </div>
  );
};

