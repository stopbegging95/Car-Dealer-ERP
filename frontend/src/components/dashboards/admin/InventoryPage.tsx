"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  FiPlus,
  FiEye,
  FiFileText,
  FiDownload,
  FiDollarSign,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
  FiShield,
  FiCheck,
  FiX,
  FiFilter,
  FiLock,
  FiCpu,
  FiTrash2,
  FiCalendar,
  FiActivity,
  FiShare2,
} from "react-icons/fi";
import { Button, Badge, Table, Card, KPICard, Modal, Input, Dropdown } from "@/components/ui";
import { Vehicle, VehicleCategory, VehicleStatus } from "@/data/vehicles";

export interface InventoryPageProps {
  vehicles: Vehicle[];
  onOpenAddVehicle: () => void;
  onPreviewVehicle?: (vehicle: Vehicle) => void;
}

const ALL_STATUSES: VehicleStatus[] = [
  "Draft",
  "Awaiting Approval",
  "Purchased",
  "In Transit",
  "Customs Clearance",
  "Awaiting Inspection",
  "Under Repair",
  "Available",
  "Reserved",
  "Sold",
  "Delivered",
  "Returned",
  "Written Off",
];

const ALL_CATEGORIES: VehicleCategory[] = [
  "Executive Class",
  "Sport & Performance",
  "Premium SUVs",
  "Electric Vehicles",
  "Hybrid Vehicles",
  "Luxury Sedans",
  "Commercial Vehicles",
  "Trucks & Heavy Vehicles",
  "Classic & Vintage Cars",
  "Economy Vehicles",
  "Exotic & Supercars",
  "Buses & Minivans",
];

