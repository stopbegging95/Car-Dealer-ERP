"use client";

import React, { useState } from "react";
import {
  FiUser,
  FiCheckCircle,
  FiClock,
  FiAward,
  FiDollarSign,
  FiCalendar,
  FiAlertCircle,
  FiCheck,
  FiActivity,
  FiTool,
  FiShield,
  FiPlay,
} from "react-icons/fi";
import {
  Card,
  KPICard,
  Badge,
  Button,
  Table,
  Modal,
} from "@/components/ui";

interface StaffTask {
  id: string;
  title: string;
  category: "Inspection" | "Test Drive" | "Delivery Handover" | "Client Follow-up" | "Operations";
  dueTime: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "Pending" | "In Progress" | "Completed";
  relatedRef: string;
  notes: string;
}

const INITIAL_STAFF_TASKS: StaffTask[] = [
  {
    id: "TSK-8801",
    title: "150-Point Intake Diagnostic PDI on 2024 Range Rover SV",
    category: "Inspection",
    dueTime: "Today, 11:30 AM",
    priority: "Critical",
    status: "In Progress",
    relatedRef: "VIN: SALWR2...901",
    notes: "Mandatory pre-listing inspection. Verify ECU diagnostics, suspension air bags, and paint depth.",
  },
  {
    id: "TSK-8802",
    title: "Escort VIP Test Drive with Chief Alexander Vance (Bentley Continental GT)",
    category: "Test Drive",
    dueTime: "Today, 02:00 PM",
    priority: "Critical",
    status: "Pending",
    relatedRef: "Client: Chief Vance",
    notes: "Victoria Island coastal route. Trade plate #04 assigned. Ensure vehicle battery is at 100%.",
  },
  {
    id: "TSK-8803",
    title: "Execute Delivery Handover & Sign CMR for Maybach S580 (ORD-9912)",
    category: "Delivery Handover",
    dueTime: "Today, 04:30 PM",
    priority: "High",
    status: "Pending",
    relatedRef: "ORD-9912 (Alhaji Bello)",
    notes: "Verify 100% wire clearance before gate release. Customer signed PDI checklist required.",
  },
  {
    id: "TSK-8804",
    title: "Follow up on Proforma Quotation QUO-2026-014 with Dr. K. Somoye",
    category: "Client Follow-up",
    dueTime: "Today, 05:00 PM",
    priority: "Medium",
    status: "Pending",
    relatedRef: "QUO-2026-014",
    notes: "3% authorized discount approved. Awaiting wire confirmation for 2024 Porsche 911 Turbo S.",
  },
  {
    id: "TSK-8805",
    title: "Inventory Bay Key Tagging & RFID Verification for Lekki Hub",
    category: "Operations",
    dueTime: "Today, 09:00 AM",
    priority: "Low",
    status: "Completed",
    relatedRef: "Bay #4 Hub",
    notes: "All 18 smart keys calibrated with secure locker #03. RFID telemetry synced to central ERP.",
  },
  {
    id: "TSK-8806",
    title: "Pre-Trade-In Physical Appraisal on 2022 Lexus LX600",
    category: "Inspection",
    dueTime: "Tomorrow, 10:00 AM",
    priority: "High",
    status: "Pending",
    relatedRef: "Swap App: SWAP-901",
    notes: "Inspect body panels for prior repaints. Check chassis rail stampings and Nigerian customs SGD.",
  },
];

interface PersonalStaffDashboardProps {
  showToast?: (msg: string) => void;
}

