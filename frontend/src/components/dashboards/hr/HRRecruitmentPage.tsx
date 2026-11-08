"use client";

import React, { useState } from "react";
import { FiPlus, FiCheck } from "react-icons/fi";
import { Badge, Card, Button, Modal, Input, Dropdown } from "@/components/ui";

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
  const [candidates, setCandidates] = useState<CandidateItem[]>([
    { name: "Chibuike Okafor", role: "Senior VIP Luxury Sales Executive", appliedDate: "2026-11-04", exp: "8 Years Auto Sales", status: "Interview Scheduled", resume: "Chibuike_CV.pdf" },
    { name: "Fatima Al-Hassan", role: "Customs & Port Logistics Specialist", appliedDate: "2026-11-03", exp: "5 Years Tin Can Clearing", status: "Shortlisted", resume: "Fatima_Resume.pdf" },
    { name: "Tariq Danladi", role: "Senior Master Certified Technician", appliedDate: "2026-11-01", exp: "12 Years Porsche/Mercedes Diagnostic", status: "Technical Assessment", resume: "Tariq_Certificates.pdf" },
    { name: "Grace Adebayo", role: "Digital Automotive Marketing Lead", appliedDate: "2026-10-29", exp: "6 Years Automotive Content", status: "Application Received", resume: "Grace_Portfolio.pdf" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("Showroom Floor Sales");
  const [location, setLocation] = useState("Victoria Island Flagship Showroom");
  const [exp, setExp] = useState("5+ Years Experience");
  const [empType, setEmpType] = useState("Full-Time Executive");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle) return;
    setIsModalOpen(false);
    showToast(`Published career vacancy "${jobTitle}" to dealership portal.`);
    setJobTitle("");
  };

  return (
    <div className="space-y-4">
      <Card className="space-y-4 shadow-xs p-4 sm:p-5">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-2 border-[#E2E8F0] border-b">
          <div>
            <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
              Public Career Applications & Recruitment Pipeline
            </h3>
            <p className="text-[#64748B] text-[11px]">Direct applicants submitted through the public /careers job board</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="gold" size="sm">{candidates.length} Candidates Under Review</Badge>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              leftIcon={<FiPlus className="w-3.5 h-3.5" />}
            >
              + Post Career Vacancy
            </Button>
          </div>
        </div>

        {/* Modal for Posting Career Vacancy */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Publish New Dealership Career Vacancy"
          size="md"
        >
          <form onSubmit={handleCreate} className="space-y-3">
            <Input
              label="Position / Job Title"
              placeholder="e.g. Master Diagnostic Technician"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Dropdown
                label="Department"
                options={[
                  { label: "Showroom Floor Sales", value: "Showroom Floor Sales" },
                  { label: "Workshop & Technical Service", value: "Workshop Service" },
                  { label: "Parts Logistics & Warehouse", value: "Parts Logistics" },
                  { label: "Import Logistics & Customs", value: "Customs Logistics" },
                  { label: "Finance & Accounting", value: "Finance & Accounting" },
                ]}
                value={department}
                onChange={(val) => setDepartment(String(val))}
              />
              <Dropdown
                label="Showroom / Facility Node"
                options={[
                  { label: "Victoria Island Flagship Showroom", value: "Victoria Island Flagship Showroom" },
                  { label: "Maitama Diplomatic Suite, Abuja", value: "Maitama Diplomatic Suite, Abuja" },
                  { label: "Central Workshop Hub, Lekki", value: "Central Workshop Hub, Lekki" },
                ]}
                value={location}
                onChange={(val) => setLocation(String(val))}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Minimum Experience Requirement"
                placeholder="e.g. 5+ Years Luxury Automotive"
                value={exp}
                onChange={(e) => setExp(e.target.value)}
              />
              <Dropdown
                label="Employment Type"
                options={[
                  { label: "Full-Time Executive", value: "Full-Time Executive" },
                  { label: "Senior Consultant / Closer", value: "Senior Consultant" },
                  { label: "Contract Specialist", value: "Contract Specialist" },
                ]}
                value={empType}
                onChange={(val) => setEmpType(String(val))}
              />
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
              <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" leftIcon={<FiCheck />}>
                Publish Career Listing
              </Button>
            </div>
          </form>
        </Modal>

        <div className="space-y-2 text-xs">
          {candidates.map((cand, ci) => (
            <div key={ci} className="flex sm:flex-row flex-col justify-between sm:items-center gap-2.5 bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-md">
              <div>
                <div className="font-bold text-[#0F172A] text-sm">{cand.name}</div>
                <span className="font-semibold text-[#2563EB]">{cand.role}</span>
                <span className="block text-[#64748B] text-[11px]">Applied: {cand.appliedDate} &bull; Experience: {cand.exp}</span>
              </div>
              <div className="flex items-center self-end sm:self-auto gap-2.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => showToast(`Reviewing candidate CV: ${cand.resume}`)}
                  className="px-2.5 py-1 text-xs"
                >
                  View CV
                </Button>
                <Badge variant="gold" size="sm">{cand.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

