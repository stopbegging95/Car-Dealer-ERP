"use client";

import React from "react";
import { FiCheckCircle, FiClock } from "react-icons/fi";
import { Badge } from "@/components/ui";

export interface CustomsStage {
  label: string;
  date: string;
  done?: boolean;
  current?: boolean;
}

export interface CustomsTrackingItem {
  ref: string;
  vehicle: string;
  vessel: string;
  container: string;
  bol: string;
  portLoading: string;
  portDischarge: string;
  eta: string;
  stages: CustomsStage[];
  clearingOfficer: string;
}

export interface CustomsTrackerTabProps {
  customsTracking: CustomsTrackingItem[];
}

export const CustomsTrackerTab: React.FC<CustomsTrackerTabProps> = ({ customsTracking }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-4 bg-[#FFFFFF] shadow-sm p-4 sm:p-5 border border-[#E2E8F0] rounded-2xl">
        <div>
          <h3 className="font-bold text-[#0F172A] text-base uppercase tracking-tight">
            Live Customs Import & Vessel Tracker
          </h3>
          <p className="text-[#64748B] text-xs">Real-time ocean transit, Tin Can Island port discharge, and customs clearance status.</p>
        </div>

        {customsTracking.map((item) => (
          <div key={item.ref} className="space-y-4 bg-[#F8FAFC] p-4 sm:p-5 border border-[#CBD5E1] rounded-2xl">
            <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-3 border-[#E2E8F0] border-b">
              <div>
                <span className="mr-2 font-mono font-bold text-[#2563EB] text-xs">{item.ref}</span>
                <h4 className="inline font-bold text-[#0F172A] text-base">{item.vehicle}</h4>
              </div>
              <Badge variant="gold" size="sm">ETA: {item.eta}</Badge>
            </div>

            {/* 5-Step Visual Stepper */}
            <div className="gap-2 grid grid-cols-1 sm:grid-cols-5 pt-2">
              {item.stages.map((stg, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl border text-center space-y-1 ${
                    stg.done
                      ? "bg-[#EFF6FF] border-[#BFDBFE] text-[#2563EB]"
                      : stg.current
                      ? "bg-[#2563EB] text-[#FFFFFF] border-[#2563EB] shadow-md shadow-[#2563EB]/25"
                      : "bg-[#FFFFFF] border-[#E2E8F0] text-[#94A3B8]"
                  }`}
                >
                  <div className="flex justify-center items-center gap-1 font-bold text-[11px]">
                    {stg.done && <FiCheckCircle className="w-3.5 h-3.5 text-[#2563EB]" />}
                    {stg.current && <FiClock className="w-3.5 h-3.5 text-white animate-spin" />}
                    <span>Step {i + 1}</span>
                  </div>
                  <div className="font-semibold text-xs">{stg.label}</div>
                  <div className="opacity-80 font-mono text-[10px]">{stg.date}</div>
                </div>
              ))}
            </div>

            {/* Shipment Particulars */}
            <div className="gap-3 grid grid-cols-2 sm:grid-cols-4 pt-3 border-[#E2E8F0] border-t text-xs">
              <div>
                <span className="block text-[#64748B] text-[10px]">Vessel Name</span>
                <strong className="text-[#0F172A]">{item.vessel}</strong>
              </div>
              <div>
                <span className="block text-[#64748B] text-[10px]">Container No</span>
                <strong className="font-mono text-[#0F172A]">{item.container}</strong>
              </div>
              <div>
                <span className="block text-[#64748B] text-[10px]">Bill of Lading</span>
                <strong className="font-mono text-[#0F172A]">{item.bol}</strong>
              </div>
              <div>
                <span className="block text-[#64748B] text-[10px]">Clearing Officer</span>
                <strong className="text-[#2563EB]">{item.clearingOfficer}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

