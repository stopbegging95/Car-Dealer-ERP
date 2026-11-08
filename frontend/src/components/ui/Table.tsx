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
  pagination,
  onRowClick,
  className = "",
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [internalPage, setInternalPage] = useState<number>(1);

  // Reset internal page if data length changes drastically
  useEffect(() => {
    setInternalPage(1);
  }, [data.length]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a: T, b: T) => {
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
  }, [data, sortKey, sortDirection]);

  // Determine active pagination parameters (external or internal)
  const isExternalPagination = Boolean(pagination);
  const activePageSize = pagination?.pageSize ?? pageSize;
  const totalItems = pagination?.totalItems ?? sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / activePageSize));
  const rawPage = pagination?.currentPage ?? internalPage;
  const activePage = Math.min(Math.max(1, rawPage), totalPages);

  const handlePageChange = (newPage: number) => {
    const targetPage = Math.min(Math.max(1, newPage), totalPages);
    if (pagination) {
      pagination.onPageChange(targetPage);
    } else {
      setInternalPage(targetPage);
    }
  };

  // Compute sliced display data if data contains full records
  const displayData = useMemo(() => {
    if (isExternalPagination && sortedData.length < totalItems) {
      // Caller has already sliced data server-side
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
    const exportCols = effectiveColumns.filter((c) => c.key !== "actions" && c.key !== "action");
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
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${exportFileName}_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={`w-full flex flex-col bg-[#FFFFFF] border border-[#E2E8F0] rounded-md overflow-hidden shadow-xs ${className}`}
    >
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
                      col.sortable ? "cursor-pointer select-none hover:text-[#2563EB]" : ""
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
                  {emptyMessage}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
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
    </div>
  );
}
