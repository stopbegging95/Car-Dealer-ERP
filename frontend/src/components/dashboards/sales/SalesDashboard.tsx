"use client";

import React from "react";
import {
  FiShoppingBag,
  FiTruck,
  FiActivity,
  FiCheckCircle,
} from "react-icons/fi";
import { KPICard } from "@/components/ui";
import { SalesOrdersPage, OrderItem } from "./SalesOrdersPage";

export type { OrderItem };

export interface SalesDashboardProps {
  orders: OrderItem[];
  onPreviewOrder: (order: OrderItem) => void;
  onInspectOrder: (order: OrderItem) => void;
  onDownloadPdf: (order: OrderItem) => void;
}

export const SalesDashboard: React.FC<SalesDashboardProps> = ({
  orders,
  onPreviewOrder,
  onInspectOrder,
  onDownloadPdf,
}) => {
  return (
    <div className="space-y-4">
      {/* 4 Sales KPI Metrics */}
      <div className="gap-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Open Purchase Orders"
          value="8 Pending"
          change="₦2.17B Committed"
          icon={<FiShoppingBag className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Handover Scheduled"
          value="4 Units"
          change="This Week"
          icon={<FiTruck className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Escrow Verified"
          value="94.2%"
          change="Compliant"
          icon={<FiActivity className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Average Deal Size"
          value="₦319,687,500"
          change="+8.4% vs target"
          icon={<FiCheckCircle className="w-5 h-5 text-[#2563EB]" />}
        />
      </div>

      {/* Orders Table Page */}
      <SalesOrdersPage
        orders={orders}
        onPreviewOrder={onPreviewOrder}
        onInspectOrder={onInspectOrder}
        onDownloadPdf={onDownloadPdf}
      />
    </div>
  );
};

