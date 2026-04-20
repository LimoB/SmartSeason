import db from "@/drizzle/db";
import { fields } from "@/drizzle/schema";
import { eq, sql } from "drizzle-orm";

/* ================= FIELD STATUS LOGIC ================= */

const computeFieldStatus = (field: any) => {
  const now = new Date();

  // Completed
  if (field.currentStage === "harvested") {
    return "completed";
  }

  // At Risk
  if (
    field.expectedHarvestDate &&
    new Date(field.expectedHarvestDate) < now &&
    field.currentStage !== "ready"
  ) {
    return "at_risk";
  }

  // Active
  return "active";
};

const attachStatus = (field: any) => ({
  ...field,
  status: computeFieldStatus(field),
});

/* ================= ADMIN DASHBOARD ================= */

export const getAdminDashboardService = async () => {
  const allFields = await db.query.fields.findMany({
    with: {
      agent: {
        columns: { fullName: true, email: true },
      },
      updates: {
        limit: 5,
        orderBy: (updates, { desc }) => [desc(updates.createdAt)],
      },
    },
  });

  // Attach computed status
  const fieldsWithStatus = allFields.map(attachStatus);

  // Status-based summary (REQUIRED by spec)
  const summary = {
    total: fieldsWithStatus.length,
    active: 0,
    atRisk: 0,
    completed: 0,
  };

  for (const field of fieldsWithStatus) {
    if (field.status === "active") summary.active++;
    if (field.status === "at_risk") summary.atRisk++;
    if (field.status === "completed") summary.completed++;
  }

  // Bonus insight (nice touch)
  const cropInsights = await db
    .select({
      crop: fields.cropType,
      count: sql<number>`count(*)::int`,
    })
    .from(fields)
    .groupBy(fields.cropType)
    .limit(3);

  return {
    summary,
    topCrops: cropInsights,
    fields: fieldsWithStatus,
  };
};

/* ================= AGENT DASHBOARD ================= */

export const getAgentDashboardService = async (agentId: number) => {
  const assignedFields = await db.query.fields.findMany({
    where: eq(fields.assignedAgentId, agentId),
    with: {
      updates: {
        limit: 10,
        orderBy: (updates, { desc }) => [desc(updates.createdAt)],
      },
    },
  });

  const fieldsWithStatus = assignedFields.map(attachStatus);

  const summary = {
    total: fieldsWithStatus.length,
    active: 0,
    atRisk: 0,
    completed: 0,
  };

  for (const field of fieldsWithStatus) {
    if (field.status === "active") summary.active++;
    if (field.status === "at_risk") summary.atRisk++;
    if (field.status === "completed") summary.completed++;
  }

  return {
    summary,
    fields: fieldsWithStatus,
  };
};