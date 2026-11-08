"use client";

import React, { useState } from "react";
import {
  FiServer,
  FiShield,
  FiDatabase,
  FiSliders,
  FiCheckCircle,
  FiAlertTriangle,
  FiActivity,
  FiHardDrive,
  FiLock,
  FiRefreshCw,
} from "react-icons/fi";
import { Button, Badge, Input, Card, KPICard, Table } from "@/components/ui";
import { MasterDataPage } from "./MasterDataPage";

export interface SettingsPageProps {
  showToast: (msg: string) => void;
}

interface BackupSnapshot {
  id: string;
  timestamp: string;
  size: string;
  type: "Full Cluster Snapshot" | "WORM Ledger Archive";
  sha256Hash: string;
  status: "Verified & Replicated" | "Active";
}

interface SecurityThreatAlert {
  id: string;
  timestamp: string;
  event: string;
  ipAddress: string;
  actionTaken: "IP Lockout (15 Mins)" | "MFA Challenge Enforced" | "Session Terminated";
  severity: "High" | "Medium" | "Low";
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ showToast }) => {
  const [activeTab, setActiveTab] = useState<"parameters" | "master-data" | "telemetry" | "security" | "backups">("parameters");

  // Global Financial & Authorization Ceilings (Section 17 & 23)
  const [discountCeiling, setDiscountCeiling] = useState("3.0");
  const [purchaseCeiling, setPurchaseCeiling] = useState("155,000,000");
  const [wireCeiling, setWireCeiling] = useState("75,000,000");
  const [reservationLockHours, setReservationLockHours] = useState("48");
  const [dealershipCurrency, setDealershipCurrency] = useState("NGN (Nigerian Naira)");
  const [vatRate, setVatRate] = useState("7.5");

  const backups: BackupSnapshot[] = [
    { id: "BKP-2026-1108", timestamp: "2026-11-08 02:00 UTC", size: "4.8 GB", type: "Full Cluster Snapshot", sha256Hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", status: "Verified & Replicated" },
    { id: "BKP-2026-1107", timestamp: "2026-11-07 02:00 UTC", size: "4.7 GB", type: "Full Cluster Snapshot", sha256Hash: "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4", status: "Verified & Replicated" },
    { id: "BKP-2026-1106", timestamp: "2026-11-06 02:00 UTC", size: "4.6 GB", type: "WORM Ledger Archive", sha256Hash: "3a52e043685e135d0389158013b8602b9f074d2b270fd3be6c4a8693ccb3ea2b", status: "Verified & Replicated" },
  ];

  const securityLogs: SecurityThreatAlert[] = [
    { id: "SEC-901", timestamp: "2026-11-08 14:22 WAT", event: "Brute-force credential probe on /erp/login", ipAddress: "197.210.226.44 (Lagos, NG)", actionTaken: "IP Lockout (15 Mins)", severity: "Medium" },
    { id: "SEC-902", timestamp: "2026-11-07 09:14 WAT", event: "Unauthorized cross-department clearance attempt", ipAddress: "102.89.33.12 (Abuja, NG)", actionTaken: "Session Terminated", severity: "High" },
    { id: "SEC-903", timestamp: "2026-11-06 18:05 WAT", event: "Unrecognized new browser hardware signature", ipAddress: "197.210.88.92 (VI HQ)", actionTaken: "MFA Challenge Enforced", severity: "Low" },
  ];

  const handleSaveParameters = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Global dealership governance limits and monetary ceilings updated successfully.");
  };

  const handleTriggerBackupNow = () => {
    showToast("Manual PostgreSQL snapshot initiated. Cluster replication running in background.");
  };

  return (
    <div className="space-y-4">
      {/* 1. Infrastructure Telemetry KPI Strip */}
      <div className="gap-3 grid grid-cols-2 sm:grid-cols-4">
        <KPICard
          title="System Telemetry Uptime"
          value="99.98%"
          change="Zero Outage (Past 90 Days)"
          icon={<FiServer className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="API Response Latency"
          value="38 ms"
          change="Edge-Cached Global CDN"
          icon={<FiActivity className="w-5 h-5 text-emerald-600" />}
        />
        <KPICard
          title="Document Vault Storage"
          value="14.2 GB"
          change="Encrypted S3 Multi-Region"
          icon={<FiHardDrive className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="MFA Security Protocol"
          value="FIDO2 Active"
          change="WORM SHA-256 Audit Trail"
          icon={<FiLock className="w-5 h-5 text-[#2563EB]" />}
        />
      </div>

      {/* 2. Sub-Tabs Bar */}
      <Card className="shadow-xs p-3">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2">
          <div className="flex flex-wrap gap-1">
            <Button
              variant={activeTab === "parameters" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("parameters")}
              className="text-xs font-bold"
            >
              Approval Limits & Governance
            </Button>
            <Button
              variant={activeTab === "master-data" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("master-data")}
              className="text-xs font-bold"
            >
              Master Data & Dropdown Registry
            </Button>
            <Button
              variant={activeTab === "telemetry" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("telemetry")}
              className="text-xs font-bold"
            >
              System Health & Node Status
            </Button>
            <Button
              variant={activeTab === "security" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("security")}
              className="text-xs font-bold"
            >
              Security Alerts & IP Lockout ({securityLogs.length})
            </Button>
            <Button
              variant={activeTab === "backups" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("backups")}
              className="text-xs font-bold"
            >
              Backup & Disaster Recovery ({backups.length})
            </Button>
          </div>

          {activeTab === "backups" && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleTriggerBackupNow}
              leftIcon={<FiRefreshCw className="w-3.5 h-3.5" />}
            >
              Snapshot Now
            </Button>
          )}
        </div>
      </Card>

      {/* VIEW 1: Approval Limits & Governance */}
      {activeTab === "parameters" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div>
            <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
              Dealership Monetary Authorization Limits & Governance (PDF Section 17 & 23)
            </h3>
            <p className="text-[11px] text-[#64748B]">
              Configure representative discount ceilings (Rule 4), PO capital thresholds (Rule 5), and reservation lock durations (Rule 3)
            </p>
          </div>

          <form onSubmit={handleSaveParameters} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-3">
                <span className="font-bold text-[#0F172A] text-xs uppercase block tracking-wider">
                  Executive Approval Thresholds (Business Rules 4 & 5)
                </span>
                <Input
                  label="Sales Rep Discount Ceiling (%) - Rule 4"
                  value={discountCeiling}
                  onChange={(e) => setDiscountCeiling(e.target.value)}
                  helperText="Discounts exceeding this limit automatically route to Executive Approvals."
                />
                <Input
                  label="Vehicle PO Executive Authorization Limit (₦ NGN) - Rule 5"
                  value={purchaseCeiling}
                  onChange={(e) => setPurchaseCeiling(e.target.value)}
                  helperText="Procurement orders at or above ₦150,000,000 require formal executive sign-off."
                />
                <Input
                  label="Chief Accountant Wire Disbursement Ceiling (₦ NGN)"
                  value={wireCeiling}
                  onChange={(e) => setWireCeiling(e.target.value)}
                />
              </div>

              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-3">
                <span className="font-bold text-[#0F172A] text-xs uppercase block tracking-wider">
                  Financial & Inventory Lockout Parameters (Business Rule 3)
                </span>
                <Input
                  label="Vehicle Reservation Expiration Window (Hours) - Rule 3"
                  value={reservationLockHours}
                  onChange={(e) => setReservationLockHours(e.target.value)}
                  helperText="Unconfirmed reservations are automatically released back to 'Available'."
                />
                <Input
                  label="Dealership Standard Operating Currency"
                  value={dealershipCurrency}
                  onChange={(e) => setDealershipCurrency(e.target.value)}
                />
                <Input
                  label="Federal Inland Revenue Service (FIRS) Output VAT (%)"
                  value={vatRate}
                  onChange={(e) => setVatRate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#E2E8F0]">
              <Button variant="primary" size="sm" type="submit" leftIcon={<FiCheckCircle className="w-3.5 h-3.5" />}>
                Save Global Governance Parameters
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* VIEW: Master Data & Dropdown Registry */}
      {activeTab === "master-data" && (
        <MasterDataPage showToast={showToast} />
      )}

      {/* VIEW 2: System Health & Telemetry */}
      {activeTab === "telemetry" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div>
            <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
              System Telemetry, Cluster Health & Infrastructure Node Status
            </h3>
            <p className="text-[11px] text-[#64748B]">
              Real-time monitoring of application servers, PostgreSQL connection pooling, and multi-region database latency
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-[#64748B] uppercase">Primary App Cluster</span>
              <div className="font-bold text-[#0F172A] text-sm">Next.js 14 Production Server</div>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Operational (Port 3000)
              </span>
            </div>

            <div className="p-4 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-[#64748B] uppercase">Relational Database Node</span>
              <div className="font-bold text-[#0F172A] text-sm">PostgreSQL 16 Enterprise</div>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Connection Pool Healthy (18 Active)
              </span>
            </div>

            <div className="p-4 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-[#64748B] uppercase">Document Vault Storage</span>
              <div className="font-bold text-[#0F172A] text-sm">AWS S3 Frankfurt / Lagos Edge</div>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                AES-256 Multi-Region Replicated
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* VIEW 3: Security Threats & Lockout Alerts */}
      {activeTab === "security" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div>
            <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
              Security Incident, Threat Alerts & Intrusion Mitigation Log
            </h3>
            <p className="text-[11px] text-[#64748B]">
              Real-time monitoring of failed login attempts, IP lockout triggers, and unauthorized clearance escalations
            </p>
          </div>

          <Table
            data={securityLogs}
            keyExtractor={(log) => log.id}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "id",
                header: "Alert Ref",
                sortable: true,
                render: (l) => <span className="font-mono font-bold text-[#2563EB] text-xs">{l.id}</span>,
              },
              {
                key: "timestamp",
                header: "Timestamp",
                sortable: true,
                render: (l) => <span className="font-mono text-xs text-[#0F172A]">{l.timestamp}</span>,
              },
              {
                key: "event",
                header: "Security Incident Event",
                sortable: true,
                render: (l) => <span className="font-semibold text-xs text-[#0F172A]">{l.event}</span>,
              },
              {
                key: "ipAddress",
                header: "Origin IP & Geolocation",
                render: (l) => <span className="font-mono text-xs text-[#475569]">{l.ipAddress}</span>,
              },
              {
                key: "severity",
                header: "Threat Level",
                render: (l) => (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      l.severity === "High"
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {l.severity}
                  </span>
                ),
              },
              {
                key: "actionTaken",
                header: "Mitigation Action Enforced",
                render: (l) => <Badge variant="gold" size="sm">{l.actionTaken}</Badge>,
              },
            ]}
          />
        </Card>
      )}

      {/* VIEW 4: Backup & Disaster Recovery */}
      {activeTab === "backups" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div>
            <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
              Automated Database Backup & Disaster Recovery Schedule
            </h3>
            <p className="text-[11px] text-[#64748B]">
              Daily automated full cluster snapshots and immutable WORM SHA-256 archive ledger verification
            </p>
          </div>

          <Table
            data={backups}
            keyExtractor={(b) => b.id}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "id",
                header: "Snapshot ID",
                sortable: true,
                render: (b) => <span className="font-mono font-bold text-[#2563EB] text-xs">{b.id}</span>,
              },
              {
                key: "timestamp",
                header: "Creation Timestamp",
                sortable: true,
                render: (b) => <span className="font-mono text-xs text-[#0F172A]">{b.timestamp}</span>,
              },
              {
                key: "type",
                header: "Backup Classification",
                sortable: true,
                render: (b) => <span className="text-xs font-semibold text-[#1D4ED8]">{b.type}</span>,
              },
              {
                key: "size",
                header: "Archive Size",
                render: (b) => <span className="font-mono text-xs text-[#475569]">{b.size}</span>,
              },
              {
                key: "sha256Hash",
                header: "Cryptographic SHA-256 Hash",
                render: (b) => <span className="font-mono text-[10px] text-[#64748B] truncate max-w-[140px] block">{b.sha256Hash}</span>,
              },
              {
                key: "status",
                header: "Cluster Integrity",
                render: (b) => <Badge variant="gold" size="sm">{b.status}</Badge>,
              },
            ]}
          />
        </Card>
      )}
    </div>
  );
};
