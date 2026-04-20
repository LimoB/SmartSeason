import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/* ================= TYPES ================= */

export type ViewMode = "grid" | "list";

type DashboardState = {
  selectedFieldId: number | null;
  viewMode: ViewMode;
};

/* ================= INITIAL STATE ================= */

const initialState: DashboardState = {
  selectedFieldId: null,
  viewMode: "grid",
};

/* ================= SLICE ================= */

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {

    // ================= SELECT FIELD =================
    setSelectedField: (state, action: PayloadAction<number | null>) => {
      state.selectedFieldId = action.payload;
    },

    // ================= VIEW MODE =================
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
    },

    // ================= RESET DASHBOARD UI =================
    resetDashboardUI: (state) => {
      state.selectedFieldId = null;
      state.viewMode = "grid";
    },

  },
});

export const {
  setSelectedField,
  setViewMode,
  resetDashboardUI,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;