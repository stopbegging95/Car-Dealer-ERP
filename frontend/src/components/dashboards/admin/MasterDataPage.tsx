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
  allowedCategories?: string[];
  title?: string;
  description?: string;
  defaultCategory?: string;
  headerBadge?: string;
}

interface CategoryMeta {
  singular: string;
  addBtnText: string;
  labelPrompt: string;
  labelPlaceholder: string;
  descPrompt: string;
  descPlaceholder: string;
}

const CATEGORY_META: Record<string, CategoryMeta> = {
  hubs: {
    singular: "Showroom Hub",
    addBtnText: "+ Add Showroom Hub",
    labelPrompt: "Showroom Hub & Allocation Facility Name",
    labelPlaceholder: "e.g. Victoria Island Flagship Showroom",
    descPrompt: "Facility Address & Regional Holding Bay Notes",
    descPlaceholder: "e.g. Flagship delivery center and private VIP appointments",
  },
  categories: {
    singular: "Vehicle Class",
    addBtnText: "+ Add Vehicle Class",
    labelPrompt: "Vehicle Specification Class Name",
    labelPlaceholder: "e.g. Executive Class / Ultra-Luxury Saloons",
    descPrompt: "Class Description & Showroom Filter Notes",
    descPlaceholder: "e.g. Long-wheelbase chauffeured executive sedans",
  },
  makes: {
    singular: "Vehicle Brand / Make",
    addBtnText: "+ Add Vehicle Brand",
    labelPrompt: "Automotive Manufacturer / Brand Name",
    labelPlaceholder: "e.g. Mercedes-Maybach / Aston Martin",
    descPrompt: "OEM Brand Notes & Warranty Specifications",
    descPlaceholder: "e.g. Certified German luxury marque",
  },
  ports: {
    singular: "Maritime Shipping Port",
    addBtnText: "+ Add Shipping Port",
    labelPrompt: "Port Name & Berth Terminal",
    labelPlaceholder: "e.g. Tin Can Island Container Terminal (TCIT), Lagos",
    descPrompt: "Port Country, Transit Zone & Clearance Terms",
    descPlaceholder: "e.g. Nigerian primary discharge berth with bonded terminal",
  },
  carriers: {
    singular: "Ocean Shipping Line",
    addBtnText: "+ Add Ocean Carrier",
    labelPrompt: "Shipping Carrier & Line Name",
    labelPlaceholder: "e.g. Grimaldi Deep Sea Ro-Ro / MSC Lines",
    descPrompt: "Vessel Type, Route Coverage & Service Contract",
    descPlaceholder: "e.g. Fortnightly Ro-Ro service Antwerp to Lagos",
  },
  suppliers: {
    singular: "Procurement Supplier",
    addBtnText: "+ Add Verified Supplier",
    labelPrompt: "Supplier Entity / International Auction House",
    labelPlaceholder: "e.g. Manheim Palm Beach Luxury Auctions",
    descPrompt: "Supplier Country, Quality Tier & Escrow Rating",
    descPlaceholder: "e.g. Tier 1 US wholesale auction desk with clean titles",
  },
  banks: {
    singular: "Settlement Bank",
    addBtnText: "+ Add Corporate Bank",
    labelPrompt: "Banking Institution & Account Designation",
    labelPlaceholder: "e.g. Zenith Bank Plc - Corporate Treasury Escrow",
    descPrompt: "Branch, Account Classification & Settlement Clearance",
    descPlaceholder: "e.g. Primary corporate operating account and sales wire clearing",
  },
  payment_channels: {
    singular: "Payment Channel",
    addBtnText: "+ Add Payment Channel",
    labelPrompt: "Payment Channel & Settlement Method",
    labelPlaceholder: "e.g. Direct Bank Wire Transfer (NIP / RTGS)",
    descPrompt: "Remittance Protocol & Accounting Ledger Binding",
    descPlaceholder: "e.g. Real-time gross settlement via central bank clearing",
  },
  inspection_centers: {
    singular: "Diagnostic Center",
    addBtnText: "+ Add Inspection Center",
    labelPrompt: "Diagnostic Center & PDI Bay Name",
    labelPlaceholder: "e.g. Victoria Island Flagship Diagnostic Center",
    descPrompt: "Facility Tooling & 150-Point QA Clearance Bays",
    descPlaceholder: "e.g. Hydraulic vehicle lifts, Xentry and Autel diagnostic bay",
  },
  sourcing_markets: {
    singular: "Sourcing Market",
    addBtnText: "+ Add Sourcing Market",
    labelPrompt: "International Sourcing Origin Market",
    labelPlaceholder: "e.g. Germany (Stuttgart / Munich / Frankfurt)",
    descPrompt: "Regional Trading Desks & Export Port Association",
    descPlaceholder: "e.g. European direct factory and dealer network sourcing",
  },
  departments: {
    singular: "Department / Desk",
    addBtnText: "+ Add Department",
    labelPrompt: "Dealership Functional Department Name",
    labelPlaceholder: "e.g. Import Logistics & Customs Clearance",
    descPrompt: "Operational Scope & Reporting Structure",
    descPlaceholder: "e.g. Manages port clearance, demurrage, and customs SGD tariffs",
  },
  dispute_categories: {
    singular: "Dispute Category",
    addBtnText: "+ Add Dispute Category",
    labelPrompt: "CRM Dispute & Complaint Ticket Category",
    labelPlaceholder: "e.g. Customs Documentation & Title Transfer",
    descPrompt: "Dispute SLA Window & Assigned Department Escalation",
    descPlaceholder: "e.g. Priority resolution for vehicle title and customs documentation",
  },
};

