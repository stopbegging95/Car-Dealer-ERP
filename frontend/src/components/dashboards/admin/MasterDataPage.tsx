"use client";

import React, { useState, useMemo } from "react";
import {
  FiDatabase,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiCheck,
  FiCheckCircle,
  FiSliders,
  FiLayers,
  FiBox,
} from "react-icons/fi";
import { Button, Badge, Card, KPICard, Table, Modal, Input } from "@/components/ui";
import { useMasterData, MASTER_CATEGORIES, MasterOption } from "@/context/MasterDataContext";

export interface MasterDataPageProps {
  showToast?: (msg: string) => void;
}

export const MasterDataPage: React.FC<MasterDataPageProps> = ({ showToast }) => {
  const { categories, getOptions, addOption, updateOption, deleteOption, resetCategory } = useMasterData();
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>("hubs");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<MasterOption | null>(null);

  // Form states
  const [formLabel, setFormLabel] = useState("");
  const [formValue, setFormValue] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const activeCategory = useMemo(() => {
    return categories.find((c) => c.key === selectedCategoryKey) || categories[0];
  }, [categories, selectedCategoryKey]);

  const activeOptions = useMemo(() => {
    return getOptions(selectedCategoryKey);
  }, [getOptions, selectedCategoryKey]);

  const handleOpenAdd = () => {
    setFormLabel("");
    setFormValue("");
    setFormDescription("");
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (opt: MasterOption) => {
    setEditingOption(opt);
    setFormLabel(opt.label);
    setFormValue(opt.value);
    setFormDescription(opt.description || "");
    setIsEditModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formLabel.trim()) return;

    const created = addOption(selectedCategoryKey, {
      label: formLabel.trim(),
      value: formValue.trim() || undefined,
      description: formDescription.trim() || undefined,
    });

    setIsAddModalOpen(false);
    if (showToast) {
      showToast(`Created new option "${created.label}" in ${activeCategory.name}.`);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOption || !formLabel.trim()) return;

    updateOption(selectedCategoryKey, editingOption.id, {
      label: formLabel.trim(),
      value: formValue.trim() || formLabel.trim(),
      description: formDescription.trim() || undefined,
    });

    setIsEditModalOpen(false);
    if (showToast) {
      showToast(`Updated option "${formLabel.trim()}" in ${activeCategory.name}.`);
    }
  };

  const handleDelete = (opt: MasterOption) => {
    if (confirm(`Are you sure you want to delete "${opt.label}" from ${activeCategory.name}?`)) {
      deleteOption(selectedCategoryKey, opt.id);
      if (showToast) {
        showToast(`Removed "${opt.label}" from ${activeCategory.name}.`);
      }
    }
  };

  const handleResetCategory = () => {
    if (confirm(`Reset ${activeCategory.name} back to factory dealership defaults?`)) {
      resetCategory(selectedCategoryKey);
      if (showToast) {
        showToast(`Reset ${activeCategory.name} to standard defaults.`);
      }
    }
  };

  const customOptionsCount = activeOptions.filter(
    (o) => !activeCategory.defaultOptions.some((d) => d.value === o.value)
  ).length;

  return (
    <div className="space-y-4">
      {/* Top Taxonomy Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <KPICard
          title="Master Data Taxonomies"
          value={`${categories.length} Categories`}
          change="Dealership Data Schemas"
          icon={<FiDatabase className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Active Category Options"
          value={`${activeOptions.length} Entries`}
          change={activeCategory.name}
          icon={<FiSliders className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Custom Created Options"
          value={`${customOptionsCount} Custom`}
          change="Persistent in Storage"
          icon={<FiPlus className="w-5 h-5 text-emerald-600" />}
        />
        <KPICard
          title="Data Synchronization"
          value="100% Synced"
          change="Available Across Desks"
          icon={<FiCheckCircle className="w-5 h-5 text-[#2563EB]" />}
        />
      </div>

      {/* Main Container with Category Navigation & CRUD Table */}
      <Card className="p-4 sm:p-5 shadow-xs space-y-4">
        {/* Header Strip with Action Controls */}
        <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-3 pb-3 border-b border-[#E2E8F0]">
          <div>
            <h3 className="font-bold text-[#2563EB] text-base uppercase tracking-wider flex items-center gap-2">
              <FiDatabase className="w-4 h-4" />
              <span>Master Data & Dropdown Options Management</span>
            </h3>
            <p className="text-[#64748B] text-xs">
              Centrally create, modify, and delete dropdown data options used across ERP dashboards and intake modals.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetCategory}
              leftIcon={<FiRefreshCw className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Reset Category
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenAdd}
              leftIcon={<FiPlus className="w-3.5 h-3.5" />}
              className="text-xs font-bold"
            >
              + Create New Option
            </Button>
          </div>
        </div>

        {/* Category Selector Tabs Strip */}
        <div className="overflow-x-auto pb-1">
          <div className="flex items-center gap-1.5 p-1 bg-[#F1F5F9] border border-[#CBD5E1] rounded-xl w-max">
            {categories.map((cat) => {
              const isSelected = cat.key === selectedCategoryKey;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setSelectedCategoryKey(cat.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? "bg-[#2563EB] text-[#FFFFFF] shadow-sm"
                      : "text-[#475569] hover:bg-[#E2E8F0] hover:text-[#0F172A]"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Category Description Notice */}
        <div className="p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl flex sm:flex-row flex-col justify-between sm:items-center gap-2 text-xs">
          <div>
            <span className="font-bold text-[#1D4ED8] uppercase text-[11px] block">
              Managing: {activeCategory.name} ({activeOptions.length} Options)
            </span>
            <span className="text-[#3B82F6]">{activeCategory.description}</span>
          </div>
          <Badge variant="gold" size="sm">
            Live Shared Across All Modules
          </Badge>
        </div>

        {/* Standard Reusable Table with S/N, 15 Pagination, Filter Search & Toggle */}
        <Table
          data={activeOptions}
          keyExtractor={(opt) => opt.id}
          pageSize={15}
          showSerialNumber={true}
          searchable={true}
          filterPlaceholder={`Search options in ${activeCategory.name}...`}
          collapsible={true}
          columns={[
            {
              key: "label",
              header: "Option Display Label",
              sortable: true,
              render: (opt) => (
                <div>
                  <span className="font-bold text-[#0F172A] text-xs">{opt.label}</span>
                  {opt.description && (
                    <span className="block text-[10px] text-[#64748B]">{opt.description}</span>
                  )}
                </div>
              ),
            },
            {
              key: "value",
              header: "Internal System Value / Code",
              sortable: true,
              render: (opt) => (
                <span className="font-mono text-xs font-semibold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
                  {opt.value}
                </span>
              ),
            },
            {
              key: "type",
              header: "Provenance Type",
              render: (opt) => {
                const isDefault = activeCategory.defaultOptions.some((d) => d.value === opt.value);
                return isDefault ? (
                  <Badge variant="charcoal" size="sm">
                    System Preset
                  </Badge>
                ) : (
                  <Badge variant="gold" size="sm">
                    Custom Dynamic
                  </Badge>
                );
              },
            },
            {
              key: "actions",
              header: "Actions",
              align: "right",
              render: (opt) => (
                <div className="flex items-center justify-end gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(opt)}
                    className="px-2 py-1 text-xs"
                    leftIcon={<FiEdit2 className="w-3 h-3 text-[#2563EB]" />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(opt)}
                    className="px-2 py-1 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                    leftIcon={<FiTrash2 className="w-3 h-3 text-rose-500" />}
                  >
                    Delete
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </Card>

      {/* Modal: Create New Master Option */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        size="md"
        title={`Add New ${activeCategory.name.replace(/s$/, "")}`}
        description={`This option will immediately become available in all dropdowns linked to ${activeCategory.name}.`}
        footer={
          <>
            <Button variant="outline" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" form="add-master-option-form" leftIcon={<FiCheck />}>
              Save Option
            </Button>
          </>
        }
      >
        <form id="add-master-option-form" onSubmit={handleSaveAdd} className="space-y-3">
          <Input
            label="Display Label"
            placeholder="e.g. Victoria Island Performance Hub"
            value={formLabel}
            onChange={(e) => setFormLabel(e.target.value)}
            required
            autoFocus
          />
          <Input
            label="Internal Value / Key (Optional)"
            placeholder="Defaults to label if left blank"
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            helperText="The programmatic key stored in records and database columns."
          />
          <Input
            label="Description / Purpose Notes"
            placeholder="e.g. Primary facility for delivery inspections"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
          />
        </form>
      </Modal>

      {/* Modal: Edit Existing Master Option */}
      {editingOption && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          size="md"
          title={`Edit Option: ${editingOption.label}`}
          description={`Update details for this ${activeCategory.name.replace(/s$/, "")}.`}
          footer={
            <>
              <Button variant="outline" size="sm" type="button" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" form="edit-master-option-form" leftIcon={<FiCheck />}>
                Update Option
              </Button>
            </>
          }
        >
          <form id="edit-master-option-form" onSubmit={handleSaveEdit} className="space-y-3">
            <Input
              label="Display Label"
              value={formLabel}
              onChange={(e) => setFormLabel(e.target.value)}
              required
              autoFocus
            />
            <Input
              label="Internal Value / Key"
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              required
            />
            <Input
              label="Description / Notes"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
            />
          </form>
        </Modal>
      )}
    </div>
  );
};

