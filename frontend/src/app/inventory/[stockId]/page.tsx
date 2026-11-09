"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  FiArrowLeft,
  FiShare2,
  FiCalendar,
  FiShield,
  FiMapPin,
  FiCheckCircle,
  FiDollarSign,
  FiDownload,
  FiRepeat,
  FiCpu,
  FiActivity,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Button,
  Badge,
  Modal,
  Input,
  DatePicker,
  Dropdown,
  VehicleCard,
  PageBanner,
} from "@/components/ui";
import { VEHICLES, Vehicle } from "@/data/vehicles";

function VehicleDetailContent() {
  const params = useParams();
  const stockId = typeof params?.stockId === "string" ? params.stockId : "STK-2026-001";

  const vehicle: Vehicle = useMemo(() => {
    return VEHICLES.find((v) => v.stockId === stockId) || VEHICLES[0];
  }, [stockId]);

  const [activePhoto, setActivePhoto] = useState<string>(vehicle.image);
  const currency: "NGN" = "NGN";
  const [isTestDriveOpen, setIsTestDriveOpen] = useState(false);
  const [isTestDriveConfirmedOpen, setIsTestDriveConfirmedOpen] = useState(false);
  const [isBrochureModalOpen, setIsBrochureModalOpen] = useState(false);
  const [testDriveDate, setTestDriveDate] = useState("2026-11-15");
  const [testDriveLocation, setTestDriveLocation] = useState("Lagos Showroom");
  const [isCopied, setIsCopied] = useState(false);

  // Inline Financing Estimator state
  const basePrice = vehicle.priceNGN;
  const [depositPct, setDepositPct] = useState<number>(20);
  const [loanTermMonths, setLoanTermMonths] = useState<number>(36);
  const interestRateAnnual = 0.085; // 8.5% APR

  // Formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
  const loanPrincipal = basePrice * (1 - depositPct / 100);
  const monthlyRate = interestRateAnnual / 12;
  const estimatedMonthly = useMemo(() => {
    const factor = Math.pow(1 + monthlyRate, loanTermMonths);
    const payment = (loanPrincipal * (monthlyRate * factor)) / (factor - 1);
    return Math.round(payment);
  }, [loanPrincipal, monthlyRate, loanTermMonths]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const relatedVehicles = useMemo(() => {
    return VEHICLES.filter((v) => v.stockId !== vehicle.stockId).slice(0, 3);
  }, [vehicle.stockId]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-[#2563EB] selection:text-[#FFFFFF]">
      <Navbar onBookTestDrive={() => setIsTestDriveOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Breadcrumb Strip */}
        <div className="flex items-center justify-between gap-4 text-xs">
          <Link
            href="/inventory"
            className="inline-flex items-center gap-1.5 text-[#64748B] hover:text-[#2563EB] transition-colors font-medium"
          >
            <FiArrowLeft className="w-4 h-4 text-[#2563EB]" />
            <span>Back to Inventory</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              leftIcon={<FiShare2 className="w-3.5 h-3.5 text-[#2563EB]" />}
            >
              {isCopied ? "Link Copied!" : "Share Vehicle"}
            </Button>

            {/* Currency Badge */}
            <div className="flex items-center bg-[#EFF6FF] px-3 py-1.5 rounded-md border border-[#BFDBFE] text-xs font-mono font-bold text-[#2563EB]">
              ₦ NGN (Naira)
            </div>
          </div>
        </div>

        {/* Public Vehicle Dossier Hero Banner */}
        <PageBanner
          badge={`${vehicle.year} ${vehicle.make.toUpperCase()} • ${vehicle.stockId}`}
          title={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          titleHighlight={vehicle.trim}
          subtitle={`Showroom Node: ${vehicle.location} • 150-Point Certified Pass • Clean Title Documented`}
          backgroundImage={vehicle.image}
          breadcrumbs={[
            { label: "Inventory", href: "/inventory" },
            { label: `${vehicle.make} ${vehicle.model}` },
          ]}
          stats={[
            { value: `₦${vehicle.priceNGN.toLocaleString()}`, label: "Price (Naira)" },
            { value: `${vehicle.mileage.toLocaleString()} KM`, label: "Mileage" },
            { value: vehicle.status, label: "Status" },
          ]}
          ctaText="Book Private Test Drive"
          onCtaClick={() => setIsTestDriveOpen(true)}
          secondaryCtaText="Finance Estimator"
          secondaryCtaHref={`/services/loan-calculator?price=${vehicle.priceNGN}`}
        />

        {/* Top Header Block: Make, Model, Status, and Price */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#2563EB] font-bold">
                {vehicle.stockId}
              </span>
              <span className="text-[#CBD5E1]">&bull;</span>
              <span className="text-xs text-[#64748B] flex items-center gap-1 font-medium">
                <FiMapPin className="w-3 h-3 text-[#2563EB]" />
                {vehicle.location}
              </span>
              <Badge variant="gold" size="sm" dot>
                {vehicle.status}
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0F172A] uppercase tracking-tight">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5 font-medium">
              {vehicle.trim} &bull; VIN: <span className="font-mono text-[#0F172A] font-semibold">{vehicle.vin}</span>
            </p>
          </div>

          <div className="flex flex-col md:items-end">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
              Approved Dealership Price
            </span>
            <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-mono text-[#1D4ED8]">
              ₦{vehicle.priceNGN.toLocaleString()}
            </div>
            <span className="text-[10px] text-[#64748B] mt-0.5">
              Includes customs documentation, pre-delivery inspection & warranty
            </span>
          </div>
        </div>

        {/* Gallery & Quick Action Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Photo & Thumbnail Gallery (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="relative w-full h-72 sm:h-96 md:h-[380px] rounded-md overflow-hidden bg-[#0F172A] border border-[#CBD5E1] shadow-xl">
              <Image
                src={activePhoto}
                alt={`${vehicle.make} ${vehicle.model}`}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                unoptimized
                className="object-cover transition-all duration-300"
                priority
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-2.5 py-1 rounded-md bg-[#0F172A]/85 text-[#FFFFFF] font-mono text-xs font-bold border border-white/20 shadow-xs">
                  {vehicle.year}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#EFF6FF] text-[#1D4ED8] text-xs font-semibold uppercase border border-[#BFDBFE] shadow-xs">
                  {vehicle.condition}
                </span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {[vehicle.image, ...vehicle.gallery].map((imgSrc, idx) => (
                <Button
                  key={idx}
                  variant="ghost"
                  onClick={() => setActivePhoto(imgSrc)}
                  className={`relative w-20 sm:w-24 h-14 sm:h-16 p-0 rounded-md overflow-hidden shrink-0 border-2 transition-all ${
                    activePhoto === imgSrc
                      ? "border-[#2563EB] ring-2 ring-[#2563EB]/25 shadow-sm scale-105"
                      : "border-[#CBD5E1] opacity-70 hover:opacity-100 hover:border-[#2563EB]"
                  }`}
                >
                  <Image src={imgSrc} alt="Thumbnail" fill sizes="96px" unoptimized className="object-cover" />
                </Button>
              ))}
            </div>
          </div>

          {/* Key Specs Card & Primary CTAs (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 sm:p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB] flex items-center gap-2">
                <FiCpu className="w-4 h-4 text-[#2563EB]" />
                <span>Executive Highlights</span>
              </h3>

              {/* 6 Metric Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="bg-[#F8FAFC] p-2.5 rounded-md border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#64748B] block">Mileage</span>
                  <span className="font-mono font-bold text-[#0F172A]">{vehicle.mileage.toLocaleString()} KM</span>
                </div>
                <div className="bg-[#EFF6FF] p-2.5 rounded-md border border-[#BFDBFE]">
                  <span className="text-[10px] text-[#1D4ED8] block font-semibold">Horsepower</span>
                  <span className="font-mono font-bold text-[#1D4ED8]">{vehicle.horsepower} HP</span>
                </div>
                <div className="bg-[#F8FAFC] p-2.5 rounded-md border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#64748B] block">Transmission</span>
                  <span className="font-semibold text-[#0F172A]">{vehicle.transmission}</span>
                </div>
                <div className="bg-[#F8FAFC] p-2.5 rounded-md border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#64748B] block">Fuel Type</span>
                  <span className="font-semibold text-[#0F172A]">{vehicle.fuel}</span>
                </div>
                <div className="bg-[#F8FAFC] p-2.5 rounded-md border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#64748B] block">Exterior Color</span>
                  <span className="font-semibold text-[#0F172A]">{vehicle.exteriorColor}</span>
                </div>
                <div className="bg-[#F8FAFC] p-2.5 rounded-md border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#64748B] block">Interior Color</span>
                  <span className="font-semibold text-[#0F172A]">{vehicle.interiorColor}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => setIsTestDriveOpen(true)}
                  leftIcon={<FiCalendar className="w-4 h-4 text-[#FFFFFF]" />}
                >
                  Book Private VIP Test Drive
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Link href={`/services/sell-or-swap?targetStockId=${vehicle.stockId}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      leftIcon={<FiRepeat className="w-3.5 h-3.5 text-[#2563EB]" />}
                    >
                      Trade-In Swap
                    </Button>
                  </Link>

                  <a
                    href={`https://wa.me/2348001234567?text=Hello%20Premier%20Auto,%20I%20am%20interested%20in%20${encodeURIComponent(vehicle.make + " " + vehicle.model)}%20(${vehicle.stockId})`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="secondary"
                      size="sm"
                      fullWidth
                      leftIcon={<FaWhatsapp className="w-3.5 h-3.5 text-[#2563EB]" />}
                    >
                      WhatsApp Desk
                    </Button>
                  </a>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  onClick={() => setIsBrochureModalOpen(true)}
                  leftIcon={<FiDownload className="w-3.5 h-3.5" />}
                  className="text-xs text-[#64748B] hover:text-[#2563EB]"
                >
                  Download Spec Sheet &amp; Title Document Summary (PDF)
                </Button>
              </div>
            </div>

            {/* Trust Assurance Strip */}
            <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-3.5 flex items-center gap-3 text-xs text-[#1D4ED8]">
              <FiShield className="w-5 h-5 text-[#2563EB] shrink-0" />
              <span className="font-medium">
                Verified 150-point mechanical inspection completed with clean international title.
              </span>
            </div>
          </div>
        </div>

        {/* Engine, Specs & Finance Calculator Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          {/* Detailed Features & Specs (7 cols) */}
          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
            <div>
              <h3 className="text-base font-bold text-[#0F172A] uppercase tracking-tight">
                Vehicle Overview
              </h3>
              <p className="text-xs sm:text-sm text-[#475569] mt-1.5 leading-relaxed">
                {vehicle.description}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2563EB] mb-3">
                Factory Options & Key Equipment
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {vehicle.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E2E8F0]">
                    <FiCheckCircle className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <span className="text-[#334155] font-medium">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#E2E8F0]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2563EB] mb-3">
                Powertrain & Mechanical Specifications
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-[#64748B]">Engine Config</span>
                  <div className="font-bold text-[#0F172A]">{vehicle.engine}</div>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-[#64748B]">Output Power</span>
                  <div className="font-bold text-[#1D4ED8]">{vehicle.horsepower} HP</div>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-[#64748B]">Drivetrain</span>
                  <div className="font-bold text-[#0F172A]">All-Wheel Drive (AWD)</div>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-[#64748B]">Chassis Status</span>
                  <div className="font-bold text-[#0F172A]">Accident-Free Certified</div>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-[#64748B]">Customs Duty</span>
                  <div className="font-bold text-[#2563EB]">100% Fully Cleared</div>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-[#64748B]">Warranty</span>
                  <div className="font-bold text-[#0F172A]">12 Months / 20,000 KM</div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Financing Estimator Widget (5 cols) */}
          <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB] flex items-center gap-2">
                <FiDollarSign className="w-4 h-4 text-[#2563EB]" />
                <span>Financing Estimator</span>
              </h3>
              <span className="text-[10px] font-mono text-[#64748B]">8.5% APR Fixed</span>
            </div>

            <p className="text-xs text-[#64748B]">
              Customize your down payment and loan tenure to view estimated monthly repayments.
            </p>

            {/* Down Payment Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#475569]">Down Payment ({depositPct}%):</span>
                <span className="font-mono font-bold text-[#1D4ED8]">
                  ₦{Math.round(basePrice * (depositPct / 100)).toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={60}
                step={5}
                value={depositPct}
                onChange={(e) => setDepositPct(Number(e.target.value))}
                className="w-full accent-[#2563EB] cursor-pointer"
              />
            </div>

            {/* Loan Term Selection */}
            <div className="space-y-1.5">
              <span className="text-xs text-[#475569] block">Tenure (Months):</span>
              <div className="grid grid-cols-4 gap-1.5">
                {[12, 24, 36, 48].map((m) => (
                  <Button
                    key={m}
                    type="button"
                    variant={loanTermMonths === m ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setLoanTermMonths(m)}
                    className="font-mono text-xs py-1.5"
                  >
                    {m}M
                  </Button>
                ))}
              </div>
            </div>

            {/* Monthly Calculation Output Box */}
            <div className="bg-[#EFF6FF] rounded-2xl p-4 border border-[#BFDBFE] text-center space-y-1 mt-2">
              <span className="text-[10px] uppercase tracking-wider text-[#1D4ED8] font-bold">
                Estimated Monthly Repayment
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#1D4ED8]">
                ₦{estimatedMonthly.toLocaleString()}{" "}
                <span className="text-xs font-normal text-[#64748B]">/mo</span>
              </div>
              <span className="text-[10px] text-[#64748B] block">
                Principal: ₦{Math.round(loanPrincipal).toLocaleString()}
              </span>
            </div>

            <Link href={`/services/loan-calculator?price=${vehicle.priceNGN}&stockId=${vehicle.stockId}`}>
              <Button variant="outline" size="sm" fullWidth leftIcon={<FiActivity className="w-3.5 h-3.5" />}>
                Open Full Loan Amortization Schedule
              </Button>
            </Link>
          </div>
        </div>

        {/* Similar Inventory Recommendations */}
        <div className="pt-6 border-t border-[#E2E8F0] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#0F172A] uppercase tracking-tight">
                Similar Executive Vehicles
              </h3>
              <p className="text-xs text-[#64748B]">Explore matching models from our dealership collection.</p>
            </div>
            <Link href="/inventory" className="text-xs text-[#2563EB] hover:underline font-bold">
              View All ({VEHICLES.length}) &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {relatedVehicles.map((item) => (
              <VehicleCard
                key={item.stockId}
                vehicle={item}
                currency={currency}
                onBookTestDrive={() => setIsTestDriveOpen(true)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* VIP Test Drive Modal */}
      <Modal
        isOpen={isTestDriveOpen}
        onClose={() => setIsTestDriveOpen(false)}
        size="lg"
        title={
          <span>
            Book VIP Test Drive: <span className="text-[#2563EB]">{vehicle.make} {vehicle.model}</span>
          </span>
        }
        description="Schedule a private appointment with our sales executives."
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsTestDriveOpen(false)}
              leftIcon={<FiX className="w-3.5 h-3.5 text-[#64748B]" />}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setIsTestDriveOpen(false);
                setIsTestDriveConfirmedOpen(true);
              }}
              leftIcon={<FiCheck className="w-3.5 h-3.5 text-[#FFFFFF]" />}
            >
              Confirm VIP Appointment
            </Button>
          </>
        }
      >
        <div className="space-y-3.5">
          <Input label="Full Name" placeholder="e.g. Chief Alexander Vance" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Email Address" type="email" placeholder="alexander@company.com" />
            <Input label="Phone Number" placeholder="+234 (0) 800 123 4567" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DatePicker
              label="Preferred Date"
              value={testDriveDate}
              onChange={setTestDriveDate}
            />
            <Dropdown
              label="Showroom Location"
              value={testDriveLocation}
              onChange={(val) => setTestDriveLocation(String(val))}
              options={[
                { label: "Lagos Showroom (Victoria Island)", value: "Lagos Showroom" },
                { label: "Abuja Showroom (Maitama)", value: "Abuja Showroom" },
              ]}
            />
          </div>
        </div>
      </Modal>

      {/* Brochure Generated Confirmation Modal */}
      <Modal
        isOpen={isBrochureModalOpen}
        onClose={() => setIsBrochureModalOpen(false)}
        title="Dossier & Brochure Dispatched"
        description="Official vehicle specification dossier and title summary."
        size="sm"
        footer={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsBrochureModalOpen(false)}
            leftIcon={<FiCheck className="w-3.5 h-3.5 text-white" />}
          >
            Done
          </Button>
        }
      >
        <div className="space-y-3 text-xs text-[#475569]">
          <p>
            The digital specification dossier for <strong className="text-[#0F172A]">{vehicle.year} {vehicle.make} {vehicle.model}</strong> ({vehicle.stockId}) has been generated and dispatched to your browser print spooler.
          </p>
          <div className="p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg text-[11px] text-[#1D4ED8]">
            Includes authenticated factory build sheet, mechanical inspection grade, and customs clearance summary.
          </div>
        </div>
      </Modal>

      {/* Test Drive Confirmed Modal */}
      <Modal
        isOpen={isTestDriveConfirmedOpen}
        onClose={() => setIsTestDriveConfirmedOpen(false)}
        title="VIP Test Drive Scheduled"
        description="Private showroom viewing and test drive experience."
        size="sm"
        footer={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsTestDriveConfirmedOpen(false)}
            leftIcon={<FiCheck className="w-3.5 h-3.5 text-white" />}
          >
            Acknowledge & Close
          </Button>
        }
      >
        <div className="space-y-3 text-xs text-[#475569]">
          <p>
            Your private test drive for <strong className="text-[#0F172A]">{vehicle.year} {vehicle.make} {vehicle.model}</strong> has been scheduled for <span className="text-[#2563EB] font-bold">{testDriveDate}</span> at our <span className="font-semibold text-[#0F172A]">{testDriveLocation}</span>.
          </p>
          <div className="p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg text-[11px] text-[#1D4ED8]">
            Our executive sales liaison will reach out shortly to ensure the vehicle is fueled, detailed, and staged in the private viewing bay.
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}

export default function VehicleDetailPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#F8FAFC]" />}>
      <VehicleDetailContent />
    </React.Suspense>
  );
}

