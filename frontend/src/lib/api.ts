/**
 * Central API Client for CarDeals Enterprise ERP
 * Connects Next.js Frontend to Express Backend on http://localhost:8080/api
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, any>;
  statusCode?: number;
}

// Token helper
export const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("cardeals_auth_token");
};

export const setStoredToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("cardeals_auth_token", token);
};

export const clearStoredToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("cardeals_auth_token");
  localStorage.removeItem("cardeals_current_user");
};

export const getStoredUser = (): any | null => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("cardeals_current_user");
  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const setStoredUser = (user: any): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("cardeals_current_user", JSON.stringify(user));
};

async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  const token = getStoredToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      credentials: "include", // Pass httpOnly JWT cookie
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data.message || `Request failed with status ${res.status}`,
        statusCode: res.status,
        data: data.data,
      };
    }

    return {
      success: true,
      message: data.message || "Success",
      data: data.data !== undefined ? data.data : data,
      statusCode: res.status,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Network error. Backend server may be offline.",
      statusCode: 500,
    };
  }
}

export const api = {
  get: <T = any>(endpoint: string) => request<T>(endpoint, { method: "GET" }),
  post: <T = any>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: <T = any>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  patch: <T = any>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: <T = any>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
};

// =========================================================================
// SPECIALIZED DOMAIN API SERVICES
// =========================================================================

// 1. Authentication API
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await api.post("/auth/login", credentials);
    if (res.success && res.data?.token) {
      setStoredToken(res.data.token);
      setStoredUser(res.data.user);
    }
    return res;
  },
  register: async (userData: any) => {
    const res = await api.post("/auth/register", userData);
    if (res.success && res.data?.token) {
      setStoredToken(res.data.token);
      setStoredUser(res.data.user);
    }
    return res;
  },
  getMe: () => api.get("/auth/me"),
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      clearStoredToken();
    }
  },
  getAllUsers: (params?: string) => api.get(`/auth/users${params ? `?${params}` : ""}`),
};

// 2. Master Data & Dropdowns API
export const masterDataApi = {
  getByCategory: (category: string) => api.get(`/master-data/category/${category}`),
  getAll: (params?: string) => api.get(`/master-data/all${params ? `?${params}` : ""}`),
  createOption: (optionData: any) => api.post("/master-data", optionData),
  updateOption: (id: string, optionData: any) => api.put(`/master-data/${id}`, optionData),
  deleteOption: (id: string) => api.delete(`/master-data/${id}`),
};

// 3. Vehicles Inventory API
export const vehiclesApi = {
  getAll: (params?: string) => api.get(`/vehicles${params ? `?${params}` : ""}`),
  getById: (id: string) => api.get(`/vehicles/${id}`),
  create: (vehicleData: any) => api.post("/vehicles", vehicleData),
  update: (id: string, vehicleData: any) => api.put(`/vehicles/${id}`, vehicleData),
  updateStatus: (id: string, status: string, remarks?: string) =>
    api.patch(`/vehicles/${id}/status`, { status, remarks }),
  delete: (id: string) => api.delete(`/vehicles/${id}`),
  getTelemetry: () => api.get("/vehicles/telemetry"),
};

// 4. Sales Orders API
export const ordersApi = {
  getAll: (params?: string) => api.get(`/orders${params ? `?${params}` : ""}`),
  getById: (id: string) => api.get(`/orders/${id}`),
  create: (orderData: any) => api.post("/orders", orderData),
  update: (id: string, orderData: any) => api.put(`/orders/${id}`, orderData),
};

// 5. Procurement API
export const procurementApi = {
  getAll: (params?: string) => api.get(`/procurement${params ? `?${params}` : ""}`),
  create: (poData: any) => api.post("/procurement", poData),
  approveHighValue: (id: string, remarks?: string) =>
    api.patch(`/procurement/${id}/approve-high-value`, { remarks }),
};

// 6. Inspection & QA API
export const inspectionApi = {
  getAll: (params?: string) => api.get(`/inspection${params ? `?${params}` : ""}`),
  create: (inspectionData: any) => api.post("/inspection", inspectionData),
};

// 7. Workshop Service API
export const serviceApi = {
  getAll: (params?: string) => api.get(`/service${params ? `?${params}` : ""}`),
  create: (jobData: any) => api.post("/service", jobData),
  updateStatus: (id: string, statusData: any) =>
    api.patch(`/service/${id}/status`, statusData),
};

// 8. Parts Depot API
export const partsApi = {
  getAll: (params?: string) => api.get(`/parts${params ? `?${params}` : ""}`),
  create: (partData: any) => api.post("/parts", partData),
  adjustStock: (id: string, quantityAdjustment: number, notes?: string) =>
    api.patch(`/parts/${id}/stock`, { quantityAdjustment, notes }),
};

// 9. Financing API
export const financingApi = {
  getAll: (params?: string) => api.get(`/financing${params ? `?${params}` : ""}`),
  create: (appData: any) => api.post("/financing", appData),
  updateStatus: (id: string, statusData: any) =>
    api.patch(`/financing/${id}/status`, statusData),
};

// 10. Recon Detailing API
export const reconApi = {
  getAll: (params?: string) => api.get(`/recon${params ? `?${params}` : ""}`),
  create: (reconData: any) => api.post("/recon", reconData),
  updateStage: (id: string, stageData: any) =>
    api.patch(`/recon/${id}/stage`, stageData),
};

// 11. Import Logistics API
export const importsApi = {
  getAll: (params?: string) => api.get(`/imports${params ? `?${params}` : ""}`),
  create: (shipmentData: any) => api.post("/imports", shipmentData),
  updateStatus: (id: string, statusData: any) =>
    api.patch(`/imports/${id}/status`, statusData),
};

// 12. Trade-Ins & Swaps API
export const tradeInsApi = {
  getAll: (params?: string) => api.get(`/trade-ins${params ? `?${params}` : ""}`),
  create: (tradeInData: any) => api.post("/trade-ins", tradeInData),
  updateValuation: (id: string, valuationData: any) =>
    api.patch(`/trade-ins/${id}/valuation`, valuationData),
};

// 13. VIP CRM API
export const crmApi = {
  getAll: (params?: string) => api.get(`/crm${params ? `?${params}` : ""}`),
  create: (clientData: any) => api.post("/crm", clientData),
  addInteraction: (id: string, interactionData: any) =>
    api.post(`/crm/${id}/interactions`, interactionData),
};

// 14. HR & Payroll API
export const hrApi = {
  getAll: (params?: string) => api.get(`/hr${params ? `?${params}` : ""}`),
  create: (employeeData: any) => api.post("/hr", employeeData),
  clockIn: (id: string, status?: string) =>
    api.post(`/hr/${id}/clock-in`, { status }),
};

// 15. Accounting & Invoices API
export const accountingApi = {
  getAll: (params?: string) => api.get(`/accounting${params ? `?${params}` : ""}`),
  create: (invoiceData: any) => api.post("/accounting", invoiceData),
  recordPayment: (id: string, amountPaidNGN: number) =>
    api.patch(`/accounting/${id}/payment`, { amountPaidNGN }),
};

// 16. Transfers API
export const transfersApi = {
  getAll: (params?: string) => api.get(`/transfers${params ? `?${params}` : ""}`),
  create: (transferData: any) => api.post("/transfers", transferData),
  acknowledgeReceipt: (id: string, notes?: string) =>
    api.patch(`/transfers/${id}/receive`, { notes }),
};

// 17. Document Vault API
export const vaultApi = {
  getAll: (params?: string) => api.get(`/vault${params ? `?${params}` : ""}`),
  create: (docData: any) => api.post("/vault", docData),
};

// 18. CMS Homepage API
export const cmsApi = {
  getPublic: (contentType?: string) =>
    api.get(`/cms/public${contentType ? `?contentType=${encodeURIComponent(contentType)}` : ""}`),
  getAll: (params?: string) => api.get(`/cms/all${params ? `?${params}` : ""}`),
  create: (contentData: any) => api.post("/cms", contentData),
  update: (id: string, contentData: any) => api.put(`/cms/${id}`, contentData),
  delete: (id: string) => api.delete(`/cms/${id}`),
};

// 19. Payments API
export const paymentsApi = {
  initialize: (paymentData: any) => api.post("/payments/initialize", paymentData),
  verify: (reference: string) => api.get(`/payments/verify/${reference}`),
};

// 20. Audit Trail API
export const auditApi = {
  getAll: (params?: string) => api.get(`/audit${params ? `?${params}` : ""}`),
};

