"use client";

import React, { useState } from "react";
import {
  FiPackage,
  FiPlus,
  FiCheck,
  FiClock,
  FiDollarSign,
  FiGlobe,
  FiCheckCircle,
  FiShield,
  FiAlertTriangle,
  FiSliders,
} from "react-icons/fi";
import { Button, Badge, Card, Modal, Input, Dropdown, MasterDropdown, KPICard, Table } from "@/components/ui";
import { TaxonomyManagerSection } from "../admin/MasterDataPage";

export interface PurchaseOrderItem {
  id: string;
  supplier: string;
  country: string;
  vehicle: string;
  vin: string;
  priceUSD: number;
  status: "Management Approved" | "Pending Executive Review" | "Acquisition In Progress" | "Paid & Staged for Shipping";
  date: string;
  deliveryPort: string;
  requiresRule5Approval: boolean;
  executiveApproved?: boolean;
}

export interface SupplierRecord {
  id: string;
  name: string;
  country: string;
  type: "International Dealer" | "Auction House" | "OEM Factory" | "Private Collector";
  activeOrders: number;
  rating: string;
  reliability: string;
  tier: "Tier 1 Preferred" | "Tier 2 Approved" | "Tier 3 Monitored";
  documentationAccuracy: string;
}

export interface AuctionBiddingLog {
  id: string;
  auctionHouse: string;
  vehicle: string;
  hammerPriceUSD: number;
  buyersPremiumUSD: number;
  inlandTowingUSD: number;
  exportTitleUSD: number;
  totalLandedFOB: number;
  date: string;
}

