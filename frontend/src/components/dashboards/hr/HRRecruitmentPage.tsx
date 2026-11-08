"use client";

import React, { useState } from "react";
import {
  FiUsers,
  FiPlus,
  FiCheck,
  FiClock,
  FiDollarSign,
  FiCalendar,
  FiFileText,
  FiCheckCircle,
  FiGift,
  FiDownload,
} from "react-icons/fi";
import { Badge, Card, Button, Modal, Input, Dropdown, MasterDropdown, Table, KPICard } from "@/components/ui";

export interface EmployeeProfile {
  id: string;
  name: string;
  department: string;
  role: string;
  branch: string;
  contract: "Permanent Executive" | "Certified Technician" | "Logistics Officer" | "Sales Liaison";
  manager: string;
  status: "Active & Present" | "On Authorized Leave" | "Off-Duty";
  phone: string;
}

export interface AttendanceRecord {
  empId: string;
  name: string;
  shift: string;
  clockIn: string;
  status: "Present & On-Time" | "Late Arrival" | "Excused";
}

export interface LeaveRequest {
  id: string;
  empId: string;
  name: string;
  type: "Annual Leave" | "Sick Leave" | "Casual Leave" | "Maternity/Paternity";
  startDate: string;
  endDate: string;
  days: number;
  remainingBalance: number;
  status: "Pending Manager Sign-Off" | "Approved" | "Declined";
}

export interface PayrollEntry {
  empId: string;
  name: string;
  department: string;
  baseSalaryUSD: number;
  commissionsUSD: number;
  bonusUSD: number;
  payeTaxUSD: number;
  netPayUSD: number;
  status: "Settled via Bank Direct" | "Pending Disbursement";
}

export interface CandidateItem {
  name: string;
  role: string;
  appliedDate: string;
  exp: string;
  status: string;
  resume: string;
}

export interface HRRecruitmentPageProps {
  showToast: (msg: string) => void;
}

