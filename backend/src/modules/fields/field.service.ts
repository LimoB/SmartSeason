import { eq } from "drizzle-orm";
import db from "../../drizzle/db";
import { fields } from "../../drizzle/schema";

/* ================= TYPES ================= */

export type CreateFieldInput = {
  name: string;
  cropType: string;
  plantingDate: string | Date;
  expectedHarvestDate?: string | Date | null;
  assignedAgentId?: number | null;
  location?: string | null;
};

export type UpdateFieldInput = Partial<CreateFieldInput> & {
  currentStage?: "planted" | "growing" | "ready" | "harvested";
};

/* ================= SAFE DATE PARSER ================= */

const toDate = (value: unknown): Date | undefined => {
  if (!value) return undefined;

  const date = value instanceof Date ? value : new Date(value as string);

  if (isNaN(date.getTime())) return undefined;

  return date;
};

/* ================= STATUS LOGIC ================= */

const computeFieldStatus = (field: any) => {
  const now = new Date();

  if (field.currentStage === "harvested") return "completed";

  if (
    field.expectedHarvestDate &&
    new Date(field.expectedHarvestDate) < now &&
    field.currentStage !== "ready"
  ) {
    return "at_risk";
  }

  return "active";
};

const attachStatus = (field: any) => ({
  ...field,
  status: computeFieldStatus(field),
});

/* ================= GET ALL ================= */

export const getFieldsService = async () => {
  const result = await db.select().from(fields).orderBy(fields.createdAt);
  return result.map(attachStatus);
};

/* ================= GET BY AGENT ================= */

export const getFieldsByAgentService = async (agentId: number) => {
  const result = await db
    .select()
    .from(fields)
    .where(eq(fields.assignedAgentId, agentId))
    .orderBy(fields.createdAt);

  return result.map(attachStatus);
};

/* ================= GET BY ID ================= */

export const getFieldByIdService = async (id: number) => {
  const result = await db.select().from(fields).where(eq(fields.id, id));

  if (!result[0]) return null;

  return attachStatus(result[0]);
};

/* ================= CREATE ================= */

export const createFieldService = async (data: CreateFieldInput) => {
  const result = await db
    .insert(fields)
    .values({
      name: data.name,
      cropType: data.cropType,
      location: data.location ?? null,
      assignedAgentId: data.assignedAgentId ?? null,

      plantingDate: toDate(data.plantingDate)!, // MUST exist
      expectedHarvestDate: toDate(data.expectedHarvestDate) ?? null,

      currentStage: "planted",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return attachStatus(result[0]);
};

/* ================= UPDATE ================= */

export const updateFieldService = async (
  id: number,
  data: UpdateFieldInput
) => {
  if ("currentStage" in data) {
    throw new Error(
      "Stage updates must go through field_updates module."
    );
  }

  const result = await db
    .update(fields)
    .set({
      ...(data.name !== undefined && { name: data.name }),
      ...(data.cropType !== undefined && { cropType: data.cropType }),
      ...(data.location !== undefined && { location: data.location }),
      ...(data.assignedAgentId !== undefined && {
        assignedAgentId: data.assignedAgentId,
      }),

      ...(data.plantingDate !== undefined && {
        plantingDate: toDate(data.plantingDate),
      }),

      ...(data.expectedHarvestDate !== undefined && {
        expectedHarvestDate: toDate(data.expectedHarvestDate),
      }),

      updatedAt: new Date(),
    })
    .where(eq(fields.id, id))
    .returning();

  if (!result[0]) return null;

  return attachStatus(result[0]);
};

/* ================= DELETE ================= */

export const deleteFieldService = async (id: number) => {
  const result = await db
    .delete(fields)
    .where(eq(fields.id, id))
    .returning();

  return result.length > 0;
};