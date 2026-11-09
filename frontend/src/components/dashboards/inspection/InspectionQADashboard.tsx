"use client";

import React, { useState } from "react";
import {
  FiCheckCircle,
  FiAlertTriangle,
  FiClock,
  FiTool,
  FiShield,
  FiCheck,
  FiEye,
  FiPlus,
  FiFileText,
  FiSend,
} from "react-icons/fi";
import { Button, Badge, Card, Modal, Input, Dropdown, Table, KPICard } from "@/components/ui";
import { TaxonomyManagerSection } from "../admin/MasterDataPage";

export interface InspectionRecord {
  id: string;
  stockId: string;
  vehicle: string;
  vin: string;
  inspector: string;
  date: string;
  status: "Pending Inspection" | "Approved for Sale" | "Defects Logged - Service Req" | "Under Recon";
  grade: "Grade A (Pristine)" | "Grade B (Minor Wear)" | "Grade C (Recon Req)" | "Grade D (Major Repair)";
  score: number; // e.g. 98/100
  systemsPassed: number; // e.g. 10/10
  defectNotes?: string;
  dispatchedTo?: "Service Workshop" | "Detailing Recon" | "None";
}

export interface InspectionQADashboardProps {
  showToast?: (msg: string) => void;
}

export const InspectionQADashboard: React.FC<InspectionQADashboardProps> = ({ showToast }) => {
  const [inspections, setInspections] = useState<InspectionRecord[]>([
    {
      id: "INS-2026-001",
      stockId: "STK-2026-001",
      vehicle: "2024 Mercedes-Maybach S580",
      vin: "WDD2230631A987654",
      inspector: "Engr. Tunde Bakare (Master Tech)",
      date: "2026-11-06",
      status: "Approved for Sale",
      grade: "Grade A (Pristine)",
      score: 99,
      systemsPassed: 10,
      dispatchedTo: "None",
    },
    {
      id: "INS-2026-002",
      stockId: "STK-2026-002",
      vehicle: "2023 Porsche 911 Turbo S",
      vin: "WP0AB2A93NS123456",
      inspector: "Engr. Tunde Bakare (Master Tech)",
      date: "2026-11-05",
      status: "Approved for Sale",
      grade: "Grade A (Pristine)",
      score: 97,
      systemsPassed: 10,
      dispatchedTo: "None",
    },
    {
      id: "INS-2026-003",
      stockId: "STK-2026-005",
      vehicle: "2022 BMW M8 Competition Gran Coupe",
      vin: "WBA83AE04NCD12345",
      inspector: "Engr. Chidi Okafor (QA Specialist)",
      date: "2026-11-07",
      status: "Defects Logged - Service Req",
      grade: "Grade C (Recon Req)",
      score: 82,
      systemsPassed: 8,
      defectNotes: "Rear ceramic brake pad 4mm worn; right front alloy minor curb rash.",
      dispatchedTo: "Service Workshop",
    },
    {
      id: "INS-2026-004",
      stockId: "STK-2026-008",
      vehicle: "2021 Toyota Land Cruiser 300 VXR",
      vin: "JTMHY01J7M4012345",
      inspector: "Engr. Chidi Okafor (QA Specialist)",
      date: "2026-11-08",
      status: "Pending Inspection",
      grade: "Grade B (Minor Wear)",
      score: 0,
      systemsPassed: 0,
      dispatchedTo: "None",
    },
  ]);

  const [activeTab, setActiveTab] = useState<"pending" | "completed" | "defects" | "taxonomies">("pending");
  const [selectedInspection, setSelectedInspection] = useState<InspectionRecord | null>(null);
  const [isDiagnosticModalOpen, setIsDiagnosticModalOpen] = useState(false);

  // 10-System Diagnostic Checklist State
  const [checklist, setChecklist] = useState({
    powertrain: true,
    drivetrain: true,
    brakes: true,
    suspension: true,
    electrical: true,
    bodywork: true,
    interior: true,
    tires: true,
    safety: true,
    chassisVin: true,
  });

  const [diagnosticGrade, setDiagnosticGrade] = useState<InspectionRecord["grade"]>("Grade A (Pristine)");
  const [diagnosticNotes, setDiagnosticNotes] = useState("");
  const [dispatchTarget, setDispatchTarget] = useState<"Service Workshop" | "Detailing Recon" | "None">("None");

  const notify = (msg: string) => {
    if (showToast) showToast(msg);
  };

  const pendingList = inspections.filter((i) => i.status === "Pending Inspection");
  const completedList = inspections.filter((i) => i.status === "Approved for Sale");
  const defectsList = inspections.filter((i) => i.status === "Defects Logged - Service Req" || i.status === "Under Recon");

  const handleOpenDiagnostic = (rec: InspectionRecord) => {
    setSelectedInspection(rec);
    setChecklist({
      powertrain: true,
      drivetrain: true,
      brakes: rec.status !== "Defects Logged - Service Req",
      suspension: true,
      electrical: true,
      bodywork: true,
      interior: true,
      tires: rec.status !== "Defects Logged - Service Req",
      safety: true,
      chassisVin: true,
    });
    setDiagnosticGrade(rec.grade);
    setDiagnosticNotes(rec.defectNotes || "");
    setDispatchTarget(rec.dispatchedTo || "None");
    setIsDiagnosticModalOpen(true);
  };

  const handleSaveDiagnostic = (approvedForSale: boolean) => {
    if (!selectedInspection) return;

    const passedCount = Object.values(checklist).filter(Boolean).length;
    const scoreVal = Math.round((passedCount / 10) * 100);

    const updatedStatus: InspectionRecord["status"] = approvedForSale
      ? "Approved for Sale"
      : dispatchTarget !== "None"
      ? "Defects Logged - Service Req"
      : "Pending Inspection";

    setInspections((prev) =>
      prev.map((i) =>
        i.id === selectedInspection.id
          ? {
              ...i,
              status: updatedStatus,
              grade: diagnosticGrade,
              score: scoreVal,
              systemsPassed: passedCount,
              defectNotes: diagnosticNotes,
              dispatchedTo: dispatchTarget,
            }
          : i
      )
    );

    setIsDiagnosticModalOpen(false);

    if (approvedForSale) {
      notify(`Business Rule 2 Certification Granted: Vehicle ${selectedInspection.stockId} is now Approved for Sale!`);
    } else if (dispatchTarget !== "None") {
      notify(`Defect work order dispatched for ${selectedInspection.stockId} to ${dispatchTarget}.`);
    } else {
      notify(`Inspection report updated for ${selectedInspection.id}.`);
    }
  };

  return (
    <div className="space-y-4">
      {/* QA KPI Summary Bar */}
      <div className="gap-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Pending Intake QA"
          value={`${pendingList.length} Units`}
          change="Awaiting 150-Point Scan"
          icon={<FiClock className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Approved for Sale"
          value={`${completedList.length} Units`}
          change="Rule 2 Certified"
          icon={<FiCheckCircle className="w-5 h-5 text-emerald-600" />}
        />
        <KPICard
          title="Defects Dispatched"
          value={`${defectsList.length} Units`}
          change="In Service / Recon"
          icon={<FiTool className="w-5 h-5 text-amber-600" />}
        />
        <KPICard
          title="QA Pass Rate"
          value="92.4%"
          change="Zero Hidden Structural Defects"
          icon={<FiShield className="w-5 h-5 text-[#2563EB]" />}
        />
      </div>

      {/* Main Inspection Console Card */}
      <Card className="space-y-4 shadow-xs p-4 sm:p-5">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-3 pb-3 border-b border-[#E2E8F0]">
          <div>
            <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
              150-Point Inspection & Quality Assurance (QA) Desk
            </h3>
            <p className="text-[#64748B] text-[11px]">
              Multi-System Diagnostics, Condition Grading, and Mandatory &apos;Approved for Sale&apos; Certification (PDF Section 13 & Rule 2)
            </p>
          </div>

          <div className="flex flex-wrap gap-1">
            <Button
              variant={activeTab === "pending" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("pending")}
              className="text-xs font-bold"
            >
              Pending Intake ({pendingList.length})
            </Button>
            <Button
              variant={activeTab === "completed" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("completed")}
              className="text-xs font-bold"
            >
              Certified Approved ({completedList.length})
            </Button>
            <Button
              variant={activeTab === "defects" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("defects")}
              className="text-xs font-bold"
            >
              Defect Dispatches ({defectsList.length})
            </Button>
            <Button
              variant={activeTab === "taxonomies" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("taxonomies")}
              className="text-xs font-bold"
            >
              Diagnostic Centers Dropdowns
            </Button>
          </div>
        </div>

        {activeTab === "taxonomies" ? (
          <TaxonomyManagerSection
            allowedCategories={["inspection_centers"]}
            title="Diagnostic Inspection Centers & PDI Bays"
            description="Manage authorized physical diagnostic centers, PDI intake inspection bays, and trade-in examination centers."
            headerBadge="QA Desk Authorized"
            showToast={showToast}
          />
        ) : (
          <Table
            data={activeTab === "pending" ? pendingList : activeTab === "completed" ? completedList : defectsList}
            keyExtractor={(item) => item.id}
            pageSize={15}
            showSerialNumber={true}
            columns={[
            {
              key: "id",
              header: "Inspection Ref",
              sortable: true,
              render: (rec) => <span className="font-mono font-bold text-[#2563EB] text-xs">{rec.id}</span>,
            },
            {
              key: "vehicle",
              header: "Vehicle & Stock ID",
              sortable: true,
              render: (rec) => (
                <div>
                  <span className="font-bold text-[#0F172A] text-xs">{rec.vehicle}</span>
                  <span className="block font-mono text-[#64748B] text-[10px]">{rec.stockId} &bull; {rec.vin}</span>
                </div>
              ),
            },
            {
              key: "grade",
              header: "Condition Rating",
              sortable: true,
              render: (rec) => (
                <span className="font-semibold text-xs text-[#0F172A]">
                  {rec.grade} ({rec.systemsPassed}/10 Systems)
                </span>
              ),
            },
            {
              key: "inspector",
              header: "Assigned Inspector",
              render: (rec) => <span className="text-xs text-[#475569]">{rec.inspector}</span>,
            },
            {
              key: "date",
              header: "Date Inspected",
              sortable: true,
              render: (rec) => <span className="font-mono text-xs text-[#64748B]">{rec.date}</span>,
            },
            {
              key: "status",
              header: "QA Status",
              sortable: true,
              render: (rec) => (
                <Badge variant="gold" size="sm" dot>
                  {rec.status}
                </Badge>
              ),
            },
            {
              key: "action",
              header: "Audit / Certify",
              align: "right",
              render: (rec) => (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenDiagnostic(rec)}
                  leftIcon={<FiShield className="w-3.5 h-3.5 text-[#2563EB]" />}
                >
                  Diagnostic Sheet
                </Button>
              ),
            },
          ]}
        />
        )}
      </Card>

      {/* Modal: 10-System Diagnostic Checklist & Rule 2 Sign-Off */}
      {selectedInspection && (
        <Modal
          isOpen={isDiagnosticModalOpen}
          onClose={() => setIsDiagnosticModalOpen(false)}
          title={`Diagnostic Sheet: ${selectedInspection.stockId}`}
          description={`${selectedInspection.vehicle} • VIN: ${selectedInspection.vin}`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="p-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl flex sm:flex-row flex-col justify-between items-start sm:items-center gap-2 text-xs">
              <div>
                <span className="text-[#64748B] block text-[10px] uppercase">Inspection Reference</span>
                <span className="font-mono font-bold text-[#2563EB]">{selectedInspection.id}</span>
              </div>
              <div>
                <span className="text-[#64748B] block text-[10px] uppercase">Inspector</span>
                <span className="font-semibold text-[#0F172A]">{selectedInspection.inspector}</span>
              </div>
              <div>
                <span className="text-[#64748B] block text-[10px] uppercase">Overall Score</span>
                <span className="font-mono font-bold text-emerald-700">
                  {Object.values(checklist).filter(Boolean).length * 10}% Passed
                </span>
              </div>
            </div>

            {/* 10 Diagnostic Systems Checkbox Matrix */}
            <div>
              <h5 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider mb-2">
                10-Point Multi-System Diagnostic Matrix
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  { key: "powertrain", label: "1. Engine & Powertrain (Fluids, Belts, ECU)" },
                  { key: "drivetrain", label: "2. Transmission & Drivetrain (Shifting, AWD)" },
                  { key: "brakes", label: "3. Brakes & ABS (Pad Thickness, Rotors)" },
                  { key: "suspension", label: "4. Suspension & Steering (Shocks, Bushings)" },
                  { key: "electrical", label: "5. Electrical & Battery (Alternator, Sensors)" },
                  { key: "bodywork", label: "6. Exterior Bodywork & Paint Depth" },
                  { key: "interior", label: "7. Interior & Amenities (HVAC, Leather, Sunroof)" },
                  { key: "tires", label: "8. Tires & Wheels (Tread Depth, Alloy Truing)" },
                  { key: "safety", label: "9. Safety & SRS (Airbags, Collision Radar)" },
                  { key: "chassisVin", label: "10. Chassis Stamping & VIN Verification" },
                ].map((sys) => (
                  <label
                    key={sys.key}
                    className="flex items-center gap-2.5 p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={(checklist as any)[sys.key]}
                      onChange={(e) => setChecklist({ ...checklist, [sys.key]: e.target.checked })}
                      className="w-4 h-4 text-[#2563EB] rounded focus:ring-[#2563EB]"
                    />
                    <span className="text-[#0F172A] font-medium text-[11px]">{sys.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Overall Condition Grade & Defect Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <Dropdown
                label="Overall Vehicle Condition Rating"
                value={diagnosticGrade}
                onChange={(val) => setDiagnosticGrade(val as any)}
                options={[
                  { label: "Grade A (Pristine - Showroom Ready)", value: "Grade A (Pristine)" },
                  { label: "Grade B (Minor Wear - Cosmetic Polish)", value: "Grade B (Minor Wear)" },
                  { label: "Grade C (Recon Req - Mechanical Work)", value: "Grade C (Recon Req)" },
                  { label: "Grade D (Major Repair - Major Overhaul)", value: "Grade D (Major Repair)" },
                ]}
              />

              <Dropdown
                label="Dispatch Defect Work Order To"
                value={dispatchTarget}
                onChange={(val) => setDispatchTarget(val as any)}
                options={[
                  { label: "None (Zero Defects)", value: "None" },
                  { label: "Service Workshop (Mechanical/Brakes)", value: "Service Workshop" },
                  { label: "Detailing Recon (Paint/Leather/Ceramic)", value: "Detailing Recon" },
                ]}
              />
            </div>

            <Input
              label="Diagnostic Findings & Defect Description"
              placeholder="e.g. Minor curb rash on front-right wheel; OBD-II diagnostics clean with zero fault codes."
              value={diagnosticNotes}
              onChange={(e) => setDiagnosticNotes(e.target.value)}
            />

            {/* Action Buttons */}
            <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pt-3 border-t border-[#E2E8F0]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSaveDiagnostic(false)}
                leftIcon={<FiSend className="w-3.5 h-3.5" />}
              >
                Log Defects & Dispatch Work Order
              </Button>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsDiagnosticModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleSaveDiagnostic(true)}
                  leftIcon={<FiCheckCircle className="w-3.5 h-3.5" />}
                >
                  Sign Off & Approve for Sale (Rule 2)
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