export const ProcurementDashboard: React.FC<{ showToast?: (msg: string) => void }> = ({ showToast }) => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderItem[]>([
    {
      id: "PO-2026-901",
      supplier: "Bavaria Auto Export GmbH",
      country: "Germany (Munich)",
      vehicle: "2024 Mercedes-Maybach S580 4MATIC",
      vin: "WDD2230631A987654",
      priceUSD: 142000,
      status: "Management Approved",
      date: "Nov 06, 2026",
      deliveryPort: "Antwerp, Belgium",
      requiresRule5Approval: true,
      executiveApproved: true,
    },
    {
      id: "PO-2026-902",
      supplier: "Manheim Palm Beach Luxury Auctions",
      country: "United States (Florida)",
      vehicle: "2024 Porsche 911 Turbo S (Guards Red)",
      vin: "WP0AD2A98RS192837",
      priceUSD: 198000,
      status: "Acquisition In Progress",
      date: "Nov 04, 2026",
      deliveryPort: "Jacksonville Port (JAXPORT), FL",
      requiresRule5Approval: true,
      executiveApproved: true,
    },
    {
      id: "PO-2026-903",
      supplier: "Al-Emirates Exotic Wholesale Ltd",
      country: "UAE (Dubai Auto Zone)",
      vehicle: "2024 Rolls-Royce Ghost Extended",
      vin: "SCA664S58NU882910",
      priceUSD: 285000,
      status: "Pending Executive Review",
      date: "Nov 02, 2026",
      deliveryPort: "Jebel Ali Port, Dubai",
      requiresRule5Approval: true,
      executiveApproved: false,
    },
    {
      id: "PO-2026-904",
      supplier: "Maranello European Direct",
      country: "Italy (Modena)",
      vehicle: "2024 Ferrari 296 GTB Assetto Fiorano",
      vin: "ZFF88RHT9P0293847",
      priceUSD: 245000,
      status: "Paid & Staged for Shipping",
      date: "Oct 28, 2026",
      deliveryPort: "Genoa Port, Italy",
      requiresRule5Approval: true,
      executiveApproved: true,
    },
  ]);

  const [activeTab, setActiveTab] = useState<"orders" | "suppliers" | "auctions" | "compare" | "taxonomies">("orders");

  // Suppliers with Quality Scorecards
  const suppliers: SupplierRecord[] = [
    {
      id: "SUP-01",
      name: "Bavaria Auto Export GmbH",
      country: "Germany",
      type: "International Dealer",
      activeOrders: 4,
      rating: "4.9 / 5.0",
      reliability: "99.2% On-Time Shipping",
      tier: "Tier 1 Preferred",
      documentationAccuracy: "100% Clean Titles",
    },
    {
      id: "SUP-02",
      name: "Manheim Palm Beach Luxury Auctions",
      country: "United States",
      type: "Auction House",
      activeOrders: 3,
      rating: "4.8 / 5.0",
      reliability: "98.5% On-Time Shipping",
      tier: "Tier 1 Preferred",
      documentationAccuracy: "Carfax Verified",
    },
    {
      id: "SUP-03",
      name: "Al-Emirates Exotic Wholesale Ltd",
      country: "UAE (Dubai)",
      type: "International Dealer",
      activeOrders: 2,
      rating: "4.7 / 5.0",
      reliability: "97.1% On-Time Shipping",
      tier: "Tier 2 Approved",
      documentationAccuracy: "Zero-Mileage Gulf Specs",
    },
  ];

  // International Auction Bidding & Fee Log
  const auctionLogs: AuctionBiddingLog[] = [
    {
      id: "AUC-8801",
      auctionHouse: "Manheim Palm Beach Luxury Auctions",
      vehicle: "2024 Porsche 911 Turbo S",
      hammerPriceUSD: 184000,
      buyersPremiumUSD: 9200,
      inlandTowingUSD: 1800,
      exportTitleUSD: 3000,
      totalLandedFOB: 198000,
      date: "2026-11-04",
    },
    {
      id: "AUC-8802",
      auctionHouse: "BCA European Remarketing (Antwerp)",
      vehicle: "2024 Mercedes-AMG G63 Magno",
      hammerPriceUSD: 215000,
      buyersPremiumUSD: 10750,
      inlandTowingUSD: 2200,
      exportTitleUSD: 2800,
      totalLandedFOB: 230750,
      date: "2026-10-30",
    },
  ];

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState("");
  const [newSupplier, setNewSupplier] = useState("Bavaria Auto Export GmbH");
  const [newCountry, setNewCountry] = useState("Germany (Munich)");
  const [newPrice, setNewPrice] = useState("165,000");
  const [newVin, setNewVin] = useState("");
  const [newPort, setNewPort] = useState("Antwerp, Belgium");

  // Multi-Supplier Quotation Compare State
  const [compareTargetModel, setCompareTargetModel] = useState("2024 Mercedes-Maybach S580");

  const notify = (msg: string) => {
    if (showToast) showToast(msg);
  };

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicle) return;

    const newId = `PO-2026-${String(purchaseOrders.length + 905).padStart(3, "0")}`;
    const priceNum = Number(newPrice.replace(/[^0-9]/g, "") || 250000000);
    const isHighValue = priceNum >= 150000000; // Business Rule 5: >=₦150M requires executive sign-off

    const newPO: PurchaseOrderItem = {
      id: newId,
      supplier: newSupplier,
      country: newCountry,
      vehicle: newVehicle,
      vin: newVin || `WDD${Date.now().toString().slice(-10)}`,
      priceUSD: Math.round(priceNum / 1550),
      status: isHighValue ? "Pending Executive Review" : "Management Approved",
      date: "Nov 08, 2026",
      deliveryPort: newPort,
      requiresRule5Approval: isHighValue,
      executiveApproved: !isHighValue,
    };

    setPurchaseOrders([newPO, ...purchaseOrders]);
    setIsCreateModalOpen(false);

    if (isHighValue) {
      notify(`PO ${newId} (₦${priceNum.toLocaleString()}) logged. Enforcing Business Rule 5: Dispatched to Executive Authorization Queue.`);
    } else {
      notify(`Purchase Order ${newId} approved and issued successfully.`);
    }

    setNewVehicle("");
    setNewVin("");
  };

  const handleAuthorizeExecutivePO = (poId: string) => {
    setPurchaseOrders((prev) =>
      prev.map((p) =>
        p.id === poId
          ? {
              ...p,
              status: "Management Approved",
              executiveApproved: true,
            }
          : p
      )
    );
    notify(`Business Rule 5 Authorization: PO ${poId} approved by Executive Directorate.`);
  };

  return (
    <div className="space-y-4">
      {/* 1. Header Strip */}
      <Card className="shadow-xs p-4 sm:p-5">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
                Procurement & Purchasing Dashboard
              </h3>
              <Badge variant="gold" size="sm">Rule 5 High-Value Approval Enforced</Badge>
            </div>
            <p className="text-[#64748B] text-xs">
              International luxury dealership fleet acquisitions, Manheim/BCA auction bidding fees, and vendor scoring.
            </p>
          </div>
        </div>
      </Card>

      {/* 2. Key Procurement Metrics */}
      <div className="gap-3 grid grid-cols-2 sm:grid-cols-4">
        <KPICard
          title="Total Acquisition Volume"
          value="₦53.0B"
          change="+14.2% YTD Volume"
          icon={<FiDollarSign className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Active Purchase Orders"
          value={`${purchaseOrders.length} Orders`}
          change="Germany, USA, UAE, Italy"
          icon={<FiPackage className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Pending Rule 5 Approvals"
          value={`${purchaseOrders.filter((p) => !p.executiveApproved).length} Orders`}
          change="Orders ≥₦150M threshold"
          icon={<FiClock className="w-5 h-5 text-[#D97706]" />}
        />
        <KPICard
          title="Registered Global Suppliers"
          value="18 Partners"
          change="100% Escrow Insured"
          icon={<FiGlobe className="w-5 h-5 text-[#2563EB]" />}
        />
      </div>

      {/* 3. Sub-Tab Switcher */}
      <Card className="shadow-xs p-3">
        <div className="flex flex-wrap gap-1">
          <Button
            variant={activeTab === "orders" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("orders")}
            className="text-xs font-bold"
          >
            Active Purchase Orders ({purchaseOrders.length})
          </Button>
          <Button
            variant={activeTab === "compare" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("compare")}
            className="text-xs font-bold"
          >
            Multi-Supplier Quotation Compare
          </Button>
          <Button
            variant={activeTab === "auctions" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("auctions")}
            className="text-xs font-bold"
          >
            Auction Bidding & Fee Log ({auctionLogs.length})
          </Button>
          <Button
            variant={activeTab === "suppliers" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("suppliers")}
            className="text-xs font-bold"
          >
            Supplier Quality Directory ({suppliers.length})
          </Button>
          <Button
            variant={activeTab === "taxonomies" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("taxonomies")}
            className="text-xs font-bold"
          >
            Sourcing Taxonomies & Dropdowns (4 Taxonomies)
          </Button>
        </div>
      </Card>

      {/* VIEW 1: Active Purchase Orders */}
      {activeTab === "orders" && (
        <Card className="space-y-4 p-4 sm:p-5 shadow-xs">
          <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-3">
            <div>
              <h4 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider">
                Purchase Orders Pipeline & Rule 5 Executive Sign-Off
              </h4>
              <p className="text-[11px] text-[#64748B]">
                Business Rule 5: Vehicle acquisitions &ge;₦150,000,000 require formal Executive Management sign-off.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              leftIcon={<FiPlus className="w-3.5 h-3.5" />}
            >
              + Create Purchase Order
            </Button>
          </div>

          <Table
            data={purchaseOrders}
            keyExtractor={(po) => po.id}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "id",
                header: "PO Number",
                sortable: true,
                render: (po) => <span className="font-mono font-bold text-[#2563EB] text-xs">{po.id}</span>,
              },
              {
                key: "vehicle",
                header: "Vehicle Specification",
                sortable: true,
                render: (po) => (
                  <div>
                    <div className="font-bold text-[#0F172A] text-xs">{po.vehicle}</div>
                    <div className="font-mono text-[10px] text-[#64748B]">{po.vin}</div>
                  </div>
                ),
              },
              {
                key: "supplier",
                header: "Supplier & Country",
                sortable: true,
                render: (po) => (
                  <div>
                    <div className="font-semibold text-[#0F172A] text-xs">{po.supplier}</div>
                    <div className="text-[10px] text-[#64748B] flex items-center gap-1">
                      <FiGlobe className="w-3 h-3 text-[#2563EB]" />
                      {po.country}
                    </div>
                  </div>
                ),
              },
              {
                key: "priceUSD",
                header: "Acquisition Cost (₦)",
                sortable: true,
                render: (po) => (
                  <div>
                    <span className="font-mono font-bold text-[#0F172A] text-xs">
                      ₦{(po.priceUSD * 1550).toLocaleString()}
                    </span>
                    {po.priceUSD * 1550 >= 150000000 && (
                      <span className="block text-[9px] font-bold text-amber-700">Rule 5 High-Value</span>
                    )}
                  </div>
                ),
              },
              {
                key: "deliveryPort",
                header: "Departure Port",
                sortable: true,
                render: (po) => <span className="text-[#475569] text-xs">{po.deliveryPort}</span>,
              },
              {
                key: "status",
                header: "Workflow Status",
                render: (po) => <Badge variant="gold" size="sm">{po.status}</Badge>,
              },
              {
                key: "action",
                header: "Rule 5 Executive Sign-Off",
                align: "right",
                render: (po) =>
                  !po.executiveApproved ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAuthorizeExecutivePO(po.id)}
                      className="px-2 py-0.5 text-[11px]"
                      leftIcon={<FiCheckCircle className="w-3 h-3" />}
                    >
                      Authorize PO
                    </Button>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                      Approved
                    </span>
                  ),
              },
            ]}
          />
        </Card>
      )}

      {/* VIEW 2: Multi-Supplier Quotation Compare */}
      {activeTab === "compare" && (
        <Card className="space-y-4 p-4 sm:p-5 shadow-xs">
          <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-2.5 border-b border-[#E2E8F0]">
            <div>
              <h4 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider">
                Multi-Supplier Quotation Comparison Matrix
              </h4>
              <p className="text-[11px] text-[#64748B]">
                Side-by-side analysis of FOB costs, transit lead times, and dealer ratings before PO locking.
              </p>
            </div>
            <div className="w-64">
              <Dropdown
                label="Compare Model"
                value={compareTargetModel}
                onChange={(val) => setCompareTargetModel(String(val))}
                options={[
                  { label: "2024 Mercedes-Maybach S580", value: "2024 Mercedes-Maybach S580" },
                  { label: "2024 Porsche 911 Turbo S", value: "2024 Porsche 911 Turbo S" },
                  { label: "2024 Rolls-Royce Ghost Extended", value: "2024 Rolls-Royce Ghost Extended" },
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#F8FAFC] border-2 border-[#2563EB] rounded-xl space-y-2 relative">
              <span className="top-2 right-2 absolute bg-[#2563EB] text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                Recommended
              </span>
              <span className="font-bold text-xs text-[#0F172A] block">Bavaria Auto Export GmbH</span>
              <span className="text-[#64748B] text-[11px] block">Munich, Germany (Antwerp Port)</span>
              <div className="pt-2 border-t border-[#E2E8F0] space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">FOB Price:</span>
                  <span className="font-mono font-bold text-[#0F172A]">₦220,100,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Export Paperwork:</span>
                  <span className="font-mono text-[#0F172A]">₦1,860,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Transit to Lagos:</span>
                  <span className="font-semibold text-emerald-700">18 Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Supplier Rating:</span>
                  <span className="font-bold text-[#2563EB]">4.9 / 5.0 (Tier 1)</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl space-y-2">
              <span className="font-bold text-xs text-[#0F172A] block">Manheim Palm Beach</span>
              <span className="text-[#64748B] text-[11px] block">Florida, USA (JAXPORT)</span>
              <div className="pt-2 border-t border-[#E2E8F0] space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">FOB Price:</span>
                  <span className="font-mono font-bold text-[#0F172A]">₦227,075,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Auction Buyer Fee:</span>
                  <span className="font-mono text-[#0F172A]">₦11,353,750</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Transit to Lagos:</span>
                  <span className="font-semibold text-[#475569]">24 Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Supplier Rating:</span>
                  <span className="font-bold text-[#2563EB]">4.8 / 5.0 (Tier 1)</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl space-y-2">
              <span className="font-bold text-xs text-[#0F172A] block">Al-Emirates Exotic Wholesale</span>
              <span className="text-[#64748B] text-[11px] block">Dubai, UAE (Jebel Ali)</span>
              <div className="pt-2 border-t border-[#E2E8F0] space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">FOB Price:</span>
                  <span className="font-mono font-bold text-[#0F172A]">₦223,200,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Inspection Fee:</span>
                  <span className="font-mono text-[#0F172A]">₦2,325,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Transit to Lagos:</span>
                  <span className="font-semibold text-[#475569]">28 Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Supplier Rating:</span>
                  <span className="font-bold text-[#2563EB]">4.7 / 5.0 (Tier 2)</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* VIEW 3: Auction Bidding & Fee Log */}
      {activeTab === "auctions" && (
        <Card className="space-y-4 p-4 sm:p-5 shadow-xs">
          <div>
            <h4 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider">
              International Auction Bidding & Ancillary Fee Log
            </h4>
            <p className="text-[11px] text-[#64748B]">
              Itemized audit of auction hammer prices, buyer premiums, inland haulage, and export title paperwork.
            </p>
          </div>

          <Table
            data={auctionLogs}
            keyExtractor={(log) => log.id}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "id",
                header: "Audit ID",
                sortable: true,
                render: (log) => <span className="font-mono font-bold text-[#2563EB] text-xs">{log.id}</span>,
              },
              {
                key: "auctionHouse",
                header: "Auction House & Vehicle",
                sortable: true,
                render: (log) => (
                  <div>
                    <span className="font-bold text-[#0F172A] text-xs">{log.vehicle}</span>
                    <span className="block text-[10px] text-[#64748B]">{log.auctionHouse}</span>
                  </div>
                ),
              },
              {
                key: "hammerPriceUSD",
                header: "Hammer Price (₦)",
                sortable: true,
                render: (log) => <span className="font-mono font-bold text-[#0F172A] text-xs">₦{(log.hammerPriceUSD * 1550).toLocaleString()}</span>,
              },
              {
                key: "buyersPremiumUSD",
                header: "Buyer's Premium (5%)",
                render: (log) => <span className="font-mono text-xs text-[#64748B]">₦{(log.buyersPremiumUSD * 1550).toLocaleString()}</span>,
              },
              {
                key: "inlandTowingUSD",
                header: "Inland Towing",
                render: (log) => <span className="font-mono text-xs text-[#64748B]">₦{(log.inlandTowingUSD * 1550).toLocaleString()}</span>,
              },
              {
                key: "exportTitleUSD",
                header: "Export Title Paperwork",
                render: (log) => <span className="font-mono text-xs text-[#64748B]">₦{(log.exportTitleUSD * 1550).toLocaleString()}</span>,
              },
              {
                key: "totalLandedFOB",
                header: "Total Landed FOB (₦)",
                sortable: true,
                render: (log) => (
                  <span className="font-mono font-bold text-[#1D4ED8] text-xs">
                    ₦{(log.totalLandedFOB * 1550).toLocaleString()}
                  </span>
                ),
              },
            ]}
          />
        </Card>
      )}

      {/* VIEW 4: Verified Global Supplier Directory */}
      {activeTab === "suppliers" && (
        <Card className="space-y-4 p-4 sm:p-5 shadow-xs">
          <div>
            <h4 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider">
              Verified Global Supplier Directory & Quality Scorecards
            </h4>
            <p className="text-[11px] text-[#64748B]">
              Auction houses, European franchise dealers, and direct factory liaisons.
            </p>
          </div>

          <Table
            data={suppliers}
            keyExtractor={(sup) => sup.id}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "id",
                header: "Supplier ID",
                sortable: true,
                render: (sup) => <span className="font-mono text-xs text-[#2563EB] font-bold">{sup.id}</span>,
              },
              {
                key: "name",
                header: "Supplier Entity",
                sortable: true,
                render: (sup) => <span className="font-bold text-xs text-[#0F172A]">{sup.name}</span>,
              },
              {
                key: "type",
                header: "Category",
                sortable: true,
                render: (sup) => <span className="text-xs text-[#475569]">{sup.type}</span>,
              },
              {
                key: "country",
                header: "Country / Hub",
                sortable: true,
                render: (sup) => (
                  <span className="text-xs text-[#475569] flex items-center gap-1">
                    <FiGlobe className="w-3 h-3 text-[#2563EB]" />
                    {sup.country}
                  </span>
                ),
              },
              {
                key: "tier",
                header: "Trust Tier",
                render: (sup) => <Badge variant="gold" size="sm">{sup.tier}</Badge>,
              },
              {
                key: "reliability",
                header: "Track Record",
                render: (sup) => <span className="text-emerald-600 font-semibold text-xs">{sup.reliability}</span>,
              },
              {
                key: "rating",
                header: "Audit Score",
                align: "right",
                render: (sup) => <span className="font-bold text-xs text-[#0F172A]">{sup.rating}</span>,
              },
            ]}
          />
        </Card>
      )}

      {/* VIEW 5: Sourcing Taxonomies & Dropdown Management */}
      {activeTab === "taxonomies" && (
        <TaxonomyManagerSection
          allowedCategories={["suppliers", "sourcing_markets", "makes", "categories"]}
          title="Procurement Sourcing Taxonomies & Supplier Dropdowns"
          description="Manage international verified suppliers, auction desks, sourcing origin markets, brands, and vehicle classes."
          headerBadge="Procurement Desk Authorized"
          showToast={showToast}
        />
      )}

      {/* Create Purchase Order Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        size="lg"
        title="Create International Vehicle Purchase Order"
        description="Initiate procurement. POs >=₦150,000,000 automatically require Rule 5 Executive Authorization."
      >
        <form onSubmit={handleCreatePO} className="space-y-4">
          <Input
            label="Vehicle Specification (Year, Make, Model, Trim)"
            placeholder="e.g. 2024 Mercedes-Maybach S580 Executive"
            value={newVehicle}
            onChange={(e) => setNewVehicle(e.target.value)}
            required
          />

          <div className="gap-3 grid grid-cols-1 sm:grid-cols-2">
            <Input
              label="VIN / Chassis Number (if allocated)"
              placeholder="WDD223..."
              value={newVin}
              onChange={(e) => setNewVin(e.target.value)}
            />
            <Input
              label="Agreed Purchase Price (₦ NGN)"
              placeholder="250,000,000"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              required
              helperText="Rule 5: >=₦150,000,000 triggers Executive Sign-Off."
            />
          </div>

          <div className="gap-3 grid grid-cols-1 sm:grid-cols-2">
            <MasterDropdown
              category="suppliers"
              label="Select Verified Supplier"
              value={newSupplier}
              onChange={(val) => setNewSupplier(String(val))}
              required
            />

            <MasterDropdown
              category="ports"
              label="Port of Departure / Loading"
              value={newPort}
              onChange={(val) => setNewPort(String(val))}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" leftIcon={<FiCheck className="w-3.5 h-3.5" />}>
              Submit Purchase Order
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
