"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FiLayers,
  FiShoppingCart,
  FiUsers,
  FiDollarSign,
  FiFileText,
  FiMessageSquare,
  FiSettings,
  FiShield,
  FiPlus,
  FiTruck,
  FiRepeat,
  FiEdit3,
  FiDownload,
  FiClock,
  FiAnchor,
  FiBriefcase,
  FiNavigation,
  FiTool,
  FiBox,
  FiActivity,
  FiCheckSquare,
  FiCheckCircle,
} from "react-icons/fi";
import { FaCar } from "react-icons/fa6";
import {
  Button,
  Badge,
  KPICard,
  Table,
  Modal,
  Input,
  Dropdown,
} from "@/components/ui";
import { DashboardLayout } from "@/components/DashboardLayout";
import { VEHICLES } from "@/data/vehicles";

export function ERPConsoleContent({ initialModule = "Dashboard" }: { initialModule?: string }) {
  const [activeModule, setActiveModule] = useState<string>(initialModule);
  const [growthTimeframe, setGrowthTimeframe] = useState<string>("Weekly");
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState<boolean>(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState<boolean>(false);
  const [tableSearch, setTableSearch] = useState<string>("");

  // Master stock filtering
  const filteredStock = VEHICLES.filter(
    (v) =>
      v.make.toLowerCase().includes(tableSearch.toLowerCase()) ||
      v.model.toLowerCase().includes(tableSearch.toLowerCase()) ||
      v.stockId.toLowerCase().includes(tableSearch.toLowerCase()) ||
      v.category.toLowerCase().includes(tableSearch.toLowerCase())
  );

  const mainMenuItems = [
    { name: "Dashboard", icon: <FiLayers className="w-4 h-4 shrink-0" /> },
    { name: "Car Management", icon: <FaCar className="w-4 h-4 shrink-0" />, badge: `${filteredStock.length}` },
    { name: "Orders & Sales", icon: <FiShoppingCart className="w-4 h-4 shrink-0" />, badge: "8" },
    { name: "Service & Workshop", icon: <FiTool className="w-4 h-4 shrink-0" />, badge: "6 Bays" },
    { name: "Parts & Inventory", icon: <FiBox className="w-4 h-4 shrink-0" />, badge: "4 Low" },
    { name: "Finance & Insurance", icon: <FiActivity className="w-4 h-4 shrink-0" />, badge: "6 Pending" },
    { name: "Detailing & Recon", icon: <FiCheckSquare className="w-4 h-4 shrink-0" />, badge: "4 Ready" },
    { name: "Branch Transfers", icon: <FiNavigation className="w-4 h-4 shrink-0" />, badge: "2 Active" },
    { name: "Import Logistics", icon: <FiTruck className="w-4 h-4 shrink-0" />, badge: "3 Vessels" },
    { name: "Trade-In & Swap", icon: <FiRepeat className="w-4 h-4 shrink-0" />, badge: "3" },
    { name: "CRM Pipeline & 360", icon: <FiMessageSquare className="w-4 h-4 shrink-0" />, badge: "14" },
    { name: "Accounting & Finance", icon: <FiDollarSign className="w-4 h-4 shrink-0" /> },
    { name: "HR & Recruitment", icon: <FiBriefcase className="w-4 h-4 shrink-0" />, badge: "5 Apps" },
  ];

  const systemMenuItems = [
    { name: "Roles & RBAC", icon: <FiShield className="w-4 h-4 shrink-0" /> },
    { name: "Document Vault", icon: <FiFileText className="w-4 h-4 shrink-0" /> },
    { name: "CMS Manager", icon: <FiEdit3 className="w-4 h-4 shrink-0" /> },
    { name: "Settings", icon: <FiSettings className="w-4 h-4 shrink-0" /> },
  ];

  return (
    <DashboardLayout
      title={activeModule}
      activeModule={activeModule}
      onSelectModule={setActiveModule}
      mainMenuItems={mainMenuItems}
      systemMenuItems={systemMenuItems}
      branchName="HQ Branch (Victoria Island)"
      userRole="Super Admin"
      userName="Admin Panel"
      userInitials="AP"
      onSearch={setTableSearch}
    >
      <div className="space-y-4">
        {/* ================================================================= */}
        {/* MODULE 1: DASHBOARD & EXECUTIVE ANALYTICS [ERP-01]                */}
        {/* ================================================================= */}
        {activeModule === "Dashboard" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <KPICard
                title="Total Cars Listed"
                value="1,248"
                change="+12.4% vs last mo"
                icon={<FaCar className="w-4 h-4" />}
                sparklinePath="M0 20 Q 20 8, 40 15 T 80 5 T 120 12"
              />
              <KPICard
                title="Active Users"
                value="8,432"
                change="+8.1% vs last mo"
                icon={<FiUsers className="w-4 h-4" />}
                sparklinePath="M0 18 Q 30 18, 50 8 T 90 4 T 120 6"
              />
              <KPICard
                title="Total Transactions"
                value="412"
                change="+14.2% vs last mo"
                icon={<FiShoppingCart className="w-4 h-4" />}
                sparklinePath="M0 16 Q 25 4, 55 12 T 85 2 T 120 8"
              />
              <KPICard
                title="Total Revenue ($)"
                value="$48.2M"
                change="+21.0% vs last mo"
                icon={<FiDollarSign className="w-4 h-4" />}
                sparklinePath="M0 22 Q 35 15, 65 6 T 95 2 T 120 4"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 sm:p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A]">Monthly Dealership Sales Trend</h3>
                    <p className="text-[11px] text-[#64748B]">Audited revenue across Lagos & Abuja showrooms</p>
                  </div>
                  <Badge variant="gold" size="sm">FY 2026</Badge>
                </div>

                <div className="h-44 sm:h-48 flex items-end gap-2 sm:gap-3 pt-4 px-1">
                  {[
                    { month: "Jan", height: "45%", val: "$2.8M" },
                    { month: "Feb", height: "55%", val: "$3.4M" },
                    { month: "Mar", height: "50%", val: "$3.1M" },
                    { month: "Apr", height: "65%", val: "$4.1M" },
                    { month: "May", height: "60%", val: "$3.9M" },
                    { month: "Jun", height: "75%", val: "$4.8M" },
                    { month: "Jul", height: "70%", val: "$4.5M" },
                    { month: "Aug", height: "80%", val: "$5.2M" },
                    { month: "Sep", height: "85%", val: "$5.6M" },
                    { month: "Oct", height: "90%", val: "$6.1M" },
                    { month: "Nov", height: "100%", val: "$6.8M", active: true },
                    { month: "Dec", height: "92%", val: "$6.2M" },
                  ].map((bar) => (
                    <div key={bar.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-mono font-bold text-[#2563EB] bg-[#EFF6FF] px-1 rounded">
                        {bar.val}
                      </div>
                      <div
                        style={{ height: bar.height }}
                        className={`w-full rounded-t transition-all ${
                          bar.active
                            ? "bg-[#2563EB] shadow-md shadow-[#2563EB]/30"
                            : "bg-[#CBD5E1] hover:bg-[#94A3B8]"
                        }`}
                      />
                      <span className="text-[10px] text-[#64748B] font-mono font-medium">{bar.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 sm:p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A]">Client Growth</h3>
                  <div className="flex items-center gap-1 bg-[#F1F5F9] p-0.5 rounded-md text-[10px]">
                    {["Weekly", "Monthly"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setGrowthTimeframe(t)}
                        className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                          growthTimeframe === t
                            ? "bg-[#2563EB] text-[#FFFFFF]"
                            : "text-[#64748B] hover:text-[#0F172A]"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {[
                    { label: "VIP Retail Buyers", count: "1,240", pct: 68 },
                    { label: "Corporate Fleet Clients", count: "480", pct: 45 },
                    { label: "Auto Broker Network", count: "312", pct: 32 },
                  ].map((cat) => (
                    <div key={cat.label} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-[#475569]">{cat.label}</span>
                        <span className="text-[#0F172A] font-mono">{cat.count}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
                        <div
                          style={{ width: `${cat.pct}%` }}
                          className="h-full bg-[#2563EB] rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODULE 2: CAR MANAGEMENT & MASTER INVENTORY [ERP-02, ERP-03]       */}
        {/* ================================================================= */}
        {activeModule === "Car Management" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FFFFFF] p-4 rounded-md border border-[#E2E8F0] shadow-xs">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB]">Master Vehicle Fleet Control</h3>
                <p className="text-[11px] text-[#64748B]">Real-time VIN audit, showroom allocations, and status toggles</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsAddVehicleOpen(true)}
                leftIcon={<FiPlus className="w-4 h-4 text-[#FFFFFF]" />}
              >
                Add New Vehicle to Stock
              </Button>
            </div>

            <Table
              data={filteredStock}
              keyExtractor={(item) => item.stockId}
              columns={[
                { key: "stockId", header: "Stock ID", sortable: true },
                {
                  key: "make",
                  header: "Make & Model",
                  sortable: true,
                  render: (row) => (
                    <div>
                      <div className="font-bold text-[#0F172A]">{row.make} {row.model}</div>
                      <div className="text-[10px] text-[#64748B] font-mono">VIN: {row.vin}</div>
                    </div>
                  ),
                },
                { key: "year", header: "Year", sortable: true },
                { key: "location", header: "Showroom Hub", sortable: true },
                {
                  key: "priceUSD",
                  header: "Retail Price ($)",
                  sortable: true,
                  render: (row) => (
                    <span className="font-mono font-bold text-[#1D4ED8]">${row.priceUSD.toLocaleString()}</span>
                  ),
                },
                {
                  key: "status",
                  header: "Status",
                  sortable: true,
                  render: (row) => (
                    <Badge variant="gold" size="sm" dot>
                      {row.status}
                    </Badge>
                  ),
                },
                {
                  key: "actions",
                  header: "Actions",
                  align: "right",
                  render: (row) => (
                    <div className="flex items-center justify-end gap-1.5">
                      <Link href={`/inventory/${row.stockId}`}>
                        <button className="px-2.5 py-1 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] hover:bg-[#2563EB] hover:text-[#FFFFFF] text-xs font-semibold transition-colors cursor-pointer">
                          Preview VDP
                        </button>
                      </Link>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        )}

        {/* ================================================================= */}
        {/* MODULE 3: ORDERS & SALES MANAGEMENT [ERP-06, ERP-07]              */}
        {/* ================================================================= */}
        {activeModule === "Orders & Sales" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <KPICard title="Open Purchase Orders" value="8 Pending" change="$1.4M Committed" />
              <KPICard title="Completed Deliveries" value="48 Units" change="This Quarter" />
              <KPICard title="Average Margin" value="18.4%" change="+$24.5k per car" />
            </div>

            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB]">Active Sales Pipeline & Concurrency Control</h3>
                <Badge variant="gold" size="sm">5-Stage Concurrency Guard</Badge>
              </div>
              <div className="space-y-2 text-xs">
                {[
                  { id: "ORD-9912", client: "Alhaji Bello & Sons Ltd", car: "Maybach S580", amount: "$165,000", status: "Delivery Inspection", stage: "Ready for Handover", rep: "Emeka O." },
                  { id: "ORD-9910", client: "Dr. K. Somoye", car: "Porsche 911 Turbo S", amount: "$225,000", status: "Payment Confirmed", stage: "Registration & Armor", rep: "Aisha M." },
                  { id: "ORD-9908", client: "Zenith Capital Partners", car: "Range Rover Autobiography", amount: "$195,000", status: "Customs Clearance", stage: "Tin Can Discharge", rep: "Tariq K." },
                  { id: "ORD-9904", client: "Senator Godswill O.", car: "Mercedes G63 AMG Magno", amount: "$240,000", status: "Quotation Approved", stage: "Bank Wire Verification", rep: "Emeka O." },
                ].map((ord) => (
                  <div key={ord.id} className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-mono font-bold text-[#2563EB] mr-2">{ord.id}</span>
                      <span className="font-bold text-[#0F172A]">{ord.client}</span>
                      <span className="text-[#64748B] text-[11px] block">{ord.car} &bull; Stage: {ord.stage} &bull; Rep: {ord.rep}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-[#1D4ED8] text-sm">{ord.amount}</span>
                      <Badge variant="gold" size="sm">{ord.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* DEPARTMENT: SERVICE & WORKSHOP (AFTER-SALES & PDI)                */}
        {/* ================================================================= */}
        {activeModule === "Service & Workshop" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
              <KPICard title="Bays In Operation" value="6 / 8 Bays" change="75% Capacity" icon={<FiTool className="w-4 h-4" />} />
              <KPICard title="PDI Completed" value="18 Vehicles" change="This Month" icon={<FiCheckCircle className="w-4 h-4" />} />
              <KPICard title="Mean Diagnosis" value="2.4 Hours" change="OBD-II Certified" icon={<FiClock className="w-4 h-4" />} />
              <KPICard title="Customer CSAT" value="98.5%" change="After-sales Rating" icon={<FiUsers className="w-4 h-4" />} />
            </div>

            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB]">Active Workshop Bay Job Cards & PDI Diagnostics</h3>
                  <p className="text-[11px] text-[#64748B]">Pre-delivery inspections, factory recalls, and master mechanical sign-offs</p>
                </div>
                <Button variant="primary" size="sm" leftIcon={<FiPlus className="w-3.5 h-3.5 text-[#FFFFFF]" />}>
                  Create Workshop Job Card
                </Button>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { id: "JOB-2026-441", bay: "Bay 1 (Master Diagnostic)", car: "2024 Mercedes-Maybach S580", vin: "WDD223...001", type: "150-Point PDI & Suspension Calibration", tech: "Engr. Tunde B. (Lead Tech)", status: "In Inspection" },
                  { id: "JOB-2026-438", bay: "Bay 3 (Mechanical Bay)", car: "2024 Porsche 911 Turbo S", vin: "WP0AD2...002", type: "Carbon-Ceramic Brake Bedding & Fluids", tech: "Engr. Klaus M. (Exotic Specialist)", status: "Diagnostic Passed" },
                  { id: "JOB-2026-435", bay: "Bay 4 (Electrical & ECU)", car: "2024 Lexus LX 600 VIP", vin: "JTJHY7...004", type: "Software ECU Update & Radar Recalibration", tech: "Engr. David K. (Electronics)", status: "In Inspection" },
                  { id: "JOB-2026-429", bay: "Bay 2 (PDI Express)", car: "2023 Range Rover Autobiography", vin: "SALWR2...003", type: "Pre-Handover Verification & Seal Sign-off", tech: "Engr. Tunde B. (Lead Tech)", status: "Sign-Off Complete" },
                ].map((job) => (
                  <div key={job.id} className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#2563EB]">{job.id}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] font-bold">{job.bay}</span>
                        <span className="font-bold text-[#0F172A]">{job.car}</span>
                      </div>
                      <span className="text-[#64748B] text-[11px] block mt-0.5">
                        {job.type} &bull; Tech: {job.tech} &bull; VIN: {job.vin}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 self-end sm:self-auto">
                      <Badge variant="gold" size="sm">{job.status}</Badge>
                      <button
                        onClick={() => alert(`Opening Job Card ${job.id} diagnostics report.`)}
                        className="px-2.5 py-1 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] hover:bg-[#2563EB] hover:text-[#FFFFFF] text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Job Card
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* DEPARTMENT: PARTS & LUXURY ACCESSORIES                            */}
        {/* ================================================================= */}
        {activeModule === "Parts & Inventory" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
              <KPICard title="Total Parts SKUs" value="1,840 SKUs" change="98% Catalog Coverage" icon={<FiBox className="w-4 h-4" />} />
              <KPICard title="Warehouse Valuation" value="$420,500" change="Cost Value" icon={<FiDollarSign className="w-4 h-4" />} />
              <KPICard title="Re-order Threshold" value="4 SKUs Low" change="Automated Supplier Trigger" icon={<FiClock className="w-4 h-4" />} />
              <KPICard title="Fastest Moving" value="Ceramic Kits & Pads" change="Top Turn-rate" icon={<FiCheckCircle className="w-4 h-4" />} />
            </div>

            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB]">Parts & Accessories Master Catalog</h3>
                  <p className="text-[11px] text-[#64748B]">OEM genuine parts, styling packages, and consumable inventory</p>
                </div>
                <Button variant="primary" size="sm" leftIcon={<FiPlus className="w-3.5 h-3.5 text-[#FFFFFF]" />}>
                  Register Part SKU
                </Button>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { sku: "PRT-BRK-992", name: "Brembo Carbon-Ceramic Brake Kit (Porsche 992)", category: "Brake & Friction", stock: "8 Sets", cost: "$4,200", retail: "$5,850", status: "In Stock" },
                  { sku: "ACC-CER-9HPRO", name: "9H Diamond Graphene Ceramic Coating Kit (500ml)", category: "Detailing Chemical", stock: "45 Kits", cost: "$120", retail: "$290", status: "In Stock" },
                  { sku: "PRT-SUS-W223", name: "AIRMATIC Air Suspension Strut Assembly (S-Class)", category: "Suspension", stock: "2 Units", cost: "$1,850", retail: "$2,450", status: "Low Stock Alert" },
                  { sku: "ACC-WHL-22AMG", name: "22-Inch Forged Cross-Spoke Monoblock Wheels", category: "Wheels & Rims", stock: "4 Sets", cost: "$3,800", retail: "$5,400", status: "In Stock" },
                ].map((part) => (
                  <div key={part.sku} className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#2563EB]">{part.sku}</span>
                        <span className="font-bold text-[#0F172A]">{part.name}</span>
                      </div>
                      <span className="text-[#64748B] text-[11px] block mt-0.5">
                        Category: {part.category} &bull; Cost: {part.cost} &bull; Retail: {part.retail}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <span className="font-mono font-bold text-[#0F172A]">{part.stock}</span>
                      <Badge variant="gold" size="sm">{part.status}</Badge>
                      <button
                        onClick={() => alert(`Generating stock requisition for ${part.sku}`)}
                        className="px-2.5 py-1 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] hover:bg-[#2563EB] hover:text-[#FFFFFF] text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Re-Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* DEPARTMENT: FINANCE & INSURANCE (F&I DESK)                        */}
        {/* ================================================================= */}
        {activeModule === "Finance & Insurance" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
              <KPICard title="Financed Portfolio" value="$14.8M" change="Year-to-date" icon={<FiDollarSign className="w-4 h-4" />} />
              <KPICard title="Bank Partners" value="5 Prime Banks" change="Direct API Integration" icon={<FiShield className="w-4 h-4" />} />
              <KPICard title="Pending Pre-Approvals" value="6 Applications" change="Average 4-Hour Decision" icon={<FiClock className="w-4 h-4" />} />
              <KPICard title="Active Policies" value="142 Policies" change="Comprehensive Cover" icon={<FiFileText className="w-4 h-4" />} />
            </div>

            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB]">F&I Deals Pipeline, Auto Leasing & Insurance Underwriting</h3>
                  <p className="text-[11px] text-[#64748B]">Bank facilities, chattel mortgages, and comprehensive motor insurance underwriting</p>
                </div>
                <Button variant="primary" size="sm" leftIcon={<FiPlus className="w-3.5 h-3.5 text-[#FFFFFF]" />}>
                  New Financing Application
                </Button>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { id: "FIN-2026-102", client: "Alhaji Aliyu Bello", vehicle: "2024 Mercedes-Maybach S580", bank: "Stanbic IBTC Auto Finance", facility: "$150,000", underwriter: "Leadway Assurance (Comprehensive)", status: "Pre-Approved" },
                  { id: "FIN-2026-098", client: "Dr. Kemi Adeyemi", vehicle: "2024 Porsche 911 Turbo S", bank: "Zenith Bank Auto Lease", facility: "$180,000", underwriter: "AXA Mansard Motor Guard", status: "Underwriter Review" },
                  { id: "FIN-2026-095", client: "Oakwood Global Logistics Ltd", vehicle: "2024 Lexus LX 600 VIP", bank: "Access Bank Prime Auto", facility: "₦220,000,000", underwriter: "AIICO Comprehensive Motor", status: "Disbursement Pending" },
                ].map((deal) => (
                  <div key={deal.id} className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#2563EB]">{deal.id}</span>
                        <span className="font-bold text-[#0F172A]">{deal.client}</span>
                        <span className="text-[#64748B]">({deal.vehicle})</span>
                      </div>
                      <span className="text-[#64748B] text-[11px] block mt-0.5">
                        Bank: {deal.bank} &bull; Underwriter: {deal.underwriter}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <span className="font-mono font-bold text-[#1D4ED8]">{deal.facility}</span>
                      <Badge variant="gold" size="sm">{deal.status}</Badge>
                      <button
                        onClick={() => alert(`Reviewing F&I dossier for ${deal.client}`)}
                        className="px-2.5 py-1 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] hover:bg-[#2563EB] hover:text-[#FFFFFF] text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Review Terms
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* DEPARTMENT: DETAILING, PAINT & RECON                              */}
        {/* ================================================================= */}
        {activeModule === "Detailing & Recon" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
              <KPICard title="Cars In Detailing" value="4 Vehicles" change="In Progress" icon={<FiCheckSquare className="w-4 h-4" />} />
              <KPICard title="Ceramic Applied" value="28 This Month" change="9H Diamond Coating" icon={<FiShield className="w-4 h-4" />} />
              <KPICard title="Inspection Pass Rate" value="100%" change="Zero Imperfection" icon={<FiCheckCircle className="w-4 h-4" />} />
              <KPICard title="Average Cycle" value="18 Hours" change="Complete Paint Prep" icon={<FiClock className="w-4 h-4" />} />
            </div>

            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB]">5-Stage Aesthetic Recon & Delivery Handover Pipeline</h3>
                  <p className="text-[11px] text-[#64748B]">Paint correction, interior deep steam, ceramic seal & white-glove readiness</p>
                </div>
                <Badge variant="gold" size="sm">Detailing Bay Status</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs pt-1">
                <div className="p-2.5 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] text-center">
                  <span className="font-bold text-[#0F172A] block">Stage 1: Wash</span>
                  <span className="text-[10px] text-[#64748B]">Chemical Decontamination</span>
                </div>
                <div className="p-2.5 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] text-center">
                  <span className="font-bold text-[#0F172A] block">Stage 2: Paint Meter</span>
                  <span className="text-[10px] text-[#64748B]">Micron Thickness Audit</span>
                </div>
                <div className="p-2.5 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] text-center">
                  <span className="font-bold text-[#0F172A] block">Stage 3: Leather Care</span>
                  <span className="text-[10px] text-[#64748B]">Nappa Conditioning & Steam</span>
                </div>
                <div className="p-2.5 bg-[#EFF6FF] rounded-md border border-[#BFDBFE] text-center">
                  <span className="font-bold text-[#1D4ED8] block">Stage 4: 9H Ceramic</span>
                  <span className="text-[10px] text-[#1D4ED8]">Infrared Curing Booth</span>
                </div>
                <div className="p-2.5 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] text-center">
                  <span className="font-bold text-[#0F172A] block">Stage 5: Handover</span>
                  <span className="text-[10px] text-[#64748B]">White Glove Seal Sign-off</span>
                </div>
              </div>

              <div className="space-y-2 text-xs pt-2">
                {[
                  { vehicle: "2024 Mercedes-Maybach S580 [STK-2026-001]", stage: "Stage 4: 9H Ceramic Coating", progress: "85%", specialist: "Tariq K. (Master Detailer)", status: "Curing Booth Active" },
                  { vehicle: "2024 Porsche 911 Turbo S [STK-2026-002]", stage: "Stage 5: Final Handover Check", progress: "100%", specialist: "Chidi N. (QC Specialist)", status: "Showroom Ready" },
                  { vehicle: "2023 Range Rover Autobiography [STK-2026-003]", stage: "Stage 2: 2-Step Paint Correction", progress: "45%", specialist: "Tariq K. (Master Detailer)", status: "Compound & Polish" },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <span className="font-bold text-[#0F172A]">{item.vehicle}</span>
                      <span className="text-[#64748B] text-[11px] block mt-0.5">
                        Current: {item.stage} &bull; Specialist: {item.specialist}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <span className="font-mono font-bold text-[#2563EB]">{item.progress}</span>
                      <Badge variant="gold" size="sm">{item.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODULE: BRANCH TRANSFERS & CARRIER DISPATCH [ERP-05]              */}
        {/* ================================================================= */}
        {activeModule === "Branch Transfers" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FFFFFF] p-4 rounded-md border border-[#E2E8F0] shadow-xs">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB]">Inter-Showroom Branch Logistics</h3>
                <p className="text-[11px] text-[#64748B]">Real-time transit manifests between Lagos HQ and Abuja Diplomatic Suite</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsTransferModalOpen(true)}
                leftIcon={<FiNavigation className="w-4 h-4 text-[#FFFFFF]" />}
              >
                Dispatch New Carrier
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#FFFFFF] rounded-md border border-[#CBD5E1] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#2563EB]">TRF-2026-088</span>
                  <Badge variant="gold" size="sm">En Route (Express Hauler)</Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-[#0F172A]">Mercedes-Benz Maybach S580</div>
                  <div className="text-xs text-[#64748B]">Origin: Lagos Victoria Island &rarr; Dest: Abuja Maitama Suite</div>
                  <div className="text-[11px] text-[#64748B]">Carrier: Direct Luxury Flatbed #04 &bull; Driver: Musa Danladi (+234 803 111 2222)</div>
                </div>
                <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#2563EB] h-full w-3/4 rounded-full" />
                </div>
                <div className="flex justify-between text-[10px] text-[#64748B] font-mono">
                  <span>Dispatched: Nov 04, 06:00 AM</span>
                  <span className="font-bold text-[#2563EB]">ETA: Today, 08:30 PM</span>
                </div>
              </div>

              <div className="p-4 bg-[#FFFFFF] rounded-md border border-[#CBD5E1] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#2563EB]">TRF-2026-089</span>
                  <Badge variant="gold" size="sm">Pre-Trip PDI Check</Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-[#0F172A]">Porsche 911 Turbo S</div>
                  <div className="text-xs text-[#64748B]">Origin: Abuja Maitama &rarr; Dest: Lagos Showroom</div>
                  <div className="text-[11px] text-[#64748B]">Carrier: Secure Enclosed Transporter #01 &bull; Driver: Emeka Eze</div>
                </div>
                <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#2563EB] h-full w-1/4 rounded-full" />
                </div>
                <div className="flex justify-between text-[10px] text-[#64748B] font-mono">
                  <span>Inspection: Passed</span>
                  <span className="font-bold text-[#2563EB]">Dispatching Tomorrow 05:00 AM</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODULE: IMPORT LOGISTICS & LANDED COST SHEET [ERP-08, ERP-09]     */}
        {/* ================================================================= */}
        {activeModule === "Import Logistics" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <KPICard title="Vessels in Atlantic Transit" value="3 Containers" change="ETA 8-14 Days" icon={<FiAnchor className="w-4 h-4" />} />
              <KPICard title="Port Customs Discharges" value="2 Units at Tin Can" change="Assessment Stage" icon={<FiTruck className="w-4 h-4" />} />
              <KPICard title="Average Clearance Cycle" value="4.8 Days" change="Single Goods Declaration" icon={<FiClock className="w-4 h-4" />} />
            </div>

            <div className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-md p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E2E8F0]">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB]">
                    Landed Cost Reconciliation Sheet (STK-2026-001 Maybach S580)
                  </h3>
                  <p className="text-[11px] text-[#64748B]">Audited itemized landed cost breakdown vs showroom gross margin</p>
                </div>
                <Badge variant="gold" size="sm">Audited by Chief Accountant</Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#64748B] block">Supplier Purchase (FOB)</span>
                  <strong className="text-[#0F172A] font-mono text-sm">$118,500</strong>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#64748B] block">Ocean Freight & Container</span>
                  <strong className="text-[#0F172A] font-mono text-sm">$4,800</strong>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#64748B] block">Marine Transit Insurance</span>
                  <strong className="text-[#0F172A] font-mono text-sm">$1,200</strong>
                </div>
                <div className="p-3 bg-[#EFF6FF] rounded-md border border-[#BFDBFE]">
                  <span className="text-[10px] text-[#1D4ED8] block font-semibold">Customs Duty (SGD Port)</span>
                  <strong className="text-[#1D4ED8] font-mono text-sm">$16,200</strong>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-[#0F172A] text-white rounded-md gap-3">
                <div>
                  <span className="text-xs text-[#94A3B8] block">Audited Landed Cost</span>
                  <div className="text-xl font-mono font-black text-white">$140,700</div>
                </div>
                <div>
                  <span className="text-xs text-[#94A3B8] block">Showroom Retail Price</span>
                  <div className="text-xl font-mono font-black text-[#60A5FA]">$165,000</div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#38BDF8] font-bold block">Gross Landed Margin</span>
                  <div className="text-xl font-mono font-black text-[#38BDF8]">+$24,300 (14.7%)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODULE: TRADE-IN & SWAP QUEUE [ERP-10]                            */}
        {/* ================================================================= */}
        {activeModule === "Trade-In & Swap" && (
          <div className="space-y-4">
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB]">Customer Trade-In & Swap Appraisal Queue</h3>
                  <p className="text-[11px] text-[#64748B]">150-Point mechanical diagnostic valuation & Director approval triggers (&gt;$50k)</p>
                </div>
                <Badge variant="gold" size="sm">Appraisal Desk Active</Badge>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { id: "SWP-2026-14", client: "Dr. K. Somoye", carOffered: "2021 Mercedes-Benz E350 (64,000 km)", target: "2024 S580 Maybach", valuation: "$32,500", diff: "$132,500 Balance", status: "Director Approval Required" },
                  { id: "SWP-2026-12", client: "Barrister Tony O.", carOffered: "2020 Toyota Land Cruiser Prado (88,000 km)", target: "2024 Range Rover P530", valuation: "$48,000", diff: "$97,000 Balance", status: "Inspection Completed" },
                  { id: "SWP-2026-09", client: "Hajia Fatima G.", carOffered: "2022 Lexus RX 350 (32,000 km)", target: "2024 Lexus LX 600", valuation: "$41,000", diff: "$119,000 Balance", status: "Valuation Approved" },
                ].map((item) => (
                  <div key={item.id} className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#2563EB]">{item.id}</span>
                        <span className="font-bold text-[#0F172A]">{item.client}</span>
                      </div>
                      <span className="text-[#64748B] text-[11px] block mt-0.5">
                        Offered: {item.carOffered} &rarr; Target: <strong className="text-[#0F172A]">{item.target}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <div className="text-right">
                        <span className="font-mono font-bold text-[#1D4ED8] block">{item.valuation}</span>
                        <span className="text-[10px] text-[#64748B] font-mono">{item.diff}</span>
                      </div>
                      <Badge variant="gold" size="sm">{item.status}</Badge>
                      <button
                        onClick={() => alert(`Reviewing Inspection Sheet for ${item.id}`)}
                        className="px-2.5 py-1 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] hover:bg-[#2563EB] hover:text-[#FFFFFF] text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODULE: CRM PIPELINE & CUSTOMER 360 [ERP-11, ERP-12]              */}
        {/* ================================================================= */}
        {activeModule === "CRM Pipeline & 360" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-[#FFFFFF] rounded-md border border-[#E2E8F0] shadow-xs">
                <span className="font-bold text-[#64748B] block uppercase text-[10px]">Stage 1: Inbound Lead</span>
                <div className="text-lg font-black text-[#0F172A] mt-1">14 Prospects</div>
                <span className="text-[10px] text-[#2563EB]">Website & WhatsApp Desk</span>
              </div>
              <div className="p-3 bg-[#FFFFFF] rounded-md border border-[#E2E8F0] shadow-xs">
                <span className="font-bold text-[#64748B] block uppercase text-[10px]">Stage 2: VIP Test Drive</span>
                <div className="text-lg font-black text-[#0F172A] mt-1">6 Scheduled</div>
                <span className="text-[10px] text-[#2563EB]">Showroom & Concierge</span>
              </div>
              <div className="p-3 bg-[#FFFFFF] rounded-md border border-[#E2E8F0] shadow-xs">
                <span className="font-bold text-[#64748B] block uppercase text-[10px]">Stage 3: Price Negotiation</span>
                <div className="text-lg font-black text-[#0F172A] mt-1">4 Active Quotes</div>
                <span className="text-[10px] text-[#2563EB]">Under Director Review</span>
              </div>
              <div className="p-3 bg-[#EFF6FF] rounded-md border border-[#BFDBFE] shadow-xs">
                <span className="font-bold text-[#1D4ED8] block uppercase text-[10px]">Stage 4: Won / Delivery</span>
                <div className="text-lg font-black text-[#1D4ED8] mt-1">8 Closed ($1.8M)</div>
                <span className="text-[10px] text-[#1D4ED8]">Pending Registration</span>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODULE: ACCOUNTING & FINANCIAL LEDGER [ERP-13, ERP-14]             */}
        {/* ================================================================= */}
        {activeModule === "Accounting & Finance" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <KPICard title="Gross Margin (Nov 2026)" value="$642,800" change="+14.2% vs target" icon={<FiDollarSign className="w-4 h-4" />} />
              <KPICard title="Accounts Receivable" value="$210,000" change="3 Invoices Pending" icon={<FiClock className="w-4 h-4" />} />
              <KPICard title="Broker Commissions" value="$42,500" change="Approved for Wire" icon={<FiUsers className="w-4 h-4" />} />
            </div>

            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB]">Vehicle Realized Margins Ledger</h3>
                <Button variant="outline" size="sm" onClick={() => alert("Exporting General Ledger to CSV...")}>
                  Export CSV Ledger
                </Button>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { stockId: "STK-2026-001", model: "Mercedes Maybach S580", landedCost: "$140,700", soldPrice: "$165,000", netMargin: "+$24,300 (14.7%)", date: "2026-11-04" },
                  { stockId: "STK-2026-002", model: "Porsche 911 Turbo S", landedCost: "$188,400", soldPrice: "$220,000", netMargin: "+$31,600 (14.4%)", date: "2026-11-02" },
                  { stockId: "STK-2026-003", model: "Range Rover Autobiography", landedCost: "$152,000", soldPrice: "$179,000", netMargin: "+$27,000 (15.1%)", date: "2026-10-29" },
                ].map((row) => (
                  <div key={row.stockId} className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono">
                    <div>
                      <span className="font-bold text-[#0F172A]">{row.model}</span>
                      <span className="text-[#64748B] text-[11px] block">{row.stockId} &bull; Sold: {row.date}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-[#64748B]">Landed: {row.landedCost}</span>
                      <span className="text-[#0F172A] font-bold">Sold: {row.soldPrice}</span>
                      <span className="text-[#2563EB] font-bold">{row.netMargin}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODULE: HR, STAFF & APPLICANT TRACKER [ERP-15]                    */}
        {/* ================================================================= */}
        {activeModule === "HR & Recruitment" && (
          <div className="space-y-4">
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E2E8F0]">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB]">
                    Public Career Applications & Recruitment Pipeline
                  </h3>
                  <p className="text-[11px] text-[#64748B]">Direct applicants submitted through the public /careers job board</p>
                </div>
                <Badge variant="gold" size="sm">5 Candidates Under Review</Badge>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { name: "Chibuike Okafor", role: "Senior VIP Luxury Sales Executive", appliedDate: "2026-11-04", exp: "8 Years Auto Sales", status: "Interview Scheduled", resume: "Chibuike_CV.pdf" },
                  { name: "Fatima Al-Hassan", role: "Customs & Port Logistics Specialist", appliedDate: "2026-11-03", exp: "5 Years Tin Can Clearing", status: "Shortlisted", resume: "Fatima_Resume.pdf" },
                  { name: "Tariq Danladi", role: "Senior Master Certified Technician", appliedDate: "2026-11-01", exp: "12 Years Porsche/Mercedes Diagnostic", status: "Technical Assessment", resume: "Tariq_Certificates.pdf" },
                  { name: "Grace Adebayo", role: "Digital Automotive Marketing Lead", appliedDate: "2026-10-29", exp: "6 Years Automotive Content", status: "Application Received", resume: "Grace_Portfolio.pdf" },
                ].map((cand, ci) => (
                  <div key={ci} className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <div className="font-bold text-[#0F172A] text-sm">{cand.name}</div>
                      <span className="text-[#2563EB] font-semibold">{cand.role}</span>
                      <span className="text-[#64748B] text-[11px] block">Applied: {cand.appliedDate} &bull; Experience: {cand.exp}</span>
                    </div>
                    <div className="flex items-center gap-2.5 self-end sm:self-auto">
                      <button
                        onClick={() => alert(`Reviewing resume: ${cand.resume}`)}
                        className="px-2.5 py-1 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] hover:bg-[#2563EB] hover:text-[#FFFFFF] text-xs font-semibold transition-colors cursor-pointer"
                      >
                        View CV
                      </button>
                      <Badge variant="gold" size="sm">{cand.status}</Badge>
                      <button
                        onClick={() => alert(`Interview link sent to ${cand.name}`)}
                        className="px-2.5 py-1 rounded-md bg-[#2563EB] text-white hover:bg-[#1D4ED8] text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Schedule Interview
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODULE: ROLES & RBAC PERMISSION MATRIX [ERP-16]                   */}
        {/* ================================================================= */}
        {activeModule === "Roles & RBAC" && (
          <div className="space-y-4">
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB]">11-Tier Role-Based Access Control (RBAC)</h3>
                  <p className="text-[11px] text-[#64748B]">Granular permissions across dealership executive, sales, workshop, and finance modules</p>
                </div>
                <Badge variant="gold" size="sm">Strict Isolation Active</Badge>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { role: "Super Admin / Dealer Principal", users: "2 Users", access: "Full Root P&L, Director Approvals, Inventory Edit, Landed Margins", status: "Active" },
                  { role: "Sales Executive / Closer", users: "6 Users", access: "View Stock, Create Quotes, Book Test Drives (NO Margin / Landed Cost)", status: "Active" },
                  { role: "Customs & Logistics Specialist", users: "3 Users", access: "Vessel Tracking, Bill of Lading, SGD Filing, Port Demurrage Logs", status: "Active" },
                  { role: "Master Technician / Workshop Lead", users: "4 Users", access: "150-Point PDI Forms, Workshop Job Cards, OBD-II Diagnostic Seal", status: "Active" },
                  { role: "Chief Accountant & Auditor", users: "2 Users", access: "Financial Ledger, Invoices, Bank Wires, Landed Margin Audits", status: "Active" },
                ].map((r, ri) => (
                  <div key={ri} className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-[#0F172A]">{r.role}</div>
                      <span className="text-[11px] text-[#64748B] block mt-0.5">{r.access}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-[#2563EB] font-bold">{r.users}</span>
                      <Badge variant="gold" size="sm">{r.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODULE: DOCUMENT VAULT [ERP-17]                                   */}
        {/* ================================================================= */}
        {activeModule === "Document Vault" && (
          <div className="space-y-4">
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E2E8F0]">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB]">Dealership Document Vault</h3>
                  <p className="text-[11px] text-[#64748B]">Cryptographically watermarked titles, customs SGDs, and delivery inspection sheets</p>
                </div>
                <Button variant="outline" size="sm" leftIcon={<FiDownload className="w-3.5 h-3.5 text-[#2563EB]" />}>
                  Upload Document
                </Button>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { name: "Single Goods Declaration (SGD) - Port of Lagos Release", car: "Maybach S580 (VIN: WDD223...)", type: "Customs Duty Certificate", date: "2026-11-02", size: "2.1 MB PDF" },
                  { name: "150-Point Pre-Delivery Inspection (PDI) Health Seal", car: "Porsche 911 Turbo S (VIN: WP0AD2...)", type: "Diagnostic Inspection", date: "2026-11-01", size: "3.4 MB PDF" },
                  { name: "Certificate of Ownership & Title Registration", car: "Range Rover Autobiography (VIN: SALWR2...)", type: "Title Document", date: "2026-10-28", size: "1.9 MB PDF" },
                  { name: "Marine Cargo Bill of Lading (B/L) - Antwerp Discharge", car: "Ferrari 296 GTB (VIN: ZFF88...)", type: "Bill of Lading", date: "2026-10-24", size: "1.6 MB PDF" },
                ].map((doc, di) => (
                  <div key={di} className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB]">
                        <FiFileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-[#0F172A]">{doc.name}</div>
                        <span className="text-[10px] text-[#64748B] block">{doc.car} &bull; {doc.type} &bull; {doc.size}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Downloading watermarked PDF: ${doc.name}`)}
                      className="px-3 py-1.5 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] hover:bg-[#2563EB] hover:text-[#FFFFFF] text-xs font-semibold self-start sm:self-auto transition-colors cursor-pointer"
                    >
                      Download PDF
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODULE: CONTENT MANAGEMENT SYSTEM (CMS) [ERP-18]                  */}
        {/* ================================================================= */}
        {activeModule === "CMS Manager" && (
          <div className="space-y-4">
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 sm:p-5 shadow-xs space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB]">Website Content & Promotions Manager</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] space-y-2">
                  <span className="font-bold text-[#0F172A] block">Homepage Hero Headline</span>
                  <Input defaultValue="DRIVE YOUR DREAM CAR" />
                  <Button variant="primary" size="sm">Update Hero</Button>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] space-y-2">
                  <span className="font-bold text-[#0F172A] block">Featured Showcase Cars</span>
                  <Dropdown
                    label="Pinned Vehicle"
                    options={[
                      { label: "Mercedes Maybach S580", value: "STK-2026-001" },
                      { label: "Porsche 911 Turbo S", value: "STK-2026-002" },
                    ]}
                    onChange={() => {}}
                  />
                  <Button variant="outline" size="sm">Pin to Featured</Button>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] space-y-2">
                  <span className="font-bold text-[#0F172A] block">Publish Announcement</span>
                  <Input placeholder="Headline..." />
                  <Button variant="primary" size="sm">Publish to News</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODULE: SETTINGS & BRANCH CONFIG                                  */}
        {/* ================================================================= */}
        {activeModule === "Settings" && (
          <div className="space-y-4">
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 sm:p-5 shadow-xs space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB]">Platform & Branch Configurations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] space-y-2">
                  <span className="font-bold text-[#0F172A] block">Financial Parameters</span>
                  <Input label="USD to NGN Exchange Rate" defaultValue="1500" />
                  <Input label="VAT / Sales Tax (%)" defaultValue="7.5" />
                  <Input label="Reservation Deposit Lockout (Hours)" defaultValue="48" />
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] space-y-2">
                  <span className="font-bold text-[#0F172A] block">Showroom Hubs</span>
                  <div className="space-y-1.5 text-[11px] text-[#475569]">
                    <div className="p-2 bg-[#FFFFFF] rounded-md border border-[#E2E8F0] flex justify-between shadow-xs">
                      <span>Lagos Victoria Island (HQ Flagship)</span>
                      <Badge variant="gold" size="sm">Active</Badge>
                    </div>
                    <div className="p-2 bg-[#FFFFFF] rounded-md border border-[#E2E8F0] flex justify-between shadow-xs">
                      <span>Abuja Maitama Diplomatic Suite</span>
                      <Badge variant="gold" size="sm">Active</Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <Button variant="primary" size="sm" onClick={() => alert("Settings saved successfully!")}>
                  Save System Parameters
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add New Vehicle Modal */}
      <Modal
        isOpen={isAddVehicleOpen}
        onClose={() => setIsAddVehicleOpen(false)}
        title="Register New Vehicle to Stock"
        description="Add a new luxury vehicle to inventory for internal valuation and public listing."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsAddVehicleOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                alert("New vehicle submitted to Inventory Master Table with 'Draft Inspection' status.");
                setIsAddVehicleOpen(false);
              }}
            >
              Save Vehicle Record
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Make (Brand)" placeholder="e.g. Mercedes-Benz" required />
            <Input label="Model & Trim" placeholder="e.g. S580 4MATIC Maybach" required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input label="Model Year" placeholder="2026" required />
            <Input label="Chassis / VIN" placeholder="WDD223..." required />
            <Input label="Mileage (KM)" placeholder="1,500" required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="FOB Purchase Price ($)" placeholder="118500" required />
            <Input label="Target Showroom Price ($)" placeholder="165000" required />
          </div>
          <Dropdown
            label="Initial Allocation Hub"
            options={[
              { label: "Victoria Island HQ Flagship, Lagos", value: "Lagos" },
              { label: "Maitama Diplomatic Zone, Abuja", value: "Abuja" },
              { label: "Tin Can Port Transit Holding Bay", value: "Tin Can" },
            ]}
            onChange={() => {}}
          />
        </div>
      </Modal>

      {/* Dispatch Branch Transfer Modal */}
      <Modal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        title="Dispatch Inter-Branch Carrier"
        description="Create an authorized vehicle carrier transport manifest between showroom locations."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsTransferModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                alert("Carrier dispatch authorized. Tracking number assigned.");
                setIsTransferModalOpen(false);
              }}
            >
              Authorize Carrier Dispatch
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Dropdown
            label="Select Vehicle from Stock"
            options={VEHICLES.map((v) => ({ label: `${v.stockId} - ${v.make} ${v.model}`, value: v.stockId }))}
            onChange={() => {}}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Dropdown
              label="Source Showroom"
              options={[
                { label: "Lagos Victoria Island HQ", value: "Lagos" },
                { label: "Abuja Maitama Diplomatic Suite", value: "Abuja" },
              ]}
              onChange={() => {}}
            />
            <Dropdown
              label="Destination Showroom"
              options={[
                { label: "Abuja Maitama Diplomatic Suite", value: "Abuja" },
                { label: "Lagos Victoria Island HQ", value: "Lagos" },
              ]}
              onChange={() => {}}
            />
          </div>
          <Input label="Assigned Carrier / Hauler Service" placeholder="e.g. Swift Luxury Flatbed Logistics" required />
          <Input label="Driver Name & Contact Number" placeholder="e.g. Musa Danladi (+234 803 111 2222)" required />
        </div>
      </Modal>
    </DashboardLayout>
  );
}

export default function ERPConsolePage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#F8FAFC]" />}>
      <ERPConsoleContent />
    </React.Suspense>
  );
}
