"use client";

import React, { useState } from "react";
import {
  FiNavigation,
  FiMapPin,
  FiKey,
  FiActivity,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiShield,
  FiLayers,
  FiTool,
  FiAlertTriangle,
  FiPlus,
} from "react-icons/fi";
import { Button, Badge, Card, KPICard, Table, Modal, Input, Dropdown } from "@/components/ui";

export interface TransfersPageProps {
  onOpenTransferModal: () => void;
}

interface PhysicalAsset {
  id: string;
  name: string;
  category: "Diagnostic Scanner" | "Hydraulic Vehicle Lift" | "Recovery Tow Truck" | "Dealer Trade Plate";
  location: string;
  condition: "Certified & Calibrated" | "Routine Service Due" | "Active in Field";
  assignedTo: string;
}

interface DailyActivityItem {
  id: string;
  time: string;
  type: "Gate-In" | "Gate-Out" | "Test Drive" | "Inter-Branch Transfer" | "Showroom Handover";
  vehicle: string;
  operator: string;
  status: "Completed & Verified" | "In Transit";
}

interface FacilityTicket {
  id: string;
  facility: string;
  system: "Generator & Diesel Reserve" | "Solar Inverter Array" | "Showroom HVAC" | "Starlink Redundancy";
  statusLevel: "Optimal (98%)" | "Diesel Re-fill Due (45%)" | "Active 24/7";
  technician: string;
}

