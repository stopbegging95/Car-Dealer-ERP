"use client";

import React, { useState } from "react";

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
  pagination,
  onRowClick,
  className = "",
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const sortedData = React.useMemo(() => {
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

  const totalPages = pagination
    ? Math.ceil(pagination.totalItems / pagination.pageSize)
    : 1;

  return (
    <div className={`w-full flex flex-col bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm ${className}`}>
      {/* Responsive Horizontal Scroll Container */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#64748B]">
              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                const alignClass =
                  col.align === "right"
                    ? "text-right"
                    : col.align === "center"
                    ? "text-center"
                    : "text-left";

                return (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={`py-3.5 px-3 sm:px-4 ${alignClass} ${
                      col.sortable ? "cursor-pointer select-none hover:text-[#2563EB]" : ""
                    } ${col.className || ""}`}
                  >
                    <div
                      className={`inline-flex items-center gap-1.5 ${
                        col.align === "right" ? "justify-end" : ""
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                          ) : isSorted && sortDirection === "asc" ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
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
                  {columns.map((col) => (
                    <td key={col.key} className="py-3.5 px-3 sm:px-4">
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-10 text-center text-[#94A3B8] italic text-xs sm:text-sm"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((row, index) => {
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
                    {columns.map((col) => {
                      const alignClass =
                        col.align === "right"
                          ? "text-right"
                          : col.align === "center"
                          ? "text-center"
                          : "text-left";

                      return (
                        <td
                          key={col.key}
                          className={`py-3 px-3 sm:px-4 text-xs sm:text-sm ${alignClass} ${col.className || ""}`}
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

      {/* Responsive Pagination Bar */}
      {pagination && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0] text-xs">
          <span className="text-[#64748B] text-center sm:text-left">
            Showing{" "}
            <span className="font-semibold text-[#0F172A]">
              {(pagination.currentPage - 1) * pagination.pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-[#0F172A]">
              {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)}
            </span>{" "}
            of <span className="font-bold text-[#2563EB]">{pagination.totalItems}</span> entries
          </span>

          <div className="flex items-center gap-1.5">
            <button
              disabled={pagination.currentPage <= 1}
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              className="p-1.5 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-[#0F172A] hover:border-[#2563EB] hover:text-[#2563EB] disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xs"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <span className="px-3 py-1 rounded-lg bg-[#FFFFFF] border border-[#CBD5E1] text-[#2563EB] font-mono font-bold shadow-xs">
              {pagination.currentPage} / {totalPages}
            </span>

            <button
              disabled={pagination.currentPage >= totalPages}
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              className="p-1.5 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-[#0F172A] hover:border-[#2563EB] hover:text-[#2563EB] disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xs"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
