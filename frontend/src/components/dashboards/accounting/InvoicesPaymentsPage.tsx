"use client";

import React, { useState } from "react";
import {
  FiFileText,
  FiPlus,
  FiCheck,
  FiDownload,
  FiClock,
  FiDollarSign,
  FiCheckCircle,
} from "react-icons/fi";
import { Button, Badge, Card, Modal, Input, Dropdown, KPICard, Table } from "@/components/ui";
import { accountingApi } from "@/lib/api";

export interface InvoiceRecord {
  id: string;
  client: string;
  vehicle: string;
  invoiceType: "Commercial Sales Invoice" | "Proforma Quotation" | "Duty Receipt" | "Workshop Service Invoice";
  amountUSD: number;
  amountNGN: number;
  status: "Settled & Verified" | "Awaiting Bank Wire" | "Deposit Paid (Balance Due)";
  dueDate: string;
  wireReference: string;
}

export const InvoicesPaymentsPage: React.FC<{ showToast?: (msg: string) => void }> = ({ showToast }) => {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([
    {
      id: "INV-2026-8801",
      client: "Chief Alexander Vance",
      vehicle: "2024 Mercedes-Maybach S580",
      invoiceType: "Commercial Sales Invoice",
      amountUSD: 165000,
      amountNGN: 247500000,
      status: "Settled & Verified",
      dueDate: "2026-11-15",
      wireReference: "FBN-ESCROW-9921",
    },
    {
      id: "INV-2026-8802",
      client: "Senator Bello Turaki",
      vehicle: "2024 Porsche 911 Turbo S",
      invoiceType: "Proforma Quotation",
      amountUSD: 215000,
      amountNGN: 322500000,
      status: "Deposit Paid (Balance Due)",
      dueDate: "2026-11-20",
      wireReference: "ZENITH-WIRE-4412",
    },
    {
      id: "INV-2026-8803",
      client: "Danladi Oil & Maritime Ltd",
      vehicle: "2023 Range Rover SV Long Wheelbase",
      invoiceType: "Commercial Sales Invoice",
      amountUSD: 185000,
      amountNGN: 277500000,
      status: "Awaiting Bank Wire",
      dueDate: "2026-11-25",
      wireReference: "GTCO-WIRE-3301",
    },
    {
      id: "INV-2026-8804",
      client: "Diplomatic Protocol Services",
      vehicle: "Tin Can SGD Duty Clearance Release",
      invoiceType: "Duty Receipt",
      amountUSD: 24500,
      amountNGN: 36750000,
      status: "Settled & Verified",
      dueDate: "2026-11-05",
      wireReference: "NCS-CUSTOMS-5520",
    },
  ]);

  // Fetch live invoices from MongoDB API
  React.useEffect(() => {
    let isMounted = true;
    accountingApi.getAll().then((res) => {
      if (res.success && res.data?.invoices && Array.isArray(res.data.invoices) && res.data.invoices.length > 0) {
        if (isMounted) {
          const apiInvoices: InvoiceRecord[] = res.data.invoices.map((inv: any) => ({
            id: inv.invoiceNumber || inv._id,
            client: inv.clientName,
            vehicle: inv.vehicleDetails || inv.vehicleTitle || "Luxury Vehicle",
            invoiceType: (inv.invoiceType || "Commercial Sales Invoice") as any,
            amountUSD: Math.round((inv.totalAmountNGN || 250000000) / 1550),
            amountNGN: inv.totalAmountNGN || 250000000,
            status: inv.status || "Awaiting Bank Wire",
            dueDate: inv.dueDate ? new Date(inv.dueDate).toISOString().split("T")[0] : "2026-11-30",
            wireReference: inv.wireReference || `REF-${Date.now().toString().slice(-4)}`,
          }));
          setInvoices(apiInvoices);
        }
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [newClient, setNewClient] = useState("");
  const [newVehicle, setNewVehicle] = useState("");
  const [newAmountNGN, setNewAmountNGN] = useState("255,750,000");
  const [newType, setNewType] = useState<"Commercial Sales Invoice" | "Proforma Quotation" | "Duty Receipt" | "Workshop Service Invoice">("Commercial Sales Invoice");
  const [newDueDate, setNewDueDate] = useState("2026-11-30");

  const handleIssueInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient || !newVehicle) return;

    const priceNum = Number(newAmountNGN.replace(/[^0-9]/g, "") || 255750000);
    const newId = `INV-2026-${String(invoices.length + 8805).padStart(4, "0")}`;

    const newInv: InvoiceRecord = {
      id: newId,
      client: newClient,
      vehicle: newVehicle,
      invoiceType: newType,
      amountUSD: Math.round(priceNum / 1550),
      amountNGN: priceNum,
      status: "Awaiting Bank Wire",
      dueDate: newDueDate,
      wireReference: `PENDING-${Date.now().toString().slice(-4)}`,
    };

    // Save to Database
    accountingApi.create({
      invoiceNumber: newId,
      clientName: newClient,
      vehicleDetails: newVehicle,
      invoiceType: newType,
      totalAmountNGN: priceNum,
      status: "Awaiting Bank Wire",
      dueDate: newDueDate,
      wireReference: newInv.wireReference,
    }).catch(() => {});

    setInvoices([newInv, ...invoices]);
    setIsIssueModalOpen(false);
    showToast?.(`Commercial invoice ${newId} issued for ${newClient} (₦${priceNum.toLocaleString()})!`);
    setNewClient("");
    setNewVehicle("");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-3 bg-[#FFFFFF] shadow-xs p-4 sm:p-5 border border-[#E2E8F0] rounded-md">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
              Invoices & Payment Receipts
            </h3>
            <Badge variant="gold" size="sm">Section 10 & 21 ERP Specification</Badge>
          </div>
          <p className="text-[#64748B] text-xs">
            Manage commercial invoices, proforma quotations, delivery receipts, and verified escrow payments.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsIssueModalOpen(true)}
          leftIcon={<FiPlus className="w-3.5 h-3.5" />}
        >
          + Issue Commercial Invoice
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="gap-3 grid grid-cols-2 sm:grid-cols-4">
        <KPICard
          title="Total Invoiced YTD"
          value="₦74.7B"
          change="148 Invoices Issued"
          icon={<FiDollarSign className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Settled Wires in Escrow"
          value="₦71.0B"
          change="Verified to General Ledger"
          icon={<FiCheckCircle className="w-5 h-5 text-emerald-600" />}
        />
        <KPICard
          title="Pending Customer Balances"
          value="₦3.72B"
          change="18 Customer Accounts"
          icon={<FiClock className="w-5 h-5 text-[#D97706]" />}
        />
        <KPICard
          title="Average Settlement Time"
          value="1.8 Days"
          change="Swift / RTGS Cleared"
          icon={<FiFileText className="w-5 h-5 text-[#2563EB]" />}
        />
      </div>

      {/* Invoices List */}
      <Card className="space-y-3 p-4 sm:p-5 shadow-xs">
        <Table
          data={invoices}
          keyExtractor={(inv) => inv.id}
          pageSize={15}
          showSerialNumber={true}
          columns={[
            {
              key: "id",
              header: "Invoice Number",
              sortable: true,
              render: (inv) => (
                <span className="font-mono font-bold text-[#2563EB] whitespace-nowrap">{inv.id}</span>
              ),
            },
            {
              key: "client",
              header: "Client & Vehicle",
              sortable: true,
              render: (inv) => (
                <div>
                  <div className="font-bold text-[#0F172A]">{inv.client}</div>
                  <div className="text-[10px] text-[#64748B]">{inv.vehicle}</div>
                </div>
              ),
            },
            {
              key: "invoiceType",
              header: "Classification",
              sortable: true,
              render: (inv) => <span className="text-[#475569]">{inv.invoiceType}</span>,
            },
            {
              key: "amountNGN",
              header: "Amount (₦ NGN)",
              sortable: true,
              render: (inv) => (
                <div className="font-mono font-bold text-[#0F172A]">₦{inv.amountNGN.toLocaleString()}</div>
              ),
            },
            {
              key: "dueDate",
              header: "Due Date",
              sortable: true,
              render: (inv) => <span className="text-[#475569] whitespace-nowrap">{inv.dueDate}</span>,
            },
            {
              key: "wireReference",
              header: "Wire Ref",
              render: (inv) => (
                <span className="font-mono text-[10px] text-[#2563EB]">{inv.wireReference}</span>
              ),
            },
            {
              key: "status",
              header: "Status",
              align: "right",
              render: (inv) => (
                <Badge
                  variant={
                    inv.status === "Settled & Verified"
                      ? "gold"
                      : inv.status === "Deposit Paid (Balance Due)"
                      ? "charcoal"
                      : "warmGold"
                  }
                  size="sm"
                >
                  {inv.status}
                </Badge>
              ),
            },
          ]}
        />
      </Card>

      {/* Issue Commercial Invoice Modal */}
      <Modal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        size="lg"
        title="Issue Commercial Sales Invoice / Proforma"
        description="Generate an official dealership invoice with bank escrow details for customer wire payment."
      >
        <form onSubmit={handleIssueInvoice} className="space-y-4">
          <Input
            label="Client Legal Name / Corporate Entity"
            placeholder="e.g. Chief Alexander Vance"
            value={newClient}
            onChange={(e) => setNewClient(e.target.value)}
            required
          />

          <div className="gap-3 grid grid-cols-1 sm:grid-cols-2">
            <Input
              label="Vehicle Allocation / Service Scope"
              placeholder="e.g. 2024 Mercedes-Maybach S580 (STK-2026-001)"
              value={newVehicle}
              onChange={(e) => setNewVehicle(e.target.value)}
              required
            />
            <Input
              label="Invoice Total Amount (₦ NGN)"
              placeholder="255,750,000"
              value={newAmountNGN}
              onChange={(e) => setNewAmountNGN(e.target.value)}
              required
            />
          </div>

          <div className="gap-3 grid grid-cols-1 sm:grid-cols-2">
            <Dropdown
              label="Invoice Classification"
              value={newType}
              onChange={(val) => setNewType(val as any)}
              options={[
                { label: "Commercial Sales Invoice", value: "Commercial Sales Invoice" },
                { label: "Proforma Quotation", value: "Proforma Quotation" },
                { label: "Duty Receipt", value: "Duty Receipt" },
                { label: "Workshop Service Invoice", value: "Workshop Service Invoice" },
              ]}
            />

            <Input
              label="Payment Due Date"
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsIssueModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" leftIcon={<FiCheck className="w-3.5 h-3.5" />}>
              Issue & Dispatch Invoice
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

