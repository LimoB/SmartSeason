import { eq } from "drizzle-orm";
import db from "@/drizzle/db";
import { fields } from "@/drizzle/schema";

/* ================= TYPES ================= */

export type CreateFieldInput = {
  name: string;
  cropType: string;
  plantingDate: Date;
  expectedHarvestDate?: Date;
  assignedAgentId?: number;
  location?: string;
};

export type UpdateFieldInput = Partial<CreateFieldInput> & {
  currentStage?: "planted" | "growing" | "ready" | "harvested";
};

/* ================= FIELD STATUS LOGIC ================= */

const computeFieldStatus = (field: any) => {
  const now = new Date();

  // Completed
  if (field.currentStage === "harvested") {
    return "completed";
  }

  // At Risk → passed expected harvest date but not ready/harvested
  if (
    field.expectedHarvestDate &&
    new Date(field.expectedHarvestDate) < now &&
    field.currentStage !== "ready"
  ) {
    return "at_risk";
  }

  // Otherwise Active
  return "active";
};

/* ================= HELPERS ================= */

const attachStatus = (field: any) => ({
  ...field,
  status: computeFieldStatus(field),
});

/* ================= GET ALL FIELDS (Admin) ================= */

export const getFieldsService = async () => {
  const result = await db
    .select()
    .from(fields)
    .orderBy(fields.createdAt);

  return result.map(attachStatus);
};

/* ================= GET AGENT FIELDS ================= */

export const getFieldsByAgentService = async (agentId: number) => {
  const result = await db
    .select()
    .from(fields)
    .where(eq(fields.assignedAgentId, agentId))
    .orderBy(fields.createdAt);

  return result.map(attachStatus);
};

/* ================= GET FIELD BY ID ================= */

export const getFieldByIdService = async (id: number) => {
  const result = await db
    .select()
    .from(fields)
    .where(eq(fields.id, id));

  const field = result[0];
  if (!field) return null;

  return attachStatus(field);
};

/* ================= CREATE FIELD ================= */

export const createFieldService = async (data: CreateFieldInput) => {
  const result = await db
    .insert(fields)
    .values({
      ...data,
      currentStage: "planted",
    })
    .returning();

  return attachStatus(result[0]);
};

/* ================= UPDATE FIELD ================= */

export const updateFieldService = async (
  id: number,
  data: UpdateFieldInput
) => {
  // Optional safety: prevent accidental stage overwrite from generic update
  if ("currentStage" in data) {
    throw new Error(
      "Stage updates should be done via the updates module."
    );
  }

  const result = await db
    .update(fields)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(fields.id, id))
    .returning();

  const field = result[0];
  if (!field) return null;

  return attachStatus(field);
};

/* ================= DELETE FIELD ================= */

export const deleteFieldService = async (id: number) => {
  const result = await db
    .delete(fields)
    .where(eq(fields.id, id))
    .returning();

  return result.length > 0;
};