/* ================= ENUMS ================= */

// Matches pgEnum("user_role")
export type UserRole = "admin" | "field_agent";

// Matches pgEnum("field_stage")
export type FieldStage = "planted" | "growing" | "ready" | "harvested";

// Backend-only virtual property for UI logic
export type FieldStatus = "active" | "at_risk" | "completed";


/* ================= USERS ================= */

export type User = {
  id: number;
  fullName: string;
  email: string;
  password?: string; // Kept optional for safety
  role: UserRole;
  createdAt: string; // ISO String from timestamp
};


/* ================= FIELDS ================= */

export type Field = {
  id: number;
  name: string;
  cropType: string;
  location: string | null; // schema allows null

  plantingDate: string; // ISO String
  expectedHarvestDate: string | null; // schema allows null

  currentStage: FieldStage;
  
  /** * Virtual property computed in the backend service layer 
   * based on dates and currentStage.
   */
  status: FieldStatus; 

  /**
   * References users.id. 
   * Null if no agent is assigned.
   */
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
  notes: string | null; // schema: .notes: text("notes")

  createdAt: string;
};

/* ================= API INPUT TYPES ================= */
// Useful for Create/Update forms

export type CreateFieldInput = Omit<Field, "id" | "status" | "createdAt" | "updatedAt">;

export type UpdateFieldInput = Partial<CreateFieldInput>;