import { eq } from "drizzle-orm";
import db from "../../drizzle/db";
import { users } from "../../drizzle/schema";
import bcrypt from "bcrypt";

/* ================= SAFE USER OUTPUT ================= */

type SafeUser = {
  id: number;
  fullName: string;
  email: string;
  role: "admin" | "field_agent";
  createdAt: Date;
};

const sanitizeUser = (user: any): SafeUser | null => {
  if (!user) return null;

  const { password, ...safeUser } = user;

  return safeUser as SafeUser;
};

/* ================= INPUT TYPE ================= */

export type CreateUserInput = {
  fullName: string;
  email: string;
  password: string;
  role?: "admin" | "field_agent";
};

/* ================= GET ALL USERS ================= */

export const getUsersService = async (): Promise<SafeUser[]> => {
  const result = await db.select().from(users);

  return result.map(sanitizeUser).filter(Boolean) as SafeUser[];
};

/* ================= GET USER BY ID ================= */

export const getUserByIdService = async (
  id: number
): Promise<SafeUser | null> => {
  const result = await db.select().from(users).where(eq(users.id, id));

  return sanitizeUser(result[0]);
};

/* ================= CREATE USER ================= */

export const createUserService = async (
  data: CreateUserInput
): Promise<SafeUser> => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const result = await db
    .insert(users)
    .values({
      fullName: data.fullName,
      email: data.email,
      password: hashedPassword,
      role: data.role ?? "field_agent",
    })
    .returning();

  return sanitizeUser(result[0])!;
};

/* ================= UPDATE USER ================= */

export const updateUserService = async (
  id: number,
  data: Partial<CreateUserInput>
): Promise<SafeUser | null> => {
  const updatePayload: any = { ...data };

  // Hash password only if provided
  if (data.password) {
    updatePayload.password = await bcrypt.hash(data.password, 10);
  }

  const result = await db
    .update(users)
    .set(updatePayload)
    .where(eq(users.id, id))
    .returning();

  return sanitizeUser(result[0]);
};

/* ================= DELETE USER ================= */

export const deleteUserService = async (id: number): Promise<boolean> => {
  const result = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning();

  return result.length > 0;
};