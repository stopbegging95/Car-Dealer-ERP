"use client";

import React from "react";
import { FiDownload } from "react-icons/fi";
import { Button, Table, Card } from "@/components/ui";

export interface CustomerDocument {
  name: string;
  type: string;
  date: string;
  size: string;
}

export interface DocumentVaultTabProps {
  documents: CustomerDocument[];
  onDownloadDoc?: (doc: CustomerDocument) => void;
}

export const DocumentVaultTab: React.FC<DocumentVaultTabProps> = ({ documents, onDownloadDoc }) => {
  return (
    <div className="space-y-4">
      <Card className="shadow-xs p-4 sm:p-5">
        <div>
          <h3 className="font-bold text-[#0F172A] text-base uppercase tracking-tight">
            Encrypted Vehicle Document Vault
          </h3>
          <p className="text-[#64748B] text-xs">
            Official title transfers, Single Goods Declarations (SGDs), and pre-delivery inspection health sheets.
          </p>
        </div>
      </Card>

      <Table
        data={documents}
        keyExtractor={(item) => item.name}
        pageSize={15}
        showSerialNumber={true}
        columns={[
          {
            key: "name",
            header: "Document Title",
            sortable: true,
            render: (doc) => (
              <span className="font-bold text-[#0F172A] text-xs">{doc.name}</span>
            ),
          },
          {
            key: "type",
            header: "Classification",
            sortable: true,
            render: (doc) => (
              <span className="font-medium text-[#475569] text-xs">{doc.type}</span>
            ),
          },
          {
            key: "date",
            header: "Issuance Date",
            sortable: true,
            render: (doc) => (
              <span className="font-mono text-[#64748B] text-xs">{doc.date}</span>
            ),
          },
          {
            key: "size",
            header: "File Size",
            render: (doc) => (
              <span className="font-mono text-[#64748B] text-xs">{doc.size}</span>
            ),
          },
          {
            key: "actions",
            header: "Action",
            render: (doc) => (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (onDownloadDoc) {
                    onDownloadDoc(doc);
                  }
                }}
                leftIcon={<FiDownload className="w-3.5 h-3.5 text-[#2563EB]" />}
              >
                Download PDF
              </Button>
            ),
          },
        ]}
      />
    </div>
  );
};
