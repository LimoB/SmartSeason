import { eq, desc } from "drizzle-orm";
import db from "../../drizzle/db";
import { fieldUpdates, fields, users } from "../../drizzle/schema";

export type CreateUpdateInput = {
  fieldId: number;
  agentId: number;
  stage: "planted" | "growing" | "ready" | "harvested";
  notes?: string;
};

// ================= CREATE UPDATE =================
export const createUpdateService = async (data: CreateUpdateInput) => {
  return await db.transaction(async (tx) => {

    // 1. Check field exists
    const [field] = await tx
      .select()
      .from(fields)
      .where(eq(fields.id, data.fieldId));

    if (!field) {
      throw new Error("Field not found");
    }

    //  2. Check agent exists
    const [agent] = await tx
      .select()
      .from(users)
      .where(eq(users.id, data.agentId));

    if (!agent) {
      throw new Error("Agent not found");
    }

    //  3. Ensure agent is assigned to field
    if (field.assignedAgentId !== data.agentId) {
      throw new Error("Unauthorized: You are not assigned to this field");
    }

    //  4. Insert update history
    const [newUpdate] = await tx
      .insert(fieldUpdates)
      .values({
        fieldId: data.fieldId,
        agentId: data.agentId,
        stage: data.stage,
        notes: data.notes ?? null, // important
      })
      .returning();

    //  5. Sync latest stage
    await tx
      .update(fields)
      .set({
        currentStage: data.stage,
        updatedAt: new Date(),
      })
      .where(eq(fields.id, data.fieldId));

    return newUpdate;
  });
};

// ================= GET UPDATES =================
export const getFieldUpdatesService = async (fieldId: number) => {
  return await db
    .select()
    .from(fieldUpdates)
    .where(eq(fieldUpdates.fieldId, fieldId))
    .orderBy(desc(fieldUpdates.createdAt)); // latest first
};