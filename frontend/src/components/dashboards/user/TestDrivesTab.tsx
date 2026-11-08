"use client";

import React from "react";
import Link from "next/link";
import {
  FiCalendar,
  FiMapPin,
  FiPhone,
  FiPlus,
} from "react-icons/fi";
import { Button, Badge } from "@/components/ui";

export interface TestDriveItem {
  id: string;
  vehicle: string;
  stockId: string;
  date: string;
  showroom: string;
  liaison: string;
  phone: string;
  status: string;
}

export interface TestDrivesTabProps {
  testDriveBookings: TestDriveItem[];
}

export const TestDrivesTab: React.FC<TestDrivesTabProps> = ({ testDriveBookings }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-3 bg-[#FFFFFF] shadow-sm p-4 sm:p-5 border border-[#E2E8F0] rounded-2xl">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-[#0F172A] text-base uppercase tracking-tight">
              VIP Test Drive Appointments ({testDriveBookings.length})
            </h3>
            <p className="text-[#64748B] text-xs">Scheduled private showroom viewings with assigned client relations liaisons.</p>
          </div>
          <Link href="/inventory">
            <Button variant="primary" size="sm" leftIcon={<FiPlus className="w-3.5 h-3.5" />}>
              Book Another Test Drive
            </Button>
          </Link>
        </div>

        <div className="space-y-3 pt-1">
          {testDriveBookings.map((td) => (
            <div
              key={td.id}
              className="flex md:flex-row flex-col justify-between md:items-center gap-4 bg-[#F8FAFC] p-4 border border-[#CBD5E1] rounded-xl"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#2563EB] text-xs">{td.id}</span>
                  <span className="text-[#CBD5E1]">&bull;</span>
                  <h4 className="font-bold text-[#0F172A] text-sm">{td.vehicle}</h4>
                  <Badge variant="gold" size="sm">{td.status}</Badge>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-1 text-[#475569] text-xs">
                  <span className="flex items-center gap-1 font-semibold text-[#0F172A]">
                    <FiCalendar className="w-3.5 h-3.5 text-[#2563EB]" />
                    {td.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiMapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                    {td.showroom}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiPhone className="w-3.5 h-3.5 text-[#2563EB]" />
                    {td.liaison} ({td.phone})
                  </span>
                </div>
              </div>

              <div className="flex items-center self-start md:self-auto gap-2">
                <Link href={`/inventory/${td.stockId}`}>
                  <Button variant="outline" size="sm">
                    Car Specs
                  </Button>
                </Link>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => alert(`Reschedule request submitted for ${td.vehicle}. Your liaison will call you shortly.`)}
                >
                  Reschedule
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

