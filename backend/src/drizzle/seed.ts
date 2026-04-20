import db from "./db";
import {
  users,
  fields,
  fieldUpdates,
} from "./schema";

import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding database...");

  /* ============================================================
     CLEAR EXISTING DATA (optional but recommended for dev)
  ============================================================ */
  await db.delete(fieldUpdates);
  await db.delete(fields);
  await db.delete(users);

  /* ============================================================
     1. USERS (5 records)
  ============================================================ */
  const insertedUsers = await db
    .insert(users)
    .values([
      {
        fullName: "Admin One",
        email: "admin1@smartseason.com",
        password: "hashed_password_1",
        role: "admin",
      },
      {
        fullName: "Admin Two",
        email: "admin2@smartseason.com",
        password: "hashed_password_2",
        role: "admin",
      },
      {
        fullName: "Field Agent John",
        email: "john@smartseason.com",
        password: "hashed_password_3",
        role: "field_agent",
      },
      {
        fullName: "Field Agent Mary",
        email: "mary@smartseason.com",
        password: "hashed_password_4",
        role: "field_agent",
      },
      {
        fullName: "Field Agent David",
        email: "david@smartseason.com",
        password: "hashed_password_5",
        role: "field_agent",
      },
    ])
    .returning();

  console.log("✅ Users seeded");

  /* ============================================================
     2. FIELDS (5 records)
  ============================================================ */
  const insertedFields = await db
    .insert(fields)
    .values([
      {
        name: "Maize Farm A",
        cropType: "Maize",
        location: "Nakuru",
        plantingDate: new Date("2026-01-10"),
        expectedHarvestDate: new Date("2026-06-10"),
        currentStage: "planted",
        assignedAgentId: insertedUsers[2].id,
      },
      {
        name: "Wheat Farm B",
        cropType: "Wheat",
        location: "Eldoret",
        plantingDate: new Date("2026-02-01"),
        expectedHarvestDate: new Date("2026-07-01"),
        currentStage: "growing",
        assignedAgentId: insertedUsers[3].id,
      },
      {
        name: "Rice Field C",
        cropType: "Rice",
        location: "Mwea",
        plantingDate: new Date("2026-01-20"),
        expectedHarvestDate: new Date("2026-06-20"),
        currentStage: "ready",
        assignedAgentId: insertedUsers[4].id,
      },
      {
        name: "Sugarcane Estate D",
        cropType: "Sugarcane",
        location: "Kisumu",
        plantingDate: new Date("2025-12-15"),
        expectedHarvestDate: new Date("2026-08-15"),
        currentStage: "growing",
        assignedAgentId: insertedUsers[2].id,
      },
      {
        name: "Coffee Plantation E",
        cropType: "Coffee",
        location: "Kericho",
        plantingDate: new Date("2025-11-01"),
        expectedHarvestDate: new Date("2026-09-01"),
        currentStage: "harvested",
        assignedAgentId: insertedUsers[3].id,
      },
    ])
    .returning();

  console.log("✅ Fields seeded");

  /* ============================================================
     3. FIELD UPDATES (5 records)
  ============================================================ */
  await db.insert(fieldUpdates).values([
    {
      fieldId: insertedFields[0].id,
      agentId: insertedUsers[2].id,
      stage: "planted",
      notes: "Initial planting completed successfully",
    },
    {
      fieldId: insertedFields[1].id,
      agentId: insertedUsers[3].id,
      stage: "growing",
      notes: "Plants showing strong growth",
    },
    {
      fieldId: insertedFields[2].id,
      agentId: insertedUsers[4].id,
      stage: "ready",
      notes: "Field ready for inspection",
    },
    {
      fieldId: insertedFields[3].id,
      agentId: insertedUsers[2].id,
      stage: "growing",
      notes: "Growth stage progressing well",
    },
    {
      fieldId: insertedFields[4].id,
      agentId: insertedUsers[3].id,
      stage: "harvested",
      notes: "Harvest completed successfully",
    },
  ]);

  console.log("✅ Field updates seeded");

  console.log("🎉 Seeding complete!");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed error:", err);
    process.exit(1);
  });