import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/* ================= TYPES ================= */

export type UpdateStageFilter =
  | "all"
  | "planted"
  | "growing"
  | "ready"
  | "harvested";

type UpdateState = {
  selectedFieldId: number | null;
  isModalOpen: boolean;
  stageFilter: UpdateStageFilter;
};

/* ================= INITIAL STATE ================= */

const initialState: UpdateState = {
  selectedFieldId: null,
  isModalOpen: false,
  stageFilter: "all",
};

/* ================= SLICE ================= */

const updateSlice = createSlice({
  name: "updates",
  initialState,
  reducers: {

    // ================= SELECT FIELD =================
    setSelectedField: (state, action: PayloadAction<number | null>) => {
      state.selectedFieldId = action.payload;
    },

    // ================= MODAL CONTROL =================
    openUpdateModal: (state) => {
      state.isModalOpen = true;
    },

    closeUpdateModal: (state) => {
      state.isModalOpen = false;
    },

    // ================= FILTER =================
    setStageFilter: (state, action: PayloadAction<UpdateStageFilter>) => {
      state.stageFilter = action.payload;
    },

    // ================= RESET UI =================
    resetUpdateUI: (state) => {
      state.selectedFieldId = null;
      state.isModalOpen = false;
      state.stageFilter = "all";
    },

  },
});

/* ================= EXPORTS ================= */

export const {
  setSelectedField,
  openUpdateModal,
  closeUpdateModal,
  setStageFilter,
  resetUpdateUI,
} = updateSlice.actions;

export default updateSlice.reducer;