export const PersonalStaffDashboard: React.FC<PersonalStaffDashboardProps> = ({
  showToast = () => {},
}) => {
  const [tasks, setTasks] = useState<StaffTask[]>(INITIAL_STAFF_TASKS);
  const [selectedTaskForModal, setSelectedTaskForModal] = useState<StaffTask | null>(null);
  const [isOnDuty, setIsOnDuty] = useState(true);

  const toggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const nextStatus =
          t.status === "Pending"
            ? "In Progress"
            : t.status === "In Progress"
            ? "Completed"
            : "Pending";
        return { ...t, status: nextStatus };
      })
    );
    showToast(`Task ${taskId} status updated.`);
  };

  const completedCount = tasks.filter((t) => t.status === "Completed").length;

  return (
    <div className="space-y-4">
      {/* 1. STAFF PROFILE & SHIFT SUMMARY BANNER */}
      <Card className="p-4 bg-gradient-to-r from-[#FFFFFF] via-[#F8FAFC] to-[#EFF6FF] border-[#BFDBFE]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-bold text-lg shadow-md shadow-[#2563EB]/20">
              EO
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#0F172A] text-base">
                  Emeka Okonkwo (Senior Sales & Delivery Specialist)
                </h3>
                <Badge variant="outline" className="text-[10px] bg-white text-[#2563EB] border-[#BFDBFE]">
                  EMP-2026-042
                </Badge>
              </div>
              <p className="text-xs text-[#64748B] flex items-center gap-2 mt-0.5">
                <span>Victoria Island Flagship Showroom</span>
                <span>&bull;</span>
                <span>Department: Sales & Operations</span>
                <span>&bull;</span>
                <span className="font-mono text-[#2563EB] font-bold">Clearance: Senior Specialist</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="block text-[10px] text-[#64748B] uppercase font-bold">Today's Shift</span>
              <span className="text-xs font-semibold text-[#0F172A]">Shift A (08:00 - 17:00 WAT)</span>
            </div>
            <Button
              variant={isOnDuty ? "outline" : "primary"}
              size="sm"
              onClick={() => {
                setIsOnDuty(!isOnDuty);
                showToast(isOnDuty ? "Clocked out. Biometric logout logged." : "Clocked in. Biometric shift started.");
              }}
              className="gap-1.5"
            >
              <FiClock className="w-3.5 h-3.5 text-[#2563EB]" />
              {isOnDuty ? "On Duty (Clocked In 08:02)" : "Clock In for Shift"}
            </Button>
          </div>
        </div>
      </Card>

      {/* 2. PERSONAL PERFORMANCE & KPI STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard
          title="Monthly Quota Attainment"
          value="$410,000 / $500,000"
          subtitle="82% of Monthly Target ($90k to bonus)"
          icon={<FiAward className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Earned Commissions (MTD)"
          value="$41,000"
          subtitle="10% Gross Margin Share (3 deals closed)"
          icon={<FiDollarSign className="w-5 h-5 text-emerald-600" />}
        />
        <KPICard
          title="Assigned Tasks Completion"
          value={`${completedCount} / ${tasks.length}`}
          subtitle="Active workload in today's roster"
          icon={<FiCheckCircle className="w-5 h-5 text-indigo-600" />}
        />
        <KPICard
          title="Customer CSAT Rating"
          value="4.92 / 5.0"
          subtitle="Based on 28 Client Handover Reviews"
          icon={<FiActivity className="w-5 h-5 text-amber-500" />}
        />
      </div>

      {/* 3. ASSIGNED TASKS & OPERATIONAL ACTION ITEMS */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
          <div>
            <h4 className="font-bold text-[#0F172A] text-sm flex items-center gap-2">
              <FiTool className="w-4 h-4 text-[#2563EB]" />
              My Assigned Operational Tasks & Work Orders
            </h4>
            <p className="text-xs text-[#64748B]">
              Direct work orders, VIP test drive escorts, and customer handovers assigned to your staff profile
            </p>
          </div>
          <Badge variant="outline" className="text-xs bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]">
            {tasks.filter((t) => t.status !== "Completed").length} Pending Actions
          </Badge>
        </div>

        <Table
          data={tasks}
          keyExtractor={(item) => item.id}
          pageSize={15}
          showSerialNumber={true}
          columns={[
            {
              key: "title",
              header: "Task ID & Description",
              render: (item: StaffTask) => (
                <div>
                  <div className="font-bold text-[#0F172A] text-xs flex items-center gap-1.5">
                    <span>{item.title}</span>
                  </div>
                  <div className="text-[11px] text-[#64748B] font-mono mt-0.5">
                    {item.id} &bull; Ref: <span className="text-[#2563EB] font-medium">{item.relatedRef}</span>
                  </div>
                </div>
              ),
            },
            {
              key: "category",
              header: "Category",
              render: (item: StaffTask) => (
                <Badge variant="outline" size="sm">
                  {item.category}
                </Badge>
              ),
            },
            {
              key: "dueTime",
              header: "Schedule & Due",
              render: (item: StaffTask) => (
                <div className="text-xs text-[#0F172A] flex items-center gap-1">
                  <FiCalendar className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>{item.dueTime}</span>
                </div>
              ),
            },
            {
              key: "priority",
              header: "Priority",
              render: (item: StaffTask) => (
                <Badge
                  variant={item.priority === "Critical" ? "charcoal" : "outline"}
                  size="sm"
                >
                  {item.priority}
                </Badge>
              ),
            },
            {
              key: "status",
              header: "Execution Status",
              render: (item: StaffTask) => (
                <Badge
                  variant={
                    item.status === "Completed"
                      ? "gold"
                      : item.status === "In Progress"
                      ? "warmGold"
                      : "charcoal"
                  }
                  size="sm"
                >
                  {item.status}
                </Badge>
              ),
            },
            {
              key: "action",
              header: "Action",
              render: (item: StaffTask) => (
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-7 px-2 text-[11px]"
                    onClick={() => toggleTaskStatus(item.id)}
                  >
                    {item.status === "Pending" ? (
                      <span className="flex items-center gap-1">
                        <FiPlay className="w-3 h-3 text-[#2563EB]" /> Start
                      </span>
                    ) : item.status === "In Progress" ? (
                      <span className="flex items-center gap-1">
                        <FiCheck className="w-3 h-3 text-emerald-600" /> Done
                      </span>
                    ) : (
                      <span className="text-[#64748B]">Reopen</span>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-[11px]"
                    onClick={() => setSelectedTaskForModal(item)}
                  >
                    Details
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </Card>

      {/* 4. TASK DETAILS MODAL */}
      <Modal
        isOpen={!!selectedTaskForModal}
        onClose={() => setSelectedTaskForModal(null)}
        title={selectedTaskForModal ? `Task Details: ${selectedTaskForModal.id}` : "Task"}
        footer={
          <div className="flex justify-between items-center w-full">
            <span className="text-xs text-[#64748B]">
              Ref: {selectedTaskForModal?.relatedRef}
            </span>
            <Button variant="primary" size="sm" onClick={() => setSelectedTaskForModal(null)}>
              Close
            </Button>
          </div>
        }
      >
        {selectedTaskForModal && (
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md space-y-1.5">
              <div className="font-bold text-[#0F172A] text-sm">{selectedTaskForModal.title}</div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{selectedTaskForModal.category}</Badge>
                <Badge
                  variant={
                    selectedTaskForModal.priority === "Critical"
                      ? "charcoal"
                      : "outline"
                  }
                >
                  Priority: {selectedTaskForModal.priority}
                </Badge>
                <Badge variant="gold">Status: {selectedTaskForModal.status}</Badge>
              </div>
            </div>

            <div>
              <span className="font-bold text-[#0F172A] block mb-1">Standard Operating Notes & Checklist:</span>
              <p className="text-[#475569] leading-relaxed p-2.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-md">
                {selectedTaskForModal.notes}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div>
                <span className="text-[#64748B] block">Assigned Specialist:</span>
                <span className="font-semibold text-[#0F172A]">Emeka Okonkwo</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Scheduled Window:</span>
                <span className="font-semibold text-[#0F172A]">{selectedTaskForModal.dueTime}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
export default PersonalStaffDashboard;

