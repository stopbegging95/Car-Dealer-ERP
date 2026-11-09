"use client";

import React, { useState } from "react";
import {
  FiUsers,
  FiClock,
  FiFileText,
  FiCheckCircle,
  FiPlus,
  FiCheck,
  FiAlertTriangle,
  FiBell,
  FiShield,
  FiStar,
  FiSend,
  FiMail,
  FiPlay,
  FiPause,
} from "react-icons/fi";
import { KPICard, Card, Button, Badge, Modal, Input, Dropdown, Table } from "@/components/ui";
import { TaxonomyManagerSection } from "../admin/MasterDataPage";

export type CustomerSegment =
  | "All"
  | "VIP & High-Net-Worth (HNWI)"
  | "Corporate Accounts"
  | "Government & Diplomatic"
  | "Commercial Fleet Accounts"
  | "Individual Retail Clients"
  | "Automotive Dealers & Resellers";

export interface CRMLeadItem {
  id: string;
  name: string;
  tier: CustomerSegment;
  car: string;
  budget: string;
  stage: string;
  rep: string;
  ltvUSD: number;
}

export interface ComplaintTicket {
  id: string;
  client: string;
  vehicle: string;
  severity: "High (Urgent)" | "Medium (Standard)" | "Low (Cosmetic)";
  assignedDept: "Sales" | "Service Workshop" | "Delivery & Logistics" | "Finance & Insurance";
  issue: string;
  slaHoursRemaining: number;
  status: "Open" | "In Rectification" | "Resolved & Closed";
}

export interface LoyaltyReminderItem {
  id: string;
  client: string;
  vehicle: string;
  type: "Service Interval Due" | "Warranty Expiry Alert" | "Customs Duty Audit" | "Birthday VIP Protocol";
  dueDate: string;
  status: "Pending Notification" | "Dispatched via Concierge";
}

export interface CRMPipelinePageProps {
  showToast?: (msg: string) => void;
}

