import db from "./db";
import bcrypt from "bcrypt";
import {
  users,
  fields,
  fieldUpdates,
} from "./schema";

async function seed() {
  console.log("Seeding database...");

  /* ================= CLEAR EXISTING DATA ================= */
  await db.delete(fieldUpdates);
  await db.delete(fields);
  await db.delete(users);

  /* ================= PASSWORD HASH ================= */
  const hash = async (password: string) => {
    return await bcrypt.hash(password, 10);
  };

  /* ================= USERS (5) ================= */
  const insertedUsers = await db
    .insert(users)
    .values([
      {
        fullName: "System Admin",
        email: "admin@smartseason.com",
        password: await hash("123456"),
        role: "admin",
      },

      {
        fullName: "Field Agent Main",
        email: "agent@smartseason.com",
        password: await hash("123456"),
        role: "field_agent",
      },

      {
        fullName: "Admin Two",
        email: "admin2@smartseason.com",
        password: await hash("123456"),
        role: "admin",
      },

      {
        fullName: "Admin Three",
        email: "admin3@smartseason.com",
        password: await hash("123456"),
        role: "admin",
      },

      {
        fullName: "Field Agent Backup",
        email: "agent2@smartseason.com",
        password: await hash("123456"),
        role: "field_agent",
      },
    ])
    .returning();

  console.log("Users seeded");

  /* ================= USERS INDEX ================= */
  const admin1 = insertedUsers[0];
  const agent1 = insertedUsers[1];
  const admin2 = insertedUsers[2];
  const admin3 = insertedUsers[3];
  const agent2 = insertedUsers[4];

  /* ================= FIELDS (5) ================= */
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
        assignedAgentId: agent1.id,
      },
      {
        name: "Wheat Farm B",
        cropType: "Wheat",
        location: "Eldoret",
        plantingDate: new Date("2026-02-01"),
        expectedHarvestDate: new Date("2026-07-01"),
        currentStage: "growing",
        assignedAgentId: agent2.id,
      },
      {
        name: "Rice Field C",
        cropType: "Rice",
        location: "Mwea",
        plantingDate: new Date("2026-01-20"),
        expectedHarvestDate: new Date("2026-06-20"),
        currentStage: "ready",
        assignedAgentId: agent1.id,
      },
      {
        name: "Sugarcane Estate D",
        cropType: "Sugarcane",
        location: "Kisumu",
        plantingDate: new Date("2025-12-15"),
        expectedHarvestDate: new Date("2026-08-15"),
        currentStage: "growing",
        assignedAgentId: agent2.id,
      },
      {
        name: "Coffee Plantation E",
        cropType: "Coffee",
        location: "Kericho",
        plantingDate: new Date("2025-11-01"),
        expectedHarvestDate: new Date("2026-09-01"),
        currentStage: "harvested",
        assignedAgentId: agent1.id,
      },
    ])
    .returning();

  console.log("Fields seeded");

  /* ================= FIELD UPDATES (5) ================= */
  await db.insert(fieldUpdates).values([
    {
      fieldId: insertedFields[0].id,
      agentId: agent1.id,
      stage: "planted",
      notes: "Initial planting completed",
    },
    {
      fieldId: insertedFields[1].id,
      agentId: agent2.id,
      stage: "growing",
      notes: "Crop is growing well",
    },
    {
      fieldId: insertedFields[2].id,
      agentId: agent1.id,
      stage: "ready",
      notes: "Ready for inspection",
    },
    {
      fieldId: insertedFields[3].id,
      agentId: agent2.id,
      stage: "growing",
      notes: "Growth is on track",
    },
    {
      fieldId: insertedFields[4].id,
      agentId: agent1.id,
      stage: "harvested",
      notes: "Harvest completed successfully",
    },
  ]);

  console.log("Field updates seeded");
  console.log("Seeding complete");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed error:", err);
    process.exit(1);
  });