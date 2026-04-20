import { baseApi } from "../../services/baseApi";
import type { FieldUpdate } from "@/types/types";

/* ================= TYPES ================= */

export interface CreateUpdateRequest {
  fieldId: number;
  stage: "planted" | "growing" | "ready" | "harvested";
  notes?: string;
}

/* ================= API ================= */

export const updateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ================= CREATE UPDATE =================
    createUpdate: builder.mutation<FieldUpdate, CreateUpdateRequest>({
      query: (data) => ({
        url: "/updates",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Field", "Update"],
    }),

    // ================= GET FIELD UPDATES =================
    getFieldUpdates: builder.query<FieldUpdate[], number>({
      query: (fieldId) => `/updates/field/${fieldId}`,
      providesTags: ["Update"],
    }),

  }),
});

/* ================= HOOKS ================= */

export const {
  useCreateUpdateMutation,
  useGetFieldUpdatesQuery,
} = updateApi;