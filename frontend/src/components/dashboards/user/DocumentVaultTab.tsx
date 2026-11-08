"use client";

import React from "react";
import { FiFileText, FiDownload } from "react-icons/fi";
import { Button } from "@/components/ui";

export interface CustomerDocument {
  name: string;
  type: string;
  date: string;
  size: string;
}

export interface DocumentVaultTabProps {
  documents: CustomerDocument[];
}

export const DocumentVaultTab: React.FC<DocumentVaultTabProps> = ({ documents }) => {
  return (
    <div className="space-y-4 bg-[#FFFFFF] shadow-sm p-4 sm:p-5 border border-[#E2E8F0] rounded-2xl">
      <div>
        <h3 className="font-bold text-[#0F172A] text-base uppercase tracking-tight">
          Encrypted Vehicle Document Vault
        </h3>
        <p className="text-[#64748B] text-xs">
          Official title transfers, Single Goods Declarations (SGDs), and pre-delivery inspection health sheets.
        </p>
      </div>

      <div className="space-y-2.5">
        {documents.map((doc, idx) => (
          <div
            key={idx}
            className="flex sm:flex-row flex-col justify-between sm:items-center gap-3 bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-xl"
          >
            <div className="flex items-start gap-3">
              <div className="bg-[#EFF6FF] p-2 border border-[#BFDBFE] rounded-lg text-[#2563EB] shrink-0">
                <FiFileText className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-[#0F172A] text-xs">{doc.name}</h4>
                <span className="block text-[#64748B] text-[10px]">
                  {doc.type} &bull; {doc.date} &bull; {doc.size}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => alert(`Downloading ${doc.name}...`)}
              leftIcon={<FiDownload className="w-3.5 h-3.5" />}
            >
              Download PDF
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

