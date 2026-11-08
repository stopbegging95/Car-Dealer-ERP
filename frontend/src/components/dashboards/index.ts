export * from "./admin";
export * from "./accounting";
export * from "./sales";
export * from "./service";
export * from "./parts";
export * from "./financing";
export * from "./recon";
export * from "./imports";
export * from "./trade-ins";
export * from "./crm";
export * from "./hr";
export * from "./user";

// Backward-compatible aliases
export { DepartmentPortalsPage as DepartmentPortalsDashboard } from "./admin";
export { InventoryPage as InventoryDashboard } from "./admin";
export { TransfersPage as TransfersDashboard } from "./admin";
export { DocumentVaultPage as DocumentVaultDashboard } from "./admin";
export { CMSPage as CMSDashboard } from "./admin";
export { SettingsPage as SettingsDashboard } from "./admin";
export { ProfilePage as ProfileDashboard } from "./admin";
export { SessionsPage as SessionsDashboard } from "./admin";
