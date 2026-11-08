"use client";

import React, { useState } from "react";
import { FiPlus, FiCheck } from "react-icons/fi";
import { Button, Badge, Card, Modal, Input, Dropdown } from "@/components/ui";

export interface ShipmentItem {
  ref: string;
  car: string;
  vessel: string;
  route: string;
  container: string;
  eta: string;
  sgdStatus: string;
  stagePct: string;
  clearingAgent: string;
}

export interface ImportsLogisticsPageProps {
  showToast: (msg: string) => void;
}

export const ImportsLogisticsPage: React.FC<ImportsLogisticsPageProps> = ({ showToast }) => {
  const [shipments, setShipments] = useState<ShipmentItem[]>([
    {
      ref: "IMP-2026-991",
      car: "2024 Mercedes-Maybach S580 (Dual-Tone)",
      vessel: "Grande Lagos (Grimaldi Lines)",
      route: "Antwerp, Belgium &rarr; Tin Can Island Terminal (TCIT), Lagos",
      container: "MSCU-9918234",
      eta: "In 4 Days (Nov 12, 2026)",
      sgdStatus: "SGD Assessed & Paid (35% Duty Cleared)",
      stagePct: "80%",
      clearingAgent: "Maritime Express Logistics Ltd",
    },
    {
      ref: "IMP-2026-988",
      car: "2024 Porsche 911 Turbo S (Guards Red)",
      vessel: "Grande Senegal (Grimaldi Deep Sea)",
      route: "Hamburg, Germany &rarr; Port of Lagos TCIT",
      container: "GRIU-4402198",
      eta: "In 7 Days (Nov 15, 2026)",
      sgdStatus: "Assessment Generated &bull; Escrow Wire Dispatched",
      stagePct: "65%",
      clearingAgent: "Crown Seal Bonded Terminal",
    },
    {
      ref: "IMP-2026-982",
      car: "2023 Range Rover Autobiography LWB",
      vessel: "MSC Maria Laura V.92",
      route: "Southampton, UK &rarr; Tin Can Island Terminal",
      container: "MSCU-8810239",
      eta: "Discharged (Tin Can Port Bay #4)",
      sgdStatus: "NCS Final Physical Examination Passed",
      stagePct: "95%",
      clearingAgent: "Maritime Express Logistics Ltd",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refCode, setRefCode] = useState("");
  const [car, setCar] = useState("2024 Mercedes-Maybach S580");
  const [vessel, setVessel] = useState("Grande Togo (Grimaldi Lines)");
  const [container, setContainer] = useState("");
  const [origin, setOrigin] = useState("Antwerp, Belgium");
  const [eta, setEta] = useState("In 10 Days");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: ShipmentItem = {
      ref: refCode || `IMP-2026-${String(shipments.length + 993)}`,
      car,
      vessel,
      route: `${origin} &rarr; Tin Can Island Terminal, Lagos`,
      container: container || `MSCU-${Math.floor(1000000 + Math.random() * 9000000)}`,
      eta,
      sgdStatus: "Pre-Arrival Assessment Logged",
      stagePct: "35%",
      clearingAgent: "Maritime Express Logistics Ltd",
    };
    setShipments([newEntry, ...shipments]);
    setIsModalOpen(false);
    showToast(`Inbound ocean manifest logged for ${vessel} &bull; ${car}.`);
    setRefCode("");
    setContainer("");
  };

  return (
    <Card className="space-y-4 shadow-xs p-4 sm:p-5">
      <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-2.5 border-b border-[#E2E8F0]">
        <div>
          <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
            Ocean Vessel Tracking & Port Customs (NCS SGD) Clearance
          </h3>
          <p className="text-[11px] text-[#64748B]">
            Automated AIS satellite marine telemetry from European and US export terminals to Lagos Port discharge
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="gold" size="sm">NCS Fast-Track Accredited</Badge>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<FiPlus className="w-3.5 h-3.5" />}
          >
            + Log Inbound Vessel Shipment
          </Button>
        </div>
      </div>

      {/* Modal for Logging Inbound Shipment */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log Inbound Ocean Vessel Consignment"
        size="md"
      >
        <form onSubmit={handleCreate} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Shipment Reference"
              placeholder="e.g. IMP-2026-995"
              value={refCode}
              onChange={(e) => setRefCode(e.target.value)}
            />
            <Dropdown
              label="Enclosed Vehicle Model"
              options={[
                { label: "2024 Mercedes-Maybach S580", value: "2024 Mercedes-Maybach S580" },
                { label: "2024 Porsche 911 Turbo S", value: "2024 Porsche 911 Turbo S" },
                { label: "2023 Range Rover Autobiography", value: "2023 Range Rover Autobiography" },
                { label: "2024 Mercedes-AMG G63 Magno", value: "2024 Mercedes-AMG G63 Magno" },
              ]}
              value={car}
              onChange={(val) => setCar(String(val))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Ocean Cargo Vessel"
              placeholder="e.g. Grande Abidjan (Grimaldi)"
              value={vessel}
              onChange={(e) => setVessel(e.target.value)}
              required
            />
            <Input
              label="Container Serial ID"
              placeholder="e.g. MSCU-9921441"
              value={container}
              onChange={(e) => setContainer(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Dropdown
              label="Origin Departure Port"
              options={[
                { label: "Antwerp Terminal, Belgium", value: "Antwerp, Belgium" },
                { label: "Hamburg Terminal, Germany", value: "Hamburg, Germany" },
                { label: "Southampton Docks, UK", value: "Southampton, UK" },
                { label: "Port of Newark, USA", value: "Newark, USA" },
                { label: "Jebel Ali Port, UAE", value: "Dubai, UAE" },
              ]}
              value={origin}
              onChange={(val) => setOrigin(String(val))}
            />
            <Input
              label="Expected ETA at Port of Lagos"
              placeholder="e.g. In 8 Days (Nov 16, 2026)"
              value={eta}
              onChange={(e) => setEta(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" leftIcon={<FiCheck />}>
              Record Vessel & Broadcast AIS Radar
            </Button>
          </div>
        </form>
      </Modal>

      <div className="space-y-3">
        {shipments.map((shipment) => (
          <div
            key={shipment.ref}
            className="space-y-2.5 bg-[#F8FAFC] p-3.5 border border-[#E2E8F0] rounded-md text-xs"
          >
            <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold font-mono text-[#2563EB]">{shipment.ref}</span>
                  <span className="font-bold text-[#0F172A] text-sm">{shipment.car}</span>
                  <Badge variant="gold" size="sm">{shipment.eta}</Badge>
                </div>
                <span className="block mt-0.5 text-[#64748B] text-[11px]">
                  Vessel: <strong className="text-[#0F172A]">{shipment.vessel}</strong> &bull; Container: <span className="font-mono">{shipment.container}</span>
                </span>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => showToast(`Opening live AIS vessel radar tracker for ${shipment.vessel}`)}
                  className="px-2.5 py-1 text-xs"
                >
                  Live AIS Marine Radar
                </Button>
              </div>
            </div>

            {/* Progress Track */}
            <div className="space-y-1">
              <div className="flex justify-between font-mono text-[10px] text-[#64748B]">
                <span dangerouslySetInnerHTML={{ __html: shipment.route }} />
                <span className="font-bold text-[#2563EB]">{shipment.stagePct} Complete</span>
              </div>
              <div className="bg-[#E2E8F0] rounded-full w-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#2563EB] rounded-full h-full transition-all"
                  style={{ width: shipment.stagePct }}
                />
              </div>
            </div>

            {/* Port & Customs Assessment */}
            <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 bg-[#FFFFFF] p-2.5 border border-[#E2E8F0] rounded text-[11px]">
              <div>
                <span className="font-bold text-[#0F172A]">Customs Assessment:</span>
                <span className="ml-1.5 text-[#475569]">{shipment.sgdStatus}</span>
              </div>
              <div className="text-[#64748B]">
                Licensed Clearing Partner: <strong className="text-[#0F172A]">{shipment.clearingAgent}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

