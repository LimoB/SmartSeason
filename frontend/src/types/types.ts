/* ================= ENUMS ================= */

export type UserRole = "admin" | "field_agent";

export type FieldStage = "planted" | "growing" | "ready" | "harvested";


/* ================= USERS ================= */

export type User = {
  id: number;
  fullName: string;
  email: string;
  password?: string; // optional in frontend (never expose in API responses)
  role: UserRole;
  createdAt: string;
};


/* ================= FIELDS ================= */

export type Field = {
  id: number;
  name: string;
  cropType: string;
  location?: string | null;

  plantingDate: string;
  expectedHarvestDate?: string | null;

  currentStage: FieldStage;

  assignedAgentId?: number | null;

  createdAt: string;
  updatedAt: string;
};


/* ================= FIELD UPDATES ================= */

export type FieldUpdate = {
  id: number;
  fieldId: number;
  agentId: number;

  stage: FieldStage;
  notes?: string | null;

  createdAt: string;
};