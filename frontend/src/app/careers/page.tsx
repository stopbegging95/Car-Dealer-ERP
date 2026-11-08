"use client";

import React, { useState } from "react";
import {
  FiBriefcase,
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiCheckCircle,
  FiUploadCloud,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button, Badge, Modal, Input, PageBanner } from "@/components/ui";

export interface JobVacancy {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  experience: string;
  description: string;
  responsibilities: string[];
}

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<JobVacancy | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const vacancies = [
    {
      id: "JOB-001",
      title: "Senior Luxury Sales Executive",
      department: "VIP Dealership Sales",
      location: "Victoria Island, Lagos",
      type: "Full-Time",
      salary: "Competitive Base + High Commission",
      experience: "5+ years exotic/luxury car sales",
      description: "Manage relationships with high-net-worth clients, corporate buyers, and VIP trade-in customers.",
      responsibilities: [
        "Conduct confidential private viewings and high-speed test drive experiences",
        "Negotiate and structure multi-million Naira and USD vehicle purchase agreements",
        "Collaborate with auto brokers to fulfill bespoke vehicle sourcing briefs",
      ],
    },
    {
      id: "JOB-002",
      title: "Lead Customs Clearance Officer",
      department: "Port Logistics & Clearance",
      location: "Tin Can Island / Apapa, Lagos",
      type: "Full-Time",
      salary: "Executive Logistics Tier",
      experience: "4+ years terminal operations",
      description: "Supervise single-goods declarations, terminal examination, and NCS fast-track releases.",
      responsibilities: [
        "Manage customs assessment, PAAR generation, and SGD verification",
        "Coordinate vessel arrival, bonded carrier escort, and showroom handover",
        "Maintain zero demurrage targets through streamlined terminal handling",
      ],
    },
    {
      id: "JOB-003",
      title: "Master Diagnostic Technician (European Marques)",
      department: "Technical & Workshop Service",
      location: "Victoria Island Workshop",
      type: "Full-Time",
      salary: "Senior Master Tech Grade",
      experience: "Mercedes Star, Porsche PIWIS, or BMW ISTA certified",
      description: "Conduct 150-point pre-delivery inspections and oversee pre-sale diagnostics.",
      responsibilities: [
        "Execute multi-system OBD diagnostics on Porsche, Maybach, and Ferrari models",
        "Perform pre-delivery calibrations, suspension dampening tests, and software coding",
        "Certify vehicle mechanical integrity and issue dealership safety seals",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-[#2563EB] selection:text-[#FFFFFF]">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Public Careers Hero Banner */}
        <PageBanner
          badge="EXECUTIVE CAREERS & TALENT"
          title="JOIN OUR"
          titleHighlight="EXECUTIVE TEAM"
          subtitle="Work with Nigeria's most prestigious collection of luxury vehicles, international dealer desks, and discerning private collectors."
          backgroundImage="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1920&q=80"
          breadcrumbs={[{ label: "Company" }, { label: "Careers" }]}
          stats={[
            { value: `${vacancies.length} Roles`, label: "Open Vacancies" },
            { value: "Lagos & Abuja", label: "Showroom Hubs" },
            { value: "Full-Time", label: "Executive Tier" },
          ]}
          ctaText="Explore Open Positions"
          onCtaClick={() => {
            const el = document.getElementById("vacancies-list");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* Vacancies List */}
        <div className="space-y-4">
          {vacancies.map((job) => (
            <div
              key={job.id}
              className="bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#2563EB] rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase text-[#2563EB] font-bold">
                      {job.department}
                    </span>
                    <span className="text-[#CBD5E1]">&bull;</span>
                    <Badge variant="gold" size="sm">
                      {job.type}
                    </Badge>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#0F172A]">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#475569] mt-1">
                    <span className="flex items-center gap-1">
                      <FiMapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiClock className="w-3.5 h-3.5 text-[#2563EB]" />
                      {job.experience}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiDollarSign className="w-3.5 h-3.5 text-[#2563EB]" />
                      {job.salary}
                    </span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedJob(job);
                    setIsApplyModalOpen(true);
                  }}
                >
                  Apply for Role
                </Button>
              </div>

              <p className="text-xs text-[#475569] leading-relaxed border-t border-[#E2E8F0] pt-3">
                {job.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                {job.responsibilities.map((resp, i) => (
                  <div key={i} className="flex items-center gap-2 bg-[#F8FAFC] p-2.5 rounded-lg border border-[#E2E8F0]">
                    <FiCheckCircle className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                    <span className="text-[11px] text-[#334155] line-clamp-1">{resp}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Job Application Modal */}
      {selectedJob && (
        <Modal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          size="lg"
          title={`Application: ${selectedJob.title}`}
          description={`Department: ${selectedJob.department} • ${selectedJob.location}`}
          footer={
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsApplyModalOpen(false)}
                leftIcon={<FiX className="w-3.5 h-3.5 text-[#64748B]" />}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  alert("Application submitted! Our recruitment team will review your CV.");
                  setIsApplyModalOpen(false);
                }}
                leftIcon={<FiCheck className="w-3.5 h-3.5 text-[#FFFFFF]" />}
              >
                Submit Application
              </Button>
            </>
          }
        >
          <div className="space-y-3.5">
            <Input label="Full Name" placeholder="e.g. Chief Alexander Vance" required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Email Address" type="email" placeholder="alexander@company.com" required />
              <Input label="Phone Number" placeholder="+234 (0) 800 123 4567" required />
            </div>
            <Input label="LinkedIn Profile URL" placeholder="https://linkedin.com/in/alexandervance" />

            <div>
              <label className="text-xs font-medium text-[#0F172A] block mb-1">
                Upload Resume / CV (PDF format)
              </label>
              <div className="border border-dashed border-[#CBD5E1] hover:border-[#2563EB] rounded-xl p-4 text-center cursor-pointer bg-[#F8FAFC] hover:bg-[#EFF6FF] transition-colors">
                <FiUploadCloud className="w-6 h-6 text-[#2563EB] mx-auto mb-1" />
                <span className="text-xs text-[#475569] block">Click to upload CV (PDF up to 5MB)</span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      <Footer />
    </div>
  );
}
