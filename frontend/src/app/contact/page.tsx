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
import { Button, Input, Textarea, Dropdown, Modal, PageBanner } from "@/components/ui";

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
        {/* Public Contact Hero Banner */}
        <PageBanner
          badge="EXECUTIVE CONCIERGE & INQUIRIES"
          title="CONNECT WITH"
          titleHighlight="DEALERSHIP"
          subtitle="Connect directly with our VIP sales liaisons, international auto brokers, or Tin Can Island port customs clearance officers."
          backgroundImage="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1920&q=80"
          breadcrumbs={[{ label: "Company" }, { label: "Contact Us" }]}
          stats={[
            { value: "24/7", label: "WhatsApp Concierge" },
            { value: "< 2 Hours", label: "Response Window" },
            { value: "Lagos & Abuja", label: "Physical Showrooms" },
          ]}
          ctaText="Instant WhatsApp Chat"
          ctaHref="https://wa.me/2348001234567"
          secondaryCtaText="Book Showroom Visit"
          secondaryCtaHref="/inventory"
        />

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
