"use client";

import React, { useState } from "react";
import {
  FiEye,
  FiCheckSquare,
  FiCheckCircle,
  FiDownload,
  FiPlus,
  FiCheck,
  FiAlertTriangle,
  FiClock,
  FiUserCheck,
  FiPercent,
  FiDollarSign,
  FiFileText,
  FiShield,
} from "react-icons/fi";
import { Button, Badge, Card, Modal, Input, Dropdown, MasterDropdown, Table, KPICard } from "@/components/ui";

export interface OrderItem {
  id: string;
  client: string;
  car: string;
  amount: string;
  status: string;
  stage: string;
  rep: string;
  vin?: string;
  deposit?: string;
  balance?: string;
  deliveryDate?: string;
  discountPct?: number;
  discountApproved?: boolean;
  reservationExpiresInHours?: number;
  deliveryChecklist?: {
    fullPaymentVerified: boolean;
    titleTransferIssued: boolean;
    customsDutyAttached: boolean;
    customerSignedPdi: boolean;
  };
}

export interface SalesOrdersPageProps {
  orders: OrderItem[];
  onPreviewOrder: (order: OrderItem) => void;
  onInspectOrder: (order: OrderItem) => void;
  onDownloadPdf: (order: OrderItem) => void;
}

interface SalesRepQuota {
  name: string;
  quota: string;
  closed: string;
  attainment: string;
  units: number;
  commission: string;
  status: string;
}

interface LostDealItem {
  id: string;
  client: string;
  vehicle: string;
  lostValue: string;
  reason: "Price/Budget" | "Loan Declined" | "Vehicle Sold to Another" | "Competitor" | "Changed Mind";
  rep: string;
  date: string;
}

