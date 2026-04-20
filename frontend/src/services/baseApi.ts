import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * Base API for SmartSeason Backend
 * All feature APIs will inject endpoints into this
 */

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,

    // Attach JWT automatically
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      headers.set("Content-Type", "application/json");

      return headers;
    },
  }),

  tagTypes: ["User", "Field", "Dashboard", "Update"],

  endpoints: () => ({}),
});