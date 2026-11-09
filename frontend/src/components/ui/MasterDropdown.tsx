"use client";

import React, { useState, useMemo } from "react";
import { FiPlus, FiCheck, FiX } from "react-icons/fi";
import { Dropdown } from "./Dropdown";
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
  allowInlineCreate = false,
  className = "",
  helperText,
  error,
  onOptionCreated,
}) => {
  const { getOptions, addOption, getCategoryDef } = useMasterData();

  // Quick Create modal state (only if explicitly enabled)
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const categoryDef = getCategoryDef(category);
  const options = getOptions(category);
  const categoryDisplayName = categoryDef?.name || category;

  const handleQuickCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    const created = addOption(category, {
      label: newLabel.trim(),
      description: newDescription.trim() || undefined,
    });

    onChange(created.value);
    if (onOptionCreated) onOptionCreated(created.value);

    setNewLabel("");
    setNewDescription("");
    setIsQuickCreateOpen(false);
  };

  const dropdownOptions = useMemo(() => {
    return options.map((opt) => ({
      label: opt.label,
      value: opt.value,
    }));
  }, [options]);

  return (
    <div className={`space-y-1 ${className}`}>
      {/* Label & Optional Quick Create */}
      <div className="flex items-center justify-between pb-0.5 gap-2 flex-wrap">
        {label ? (
          <label className="block text-xs font-semibold text-[#0F172A]">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        ) : (
          <span />
        )}

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

      <Dropdown
        placeholder={placeholder}
        options={dropdownOptions}
        value={value}
        onChange={(val) => onChange(String(val))}
        disabled={disabled}
        error={error}
        helperText={helperText}
        searchable={options.length > 6}
      />

      {/* Quick Add Modal */}
      {isQuickCreateOpen && (
        <Modal
          isOpen={isQuickCreateOpen}
          onClose={() => setIsQuickCreateOpen(false)}
          size="sm"
          title={`Add to ${categoryDisplayName}`}
          description={`Add a new option to ${categoryDisplayName}. It will immediately sync and be available across all dealership modules.`}
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setIsQuickCreateOpen(false)}
                leftIcon={<FiX className="w-3.5 h-3.5" />}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                form={`quick-create-form-${category}`}
                leftIcon={<FiCheck className="w-3.5 h-3.5 text-white" />}
              >
                Add & Select
              </Button>
            </div>
          }
        >
          <form
            id={`quick-create-form-${category}`}
            onSubmit={handleQuickCreate}
            className="space-y-3 text-xs"
          >
            <Input
              label="Option Name / Label"
              placeholder={`e.g. New ${categoryDisplayName.replace(/s$/, "")}`}
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              required
              autoFocus
            />
            <Input
              label="Notes / Description (Optional)"
              placeholder="e.g. Special routing or handling notes"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </form>
        </Modal>
      )}
    </div>
  );
};
