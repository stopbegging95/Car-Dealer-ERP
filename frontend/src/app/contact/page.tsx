"use client";

import React, { useState } from "react";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiMessageSquare,
  FiCheck,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button, Input, Textarea, Dropdown, Modal } from "@/components/ui";

export default function ContactPage() {
  const [enquiryType, setEnquiryType] = useState("Vehicle Acquisition");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-[#2563EB] selection:text-[#FFFFFF]">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] text-xs font-bold mb-2">
              <FiPhone className="w-3.5 h-3.5" />
              <span>Executive Concierge & Inquiries</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0F172A] uppercase tracking-tight">
              Contact Dealership
            </h1>
            <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
              Connect directly with our sales executives, broker concierge, or port clearance officers.
            </p>
          </div>

          <a
            href="https://wa.me/2348001234567"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#16A34A] text-[#FFFFFF] font-bold text-xs shadow-xs hover:bg-[#15803D] self-start md:self-auto transition-colors"
          >
            <FaWhatsapp className="w-4 h-4" />
            <span>Instant WhatsApp Chat</span>
          </a>
        </div>

        {/* Showrooms Info & Form Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Showrooms & Direct Lines (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Lagos Card */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB] block">
                Flagship Showroom
              </span>
              <h3 className="text-base font-bold text-[#0F172A]">Lagos Victoria Island</h3>
              <div className="space-y-2 text-xs text-[#475569]">
                <p className="flex items-start gap-2">
                  <FiMapPin className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <span>Plot 1240, Ahmadu Bello Way, Victoria Island, Lagos State</span>
                </p>
                <p className="flex items-center gap-2">
                  <FiPhone className="w-4 h-4 text-[#2563EB] shrink-0" />
                  <span className="font-medium text-[#0F172A]">+234 (0) 800 123 4567 / (01) 234 5678</span>
                </p>
                <p className="flex items-center gap-2">
                  <FiClock className="w-4 h-4 text-[#2563EB] shrink-0" />
                  <span>Monday - Saturday: 8:00 AM - 7:00 PM</span>
                </p>
              </div>
            </div>

            {/* Abuja Card */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB] block">
                Executive Diplomatic Suite
              </span>
              <h3 className="text-base font-bold text-[#0F172A]">Abuja Maitama</h3>
              <div className="space-y-2 text-xs text-[#475569]">
                <p className="flex items-start gap-2">
                  <FiMapPin className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <span>Gana Street, Diplomatic Zone, Maitama, Abuja FCT</span>
                </p>
                <p className="flex items-center gap-2">
                  <FiPhone className="w-4 h-4 text-[#2563EB] shrink-0" />
                  <span className="font-medium text-[#0F172A]">+234 (0) 800 987 6543</span>
                </p>
                <p className="flex items-center gap-2">
                  <FiClock className="w-4 h-4 text-[#2563EB] shrink-0" />
                  <span>Monday - Saturday: 9:00 AM - 6:00 PM</span>
                </p>
              </div>
            </div>

            {/* Email Contact Card */}
            <div className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-2xl p-4 text-xs text-[#475569] shadow-xs flex items-center gap-3">
              <FiMail className="w-5 h-5 text-[#2563EB] shrink-0" />
              <div>
                <span className="text-[10px] text-[#64748B] block">Official Dealership Inquiries</span>
                <span className="font-semibold text-[#0F172A]">concierge@premierautomotors.com</span>
              </div>
            </div>
          </div>

          {/* Categorized Inquiry Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB] flex items-center gap-2">
                <FiMessageSquare className="w-4 h-4 text-[#2563EB]" />
                <span>Send Formal Enquiry</span>
              </h3>
              <p className="text-xs text-[#475569] mt-0.5">
                Our sales directors and logistics officers reply within 1 business hour.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <Dropdown
                label="Department & Enquiry Category"
                value={enquiryType}
                onChange={(val) => setEnquiryType(String(val))}
                options={[
                  { label: "Vehicle Acquisition / Stock Inquiry", value: "Vehicle Acquisition" },
                  { label: "VIP Trade-In or Vehicle Swap", value: "Trade-In Swap" },
                  { label: "Auto Broker International Sourcing", value: "Auto Broker" },
                  { label: "Customs Clearance & Port Logistics", value: "Customs Clearance" },
                  { label: "Corporate Fleet Partnerships", value: "Corporate Fleet" },
                ]}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Full Name" placeholder="Chief Alexander Vance" required />
                <Input label="Phone / WhatsApp" placeholder="+234 (0) 800 123 4567" required />
              </div>

              <Input label="Email Address" type="email" placeholder="alexander@company.com" required />

              <Textarea
                label="Message Details / Vehicle Specifications"
                rows={4}
                placeholder="Tell us about the vehicle you are interested in, your timeframe, or specific customs clearance request..."
                required
              />

              <Button variant="primary" size="md" fullWidth type="submit">
                Transmit Enquiry to Concierge
              </Button>
            </form>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Enquiry Received"
        description="Your message has been assigned to our lead concierge."
        size="md"
        footer={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsSuccessModalOpen(false)}
            leftIcon={<FiCheck className="w-3.5 h-3.5 text-white" />}
          >
            Acknowledge & Close
          </Button>
        }
      >
        <div className="space-y-2 text-xs sm:text-sm text-[#334155]">
          <p>
            Thank you for reaching out regarding <span className="text-[#2563EB] font-bold">{enquiryType}</span>.
          </p>
          <p className="text-[#64748B] text-xs">
            A concierge officer will contact you on your registered telephone/WhatsApp line with requested information and vehicle files.
          </p>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
