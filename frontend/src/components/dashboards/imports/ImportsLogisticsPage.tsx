"use client";

import React, { useState } from "react";
import {
  FiPlus,
  FiCheck,
  FiTruck,
  FiAnchor,
  FiClock,
  FiShield,
  FiDollarSign,
  FiLayers,
  FiCheckCircle,
  FiAlertTriangle,
  FiCpu,
  FiTrendingUp,
  FiNavigation,
  FiActivity,
} from "react-icons/fi";
import { Button, Badge, Card, Modal, Input, Dropdown, Table, KPICard } from "@/components/ui";

export interface LandedCostBreakdown {
  fobUSD: number;
  oceanFreightUSD: number;
  marineInsuranceUSD: number;
  customsDutySGD_USD: number;
  portHandlingUSD: number;
  demurrageUSD: number;
  inlandHaulageUSD: number;
  totalLandedUSD: number;
}

export interface ShipmentItem {
  ref: string;
  car: string;
  vin: string;
  vessel: string;
  route: string;
  container: string;
  bol: string;
  eta: string;
  sgdStatus: string;
  stagePct: string;
  clearingAgent: string;
  freeTimeDays: number;
  clearanceStep: string;
  costBreakdown: LandedCostBreakdown;
  rolledUpToInventory: boolean;
  associatedVins: string[];
}

export interface ImportsLogisticsPageProps {
  showToast: (msg: string) => void;
}

