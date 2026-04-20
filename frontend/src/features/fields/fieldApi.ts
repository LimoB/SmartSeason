import { baseApi } from "../../services/baseApi";
import type { Field } from "@/types/types";

/* ================= TYPES ================= */

// Create Field Request
export interface CreateFieldRequest {
  name: string;
  cropType: string;
  location?: string;
  plantingDate: string;
  expectedHarvestDate?: string;
  assignedAgentId?: number | null;
}

// Update Field Request
export type UpdateFieldRequest = Partial<CreateFieldRequest>;

// Assign Field Request
export interface AssignFieldRequest {
  id: number;
  agentId: number;
}

/* ================= API ================= */

export const fieldApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ================= GET ALL FIELDS =================
    getFields: builder.query<Field[], void>({
      query: () => "/fields",
      providesTags: ["Field"],
    }),

    // ================= GET FIELD BY ID =================
    getFieldById: builder.query<Field, number>({
      query: (id) => `/fields/${id}`,
      providesTags: ["Field"],
    }),

    // ================= CREATE FIELD =================
    createField: builder.mutation<Field, CreateFieldRequest>({
      query: (data) => ({
        url: "/fields",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Field"],
    }),

    // ================= UPDATE FIELD =================
    updateField: builder.mutation<
      Field,
      { id: number } & UpdateFieldRequest
    >({
      query: ({ id, ...data }) => ({
        url: `/fields/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Field"],
    }),

    // ================= DELETE FIELD =================
    deleteField: builder.mutation<void, number>({
      query: (id) => ({
        url: `/fields/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Field"],
    }),

    // ================= ASSIGN FIELD =================
    assignField: builder.mutation<
      Field,
      AssignFieldRequest
    >({
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