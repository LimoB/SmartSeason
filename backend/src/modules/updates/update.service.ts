import { eq } from "drizzle-orm";
import db from "../../drizzle/db";
import { fieldUpdates, fields } from "../../drizzle/schema";

export type CreateUpdateInput = {
  fieldId: number;
  agentId: number;
  stage: "planted" | "growing" | "ready" | "harvested";
  notes?: string;
};

// ================= CREATE UPDATE (With Transaction) =================
export const createUpdateService = async (data: CreateUpdateInput) => {
  return await db.transaction(async (tx) => {
    // 1. Insert update record for history tracking
    const [newUpdate] = await tx
      .insert(fieldUpdates)
      .values({
        fieldId: data.fieldId,
        agentId: data.agentId,
        stage: data.stage,
        notes: data.notes,
      })
      .returning();

    // 2. Sync latest stage to the main fields table
    await tx
      .update(fields)
      .set({
        currentStage: data.stage, // Matches your finalized schema
        updatedAt: new Date(),
      })
      .where(eq(fields.id, data.fieldId));

    return newUpdate;
  });
};

// ================= GET UPDATES FOR FIELD =================
export const getFieldUpdatesService = async (fieldId: number) => {
  return await db
    .select()
    .from(fieldUpdates)
    .where(eq(fieldUpdates.fieldId, fieldId))
    .orderBy(fieldUpdates.createdAt); // Added ordering for history view
};