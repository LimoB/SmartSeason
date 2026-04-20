import { baseApi } from "@/services/baseApi";
import type { User } from "@/types/types";
import { setCredentials } from "./authSlice";

/* ================= TYPES ================= */

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role?: "admin" | "field_agent";
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface MeResponse extends User {
  createdAt: string;
}

/* ================= API ================= */

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ================= REGISTER =================
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),

    // ================= LOGIN =================
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),

      // 🔥 AUTO SAVE TO REDUX + localStorage
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            setCredentials({
              user: data.user,
              token: data.token,
            })
          );
        } catch (err) {
          console.error("Login failed:", err);
        }
      },
    }),

    // ================= GET ME =================
    getMe: builder.query<MeResponse, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),
  }),
});

/* ================= HOOKS ================= */

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetMeQuery,
} = authApi;