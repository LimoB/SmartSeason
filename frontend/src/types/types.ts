 /* ================= ENUMS ================= */

export type UserRole = "admin" | "field_agent";
export type FieldStage = "planted" | "growing" | "ready" | "harvested";
export type FieldStatus = "active" | "at_risk" | "completed";


/* ================= USERS ================= */

export type User = {
  id: number;
  fullName: string;
  email: string;
  password?: string;
  role: UserRole;
  createdAt: string;
};


/* ================= FIELDS ================= */

export type Field = {
  id: number;
  name: string;
  cropType: string;

  /**
   * Backend allows null → keep it explicit
   */
  location: string | null;

  plantingDate: string;
  expectedHarvestDate: string | null;

  currentStage: FieldStage;

  /**
   * Computed backend value
   */
  status: FieldStatus;

  assignedAgentId: number | null;

  createdAt: string;
  updatedAt: string;
};


/* ================= FIELD UPDATES ================= */

export type FieldUpdate = {
  id: number;
  fieldId: number;
  agentId: number;

  stage: FieldStage;
  notes: string | null;

  createdAt: string;
};


/* ================= FORM TYPES ================= */
/**
 * IMPORTANT FIX:
 * We convert backend null → frontend optional handling
 */
export type CreateFieldInput = Omit<
  Field,
  "id" | "status" | "createdAt" | "updatedAt"
> & {
  location?: string | null;
  expectedHarvestDate?: string | null;
};

export type UpdateFieldInput = Partial<CreateFieldInput>;