export const MasterDataPage: React.FC<MasterDataPageProps> = ({
  showToast,
  allowedCategories,
  title,
  description,
  defaultCategory,
  headerBadge,
}) => {
  const { categories, getOptions, addOption, updateOption, deleteOption, resetCategory } = useMasterData();

  const visibleCategories = useMemo(() => {
    if (!allowedCategories || allowedCategories.length === 0) return categories;
    const filtered = categories.filter((c) => allowedCategories.includes(c.key));
    return filtered.length > 0 ? filtered : categories;
  }, [categories, allowedCategories]);

  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>(() => {
    if (defaultCategory && visibleCategories.some((c) => c.key === defaultCategory)) {
      return defaultCategory;
    }
    return visibleCategories[0]?.key || "hubs";
  });

  // Keep selected category valid if visibleCategories changes
  React.useEffect(() => {
    if (!visibleCategories.some((c) => c.key === selectedCategoryKey)) {
      setSelectedCategoryKey(visibleCategories[0]?.key || "hubs");
    }
  }, [visibleCategories, selectedCategoryKey]);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<MasterOption | null>(null);
  const [optionToDelete, setOptionToDelete] = useState<MasterOption | null>(null);
  const [isResetConfirmModalOpen, setIsResetConfirmModalOpen] = useState(false);

  // Form states
  const [formLabel, setFormLabel] = useState("");
  const [formValue, setFormValue] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const activeCategory = useMemo(() => {
    return visibleCategories.find((c) => c.key === selectedCategoryKey) || visibleCategories[0] || categories[0];
  }, [visibleCategories, selectedCategoryKey, categories]);

  const activeMeta = useMemo(() => {
    return (
      CATEGORY_META[activeCategory.key] || {
        singular: activeCategory.name.replace(/s$/, ""),
        addBtnText: `+ Add New ${activeCategory.name.replace(/s$/, "")}`,
        labelPrompt: "Option Display Label",
        labelPlaceholder: `e.g. New ${activeCategory.name}`,
        descPrompt: "Description / Purpose Notes",
        descPlaceholder: "e.g. Operational notes for this option",
      }
    );
  }, [activeCategory]);

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

  const handleOpenDelete = (opt: MasterOption) => {
    setOptionToDelete(opt);
  };

  const handleConfirmDelete = () => {
    if (!optionToDelete) return;
    deleteOption(selectedCategoryKey, optionToDelete.id);
    if (showToast) {
      showToast(`Removed "${optionToDelete.label}" from ${activeCategory.name}.`);
    }
    setOptionToDelete(null);
  };

  const handleConfirmResetCategory = () => {
    resetCategory(selectedCategoryKey);
    setIsResetConfirmModalOpen(false);
    if (showToast) {
      showToast(`Reset ${activeCategory.name} to standard defaults.`);
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
          title={allowedCategories ? "Authorized Taxonomies" : "Master Data Taxonomies"}
          value={`${visibleCategories.length} Categories`}
          change={allowedCategories ? "Scoped Department Access" : "Dealership Data Schemas"}
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
        {/* Header Strip */}
        <div className="pb-3 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-[#2563EB] text-base uppercase tracking-wider flex items-center gap-2">
              <FiDatabase className="w-4 h-4" />
              <span>{title || "Master Data & Dropdown Options Management"}</span>
            </h3>
            {headerBadge && (
              <Badge variant="gold" size="sm">
                {headerBadge}
              </Badge>
            )}
          </div>
          <p className="text-[#64748B] text-xs mt-1">
            {description || "Centrally create, modify, and delete dropdown data options used across ERP dashboards and intake modals."}
          </p>
        </div>

        {/* Category Selector Tabs Strip */}
        {visibleCategories.length > 1 && (
          <div className="overflow-x-auto pb-1">
            <div className="flex items-center gap-1.5 p-1 bg-[#F1F5F9] border border-[#CBD5E1] rounded-xl w-max">
              {visibleCategories.map((cat) => {
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
        )}

        {/* Dedicated Active Tab Control & Action Strip */}
        <div className="p-3.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-[#1D4ED8] uppercase text-xs">
                Active Tab: {activeCategory.name}
              </span>
              <span className="font-mono text-[11px] bg-[#FFFFFF] text-[#2563EB] px-2 py-0.5 rounded border border-[#BFDBFE] font-bold">
                {activeOptions.length} Options
              </span>
              <Badge variant="gold" size="sm">
                Live Shared Across Dealership
              </Badge>
            </div>
            <p className="text-[#3B82F6] text-xs">
              {activeCategory.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsResetConfirmModalOpen(true)}
              leftIcon={<FiRefreshCw className="w-3.5 h-3.5" />}
              className="text-xs bg-white hover:bg-slate-50"
              title={`Reset ${activeCategory.name} to standard defaults`}
            >
              Reset Defaults
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenAdd}
              leftIcon={<FiPlus className="w-3.5 h-3.5 text-white" />}
              className="text-xs font-bold shadow-sm"
              title={`Create new option for ${activeCategory.name}`}
            >
              {activeMeta.addBtnText}
            </Button>
          </div>
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
                    onClick={() => handleOpenDelete(opt)}
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

      {/* Modal: Create New Master Option (Tailored to Active Category) */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        size="md"
        title={`Create New ${activeMeta.singular}`}
        description={`Add a new ${activeMeta.singular} to "${activeCategory.name}". This option will immediately become selectable across all dealership forms and intake modals.`}
        footer={
          <>
            <Button variant="outline" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" form="add-master-option-form" leftIcon={<FiCheck />}>
              Save {activeMeta.singular}
            </Button>
          </>
        }
      >
        <form id="add-master-option-form" onSubmit={handleSaveAdd} className="space-y-3">
          <Input
            label={activeMeta.labelPrompt}
            placeholder={activeMeta.labelPlaceholder}
            value={formLabel}
            onChange={(e) => setFormLabel(e.target.value)}
            required
            autoFocus
          />
          <Input
            label="Internal System Value / Key (Optional)"
            placeholder="Defaults to label if left blank"
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            helperText="The programmatic key stored in records and database columns."
          />
          <Input
            label={activeMeta.descPrompt}
            placeholder={activeMeta.descPlaceholder}
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
          title={`Edit ${activeMeta.singular}: ${editingOption.label}`}
          description={`Update details for this ${activeMeta.singular} in "${activeCategory.name}".`}
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

      {/* Modal: Confirm Delete Master Option */}
      {optionToDelete && (
        <Modal
          isOpen={!!optionToDelete}
          onClose={() => setOptionToDelete(null)}
          size="sm"
          title="Confirm Option Deletion"
          description={`Permanently remove this entry from ${activeCategory.name}.`}
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button variant="outline" size="sm" type="button" onClick={() => setOptionToDelete(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="button"
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
                leftIcon={<FiTrash2 className="w-3.5 h-3.5 text-white" />}
              >
                Delete Option
              </Button>
            </div>
          }
        >
          <div className="space-y-3 text-xs text-[#475569]">
            <p>
              Are you sure you want to delete <strong className="text-[#0F172A]">&quot;{optionToDelete.label}&quot;</strong> from <strong>{activeCategory.name}</strong>?
            </p>
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-[11px] text-red-800">
              This option will no longer appear in intake dropdowns across the ERP system.
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Confirm Reset Category */}
      <Modal
        isOpen={isResetConfirmModalOpen}
        onClose={() => setIsResetConfirmModalOpen(false)}
        size="sm"
        title={`Reset ${activeCategory.name}`}
        description="Restore factory dealership defaults."
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsResetConfirmModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="button"
              onClick={handleConfirmResetCategory}
              className="bg-amber-600 hover:bg-amber-700 text-white"
              leftIcon={<FiRefreshCw className="w-3.5 h-3.5 text-white" />}
            >
              Reset to Factory Defaults
            </Button>
          </div>
        }
      >
        <div className="space-y-3 text-xs text-[#475569]">
          <p>
            Are you sure you want to reset <strong className="text-[#0F172A]">{activeCategory.name}</strong> back to factory defaults?
          </p>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800">
            All custom options created for this category will be cleared and replaced with the original system presets.
          </div>
        </div>
      </Modal>
    </div>
  );
};

export const TaxonomyManagerSection = MasterDataPage;


