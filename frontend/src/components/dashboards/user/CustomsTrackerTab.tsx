"use client";

import React from "react";
import { FiCheckCircle, FiClock } from "react-icons/fi";
import { Badge, Table, Card } from "@/components/ui";

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
      <Card className="shadow-xs p-4 sm:p-5">
        <div>
          <h3 className="font-bold text-[#0F172A] text-base uppercase tracking-tight">
            Live Customs Import & Vessel Tracker
          </h3>
          <p className="text-[#64748B] text-xs">
            Real-time ocean transit, Tin Can Island port discharge, and customs clearance status.
          </p>
        </div>
      </Card>

      <Table
        data={customsTracking}
        keyExtractor={(item) => item.ref}
        pageSize={15}
        showSerialNumber={true}
        columns={[
          {
            key: "ref",
            header: "Consignment Ref",
            sortable: true,
            render: (item) => <span className="font-mono font-bold text-[#2563EB] text-xs">{item.ref}</span>,
          },
          {
            key: "vehicle",
            header: "Vehicle Consignment",
            sortable: true,
            render: (item) => <span className="font-bold text-[#0F172A] text-xs">{item.vehicle}</span>,
          },
          {
            key: "vessel",
            header: "Carrier Vessel",
            render: (item) => <span className="text-[#475569] text-xs">{item.vessel}</span>,
          },
          {
            key: "bol",
            header: "Bill of Lading",
            render: (item) => <span className="font-mono text-[#0F172A] text-xs">{item.bol}</span>,
          },
          {
            key: "container",
            header: "Container No",
            render: (item) => <span className="font-mono text-[#64748B] text-xs">{item.container}</span>,
          },
          {
            key: "eta",
            header: "Estimated Arrival",
            sortable: true,
            render: (item) => (
              <Badge variant="gold" size="sm">
                ETA: {item.eta}
              </Badge>
            ),
          },
          {
            key: "clearingOfficer",
            header: "Clearing Officer",
            render: (item) => <span className="font-medium text-[#2563EB] text-xs">{item.clearingOfficer}</span>,
          },
        ]}
      />

      {customsTracking.map((item) => (
        <Card key={item.ref} className="space-y-4 shadow-xs p-4 sm:p-5">
          <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-3 border-b border-[#E2E8F0]">
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
          <div className="gap-3 grid grid-cols-2 sm:grid-cols-4 pt-3 border-t border-[#E2E8F0] text-xs">
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
        </Card>
      ))}
    </div>
  );
};