export const ImportsLogisticsPage: React.FC<ImportsLogisticsPageProps> = ({ showToast }) => {
  const [shipments, setShipments] = useState<ShipmentItem[]>([
    {
      ref: "IMP-2026-991",
      car: "2024 Mercedes-Maybach S580 (Dual-Tone)",
      vin: "WDD2230631A987654",
      vessel: "Grande Lagos (Grimaldi Lines)",
      route: "Antwerp, Belgium &rarr; Tin Can Island Terminal (TCIT), Lagos",
      container: "MSCU-9918234 (40ft High Cube)",
      bol: "MEDUANT992812",
      eta: "In 4 Days (Nov 12, 2026)",
      sgdStatus: "SGD Assessed & Paid (35% Duty Cleared)",
      stagePct: "80%",
      clearingAgent: "Maritime Express Logistics Ltd",
      freeTimeDays: 5,
      clearanceStep: "Step 4: Physical Examination Cleared",
      costBreakdown: {
        fobUSD: 118000,
        oceanFreightUSD: 3800,
        marineInsuranceUSD: 1200,
        customsDutySGD_USD: 9500,
        portHandlingUSD: 1500,
        demurrageUSD: 0,
        inlandHaulageUSD: 1000,
        totalLandedUSD: 135000,
      },
      rolledUpToInventory: true,
      associatedVins: ["WDD2230631A987654", "WBA11200928371928"],
    },
    {
      ref: "IMP-2026-988",
      car: "2024 Porsche 911 Turbo S (Guards Red)",
      vin: "WP0AD2A98RS192837",
      vessel: "Grande Senegal (Grimaldi Deep Sea)",
      route: "Hamburg, Germany &rarr; Port of Lagos TCIT",
      container: "GRIU-4402198 (20ft Standard)",
      bol: "GRIHAM881920",
      eta: "In 7 Days (Nov 15, 2026)",
      sgdStatus: "Assessment Generated &bull; Escrow Wire Dispatched",
      stagePct: "65%",
      clearingAgent: "Crown Seal Bonded Terminal",
      freeTimeDays: 7,
      clearanceStep: "Step 3: Bank Duty Payment Wire",
      costBreakdown: {
        fobUSD: 185000,
        oceanFreightUSD: 4200,
        marineInsuranceUSD: 1800,
        customsDutySGD_USD: 15500,
        portHandlingUSD: 2000,
        demurrageUSD: 0,
        inlandHaulageUSD: 1500,
        totalLandedUSD: 210000,
      },
      rolledUpToInventory: true,
      associatedVins: ["WP0AD2A98RS192837"],
    },
    {
      ref: "IMP-2026-982",
      car: "2023 Range Rover Autobiography LWB",
      vin: "SALWR2V48PA102938",
      vessel: "MSC Maria Laura V.92",
      route: "Southampton, UK &rarr; Tin Can Island Terminal",
      container: "MSCU-8810239 (40ft High Cube)",
      bol: "MSCSOU771029",
      eta: "Discharged (Tin Can Port Bay #4)",
      sgdStatus: "NCS Final Physical Examination Passed",
      stagePct: "95%",
      clearingAgent: "Maritime Express Logistics Ltd",
      freeTimeDays: 2,
      clearanceStep: "Step 5: Gate-Out / Yard Delivery",
      costBreakdown: {
        fobUSD: 125000,
        oceanFreightUSD: 3500,
        marineInsuranceUSD: 1300,
        customsDutySGD_USD: 10200,
        portHandlingUSD: 1600,
        demurrageUSD: 0,
        inlandHaulageUSD: 1400,
        totalLandedUSD: 143000,
      },
      rolledUpToInventory: false,
      associatedVins: ["SALWR2V48PA102938", "JTMHY01J7M4012345"],
    },
  ]);

  const [activeTab, setActiveTab] = useState<"shipments" | "containers" | "rollup" | "predictive">("shipments");
  const [selectedCostShipment, setSelectedCostShipment] = useState<ShipmentItem | null>(null);

  // Phase 3: Supplier & Shipping Predictive Analytics (Section 24)
  const predictiveRoutes = [
    {
      route: "Port of Antwerp (Belgium) &rarr; Tin Can Island (TCIT)",
      carrier: "Grimaldi Deep Sea Ro-Ro",
      predictedDays: "21.4 Days",
      confidence: "96.4%",
      congestionQueue: "1.8 Days Queue (Low)",
      demurrageRisk: "Minimal (Free-Time Safe)",
      hedgingAdvisory: "Euro forward contract locked at 1 EUR = 1.08 USD",
      status: "Optimal Route",
    },
    {
      route: "Port of Hamburg (Germany) &rarr; Apapa Port Terminal",
      carrier: "Hapag-Lloyd / MSC",
      predictedDays: "26.2 Days",
      confidence: "88.5%",
      congestionQueue: "3.5 Days Queue (Moderate)",
      demurrageRisk: "Moderate (Pre-Clearance Req)",
      hedgingAdvisory: "Bunker fuel adjustment factor +4.2%",
      status: "Monitored",
    },
    {
      route: "Dubai Jebel Ali (UAE) &rarr; Onne Port (Rivers State)",
      carrier: "Maersk West Africa Express",
      predictedDays: "28.5 Days",
      confidence: "94.0%",
      congestionQueue: "1.1 Days Queue (Minimal)",
      demurrageRisk: "Zero Risk (Swift Berthing)",
      hedgingAdvisory: "AED/USD pegged currency stability",
      status: "Highly Recommended",
    },
    {
      route: "Port of Jacksonville (USA) &rarr; Tin Can Island",
      carrier: "Grimaldi Lines Atlantic",
      predictedDays: "34.0 Days",
      confidence: "84.2%",
      congestionQueue: "4.2 Days Queue (Elevated)",
      demurrageRisk: "Elevated (Winter Atlantic Storms)",
      hedgingAdvisory: "USD direct wire; no conversion volatility",
      status: "Weather Caution",
    },
    {
      route: "Yokohama / Nagoya (Japan) &rarr; Lagos TCIT",
      carrier: "Ocean Network Express (ONE)",
      predictedDays: "38.5 Days",
      confidence: "91.0%",
      congestionQueue: "2.4 Days Queue (Normal)",
      demurrageRisk: "Low (Extended 14-day Free-Time)",
      hedgingAdvisory: "JPY favorable export arbitrage index",
      status: "Cost-Effective",
    },
  ];

  // New Shipment Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refCode, setRefCode] = useState("");
  const [car, setCar] = useState("2024 Mercedes-Maybach S580");
  const [vessel, setVessel] = useState("Grande Togo (Grimaldi Lines)");
  const [container, setContainer] = useState("");
  const [origin, setOrigin] = useState("Antwerp, Belgium");
  const [eta, setEta] = useState("In 10 Days");
  const [fobPrice, setFobPrice] = useState("120,000");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const fobNum = Number(fobPrice.replace(/[^0-9]/g, "") || 120000);
    const freight = 4000;
    const insurance = 1200;
    const duty = Math.round(fobNum * 0.08); // 8% avg effective customs
    const port = 1500;
    const inland = 1000;
    const total = fobNum + freight + insurance + duty + port + inland;

    const newEntry: ShipmentItem = {
      ref: refCode || `IMP-2026-${String(shipments.length + 993)}`,
      car,
      vin: `WDD${Date.now().toString().slice(-10)}`,
      vessel,
      route: `${origin} &rarr; Tin Can Island Terminal, Lagos`,
      container: container || `MSCU-${Math.floor(1000000 + Math.random() * 9000000)}`,
      bol: `BOL-${Math.floor(100000 + Math.random() * 900000)}`,
      eta,
      sgdStatus: "Pre-Arrival Assessment Logged",
      stagePct: "35%",
      clearingAgent: "Maritime Express Logistics Ltd",
      freeTimeDays: 7,
      clearanceStep: "Step 1: Document Arrival & PAAR",
      costBreakdown: {
        fobUSD: fobNum,
        oceanFreightUSD: freight,
        marineInsuranceUSD: insurance,
        customsDutySGD_USD: duty,
        portHandlingUSD: port,
        demurrageUSD: 0,
        inlandHaulageUSD: inland,
        totalLandedUSD: total,
      },
      rolledUpToInventory: false,
      associatedVins: [`WDD${Date.now().toString().slice(-10)}`],
    };

    setShipments([newEntry, ...shipments]);
    setIsModalOpen(false);
    showToast(`Ocean consignment logged for ${vessel}. Landed cost calculated: $${total.toLocaleString()}.`);
    setRefCode("");
    setContainer("");
  };

  const handleExecuteLandedCostRollup = (item: ShipmentItem) => {
    setShipments((prev) =>
      prev.map((s) => (s.ref === item.ref ? { ...s, rolledUpToInventory: true } : s))
    );
    showToast(`Landed cost ($${item.costBreakdown.totalLandedUSD.toLocaleString()}) rolled up directly to Master Inventory for ${item.car}.`);
    setSelectedCostShipment(null);
  };

  return (
    <div className="space-y-4">
      {/* 1. Header Card */}
      <Card className="shadow-xs p-4 sm:p-5">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
                Importation & Logistics Console
              </h3>
              <Badge variant="gold" size="sm">PDF Section 7 Specification</Badge>
            </div>
            <p className="text-[#64748B] text-xs">
              Ocean consignments, Grimaldi/MSC sea transit, port demurrage countdown, and automated landed cost rollups.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<FiPlus className="w-3.5 h-3.5" />}
          >
            + Log Inbound Shipment
          </Button>
        </div>
      </Card>

      {/* 2. Sub-Tabs Bar */}
      <Card className="shadow-xs p-3">
        <div className="flex flex-wrap gap-1">
          <Button
            variant={activeTab === "shipments" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("shipments")}
            className="text-xs font-bold"
          >
            Live Consignments & Demurrage ({shipments.length})
          </Button>
          <Button
            variant={activeTab === "containers" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("containers")}
            className="text-xs font-bold"
          >
            Multi-VIN Container Manifests
          </Button>
          <Button
            variant={activeTab === "rollup" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("rollup")}
            className="text-xs font-bold"
          >
            Landed Cost Rollup Ledger
          </Button>
          <Button
            variant={activeTab === "predictive" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("predictive")}
            className="text-xs font-bold"
          >
            Predictive Shipping & Port Telemetry ({predictiveRoutes.length})
          </Button>
        </div>
      </Card>

      {/* VIEW 1: Live Consignments & Port Demurrage */}
      {activeTab === "shipments" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div>
            <h4 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider">
              Live Ocean Consignments & Port Customs Stages
            </h4>
            <p className="text-[11px] text-[#64748B]">
              Real-time Tin Can Island berth tracking and demurrage free-time monitoring.
            </p>
          </div>

          <Table
            data={shipments}
            keyExtractor={(item) => item.ref}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "ref",
                header: "Manifest Ref",
                sortable: true,
                render: (item) => <span className="font-mono font-bold text-[#2563EB] text-xs">{item.ref}</span>,
              },
              {
                key: "car",
                header: "Vehicle & Vessel",
                sortable: true,
                render: (item) => (
                  <div>
                    <span className="font-bold text-[#0F172A] text-xs">{item.car}</span>
                    <span className="block text-[10px] text-[#475569]">{item.vessel}</span>
                  </div>
                ),
              },
              {
                key: "eta",
                header: "Port ETA & Berth",
                sortable: true,
                render: (item) => <span className="font-medium text-xs text-[#0F172A]">{item.eta}</span>,
              },
              {
                key: "freeTimeDays",
                header: "Demurrage Free Time",
                sortable: true,
                render: (item) => (
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-bold ${
                      item.freeTimeDays <= 3
                        ? "bg-rose-50 text-rose-700 border-rose-200 animate-pulse"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}
                  >
                    <FiClock className="w-2.5 h-2.5" />
                    {item.freeTimeDays} Days Free Time
                  </span>
                ),
              },
              {
                key: "clearanceStep",
                header: "NCS Clearance Milestone",
                render: (item) => (
                  <div>
                    <span className="text-xs text-[#0F172A] font-semibold">{item.clearanceStep}</span>
                    <span className="block text-[10px] text-[#64748B]">{item.sgdStatus}</span>
                  </div>
                ),
              },
              {
                key: "action",
                header: "Landed Cost Breakdown",
                align: "right",
                render: (item) => (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCostShipment(item)}
                    leftIcon={<FiDollarSign className="w-3.5 h-3.5 text-[#2563EB]" />}
                  >
                    Landed Cost (${item.costBreakdown.totalLandedUSD.toLocaleString()})
                  </Button>
                ),
              },
            ]}
          />
        </Card>
      )}

      {/* VIEW 2: Multi-VIN Container Manifests */}
      {activeTab === "containers" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div>
            <h4 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider">
              Multi-VIN Sea Container & Bill of Lading Manifests
            </h4>
            <p className="text-[11px] text-[#64748B]">
              Multi-vehicle container grouping (2 luxury units per 40ft High-Cube container).
            </p>
          </div>

          <Table
            data={shipments}
            keyExtractor={(item) => item.container}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "container",
                header: "Container Identifier",
                sortable: true,
                render: (item) => <span className="font-mono font-bold text-[#2563EB] text-xs">{item.container}</span>,
              },
              {
                key: "bol",
                header: "Bill of Lading (B/L)",
                sortable: true,
                render: (item) => <span className="font-mono text-xs font-semibold text-[#0F172A]">{item.bol}</span>,
              },
              {
                key: "vessel",
                header: "Carrier Ocean Vessel",
                render: (item) => <span className="text-xs text-[#475569]">{item.vessel}</span>,
              },
              {
                key: "associatedVins",
                header: "Consolidated VINs Stowed",
                render: (item) => (
                  <div className="space-y-0.5">
                    {item.associatedVins.map((vin, i) => (
                      <span key={i} className="block font-mono text-[10px] text-[#0F172A]">
                        VIN {i + 1}: {vin}
                      </span>
                    ))}
                  </div>
                ),
              },
              {
                key: "clearingAgent",
                header: "Clearing Agent",
                render: (item) => <span className="text-xs text-[#2563EB]">{item.clearingAgent}</span>,
              },
            ]}
          />
        </Card>
      )}

      {/* VIEW 3: Landed Cost Rollup Ledger */}
      {activeTab === "rollup" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div>
            <h4 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider">
              Landed Cost Automatic Rollup Ledger (Section 7)
            </h4>
            <p className="text-[11px] text-[#64748B]">
              FOB + Freight + Insurance + SGD Duty + Demurrage + Inland Haulage = True Inventory Cost.
            </p>
          </div>

          <Table
            data={shipments}
            keyExtractor={(item) => item.ref}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "ref",
                header: "Ref Code",
                sortable: true,
                render: (item) => <span className="font-mono font-bold text-[#2563EB] text-xs">{item.ref}</span>,
              },
              {
                key: "car",
                header: "Vehicle Model",
                sortable: true,
                render: (item) => <span className="font-bold text-[#0F172A] text-xs">{item.car}</span>,
              },
              {
                key: "fobUSD",
                header: "Base FOB",
                render: (item) => <span className="font-mono text-xs">${item.costBreakdown.fobUSD.toLocaleString()}</span>,
              },
              {
                key: "customsDutySGD_USD",
                header: "NCS Duty",
                render: (item) => <span className="font-mono text-xs text-[#1D4ED8]">${item.costBreakdown.customsDutySGD_USD.toLocaleString()}</span>,
              },
              {
                key: "totalLandedUSD",
                header: "Total Landed Investment",
                sortable: true,
                render: (item) => (
                  <div>
                    <span className="font-mono font-bold text-[#0F172A] text-xs">
                      ${item.costBreakdown.totalLandedUSD.toLocaleString()}
                    </span>
                    <span className="block font-mono text-[10px] text-[#64748B]">
                      ₦{(item.costBreakdown.totalLandedUSD * 1500).toLocaleString()}
                    </span>
                  </div>
                ),
              },
              {
                key: "rolledUpToInventory",
                header: "Inventory Rollup",
                render: (item) =>
                  item.rolledUpToInventory ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Rolled Up
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Pending Port Gate-Out
                    </span>
                  ),
              },
              {
                key: "action",
                header: "Action",
                align: "right",
                render: (item) =>
                  !item.rolledUpToInventory ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleExecuteLandedCostRollup(item)}
                      className="px-2 py-0.5 text-[11px]"
                      leftIcon={<FiCheckCircle className="w-3 h-3" />}
                    >
                      Roll Up to Stock
                    </Button>
                  ) : (
                    <span className="text-xs text-[#64748B]">Active in Stock</span>
                  ),
              },
            ]}
          />
        </Card>
      )}

      {/* VIEW 4: Supplier Predictive Analytics (PDF Section 24) */}
      {activeTab === "predictive" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5 bg-gradient-to-br from-white via-white to-blue-50/20 border-blue-200">
          <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-2.5 border-b border-[#E2E8F0]">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-[#EFF6FF] text-[#2563EB]">
                  <FiCpu className="w-4 h-4" />
                </span>
                <h4 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
                  Supplier Predictive Analytics & Port Congestion Telemetry (Phase 3)
                </h4>
                <Badge variant="gold" size="sm">Neural Ocean Routing</Badge>
              </div>
              <p className="text-[11px] text-[#64748B]">
                Predictive transit velocity modeling, port terminal berth queue forecasts, and currency volatility hedging advisories.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-white rounded-lg border border-[#E2E8F0] shadow-xs">
              <span className="text-[10px] uppercase font-bold text-[#64748B] block">
                Average Atlantic Ro-Ro Lead Time
              </span>
              <span className="font-mono font-bold text-2xl text-[#2563EB] mt-1 block">
                22.8 Days
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
                94.8% Carrier On-Time Benchmark
              </span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-[#E2E8F0] shadow-xs">
              <span className="text-[10px] uppercase font-bold text-[#64748B] block">
                Tin Can Terminal Berth Queue
              </span>
              <span className="font-mono font-bold text-2xl text-amber-600 mt-1 block">
                1.8 Days Queue
              </span>
              <span className="text-[10px] text-[#64748B] block mt-1">
                5 Vessels Anchored at Lagos Fairway
              </span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-[#E2E8F0] shadow-xs">
              <span className="text-[10px] uppercase font-bold text-[#64748B] block">
                Currency Hedging Index
              </span>
              <span className="font-mono font-bold text-2xl text-emerald-600 mt-1 block">
                Stable (USD/EUR)
              </span>
              <span className="text-[10px] text-[#64748B] block mt-1">
                Forward Cover Active for Q4 Consignments
              </span>
            </div>
          </div>

          <Table
            data={predictiveRoutes}
            keyExtractor={(item) => item.route}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "route",
                header: "Maritime Route & Corridor",
                sortable: true,
                render: (item) => (
                  <div>
                    <span
                      className="font-bold text-xs text-[#0F172A] block"
                      dangerouslySetInnerHTML={{ __html: item.route }}
                    />
                    <span className="text-[10px] text-[#64748B]">{item.carrier}</span>
                  </div>
                ),
              },
              {
                key: "predictedDays",
                header: "Predicted Voyage Lead",
                sortable: true,
                render: (item) => (
                  <span className="font-mono font-bold text-[#2563EB] text-xs">
                    {item.predictedDays}
                  </span>
                ),
              },
              {
                key: "confidence",
                header: "Confidence",
                sortable: true,
                render: (item) => <Badge variant="gold" size="sm">{item.confidence}</Badge>,
              },
              {
                key: "congestionQueue",
                header: "Port Congestion Risk",
                sortable: true,
                render: (item) => (
                  <span className="text-xs font-semibold text-[#0F172A]">
                    {item.congestionQueue}
                  </span>
                ),
              },
              {
                key: "demurrageRisk",
                header: "Demurrage Exposure",
                render: (item) => (
                  <span className="text-[11px] text-[#475569]">{item.demurrageRisk}</span>
                ),
              },
              {
                key: "hedgingAdvisory",
                header: "FX & Bunker Fuel Hedging Advisory",
                render: (item) => (
                  <span className="text-[11px] font-mono text-purple-700 font-medium">
                    {item.hedgingAdvisory}
                  </span>
                ),
              },
              {
                key: "status",
                header: "Route Rating",
                align: "right",
                render: (item) => (
                  <Badge
                    variant={
                      item.status === "Optimal Route" || item.status === "Highly Recommended"
                        ? "gold"
                        : "charcoal"
                    }
                    size="sm"
                  >
                    {item.status}
                  </Badge>
                ),
              },
            ]}
          />
        </Card>
      )}
      {selectedCostShipment && (
        <Modal
          isOpen={!!selectedCostShipment}
          onClose={() => setSelectedCostShipment(null)}
          title={`Landed Cost Breakdown: ${selectedCostShipment.car}`}
          description={`Manifest Ref: ${selectedCostShipment.ref} • Container: ${selectedCostShipment.container}`}
          size="md"
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl space-y-2">
              <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                <span className="text-[#64748B]">1. Base FOB Purchase Price:</span>
                <span className="font-mono font-bold text-[#0F172A]">${selectedCostShipment.costBreakdown.fobUSD.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                <span className="text-[#64748B]">2. Ocean Freight Transit:</span>
                <span className="font-mono text-[#0F172A]">${selectedCostShipment.costBreakdown.oceanFreightUSD.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                <span className="text-[#64748B]">3. Marine Cargo Insurance:</span>
                <span className="font-mono text-[#0F172A]">${selectedCostShipment.costBreakdown.marineInsuranceUSD.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                <span className="text-[#64748B]">4. Nigerian Customs Duty (SGD Assessment):</span>
                <span className="font-mono font-bold text-[#1D4ED8]">${selectedCostShipment.costBreakdown.customsDutySGD_USD.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                <span className="text-[#64748B]">5. Port Terminal Handling (TCIT):</span>
                <span className="font-mono text-[#0F172A]">${selectedCostShipment.costBreakdown.portHandlingUSD.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                <span className="text-[#64748B]">6. Port Demurrage Fines:</span>
                <span className="font-mono text-emerald-700 font-bold">$0 (Zero Demurrage)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                <span className="text-[#64748B]">7. Inland Bonded Haulage:</span>
                <span className="font-mono text-[#0F172A]">${selectedCostShipment.costBreakdown.inlandHaulageUSD.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 text-sm font-bold">
                <span className="text-[#2563EB]">Total Landed Investment:</span>
                <span className="font-mono font-bold text-[#1D4ED8] text-base">
                  ${selectedCostShipment.costBreakdown.totalLandedUSD.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
              <Button variant="outline" size="sm" onClick={() => setSelectedCostShipment(null)}>
                Close
              </Button>
              {!selectedCostShipment.rolledUpToInventory && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleExecuteLandedCostRollup(selectedCostShipment)}
                  leftIcon={<FiCheckCircle className="w-3.5 h-3.5" />}
                >
                  Roll Up Directly to Stock
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Log Inbound Ocean Shipment */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="md"
        title="Log Inbound Ocean Consignment"
        description="Records vessel manifest, Container ID, Bill of Lading, and preliminary FOB cost."
      >
        <form onSubmit={handleCreate} className="space-y-3">
          <Input
            label="Shipment Manifest Reference Code"
            placeholder="e.g. IMP-2026-994"
            value={refCode}
            onChange={(e) => setRefCode(e.target.value)}
          />
          <Input
            label="Vehicle Description"
            placeholder="e.g. 2024 Mercedes-Maybach S580"
            value={car}
            onChange={(e) => setCar(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Ocean Carrier Vessel"
              value={vessel}
              onChange={(e) => setVessel(e.target.value)}
              required
            />
            <Input
              label="Container Number"
              placeholder="e.g. MSCU-9928192"
              value={container}
              onChange={(e) => setContainer(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Dropdown
              label="Port of Loading"
              value={origin}
              onChange={(val) => setOrigin(String(val))}
              options={[
                { label: "Antwerp, Belgium", value: "Antwerp, Belgium" },
                { label: "Hamburg, Germany", value: "Hamburg, Germany" },
                { label: "JAXPORT, Florida, USA", value: "JAXPORT, Florida, USA" },
                { label: "Jebel Ali, Dubai, UAE", value: "Jebel Ali, Dubai, UAE" },
              ]}
            />
            <Input
              label="Base FOB Purchase Price ($)"
              value={fobPrice}
              onChange={(e) => setFobPrice(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" leftIcon={<FiCheck />}>
              Save Consignment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
