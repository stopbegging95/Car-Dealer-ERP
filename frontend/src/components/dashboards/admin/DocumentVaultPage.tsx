"use client";

import React, { useState } from "react";
import {
  FiDownload,
  FiFileText,
  FiShield,
  FiCheckCircle,
  FiClock,
  FiPlus,
  FiCheck,
  FiLock,
  FiAlertTriangle,
} from "react-icons/fi";
import { FaScaleBalanced } from "react-icons/fa6";
import { Button, Card, KPICard, Badge, Modal, Input, Dropdown, Table } from "@/components/ui";

export interface DocumentVaultPageProps {
  onDownloadDoc: (doc: {
    name: string;
    car: string;
    type: string;
    date: string;
    size: string;
  }) => void;
}

interface ContractAgreement {
  id: string;
  title: string;
  clientOrParty: string;
  vehicleRef: string;
  contractType: "Sales Agreement" | "Trade-In Swap Agreement" | "Supplier Consignment" | "Warranty Protocol";
  status: "Fully Countersigned" | "Awaiting Client Signature" | "Legal Review";
  date: string;
}

interface RegulatoryRenewal {
  id: string;
  permitTitle: string;
  statutoryAgency: string;
  expiryDate: string;
  daysRemaining: number;
  status: "Current & Active" | "Renewal Due Within 30 Days";
}

interface LegalDisputeDocket {
  id: string;
  subject: string;
  opposingParty: string;
  matterCategory: "Consumer Protection" | "Customs Duty Audit" | "Police CMR Clarification" | "Contract Warranty";
  status: "Resolved & Closed" | "In Active Hearing";
  counsel: string;
}