export const HRRecruitmentPage: React.FC<HRRecruitmentPageProps> = ({ showToast }) => {
  const [activeTab, setActiveTab] = useState<"directory" | "attendance" | "leave" | "payroll" | "recruitment">("directory");

  const [employees, setEmployees] = useState<EmployeeProfile[]>([
    { id: "EMP-101", name: "Emeka Okafor", department: "Sales & Marketing", role: "Senior VIP Sales Director", branch: "Victoria Island Flagship", contract: "Permanent Executive", manager: "General Manager", status: "Active & Present", phone: "+234 802 334 1122" },
    { id: "EMP-102", name: "Aisha Mohammed", department: "Diplomatic Protocol", role: "Diplomatic Client Liaison", branch: "Maitama Suite, Abuja", contract: "Permanent Executive", manager: "Emeka Okafor", status: "Active & Present", phone: "+234 803 445 2233" },
    { id: "EMP-103", name: "Engr. Tunde Bakare", department: "Quality & Workshop", role: "Chief Diagnostic Specialist", branch: "Central Workshop, Lekki", contract: "Certified Technician", manager: "Operations Director", status: "Active & Present", phone: "+234 805 556 3344" },
    { id: "EMP-104", name: "Ngozi Eze", department: "Sales & Fleet", role: "Corporate Fleet Manager", branch: "Victoria Island Flagship", contract: "Permanent Executive", manager: "Emeka Okafor", status: "On Authorized Leave", phone: "+234 809 667 4455" },
    { id: "EMP-105", name: "Chibuike Alao", department: "Customs & Logistics", role: "Port Clearance Officer", branch: "Tin Can Port Node", contract: "Logistics Officer", manager: "Operations Director", status: "Active & Present", phone: "+234 807 778 5566" },
  ]);

  const [attendance, setAttendance] = useState<AttendanceRecord[]>([
    { empId: "EMP-101", name: "Emeka Okafor", shift: "Morning Executive (8:00am - 4:30pm)", clockIn: "07:48 AM", status: "Present & On-Time" },
    { empId: "EMP-102", name: "Aisha Mohammed", shift: "Diplomatic Suite (9:00am - 5:30pm)", clockIn: "08:52 AM", status: "Present & On-Time" },
    { empId: "EMP-103", name: "Engr. Tunde Bakare", shift: "Workshop Shift A (7:30am - 4:00pm)", clockIn: "07:25 AM", status: "Present & On-Time" },
    { empId: "EMP-105", name: "Chibuike Alao", shift: "Port Terminal Shift (8:00am - 4:30pm)", clockIn: "08:12 AM", status: "Late Arrival" },
  ]);

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    { id: "LEV-201", empId: "EMP-104", name: "Ngozi Eze", type: "Annual Leave", startDate: "2026-11-04", endDate: "2026-11-18", days: 10, remainingBalance: 12, status: "Approved" },
    { id: "LEV-202", empId: "EMP-105", name: "Chibuike Alao", type: "Casual Leave", startDate: "2026-11-24", endDate: "2026-11-26", days: 2, remainingBalance: 5, status: "Pending Manager Sign-Off" },
  ]);

  const [payroll, setPayroll] = useState<PayrollEntry[]>([
    { empId: "EMP-101", name: "Emeka Okafor", department: "Sales", baseSalaryUSD: 6500, commissionsUSD: 1930, bonusUSD: 500, payeTaxUSD: 669, netPayUSD: 8261, status: "Settled via Bank Direct" },
    { empId: "EMP-102", name: "Aisha Mohammed", department: "Sales", baseSalaryUSD: 5200, commissionsUSD: 1440, bonusUSD: 300, payeTaxUSD: 520, netPayUSD: 6420, status: "Settled via Bank Direct" },
    { empId: "EMP-103", name: "Engr. Tunde Bakare", department: "Service", baseSalaryUSD: 5800, commissionsUSD: 0, bonusUSD: 800, payeTaxUSD: 495, netPayUSD: 6105, status: "Settled via Bank Direct" },
    { empId: "EMP-104", name: "Ngozi Eze", department: "Sales", baseSalaryUSD: 5500, commissionsUSD: 2700, bonusUSD: 600, payeTaxUSD: 660, netPayUSD: 8140, status: "Settled via Bank Direct" },
  ]);

  const [candidates] = useState<CandidateItem[]>([
    { name: "Chibuike Okafor", role: "Senior VIP Luxury Sales Executive", appliedDate: "2026-11-04", exp: "8 Years Auto Sales", status: "Interview Scheduled", resume: "Chibuike_CV.pdf" },
    { name: "Fatima Al-Hassan", role: "Customs & Port Logistics Specialist", appliedDate: "2026-11-03", exp: "5 Years Tin Can Clearing", status: "Shortlisted", resume: "Fatima_Resume.pdf" },
    { name: "Tariq Danladi", role: "Senior Master Certified Technician", appliedDate: "2026-11-01", exp: "12 Years Porsche/Mercedes Diagnostic", status: "Technical Assessment", resume: "Tariq_Certificates.pdf" },
    { name: "Grace Adebayo", role: "Digital Automotive Marketing Lead", appliedDate: "2026-10-29", exp: "6 Years Automotive Content", status: "Application Received", resume: "Grace_Portfolio.pdf" },
  ]);

  const [isNewEmpModalOpen, setIsNewEmpModalOpen] = useState(false);
  const [empName, setEmpName] = useState("");
  const [empRole, setEmpRole] = useState("");
  const [empDept, setEmpDept] = useState("Sales & Marketing");
  const [empBranch, setEmpBranch] = useState("Victoria Island Flagship");

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName) return;

    const newEmp: EmployeeProfile = {
      id: `EMP-${106 + employees.length}`,
      name: empName,
      department: empDept,
      role: empRole || "Staff Specialist",
      branch: empBranch,
      contract: "Permanent Executive",
      manager: "Operations Director",
      status: "Active & Present",
      phone: "+234 (0) 800 000 0000",
    };

    setEmployees([...employees, newEmp]);
    setIsNewEmpModalOpen(false);
    showToast(`Staff record registered for ${empName} (${newEmp.id}).`);
    setEmpName("");
    setEmpRole("");
  };

  const handleApproveLeave = (leaveId: string) => {
    setLeaveRequests((prev) =>
      prev.map((l) => (l.id === leaveId ? { ...l, status: "Approved" } : l))
    );
    showToast(`Leave request ${leaveId} authorized and deducted from annual balance.`);
  };

  return (
    <div className="space-y-4">
      {/* 1. HR Top Metrics Bar */}
      <div className="gap-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Active Dealership Staff"
          value={`${employees.length} Employees`}
          change="5 Facility Nodes"
          icon={<FiUsers className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Present Today"
          value={`${attendance.length} / ${employees.length}`}
          change="94% Punctuality Score"
          icon={<FiClock className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Pending Leave Sign-Offs"
          value={`${leaveRequests.filter((l) => l.status.includes("Pending")).length} Requests`}
          change="Annual / Casual Balance"
          icon={<FiCalendar className="w-5 h-5 text-amber-600" />}
        />
        <KPICard
          title="Monthly Payroll Ledger"
          value={`₦${((payroll.reduce((acc, p) => acc + p.netPayUSD, 0) * 1550) / 1000000).toFixed(1)}M`}
          change="Commissions & PAYE Reconciled"
          icon={<FiDollarSign className="w-5 h-5 text-[#2563EB]" />}
        />
      </div>

      {/* 2. Staff Anniversaries & Birthdays Ticker (Section 11) */}
      <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between text-xs text-indigo-900">
        <div className="flex items-center gap-2">
          <FiGift className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            <strong>Upcoming Staff Milestones This Month:</strong> Engr. Tunde Bakare (5-Year Service Anniversary Nov 14) &bull; Aisha Mohammed (Birthday Nov 22).
          </span>
        </div>
        <Badge variant="gold" size="sm">Executive Protocol</Badge>
      </div>

      {/* 3. Sub-Tabs Selector Bar */}
      <Card className="shadow-xs p-3">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2">
          <div className="flex flex-wrap gap-1">
            <Button
              variant={activeTab === "directory" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("directory")}
              className="text-xs font-bold"
            >
              Workforce Directory ({employees.length})
            </Button>
            <Button
              variant={activeTab === "attendance" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("attendance")}
              className="text-xs font-bold"
            >
              Daily Attendance & Shifts
            </Button>
            <Button
              variant={activeTab === "leave" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("leave")}
              className="text-xs font-bold"
            >
              Leave Approvals Queue ({leaveRequests.length})
            </Button>
            <Button
              variant={activeTab === "payroll" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("payroll")}
              className="text-xs font-bold"
            >
              Payroll & Compensation ({payroll.length})
            </Button>
            <Button
              variant={activeTab === "recruitment" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("recruitment")}
              className="text-xs font-bold"
            >
              Careers Job Applicants ({candidates.length})
            </Button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsNewEmpModalOpen(true)}
            leftIcon={<FiPlus className="w-3.5 h-3.5" />}
          >
            + Register Staff Profile
          </Button>
        </div>
      </Card>

      {/* VIEW 1: Workforce Directory */}
      {activeTab === "directory" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div>
            <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
              Dealership Enterprise Workforce Directory
            </h3>
            <p className="text-[11px] text-[#64748B]">
              Department assignments, employment classifications, reporting lines, and facility nodes
            </p>
          </div>

          <Table
            data={employees}
            keyExtractor={(emp) => emp.id}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "id",
                header: "Staff ID",
                sortable: true,
                render: (emp) => <span className="font-mono font-bold text-[#2563EB] text-xs">{emp.id}</span>,
              },
              {
                key: "name",
                header: "Employee Name",
                sortable: true,
                render: (emp) => (
                  <div>
                    <span className="font-bold text-[#0F172A] text-xs">{emp.name}</span>
                    <span className="block text-[10px] text-[#64748B]">{emp.phone}</span>
                  </div>
                ),
              },
              {
                key: "department",
                header: "Department",
                sortable: true,
                render: (emp) => <span className="text-xs font-semibold text-[#0F172A]">{emp.department}</span>,
              },
              {
                key: "role",
                header: "Job Title",
                sortable: true,
                render: (emp) => <span className="text-xs text-[#475569]">{emp.role}</span>,
              },
              {
                key: "branch",
                header: "Showroom / Facility Node",
                render: (emp) => <span className="text-xs text-[#475569]">{emp.branch}</span>,
              },
              {
                key: "contract",
                header: "Contract Classification",
                render: (emp) => <span className="text-xs font-medium text-[#1D4ED8]">{emp.contract}</span>,
              },
              {
                key: "status",
                header: "Status",
                render: (emp) => <Badge variant="gold" size="sm">{emp.status}</Badge>,
              },
            ]}
          />
        </Card>
      )}

      {/* VIEW 2: Daily Attendance & Shifts */}
      {activeTab === "attendance" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div>
            <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
              Daily Attendance, Shifts & Clock-In Roster
            </h3>
            <p className="text-[11px] text-[#64748B]">
              Biometric & WebAuthn workstation clock-in audit across Lagos Flagship, Lekki Workshop, and Abuja Suite
            </p>
          </div>

          <Table
            data={attendance}
            keyExtractor={(att) => att.empId}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "empId",
                header: "Staff ID",
                sortable: true,
                render: (att) => <span className="font-mono font-bold text-[#2563EB] text-xs">{att.empId}</span>,
              },
              {
                key: "name",
                header: "Employee Name",
                sortable: true,
                render: (att) => <span className="font-bold text-[#0F172A] text-xs">{att.name}</span>,
              },
              {
                key: "shift",
                header: "Assigned Shift",
                render: (att) => <span className="text-xs text-[#475569]">{att.shift}</span>,
              },
              {
                key: "clockIn",
                header: "Clock-In Time",
                sortable: true,
                render: (att) => <span className="font-mono font-bold text-xs text-[#0F172A]">{att.clockIn}</span>,
              },
              {
                key: "status",
                header: "Punctuality Rating",
                render: (att) => (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      att.status === "Present & On-Time"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {att.status}
                  </span>
                ),
              },
            ]}
          />
        </Card>
      )}

      {/* VIEW 3: Leave Management & Approvals */}
      {activeTab === "leave" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div>
            <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
              Leave Requests & Approval Queue
            </h3>
            <p className="text-[11px] text-[#64748B]">
              Departmental sign-offs, annual leave accrual ledgers, and maternity/sick leave tracking
            </p>
          </div>

          <Table
            data={leaveRequests}
            keyExtractor={(l) => l.id}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "id",
                header: "Leave Ref",
                sortable: true,
                render: (l) => <span className="font-mono font-bold text-[#2563EB] text-xs">{l.id}</span>,
              },
              {
                key: "name",
                header: "Staff Member",
                sortable: true,
                render: (l) => (
                  <div>
                    <span className="font-bold text-[#0F172A] text-xs">{l.name}</span>
                    <span className="block font-mono text-[10px] text-[#64748B]">{l.empId}</span>
                  </div>
                ),
              },
              {
                key: "type",
                header: "Leave Category",
                sortable: true,
                render: (l) => <span className="text-xs font-semibold text-[#1D4ED8]">{l.type}</span>,
              },
              {
                key: "startDate",
                header: "Leave Dates",
                render: (l) => (
                  <span className="font-mono text-xs text-[#475569]">
                    {l.startDate} &rarr; {l.endDate} ({l.days} Days)
                  </span>
                ),
              },
              {
                key: "remainingBalance",
                header: "Balance Days",
                sortable: true,
                render: (l) => <span className="font-mono font-bold text-xs">{l.remainingBalance} Days Left</span>,
              },
              {
                key: "status",
                header: "Authorization Status",
                render: (l) => <Badge variant="gold" size="sm">{l.status}</Badge>,
              },
              {
                key: "action",
                header: "Manager Sign-Off",
                align: "right",
                render: (l) =>
                  l.status.includes("Pending") ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApproveLeave(l.id)}
                      className="px-2 py-0.5 text-[11px]"
                      leftIcon={<FiCheckCircle className="w-3 h-3" />}
                    >
                      Approve Leave
                    </Button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-700">Authorized</span>
                  ),
              },
            ]}
          />
        </Card>
      )}

      {/* VIEW 4: Payroll & Compensation Ledger */}
      {activeTab === "payroll" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2">
            <div>
              <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
                Monthly Payroll & Compensation Ledger
              </h3>
              <p className="text-[11px] text-[#64748B]">
                Base salaries, sales gross profit commissions, bonuses, and statutory PAYE tax deductions
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => showToast("Monthly payroll summary report PDF exported to financial records.")}
              leftIcon={<FiDownload className="w-3.5 h-3.5 text-[#2563EB]" />}
            >
              Export Payroll PDF
            </Button>
          </div>

          <Table
            data={payroll}
            keyExtractor={(p) => p.empId}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "empId",
                header: "Staff ID",
                sortable: true,
                render: (p) => <span className="font-mono font-bold text-[#2563EB] text-xs">{p.empId}</span>,
              },
              {
                key: "name",
                header: "Employee Name",
                sortable: true,
                render: (p) => <span className="font-bold text-[#0F172A] text-xs">{p.name}</span>,
              },
              {
                key: "baseSalaryUSD",
                header: "Base Salary (₦)",
                sortable: true,
                render: (p) => <span className="font-mono text-xs text-[#0F172A]">₦{(p.baseSalaryUSD * 1550).toLocaleString()}</span>,
              },
              {
                key: "commissionsUSD",
                header: "Sales Commissions (₦)",
                sortable: true,
                render: (p) => <span className="font-mono font-bold text-emerald-700 text-xs">+₦{(p.commissionsUSD * 1550).toLocaleString()}</span>,
              },
              {
                key: "bonusUSD",
                header: "Performance Bonus (₦)",
                render: (p) => <span className="font-mono text-xs text-[#475569]">+₦{(p.bonusUSD * 1550).toLocaleString()}</span>,
              },
              {
                key: "payeTaxUSD",
                header: "PAYE Tax (7.5%)",
                render: (p) => <span className="font-mono text-xs text-rose-700">-₦{(p.payeTaxUSD * 1550).toLocaleString()}</span>,
              },
              {
                key: "netPayUSD",
                header: "Net Payable (₦)",
                sortable: true,
                render: (p) => (
                  <span className="font-mono font-bold text-[#1D4ED8] text-xs">₦{(p.netPayUSD * 1550).toLocaleString()}</span>
                ),
              },
              {
                key: "status",
                header: "Disbursement",
                render: (p) => <Badge variant="gold" size="sm">{p.status}</Badge>,
              },
            ]}
          />
        </Card>
      )}

      {/* VIEW 5: Careers Job Applicants */}
      {activeTab === "recruitment" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div>
            <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
              Public Career Applications & Candidate Roster
            </h3>
            <p className="text-[11px] text-[#64748B]">
              Applicants submitted through the public dealercms /careers recruitment pipeline
            </p>
          </div>

          <Table
            data={candidates}
            keyExtractor={(c) => c.name}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "name",
                header: "Candidate Name",
                sortable: true,
                render: (c) => <span className="font-bold text-[#0F172A] text-xs">{c.name}</span>,
              },
              {
                key: "role",
                header: "Target Role",
                sortable: true,
                render: (c) => <span className="text-xs text-[#475569]">{c.role}</span>,
              },
              {
                key: "exp",
                header: "Industry Track Record",
                render: (c) => <span className="text-xs text-[#0F172A] font-medium">{c.exp}</span>,
              },
              {
                key: "appliedDate",
                header: "Applied Date",
                sortable: true,
                render: (c) => <span className="font-mono text-xs text-[#64748B]">{c.appliedDate}</span>,
              },
              {
                key: "status",
                header: "Recruitment Stage",
                render: (c) => <Badge variant="gold" size="sm">{c.status}</Badge>,
              },
              {
                key: "resume",
                header: "Dossier File",
                render: (c) => (
                  <span className="font-mono text-xs text-[#2563EB] flex items-center gap-1">
                    <FiFileText className="w-3.5 h-3.5" />
                    {c.resume}
                  </span>
                ),
              },
            ]}
          />
        </Card>
      )}

      {/* Modal: Register Staff Profile */}
      <Modal
        isOpen={isNewEmpModalOpen}
        onClose={() => setIsNewEmpModalOpen(false)}
        size="md"
        title="Register Dealership Employee Profile"
        description="Captures staff employment record, assigned operational node, and clearance classification."
      >
        <form onSubmit={handleCreateEmployee} className="space-y-3">
          <Input
            label="Employee Full Name"
            placeholder="e.g. Oladimeji Sanusi"
            value={empName}
            onChange={(e) => setEmpName(e.target.value)}
            required
          />
          <Input
            label="Job Title / Position"
            placeholder="e.g. Senior Inventory & Yard Master"
            value={empRole}
            onChange={(e) => setEmpRole(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MasterDropdown
              category="departments"
              label="Assigned Department"
              value={empDept}
              onChange={(val) => setEmpDept(String(val))}
              required
            />
            <MasterDropdown
              category="hubs"
              label="Facility Base / Showroom Node"
              value={empBranch}
              onChange={(val) => setEmpBranch(String(val))}
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsNewEmpModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" leftIcon={<FiCheck />}>
              Save Employee Profile
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