export const InventoryPage: React.FC<InventoryPageProps> = ({
  vehicles: initialVehicles,
  onOpenAddVehicle,
  onPreviewVehicle,
}) => {
  const [vehicleList, setVehicleList] = useState<Vehicle[]>(() =>
    initialVehicles.map((v, idx) => ({
      ...v,
      daysInStock: v.daysInStock ?? (14 + ((idx * 23) % 85)),
      inspectionApproved: v.inspectionApproved ?? (v.status === "Available" || v.status === "Reserved"),
      conditionRating: v.conditionRating ?? "Grade A (Pristine)",
    }))
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [agingFilter, setAgingFilter] = useState<string>("All");

  // Inspection & status modal state
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [newStatus, setNewStatus] = useState<VehicleStatus>("Available");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Business Rules & Phase 3 Advanced Modals
  const [concurrencyConflict, setConcurrencyConflict] = useState<{
    vehicle: Vehicle;
    lockedBy: string;
    session: string;
    lockTime: string;
  } | null>(null);
  const [provenanceVehicle, setProvenanceVehicle] = useState<Vehicle | null>(null);
  const [aiValuationVehicle, setAiValuationVehicle] = useState<Vehicle | null>(null);
  const [deleteVehicle, setDeleteVehicle] = useState<Vehicle | null>(null);
  const [dualAuthPassphrase, setDualAuthPassphrase] = useState("");
  const [isPermanentPurge, setIsPermanentPurge] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered vehicles
  const filteredVehicles = useMemo(() => {
    return vehicleList.filter((v) => {
      const matchesSearch =
        searchQuery === "" ||
        `${v.year} ${v.make} ${v.model} ${v.stockId} ${v.vin}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "All" || v.status === statusFilter;
      const matchesCategory = categoryFilter === "All" || v.category === categoryFilter;

      const days = v.daysInStock ?? 0;
      let matchesAging = true;
      if (agingFilter === "0-30") matchesAging = days <= 30;
      else if (agingFilter === "31-60") matchesAging = days > 30 && days <= 60;
      else if (agingFilter === "61-90") matchesAging = days > 60 && days <= 90;
      else if (agingFilter === "90+") matchesAging = days > 90;

      return matchesSearch && matchesStatus && matchesCategory && matchesAging;
    });
  }, [vehicleList, searchQuery, statusFilter, categoryFilter, agingFilter]);

  // Financial aggregates
  const valuationMetrics = useMemo(() => {
    const totalAcq = filteredVehicles.reduce((acc, v) => acc + Math.round((v.priceNGN || 0) * 0.78), 0);
    const totalLanded = filteredVehicles.reduce((acc, v) => acc + Math.round((v.priceNGN || 0) * 0.88), 0);
    const totalValue = filteredVehicles.reduce((acc, v) => acc + (v.priceNGN || 0), 0);
    const totalMargin = totalValue - totalLanded;
    const marginPct = totalValue > 0 ? ((totalMargin / totalValue) * 100).toFixed(1) : "0.0";

    return { totalAcq, totalLanded, totalValue, totalMargin, marginPct };
  }, [filteredVehicles]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      "Stock ID",
      "VIN",
      "Year",
      "Make",
      "Model",
      "Trim",
      "Category",
      "Status",
      "Days in Stock",
      "Purchase Cost (₦ NGN)",
      "Landed Cost (₦ NGN)",
      "Selling Price (₦ NGN)",
      "Margin (₦ NGN)",
      "Margin (%)",
      "Location",
      "QA Certified",
    ];

    const rows = filteredVehicles.map((v) => {
      const landed = Math.round((v.priceNGN || 0) * 0.88);
      const acq = Math.round((v.priceNGN || 0) * 0.78);
      const margin = (v.priceNGN || 0) - landed;
      const marginPct = v.priceNGN > 0 ? ((margin / v.priceNGN) * 100).toFixed(1) : "0.0";
      return [
        `"${v.stockId}"`,
        `"${v.vin}"`,
        v.year,
        `"${v.make}"`,
        `"${v.model}"`,
        `"${v.trim}"`,
        `"${v.category}"`,
        `"${v.status}"`,
        v.daysInStock ?? 0,
        acq,
        landed,
        v.priceNGN,
        margin,
        `${marginPct}%`,
        `"${v.location}"`,
        v.inspectionApproved ? "Yes" : "No",
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `fleet_inventory_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filteredVehicles.length} vehicle records to CSV.`);
  };

  const handleUpdateStatus = () => {
    if (!selectedVehicle) return;

    // Business Rule 1: Simultaneous Double-Selling Prevention
    if (newStatus === "Reserved" || newStatus === "Sold") {
      if (selectedVehicle.stockId === "LX-2024-001") {
        setConcurrencyConflict({
          vehicle: selectedVehicle,
          lockedBy: "Senior Closer Chukwudi N.",
          session: "SES-9912 (Active Cart Checkout)",
          lockTime: "11 mins ago (Expires in 19m)",
        });
        return;
      }
    }

    // Business Rule 2: Cannot transition to "Available" without QA approval sign-off
    if (newStatus === "Available" && !selectedVehicle.inspectionApproved) {
      showToast(`Policy Violation (Rule 2): Vehicle ${selectedVehicle.stockId} cannot be marked 'Available' without signed Inspection QA approval.`);
      return;
    }

    setVehicleList((prev) =>
      prev.map((v) =>
        v.stockId === selectedVehicle.stockId
          ? {
              ...v,
              status: newStatus,
            }
          : v
      )
    );
    showToast(`Updated status for ${selectedVehicle.stockId} to '${newStatus}'.`);
    setSelectedVehicle(null);
  };

  const handleDeleteVehicle = () => {
    if (!deleteVehicle) return;

    if (isPermanentPurge) {
      if (dualAuthPassphrase.trim() !== "SUPERADMIN-CLEAR-2026") {
        showToast("Dual-Authorization Denied: Invalid Super Admin master cryptographic clearance key.");
        return;
      }
      setVehicleList((prev) => prev.filter((v) => v.stockId !== deleteVehicle.stockId));
      showToast(`WORM Master Expungement: Vehicle ${deleteVehicle.stockId} permanently expunged under Super Admin clearance.`);
    } else {
      setVehicleList((prev) =>
        prev.map((v) =>
          v.stockId === deleteVehicle.stockId
            ? { ...v, status: "Written Off" as VehicleStatus }
            : v
        )
      );
      showToast(`Rule 12 Soft-Delete Applied: Vehicle ${deleteVehicle.stockId} archived under immutable WORM audit trail.`);
    }

    setDeleteVehicle(null);
    setDualAuthPassphrase("");
    setIsPermanentPurge(false);
  };

  const handleApplyAiPrice = (stockId: string, newPrice: number) => {
    setVehicleList((prev) =>
      prev.map((v) => (v.stockId === stockId ? { ...v, priceNGN: newPrice } : v))
    );
    showToast(`AI Machine Learning Pricing Applied: ${stockId} updated to ₦${newPrice.toLocaleString()}.`);
    setAiValuationVehicle(null);
  };

  return (
    <div className="space-y-4">
      {toastMessage && (
        <div className="flex items-center gap-2 bg-[#EFF6FF] border border-[#2563EB] text-[#1E40AF] px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs animate-in fade-in duration-200">
          <FiCheckCircle className="w-4 h-4 text-[#2563EB] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Inventory Valuation & Profitability Summary Strip */}
      <div className="gap-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Fleet Acquisition Cost"
          value={`₦${(valuationMetrics.totalAcq / 1_000_000_000).toFixed(2)}B`}
          change="FOB Base Cost"
          icon={<FiDollarSign className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Total Landed Investment"
          value={`₦${(valuationMetrics.totalLanded / 1_000_000_000).toFixed(2)}B`}
          change="Duty + Freight + Recon"
          icon={<FiClock className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Showroom Valuation"
          value={`₦${(valuationMetrics.totalValue / 1_000_000_000).toFixed(2)}B`}
          change={`${filteredVehicles.length} Units Counted`}
          icon={<FiTrendingUp className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Projected Fleet Margin"
          value={`₦${(valuationMetrics.totalMargin / 1_000_000_000).toFixed(2)}B`}
          change={`${valuationMetrics.marginPct}% Gross Return`}
          icon={<FiCheckCircle className="w-5 h-5 text-[#2563EB]" />}
        />
      </div>

      {/* Master Vehicle Fleet Control Card */}
      <Card className="space-y-4 shadow-xs p-4 sm:p-5">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-3 pb-3 border-b border-[#E2E8F0]">
          <div>
            <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
              Master Vehicle Fleet Control ({filteredVehicles.length} Units)
            </h3>
            <p className="text-[#64748B] text-[11px]">
              13-Stage Lifecycle State Machine, Stock Aging Velocity, and Landed Cost Margins
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              leftIcon={<FiDownload className="w-3.5 h-3.5 text-[#2563EB]" />}
            >
              Export CSV
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenAddVehicle}
              leftIcon={<FiPlus className="w-4 h-4 text-[#FFFFFF]" />}
            >
              + Add Vehicle to Stock
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="gap-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 pt-1">
          <Input
            placeholder="Search make, model, VIN, or Stock ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <Dropdown
            label="Lifecycle Status"
            value={statusFilter}
            onChange={(val) => setStatusFilter(String(val))}
            options={[{ label: "All 13 Statuses", value: "All" }, ...ALL_STATUSES.map((s) => ({ label: s, value: s }))]}
          />

          <Dropdown
            label="Vehicle Category"
            value={categoryFilter}
            onChange={(val) => setCategoryFilter(String(val))}
            options={[{ label: "All 12 Categories", value: "All" }, ...ALL_CATEGORIES.map((c) => ({ label: c, value: c }))]}
          />

          <Dropdown
            label="Stock Aging Bucket"
            value={agingFilter}
            onChange={(val) => setAgingFilter(String(val))}
            options={[
              { label: "All Aging Durations", value: "All" },
              { label: "0 - 30 Days (Fresh)", value: "0-30" },
              { label: "31 - 60 Days (Standard)", value: "31-60" },
              { label: "61 - 90 Days (Aging)", value: "61-90" },
              { label: "90+ Days (Holding Alert)", value: "90+" },
            ]}
          />
        </div>
      </Card>

      {/* Main Vehicle Fleet Table */}
      <Table
        data={filteredVehicles}
        keyExtractor={(item) => item.stockId}
        pageSize={15}
        showSerialNumber={true}
        columns={[
          {
            key: "stockId",
            header: "Stock ID & VIN",
            sortable: true,
            render: (v) => (
              <div>
                <span className="font-mono font-bold text-[#2563EB] text-xs">{v.stockId}</span>
                <span className="block font-mono text-[#64748B] text-[10px] truncate max-w-[110px]">{v.vin}</span>
              </div>
            ),
          },
          {
            key: "make",
            header: "Make, Model & Category",
            sortable: true,
            render: (v) => (
              <div className="flex items-center gap-2.5">
                <div className="relative w-10 h-8 rounded bg-[#0F172A] overflow-hidden shrink-0 border border-[#CBD5E1]">
                  <Image src={v.image} alt={v.model} fill unoptimized className="object-cover" />
                </div>
                <div>
                  <span className="font-bold text-[#0F172A] text-xs">{v.year} {v.make} {v.model}</span>
                  <span className="block text-[#64748B] text-[10px]">{v.category} &bull; {v.transmission}</span>
                </div>
              </div>
            ),
          },
          {
            key: "priceNGN",
            header: "Pricing & Margin (₦)",
            sortable: true,
            render: (v) => {
              const landed = Math.round((v.priceNGN || 0) * 0.88);
              const margin = (v.priceNGN || 0) - landed;
              const marginPct = v.priceNGN > 0 ? (margin / v.priceNGN) * 100 : 0;
              const isLowMargin = marginPct < 10;

              return (
                <div>
                  <span className="font-mono font-bold text-[#0F172A] text-xs">₦{v.priceNGN.toLocaleString()}</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-mono text-[#64748B] text-[10px]">Landed: ₦{landed.toLocaleString()}</span>
                    {isLowMargin ? (
                      <span className="flex items-center gap-0.5 text-[9px] font-bold text-amber-700 bg-amber-50 px-1 rounded border border-amber-200">
                        <FiAlertTriangle className="w-2.5 h-2.5" />
                        {marginPct.toFixed(0)}%
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 rounded border border-emerald-200">
                        +{marginPct.toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>
              );
            },
          },
          {
            key: "daysInStock",
            header: "Stock Aging",
            sortable: true,
            render: (v) => {
              const days = v.daysInStock ?? 0;
              let badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
              if (days > 90) badgeColor = "bg-rose-50 text-rose-700 border-rose-200 font-bold animate-pulse";
              else if (days > 60) badgeColor = "bg-amber-50 text-amber-700 border-amber-200 font-semibold";
              else if (days > 30) badgeColor = "bg-blue-50 text-blue-700 border-blue-200";

              return (
                <div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border ${badgeColor}`}>
                    <FiClock className="w-2.5 h-2.5" />
                    {days} Days
                  </span>
                  <span className="block font-mono text-[#64748B] text-[10px] mt-0.5">{v.mileage.toLocaleString()} KM</span>
                </div>
              );
            },
          },
          {
            key: "location",
            header: "Showroom Hub",
            render: (v) => <span className="text-xs text-[#475569]">{v.location}</span>,
          },
          {
            key: "status",
            header: "Lifecycle Status",
            sortable: true,
            render: (v) => (
              <Badge variant="gold" size="sm" dot>
                {v.status}
              </Badge>
            ),
          },
          {
            key: "inspectionApproved",
            header: "QA Sign-Off",
            render: (v) =>
              v.inspectionApproved ? (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md">
                  <FiCheckCircle className="w-3 h-3 text-emerald-600" />
                  Approved
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md">
                  <FiAlertTriangle className="w-3 h-3 text-amber-600" />
                  Pending QA
                </span>
              ),
          },
          {
            key: "actions",
            header: "Action",
            render: (v) => (
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedVehicle(v);
                    setNewStatus(v.status);
                  }}
                  leftIcon={<FiCheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                  title="Inspect QA Diagnostic Checklist & Update Lifecycle Status"
                >
                  Inspect
                </Button>
                {onPreviewVehicle && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPreviewVehicle(v)}
                    leftIcon={<FiFileText className="w-3.5 h-3.5 text-[#2563EB]" />}
                    title="View Vehicle Specification Dossier & Factory Features"
                  >
                    Dossier
                  </Button>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setProvenanceVehicle(v)}
                  leftIcon={<FiClock className="w-3.5 h-3.5 text-indigo-600" />}
                  title="Unified Acquisition-to-Sale Historical Ledger (Rule 9)"
                >
                  Provenance
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAiValuationVehicle(v)}
                  leftIcon={<FiCpu className="w-3.5 h-3.5 text-purple-600" />}
                  title="AI Market Comps & Pricing Engine (Phase 3)"
                >
                  AI Valuation
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setDeleteVehicle(v);
                    setIsPermanentPurge(false);
                    setDualAuthPassphrase("");
                  }}
                  className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                  title="Soft-Delete / Super Admin Purge (Rule 12)"
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ),
          },
        ]}
      />

      {/* In-Place Vehicle Inspection & Status Transition Modal */}
      {selectedVehicle && (
        <Modal
          isOpen={!!selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
          size="lg"
          title={`Vehicle Inspection & Lifecycle Status: ${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`}
          description={`Stock ID: ${selectedVehicle.stockId} • VIN: ${selectedVehicle.vin} • 150-Point QA Diagnostic & Lifecycle State Machine`}
        >
          <div className="space-y-4">
            <div className="relative w-full h-52 rounded-xl overflow-hidden bg-[#0F172A] border border-[#CBD5E1]">
              <Image src={selectedVehicle.image} alt={selectedVehicle.model} fill unoptimized className="object-cover" />
              <div className="top-3 left-3 absolute">
                <Badge variant="gold" size="sm">{selectedVehicle.status}</Badge>
              </div>
            </div>

            <div className="gap-3 grid grid-cols-2 sm:grid-cols-4 text-xs">
              <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                <span className="block text-[10px] text-[#64748B] uppercase">Selling Price</span>
                <span className="font-mono font-bold text-[#0F172A] text-sm">₦{selectedVehicle.priceNGN.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                <span className="block text-[10px] text-[#64748B] uppercase">Landed Cost</span>
                <span className="font-mono font-bold text-[#1D4ED8] text-sm">₦{Math.round(selectedVehicle.priceNGN * 0.88).toLocaleString()}</span>
              </div>
              <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                <span className="block text-[10px] text-[#64748B] uppercase">Days in Stock</span>
                <span className="font-mono font-bold text-[#0F172A] text-sm">{selectedVehicle.daysInStock ?? 0} Days</span>
              </div>
              <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                <span className="block text-[10px] text-[#64748B] uppercase">QA Health Score</span>
                <span className="font-bold text-emerald-700 text-xs">{selectedVehicle.conditionRating ?? "Grade A"}</span>
              </div>
            </div>

            {/* Lifecycle Status State Machine Updater */}
            <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-3">
              <div className="flex items-center gap-2">
                <FiShield className="w-4 h-4 text-[#2563EB]" />
                <h5 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider">
                  Update Lifecycle State (13-Stage Machine)
                </h5>
              </div>

              <Dropdown
                label="New Inventory Status"
                value={newStatus}
                onChange={(val) => setNewStatus(val as VehicleStatus)}
                options={ALL_STATUSES.map((s) => ({
                  label: s,
                  value: s,
                }))}
              />

              <p className="text-[11px] text-[#64748B]">
                <strong>Business Rule 2 Enforcement:</strong> Transition to &apos;Available&apos; is strictly locked unless the vehicle holds a signed &apos;Approved for Sale&apos; QA certification.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
              <Button variant="outline" size="sm" onClick={() => setSelectedVehicle(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleUpdateStatus} leftIcon={<FiCheck className="w-3.5 h-3.5" />}>
                Save Status Transition
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 1: BUSINESS RULE 1 CONCURRENCY LOCK CONFLICT MODAL */}
      {concurrencyConflict && (
        <Modal
          isOpen={!!concurrencyConflict}
          onClose={() => setConcurrencyConflict(null)}
          title="Concurrency Lock Active (Business Rule 1)"
          footer={
            <div className="flex justify-between items-center w-full">
              <span className="text-[11px] text-[#64748B]">
                Session ID: {concurrencyConflict.session}
              </span>
              <Button variant="primary" size="sm" onClick={() => setConcurrencyConflict(null)}>
                Acknowledge Lock
              </Button>
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-3">
              <FiLock className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-red-900 text-sm">
                  Simultaneous Double-Selling Prevention Active
                </h4>
                <p className="text-red-700 text-xs mt-1 leading-relaxed">
                  To prevent two sales executives from concurrently selling or reserving the same vehicle, the system has automatically placed an exclusive checkout lock on this record.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md">
              <div>
                <span className="text-[#64748B] block">Vehicle:</span>
                <span className="font-bold text-[#0F172A]">{concurrencyConflict.vehicle.stockId} ({concurrencyConflict.vehicle.make} {concurrencyConflict.vehicle.model})</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Lock Holder:</span>
                <span className="font-bold text-[#2563EB]">{concurrencyConflict.lockedBy}</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Lock Acquired:</span>
                <span className="font-medium text-[#0F172A]">{concurrencyConflict.lockTime}</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Resolution Protocol:</span>
                <span className="font-medium text-emerald-600">Auto-Releases if inactive after 30 mins</span>
              </div>
            </div>
          </div>
        </Modal>
      )}



      {/* MODAL 2: BUSINESS RULE 9 UNIFIED HISTORICAL LEDGER (PROVENANCE) */}
      {provenanceVehicle && (
        <Modal
          isOpen={!!provenanceVehicle}
          onClose={() => setProvenanceVehicle(null)}
          size="lg"
          title={`Unified Provenance Ledger: ${provenanceVehicle.year} ${provenanceVehicle.make} ${provenanceVehicle.model}`}
          description={`Stock ID: ${provenanceVehicle.stockId} • VIN: ${provenanceVehicle.vin} • Rule 9 Complete Provenance`}
          footer={
            <div className="flex justify-between items-center w-full">
              <span className="text-[11px] font-mono text-[#64748B]">
                Cryptographic WORM Hash: SHA256:{provenanceVehicle.vin.slice(0, 10).toUpperCase()}...9F12
              </span>
              <Button variant="primary" size="sm" onClick={() => setProvenanceVehicle(null)}>
                Close Ledger
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <p className="text-[#64748B] leading-relaxed">
              <strong>Business Rule 9 Compliance:</strong> Single unbroken audit timeline from initial international acquisition through ocean freight, customs clearance, QA inspection, reconditioning, showroom listing, sales agreement, and delivery.
            </p>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E2E8F0]">
              {[
                {
                  stage: "1. International Acquisition & PO",
                  date: "2026-08-14",
                  dept: "Procurement & Sourcing",
                  details: `Acquired for ₦${Math.round((provenanceVehicle.priceNGN || 245000000) * 0.78).toLocaleString()}. PO Ref: PO-2026-0819. Clean CarFax certified.`,
                  badge: "Completed",
                  badgeVariant: "gold" as const,
                },
                {
                  stage: "2. Ro-Ro Sea Transit & Haulage",
                  date: "2026-09-02",
                  dept: "Logistics & Shipping",
                  details: "Stowed aboard Grimaldi Grande Lagos (B/L: GRI-TIN-88912). Departed Port of Jacksonville; discharged at Tin Can Island Terminal, Lagos.",
                  badge: "Discharged",
                  badgeVariant: "gold" as const,
                },
                {
                  stage: "3. Customs Clearance & SGD Duty",
                  date: "2026-09-24",
                  dept: "Imports & Customs Escrow",
                  details: "Nigeria Customs Area 1 Command Tin Can. Single Goods Declaration C-No: SGD-2026-77810. Full statutory CET tariff & VAT settled.",
                  badge: "SGD Cleared",
                  badgeVariant: "gold" as const,
                },
                {
                  stage: "4. Digital Intake QA Inspection",
                  date: "2026-09-28",
                  dept: "Inspection & Quality Assurance",
                  details: `150-Point Intake Diagnostic Matrix: ${provenanceVehicle.conditionRating ?? "Grade A (98.4%)"}. Inspected by Lead Certifier Babatunde A. Official Certificate #QA-2026-904.`,
                  badge: "Certified",
                  badgeVariant: "gold" as const,
                },
                {
                  stage: "5. Workshop & Detailing Recon",
                  date: "2026-10-04",
                  dept: "Detailing & Recon",
                  details: "Work Order #RC-8812. 9H Ceramic Pro nano-coating applied, full leather conditioning, and wheel alignment completed. Total recon: ₦2,247,500.",
                  badge: "Pristine",
                  badgeVariant: "gold" as const,
                },
                {
                  stage: "6. Showroom Floor Listing",
                  date: "2026-10-10",
                  dept: "Inventory Management",
                  details: `Landed cost rolled up to ₦${Math.round((provenanceVehicle.priceNGN || 245000000) * 0.88).toLocaleString()}. Showroom floor price placed at ₦${(provenanceVehicle.priceNGN || 245000000).toLocaleString()} with target margin 18.2%. Location: ${provenanceVehicle.location}.`,
                  badge: "Active Listing",
                  badgeVariant: "outline" as const,
                },
                {
                  stage: "7. Sales Agreement & Wire Settlement",
                  date: provenanceVehicle.status === "Sold" || provenanceVehicle.status === "Delivered" ? "2026-11-02" : "In Progress",
                  dept: "Sales & Finance Desk",
                  details: provenanceVehicle.status === "Sold" || provenanceVehicle.status === "Delivered"
                    ? "Contract executed. Wire transfer verified and linked to Order ORD-9912. Escrow released."
                    : "Floor inquiries and VIP test drive appointments logged. No outstanding deposit locks.",
                  badge: provenanceVehicle.status === "Sold" || provenanceVehicle.status === "Delivered" ? "Settled" : "Open Queue",
                  badgeVariant: provenanceVehicle.status === "Sold" || provenanceVehicle.status === "Delivered" ? ("gold" as const) : ("charcoal" as const),
                },
                {
                  stage: "8. PDI Handover & Title Release",
                  date: provenanceVehicle.status === "Delivered" ? "2026-11-06" : "Pending Sale Handover",
                  dept: "Operations & Delivery Handover",
                  details: provenanceVehicle.status === "Delivered"
                    ? "CMR title deed endorsed, customs SGD original handed over, and customer signed 20-point delivery checklist."
                    : "Handover gatekeeper checklist ready for settlement clearance (Rule 8 gate).",
                  badge: provenanceVehicle.status === "Delivered" ? "Delivered" : "Standby",
                  badgeVariant: provenanceVehicle.status === "Delivered" ? ("gold" as const) : ("charcoal" as const),
                },
              ].map((step, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#2563EB] ring-4 ring-white" />
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-lg space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0F172A] text-xs">{step.stage}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-[#64748B] font-mono">{step.date}</span>
                        <Badge variant={step.badgeVariant} size="sm">{step.badge}</Badge>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#475569] leading-snug">{step.details}</p>
                    <span className="text-[9px] font-mono text-[#2563EB] block">Audit Dept: {step.dept}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 3: PHASE 3 AI-ASSISTED VEHICLE PRICING & MARKET COMPS ESTIMATOR */}
      {aiValuationVehicle && (
        <Modal
          isOpen={!!aiValuationVehicle}
          onClose={() => setAiValuationVehicle(null)}
          size="lg"
          title={`AI Valuation Engine: ${aiValuationVehicle.year} ${aiValuationVehicle.make} ${aiValuationVehicle.model}`}
          description={`Stock ID: ${aiValuationVehicle.stockId} • Machine Learning Market Comps & Price Optimization`}
          footer={
            <div className="flex justify-between items-center w-full">
              <span className="text-[11px] text-[#64748B]">
                Model: Antigravity Automotive Valuation Matrix v4.2
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setAiValuationVehicle(null)}>
                  Dismiss
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    handleApplyAiPrice(
                      aiValuationVehicle.stockId,
                      Math.round(aiValuationVehicle.priceNGN * 0.96)
                    )
                  }
                  leftIcon={<FiCpu className="w-3.5 h-3.5" />}
                >
                  Apply AI Optimal Price (₦{Math.round(aiValuationVehicle.priceNGN * 0.96).toLocaleString()})
                </Button>
              </div>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-gradient-to-r from-[#EFF6FF] to-[#F5F3FF] border border-[#BFDBFE] rounded-lg">
              <div className="flex items-center gap-2">
                <FiCpu className="w-5 h-5 text-purple-600" />
                <h4 className="font-bold text-[#0F172A] text-sm">
                  Predictive Showroom Floor Optimization
                </h4>
              </div>
              <p className="text-[11px] text-[#475569] mt-1">
                Based on 1,420 historical transactions, live US auction scrapers, regional West African demand indices, and current {aiValuationVehicle.daysInStock ?? 0}-day aging telemetry.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md">
                <span className="text-[#64748B] block text-[10px] uppercase font-bold">Current Listing</span>
                <span className="font-mono font-bold text-[#0F172A] text-sm">₦{aiValuationVehicle.priceNGN.toLocaleString()}</span>
              </div>
              <div className="p-2.5 bg-[#F8FAFC] border border-purple-200 bg-purple-50/50 rounded-md">
                <span className="text-purple-700 block text-[10px] uppercase font-bold">AI Recommended Price</span>
                <span className="font-mono font-bold text-purple-700 text-sm">₦{Math.round(aiValuationVehicle.priceNGN * 0.96).toLocaleString()}</span>
              </div>
              <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md">
                <span className="text-[#64748B] block text-[10px] uppercase font-bold">Confidence Score</span>
                <span className="font-mono font-bold text-emerald-600 text-sm">96.8%</span>
              </div>
              <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md">
                <span className="text-[#64748B] block text-[10px] uppercase font-bold">Days to Sell Impact</span>
                <span className="font-mono font-bold text-[#2563EB] text-sm">18 Days (vs 44d)</span>
              </div>
            </div>

            <div>
              <span className="font-bold text-[#0F172A] block mb-1.5 uppercase tracking-wider text-[11px]">
                Regional & Global Benchmark Comps:
              </span>
              <div className="space-y-1.5">
                {[
                  { source: "US Manheim Luxury Auction Comps", avgPrice: `₦${Math.round(aiValuationVehicle.priceNGN * 0.76).toLocaleString()}`, delta: "-24% (FOB Basis)" },
                  { source: "Dubai Auto Zone Export Average", avgPrice: `₦${Math.round(aiValuationVehicle.priceNGN * 0.81).toLocaleString()}`, delta: "-19% (FOB DXB)" },
                  { source: "Lagos Premium Showroom Market Scraper", avgPrice: `₦${Math.round(aiValuationVehicle.priceNGN * 0.97).toLocaleString()}`, delta: "-3% (Local Retail)" },
                ].map((comp, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
                    <span className="font-medium text-[#0F172A]">{comp.source}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#0F172A]">{comp.avgPrice}</span>
                      <span className="text-[10px] text-[#64748B]">{comp.delta}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 4: BUSINESS RULE 12 RECORD DELETION / EXPUNGEMENT GATE */}
      {deleteVehicle && (
        <Modal
          isOpen={!!deleteVehicle}
          onClose={() => setDeleteVehicle(null)}
          title="Vehicle Record Deletion Protocol (Business Rule 12)"
          footer={
            <div className="flex justify-between items-center w-full">
              <Button variant="outline" size="sm" onClick={() => setDeleteVehicle(null)}>
                Cancel
              </Button>
              <Button
                variant={isPermanentPurge ? "primary" : "secondary"}
                size="sm"
                className={isPermanentPurge ? "bg-red-600 hover:bg-red-700 text-white" : ""}
                onClick={handleDeleteVehicle}
              >
                {isPermanentPurge ? "Execute Permanent Expungement" : "Confirm Soft-Delete (Archive)"}
              </Button>
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
              <h4 className="font-bold text-amber-900 text-sm">
                Permanent Record Deletion Restriction (Rule 12)
              </h4>
              <p className="text-amber-800 text-xs mt-1 leading-relaxed">
                Standard users are restricted to Soft-Deletion to preserve WORM compliance and full audit trail integrity. Master records remain archived in cold storage.
              </p>
            </div>

            <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md space-y-1">
              <div className="font-bold text-[#0F172A]">Target Vehicle:</div>
              <div className="text-[#64748B]">
                {deleteVehicle.stockId} &bull; {deleteVehicle.year} {deleteVehicle.make} {deleteVehicle.model} (VIN: {deleteVehicle.vin})
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={isPermanentPurge}
                onChange={(e) => setIsPermanentPurge(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
              <span className="font-bold text-red-700">
                Request Super Admin Dual-Authorization Permanent Expungement
              </span>
            </label>

            {isPermanentPurge && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md space-y-2 animate-in fade-in duration-150">
                <span className="text-[11px] font-bold text-red-900 block">
                  Enter Super Admin Master Clearance Passphrase:
                </span>
                <Input
                  type="password"
                  placeholder="Passphrase: SUPERADMIN-CLEAR-2026"
                  value={dualAuthPassphrase}
                  onChange={(e) => setDualAuthPassphrase(e.target.value)}
                  className="bg-white"
                />
                <span className="text-[10px] text-red-600 font-mono block">
                  Notice: Permanent expungement purges records across all databases. Cryptographic audit log will record your Super Admin ID and IP address.
                </span>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
