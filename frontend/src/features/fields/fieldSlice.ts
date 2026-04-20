import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/* ================= TYPES ================= */

export type FieldFilter =
  | "all"
  | "planted"
  | "growing"
  | "ready"
  | "harvested";

export type FieldViewMode = "grid" | "table";

type FieldState = {
  selectedFieldId: number | null;
  filter: FieldFilter;
  search: string;
  viewMode: FieldViewMode;
};

/* ================= INITIAL STATE ================= */

const initialState: FieldState = {
  selectedFieldId: null,
  filter: "all",
  search: "",
  viewMode: "table",
};

/* ================= SLICE ================= */

const fieldSlice = createSlice({
  name: "fields",
  initialState,
  reducers: {

    // ================= SELECT FIELD =================
    setSelectedField: (state, action: PayloadAction<number | null>) => {
      state.selectedFieldId = action.payload;
    },

    // ================= FILTER =================
    setFilter: (state, action: PayloadAction<FieldFilter>) => {
      state.filter = action.payload;
    },

    // ================= SEARCH =================
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },

    // ================= VIEW MODE =================
    setViewMode: (state, action: PayloadAction<FieldViewMode>) => {
      state.viewMode = action.payload;
    },

    // ================= RESET UI =================
    resetFieldUI: (state) => {
      state.selectedFieldId = null;
      state.filter = "all";
      state.search = "";
      state.viewMode = "table";
    },

  },
});

/* ================= EXPORTS ================= */

export const {
  setSelectedField,
  setFilter,
  setSearch,
  setViewMode,
  resetFieldUI,
} = fieldSlice.actions;

export default fieldSlice.reducer;