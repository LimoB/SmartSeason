import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../services/baseApi";

// ================= SLICES =================
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/users/userSlice";
import fieldReducer from "../features/fields/fieldSlice";
import updateReducer from "../features/updates/updateSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import themeReducer from "../features/theme/themeSlice";

export const store = configureStore({
  reducer: {
    // ================= RTK QUERY =================
    [baseApi.reducerPath]: baseApi.reducer,

    // ================= FEATURE SLICES =================
    auth: authReducer,
    users: userReducer,
    fields: fieldReducer,
    updates: updateReducer,
    dashboard: dashboardReducer,
    theme: themeReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // needed for Date objects (fields, timestamps)
    }).concat(baseApi.middleware),

  // ================= DEVTOOLS =================
  devTools: import.meta.env.MODE !== "production",
});

// ================= TYPES =================
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;