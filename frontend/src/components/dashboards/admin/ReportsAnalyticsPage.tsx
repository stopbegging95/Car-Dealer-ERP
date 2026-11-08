"use client";

import React, { useState } from "react";
import {
  FiBarChart2,
  FiDownload,
  FiTrendingUp,
  FiClock,
  FiPercent,
  FiCheckCircle,
  FiCpu,
  FiBox,
  FiCalendar,
  FiArrowUpRight,
  FiActivity,
} from "react-icons/fi";
import { FaCar } from "react-icons/fa6";
import { Button, Badge, Card, KPICard, Table } from "@/components/ui";

export const ReportsAnalyticsPage: React.FC<{ showToast?: (msg: string) => void }> = ({ showToast }) => {
  const [selectedReportTimeframe, setSelectedReportTimeframe] = useState("FY 2026");
  const [selectedForecastQuarter, setSelectedForecastQuarter] = useState<"Q4 2026" | "Q1 2027" | "Q2 2027">("Q1 2027");

  // Phase 3: AI Predictive Demand Models (Section 24)
  const forecastData = [
    {
      category: "Premium SUVs (Range Rover SV, Mercedes G63, Lexus LX600)",
      historicalVolume: "148 Units",
      predictedDemand: "+38% Surge (204 Units)",
      confidence: "97.4%",
      stockingRecommendation: "Order +8 Units via Ro-Ro (Antwerp)",
      estGrossProfit: "$6.2M",
      seasonalityDriver: "Festive Season & Government Budget Cycle",
    },
    {
      category: "Executive Class (Mercedes-Maybach S580, BMW 760i)",
      historicalVolume: "114 Units",
      predictedDemand: "+24% Growth (141 Units)",
      confidence: "95.2%",
      stockingRecommendation: "Order +5 Units (US Manheim direct)",
      estGrossProfit: "$3.5M",
      seasonalityDriver: "Corporate Executive Fleet Renewals",
    },
    {
      category: "Electric Vehicles & Hybrids (Tesla Cybertruck, BYD, Lexus RX)",
      historicalVolume: "48 Units",
      predictedDemand: "+45% High Acceleration (70 Units)",
      confidence: "91.8%",
      stockingRecommendation: "Order +6 Units (Dubai Freezone)",
      estGrossProfit: "$1.4M",
      seasonalityDriver: "Fuel Subsidy Shift & Luxury ESG Mandates",
    },
    {
      category: "Sport & Performance (Porsche 911 Turbo S, BMW M4 CSL)",
      historicalVolume: "68 Units",
      predictedDemand: "+12% Steady (76 Units)",
      confidence: "94.6%",
      stockingRecommendation: "Order +3 Units (Bespoke Allocation)",
      estGrossProfit: "$2.1M",
      seasonalityDriver: "HNI Private Collector Inquiries",
    },
    {
      category: "Commercial Vehicles & Armored Hilux (Mining & Protocol)",
      historicalVolume: "38 Units",
      predictedDemand: "+30% Surge (49 Units)",
      confidence: "96.0%",
      stockingRecommendation: "Order +10 Units (B6 Armoring Kit)",
      estGrossProfit: "$1.8M",
      seasonalityDriver: "Security & Regional Logistics Contracts",
    },
    {
      category: "Exotic & Supercars (Ferrari 296, Lamborghini Revuelto)",
      historicalVolume: "34 Units",
      predictedDemand: "+8% Niche Exclusive (37 Units)",
      confidence: "89.5%",
      stockingRecommendation: "Pre-Order on Escrow Deposit Only",
      estGrossProfit: "$2.3M",
      seasonalityDriver: "Year-End Galas & Collector Private Viewings",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-3 bg-[#FFFFFF] shadow-xs p-4 sm:p-5 border border-[#E2E8F0] rounded-md">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
              Dealership Reports & Advanced Analytics
            </h3>
            <Badge variant="gold" size="sm">Section 21 & 22 ERP Specification</Badge>
          </div>
          <p className="text-[#64748B] text-xs">
            Cross-department operational intelligence, stock turnover rates, days in stock, and sales performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => showToast?.("Exporting full analytics report as CSV spreadsheet...")}
            leftIcon={<FiDownload className="w-3.5 h-3.5 text-[#2563EB]" />}
          >
            Export to CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => showToast?.("Comprehensive Dealership Performance Audit generated as PDF.")}
            leftIcon={<FiDownload className="w-3.5 h-3.5 text-[#FFFFFF]" />}
          >
            Download PDF Report
          </Button>
        </div>
      </div>

      {/* Analytics KPI Strip */}
      <div className="gap-3 grid grid-cols-2 sm:grid-cols-4">
        <KPICard
          title="Average Days in Stock"
          value="26.4 Days"
          change="-4.2 Days vs target"
          icon={<FiClock className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Annual Inventory Turnover"
          value="8.2x Turn"
          change="Top-tier luxury benchmark"
          icon={<FiTrendingUp className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Inquiry-to-Sale Conversion"
          value="31.4%"
          change="+3.8% MoM Improvement"
          icon={<FiPercent className="w-5 h-5 text-emerald-600" />}
        />
        <KPICard
          title="Average Margin Per Unit"
          value="$21,650"
          change="Luxury & Supercar Segment"
          icon={<FiCheckCircle className="w-5 h-5 text-[#2563EB]" />}
        />
      </div>

      {/* Category Performance Matrix (Section 18 Categories) */}
      <Card className="space-y-3 p-4 sm:p-5 shadow-xs">
        <div className="flex justify-between items-center pb-2.5 border-b border-[#E2E8F0]">
          <div>
            <h4 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider">
              Vehicle Category Velocity & Margin Distribution (Section 18)
            </h4>
            <p className="text-[11px] text-[#64748B]">Sales volume, average days to close, and margin performance by vehicle class.</p>
          </div>
          <Badge variant="gold" size="sm">Active Callout</Badge>
        </div>

        <Table
          data={[
            { category: "Executive Class (Mercedes S-Class, BMW 7 Series)", units: "114 Sold", days: "22 Days Avg", margin: "18.2% ($24.8k)", share: 75, velocity: "High" },
            { category: "Premium SUVs (Range Rover, G-Class, Urus)", units: "148 Sold", days: "19 Days Avg", margin: "21.5% ($32.4k)", share: 90, velocity: "Very High" },
            { category: "Sport & Performance (Porsche 911, BMW M)", units: "68 Sold", days: "28 Days Avg", margin: "19.8% ($28.0k)", share: 60, velocity: "Moderate" },
            { category: "Exotic & Supercars (Ferrari, Lamborghini)", units: "34 Sold", days: "38 Days Avg", margin: "24.0% ($62.5k)", share: 45, velocity: "Exclusive" },
            { category: "Electric Vehicles (Tesla, BYD)", units: "48 Sold", days: "25 Days Avg", margin: "14.5% ($12.2k)", share: 50, velocity: "High" },
            { category: "Luxury Sedans (Lexus ES, Audi A6)", units: "52 Sold", days: "21 Days Avg", margin: "16.8% ($15.4k)", share: 55, velocity: "High" },
            { category: "Commercial & Trucks (Toyota Hilux, MAN)", units: "38 Sold", days: "18 Days Avg", margin: "15.0% ($11.8k)", share: 40, velocity: "High" },
            { category: "Classic & Vintage (Classic Benz, Porsche)", units: "12 Sold", days: "44 Days Avg", margin: "28.5% ($45.0k)", share: 20, velocity: "Niche" },
          ]}
          keyExtractor={(item) => item.category}
          pageSize={15}
          showSerialNumber={true}
          columns={[
            {
              key: "category",
              header: "Vehicle Category & Segment",
              sortable: true,
              render: (item) => (
                <div>
                  <span className="font-bold text-xs text-[#0F172A]">{item.category}</span>
                  <div className="w-24 bg-[#E2E8F0] rounded-full h-1 mt-1 overflow-hidden">
                    <div className="bg-[#2563EB] h-full rounded-full" style={{ width: `${item.share}%` }} />
                  </div>
                </div>
              ),
            },
            {
              key: "units",
              header: "Volume Sold",
              sortable: true,
              render: (item) => <span className="font-mono font-bold text-[#2563EB]">{item.units}</span>,
            },
            {
              key: "days",
              header: "Days in Stock Velocity",
              sortable: true,
              render: (item) => <span className="font-mono text-xs text-[#475569]">{item.days}</span>,
            },
            {
              key: "margin",
              header: "Gross Profit Margin",
              sortable: true,
              render: (item) => <span className="font-mono font-semibold text-emerald-600">{item.margin}</span>,
            },
            {
              key: "velocity",
              header: "Velocity Tier",
              align: "right",
              render: (item) => <Badge variant="gold" size="sm">{item.velocity}</Badge>,
            },
          ]}
        />
      </Card>

      {/* PHASE 3: AI SALES FORECASTING & STOCK DEMAND PREDICTION (PDF Section 24) */}
      <Card className="space-y-3 p-4 sm:p-5 shadow-xs bg-gradient-to-br from-white via-white to-purple-50/20 border-purple-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-[#E2E8F0]">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-md bg-purple-100 text-purple-700">
                <FiCpu className="w-4 h-4" />
              </span>
              <h4 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider">
                AI Sales Forecasting & Predictive Demand Modeling (Phase 3)
              </h4>
              <Badge variant="gold" size="sm">Machine Learning Engine</Badge>
            </div>
            <p className="text-[11px] text-[#64748B]">
              Predictive neural modeling analyzing macroeconomic indices, historical seasonal velocity, and inventory replenishment recommendations.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#F8FAFC] border border-[#CBD5E1] p-1 rounded-md text-xs">
            <span className="text-[10px] text-[#64748B] font-bold uppercase px-1">Forecast Target:</span>
            {(["Q4 2026", "Q1 2027", "Q2 2027"] as const).map((q) => (
              <button
                key={q}
                onClick={() => {
                  setSelectedForecastQuarter(q);
                  showToast?.(`AI Forecast recalculated for target horizon ${q}.`);
                }}
                className={`px-2 py-0.5 rounded font-bold text-[10px] transition-colors cursor-pointer ${
                  selectedForecastQuarter === q
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3 rounded-lg bg-white border border-purple-200 shadow-xs">
            <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
              Projected Quarter Demand Surge
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-mono font-bold text-2xl text-[#0F172A]">+31.8%</span>
              <span className="text-emerald-600 text-xs font-semibold flex items-center">
                <FiArrowUpRight className="w-3.5 h-3.5" /> Luxury Fleet Surge
              </span>
            </div>
            <p className="text-[10px] text-[#64748B] mt-1">
              Driven by year-end corporate capital allowances and festive luxury vehicle demand in Victoria Island & Abuja.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-white border border-purple-200 shadow-xs">
            <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
              Forecasted Gross Inventory Profit
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-mono font-bold text-2xl text-emerald-600">$17.3M</span>
              <span className="text-purple-600 text-xs font-mono font-semibold">
                (Avg 19.4% Margin)
              </span>
            </div>
            <p className="text-[10px] text-[#64748B] mt-1">
              Simulated across recommended procurement batches with pre-hedged USD/NGN exchange forward rates.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-white border border-purple-200 shadow-xs">
            <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
              Procurement Stocking Priority
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-mono font-bold text-2xl text-[#2563EB]">38 Units</span>
              <span className="text-amber-600 text-xs font-semibold">
                Stocking Lead: 35-45 Days
              </span>
            </div>
            <p className="text-[10px] text-[#64748B] mt-1">
              Immediate PO issuance recommended for 8x Range Rover SV & 6x Lexus LX600 before port congestion peaks.
            </p>
          </div>
        </div>

        <Table
          data={forecastData}
          keyExtractor={(item) => item.category}
          pageSize={15}
          showSerialNumber={true}
          columns={[
            {
              key: "category",
              header: "Vehicle Category & Target Segment",
              sortable: true,
              render: (item) => (
                <div>
                  <span className="font-bold text-xs text-[#0F172A] block">{item.category}</span>
                  <span className="text-[10px] text-[#64748B]">Driver: {item.seasonalityDriver}</span>
                </div>
              ),
            },
            {
              key: "historicalVolume",
              header: "Prior Base",
              render: (item) => (
                <span className="font-mono text-xs text-[#64748B]">{item.historicalVolume}</span>
              ),
            },
            {
              key: "predictedDemand",
              header: "AI Predicted Demand Horizon",
              sortable: true,
              render: (item) => (
                <span className="font-mono font-bold text-purple-700 text-xs">
                  {item.predictedDemand}
                </span>
              ),
            },
            {
              key: "confidence",
              header: "Model Confidence",
              sortable: true,
              render: (item) => (
                <Badge variant="gold" size="sm">
                  {item.confidence}
                </Badge>
              ),
            },
            {
              key: "stockingRecommendation",
              header: "AI Stocking Order Instruction",
              render: (item) => (
                <span className="font-semibold text-xs text-[#2563EB]">
                  {item.stockingRecommendation}
                </span>
              ),
            },
            {
              key: "estGrossProfit",
              header: "Projected Gross Margin",
              sortable: true,
              align: "right",
              render: (item) => (
                <span className="font-mono font-bold text-emerald-600 text-xs">
                  {item.estGrossProfit}
                </span>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

