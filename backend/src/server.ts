import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import db from "./drizzle/db";
import { sql } from "drizzle-orm";

import logger from "./middleware/logger";

const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;

async function startServer() {
  try {
    logger.info("Starting SmartSeason Field Monitoring System...");

    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined");
    }

    logger.info("Environment variables validated");

    logger.info("Connecting to database...");

    await db.execute(sql`SELECT 1`);

    logger.info("Database connected successfully");

    app.listen(PORT, () => {
      logger.info(`Server running at http://localhost:${PORT}`);
      logger.info("SmartSeason API ready");
    });

  } catch (error) {
    logger.error(
      {
        err: error,
      },
      "Server failed to start"
    );

    process.exit(1);
  }
}

startServer();

process.on("SIGINT", () => {
  logger.info("Shutting down SmartSeason server...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  logger.info("Shutting down SmartSeason server...");
  process.exit(0);
});