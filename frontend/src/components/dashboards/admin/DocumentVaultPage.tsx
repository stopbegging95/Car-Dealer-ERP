"use client";

import React from "react";
import { FiDownload, FiFileText } from "react-icons/fi";
import { Button, Card } from "@/components/ui";

export interface DocumentVaultPageProps {
  onDownloadDoc: (doc: {
    name: string;
    car: string;
    type: string;
    date: string;
    size: string;
  }) => void;
}

export const DocumentVaultPage: React.FC<DocumentVaultPageProps> = ({ onDownloadDoc }) => {
  return (
    <div className="space-y-4">
      <Card className="space-y-4 shadow-xs p-4 sm:p-5">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-2 border-b border-[#E2E8F0]">
          <div>
            <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">Dealership Document Vault</h3>
            <p className="text-[11px] text-[#64748B]">Cryptographically watermarked titles, customs SGDs, and delivery inspection sheets</p>
          </div>
          <Button variant="outline" size="sm" leftIcon={<FiDownload className="w-3.5 h-3.5 text-[#2563EB]" />}>
            Upload Document
          </Button>
        </div>

        <div className="space-y-2 text-xs">
          {[
            { name: "Single Goods Declaration (SGD) - Port of Lagos Release", car: "Maybach S580 (VIN: WDD223...)", type: "Customs Duty Certificate", date: "2026-11-02", size: "2.1 MB PDF" },
            { name: "150-Point Pre-Delivery Inspection (PDI) Health Seal", car: "Porsche 911 Turbo S (VIN: WP0AD2...)", type: "Diagnostic Inspection", date: "2026-11-01", size: "3.4 MB PDF" },
            { name: "Certificate of Ownership & Title Registration", car: "Range Rover Autobiography (VIN: SALWR2...)", type: "Title Document", date: "2026-10-28", size: "1.9 MB PDF" },
            { name: "Marine Cargo Bill of Lading (B/L) - Antwerp Discharge", car: "Ferrari 296 GTB (VIN: ZFF88...)", type: "Bill of Lading", date: "2026-10-24", size: "1.6 MB PDF" },
          ].map((doc, di) => (
            <div key={di} className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-md">
              <div className="flex items-center gap-3">
                <div className="bg-[#EFF6FF] p-2 border border-[#BFDBFE] rounded-md text-[#2563EB]">
                  <FiFileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#0F172A]">{doc.name}</div>
                  <span className="block text-[10px] text-[#64748B]">{doc.car} &bull; {doc.type} &bull; {doc.size}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDownloadDoc(doc)}
                className="self-end sm:self-auto px-2.5 py-1 text-xs"
                leftIcon={<FiDownload className="w-3 h-3 text-[#2563EB]" />}
              >
                Download PDF
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

