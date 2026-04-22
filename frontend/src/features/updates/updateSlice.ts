import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FieldStage } from "@/types/types";

/* ================= TYPES ================= */

// UI filter includes "all", backend does NOT
export type UpdateStageFilter = "all" | FieldStage;

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
      const fieldId = action.payload;

      console.log("setSelectedField called with:", fieldId);

      // ensure valid number or null
      if (fieldId === null) {
        state.selectedFieldId = null;
        return;
      }

      if (typeof fieldId !== "number" || isNaN(fieldId)) {
        console.warn("Invalid fieldId provided to setSelectedField:", fieldId);
        return;
      }

      // if switching fields, reset filter for clarity
      if (state.selectedFieldId !== fieldId) {
        state.stageFilter = "all";
      }

      state.selectedFieldId = fieldId;
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
      const value = action.payload;

      console.log("setStageFilter:", value);

      state.stageFilter = value;
    },

    // ================= RESET UI =================
    resetUpdateUI: (state) => {
      console.log("resetUpdateUI called");

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