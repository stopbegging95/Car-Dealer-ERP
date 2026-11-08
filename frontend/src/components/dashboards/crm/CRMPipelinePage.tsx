"use client";

import React, { useState } from "react";
import {
  FiUsers,
  FiClock,
  FiFileText,
  FiCheckCircle,
  FiPlus,
  FiCheck,
} from "react-icons/fi";
import { KPICard, Card, Button, Badge, Modal, Input, Dropdown } from "@/components/ui";

export interface CRMLeadItem {
  id: string;
  name: string;
  tier: string;
  car: string;
  budget: string;
  stage: string;
  rep: string;
}

export interface CRMPipelinePageProps {
  showToast?: (msg: string) => void;
}

export const CRMPipelinePage: React.FC<CRMPipelinePageProps> = ({ showToast }) => {
  const [leads, setLeads] = useState<CRMLeadItem[]>([
    { id: "CRM-101", name: "Alhaji Bello & Sons Ltd", tier: "Corporate Fleet", car: "Mercedes-Maybach S580", budget: "$180,000", stage: "Delivery Scheduled", rep: "Senior VIP Concierge" },
    { id: "CRM-102", name: "Dr. K. Somoye", tier: "Private HNI Buyer", car: "Porsche 911 Turbo S", budget: "$230,000", stage: "Quote Review", rep: "Sports Division Desk" },
    { id: "CRM-103", name: "Senator Godswill O.", tier: "Diplomatic / Gov", car: "Mercedes-AMG G63 Magno", budget: "$250,000", stage: "Trade-In Review", rep: "Abuja Suite Director" },
    { id: "CRM-104", name: "Mrs. Folashade A.", tier: "Executive Chauffeuring", car: "Range Rover Autobiography", budget: "$200,000", stage: "VIP Test Drive", rep: "Victoria Island Team" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [tier, setTier] = useState("Private HNI Buyer");
  const [car, setCar] = useState("2024 Mercedes-Maybach S580");
  const [budget, setBudget] = useState("");
  const [stage, setStage] = useState("Stage 1: Inbound Lead");
  const [rep, setRep] = useState("Senior VIP Concierge");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    const newEntry: CRMLeadItem = {
      id: `CRM-${105 + leads.length}`,
      name,
      tier,
      car,
      budget: `$${Number(budget.replace(/[^0-9]/g, "") || 0).toLocaleString()}`,
      stage,
      rep,
    };
    setLeads([newEntry, ...leads]);
    setIsModalOpen(false);
    if (showToast) showToast(`VIP Lead logged for ${name} (${car}).`);
    setName("");
    setBudget("");
  };

  return (
    <div className="space-y-4">
      <div className="gap-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Stage 1: Inbound Lead"
          value={`${14 + leads.length} Prospects`}
          change="Website & WhatsApp Concierge"
          icon={<FiUsers className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Stage 2: VIP Test Drive"
          value="6 Scheduled"
          change="Showroom & Chauffeur Delivery"
          icon={<FiClock className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Stage 3: Quote Review"
          value="4 Active Quotes"
          change="Pending Executive Sign-off"
          icon={<FiFileText className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Stage 4: Won / Delivery"
          value="8 Closed ($1.8M)"
          change="Handover Inspection Ready"
          icon={<FiCheckCircle className="w-5 h-5 text-[#2563EB]" />}
        />
      </div>

      {/* Leads Table Card */}
      <Card className="space-y-3 shadow-xs p-4 sm:p-5">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-2.5 border-b border-[#E2E8F0]">
          <div>
            <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
              VIP Client Relationship & High-Net-Worth Pipeline
            </h3>
            <p className="text-[11px] text-[#64748B]">Bespoke vehicle procurement briefs, test drive tracking & diplomat protocol liaison</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<FiPlus className="w-3.5 h-3.5" />}
          >
            + Log VIP Client Lead
          </Button>
        </div>

        {/* Modal for Logging VIP Lead */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Log New VIP Client Relationship Lead"
          size="md"
        >
          <form onSubmit={handleCreate} className="space-y-3">
            <Input
              label="Client / Entity Name"
              placeholder="e.g. Chief Vance / Embassy of France"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Dropdown
                label="Client Tier"
                options={[
                  { label: "Private HNI Buyer", value: "Private HNI Buyer" },
                  { label: "Corporate Fleet Account", value: "Corporate Fleet Account" },
                  { label: "Diplomatic / Government", value: "Diplomatic / Gov" },
                  { label: "Executive Chauffeuring", value: "Executive Chauffeuring" },
                ]}
                value={tier}
                onChange={(val) => setTier(String(val))}
              />
              <Dropdown
                label="Vehicle Specification"
                options={[
                  { label: "2024 Mercedes-Maybach S580", value: "Mercedes-Maybach S580" },
                  { label: "2024 Porsche 911 Turbo S", value: "Porsche 911 Turbo S" },
                  { label: "2023 Range Rover Autobiography", value: "Range Rover Autobiography" },
                  { label: "2024 Mercedes-AMG G63 Magno", value: "Mercedes-AMG G63 Magno" },
                ]}
                value={car}
                onChange={(val) => setCar(String(val))}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Target Budget ($)"
                type="text"
                placeholder="e.g. 210,000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
              />
              <Dropdown
                label="Pipeline Stage"
                options={[
                  { label: "Stage 1: Inbound Lead", value: "Inbound Lead" },
                  { label: "Stage 2: VIP Test Drive", value: "VIP Test Drive" },
                  { label: "Stage 3: Quote Review", value: "Quote Review" },
                  { label: "Stage 4: Contract Signed", value: "Contract Signed" },
                ]}
                value={stage}
                onChange={(val) => setStage(String(val))}
              />
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
              <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" leftIcon={<FiCheck />}>
                Record VIP Client Profile
              </Button>
            </div>
          </form>
        </Modal>

        <div className="space-y-2 text-xs">
          {leads.map((lead) => (
            <div key={lead.id} className="flex sm:flex-row flex-col justify-between sm:items-center gap-2.5 bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-md">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#2563EB]">{lead.id}</span>
                  <span className="font-bold text-[#0F172A]">{lead.name}</span>
                  <Badge variant="gold" size="sm">{lead.tier}</Badge>
                </div>
                <span className="block mt-0.5 text-[#64748B] text-[11px]">
                  Vehicle: <strong>{lead.car}</strong> &bull; Budget: {lead.budget} &bull; Liaison: {lead.rep}
                </span>
              </div>
              <div className="flex items-center self-end sm:self-auto gap-2">
                <span className="bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE] font-bold text-[#1D4ED8] text-[10px]">
                  {lead.stage}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

