import "./config/env.js";

import app from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import { logger } from "./config/logger.js";

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 Server is running on port ${env.PORT}`);
      logger.info(`📍 Environment: ${env.NODE_ENV}`);
      logger.info(
        `🔗 Health check: http://localhost:${env.PORT}/api/health`
      );
    });

    const shutdown = (signal: string) => {
      logger.info(`${signal} received. Shutting down gracefully...`);

      server.close(() => {
        logger.info("Server closed");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

void startServer();