export const CRMPipelinePage: React.FC<CRMPipelinePageProps> = ({ showToast }) => {
  const [activeTab, setActiveTab] = useState<"leads" | "complaints" | "reminders" | "drips" | "taxonomies">("leads");
  const [selectedSegment, setSelectedSegment] = useState<CustomerSegment>("All");

  const [leads, setLeads] = useState<CRMLeadItem[]>([
    {
      id: "CRM-101",
      name: "Alhaji Bello & Sons Ltd",
      tier: "Corporate Accounts",
      car: "2024 Mercedes-Maybach S580",
      budget: "₦279,000,000",
      stage: "Delivery Scheduled",
      rep: "Emeka O. (VIP Sales)",
      ltvUSD: 806000000,
    },
    {
      id: "CRM-102",
      name: "Dr. K. Somoye",
      tier: "VIP & High-Net-Worth (HNWI)",
      car: "2024 Porsche 911 Turbo S",
      budget: "₦356,500,000",
      stage: "Quote Review",
      rep: "Emeka O. (VIP Sales)",
      ltvUSD: 604500000,
    },
    {
      id: "CRM-103",
      name: "Senator Godswill O.",
      tier: "Government & Diplomatic",
      car: "2024 Mercedes-AMG G63 Magno",
      budget: "₦387,500,000",
      stage: "Trade-In Review",
      rep: "Aisha M. (Diplomatic)",
      ltvUSD: 1147000000,
    },
    {
      id: "CRM-104",
      name: "Mrs. Folashade A.",
      tier: "Commercial Fleet Accounts",
      car: "2024 Range Rover Autobiography",
      budget: "₦310,000,000",
      stage: "VIP Test Drive",
      rep: "Ngozi E. (Fleet)",
      ltvUSD: 434000000,
    },
    {
      id: "CRM-105",
      name: "Chief Alexander Vance",
      tier: "VIP & High-Net-Worth (HNWI)",
      car: "2024 Rolls-Royce Ghost Extended",
      budget: "₦542,500,000",
      stage: "Contract Underwriting",
      rep: "Emeka O. (VIP Sales)",
      ltvUSD: 1317500000,
    },
    {
      id: "CRM-106",
      name: "AutoBoutique Lekki Ltd",
      tier: "Automotive Dealers & Resellers",
      car: "3x 2024 Toyota Land Cruiser 300",
      budget: "₦651,000,000",
      stage: "Wholesale Margin Locked",
      rep: "Chukwudi N.",
      ltvUSD: 1860000000,
    },
  ]);

  const [complaints, setComplaints] = useState<ComplaintTicket[]>([
    {
      id: "TKT-8801",
      client: "Alhaji Bello & Sons Ltd",
      vehicle: "2024 Mercedes-Maybach S580",
      severity: "Medium (Standard)",
      assignedDept: "Service Workshop",
      issue: "Second remote key fob pairing delayed during delivery handover.",
      slaHoursRemaining: 18,
      status: "In Rectification",
    },
    {
      id: "TKT-8802",
      client: "Senator Godswill O.",
      vehicle: "2024 Mercedes-AMG G63 Magno",
      severity: "High (Urgent)",
      assignedDept: "Delivery & Logistics",
      issue: "Port customs clearance duty receipt copy missing in digital vault dossier.",
      slaHoursRemaining: 6,
      status: "Open",
    },
    {
      id: "TKT-8803",
      client: "Mrs. Folashade A.",
      vehicle: "2024 Range Rover Autobiography",
      severity: "Low (Cosmetic)",
      assignedDept: "Sales",
      issue: "Requests re-application of ceramic quick-detailer spray before weekend gala.",
      slaHoursRemaining: 42,
      status: "Open",
    },
  ]);

  const [reminders, setReminders] = useState<LoyaltyReminderItem[]>([
    {
      id: "NOT-901",
      client: "Dr. K. Somoye",
      vehicle: "2023 Porsche 911 Turbo S",
      type: "Service Interval Due",
      dueDate: "2026-11-20",
      status: "Pending Notification",
    },
    {
      id: "NOT-902",
      client: "Alhaji Bello & Sons Ltd",
      vehicle: "2024 Mercedes-Maybach S580",
      type: "Warranty Expiry Alert",
      dueDate: "2026-12-05",
      status: "Dispatched via Concierge",
    },
    {
      id: "NOT-903",
      client: "Chief Alexander Vance",
      vehicle: "2024 Rolls-Royce Ghost",
      type: "Birthday VIP Protocol",
      dueDate: "2026-11-18",
      status: "Pending Notification",
    },
    {
      id: "NOT-904",
      client: "Senator Godswill O.",
      vehicle: "2024 Mercedes-AMG G63",
      type: "Customs Duty Audit",
      dueDate: "2026-11-25",
      status: "Dispatched via Concierge",
    },
  ]);

  // Automated Marketing Nurture Drips (PDF Section 24)
  const [dripCampaigns, setDripCampaigns] = useState([
    {
      id: "DRP-01",
      name: "HNWI VIP Welcome & Digital Fleet Dossier",
      trigger: "Immediate on Inbound Lead Capture",
      targetTier: "VIP & High-Net-Worth (HNWI)",
      steps: 4,
      duration: "14 Days",
      openRate: "74.2%",
      conversionRate: "18.5%",
      status: "Active" as "Active" | "Paused",
    },
    {
      name: "Bespoke 4K Video Walkthrough & Private Suite Invite",
      id: "DRP-02",
      trigger: "Day 2 Post-Vehicle Inquiry",
      targetTier: "VIP & Corporate Accounts",
      steps: 3,
      duration: "7 Days",
      openRate: "68.5%",
      conversionRate: "24.0%",
      status: "Active" as "Active" | "Paused",
    },
    {
      name: "Guaranteed Trade-In Equity Appraisal & Swap Incentive",
      id: "DRP-03",
      trigger: "Day 5 Post-Test Drive",
      targetTier: "All Qualified Prospects",
      steps: 3,
      duration: "10 Days",
      openRate: "59.0%",
      conversionRate: "31.2%",
      status: "Active" as "Active" | "Paused",
    },
    {
      name: "Diplomatic & Corporate Capital Allowance Tax Shield",
      id: "DRP-04",
      trigger: "Day 8 Post-Formal Quotation",
      targetTier: "Corporate & Diplomatic Missions",
      steps: 2,
      duration: "5 Days",
      openRate: "81.2%",
      conversionRate: "42.5%",
      status: "Active" as "Active" | "Paused",
    },
    {
      name: "Post-Delivery Concierge & Complimentary Ceramic Inspection",
      id: "DRP-05",
      trigger: "Day 30 Post-Delivery Handover",
      targetTier: "Verified Owners & Collectors",
      steps: 2,
      duration: "30 Days",
      openRate: "92.0%",
      conversionRate: "96.0%",
      status: "Active" as "Active" | "Paused",
    },
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [tier, setTier] = useState<CustomerSegment>("VIP & High-Net-Worth (HNWI)");
  const [car, setCar] = useState("2024 Mercedes-Maybach S580");
  const [budget, setBudget] = useState("180,000");
  const [stage, setStage] = useState("Stage 1: Inbound Lead");
  const [rep, setRep] = useState("Emeka O. (VIP Sales)");

  // New Ticket State
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [newTicketClient, setNewTicketClient] = useState("");
  const [newTicketVehicle, setNewTicketVehicle] = useState("");
  const [newTicketSeverity, setNewTicketSeverity] = useState<ComplaintTicket["severity"]>("Medium (Standard)");
  const [newTicketDept, setNewTicketDept] = useState<ComplaintTicket["assignedDept"]>("Service Workshop");
  const [newTicketIssue, setNewTicketIssue] = useState("");

  const notify = (msg: string) => {
    if (showToast) showToast(msg);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    const newEntry: CRMLeadItem = {
      id: `CRM-${107 + leads.length}`,
      name,
      tier,
      car,
      budget: `₦${Number(budget.replace(/[^0-9]/g, "") || 0).toLocaleString()}`,
      stage,
      rep,
      ltvUSD: Number(budget.replace(/[^0-9]/g, "") || 0) * 1.5,
    };
    setLeads([newEntry, ...leads]);
    setIsModalOpen(false);
    notify(`VIP Client dossier logged for ${name} (${car}).`);
    setName("");
    setBudget("");
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketClient || !newTicketIssue) return;
    const newTicket: ComplaintTicket = {
      id: `TKT-${8804 + complaints.length}`,
      client: newTicketClient,
      vehicle: newTicketVehicle || "2024 Mercedes-Maybach S580",
      severity: newTicketSeverity,
      assignedDept: newTicketDept,
      issue: newTicketIssue,
      slaHoursRemaining: newTicketSeverity.includes("High") ? 12 : 36,
      status: "Open",
    };
    setComplaints([newTicket, ...complaints]);
    setIsNewTicketModalOpen(false);
    notify(`Dispute ticket ${newTicket.id} logged for ${newTicketClient}. Dispatched to ${newTicketDept}.`);
    setNewTicketClient("");
    setNewTicketVehicle("");
    setNewTicketIssue("");
  };

  const filteredLeads = leads.filter(
    (l) => selectedSegment === "All" || l.tier === selectedSegment
  );

  return (
    <div className="space-y-4">
      {/* KPI Overview Strip */}
      <div className="gap-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Active Client Prospects"
          value={`${leads.length} Clients`}
          subtitle="Across 6 Market Segments"
          icon={<FiUsers className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Open Dispute Tickets"
          value={`${complaints.filter((c) => c.status !== "Resolved & Closed").length} Tickets`}
          subtitle="SLA Countdown Active"
          icon={<FiAlertTriangle className="w-5 h-5 text-amber-600" />}
        />
        <KPICard
          title="Automated Reminders"
          value={`${reminders.length} Alerts`}
          subtitle="Service, Warranty & Birthdays"
          icon={<FiBell className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Portfolio LTV Total"
          value={`₦${(leads.reduce((acc, l) => acc + l.ltvUSD, 0) / 1000000000).toFixed(2)}B`}
          subtitle="High-Net-Worth Accounts"
          icon={<FiStar className="w-5 h-5 text-[#2563EB]" />}
        />
      </div>

      {/* Sub-Tabs Selector */}
      <Card className="shadow-xs p-3">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2">
          <div className="flex flex-wrap gap-1">
            <Button
              variant={activeTab === "leads" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("leads")}
              className="text-xs font-bold"
            >
              Client Segments & Pipeline ({leads.length})
            </Button>
            <Button
              variant={activeTab === "complaints" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("complaints")}
              className="text-xs font-bold"
            >
              Dispute Resolution Tickets ({complaints.length})
            </Button>
            <Button
              variant={activeTab === "reminders" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("reminders")}
              className="text-xs font-bold"
            >
              Loyalty & Service Alerts ({reminders.length})
            </Button>
            <Button
              variant={activeTab === "drips" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("drips")}
              className="text-xs font-bold"
            >
              Marketing Nurture Drips ({dripCampaigns.length})
            </Button>
            <Button
              variant={activeTab === "taxonomies" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("taxonomies")}
              className="text-xs font-bold"
            >
              Dispute Taxonomies
            </Button>
          </div>
        </div>
      </Card>

      {/* VIEW 1: Client Segments & Pipeline */}
      {activeTab === "leads" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-2.5 border-b border-[#E2E8F0]">
            <div>
              <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
                VIP Client Relationship & 6-Tier Segment Matrix
              </h3>
              <p className="text-[11px] text-[#64748B]">
                Segmented filtering across Retail, Corporate, HNWI, Diplomatic, Fleet, and Resellers
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="w-56">
                <Dropdown
                  label="Filter Segment"
                  value={selectedSegment}
                  onChange={(val) => setSelectedSegment(val as CustomerSegment)}
                  options={[
                    { label: "All 6 Segments", value: "All" },
                    { label: "VIP & High-Net-Worth (HNWI)", value: "VIP & High-Net-Worth (HNWI)" },
                    { label: "Corporate Accounts", value: "Corporate Accounts" },
                    { label: "Government & Diplomatic", value: "Government & Diplomatic" },
                    { label: "Commercial Fleet Accounts", value: "Commercial Fleet Accounts" },
                    { label: "Individual Retail Clients", value: "Individual Retail Clients" },
                    { label: "Automotive Dealers & Resellers", value: "Automotive Dealers & Resellers" },
                  ]}
                />
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsModalOpen(true)}
                leftIcon={<FiPlus className="w-3.5 h-3.5" />}
                className="text-xs font-bold shrink-0 mt-4 sm:mt-0"
              >
                + New Client Dossier
              </Button>
            </div>
          </div>

          <Table
            data={filteredLeads}
            keyExtractor={(lead) => lead.id}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "id",
                header: "Client ID",
                sortable: true,
                render: (lead) => (
                  <span className="font-mono font-bold text-[#2563EB] text-xs">{lead.id}</span>
                ),
              },
              {
                key: "name",
                header: "Client Full Name / Entity",
                sortable: true,
                render: (lead) => (
                  <div>
                    <span className="font-bold text-xs text-[#0F172A] block">{lead.name}</span>
                    <span className="text-[10px] text-[#64748B]">{lead.rep}</span>
                  </div>
                ),
              },
              {
                key: "tier",
                header: "Customer Segment Tier",
                sortable: true,
                render: (lead) => <Badge variant="gold" size="sm">{lead.tier}</Badge>,
              },
              {
                key: "car",
                header: "Target Vehicle Requirement",
                render: (lead) => <span className="font-medium text-xs text-[#0F172A]">{lead.car}</span>,
              },
              {
                key: "budget",
                header: "Budget Allocation",
                sortable: true,
                render: (lead) => (
                  <span className="font-mono font-bold text-[#0F172A] text-xs">{lead.budget}</span>
                ),
              },
              {
                key: "ltvUSD",
                header: "Account LTV",
                sortable: true,
                render: (lead) => (
                  <span className="font-mono font-bold text-emerald-600 text-xs">
                    ₦{lead.ltvUSD.toLocaleString()}
                  </span>
                ),
              },
              {
                key: "stage",
                header: "Sales Cycle Stage",
                render: (lead) => <Badge variant="charcoal" size="sm">{lead.stage}</Badge>,
              },
            ]}
          />
        </Card>
      )}

      {/* VIEW 2: Complaints & Dispute Resolution Ticketing */}
      {activeTab === "complaints" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-2.5 border-b border-[#E2E8F0]">
            <div>
              <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
                Customer Dispute Resolution & Warranty Claims Docket
              </h3>
              <p className="text-[11px] text-[#64748B]">
                Formal ticketing system with severity grading, department routing, SLA timers, and sign-offs.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="gold" size="sm">
                {complaints.filter((c) => c.status !== "Resolved & Closed").length} Active Tickets
              </Badge>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsNewTicketModalOpen(true)}
                leftIcon={<FiPlus className="w-3.5 h-3.5" />}
                className="text-xs font-bold"
              >
                + Open Dispute Ticket
              </Button>
            </div>
          </div>

          <Table
            data={complaints}
            keyExtractor={(ticket) => ticket.id}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "id",
                header: "Ticket ID",
                sortable: true,
                render: (t) => <span className="font-mono font-bold text-[#2563EB] text-xs">{t.id}</span>,
              },
              {
                key: "client",
                header: "Client & Vehicle",
                sortable: true,
                render: (t) => (
                  <div>
                    <span className="font-bold text-xs text-[#0F172A] block">{t.client}</span>
                    <span className="text-[10px] text-[#64748B] font-mono">{t.vehicle}</span>
                  </div>
                ),
              },
              {
                key: "issue",
                header: "Reported Dispute / Complaint Scope",
                render: (t) => <span className="text-xs text-[#475569]">{t.issue}</span>,
              },
              {
                key: "assignedDept",
                header: "Assigned Resolution Desk",
                sortable: true,
                render: (t) => <span className="text-xs font-semibold text-[#0F172A]">{t.assignedDept}</span>,
              },
              {
                key: "severity",
                header: "Severity Rating",
                render: (t) => (
                  <Badge
                    variant={
                      t.severity.includes("High")
                        ? "charcoal"
                        : t.severity.includes("Medium")
                        ? "gold"
                        : "light"
                    }
                    size="sm"
                  >
                    {t.severity}
                  </Badge>
                ),
              },
              {
                key: "slaHoursRemaining",
                header: "SLA Resolution Countdown",
                sortable: true,
                render: (t) => (
                  <span className={`font-mono text-xs font-bold ${t.slaHoursRemaining < 12 ? "text-red-600" : "text-[#2563EB]"}`}>
                    {t.slaHoursRemaining} Hours Remaining
                  </span>
                ),
              },
              {
                key: "status",
                header: "Status & Sign-Off",
                render: (t) =>
                  t.status === "Resolved & Closed" ? (
                    <Badge variant="gold" size="sm">Resolved</Badge>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      className="h-7 text-[11px]"
                      onClick={() => {
                        setComplaints((prev) =>
                          prev.map((item) =>
                            item.id === t.id ? { ...item, status: "Resolved & Closed" } : item
                          )
                        );
                        notify(`Dispute ticket ${t.id} successfully resolved and archived.`);
                      }}
                      leftIcon={<FiCheck className="w-3 h-3 text-white" />}
                    >
                      Resolve & Close
                    </Button>
                  ),
              },
            ]}
          />
        </Card>
      )}

      {/* VIEW 3: Loyalty & Service Alerts */}
      {activeTab === "reminders" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-2.5 border-b border-[#E2E8F0]">
            <div>
              <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
                Automated Service Reminders & VIP Retention Engine
              </h3>
              <p className="text-[11px] text-[#64748B]">
                Automated alerts for periodic maintenance, warranty expirations, customs audits, and VIP birthdays.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => notify("All pending concierge notifications dispatched via WhatsApp & Email.")}
              leftIcon={<FiSend className="w-3.5 h-3.5 text-[#2563EB]" />}
            >
              Dispatch All Pending Alerts
            </Button>
          </div>

          <Table
            data={reminders}
            keyExtractor={(r) => r.id}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "id",
                header: "Alert Ref",
                sortable: true,
                render: (r) => <span className="font-mono font-bold text-[#2563EB] text-xs">{r.id}</span>,
              },
              {
                key: "client",
                header: "Client Entity",
                sortable: true,
                render: (r) => <span className="font-bold text-[#0F172A] text-xs">{r.client}</span>,
              },
              {
                key: "vehicle",
                header: "Vehicle Covered",
                sortable: true,
                render: (r) => <span className="text-xs text-[#475569]">{r.vehicle}</span>,
              },
              {
                key: "type",
                header: "Protocol Milestone",
                sortable: true,
                render: (r) => <span className="font-semibold text-xs text-[#1D4ED8]">{r.type}</span>,
              },
              {
                key: "dueDate",
                header: "Due Target Date",
                sortable: true,
                render: (r) => <span className="font-mono text-xs text-[#64748B]">{r.dueDate}</span>,
              },
              {
                key: "status",
                header: "Dispatch Status",
                render: (r) => <Badge variant="gold" size="sm">{r.status}</Badge>,
              },
            ]}
          />
        </Card>
      )}

      {/* VIEW 4: Automated Marketing Nurture Drips (PDF Section 24) */}
      {activeTab === "drips" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-2.5 border-b border-[#E2E8F0]">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-[#EFF6FF] text-[#2563EB]">
                  <FiMail className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
                  Automated Marketing Nurture Sequences & Email Drips (Phase 3)
                </h3>
              </div>
              <p className="text-[11px] text-[#64748B]">
                Algorithmic multi-step email and WhatsApp nurture funnels triggered by customer showroom inquiries, test drives, and website interactions.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => notify("Simulated trigger: 14 new nurture messages dispatched to active prospects.")}
              leftIcon={<FiSend className="w-3.5 h-3.5 text-[#2563EB]" />}
            >
              Dispatch Active Queue
            </Button>
          </div>

          <Table
            data={dripCampaigns}
            keyExtractor={(d) => d.id}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "name",
                header: "Nurture Campaign Name & Funnel",
                sortable: true,
                render: (d) => (
                  <div>
                    <span className="font-bold text-xs text-[#0F172A] block">{d.name}</span>
                    <span className="text-[10px] text-[#64748B] font-mono">
                      {d.id} &bull; {d.steps} Stages over {d.duration}
                    </span>
                  </div>
                ),
              },
              {
                key: "trigger",
                header: "System Trigger Event",
                sortable: true,
                render: (d) => (
                  <span className="text-xs text-[#1D4ED8] font-medium bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
                    {d.trigger}
                  </span>
                ),
              },
              {
                key: "targetTier",
                header: "Audience Segment",
                render: (d) => <Badge variant="gold" size="sm">{d.targetTier}</Badge>,
              },
              {
                key: "openRate",
                header: "Open Rate",
                sortable: true,
                render: (d) => (
                  <span className="font-mono font-bold text-[#0F172A] text-xs">{d.openRate}</span>
                ),
              },
              {
                key: "conversionRate",
                header: "Conversion Rate",
                sortable: true,
                render: (d) => (
                  <span className="font-mono font-bold text-emerald-600 text-xs">
                    {d.conversionRate}
                  </span>
                ),
              },
              {
                key: "status",
                header: "Funnel Status",
                render: (d) => (
                  <Badge variant={d.status === "Active" ? "gold" : "charcoal"} size="sm">
                    {d.status}
                  </Badge>
                ),
              },
              {
                key: "actions",
                header: "Action",
                render: (d) => (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[11px]"
                    onClick={() => {
                      setDripCampaigns((prev) =>
                        prev.map((c) =>
                          c.id === d.id
                            ? { ...c, status: c.status === "Active" ? "Paused" : "Active" }
                            : c
                        )
                      );
                      notify(`Campaign ${d.id} is now ${d.status === "Active" ? "Paused" : "Active"}.`);
                    }}
                    leftIcon={d.status === "Active" ? <FiPause className="w-3 h-3 text-amber-600" /> : <FiPlay className="w-3 h-3 text-emerald-600" />}
                  >
                    {d.status === "Active" ? "Pause" : "Activate"}
                  </Button>
                ),
              },
            ]}
          />
        </Card>
      )}

      {/* VIEW 5: CRM Dispute & Ticket Taxonomies */}
      {activeTab === "taxonomies" && (
        <TaxonomyManagerSection
          allowedCategories={["dispute_categories"]}
          title="CRM Dispute & Escalation Taxonomies"
          description="Manage customer complaint ticket categories, escalation classifications, and client dispute tags."
          headerBadge="CRM Desk Authorized"
          showToast={showToast}
        />
      )}

      {/* Modal: New Client Dossier */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="md"
        title="Open New Client CRM Dossier"
        description="Captures client segmentation tier, target vehicle requirements, and initial acquisition budget."
      >
        <form onSubmit={handleCreate} className="space-y-3">
          <Input
            label="Client Full Name / Corporate Entity"
            placeholder="e.g. Chief Alexander Vance"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Dropdown
              label="Customer Segmentation Tier"
              value={tier}
              onChange={(val) => setTier(val as CustomerSegment)}
              options={[
                { label: "VIP & High-Net-Worth (HNWI)", value: "VIP & High-Net-Worth (HNWI)" },
                { label: "Corporate Accounts", value: "Corporate Accounts" },
                { label: "Government & Diplomatic", value: "Government & Diplomatic" },
                { label: "Commercial Fleet Accounts", value: "Commercial Fleet Accounts" },
                { label: "Individual Retail Clients", value: "Individual Retail Clients" },
                { label: "Automotive Dealers & Resellers", value: "Automotive Dealers & Resellers" },
              ]}
            />
            <Input
              label="Target Budget (₦ NGN)"
              placeholder="280,000,000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
            />
          </div>
          <Input
            label="Target Showroom Vehicle Model"
            placeholder="e.g. 2024 Mercedes-Maybach S580"
            value={car}
            onChange={(e) => setCar(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" leftIcon={<FiCheck />}>
              Save Client Dossier
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Open Dispute Ticket */}
      {isNewTicketModalOpen && (
        <Modal
          isOpen={isNewTicketModalOpen}
          onClose={() => setIsNewTicketModalOpen(false)}
          size="md"
          title="Open Customer Dispute & Warranty Claim Ticket"
          description="Logs a formal client dispute with department assignment and SLA resolution tracking."
        >
          <form onSubmit={handleCreateTicket} className="space-y-3">
            <Input
              label="Client / Account Entity Name"
              placeholder="e.g. Alhaji Bello & Sons Ltd"
              value={newTicketClient}
              onChange={(e) => setNewTicketClient(e.target.value)}
              required
            />
            <Input
              label="Associated Vehicle / VIN Reference"
              placeholder="e.g. 2024 Mercedes-Maybach S580 (WDD223...)"
              value={newTicketVehicle}
              onChange={(e) => setNewTicketVehicle(e.target.value)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Dropdown
                label="Dispute Severity Tier"
                value={newTicketSeverity}
                onChange={(val) => setNewTicketSeverity(val as any)}
                options={[
                  { label: "High (Urgent - 12h SLA)", value: "High (Urgent)" },
                  { label: "Medium (Standard - 36h SLA)", value: "Medium (Standard)" },
                  { label: "Low (Cosmetic - 48h SLA)", value: "Low (Cosmetic)" },
                ]}
              />
              <Dropdown
                label="Assigned Department Desk"
                value={newTicketDept}
                onChange={(val) => setNewTicketDept(val as any)}
                options={[
                  { label: "Service Workshop", value: "Service Workshop" },
                  { label: "Delivery & Logistics", value: "Delivery & Logistics" },
                  { label: "Sales & Showroom", value: "Sales" },
                  { label: "Finance & Insurance", value: "Finance & Insurance" },
                ]}
              />
            </div>
            <Input
              label="Issue Description & Resolution Request"
              placeholder="e.g. Customs SGD duty receipt copy requested for corporate tax filing"
              value={newTicketIssue}
              onChange={(e) => setNewTicketIssue(e.target.value)}
              required
            />
            <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
              <Button variant="ghost" size="sm" type="button" onClick={() => setIsNewTicketModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" leftIcon={<FiCheck />}>
                Dispatch Ticket
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
