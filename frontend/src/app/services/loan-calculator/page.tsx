"use client";

import React, { useState, useMemo } from "react";
import {
  FiDollarSign,
  FiPieChart,
  FiCheckCircle,
  FiFileText,
  FiX,
  FiCheck,
} from "react-icons/fi";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button, Input, Modal, Dropdown, PageBanner, Table } from "@/components/ui";

export default function LoanCalculatorPage() {
  const currency: "NGN" = "NGN";
  const [vehiclePrice, setVehiclePrice] = useState<number>(245000000);
  const [downPaymentPct, setDownPaymentPct] = useState<number>(20);
  const [loanTermMonths, setLoanTermMonths] = useState<number>(48);
  const [annualInterestRate, setAnnualInterestRate] = useState<number>(8.5);
  const [isPreQualModalOpen, setIsPreQualModalOpen] = useState<boolean>(false);
  const [isPreQualSuccessOpen, setIsPreQualSuccessOpen] = useState<boolean>(false);

  const currentPrice = vehiclePrice;
  const downPaymentAmount = (currentPrice * downPaymentPct) / 100;
  const principal = currentPrice - downPaymentAmount;

  // Monthly interest rate
  const monthlyRate = annualInterestRate / 100 / 12;

  // Monthly repayment formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
  const calculation = useMemo(() => {
    if (principal <= 0 || loanTermMonths <= 0) {
      return { monthlyPayment: 0, totalPayment: 0, totalInterest: 0 };
    }
    const factor = Math.pow(1 + monthlyRate, loanTermMonths);
    const monthlyPayment = (principal * (monthlyRate * factor)) / (factor - 1);
    const totalPayment = monthlyPayment * loanTermMonths;
    const totalInterest = totalPayment - principal;

    return {
      monthlyPayment: Math.round(monthlyPayment),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
    };
  }, [principal, monthlyRate, loanTermMonths]);

  // Generate Year-by-Year Amortization Schedule
  const amortizationSchedule = useMemo(() => {
    const years = Math.ceil(loanTermMonths / 12);
    const schedule = [];
    let remainingBalance = principal;

    for (let yr = 1; yr <= years; yr++) {
      const monthsInYear = Math.min(12, loanTermMonths - (yr - 1) * 12);
      let yearInterest = 0;
      let yearPrincipal = 0;

      for (let m = 0; m < monthsInYear; m++) {
        const interestForMonth = remainingBalance * monthlyRate;
        const principalForMonth = calculation.monthlyPayment - interestForMonth;
        yearInterest += interestForMonth;
        yearPrincipal += principalForMonth;
        remainingBalance = Math.max(0, remainingBalance - principalForMonth);
      }

      schedule.push({
        year: `Year ${yr}`,
        principalPaid: Math.round(yearPrincipal),
        interestPaid: Math.round(yearInterest),
        remainingBalance: Math.round(remainingBalance),
      });
    }

    return schedule;
  }, [principal, loanTermMonths, monthlyRate, calculation.monthlyPayment]);

  const currencySymbol = "₦";

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-[#2563EB] selection:text-[#FFFFFF]">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section Banner */}
        <PageBanner
          badge="AUTO LOANS & CHATTEL MORTGAGES"
          title="LUXURY VEHICLE"
          titleHighlight="FINANCE CALCULATOR"
          subtitle="Model customized monthly repayment terms, down payments, and prime bank facility structures with real-time amortization."
          backgroundImage="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1920&q=80"
          breadcrumbs={[
            { label: "Financial Services" },
            { label: "Loan Calculator" },
          ]}
          stats={[
            { value: "4.5% - 9.5%", label: "Indicative APR" },
            { value: "12 - 60 Mo", label: "Flexible Tenures" },
            { value: "24-Hour", label: "Pre-Approval Turnaround" },
          ]}
        />

        {/* Currency Switcher & Controls Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
          <div>
            <h2 className="text-lg font-black text-[#0F172A] uppercase tracking-tight">Financing Parameters</h2>
            <p className="text-xs text-[#64748B]">Adjust vehicle price, equity down payment, and preferred loan duration</p>
          </div>

          <div className="flex items-center bg-[#EFF6FF] px-3.5 py-1.5 rounded-xl border border-[#BFDBFE] text-xs font-mono font-bold text-[#2563EB]">
            ₦ NGN (Nigerian Naira)
          </div>
        </div>

        {/* Two-Column Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls Panel (6 cols) */}
          <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB] flex items-center gap-2">
              <FiFileText className="w-4 h-4 text-[#2563EB]" />
              <span>Financing Parameters</span>
            </h3>

            {/* Vehicle Purchase Price Input */}
            <div className="space-y-1.5">
              <Input
                label="Vehicle Purchase Price"
                type="number"
                value={vehiclePrice}
                onChange={(e) => setVehiclePrice(Math.max(10000, Number(e.target.value)))}
                className="font-mono"
                helperText={`Default: ₦245,000,000 (Mercedes-Benz S-Class S580 Executive) • Displayed: ${currencySymbol}${Math.round(currentPrice).toLocaleString()}`}
              />
            </div>

            {/* Down Payment Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#0F172A] font-semibold">
                  Down Payment ({downPaymentPct}%):
                </span>
                <span className="font-mono font-bold text-[#0F172A]">
                  {currencySymbol}{Math.round(downPaymentAmount).toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={70}
                step={5}
                value={downPaymentPct}
                onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                className="w-full accent-[#2563EB] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#64748B] font-mono">
                <span>10% Minimum</span>
                <span>40% Recommended</span>
                <span>70% Max</span>
              </div>
            </div>

            {/* Loan Tenure Selector */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#0F172A] font-semibold">Loan Term:</span>
                <span className="font-mono font-bold text-[#1D4ED8]">{loanTermMonths} Months ({loanTermMonths / 12} Years)</span>
              </div>
              <div className="grid grid-cols-6 gap-1.5">
                {[12, 24, 36, 48, 60, 72].map((m) => (
                  <Button
                    key={m}
                    type="button"
                    variant={loanTermMonths === m ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setLoanTermMonths(m)}
                    className="font-mono text-xs py-2"
                  >
                    {m}M
                  </Button>
                ))}
              </div>
            </div>

            {/* Annual Interest Rate Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#0F172A] font-semibold">Annual Interest Rate (APR):</span>
                <span className="font-mono font-bold text-[#1D4ED8]">{annualInterestRate}%</span>
              </div>
              <input
                type="range"
                min={4.0}
                max={22.0}
                step={0.5}
                value={annualInterestRate}
                onChange={(e) => setAnnualInterestRate(Number(e.target.value))}
                className="w-full accent-[#2563EB] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#64748B] font-mono">
                <span>4.0% Prime</span>
                <span>8.5% Standard Bank</span>
                <span>22.0% Commercial</span>
              </div>
            </div>
          </div>

          {/* Results & Repayment Breakdown (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Primary Monthly Output Card */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#2563EB]/10 rounded-full blur-2xl pointer-events-none" />

              <span className="text-[10px] uppercase font-bold tracking-widest text-[#64748B] block mb-1">
                Estimated Monthly Repayment
              </span>
              <div className="text-3xl sm:text-4xl font-black font-mono text-[#1D4ED8] tracking-tight">
                {currencySymbol}{calculation.monthlyPayment.toLocaleString()}
                <span className="text-xs font-normal text-[#64748B]"> /month</span>
              </div>

              {/* 3 Metrics Strip */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#E2E8F0] text-xs">
                <div>
                  <span className="text-[10px] text-[#64748B] block">Principal Financed</span>
                  <span className="font-mono font-bold text-[#0F172A]">
                    {currencySymbol}{Math.round(principal).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#64748B] block">Total Interest</span>
                  <span className="font-mono font-bold text-[#2563EB]">
                    {currencySymbol}{calculation.totalInterest.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#64748B] block">Total Cost</span>
                  <span className="font-mono font-bold text-[#0F172A]">
                    {currencySymbol}{calculation.totalPayment.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* CTA button */}
              <div className="mt-5">
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => setIsPreQualModalOpen(true)}
                  leftIcon={<FiCheckCircle className="w-4 h-4 text-[#FFFFFF]" />}
                >
                  Apply for Pre-Qualification
                </Button>
              </div>
            </div>

            {/* Principal vs Interest Visual Ratio */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2563EB] flex items-center gap-1.5">
                <FiPieChart className="w-3.5 h-3.5" />
                <span>Repayment Ratio Distribution</span>
              </h4>

              {/* Progress bar ratio */}
              <div className="w-full h-3 rounded-full bg-[#E2E8F0] overflow-hidden flex border border-[#CBD5E1]">
                <div
                  style={{
                    width: `${Math.round((principal / calculation.totalPayment) * 100) || 75}%`,
                  }}
                  className="bg-[#0F172A] h-full"
                  title="Principal"
                />
                <div
                  style={{
                    width: `${Math.round((calculation.totalInterest / calculation.totalPayment) * 100) || 25}%`,
                  }}
                  className="bg-[#2563EB] h-full"
                  title="Interest"
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="flex items-center gap-1.5 text-[#334155] font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0F172A]" />
                  Principal Portion ({Math.round((principal / calculation.totalPayment) * 100) || 0}%)
                </span>
                <span className="flex items-center gap-1.5 text-[#2563EB] font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                  Interest Portion ({Math.round((calculation.totalInterest / calculation.totalPayment) * 100) || 0}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Amortization Schedule Table */}
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#0F172A] uppercase tracking-tight">
                Amortization Schedule Breakdown
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Year-over-year balance reduction with principal and interest amortization.
              </p>
            </div>
            <span className="text-xs font-mono text-[#2563EB] font-bold">
              {loanTermMonths} Month Schedule
            </span>
          </div>

          <Table
            title="Amortization Schedule"
            data={amortizationSchedule}
            keyExtractor={(_, idx) => idx}
            pageSize={15}
            showSerialNumber={true}
            exportFileName="amortization_schedule"
            filterPlaceholder="Filter schedule periods..."
            columns={[
              {
                key: "year",
                header: "Period",
                sortable: true,
                render: (row) => <span className="font-semibold text-[#0F172A]">{row.year}</span>,
              },
              {
                key: "principalPaid",
                header: "Principal Paid",
                sortable: true,
                render: (row) => <span>{currencySymbol}{row.principalPaid.toLocaleString()}</span>,
              },
              {
                key: "interestPaid",
                header: "Interest Paid",
                sortable: true,
                render: (row) => <span className="text-[#2563EB] font-bold">{currencySymbol}{row.interestPaid.toLocaleString()}</span>,
              },
              {
                key: "remainingBalance",
                header: "Remaining Balance",
                align: "right",
                sortable: true,
                render: (row) => <span className="font-bold text-[#0F172A]">{currencySymbol}{row.remainingBalance.toLocaleString()}</span>,
              },
            ]}
          />
        </div>
      </main>

      {/* Pre-Qualification Modal */}
      <Modal
        isOpen={isPreQualModalOpen}
        onClose={() => setIsPreQualModalOpen(false)}
        size="lg"
        title="Submit Pre-Qualification Application"
        description="Our finance team will verify your eligibility with our banking partners (Zenith, Access, Stanbic IBTC)."
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreQualModalOpen(false)}
              leftIcon={<FiX className="w-3.5 h-3.5" />}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setIsPreQualModalOpen(false);
                setIsPreQualSuccessOpen(true);
              }}
              leftIcon={<FiCheck className="w-3.5 h-3.5 text-white" />}
            >
              Submit Application
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input label="Full Legal Name" placeholder="e.g. Chief Alexander Vance" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Email Address" type="email" placeholder="alexander@company.com" />
            <Input label="Phone Number" placeholder="+234 (0) 800 123 4567" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Dropdown
              label="Employment Status"
              options={[
                { label: "Business Owner / Executive", value: "business" },
                { label: "Corporate Professional", value: "corporate" },
                { label: "Expatriate / Diplomat", value: "diplomat" },
              ]}
              onChange={() => {}}
            />
            <Dropdown
              label="Preferred Financing Bank"
              options={[
                { label: "Stanbic IBTC Vehicle Asset Finance", value: "stanbic" },
                { label: "Access Bank Private Auto Loan", value: "access" },
                { label: "Zenith Bank Executive Leasing", value: "zenith" },
              ]}
              onChange={() => {}}
            />
          </div>
        </div>
      </Modal>

      {/* Pre-Qualification Submitted Modal */}
      <Modal
        isOpen={isPreQualSuccessOpen}
        onClose={() => setIsPreQualSuccessOpen(false)}
        title="Application Successfully Submitted"
        description="Your financing pre-qualification request has been securely routed."
        size="sm"
        footer={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsPreQualSuccessOpen(false)}
            leftIcon={<FiCheck className="w-3.5 h-3.5 text-white" />}
          >
            Acknowledge & Close
          </Button>
        }
      >
        <div className="space-y-3 text-xs text-[#475569]">
          <p>
            Your luxury asset financing pre-qualification application for <strong className="text-[#0F172A]">₦{principal.toLocaleString()} NGN principal</strong> has been received.
          </p>
          <div className="p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg text-[11px] text-[#1D4ED8]">
            Our underwriting desk and partner credit officers (Zenith, Stanbic IBTC, Access) will review your credit tier and issue an indicative conditional pre-approval within 24 business hours.
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}

