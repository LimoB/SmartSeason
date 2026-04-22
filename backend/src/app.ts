import express, { Application, Request, Response } from "express";
import cors from "cors";

// ROUTES
import authRouter from "./modules/auth/auth.route";
import userRouter from "./modules/users/user.route";
import fieldRouter from "./modules/fields/field.route";
import updateRouter from "./modules/updates/update.route";
import dashboardRouter from "./modules/dashboard/dashboard.route";

const app: Application = express();

/* ============================================================
   CORS (DEV + PROD)
============================================================ */

const allowedOrigins = [
  "http://localhost:5173",
  "https://smartseasonlee.netlify.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Postman / mobile apps

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

/* ============================================================
   BODY PARSING
============================================================ */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ============================================================
   HEALTH CHECK
============================================================ */
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    message: "🌱 SmartSeason Field Monitoring API Running",
    status: "healthy",
  });
});

/* ============================================================
   ROUTES
============================================================ */
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/fields", fieldRouter);
app.use("/api/updates", updateRouter);
app.use("/api/dashboard", dashboardRouter);

/* ============================================================
   404 HANDLER
============================================================ */
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;