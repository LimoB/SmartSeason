import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/* ================= TYPES ================= */

export type FieldStage =
  | "planted"
  | "growing"
  | "ready"
  | "harvested";

export type FieldFilter = {
  stage: FieldStage | "all";
  assigned?: "all" | "assigned" | "unassigned" | "mine";
  cropType?: string | "all";
};

export type FieldViewMode = "grid" | "table";

type FieldState = {
  selectedFieldId: number | null;

  // Filters
  filter: FieldFilter;

  // Search
  search: string;

  // UI mode
  viewMode: FieldViewMode;

  // UI states
  isCreateOpen: boolean;
  isAssignOpen: boolean;
  isDeleteOpen: boolean;
};

/* ================= INITIAL STATE ================= */

const initialState: FieldState = {
  selectedFieldId: null,

  filter: {
    stage: "all",
    assigned: "all",
    cropType: "all",
  },

  search: "",

  viewMode: "table",

  isCreateOpen: false,
  isAssignOpen: false,
  isDeleteOpen: false,
};

/* ================= SLICE ================= */

const fieldSlice = createSlice({
  name: "fields",
  initialState,
  reducers: {
    /* ================= SELECT FIELD ================= */
    setSelectedField: (state, action: PayloadAction<number | null>) => {
      state.selectedFieldId = action.payload;
    },

    /* ================= FILTER ================= */
    setFilter: (state, action: PayloadAction<Partial<FieldFilter>>) => {
      state.filter = { ...state.filter, ...action.payload };
    },

    resetFilter: (state) => {
      state.filter = {
        stage: "all",
        assigned: "all",
        cropType: "all",
      };
    },

    /* ================= SEARCH ================= */
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload.trim();
    },

    clearSearch: (state) => {
      state.search = "";
    },

    /* ================= VIEW MODE ================= */
    setViewMode: (state, action: PayloadAction<FieldViewMode>) => {
      state.viewMode = action.payload;
    },

    /* ================= MODALS ================= */
    openCreateModal: (state) => {
      state.isCreateOpen = true;
    },
    closeCreateModal: (state) => {
      state.isCreateOpen = false;
    },

    openAssignModal: (state) => {
      state.isAssignOpen = true;
    },
    closeAssignModal: (state) => {
      state.isAssignOpen = false;
    },

    openDeleteModal: (state) => {
      state.isDeleteOpen = true;
    },
    closeDeleteModal: (state) => {
      state.isDeleteOpen = false;
    },

    /* ================= RESET ================= */
    resetFieldUI: (state) => {
      state.selectedFieldId = null;
      state.search = "";
      state.viewMode = "table";

      state.filter = {
        stage: "all",
        assigned: "all",
        cropType: "all",
      };

      state.isCreateOpen = false;
      state.isAssignOpen = false;
      state.isDeleteOpen = false;
    },
  },
});

/* ================= EXPORTS ================= */

export const {
  setSelectedField,

  setFilter,
  resetFilter,

  setSearch,
  clearSearch,

  setViewMode,

  openCreateModal,
  closeCreateModal,

  openAssignModal,
  closeAssignModal,

  openDeleteModal,
  closeDeleteModal,

  resetFieldUI,
} = fieldSlice.actions;

export default fieldSlice.reducer;