export const SalesOrdersPage: React.FC<SalesOrdersPageProps> = ({
  orders: initialOrders,
  onPreviewOrder,
  onInspectOrder,
  onDownloadPdf,
}) => {
  const [orders, setOrders] = useState<OrderItem[]>(() =>
    initialOrders.map((o) => ({
      ...o,
      discountPct: o.discountPct ?? 2.5,
      discountApproved: o.discountApproved ?? true,
      reservationExpiresInHours: o.reservationExpiresInHours ?? 36,
      deliveryChecklist: o.deliveryChecklist ?? {
        fullPaymentVerified: o.status === "Delivery Inspection" || o.status === "Delivered",
        titleTransferIssued: o.status === "Delivery Inspection" || o.status === "Delivered",
        customsDutyAttached: true,
        customerSignedPdi: o.status === "Delivered",
      },
    }))
  );

  const [activeSubTab, setActiveSubTab] = useState<"orders" | "quotations" | "reps" | "lost">("orders");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Order Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newClient, setNewClient] = useState("");
  const [newCar, setNewCar] = useState("2024 Mercedes-Maybach S580");
  const [newAmount, setNewAmount] = useState("255,750,000");
  const [newDeposit, setNewDeposit] = useState("77,500,000");
  const [newDeliveryDate, setNewDeliveryDate] = useState("2026-11-20");
  const [newRep, setNewRep] = useState("Emeka O. (VIP Sales)");
  const [newHub, setNewHub] = useState("VI");
  const [newDiscountPct, setNewDiscountPct] = useState("2.5");

  // Handover Checklist Modal State (Business Rule 8)
  const [selectedOrderForHandover, setSelectedOrderForHandover] = useState<OrderItem | null>(null);
  const [checklistPayment, setChecklistPayment] = useState(false);
  const [checklistTitle, setChecklistTitle] = useState(false);
  const [checklistCustoms, setChecklistCustoms] = useState(false);
  const [checklistPdi, setChecklistPdi] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Sales Representatives Performance & Commission Quotas
  const salesRepLedger: SalesRepQuota[] = [
    { name: "Emeka O. (VIP Sales)", quota: "₦1,240,000,000", closed: "₦1,495,750,000", attainment: "120.6%", units: 5, commission: "₦29,915,000", status: "Approved" },
    { name: "Aisha M. (Diplomatic Desk)", quota: "₦1,007,500,000", closed: "₦1,116,000,000", attainment: "110.7%", units: 3, commission: "₦22,320,000", status: "Approved" },
    { name: "Babajide K. (Pre-Owned / Trade-In)", quota: "₦775,000,000", closed: "₦682,000,000", attainment: "88.0%", units: 4, commission: "₦13,640,000", status: "Pending Audit" },
    { name: "Ngozi E. (Corporate Fleet)", quota: "₦1,860,000,000", closed: "₦2,092,500,000", attainment: "112.5%", units: 7, commission: "₦41,850,000", status: "Approved" },
  ];

  // Lost Deals Registry
  const lostDeals: LostDealItem[] = [
    { id: "LST-101", client: "Federal Ministry of Transport", vehicle: "Toyota Land Cruiser 300 (x4)", lostValue: "₦899,000,000", reason: "Price/Budget", rep: "Ngozi E.", date: "2026-11-04" },
    { id: "LST-102", client: "Alhaji Musa Danjuma", vehicle: "2024 Rolls-Royce Ghost Extended", lostValue: "₦751,750,000", reason: "Competitor", rep: "Emeka O.", date: "2026-10-28" },
    { id: "LST-103", client: "Dr. Femi Adeleke", vehicle: "2023 Porsche Panamera GTS", lostValue: "₦220,100,000", reason: "Loan Declined", rep: "Babajide K.", date: "2026-10-22" },
    { id: "LST-104", client: "Apex Horizon Oil & Gas", vehicle: "Mercedes-Benz G63 AMG", lostValue: "₦457,250,000", reason: "Vehicle Sold to Another", rep: "Aisha M.", date: "2026-10-18" },
  ];

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient) return;

    const discountVal = parseFloat(newDiscountPct) || 0;
    const isExceeding = discountVal > 3.0; // Rule 4: Discount > 3% requires Executive Authorization

    const newId = `ORD-2026-${String(orders.length + 1).padStart(3, "0")}`;
    const newEntry: OrderItem = {
      id: newId,
      client: newClient,
      car: newCar,
      amount: `₦${Number(newAmount.replace(/[^0-9]/g, "") || 0).toLocaleString()}`,
      deposit: `₦${Number(newDeposit.replace(/[^0-9]/g, "") || 0).toLocaleString()}`,
      balance: `₦${(Number(newAmount.replace(/[^0-9]/g, "") || 0) - Number(newDeposit.replace(/[^0-9]/g, "") || 0)).toLocaleString()}`,
      status: isExceeding ? "Discount Awaiting Approval" : "Wire Deposit Verified",
      stage: isExceeding ? "Executive Authorization Required (Rule 4)" : "Contract Signed & Delivery Prep",
      rep: newRep,
      deliveryDate: newDeliveryDate,
      discountPct: discountVal,
      discountApproved: !isExceeding,
      reservationExpiresInHours: 48, // Rule 3: 48-Hour Reservation Lockout
      deliveryChecklist: {
        fullPaymentVerified: false,
        titleTransferIssued: false,
        customsDutyAttached: true,
        customerSignedPdi: false,
      },
    };

    setOrders([newEntry, ...orders]);
    setIsCreateOpen(false);
    setNewClient("");

    if (isExceeding) {
      showToast(`Order ${newId} logged with ${discountVal}% discount. Dispatched to Executive Approvals Queue (Rule 4 limit >3%).`);
    } else {
      showToast(`Sales Order ${newId} issued successfully! 48-hour reservation lock initiated.`);
    }
  };

  const handleOpenHandoverChecklist = (order: OrderItem) => {
    setSelectedOrderForHandover(order);
    setChecklistPayment(order.deliveryChecklist?.fullPaymentVerified ?? false);
    setChecklistTitle(order.deliveryChecklist?.titleTransferIssued ?? false);
    setChecklistCustoms(order.deliveryChecklist?.customsDutyAttached ?? true);
    setChecklistPdi(order.deliveryChecklist?.customerSignedPdi ?? false);
  };

  const handleConfirmDeliveryHandover = () => {
    if (!selectedOrderForHandover) return;

    // Rule 8: Mandatory Handover Gatekeeper - All 4 checkboxes required
    if (!checklistPayment || !checklistTitle || !checklistCustoms || !checklistPdi) {
      showToast("Policy Violation (Rule 8): Delivery Handover cannot be signed off until all 4 statutory gates are verified.");
      return;
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === selectedOrderForHandover.id
          ? {
              ...o,
              status: "Delivered",
              stage: "Official Handover Completed",
              deliveryChecklist: {
                fullPaymentVerified: true,
                titleTransferIssued: true,
                customsDutyAttached: true,
                customerSignedPdi: true,
              },
            }
          : o
      )
    );
    showToast(`Order ${selectedOrderForHandover.id} certified and transitioned to 'Delivered' status.`);
    setSelectedOrderForHandover(null);
  };

  return (
    <div className="space-y-4">
      {toastMessage && (
        <div className="flex items-center gap-2 bg-[#EFF6FF] border border-[#2563EB] text-[#1E40AF] px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs animate-in fade-in duration-200">
          <FiCheck className="w-4 h-4 text-[#2563EB] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sales Sub-Views Selector */}
      <Card className="shadow-xs p-3">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2">
          <div className="flex flex-wrap gap-1">
            <Button
              variant={activeSubTab === "orders" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setActiveSubTab("orders")}
              className="text-xs font-bold"
            >
              Sales Orders & Delivery Handover ({orders.length})
            </Button>
            <Button
              variant={activeSubTab === "reps" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setActiveSubTab("reps")}
              className="text-xs font-bold"
            >
              Rep Quotas & Commissions ({salesRepLedger.length})
            </Button>
            <Button
              variant={activeSubTab === "lost" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setActiveSubTab("lost")}
              className="text-xs font-bold"
            >
              Lost Deals Registry ({lostDeals.length})
            </Button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            leftIcon={<FiPlus className="w-3.5 h-3.5" />}
          >
            + Create Sales Order
          </Button>
        </div>
      </Card>

      {/* VIEW 1: Sales Orders Table */}
      {activeSubTab === "orders" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div>
            <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
              Active Luxury Sales Orders Pipeline
            </h3>
            <p className="text-[#64748B] text-[11px]">
              Enforcing Business Rule 3 (48h Reservation Expiration) & Business Rule 8 (Mandatory Handover Gatekeeper)
            </p>
          </div>

          <Table
            data={orders}
            keyExtractor={(order) => order.id}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "id",
                header: "Order ID",
                sortable: true,
                render: (order) => <span className="font-mono font-bold text-[#2563EB] text-xs">{order.id}</span>,
              },
              {
                key: "client",
                header: "Client & Organization",
                sortable: true,
                render: (order) => <span className="font-semibold text-[#0F172A] text-xs">{order.client}</span>,
              },
              {
                key: "car",
                header: "Vehicle Acquired",
                sortable: true,
                render: (order) => <span className="text-[#475569] text-xs">{order.car}</span>,
              },
              {
                key: "amount",
                header: "Contract Total",
                sortable: true,
                render: (order) => (
                  <div>
                    <span className="font-mono font-bold text-[#1D4ED8] text-xs">{order.amount}</span>
                    <span className="block text-[10px] text-[#64748B]">Discount: {order.discountPct}%</span>
                  </div>
                ),
              },
              {
                key: "reservationExpiresInHours",
                header: "Hold Expiry (Rule 3)",
                render: (order) => (
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                    <FiClock className="w-2.5 h-2.5" />
                    {order.reservationExpiresInHours}h Remaining
                  </span>
                ),
              },
              {
                key: "status",
                header: "Workflow Stage",
                sortable: true,
                render: (order) => (
                  <div>
                    <Badge variant="gold" size="sm" dot>
                      {order.status}
                    </Badge>
                    <span className="block mt-0.5 text-[#64748B] text-[10px]">{order.stage}</span>
                  </div>
                ),
              },
              {
                key: "rep",
                header: "Assigned Rep",
                sortable: true,
                render: (order) => <span className="font-medium text-[#0F172A] text-xs">{order.rep}</span>,
              },
              {
                key: "action",
                header: "Handover & Actions",
                align: "right",
                render: (order) => (
                  <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenHandoverChecklist(order)}
                      className="px-2 py-0.5 text-[11px]"
                      leftIcon={<FiShield className="w-3 h-3 text-[#2563EB]" />}
                    >
                      Handover Gate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onInspectOrder(order)}
                      className="px-2 py-0.5 text-[11px]"
                      leftIcon={<FiCheckSquare className="w-3 h-3 text-[#2563EB]" />}
                    >
                      Audit
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onDownloadPdf(order)}
                      className="px-2 py-0.5 text-[11px]"
                      leftIcon={<FiDownload className="w-3 h-3 text-[#FFFFFF]" />}
                    >
                      PDF
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        </Card>
      )}

      {/* VIEW 2: Sales Representatives Quota & Commission Engine */}
      {activeSubTab === "reps" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div>
            <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
              Sales Representative Quotas, Attainment & Commission Engine
            </h3>
            <p className="text-[#64748B] text-[11px]">
              Commission accrued at 10% of gross vehicle margin, subject to managerial sign-off
            </p>
          </div>

          <Table
            data={salesRepLedger}
            keyExtractor={(rep) => rep.name}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "name",
                header: "Sales Representative",
                sortable: true,
                render: (rep) => <span className="font-bold text-[#0F172A] text-xs">{rep.name}</span>,
              },
              {
                key: "quota",
                header: "Monthly Quota",
                sortable: true,
                render: (rep) => <span className="font-mono text-[#64748B] text-xs">{rep.quota}</span>,
              },
              {
                key: "closed",
                header: "Closed Volume",
                sortable: true,
                render: (rep) => <span className="font-mono font-bold text-[#0F172A] text-xs">{rep.closed}</span>,
              },
              {
                key: "attainment",
                header: "Target Attainment",
                sortable: true,
                render: (rep) => (
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-xs">
                    {rep.attainment}
                  </span>
                ),
              },
              {
                key: "units",
                header: "Units Handed Over",
                sortable: true,
                render: (rep) => <span className="font-bold text-xs">{rep.units} Cars</span>,
              },
              {
                key: "commission",
                header: "Accrued Commission",
                sortable: true,
                render: (rep) => <span className="font-mono font-bold text-[#1D4ED8] text-xs">{rep.commission}</span>,
              },
              {
                key: "status",
                header: "Audit Status",
                render: (rep) => <Badge variant="gold" size="sm">{rep.status}</Badge>,
              },
            ]}
          />
        </Card>
      )}

      {/* VIEW 3: Lost Deals Registry */}
      {activeSubTab === "lost" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div>
            <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
              Lost Deals & Cancellation Registry
            </h3>
            <p className="text-[#64748B] text-[11px]">
              Categorical post-mortem analysis for pricing refinement and lead recovery
            </p>
          </div>

          <Table
            data={lostDeals}
            keyExtractor={(deal) => deal.id}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "id",
                header: "Lost Deal ID",
                sortable: true,
                render: (deal) => <span className="font-mono font-bold text-[#2563EB] text-xs">{deal.id}</span>,
              },
              {
                key: "client",
                header: "Client Account",
                sortable: true,
                render: (deal) => <span className="font-semibold text-[#0F172A] text-xs">{deal.client}</span>,
              },
              {
                key: "vehicle",
                header: "Target Model",
                sortable: true,
                render: (deal) => <span className="text-[#475569] text-xs">{deal.vehicle}</span>,
              },
              {
                key: "lostValue",
                header: "Deal Value",
                sortable: true,
                render: (deal) => <span className="font-mono font-bold text-rose-700 text-xs">{deal.lostValue}</span>,
              },
              {
                key: "reason",
                header: "Standard Reason",
                sortable: true,
                render: (deal) => (
                  <span className="font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-xs">
                    {deal.reason}
                  </span>
                ),
              },
              {
                key: "rep",
                header: "Assigned Rep",
                render: (deal) => <span className="text-xs text-[#0F172A]">{deal.rep}</span>,
              },
              {
                key: "date",
                header: "Date Logged",
                render: (deal) => <span className="font-mono text-xs text-[#64748B]">{deal.date}</span>,
              },
            ]}
          />
        </Card>
      )}

      {/* Modal: Create Sales Order with Rule 4 Discount Ceiling */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Generate New Luxury Sales Order & Proforma"
        description="Enforces authorized representative discount ceilings (Rule 4: max 3% before executive approval)."
        size="lg"
      >
        <form onSubmit={handleCreateOrder} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Client Name & Organization"
              placeholder="e.g. Chief Dr. Somoye / Zenith Partners"
              value={newClient}
              onChange={(e) => setNewClient(e.target.value)}
              required
            />
            <Dropdown
              label="Vehicle Acquired (Stock)"
              options={[
                { label: "2024 Mercedes-Maybach S580 (STK-001)", value: "2024 Mercedes-Maybach S580" },
                { label: "2024 Porsche 911 Turbo S (STK-002)", value: "2024 Porsche 911 Turbo S" },
                { label: "2023 Range Rover Autobiography (STK-003)", value: "2023 Range Rover Autobiography" },
                { label: "2024 Mercedes-AMG G63 Magno (STK-007)", value: "2024 Mercedes-AMG G63 Magno" },
              ]}
              value={newCar}
              onChange={(val) => setNewCar(String(val))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Agreed Contract Price (₦ NGN)"
              type="text"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              required
            />
            <Input
              label="Initial Wire Deposit (₦ NGN)"
              type="text"
              value={newDeposit}
              onChange={(e) => setNewDeposit(e.target.value)}
              required
            />
            <Input
              label="Requested Discount (%)"
              type="number"
              step="0.1"
              value={newDiscountPct}
              onChange={(e) => setNewDiscountPct(e.target.value)}
              required
              helperText="Rule 4 limit: >3% requires Executive Authorization."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Assigned Sales Representative"
              value={newRep}
              onChange={(e) => setNewRep(e.target.value)}
              required
            />
            <MasterDropdown
              category="hubs"
              label="Delivery / Handover Hub"
              value={newHub}
              onChange={(val) => setNewHub(String(val))}
              required
            />
            <Input
              label="Target Handover Date"
              type="date"
              value={newDeliveryDate}
              onChange={(e) => setNewDeliveryDate(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" leftIcon={<FiCheck />}>
              Issue Sales Order & Proforma
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Mandatory Delivery Handover Gatekeeper (Business Rule 8) */}
      {selectedOrderForHandover && (
        <Modal
          isOpen={!!selectedOrderForHandover}
          onClose={() => setSelectedOrderForHandover(null)}
          title={`Delivery Handover Gatekeeper: ${selectedOrderForHandover.id}`}
          description={`Customer: ${selectedOrderForHandover.client} • Vehicle: ${selectedOrderForHandover.car}`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
              <FiShield className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Business Rule 8 Statutory Gatekeeper:</strong>
                <p className="mt-0.5">
                  A vehicle cannot transition to &apos;Delivered&apos; status until 100% wire settlement is reconciled, official Title Transfer/CMR is registered, Customs Duty (SGD) certificate is attached, and the client signs the physical handover checklist.
                </p>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              <label className="flex items-center gap-3 p-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={checklistPayment}
                  onChange={(e) => setChecklistPayment(e.target.checked)}
                  className="w-4 h-4 text-[#2563EB] rounded focus:ring-[#2563EB]"
                />
                <div className="text-xs">
                  <span className="font-bold text-[#0F172A]">1. 100% Financial Settlement Reconciled</span>
                  <p className="text-[#64748B] text-[11px]">Bank wire deposit & balance cleared to General Ledger with zero outstanding debt.</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={checklistTitle}
                  onChange={(e) => setChecklistTitle(e.target.checked)}
                  className="w-4 h-4 text-[#2563EB] rounded focus:ring-[#2563EB]"
                />
                <div className="text-xs">
                  <span className="font-bold text-[#0F172A]">2. Title Transfer & Police CMR Issued</span>
                  <p className="text-[#64748B] text-[11px]">Ownership transfer attested by Legal Registrar and registered in Central Motor Registry.</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={checklistCustoms}
                  onChange={(e) => setChecklistCustoms(e.target.checked)}
                  className="w-4 h-4 text-[#2563EB] rounded focus:ring-[#2563EB]"
                />
                <div className="text-xs">
                  <span className="font-bold text-[#0F172A]">3. Nigerian Customs Service SGD Duty Certified</span>
                  <p className="text-[#64748B] text-[11px]">Tin Can / Port terminal Single Goods Declaration with authenticated payment assessment receipt.</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={checklistPdi}
                  onChange={(e) => setChecklistPdi(e.target.checked)}
                  className="w-4 h-4 text-[#2563EB] rounded focus:ring-[#2563EB]"
                />
                <div className="text-xs">
                  <span className="font-bold text-[#0F172A]">4. Customer 150-Point Pre-Delivery Handover Sheet Signed</span>
                  <p className="text-[#64748B] text-[11px]">Keys, manuals, spare tire, toolkits, and dual remotes accepted by the buyer or accredited proxy.</p>
                </div>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
              <Button variant="outline" size="sm" onClick={() => setSelectedOrderForHandover(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmDeliveryHandover}
                leftIcon={<FiCheckCircle className="w-3.5 h-3.5" />}
              >
                Sign Off & Authorize Handover
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
