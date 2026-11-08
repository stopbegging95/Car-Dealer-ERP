"use client";

import React, { useState } from "react";
import { FiPlus, FiCheck } from "react-icons/fi";
import { Button, Badge, Card, Modal, Input, Dropdown } from "@/components/ui";

export interface ReconOrderItem {
  stock: string;
  car: string;
  currentStage: string;
  tech: string;
  finish: string;
  status: string;
}

export interface ReconPipelinePageProps {
  showToast?: (msg: string) => void;
}

export const ReconPipelinePage: React.FC<ReconPipelinePageProps> = ({ showToast }) => {
  const [reconList, setReconList] = useState<ReconOrderItem[]>([
    { stock: "STK-2026-001", car: "Mercedes-Maybach S580", currentStage: "Stage 5: Final White-Glove Seal", tech: "Sola O. (Master Detailer)", finish: "9H Ceramic Cured (Pass)", status: "Ready for Delivery" },
    { stock: "STK-2026-002", car: "Porsche 911 Turbo S", currentStage: "Stage 3: 9H Ceramic Cure Booth", tech: "K. Alabi", finish: "Infrared Curing (1 hr left)", status: "In Curing Booth" },
    { stock: "STK-2026-007", car: "Mercedes-AMG G63 Magno", currentStage: "Stage 2: 3-Step Paint Cut", tech: "Sola O.", finish: "Magno Matte Treatment", status: "In Progress" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stock, setStock] = useState("");
  const [car, setCar] = useState("2024 Mercedes-Maybach S580");
  const [stage, setStage] = useState("Stage 1: Wash & Decontamination");
  const [tech, setTech] = useState("Sola O. (Master Detailer)");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: ReconOrderItem = {
      stock: stock || `STK-2026-00${reconList.length + 8}`,
      car,
      currentStage: stage,
      tech,
      finish: "Detailing In Progress",
      status: "In Progress",
    };
    setReconList([newEntry, ...reconList]);
    setIsModalOpen(false);
    if (showToast) showToast(`Vehicle ${newEntry.stock} queued into ${stage}.`);
    setStock("");
  };

  return (
    <Card className="space-y-3 shadow-xs p-4 sm:p-5">
      <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-2.5 border-[#E2E8F0] border-b">
        <div>
          <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">5-Stage Aesthetic Recon & Delivery Handover Pipeline</h3>
          <p className="text-[#64748B] text-[11px]">Paint correction, interior deep steam, ceramic seal & white-glove readiness</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="gold" size="sm">Detailing Bay Status</Badge>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<FiPlus className="w-3.5 h-3.5 text-[#FFFFFF]" />}
          >
            Queue Recon Order
          </Button>
        </div>
      </div>

      {/* Modal for Queuing New Recon Order */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Queue Vehicle for Aesthetic Detailing & Recon"
        size="md"
      >
        <form onSubmit={handleCreate} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Vehicle Stock ID"
              placeholder="e.g. STK-2026-008"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
            <Dropdown
              label="Vehicle Model"
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
            <Dropdown
              label="Starting Recon Stage"
              options={[
                { label: "Stage 1: Chemical Wash & Clay Bar", value: "Stage 1: Wash & Decontamination" },
                { label: "Stage 2: 3-Step Paint Cut & Polish", value: "Stage 2: 3-Step Paint Cut" },
                { label: "Stage 3: 9H Graphene Ceramic Booth", value: "Stage 3: 9H Ceramic Cure Booth" },
                { label: "Stage 4: Steam Clean & Ozone Interior", value: "Stage 4: Interior Steam & Ozone" },
                { label: "Stage 5: Final White-Glove Handover Seal", value: "Stage 5: Final White-Glove Seal" },
              ]}
              value={stage}
              onChange={(val) => setStage(String(val))}
            />
            <Dropdown
              label="Assigned Specialist"
              options={[
                { label: "Sola O. (Master Detailer)", value: "Sola O. (Master Detailer)" },
                { label: "K. Alabi (Ceramic Coating Lead)", value: "K. Alabi" },
              ]}
              value={tech}
              onChange={(val) => setTech(String(val))}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" leftIcon={<FiCheck />}>
              Queue into Detailing Studio
            </Button>
          </div>
        </form>
      </Modal>

      <div className="gap-2 grid grid-cols-1 sm:grid-cols-5 pt-1 text-xs">
        <div className="bg-[#F8FAFC] p-2.5 border border-[#E2E8F0] rounded-md text-center">
          <span className="block font-bold text-[#0F172A]">Stage 1: Wash</span>
          <span className="text-[#64748B] text-[10px]">Chemical Decontamination</span>
        </div>
        <div className="bg-[#F8FAFC] p-2.5 border border-[#E2E8F0] rounded-md text-center">
          <span className="block font-bold text-[#0F172A]">Stage 2: Paint Cut</span>
          <span className="text-[#64748B] text-[10px]">3-Step Machine Polish</span>
        </div>
        <div className="bg-[#EFF6FF] p-2.5 border border-[#BFDBFE] rounded-md text-center">
          <span className="block font-bold text-[#1D4ED8]">Stage 3: Ceramic</span>
          <span className="text-[#2563EB] text-[10px]">9H Graphene Cure Booth</span>
        </div>
        <div className="bg-[#F8FAFC] p-2.5 border border-[#E2E8F0] rounded-md text-center">
          <span className="block font-bold text-[#0F172A]">Stage 4: Interior</span>
          <span className="text-[#64748B] text-[10px]">Ozone Sanitization</span>
        </div>
        <div className="bg-[#F8FAFC] p-2.5 border border-[#E2E8F0] rounded-md text-center">
          <span className="block font-bold text-[#0F172A]">Stage 5: VIP Seal</span>
          <span className="text-[#64748B] text-[10px]">White-Glove Handover Ready</span>
        </div>
      </div>

      <div className="space-y-2 pt-2 text-xs">
        {reconList.map((car, ci) => (
          <div key={ci} className="flex sm:flex-row flex-col justify-between sm:items-center gap-2.5 bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-md">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#2563EB]">{car.stock}</span>
                <span className="font-bold text-[#0F172A]">{car.car}</span>
              </div>
              <span className="block mt-0.5 text-[#64748B] text-[11px]">
                {car.currentStage} &bull; Specialist: <strong className="text-[#0F172A]">{car.tech}</strong>
              </span>
            </div>
            <div className="flex items-center self-end sm:self-auto gap-3">
              <span className="font-mono text-[#64748B] text-xs">{car.finish}</span>
              <Badge variant={car.status.includes("Ready") ? "gold" : "charcoal"} size="sm">
                {car.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

