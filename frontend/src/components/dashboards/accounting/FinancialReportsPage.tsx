"use client";

import React, { useState } from "react";
import {
  FiFileText,
  FiDownload,
  FiTrendingUp,
  FiDollarSign,
  FiShield,
  FiCheckCircle,
  FiLink,
  FiRefreshCw,
} from "react-icons/fi";
import { Button, Badge, Card, KPICard, Table } from "@/components/ui";

export interface BankAccountBalance {
  id: string;
  bankName: string;
  accountNumber: string;
  currency: "NGN";
  balance: number;
  unreconciledWires: number;
  status: "Reconciled Daily" | "Pending Matching";
}

export interface CashFlowLine {
  activity: "Operating Activities" | "Investing Activities" | "Financing Activities";
  item: string;
  amountUSD: number;
  flowType: "Inflow" | "Outflow";
}

export interface PaymentBindingTransaction {
  id: string;
  client: string;
  amountUSD: number;
  orderId: string; // Business Rule 7: Bound Sales Order or Invoice ID
  bankReference: string;
  allocatedDate: string;
  bindingStatus: "Strictly Bound to Order" | "Unallocated Floating Warning";
}

export interface FinancialAuditEntry {
  id: string;
  timestamp: string;
  hash: string;
  accounts: string;
  scope: string;
  debitUSD: number;
  creditUSD: number;
  userId: string;
  userRole: string;
  ipAddress: string;
  status: "Immutable Posted" | "Reversed via Offset";
}

