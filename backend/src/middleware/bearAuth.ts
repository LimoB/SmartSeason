import jwt, { type SignOptions } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import ms, { type StringValue } from "ms";

/* ============================================================
   EXTEND EXPRESS REQUEST
============================================================ */
declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

/* ============================================================
   USER ROLES (SMARTSEASON ONLY)
============================================================ */
export type UserRole = "admin" | "field_agent";

/* ============================================================
   JWT PAYLOAD TYPE
============================================================ */
export type DecodedToken = {
  id: number;      // Added to fix ts(2339)
  userId: number;  // Kept for backward compatibility
  email: string;
  role: UserRole;
  exp?: number;
};

/* ============================================================
   GENERATE 6-DIGIT CODE
============================================================ */
export const generateVerificationCode = (): string =>
  Math.floor(100000 + Math.random() * 900000).toString();

/* ============================================================
   SIGN ACCESS TOKEN
============================================================ */
export const signToken = (
  payload: Omit<DecodedToken, "id" | "exp"> & { id?: number },
  secret: string,
  expiresIn: StringValue = "1h"
): string => {
  const options: SignOptions = { expiresIn };
  
  // Ensure we sign with 'userId' as the primary key in the token payload
  const signPayload = { ...payload, userId: payload.userId || payload.id };

  console.log(`[signToken] userId=${signPayload.userId}`);

  return jwt.sign(signPayload, secret, options);
};

/* ============================================================
   SIGN REFRESH TOKEN
============================================================ */
export const signRefreshToken = (
  payload: Pick<DecodedToken, "userId" | "email" | "role">,
  secret: string,
  expiresIn: StringValue = "7d"
): string => {
  const options: SignOptions = { expiresIn };

  console.log(`[signRefreshToken] userId=${payload.userId}`);

  return jwt.sign(payload, secret, options);
};

/* ============================================================
   NORMALIZE TOKEN
============================================================ */
const normalizeDecodedToken = (raw: any): DecodedToken | null => {
  if (!raw || typeof raw !== "object") return null;

  // Extract ID from either userId or id field
  const extractedId = raw.userId ?? raw.id;
  const userId = typeof extractedId === "number" ? extractedId : parseInt(extractedId, 10);

  const email = typeof raw.email === "string" ? raw.email : null;
  const role = raw.role;

  if (
    isNaN(userId) || 
    !email || 
    !["admin", "field_agent"].includes(role)
  ) {
    console.error("[normalizeDecodedToken] invalid token content:", raw);
    return null;
  }

  return {
    id: userId,     // Both point to the same database ID
    userId: userId, 
    email,
    role,
    exp: typeof raw.exp === "number" ? raw.exp : undefined,
  };
};

/* ============================================================
   VERIFY TOKEN
============================================================ */
export const verifyToken = (
  token: string,
  secret: string
): DecodedToken | null => {
  try {
    const raw = jwt.verify(token, secret);
    return normalizeDecodedToken(raw);
  } catch (err) {
    console.error("[verifyToken] invalid token:", err);
    return null;
  }
};

/* ============================================================
   AUTH MIDDLEWARE FACTORY
============================================================ */
const authMiddlewareFactory = (allowedRoles: UserRole | UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      res.status(401).json({ error: "Missing Authorization header" });
      return;
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ error: "JWT_SECRET not configured" });
      return;
    }

    const decoded = verifyToken(token, secret);

    if (!decoded) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!allowed.includes(decoded.role)) {
      res.status(403).json({
        error: `Access denied for role: ${decoded.role}`,
      });
      return;
    }

    // Attach normalized user to request
    req.user = decoded;
    next();
  };
};

/* ============================================================
   EXPORT ROLE-BASED MIDDLEWARES
============================================================ */
export const adminAuth = authMiddlewareFactory("admin");
export const agentAuth = authMiddlewareFactory("field_agent");
export const adminOrAgentAuth = authMiddlewareFactory([
  "admin",
  "field_agent",
]);