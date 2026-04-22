import { baseApi } from "../../services/baseApi";
import type { User } from "../../types/types";

/* ================= TYPES ================= */

export interface CreateUserRequest {
  fullName: string;
  email: string;
  password: string;
  role: "admin" | "field_agent";
}

export interface UpdateUserRequest {
  id: number;
  fullName?: string;
  email?: string;
  role?: "admin" | "field_agent";
}

/* ================= API ================= */

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ================= GET ALL USERS =================
    getUsers: builder.query<User[], void>({
      query: () => "/users",
      providesTags: ["User"],
    }),

    // ================= GET USER BY ID =================
    getUserById: builder.query<User, number>({
      query: (id) => `/users/${id}`,
      providesTags: ["User"],
    }),

    // ================= CREATE USER =================
    createUser: builder.mutation<User, CreateUserRequest>({
      query: (data) => ({
        url: "/users",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // ================= UPDATE USER =================
    updateUser: builder.mutation<User, UpdateUserRequest>({
      query: ({ id, ...data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // ================= DELETE USER =================
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

  }),
});

/* ================= HOOKS ================= */

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;