import { relations } from "drizzle-orm";
import {
  pgTable,
  varchar,
  text,
  timestamp,
  integer,
  pgEnum
} from "drizzle-orm/pg-core";

/* ================= ENUMS ================= */

export const userRoleEnum = pgEnum("user_role", [
  "admin", 
  "field_agent"
]);

export const fieldStageEnum = pgEnum("field_stage", [
  "planted",
  "growing",
  "ready",
  "harvested"
]);

/* ================= USERS ================= */

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  fullName: varchar("full_name", { length: 150 }).notNull(),
  email: varchar("email", { length: 100 }).unique().notNull(),
  password: text("password").notNull(),
  role: userRoleEnum("role").default("field_agent").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

/* ================= FIELDS ================= */

export const fields = pgTable("fields", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 150 }).notNull(),
  cropType: varchar("crop_type", { length: 100 }).notNull(),
  location: varchar("location", { length: 255 }), // Added for better UX
  
  plantingDate: timestamp("planting_date").notNull(),
  expectedHarvestDate: timestamp("expected_harvest_date"), // Added for "At Risk" logic
  
  currentStage: fieldStageEnum("current_stage").default("planted").notNull(),
  assignedAgentId: integer("assigned_agent_id").references(() => users.id, { onDelete: 'set null' }),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

/* ================= FIELD UPDATES (Historical Log) ================= */

export const fieldUpdates = pgTable("field_updates", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  fieldId: integer("field_id")
    .references(() => fields.id, { onDelete: 'cascade' })
    .notNull(),
  agentId: integer("agent_id")
    .references(() => users.id)
    .notNull(),
  
  stage: fieldStageEnum("stage").notNull(),
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow().notNull()
});

/* ================= RELATIONS ================= */

export const userRelations = relations(users, ({ many }) => ({
  assignedFields: many(fields),
  updates: many(fieldUpdates)
}));

export const fieldRelations = relations(fields, ({ one, many }) => ({
  agent: one(users, {
    fields: [fields.assignedAgentId],
    references: [users.id]
  }),
  updates: many(fieldUpdates)
}));

export const fieldUpdateRelations = relations(fieldUpdates, ({ one }) => ({
  field: one(fields, {
    fields: [fieldUpdates.fieldId],
    references: [fields.id]
  }),
  agent: one(users, {
    fields: [fieldUpdates.agentId],
    references: [users.id]
  })
}));