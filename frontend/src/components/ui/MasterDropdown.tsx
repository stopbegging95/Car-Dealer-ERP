"use client";

import React, { useState } from "react";
import { FiPlus, FiCheck, FiX, FiDatabase } from "react-icons/fi";
import { Dropdown, DropdownOption } from "./Dropdown";
import { Modal } from "./Modal";
import { Input } from "./Input";
import { Button } from "./Button";
import { useMasterData } from "@/context/MasterDataContext";

export interface MasterDropdownProps {
  category: string;
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  allowInlineCreate?: boolean;
  className?: string;
  helperText?: string;
  error?: string;
  onOptionCreated?: (newVal: string) => void;
}

export const MasterDropdown: React.FC<MasterDropdownProps> = ({
  category,
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  placeholder = "Select an option...",
  allowInlineCreate = true,
  className = "",
  helperText,
  error,
  onOptionCreated,
}) => {
  const { getOptions, addOption, getCategoryDef } = useMasterData();
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [localFeedback, setLocalFeedback] = useState<string | null>(null);

  const categoryDef = getCategoryDef(category);
  const options = getOptions(category);

  const handleQuickCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    const created = addOption(category, {
      label: newLabel.trim(),
      description: newDescription.trim() || undefined,
    });

    onChange(created.value);
    if (onOptionCreated) onOptionCreated(created.value);

    setLocalFeedback(`Added "${created.label}"!`);
    setTimeout(() => setLocalFeedback(null), 3000);

    setNewLabel("");
    setNewDescription("");
    setIsQuickCreateOpen(false);
  };

  const categoryDisplayName = categoryDef?.name || category;

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <div className="flex items-center justify-between pb-0.5">
          <label className="block text-xs font-semibold text-[#0F172A]">
            {label} {required && <span className="text-red-500">*</span>}
          </label>

          {allowInlineCreate && (
            <button
              type="button"
              onClick={() => setIsQuickCreateOpen(true)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2563EB] hover:text-[#1D4ED8] transition-colors cursor-pointer group"
              title={`Add new option to ${categoryDisplayName}`}
            >
              <FiPlus className="w-3 h-3 group-hover:scale-110 transition-transform" />
              <span>+ Add New</span>
            </button>
          )}
        </div>
      )}

      {localFeedback && (
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 animate-in fade-in duration-150">
          <FiCheck className="w-3 h-3 text-emerald-600 shrink-0" />
          <span>{localFeedback}</span>
        </div>
      )}

      <Dropdown
        options={options as DropdownOption[]}
        value={value}
        onChange={(val) => onChange(String(val))}
        disabled={disabled}
        placeholder={placeholder}
        helperText={helperText}
        error={error}
      />

      {/* In-Place Quick Create Modal */}
      <Modal
        isOpen={isQuickCreateOpen}
        onClose={() => setIsQuickCreateOpen(false)}
        size="sm"
        title={`Add New ${categoryDef ? categoryDef.name.replace(/s$/, "") : "Option"}`}
        description={`This will create a new dynamic option and save it across all dashboards that use ${categoryDisplayName}.`}
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setIsQuickCreateOpen(false)}
              leftIcon={<FiX className="w-3.5 h-3.5 text-[#64748B]" />}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              form={`quick-create-form-${category}`}
              leftIcon={<FiCheck className="w-3.5 h-3.5 text-[#FFFFFF]" />}
            >
              Save & Select
            </Button>
          </>
        }
      >
        <form id={`quick-create-form-${category}`} onSubmit={handleQuickCreate} className="space-y-3">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-xs text-[#1D4ED8]">
            <FiDatabase className="w-4 h-4 shrink-0" />
            <span>Option will be saved to Dealership Master Taxonomies.</span>
          </div>

          <Input
            label="Option Name / Label"
            placeholder={`e.g. New ${categoryDisplayName}`}
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            required
            autoFocus
          />

          <Input
            label="Optional Description / Notes"
            placeholder="e.g. Specific facility details or specifications"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
        </form>
      </Modal>
    </div>
  );
};

