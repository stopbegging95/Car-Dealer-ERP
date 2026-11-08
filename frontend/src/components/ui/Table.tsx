"use client";

import React, { useState, useMemo, useEffect } from "react";

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  className?: string;
  render?: (row: T, index: number) => React.ReactNode;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string | number;
  isLoading?: boolean;
  emptyMessage?: string;
  pageSize?: number;
  showSerialNumber?: boolean;
  exportable?: boolean;
  exportFileName?: string;
  title?: string;
  searchable?: boolean;
  filterPlaceholder?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  customFilter?: (item: T, query: string) => boolean;
  pagination?: {
    currentPage: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
  };
  onRowClick?: (item: T) => void;
  className?: string;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyMessage = "No records found",
  pageSize = 15,
  showSerialNumber = true,
  exportable = true,
  exportFileName = "erp_records_export",
  title,
  searchable = true,
  filterPlaceholder = "Filter table records...",
  collapsible = true,
  defaultCollapsed = false,
  customFilter,
  pagination,
  onRowClick,
  className = "",
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [internalPage, setInternalPage] = useState<number>(1);
  const [filterQuery, setFilterQuery] = useState<string>("");
  const [isSectionOpen, setIsSectionOpen] = useState<boolean>(!defaultCollapsed);

  // Reset internal page if data length or filterQuery changes
  useEffect(() => {
    setInternalPage(1);
  }, [data.length, filterQuery]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  // Filter data across all visible columns and primitive properties
  const filteredData = useMemo(() => {
    if (!filterQuery.trim()) return data;
    const query = filterQuery.toLowerCase().trim();

    return data.filter((item: T) => {
      if (customFilter) {
        return customFilter(item, query);
      }
      const record = item as Record<string, unknown>;
      // First check defined column keys
      for (const col of columns) {
        if (col.key === "actions" || col.key === "action" || col.key === "__sn") continue;
        const val = record[col.key];
        if (val != null && String(val).toLowerCase().includes(query)) {
          return true;
        }
      }
      // Also search any other primitive value in the record
      return Object.entries(record).some(([k, v]) => {
        if (k === "image" || k === "images" || k === "avatar" || v == null) return false;
        if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
          return String(v).toLowerCase().includes(query);
        }
        return false;
      });
    });
  }, [data, filterQuery, customFilter, columns]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a: T, b: T) => {
      const recordA = a as Record<string, unknown>;
      const recordB = b as Record<string, unknown>;
      const valA = recordA[sortKey];
      const valB = recordB[sortKey];
      if (valA === valB) return 0;
      if (valA == null) return 1;
      if (valB == null) return -1;
      if (typeof valA === "number" && typeof valB === "number") {
        return sortDirection === "asc" ? valA - valB : valB - valA;
      }
      return sortDirection === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [filteredData, sortKey, sortDirection]);

  // Determine active pagination parameters
  const isExternalPagination = Boolean(pagination) && !filterQuery.trim();
  const activePageSize = pagination?.pageSize ?? pageSize;
  const totalItems = isExternalPagination
    ? (pagination?.totalItems ?? sortedData.length)
    : sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / activePageSize));
  const rawPage = isExternalPagination
    ? (pagination?.currentPage ?? internalPage)
    : internalPage;
  const activePage = Math.min(Math.max(1, rawPage), totalPages);

  const handlePageChange = (newPage: number) => {
    const targetPage = Math.min(Math.max(1, newPage), totalPages);
    if (isExternalPagination && pagination) {
      pagination.onPageChange(targetPage);
    } else {
      setInternalPage(targetPage);
    }
  };

  // Compute sliced display data
  const displayData = useMemo(() => {
    if (isExternalPagination && sortedData.length < totalItems) {
      return sortedData;
    }
    const startIndex = (activePage - 1) * activePageSize;
    return sortedData.slice(startIndex, startIndex + activePageSize);
  }, [isExternalPagination, sortedData, totalItems, activePage, activePageSize]);

  // Effective columns with automatic Serial Number (S/N) prepend
  const effectiveColumns = useMemo(() => {
    if (!showSerialNumber) return columns;
    const hasSN = columns.some(
      (c) =>
        c.key.toLowerCase() === "sn" ||
        c.key.toLowerCase() === "s/n" ||
        c.key.toLowerCase() === "__sn" ||
        c.header.trim().toLowerCase() === "s/n"
    );
    if (hasSN) return columns;

    const snColumn: Column<T> = {
      key: "__sn",
      header: "S/N",
      align: "center",
      className: "w-14 text-center font-mono font-bold text-[#64748B]",
      render: (_row: T, index: number) => {
        const serialNumber = (activePage - 1) * activePageSize + index + 1;
        return (
          <span className="font-mono text-xs font-semibold text-[#64748B]">
            {serialNumber}
          </span>
        );
      },
    };
    return [snColumn, ...columns];
  }, [columns, showSerialNumber, activePage, activePageSize]);

  const handleExportCSV = () => {
    const exportCols = effectiveColumns.filter(
      (c) => c.key !== "actions" && c.key !== "action"
    );
    const headers = exportCols.map((c) => `"${c.header}"`).join(",");
    const rows = sortedData.map((row, idx) => {
      return exportCols
        .map((col) => {
          if (col.key === "__sn") return idx + 1;
          const val = (row as Record<string, unknown>)[col.key];
          if (val == null) return '""';
          const str = String(val).replace(/"/g, '""');
          return `"${str}"`;
        })
        .join(",");
    });
    const csvContent =
      "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `${exportFileName}_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={`w-full flex flex-col bg-[#FFFFFF] border border-[#CBD5E1] rounded-md overflow-hidden shadow-xs transition-all ${className}`}
    >
      {/* Top Table Control Strip: Title/Badges, Search Filter, CSV Export & Section Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-3.5 py-2.5 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2 flex-wrap">
          {title && (
            <span className="font-bold text-xs uppercase tracking-wider text-[#0F172A]">
              {title}
            </span>
          )}
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
            {filteredData.length} {filteredData.length === 1 ? "entry" : "entries"}
          </span>
          {filterQuery && (
            <span className="text-[11px] text-[#64748B] flex items-center gap-1">
              <span>(filtered from {data.length})</span>
              <button
                type="button"
                onClick={() => setFilterQuery("")}
                className="text-[#2563EB] hover:underline font-semibold text-[10px] ml-1 cursor-pointer"
              >
                Reset
              </button>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap self-end sm:self-auto">
          {searchable && (
            <div className="relative flex items-center">
              <svg
                className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder={filterPlaceholder}
                className="pl-8 pr-7 py-1 text-xs bg-[#FFFFFF] border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] text-[#0F172A] w-36 sm:w-48 transition-all shadow-xs"
              />
              {filterQuery && (
                <button
                  type="button"
                  onClick={() => setFilterQuery("")}
                  className="absolute right-2 text-[#94A3B8] hover:text-[#0F172A] text-xs font-bold cursor-pointer"
                  title="Clear filter"
                >
                  &times;
                </button>
              )}
            </div>
          )}

          {exportable && isSectionOpen && (
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-[11px] font-semibold text-[#2563EB] hover:bg-[#EFF6FF] hover:border-[#2563EB] transition-all shadow-xs cursor-pointer shrink-0"
              title="Download filtered records as CSV"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span className="hidden sm:inline">Export</span> CSV
            </button>
          )}

          {collapsible && (
            <button
              type="button"
              onClick={() => setIsSectionOpen((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-[11px] font-semibold text-[#475569] hover:text-[#2563EB] hover:border-[#2563EB] transition-all shadow-xs cursor-pointer shrink-0"
              title={
                isSectionOpen
                  ? "Collapse entire table section"
                  : "Expand entire table section"
              }
            >
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isSectionOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              <span>{isSectionOpen ? "Collapse Table" : "Expand Table"}</span>
            </button>
          )}
        </div>
      </div>

      {/* When Table Section is Collapsed */}
      {!isSectionOpen && (
        <div className="px-4 py-3 bg-[#F8FAFC] flex items-center justify-between text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
            <span className="italic">
              Table section collapsed ({filteredData.length} records hidden). Click &ldquo;Expand Table&rdquo; to view full tabular data.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsSectionOpen(true)}
            className="text-[#2563EB] font-bold hover:underline cursor-pointer text-xs flex items-center gap-1"
          >
            <span>Show Table Section</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}

      {/* When Table Section is Expanded */}
      {isSectionOpen && (
        <>
          {/* Responsive Horizontal Scroll Container */}
          <div className="w-full overflow-x-auto scrollbar-thin">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  {effectiveColumns.map((col, colIndex) => {
                    const isSorted = sortKey === col.key;
                    const alignClass =
                      col.align === "right"
                        ? "text-right"
                        : col.align === "center"
                        ? "text-center"
                        : "text-left";

                    return (
                      <th
                        key={`${col.key}-${colIndex}`}
                        onClick={() => col.sortable && handleSort(col.key)}
                        className={`py-3.5 px-3 sm:px-4 whitespace-nowrap ${alignClass} ${
                          col.sortable
                            ? "cursor-pointer select-none hover:text-[#2563EB]"
                            : ""
                        } ${col.className || ""}`}
                      >
                        <div
                          className={`inline-flex items-center gap-1.5 ${
                            col.align === "right"
                              ? "justify-end"
                              : col.align === "center"
                              ? "justify-center"
                              : ""
                          }`}
                        >
                          <span className={isSorted ? "text-[#2563EB] font-bold" : ""}>
                            {col.header}
                          </span>
                          {col.sortable && (
                            <svg
                              className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                                isSorted ? "text-[#2563EB]" : "text-[#94A3B8]"
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              {isSorted && sortDirection === "desc" ? (
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2.5"
                                  d="M19 9l-7 7-7-7"
                                />
                              ) : isSorted && sortDirection === "asc" ? (
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2.5"
                                  d="M5 15l7-7 7 7"
                                />
                              ) : (
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                                />
                              )}
                            </svg>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F1F5F9] text-xs sm:text-sm text-[#334155]">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {effectiveColumns.map((col, colIndex) => (
                        <td
                          key={`${col.key}-${colIndex}`}
                          className="py-3.5 px-3 sm:px-4 whitespace-nowrap"
                        >
                          <div className="h-4 bg-slate-200 rounded w-3/4" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : displayData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={effectiveColumns.length}
                      className="py-10 text-center text-[#94A3B8] italic text-xs sm:text-sm"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <span>
                          {filterQuery
                            ? `No records matching "${filterQuery}"`
                            : emptyMessage}
                        </span>
                        {filterQuery && (
                          <button
                            type="button"
                            onClick={() => setFilterQuery("")}
                            className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
                          >
                            Reset Filter
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  displayData.map((row, index) => {
                    const key = keyExtractor(row, index);
                    return (
                      <tr
                        key={key}
                        onClick={() => onRowClick && onRowClick(row)}
                        className={`transition-colors duration-150 ${
                          index % 2 === 0 ? "bg-[#FFFFFF]" : "bg-[#F8FAFC]/50"
                        } ${
                          onRowClick
                            ? "cursor-pointer hover:bg-[#EFF6FF]"
                            : "hover:bg-[#F8FAFC]"
                        }`}
                      >
                        {effectiveColumns.map((col, colIndex) => {
                          const alignClass =
                            col.align === "right"
                              ? "text-right"
                              : col.align === "center"
                              ? "text-center"
                              : "text-left";

                          return (
                            <td
                              key={`${col.key}-${colIndex}`}
                              className={`py-3 px-3 sm:px-4 text-xs sm:text-sm whitespace-nowrap ${alignClass} ${
                                col.className || ""
                              }`}
                            >
                              {col.render
                                ? col.render(row, index)
                                : (row as Record<string, unknown>)[col.key] != null
                                ? String((row as Record<string, unknown>)[col.key])
                                : "-"}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar - strictly 15 items per page with S/N support */}
          {totalItems > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0] text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[#64748B] text-center sm:text-left">
                  Showing{" "}
                  <span className="font-semibold text-[#0F172A]">
                    {(activePage - 1) * activePageSize + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-[#0F172A]">
                    {Math.min(activePage * activePageSize, totalItems)}
                  </span>{" "}
                  of <span className="font-bold text-[#2563EB]">{totalItems}</span> entries
                </span>

                {exportable && totalItems > 0 && (
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-[11px] font-semibold text-[#2563EB] hover:bg-[#EFF6FF] hover:border-[#2563EB] transition-all shadow-xs cursor-pointer"
                    title="Download table records as CSV"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    <span>Export CSV</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={activePage <= 1}
                  onClick={() => handlePageChange(activePage - 1)}
                  className="p-1.5 rounded-md border border-[#CBD5E1] bg-[#FFFFFF] text-[#0F172A] hover:border-[#2563EB] hover:text-[#2563EB] disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
                  title="Previous Page"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <span className="px-3 py-1 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-[#2563EB] font-mono font-bold shadow-xs">
                  Page {activePage} of {totalPages}
                </span>

                <button
                  disabled={activePage >= totalPages}
                  onClick={() => handlePageChange(activePage + 1)}
                  className="p-1.5 rounded-md border border-[#CBD5E1] bg-[#FFFFFF] text-[#0F172A] hover:border-[#2563EB] hover:text-[#2563EB] disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
                  title="Next Page"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
