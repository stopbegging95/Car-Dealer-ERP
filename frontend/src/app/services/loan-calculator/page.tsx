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
import { Button, Input, Modal, Dropdown } from "@/components/ui";

export default function LoanCalculatorPage() {
  const [currency, setCurrency] = useState<"USD" | "NGN">("USD");
  const [vehiclePrice, setVehiclePrice] = useState<number>(165000);
  const [downPaymentPct, setDownPaymentPct] = useState<number>(20);
  const [loanTermMonths, setLoanTermMonths] = useState<number>(48);
  const [annualInterestRate, setAnnualInterestRate] = useState<number>(8.5);
  const [isPreQualModalOpen, setIsPreQualModalOpen] = useState<boolean>(false);

  // Conversion rate assumption: 1 USD = 1,500 NGN
  const fxRate = 1500;
  const currentPrice = currency === "USD" ? vehiclePrice : vehiclePrice * fxRate;
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

  const currencySymbol = currency === "USD" ? "$" : "₦";

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-[#2563EB] selection:text-[#FFFFFF]">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] text-xs font-bold mb-2">
              <FiDollarSign className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Automotive Financing & Loan Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0F172A] uppercase tracking-tight">
              Vehicle Loan Calculator
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              Accurate monthly repayment estimations using standard amortized compound schedules.
            </p>
          </div>

          {/* Currency Switcher */}
          <div className="flex items-center bg-[#FFFFFF] p-1 rounded-xl border border-[#CBD5E1] shadow-xs self-start md:self-auto">
            <span className="text-xs text-[#64748B] px-2 font-medium">Currency:</span>
            <button
              onClick={() => setCurrency("USD")}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                currency === "USD" ? "bg-[#2563EB] text-[#FFFFFF] shadow-xs" : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              $ USD
            </button>
            <button
              onClick={() => setCurrency("NGN")}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                currency === "NGN" ? "bg-[#2563EB] text-[#FFFFFF] shadow-xs" : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              ₦ NGN
            </button>
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
              <div className="flex justify-between text-xs">
                <span className="text-[#0F172A] font-semibold">Vehicle Purchase Price:</span>
                <span className="font-mono font-bold text-[#1D4ED8]">
                  {currencySymbol}{Math.round(currentPrice).toLocaleString()}
                </span>
              </div>
              <input
                type="number"
                value={vehiclePrice}
                onChange={(e) => setVehiclePrice(Math.max(10000, Number(e.target.value)))}
                className="w-full bg-[#F8FAFC] text-sm text-[#0F172A] font-mono px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#2563EB] outline-none shadow-xs"
              />
              <span className="text-[10px] text-[#64748B] block">
                Default: $165,000 (Mercedes-Benz S-Class S580 Executive)
              </span>
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
                  <button
                    key={m}
                    type="button"
                    onClick={() => setLoanTermMonths(m)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer ${
                      loanTermMonths === m
                        ? "bg-[#2563EB] text-[#FFFFFF] border-[#2563EB] shadow-xs"
                        : "bg-[#FFFFFF] text-[#475569] border-[#CBD5E1] hover:border-[#2563EB]"
                    }`}
                  >
                    {m}M
                  </button>
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

          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] text-[10px] uppercase font-bold text-[#64748B] border-b border-[#E2E8F0] whitespace-nowrap">
                  <th className="py-2.5 px-3">Period</th>
                  <th className="py-2.5 px-3">Principal Paid</th>
                  <th className="py-2.5 px-3">Interest Paid</th>
                  <th className="py-2.5 px-3 text-right">Remaining Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] font-mono text-xs whitespace-nowrap">
                {amortizationSchedule.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#EFF6FF] transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-[#0F172A]">{row.year}</td>
                    <td className="py-2.5 px-3 text-[#334155]">{currencySymbol}{row.principalPaid.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-[#2563EB] font-bold">{currencySymbol}{row.interestPaid.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#0F172A]">{currencySymbol}{row.remainingBalance.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                alert("Pre-qualification application submitted successfully!");
                setIsPreQualModalOpen(false);
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

      <Footer />
    </div>
  );
}

