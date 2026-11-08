"use client";

import React, { useState } from "react";
import { FiPlus, FiCheck } from "react-icons/fi";
import { Button, Badge, Card, Modal, Input, Dropdown } from "@/components/ui";

export interface ServiceJobItem {
  bay: string;
  car: string;
  tech: string;
  task: string;
  status: string;
  eta: string;
}

export interface ServiceWorkshopPageProps {
  showToast: (msg: string) => void;
}

export const ServiceWorkshopPage: React.FC<ServiceWorkshopPageProps> = ({ showToast }) => {
  const [jobs, setJobs] = useState<ServiceJobItem[]>([
    { bay: "Bay 1 (Master Dyno)", car: "2024 Mercedes-Maybach S580", tech: "Engr. Tunde B.", task: "150-Point Delivery Certification & Software Flash", status: "In Progress (92%)", eta: "2 Hours" },
    { bay: "Bay 2 (Heavy Lift)", car: "2023 Range Rover Autobiography", tech: "Chinedu M.", task: "Air Suspension Calibration & Brake Bleed", status: "Awaiting Parts", eta: "Tomorrow" },
    { bay: "Bay 3 (Diagnostics)", car: "2024 Porsche 911 Turbo S", tech: "A. Danladi", task: "OBD-II Deep ECU Map Verification", status: "Complete (Signed Off)", eta: "Ready" },
    { bay: "Bay 4 (Tuning)", car: "2024 Mercedes-AMG G63 Magno", tech: "Engr. Tunde B.", task: "Exhaust Valve Solenoid Replacement", status: "In Progress (45%)", eta: "4 Hours" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bay, setBay] = useState("Bay 5 (PDI Bay)");
  const [car, setCar] = useState("2024 Mercedes-Maybach S580");
  const [tech, setTech] = useState("Engr. Tunde B.");
  const [task, setTask] = useState("");
  const [eta, setEta] = useState("3 Hours");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;
    const newEntry: ServiceJobItem = {
      bay,
      car,
      tech,
      task,
      status: "Job Card Opened",
      eta,
    };
    setJobs([newEntry, ...jobs]);
    setIsModalOpen(false);
    showToast(`Service Job Card logged for ${bay} &bull; Assigned to ${tech}.`);
    setTask("");
  };

  return (
    <Card className="space-y-3 shadow-xs p-4 sm:p-5">
      <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-2.5 border-[#E2E8F0] border-b">
        <div>
          <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">Active Workshop Bay Job Cards & PDI Diagnostics</h3>
          <p className="text-[#64748B] text-[11px]">Pre-delivery inspections, factory recalls, and master mechanical sign-offs</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<FiPlus className="w-3.5 h-3.5 text-[#FFFFFF]" />}
        >
          Create Workshop Job Card
        </Button>
      </div>

      {/* Modal for Creating Workshop Job Card */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Open New Workshop Service Job Card"
        size="md"
      >
        <form onSubmit={handleCreate} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Dropdown
              label="Assigned Workshop Bay"
              options={[
                { label: "Bay 1 (Master Dyno)", value: "Bay 1 (Master Dyno)" },
                { label: "Bay 2 (Heavy Hydraulic Lift)", value: "Bay 2 (Heavy Lift)" },
                { label: "Bay 3 (ECU Diagnostic Suite)", value: "Bay 3 (Diagnostics)" },
                { label: "Bay 4 (Tuning & Exhaust)", value: "Bay 4 (Tuning)" },
                { label: "Bay 5 (150-Point PDI Bay)", value: "Bay 5 (PDI Bay)" },
                { label: "Bay 6 (Fast-Track Handover)", value: "Bay 6 (Handover)" },
              ]}
              value={bay}
              onChange={(val) => setBay(String(val))}
            />
            <Dropdown
              label="Vehicle Model / Stock ID"
              options={[
                { label: "2024 Mercedes-Maybach S580 (STK-001)", value: "2024 Mercedes-Maybach S580" },
                { label: "2024 Porsche 911 Turbo S (STK-002)", value: "2024 Porsche 911 Turbo S" },
                { label: "2023 Range Rover Autobiography (STK-003)", value: "2023 Range Rover Autobiography" },
                { label: "2024 Mercedes-AMG G63 Magno (STK-007)", value: "2024 Mercedes-AMG G63 Magno" },
              ]}
              value={car}
              onChange={(val) => setCar(String(val))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Dropdown
              label="Lead Master Technician"
              options={[
                { label: "Engr. Tunde B. (Master Tech)", value: "Engr. Tunde B." },
                { label: "Chinedu M. (Chassis & Air Susp)", value: "Chinedu M." },
                { label: "A. Danladi (Porsche/Mercedes ECU)", value: "A. Danladi" },
              ]}
              value={tech}
              onChange={(val) => setTech(String(val))}
            />
            <Input
              label="Estimated Turnaround (ETA)"
              placeholder="e.g. 3 Hours / Tomorrow 2 PM"
              value={eta}
              onChange={(e) => setEta(e.target.value)}
              required
            />
          </div>

          <Input
            label="Service & PDI Scope"
            placeholder="e.g. 150-Point Pre-Delivery Inspection & Ceramic Software Flash"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            required
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" leftIcon={<FiCheck />}>
              Open Job Card & Allocate Bay
            </Button>
          </div>
        </form>
      </Modal>

      <div className="space-y-2 text-xs">
        {jobs.map((job, idx) => (
          <div key={idx} className="flex sm:flex-row flex-col justify-between sm:items-center gap-2.5 bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-md">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#2563EB]">{job.bay}</span>
                <span className="font-bold text-[#0F172A]">{job.car}</span>
              </div>
              <span className="block mt-0.5 text-[#64748B] text-[11px]">
                {job.task} &bull; Lead Tech: <strong className="text-[#0F172A]">{job.tech}</strong>
              </span>
            </div>
            <div className="flex items-center self-end sm:self-auto gap-2.5">
              <span className="font-mono text-[#64748B] text-xs">ETA: {job.eta}</span>
              <Badge variant={job.status.includes("Complete") ? "gold" : "charcoal"} size="sm">
                {job.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

