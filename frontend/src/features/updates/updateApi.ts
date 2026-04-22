import { baseApi } from "../../services/baseApi";
import type { FieldUpdate } from "@/types/types";

/* ================= TYPES ================= */

export interface CreateUpdateRequest {
  fieldId: number;
  stage: "planted" | "growing" | "ready" | "harvested";
  notes?: string;
}

/* ================= API RESPONSE WRAPPER ================= */

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  count?: number;
}

/* ================= API ================= */

export const updateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ================= CREATE UPDATE =================
    createUpdate: builder.mutation<FieldUpdate, CreateUpdateRequest>({
      query: (data) => {
        console.log("Creating update:", data);
        return {
          url: "/updates",
          method: "POST",
          body: data,
        };
      },

      transformResponse: (response: ApiResponse<FieldUpdate>) => {
        console.log("Create response:", response);
        return response.data;
      },

      // invalidate ONLY that field's updates
      invalidatesTags: (_result, _error, body) => [
        { type: "Update", id: body.fieldId },
      ],
    }),

    // ================= GET FIELD UPDATES =================
    getFieldUpdates: builder.query<FieldUpdate[], number>({
      query: (fieldId) => {
        console.log("Fetching updates for fieldId:", fieldId);
        return `/updates/field/${fieldId}`;
      },

      transformResponse: (response: ApiResponse<FieldUpdate[]>) => {
        console.log("Updates response:", response);
        return response.data;
      },

      // cache per field
      providesTags: (_result, _error, fieldId) => [
        { type: "Update", id: fieldId },
      ],
    }),

  }),
});

/* ================= HOOKS ================= */

export const {
  useCreateUpdateMutation,
  useGetFieldUpdatesQuery,
} = updateApi;