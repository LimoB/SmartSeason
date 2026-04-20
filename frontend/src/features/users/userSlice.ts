import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/* ================= TYPES ================= */

export type RoleFilter = "all" | "admin" | "field_agent";

type UserState = {
  selectedUserId: number | null;
  search: string;
  roleFilter: RoleFilter;
  isEditModalOpen: boolean;
};

/* ================= INITIAL STATE ================= */

const initialState: UserState = {
  selectedUserId: null,
  search: "",
  roleFilter: "all",
  isEditModalOpen: false,
};

/* ================= SLICE ================= */

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {

    // ================= SELECT USER =================
    setSelectedUser: (state, action: PayloadAction<number | null>) => {
      state.selectedUserId = action.payload;
    },

    // ================= SEARCH =================
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },

    // ================= ROLE FILTER =================
    setRoleFilter: (state, action: PayloadAction<RoleFilter>) => {
      state.roleFilter = action.payload;
    },

    // ================= MODAL CONTROL =================
    openEditModal: (state) => {
      state.isEditModalOpen = true;
    },

    closeEditModal: (state) => {
      state.isEditModalOpen = false;
    },

    // ================= RESET UI =================
    resetUserUI: (state) => {
      state.selectedUserId = null;
      state.search = "";
      state.roleFilter = "all";
      state.isEditModalOpen = false;
    },

  },
});

/* ================= EXPORTS ================= */

export const {
  setSelectedUser,
  setSearch,
  setRoleFilter,
  openEditModal,
  closeEditModal,
  resetUserUI,
} = userSlice.actions;

export default userSlice.reducer;