export const TransfersPage: React.FC<TransfersPageProps> = ({ onOpenTransferModal }) => {
  const [activeTab, setActiveTab] = useState<"branches" | "keys" | "assets" | "activity">("branches");

  const locations = [
    {
      id: "lagos-vi",
      name: "Victoria Island Flagship HQ",
      city: "Lagos",
      type: "Primary Showroom",
      vehicles: 18,
      capacity: 25,
      throughput: "24 Cars/Mo",
      utilization: "72%",
      opex: "$42,000/Mo",
      manager: "Emeka O.",
    },
    {
      id: "abuja-maitama",
      name: "Maitama Diplomatic Suite",
      city: "Abuja",
      type: "Executive Showroom",
      vehicles: 12,
      capacity: 15,
      throughput: "14 Cars/Mo",
      utilization: "80%",
      opex: "$36,000/Mo",
      manager: "Aisha M.",
    },
    {
      id: "lagos-lekki",
      name: "Lekki Express Center",
      city: "Lagos",
      type: "Delivery & Service Hub",
      vehicles: 8,
      capacity: 12,
      throughput: "18 Cars/Mo",
      utilization: "67%",
      opex: "$24,000/Mo",
      manager: "Engr. Tunde B.",
    },
    {
      id: "tincan-yard",
      name: "Tin Can Island Bonded Yard",
      city: "Lagos Port",
      type: "Customs Holding Facility",
      vehicles: 6,
      capacity: 20,
      throughput: "30 Inbound/Mo",
      utilization: "30%",
      opex: "$18,000/Mo",
      manager: "Chibuike A.",
    },
  ];

  const yardKeySlots = [
    { slot: "Cabinet A-01", car: "2024 Mercedes-Maybach S580", vin: "WDD223...001", rfidTag: "TAG-9912", bay: "Row 1 - Bay 04", battery: "12.8V (Optimal)", status: "Secured" },
    { slot: "Cabinet A-02", car: "2024 Porsche 911 Turbo S", vin: "WP0AD2...002", rfidTag: "TAG-9910", bay: "Row 1 - Bay 05", battery: "12.6V (Optimal)", status: "Secured" },
    { slot: "Cabinet A-03", car: "2023 Range Rover Autobiography", vin: "SALWR2...003", rfidTag: "TAG-9908", bay: "Row 2 - Bay 01", battery: "12.4V (Check Due)", status: "In Maintenance" },
    { slot: "Cabinet B-04", car: "2024 Mercedes-AMG G63 Magno", vin: "W1N9G8...007", rfidTag: "TAG-9904", bay: "Row 2 - Bay 02", battery: "12.7V (Optimal)", status: "Secured" },
  ];

  const physicalAssets: PhysicalAsset[] = [
    { id: "AST-01", name: "Mercedes Xentry Diagnostic Computer V.2026", category: "Diagnostic Scanner", location: "Lekki Workshop Hub", condition: "Certified & Calibrated", assignedTo: "Engr. Tunde Bakare" },
    { id: "AST-02", name: "Porsche PIWIS III Diagnostic Tester", category: "Diagnostic Scanner", location: "Lekki Workshop Hub", condition: "Certified & Calibrated", assignedTo: "Engr. Tunde Bakare" },
    { id: "AST-03", name: "Rotary Inground 5.5-Ton Hydraulic Lift #1", category: "Hydraulic Vehicle Lift", location: "Lekki Workshop Hub", condition: "Certified & Calibrated", assignedTo: "Bay 1 Master Tech" },
    { id: "AST-04", name: "Mercedes-Benz Atego Flatbed Recovery Tow Truck", category: "Recovery Tow Truck", location: "Victoria Island HQ", condition: "Active in Field", assignedTo: "Yard Logistics Driver" },
    { id: "AST-05", name: "Dealership Commercial Trade Plates (DLA-01 & 02)", category: "Dealer Trade Plate", location: "Victoria Island HQ", condition: "Certified & Calibrated", assignedTo: "Emeka Okafor" },
  ];

  const dailyActivities: DailyActivityItem[] = [
    { id: "ACT-901", time: "08:15 AM", type: "Gate-In", vehicle: "2024 Mercedes-Maybach S580", operator: "Chibuike Alao", status: "Completed & Verified" },
    { id: "ACT-902", time: "10:30 AM", type: "Test Drive", vehicle: "2024 Porsche 911 Turbo S", operator: "Emeka Okafor", status: "Completed & Verified" },
    { id: "ACT-903", time: "01:45 PM", type: "Inter-Branch Transfer", vehicle: "2023 Range Rover Autobiography", operator: "Tow Truck Driver Segun", status: "In Transit" },
    { id: "ACT-904", time: "03:20 PM", type: "Showroom Handover", vehicle: "2024 Mercedes-AMG G63", operator: "Aisha Mohammed", status: "Completed & Verified" },
  ];

  return (
    <div className="space-y-4">
      {/* 1. Multi-Branch Operations KPI Strip */}
      <div className="gap-3 grid grid-cols-2 sm:grid-cols-4">
        <KPICard
          title="Active Facility Nodes"
          value="4 Locations"
          change="VI HQ, Abuja, Lekki, Port Yard"
          icon={<FiMapPin className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="In-Transit Carriers"
          value="2 Haulers"
          change="Lagos &harr; Abuja Corridor"
          icon={<FiTruck className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Key Tag & Slot Integrity"
          value="100% Secured"
          change="RFID Electronic Audit"
          icon={<FiKey className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Physical Assets Logged"
          value={`${physicalAssets.length} Units`}
          change="Lifts, Scanners, Haulers"
          icon={<FiTool className="w-5 h-5 text-[#2563EB]" />}
        />
      </div>

      {/* 2. Sub-Tabs Bar */}
      <Card className="shadow-xs p-3">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2">
          <div className="flex flex-wrap gap-1">
            <Button
              variant={activeTab === "branches" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("branches")}
              className="text-xs font-bold"
            >
              Multi-Branch Performance Matrix ({locations.length})
            </Button>
            <Button
              variant={activeTab === "keys" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("keys")}
              className="text-xs font-bold"
            >
              Yard Key Slot & RFID Audit ({yardKeySlots.length})
            </Button>
            <Button
              variant={activeTab === "assets" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("assets")}
              className="text-xs font-bold"
            >
              Physical Equipment & Assets ({physicalAssets.length})
            </Button>
            <Button
              variant={activeTab === "activity" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("activity")}
              className="text-xs font-bold"
            >
              Daily Operations Log ({dailyActivities.length})
            </Button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={onOpenTransferModal}
            leftIcon={<FiNavigation className="w-3.5 h-3.5" />}
          >
            + Initiate Inter-Branch Transfer
          </Button>
        </div>
      </Card>

      {/* VIEW 1: Multi-Branch Performance Matrix */}
      {activeTab === "branches" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div>
            <h4 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider">
              Multi-Branch Comparative Performance & Facility Matrix
            </h4>
            <p className="text-[11px] text-[#64748B]">
              Comparing vehicle inventory capacity, throughput velocity, bay utilization, and facility OPEX
            </p>
          </div>

          <Table
            data={locations}
            keyExtractor={(loc) => loc.id}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "name",
                header: "Facility Node & City",
                sortable: true,
                render: (loc) => (
                  <div>
                    <span className="font-bold text-[#0F172A] text-xs">{loc.name}</span>
                    <span className="block text-[10px] text-[#64748B]">{loc.city} &bull; {loc.type}</span>
                  </div>
                ),
              },
              {
                key: "vehicles",
                header: "Vehicle Capacity",
                sortable: true,
                render: (loc) => (
                  <span className="font-mono text-xs text-[#0F172A] font-semibold">
                    {loc.vehicles} / {loc.capacity} Units
                  </span>
                ),
              },
              {
                key: "throughput",
                header: "Monthly Throughput",
                sortable: true,
                render: (loc) => <span className="font-semibold text-xs text-emerald-700">{loc.throughput}</span>,
              },
              {
                key: "utilization",
                header: "Space Utilization",
                sortable: true,
                render: (loc) => (
                  <span className="font-mono text-xs font-bold text-[#1D4ED8] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {loc.utilization}
                  </span>
                ),
              },
              {
                key: "opex",
                header: "Facility OPEX",
                sortable: true,
                render: (loc) => <span className="font-mono text-xs text-[#475569]">{loc.opex}</span>,
              },
              {
                key: "manager",
                header: "Facility Master",
                render: (loc) => <span className="text-xs text-[#0F172A] font-medium">{loc.manager}</span>,
              },
            ]}
          />
        </Card>
      )}

      {/* VIEW 2: Yard Key Slot & RFID Audit */}
      {activeTab === "keys" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div>
            <h4 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider">
              Yard Key Slot, Battery Integrity & RFID Tracking
            </h4>
            <p className="text-[11px] text-[#64748B]">
              Real-time cabinet position, 12V trickle charging telemetry, and electronic key custody
            </p>
          </div>

          <Table
            data={yardKeySlots}
            keyExtractor={(k) => k.slot}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "slot",
                header: "Key Safe Slot",
                sortable: true,
                render: (k) => <span className="font-mono font-bold text-[#2563EB] text-xs">{k.slot}</span>,
              },
              {
                key: "car",
                header: "Assigned Vehicle",
                sortable: true,
                render: (k) => (
                  <div>
                    <span className="font-bold text-[#0F172A] text-xs">{k.car}</span>
                    <span className="block font-mono text-[10px] text-[#64748B]">{k.vin}</span>
                  </div>
                ),
              },
              {
                key: "bay",
                header: "Physical Yard Bay",
                render: (k) => <span className="text-xs text-[#475569]">{k.bay}</span>,
              },
              {
                key: "battery",
                header: "12V Battery Telemetry",
                render: (k) => (
                  <span className="font-mono text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {k.battery}
                  </span>
                ),
              },
              {
                key: "rfidTag",
                header: "RFID Tag ID",
                render: (k) => <span className="font-mono text-xs text-[#2563EB]">{k.rfidTag}</span>,
              },
              {
                key: "status",
                header: "Custody Status",
                render: (k) => <Badge variant="gold" size="sm">{k.status}</Badge>,
              },
            ]}
          />
        </Card>
      )}

      {/* VIEW 3: Physical Equipment & Assets */}
      {activeTab === "assets" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div>
            <h4 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider">
              Dealership Capital Equipment & Physical Asset Registry
            </h4>
            <p className="text-[11px] text-[#64748B]">
              Registry of OEM diagnostic computers, hydraulic lifts, heavy recovery haulers, and commercial trade plates
            </p>
          </div>

          <Table
            data={physicalAssets}
            keyExtractor={(ast) => ast.id}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "id",
                header: "Asset Tag",
                sortable: true,
                render: (ast) => <span className="font-mono font-bold text-[#2563EB] text-xs">{ast.id}</span>,
              },
              {
                key: "name",
                header: "Equipment Name & Spec",
                sortable: true,
                render: (ast) => (
                  <div>
                    <span className="font-bold text-[#0F172A] text-xs">{ast.name}</span>
                    <span className="block text-[10px] text-[#64748B]">{ast.category}</span>
                  </div>
                ),
              },
              {
                key: "location",
                header: "Facility Station",
                render: (ast) => <span className="text-xs text-[#475569]">{ast.location}</span>,
              },
              {
                key: "condition",
                header: "Operational Condition",
                render: (ast) => (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {ast.condition}
                  </span>
                ),
              },
              {
                key: "assignedTo",
                header: "Custodian Officer",
                render: (ast) => <span className="text-xs font-semibold text-[#0F172A]">{ast.assignedTo}</span>,
              },
            ]}
          />
        </Card>
      )}

      {/* VIEW 4: Daily Operations Log */}
      {activeTab === "activity" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div>
            <h4 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider">
              Central Operations Daily Activity & Gate Movement Log
            </h4>
            <p className="text-[11px] text-[#64748B]">
              Real-time audit of vehicle gate-ins, gate-outs, customer test drives, and showroom handovers
            </p>
          </div>

          <Table
            data={dailyActivities}
            keyExtractor={(act) => act.id}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "id",
                header: "Log Ref",
                sortable: true,
                render: (act) => <span className="font-mono font-bold text-[#2563EB] text-xs">{act.id}</span>,
              },
              {
                key: "time",
                header: "Timestamp",
                sortable: true,
                render: (act) => <span className="font-mono text-xs font-semibold text-[#0F172A]">{act.time}</span>,
              },
              {
                key: "type",
                header: "Movement Category",
                sortable: true,
                render: (act) => (
                  <span className="text-[10px] font-bold text-[#1D4ED8] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {act.type}
                  </span>
                ),
              },
              {
                key: "vehicle",
                header: "Vehicle Description",
                render: (act) => <span className="text-xs font-semibold text-[#0F172A]">{act.vehicle}</span>,
              },
              {
                key: "operator",
                header: "Authorized Operator",
                render: (act) => <span className="text-xs text-[#475569]">{act.operator}</span>,
              },
              {
                key: "status",
                header: "Verification",
                render: (act) => <Badge variant="gold" size="sm">{act.status}</Badge>,
              },
            ]}
          />
        </Card>
      )}
    </div>
  );
};
