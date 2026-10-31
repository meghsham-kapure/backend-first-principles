import { app } from "./app.js";
import { connectDb } from "./config/db.js";
import { logger } from "./config/logger.js";

const port = Number(process.env.PORT) || 4000;

try {
  await connectDb();
  app.listen(port, () => logger.info({ port }, "HTTP server started"));
} catch (error) {
  logger.fatal({ err: error }, "Failed to start server");
  process.exit(1);
}
