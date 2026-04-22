import { baseApi } from "../../services/baseApi";
import type { Field } from "@/types/types";

/* ================= TYPES ================= */

// Base Field Input
interface BaseFieldInput {
  name: string;
  cropType: string;
  location?: string;
  plantingDate: string;
  expectedHarvestDate?: string;
}

// ================= ADMIN ONLY =================
export interface AdminCreateFieldRequest extends BaseFieldInput {
  assignedAgentId?: number | null;
}

// Admin can update everything
export type AdminUpdateFieldRequest = Partial<AdminCreateFieldRequest>;

// ================= AGENT SAFE =================
// Agent CANNOT assign or change restricted fields
export type AgentUpdateFieldRequest = Partial<BaseFieldInput>;

// ================= ASSIGN =================
export interface AssignFieldRequest {
  id: number;
  agentId: number;
}

/* ================= API ================= */

export const fieldApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    /* ================= GET ALL ================= */
    getFields: builder.query<Field[], void>({
      query: () => "/fields",
      providesTags: ["Field"],
    }),

    /* ================= GET BY ID ================= */
    getFieldById: builder.query<Field, number>({
      query: (id) => `/fields/${id}`,
      providesTags: ["Field"],
    }),

    /* ================= CREATE (ADMIN) ================= */
    createField: builder.mutation<Field, AdminCreateFieldRequest>({
      query: (data) => ({
        url: "/fields",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Field"],
    }),

    /* ================= UPDATE (SAFE FOR BOTH) ================= */
    updateField: builder.mutation<
      Field,
      { id: number } & (AdminUpdateFieldRequest | AgentUpdateFieldRequest)
    >({
      query: ({ id, ...data }) => ({
        url: `/fields/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Field"],
    }),

    /* ================= DELETE (ADMIN) ================= */
    deleteField: builder.mutation<void, number>({
      query: (id) => ({
        url: `/fields/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Field"],
    }),

    /* ================= ASSIGN (ADMIN ONLY) ================= */
    assignField: builder.mutation<Field, AssignFieldRequest>({
      query: ({ id, agentId }) => ({
        url: `/fields/${id}/assign`,
        method: "PATCH",
        body: { assignedAgentId: agentId },
      }),
      invalidatesTags: ["Field"],
    }),

  }),
});

/* ================= HOOKS ================= */

export const {
  useGetFieldsQuery,
  useGetFieldByIdQuery,
  useCreateFieldMutation,
  useUpdateFieldMutation,
  useDeleteFieldMutation,
  useAssignFieldMutation,
} = fieldApi;