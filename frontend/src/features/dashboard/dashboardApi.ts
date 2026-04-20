import { baseApi } from "../../services/baseApi";
import type { Field } from "@/types/types";

/* ================= TYPES ================= */

export interface DashboardSummary {
  total: number;
  planted?: number;
  growing?: number;
  completed: number;
  pending?: number;
}

export interface TopCrop {
  crop: string;
  count: number;
}

/* ================= DASHBOARD RESPONSES ================= */

export interface AdminDashboardResponse {
  summary: DashboardSummary;
  topCrops: TopCrop[];
  fields: Field[];
}

export interface AgentDashboardResponse {
  summary: DashboardSummary;
  fields: Field[];
}

/* ================= API ================= */

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ================= ADMIN DASHBOARD =================
    getAdminDashboard: builder.query<AdminDashboardResponse, void>({
      query: () => "/dashboard/admin",
      providesTags: ["Dashboard"],
    }),

    // ================= AGENT DASHBOARD =================
    getAgentDashboard: builder.query<AgentDashboardResponse, void>({
      query: () => "/dashboard/agent",
      providesTags: ["Dashboard"],
    }),

  }),
});

/* ================= HOOKS ================= */

export const {
  useGetAdminDashboardQuery,
  useGetAgentDashboardQuery,
} = dashboardApi;