export const DocumentVaultPage: React.FC<DocumentVaultPageProps> = ({ onDownloadDoc }) => {
  const [activeTab, setActiveTab] = useState<"vault" | "contracts" | "renewals" | "disputes">("vault");

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [docName, setDocName] = useState("");
  const [docCar, setDocCar] = useState("2024 Mercedes-Maybach S580");
  const [docType, setDocType] = useState("Customs Single Goods Declaration (SGD)");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const [documentsList, setDocumentsList] = useState([
    { name: "Single Goods Declaration (SGD) - Port of Lagos Release", car: "Maybach S580 (VIN: WDD223...001)", type: "Customs Duty Certificate", date: "2026-11-02", size: "2.1 MB PDF", classification: "Statutory Port Release" },
    { name: "150-Point Pre-Delivery Inspection (PDI) Health Seal", car: "Porsche 911 Turbo S (VIN: WP0AD2...002)", type: "Diagnostic Inspection", date: "2026-11-01", size: "3.4 MB PDF", classification: "Workshop Certification" },
    { name: "Certificate of Ownership & Title Registration (CMR)", car: "Range Rover Autobiography (VIN: SALWR2...003)", type: "Title Document", date: "2026-10-28", size: "1.9 MB PDF", classification: "Title Deed" },
    { name: "Marine Cargo Bill of Lading (B/L) - Antwerp Discharge", car: "Ferrari 296 GTB (VIN: ZFF88...004)", type: "Bill of Lading", date: "2026-10-24", size: "1.6 MB PDF", classification: "Maritime Shipping" },
    { name: "Nigeria Police Force Tinted Glass Security Permit", car: "Mercedes-AMG G63 Magno (VIN: W1N9G8...007)", type: "Police Clearance", date: "2026-10-20", size: "1.2 MB PDF", classification: "Security Clearance" },
    { name: "SCUML & EFCC Anti-Money Laundering Deal Clearance", car: "Bentley Continental GT (VIN: SCBCB...009)", type: "AML Compliance Filing", date: "2026-10-18", size: "1.4 MB PDF", classification: "Regulatory Audit" },
  ]);

  const contracts: ContractAgreement[] = [
    { id: "CTR-901", title: "Vehicle Sales Agreement & Retention of Title", clientOrParty: "Alhaji Bello & Sons Ltd", vehicleRef: "Maybach S580", contractType: "Sales Agreement", status: "Fully Countersigned", date: "2026-11-04" },
    { id: "CTR-902", title: "Mutual Trade-In Equity & Settlement Deed", clientOrParty: "Dr. K. Somoye", vehicleRef: "Porsche 911 Turbo S", contractType: "Trade-In Swap Agreement", status: "Fully Countersigned", date: "2026-11-02" },
    { id: "CTR-903", title: "European Dealership Consignment Protocol", clientOrParty: "Bavaria Auto Export GmbH", vehicleRef: "2024 Inventory Allocation", contractType: "Supplier Consignment", status: "Legal Review", date: "2026-10-29" },
  ];

  const renewals: RegulatoryRenewal[] = [
    { id: "LIC-01", permitTitle: "Corporate Automotive Dealership Trade License", statutoryAgency: "Lagos State Ministry of Commerce", expiryDate: "2027-08-31", daysRemaining: 296, status: "Current & Active" },
    { id: "LIC-02", permitTitle: "Federal Expatriate Business Quota & CERPAC", statutoryAgency: "Nigeria Immigration Service", expiryDate: "2026-12-05", daysRemaining: 27, status: "Renewal Due Within 30 Days" },
    { id: "LIC-03", permitTitle: "Comprehensive Marine Cargo Transit Policy", statutoryAgency: "Leadway Assurance Plc", expiryDate: "2027-04-15", daysRemaining: 158, status: "Current & Active" },
    { id: "LIC-04", permitTitle: "Commercial Dealer Trade Plate Accreditation", statutoryAgency: "Federal Road Safety Corps (FRSC)", expiryDate: "2027-01-20", daysRemaining: 73, status: "Current & Active" },
  ];

  const disputes: LegalDisputeDocket[] = [
    { id: "LEG-101", subject: "Port Terminal Demurrage Waiver Assessment", opposingParty: "Tin Can Island Terminal Authority", matterCategory: "Customs Duty Audit", status: "Resolved & Closed", counsel: "Barrister O. Ajayi (Legal Counsel)" },
    { id: "LEG-102", subject: "Chassis Vin Micro-Dot CMR Registration", opposingParty: "Nigeria Police Central Registry", matterCategory: "Police CMR Clarification", status: "Resolved & Closed", counsel: "Barrister O. Ajayi (Legal Counsel)" },
  ];

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;
    const newDoc = {
      name: docName,
      car: docCar,
      type: docType,
      date: "Nov 08, 2026",
      size: "2.4 MB PDF",
      classification: "Certified Vault Record",
    };
    setDocumentsList([newDoc, ...documentsList]);
    setIsUploadOpen(false);
    showToast(`Uploaded and cryptographically registered ${docName} to Document Vault.`);
    setDocName("");
  };

  return (
    <div className="space-y-4">
      {toastMessage && (
        <div className="flex items-center gap-2 bg-[#EFF6FF] border border-[#2563EB] text-[#1E40AF] px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs animate-in fade-in duration-200">
          <FiCheckCircle className="w-4 h-4 text-[#2563EB] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Legal KPI Strip */}
      <div className="gap-3 grid grid-cols-2 sm:grid-cols-4">
        <KPICard
          title="Certified Title Vault"
          value={`${documentsList.length} Files`}
          change="WORM SHA-256 Watermark"
          icon={<FiShield className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Signed Contracts"
          value={`${contracts.length} Agreements`}
          change="Fully Countersigned"
          icon={<FiFileText className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Regulatory Licenses"
          value={`${renewals.length} Permits`}
          change="1 Renewal Due in 30 Days"
          icon={<FiClock className="w-5 h-5 text-amber-600" />}
        />
        <KPICard
          title="Litigation & Disputes"
          value="0 Active Lawsuits"
          change="All Matters Cleared"
          icon={<FaScaleBalanced className="w-5 h-5 text-emerald-600" />}
        />
      </div>

      {/* 2. Sub-Tabs Bar */}
      <Card className="shadow-xs p-3">
        <div className="flex flex-wrap gap-1">
          <Button
            variant={activeTab === "vault" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("vault")}
            className="text-xs font-bold"
          >
            Document Vault ({documentsList.length})
          </Button>
          <Button
            variant={activeTab === "contracts" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("contracts")}
            className="text-xs font-bold"
          >
            Digital Contracts ({contracts.length})
          </Button>
          <Button
            variant={activeTab === "renewals" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("renewals")}
            className="text-xs font-bold"
          >
            License Expirations & Renewals ({renewals.length})
          </Button>
          <Button
            variant={activeTab === "disputes" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("disputes")}
            className="text-xs font-bold"
          >
            Legal Matters Docket ({disputes.length})
          </Button>
        </div>
      </Card>

      {/* VIEW 1: Document Vault Repository */}
      {activeTab === "vault" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-3">
            <div>
              <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
                Encrypted Vehicle Title & Regulatory Document Vault
              </h3>
              <p className="text-[11px] text-[#64748B]">
                Cryptographically watermarked titles, customs Single Goods Declarations (SGD), police clearances & inspection certificates
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsUploadOpen(true)}
              leftIcon={<FiPlus className="w-3.5 h-3.5" />}
            >
              + Upload Vault File
            </Button>
          </div>

          <Table
            data={documentsList}
            keyExtractor={(doc, idx) => `${doc.name}-${idx}`}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "name",
                header: "Document Title",
                sortable: true,
                render: (doc) => (
                  <div className="flex items-center gap-2.5">
                    <div className="bg-[#EFF6FF] p-1.5 border border-[#BFDBFE] rounded text-[#2563EB] shrink-0">
                      <FiFileText className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-[#0F172A] text-xs">{doc.name}</div>
                      <span className="font-mono text-[#2563EB] text-[10px]">{doc.type}</span>
                    </div>
                  </div>
                ),
              },
              {
                key: "car",
                header: "Associated Vehicle",
                sortable: true,
                render: (doc) => <span className="text-xs text-[#0F172A]">{doc.car}</span>,
              },
              {
                key: "classification",
                header: "Classification",
                sortable: true,
                render: (doc) => <Badge variant="charcoal" size="sm">{doc.classification}</Badge>,
              },
              {
                key: "date",
                header: "Upload Date",
                sortable: true,
                render: (doc) => <span className="font-mono text-[11px] text-[#64748B]">{doc.date}</span>,
              },
              {
                key: "size",
                header: "File Size",
                render: (doc) => <span className="font-mono text-[10px] text-[#64748B]">{doc.size}</span>,
              },
              {
                key: "action",
                header: "Action",
                align: "right",
                render: (doc) => (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDownloadDoc(doc)}
                    className="px-2.5 py-1 text-xs"
                    leftIcon={<FiDownload className="w-3 h-3 text-[#2563EB]" />}
                  >
                    Download PDF
                  </Button>
                ),
              },
            ]}
          />
        </Card>
      )}

      {/* VIEW 2: Digital Contracts & Countersignatures */}
      {activeTab === "contracts" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div>
            <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
              Digital Contracts, Deeds & Signature Workflow
            </h3>
            <p className="text-[11px] text-[#64748B]">
              Sales contracts, mutual trade-in equity settlement deeds, and supplier consignment covenants
            </p>
          </div>

          <Table
            data={contracts}
            keyExtractor={(c) => c.id}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "id",
                header: "Contract Ref",
                sortable: true,
                render: (c) => <span className="font-mono font-bold text-[#2563EB] text-xs">{c.id}</span>,
              },
              {
                key: "title",
                header: "Agreement Title",
                sortable: true,
                render: (c) => (
                  <div>
                    <span className="font-bold text-[#0F172A] text-xs">{c.title}</span>
                    <span className="block text-[10px] text-[#64748B]">{c.contractType}</span>
                  </div>
                ),
              },
              {
                key: "clientOrParty",
                header: "Signatory Party",
                render: (c) => <span className="text-xs font-semibold text-[#0F172A]">{c.clientOrParty}</span>,
              },
              {
                key: "vehicleRef",
                header: "Vehicle Covered",
                render: (c) => <span className="text-xs text-[#475569]">{c.vehicleRef}</span>,
              },
              {
                key: "date",
                header: "Date Executed",
                sortable: true,
                render: (c) => <span className="font-mono text-xs text-[#64748B]">{c.date}</span>,
              },
              {
                key: "status",
                header: "Signature Status",
                render: (c) => <Badge variant="gold" size="sm">{c.status}</Badge>,
              },
            ]}
          />
        </Card>
      )}

      {/* VIEW 3: Document Expirations & Renewals */}
      {activeTab === "renewals" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div>
            <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
              Statutory License Expirations & Corporate Permit Renewals
            </h3>
            <p className="text-[11px] text-[#64748B]">
              Automated countdown alerts for dealership business permits, expatriate quotas (CERPAC), transit insurance, and FRSC plates
            </p>
          </div>

          <Table
            data={renewals}
            keyExtractor={(r) => r.id}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "id",
                header: "Permit Ref",
                sortable: true,
                render: (r) => <span className="font-mono font-bold text-[#2563EB] text-xs">{r.id}</span>,
              },
              {
                key: "permitTitle",
                header: "Statutory License Title",
                sortable: true,
                render: (r) => <span className="font-bold text-[#0F172A] text-xs">{r.permitTitle}</span>,
              },
              {
                key: "statutoryAgency",
                header: "Issuing Government Agency",
                render: (r) => <span className="text-xs text-[#475569]">{r.statutoryAgency}</span>,
              },
              {
                key: "expiryDate",
                header: "Expiration Date",
                sortable: true,
                render: (r) => <span className="font-mono font-bold text-xs text-[#0F172A]">{r.expiryDate}</span>,
              },
              {
                key: "daysRemaining",
                header: "Validity Countdown",
                sortable: true,
                render: (r) => (
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-bold ${
                      r.daysRemaining <= 30
                        ? "bg-amber-50 text-amber-800 border-amber-300 animate-pulse"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}
                  >
                    <FiClock className="w-2.5 h-2.5" />
                    {r.daysRemaining} Days Remaining
                  </span>
                ),
              },
              {
                key: "status",
                header: "Permit Status",
                render: (r) => <Badge variant="gold" size="sm">{r.status}</Badge>,
              },
            ]}
          />
        </Card>
      )}

      {/* VIEW 4: Legal Matters Docket */}
      {activeTab === "disputes" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div>
            <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
              Legal Matters, Regulatory Inquiries & Dispute Docket
            </h3>
            <p className="text-[11px] text-[#64748B]">
              Registry of corporate legal compliance reviews, police title validations, and customs port tariff adjudications
            </p>
          </div>

          <Table
            data={disputes}
            keyExtractor={(d) => d.id}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "id",
                header: "Docket ID",
                sortable: true,
                render: (d) => <span className="font-mono font-bold text-[#2563EB] text-xs">{d.id}</span>,
              },
              {
                key: "subject",
                header: "Matter Subject",
                sortable: true,
                render: (d) => <span className="font-bold text-[#0F172A] text-xs">{d.subject}</span>,
              },
              {
                key: "opposingParty",
                header: "Regulatory Entity",
                render: (d) => <span className="text-xs text-[#475569]">{d.opposingParty}</span>,
              },
              {
                key: "matterCategory",
                header: "Category",
                render: (d) => <span className="text-xs font-semibold text-[#1D4ED8]">{d.matterCategory}</span>,
              },
              {
                key: "counsel",
                header: "Assigned Counsel",
                render: (d) => <span className="text-xs text-[#0F172A] font-medium">{d.counsel}</span>,
              },
              {
                key: "status",
                header: "Status",
                render: (d) => <Badge variant="gold" size="sm">{d.status}</Badge>,
              },
            ]}
          />
        </Card>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload Encrypted Title / Statutory Document"
        size="md"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-3">
          <Input
            label="Document Title & Reference"
            placeholder="e.g. Customs Single Goods Declaration (SGD-99120)"
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Dropdown
              label="Associated Vehicle / VIN"
              options={[
                { label: "2024 Mercedes-Maybach S580 (VIN: WDD223...)", value: "Maybach S580 (VIN: WDD223...001)" },
                { label: "2024 Porsche 911 Turbo S (VIN: WP0AD2...)", value: "Porsche 911 Turbo S (VIN: WP0AD2...002)" },
                { label: "2023 Range Rover Autobiography (VIN: SALWR2...)", value: "Range Rover Autobiography (VIN: SALWR2...003)" },
                { label: "2024 Mercedes-AMG G63 Magno (VIN: W1N9G8...)", value: "Mercedes-AMG G63 Magno (VIN: W1N9G8...007)" },
              ]}
              value={docCar}
              onChange={(val) => setDocCar(String(val))}
            />
            <Dropdown
              label="Statutory Classification"
              options={[
                { label: "Customs Duty Certificate (SGD)", value: "Customs Duty Certificate" },
                { label: "Title Deed & Certificate of Origin", value: "Title Document" },
                { label: "Police CMR & Tinted Permit", value: "Police Clearance" },
                { label: "Pre-Delivery Inspection (PDI) Seal", value: "Diagnostic Inspection" },
                { label: "Maritime Bill of Lading (B/L)", value: "Bill of Lading" },
              ]}
              value={docType}
              onChange={(val) => setDocType(String(val))}
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsUploadOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" leftIcon={<FiCheck />}>
              Deposit into Vault
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