export const FinancialReportsPage: React.FC<{ showToast?: (msg: string) => void }> = ({ showToast }) => {
  const [activeReport, setActiveReport] = useState<"pnl" | "cashflow" | "banks" | "binding" | "audit">("pnl");
  const [currency] = useState<"NGN">("NGN");

  const exchangeRate = 1550;
  const formatVal = (usd: number) => {
    return `₦${Math.round(usd * exchangeRate).toLocaleString()}`;
  };

  const notify = (msg: string) => {
    if (showToast) showToast(msg);
  };

  // Statement of Cash Flows Data
  const cashFlowLines: CashFlowLine[] = [
    { activity: "Operating Activities", item: "Cash Inflows from Vehicle Sales & Customer Wires", amountUSD: 46200000, flowType: "Inflow" },
    { activity: "Operating Activities", item: "Payments to Suppliers for Inventory Fleet Purchases", amountUSD: -32800000, flowType: "Outflow" },
    { activity: "Operating Activities", item: "Customs Duty (SGD) & Port Terminal Clearances", amountUSD: -3900000, flowType: "Outflow" },
    { activity: "Operating Activities", item: "Staff Salaries, Commissions & Operational SG&A", amountUSD: -3320000, flowType: "Outflow" },
    { activity: "Investing Activities", item: "Acquisition of Lekki Workshop Diagnostic Lifts & Tools", amountUSD: -280000, flowType: "Outflow" },
    { activity: "Investing Activities", item: "Victoria Island Showroom Digital Display Upgrade", amountUSD: -120000, flowType: "Outflow" },
    { activity: "Financing Activities", item: "Commercial Bank Working Capital Facility Repayment", amountUSD: -850000, flowType: "Outflow" },
    { activity: "Financing Activities", item: "Shareholder Capital Inflow for Fleet Expansion", amountUSD: 2000000, flowType: "Inflow" },
  ];

  // Multi-Bank Accounts Directory
  const bankAccounts: BankAccountBalance[] = [
    { id: "BNK-01", bankName: "Zenith Bank Plc (Lagos Corporate HQ)", accountNumber: "1018829102", currency: "NGN", balance: 2450000000, unreconciledWires: 2, status: "Reconciled Daily" },
    { id: "BNK-02", bankName: "Guaranty Trust Bank (GTBank) Plc", accountNumber: "0229918234", currency: "NGN", balance: 1760800000, unreconciledWires: 1, status: "Reconciled Daily" },
    { id: "BNK-03", bankName: "First Bank of Nigeria (Customs SGD Escrow)", accountNumber: "2019928172", currency: "NGN", balance: 340500000, unreconciledWires: 0, status: "Reconciled Daily" },
    { id: "BNK-04", bankName: "First Bank of Nigeria (Corporate Treasury Escrow)", accountNumber: "8829-1029-44", currency: "NGN", balance: 3797500000, unreconciledWires: 1, status: "Reconciled Daily" },
    { id: "BNK-05", bankName: "Zenith Bank Plc (Trade Settlement Facility)", accountNumber: "9910-4402-19", currency: "NGN", balance: 2158375000, unreconciledWires: 0, status: "Reconciled Daily" },
  ];

  // Business Rule 7: Transaction-to-Payment Strict Binding Registry
  const boundTransactions: PaymentBindingTransaction[] = [
    { id: "PMT-8801", client: "Alhaji Bello & Sons Ltd", amountUSD: 100000, orderId: "ORD-9912 (Maybach S580)", bankReference: "ZEN-WIRE-99182", allocatedDate: "2026-11-06", bindingStatus: "Strictly Bound to Order" },
    { id: "PMT-8802", client: "Dr. K. Somoye", amountUSD: 120000, orderId: "ORD-9910 (Porsche 911 Turbo S)", bankReference: "GTB-TXN-44029", allocatedDate: "2026-11-04", bindingStatus: "Strictly Bound to Order" },
    { id: "PMT-8803", client: "Senator Godswill O.", amountUSD: 240000, orderId: "ORD-9908 (Mercedes-AMG G63)", bankReference: "JPM-WIRE-10293", allocatedDate: "2026-11-02", bindingStatus: "Strictly Bound to Order" },
    { id: "PMT-8804", client: "Apex Horizon Ltd", amountUSD: 50000, orderId: "INV-2026-044 (Advance Sourcing)", bankReference: "ZEN-WIRE-33019", allocatedDate: "2026-10-31", bindingStatus: "Strictly Bound to Order" },
  ];

  // Business Rule 10: Immutable Financial Audit Trail
  const [auditEntries, setAuditEntries] = useState<FinancialAuditEntry[]>([
    {
      id: "GL-2026-9901",
      timestamp: "2026-11-08 14:22:18 WAT",
      hash: "SHA256:7B8F9A2290CD1A42",
      accounts: "Dr: 1010-Zenith Bank Operations / Cr: 4100-Vehicle Sales Revenue",
      scope: "Customer Wire Settlement for 2024 Maybach S580 (ORD-9912)",
      debitUSD: 165000,
      creditUSD: 165000,
      userId: "USR-004",
      userRole: "Chief Accountant (Babatunde A.)",
      ipAddress: "102.89.44.18",
      status: "Immutable Posted",
    },
    {
      id: "GL-2026-9902",
      timestamp: "2026-11-07 11:05:42 WAT",
      hash: "SHA256:4C2D1E8839FA1091",
      accounts: "Dr: 5200-Customs SGD Duty Expense / Cr: 1030-First Bank Escrow",
      scope: "Nigeria Customs SGD Duty Clearance Assessment (SGD-2026-77810)",
      debitUSD: 51200,
      creditUSD: 51200,
      userId: "USR-004",
      userRole: "Chief Accountant",
      ipAddress: "102.89.44.18",
      status: "Immutable Posted",
    },
    {
      id: "GL-2026-9903",
      timestamp: "2026-11-06 16:48:30 WAT",
      hash: "SHA256:9A1F3E104928BA12",
      accounts: "Dr: 5100-Ocean Freight Ro-Ro / Cr: 2010-Grimaldi Deep Sea AP",
      scope: "Freight Transit Invoice (B/L: GRI-TIN-88912)",
      debitUSD: 34800,
      creditUSD: 34800,
      userId: "USR-003",
      userRole: "Procurement Director (M. Vance)",
      ipAddress: "197.210.64.9",
      status: "Immutable Posted",
    },
    {
      id: "GL-2026-9904",
      timestamp: "2026-11-05 09:12:04 WAT",
      hash: "SHA256:3D9A2C771890EF55",
      accounts: "Dr: 1500-Vehicle Recon Landed Cost / Cr: 1010-Zenith Bank Operations",
      scope: "Detailing 9H Ceramic Coating (Work Order #RC-8812)",
      debitUSD: 1450,
      creditUSD: 1450,
      userId: "USR-007",
      userRole: "Workshop Supervisor",
      ipAddress: "102.89.44.20",
      status: "Immutable Posted",
    },
  ]);

  const netCashFlowUSD = cashFlowLines.reduce((acc, c) => acc + c.amountUSD, 0);

  return (
    <div className="space-y-4">
      {/* 1. Header Strip */}
      <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-3 bg-[#FFFFFF] shadow-xs p-4 sm:p-5 border border-[#E2E8F0] rounded-md">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
              Financial Reports, Audited Statements & Treasury
            </h3>
            <Badge variant="gold" size="sm">Rule 7 & Rule 10 Strict Compliance</Badge>
          </div>
          <p className="text-[#64748B] text-xs">
            Consolidated Profit & Loss, Cash Flow Statement, Multi-Bank Reconciliation, Payment-to-Order Binding, and Immutable Audit Trail.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 font-mono text-xs font-bold text-[#1D4ED8] bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg">
            ₦ NGN (Official Currency)
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => notify("Audited FY 2026 Financial Statements exported as certified PDF!")}
            leftIcon={<FiDownload className="w-3.5 h-3.5 text-[#2563EB]" />}
          >
            Export Audited PDF
          </Button>
        </div>
      </div>

      {/* 2. Sub-Tabs Bar */}
      <Card className="shadow-xs p-3">
        <div className="flex flex-wrap gap-1">
          <Button
            variant={activeReport === "pnl" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveReport("pnl")}
            className="text-xs font-bold"
          >
            Audited Income Statement (P&L)
          </Button>
          <Button
            variant={activeReport === "cashflow" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveReport("cashflow")}
            className="text-xs font-bold"
          >
            Statement of Cash Flows (IFRS)
          </Button>
          <Button
            variant={activeReport === "banks" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveReport("banks")}
            className="text-xs font-bold"
          >
            Multi-Bank Reconciliation ({bankAccounts.length} Accounts)
          </Button>
          <Button
            variant={activeReport === "binding" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveReport("binding")}
            className="text-xs font-bold"
          >
            Payment-to-Order Binding (Rule 7)
          </Button>
          <Button
            variant={activeReport === "audit" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveReport("audit")}
            className="text-xs font-bold"
          >
            Immutable Audit Trail (Rule 10)
          </Button>
        </div>
      </Card>

      {/* VIEW 1: Audited Income Statement (P&L) */}
      {activeReport === "pnl" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div className="flex justify-between items-center pb-2.5 border-b border-[#E2E8F0]">
            <div>
              <h4 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider">
                Audited Income Statement (P&L Breakdown)
              </h4>
              <p className="text-[#64748B] text-[11px]">FY 2026 Year-to-Date Financial Statement</p>
            </div>
            <Badge variant="gold" size="sm">Audited Clean</Badge>
          </div>

          <Table
            data={[
              { item: "Gross Vehicle Sales Revenue", category: "Operating Revenue", amount: formatVal(48200000), pct: "100.0%", type: "Revenue" },
              { item: "Vehicle Acquisition Costs (Local & Imports)", category: "Cost of Goods Sold (COGS)", amount: `(${formatVal(34220000)})`, pct: "71.0%", type: "Direct Cost" },
              { item: "Freight, Port Handling & Customs SGD Duty", category: "Cost of Goods Sold (COGS)", amount: `(${formatVal(4100000)})`, pct: "8.5%", type: "Direct Cost" },
              { item: "Workshop Inspection, Servicing & Recon Prep", category: "Cost of Goods Sold (COGS)", amount: `(${formatVal(960000)})`, pct: "2.0%", type: "Direct Cost" },
              { item: "Gross Dealership Trading Profit", category: "Trading Gross Margin", amount: formatVal(8920000), pct: "18.5%", type: "Gross Margin" },
              { item: "Operating Expenses (Salaries, Rent, Utilities)", category: "SG&A Operational Overhead", amount: `(${formatVal(3510000)})`, pct: "7.3%", type: "Operating Expense" },
              { item: "Net Dealership Operating Profit Before Tax", category: "EBITDA Operating Income", amount: formatVal(5410000), pct: "11.2%", type: "Net Profit" },
            ]}
            keyExtractor={(row) => row.item}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "item",
                header: "Accounting Line Item",
                sortable: true,
                render: (row) => (
                  <div>
                    <span className="font-bold text-[#0F172A] text-xs">{row.item}</span>
                    <span className="block text-[10px] text-[#64748B]">{row.category}</span>
                  </div>
                ),
              },
              {
                key: "type",
                header: "Schedule Nature",
                sortable: true,
                render: (row) => <Badge variant="gold" size="sm">{row.type}</Badge>,
              },
              {
                key: "pct",
                header: "% of Gross Revenue",
                sortable: true,
                render: (row) => <span className="font-mono text-xs text-[#475569]">{row.pct}</span>,
              },
              {
                key: "amount",
                header: "Current FY 2026 Amount",
                align: "right",
                render: (row) => (
                  <span
                    className={`font-mono font-bold text-xs ${
                      row.type === "Direct Cost" || row.type === "Operating Expense"
                        ? "text-rose-600"
                        : "text-emerald-700"
                    }`}
                  >
                    {row.amount}
                  </span>
                ),
              },
            ]}
          />
        </Card>
      )}

      {/* VIEW 2: Statement of Cash Flows */}
      {activeReport === "cashflow" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-2.5 border-b border-[#E2E8F0]">
            <div>
              <h4 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider">
                Audited Statement of Cash Flows (IFRS Compliance)
              </h4>
              <p className="text-[11px] text-[#64748B]">
                Operating, Investing & Financing Cash Movements
              </p>
            </div>
            <span className="font-mono font-bold text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              Net Cash Flow: +{formatVal(netCashFlowUSD)}
            </span>
          </div>

          <Table
            data={cashFlowLines}
            keyExtractor={(cf) => cf.item}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "activity",
                header: "Cash Flow Category",
                sortable: true,
                render: (cf) => <span className="font-bold text-xs text-[#0F172A]">{cf.activity}</span>,
              },
              {
                key: "item",
                header: "Transaction Description",
                sortable: true,
                render: (cf) => <span className="text-xs text-[#475569]">{cf.item}</span>,
              },
              {
                key: "flowType",
                header: "Movement",
                render: (cf) => (
                  <Badge variant={cf.flowType === "Inflow" ? "gold" : "charcoal"} size="sm">
                    {cf.flowType}
                  </Badge>
                ),
              },
              {
                key: "amountUSD",
                header: "Cash Flow Amount",
                align: "right",
                render: (cf) => (
                  <span
                    className={`font-mono font-bold text-xs ${
                      cf.amountUSD < 0 ? "text-rose-600" : "text-emerald-700"
                    }`}
                  >
                    {cf.amountUSD < 0 ? `(${formatVal(Math.abs(cf.amountUSD))})` : `+${formatVal(cf.amountUSD)}`}
                  </span>
                ),
              },
            ]}
          />
        </Card>
      )}

      {/* VIEW 3: Multi-Bank Reconciliation */}
      {activeReport === "banks" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-2.5 border-b border-[#E2E8F0]">
            <div>
              <h4 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider">
                Multi-Bank Commercial Accounts & Liquidity Position
              </h4>
              <p className="text-[11px] text-[#64748B]">
                Daily bank reconciliation across Zenith, GTBank, First Bank, and offshore USD accounts.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => notify("Direct API bank feeds refreshed and matched against General Ledger.")}
              leftIcon={<FiRefreshCw className="w-3.5 h-3.5" />}
            >
              Refresh Bank Feeds
            </Button>
          </div>

          <Table
            data={bankAccounts}
            keyExtractor={(b) => b.id}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "bankName",
                header: "Banking Institution & Node",
                sortable: true,
                render: (b) => (
                  <div>
                    <span className="font-bold text-xs text-[#0F172A] block">{b.bankName}</span>
                    <span className="font-mono text-[10px] text-[#64748B]">Acct: {b.accountNumber}</span>
                  </div>
                ),
              },
              {
                key: "currency",
                header: "Currency",
                render: (b) => <Badge variant="gold" size="sm">{b.currency}</Badge>,
              },
              {
                key: "balance",
                header: "Audited Ledger Balance",
                sortable: true,
                render: (b) => (
                  <span className="font-mono font-bold text-xs text-[#0F172A]">
                    ₦{b.balance.toLocaleString()}
                  </span>
                ),
              },
              {
                key: "unreconciledWires",
                header: "Pending Wire Matching",
                render: (b) => (
                  <span className={`font-mono text-xs ${b.unreconciledWires > 0 ? "text-amber-600 font-bold" : "text-[#64748B]"}`}>
                    {b.unreconciledWires} Pending Wire{b.unreconciledWires !== 1 ? "s" : ""}
                  </span>
                ),
              },
              {
                key: "status",
                header: "Reconciliation Status",
                render: (b) => <Badge variant="gold" size="sm">{b.status}</Badge>,
              },
            ]}
          />
        </Card>
      )}

      {/* VIEW 4: Strict Payment-to-Transaction Binding (Business Rule 7) */}
      {activeReport === "binding" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-2.5 border-b border-[#E2E8F0]">
            <div>
              <div className="flex items-center gap-2">
                <FiLink className="w-4 h-4 text-[#2563EB]" />
                <h4 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider">
                  Payment-to-Transaction Strict Binding (Business Rule 7)
                </h4>
              </div>
              <p className="text-[11px] text-[#64748B]">
                Enforcement that every customer wire receipt is strictly linked to a valid Sales Order ID or Invoice ID. Floating unallocated deposits are prohibited.
              </p>
            </div>
            <Badge variant="gold" size="sm">Rule 7 Active</Badge>
          </div>

          <Table
            data={boundTransactions}
            keyExtractor={(bt) => bt.id}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "id",
                header: "Receipt Voucher ID",
                sortable: true,
                render: (bt) => <span className="font-mono font-bold text-[#2563EB] text-xs">{bt.id}</span>,
              },
              {
                key: "client",
                header: "Customer Account",
                sortable: true,
                render: (bt) => <span className="font-bold text-xs text-[#0F172A]">{bt.client}</span>,
              },
              {
                key: "amountUSD",
                header: "Payment Value",
                sortable: true,
                render: (bt) => <span className="font-mono font-bold text-xs text-emerald-700">₦{Math.round(bt.amountUSD * 1550).toLocaleString()}</span>,
              },
              {
                key: "orderId",
                header: "Bound Order ID (Rule 7)",
                sortable: true,
                render: (bt) => (
                  <span className="font-mono text-xs font-bold text-[#1D4ED8] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {bt.orderId}
                  </span>
                ),
              },
              {
                key: "bankReference",
                header: "Bank Wire Narration",
                render: (bt) => <span className="font-mono text-xs text-[#64748B]">{bt.bankReference}</span>,
              },
              {
                key: "allocatedDate",
                header: "Allocation Date",
                sortable: true,
                render: (bt) => <span className="font-mono text-xs text-[#475569]">{bt.allocatedDate}</span>,
              },
              {
                key: "bindingStatus",
                header: "Binding Audit",
                render: (bt) => <Badge variant="gold" size="sm">{bt.bindingStatus}</Badge>,
              },
            ]}
          />
        </Card>
      )}

      {/* VIEW 5: Immutable Financial Audit Trail (Business Rule 10) */}
      {activeReport === "audit" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-2.5 border-b border-[#E2E8F0]">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-[#EFF6FF] text-[#2563EB]">
                  <FiShield className="w-4 h-4" />
                </span>
                <h4 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider">
                  Immutable Financial Audit Trail & General Ledger Ledger (Rule 10)
                </h4>
                <Badge variant="gold" size="sm">WORM Compliant</Badge>
              </div>
              <p className="text-[11px] text-[#64748B]">
                Tamper-evident cryptographic ledger of all GL journal entries, wire approvals, and adjustments. Deletion strictly prohibited; corrections require offsetting reversals.
              </p>
            </div>
            <Badge variant="charcoal" size="sm">
              SHA-256 Hash Chained
            </Badge>
          </div>

          <Table
            data={auditEntries}
            keyExtractor={(entry) => entry.id}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "id",
                header: "GL Journal Ref",
                sortable: true,
                render: (e) => (
                  <div>
                    <span className="font-mono font-bold text-[#2563EB] text-xs block">{e.id}</span>
                    <span className="font-mono text-[9px] text-[#64748B]">{e.hash}</span>
                  </div>
                ),
              },
              {
                key: "timestamp",
                header: "Timestamp & IP Node",
                sortable: true,
                render: (e) => (
                  <div>
                    <span className="font-mono text-xs text-[#0F172A] block">{e.timestamp}</span>
                    <span className="font-mono text-[10px] text-[#64748B]">IP: {e.ipAddress}</span>
                  </div>
                ),
              },
              {
                key: "accounts",
                header: "Double-Entry Accounts & Scope",
                render: (e) => (
                  <div>
                    <span className="font-semibold text-xs text-[#0F172A] block">{e.accounts}</span>
                    <span className="text-[11px] text-[#64748B]">{e.scope}</span>
                  </div>
                ),
              },
              {
                key: "debitUSD",
                header: "Debit / Credit",
                sortable: true,
                render: (e) => (
                  <div className="font-mono text-xs font-bold text-[#0F172A]">
                    Dr: {formatVal(e.debitUSD)} / Cr: {formatVal(e.creditUSD)}
                  </div>
                ),
              },
              {
                key: "userRole",
                header: "Authorized Personnel",
                render: (e) => (
                  <div>
                    <span className="text-xs font-medium text-[#0F172A] block">{e.userRole}</span>
                    <span className="font-mono text-[10px] text-[#64748B]">{e.userId}</span>
                  </div>
                ),
              },
              {
                key: "status",
                header: "WORM Status",
                render: (e) => (
                  <Badge variant={e.status === "Immutable Posted" ? "gold" : "charcoal"} size="sm">
                    {e.status}
                  </Badge>
                ),
              },
              {
                key: "action",
                header: "Offsetting Action",
                align: "right",
                render: (e) =>
                  e.status === "Immutable Posted" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-[10px]"
                      onClick={() => {
                        setAuditEntries((prev) =>
                          prev.map((item) =>
                            item.id === e.id ? { ...item, status: "Reversed via Offset" } : item
                          )
                        );
                        notify(`Offsetting reversal entry generated for ${e.id}. Permanent audit trail updated.`);
                      }}
                    >
                      Post Reversal
                    </Button>
                  ) : (
                    <span className="text-[11px] font-mono text-[#64748B]">Reversed</span>
                  ),
              },
            ]}
          />
        </Card>
      )}
    </div>
  );
};
