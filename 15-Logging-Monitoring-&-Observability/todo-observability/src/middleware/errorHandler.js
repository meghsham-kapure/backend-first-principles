import { logger } from "../config/logger.js";
import { appErrors } from "../metrics.js";

export function notFound(req, res) {
  res.status(404).json({ error: "Route not found" });
}

export function errorHandler(err, req, res, next) {
  const status = err.status || (err.name === "ValidationError" ? 400 : 500);

  if (status >= 500) {
    appErrors.add(1, { route: req.route?.path ?? "unknown" });
    if (!err.logged) logger.error({ err, requestId: req.id }, "Unhandled error");
  }

  res.status(status).json({
    error: status >= 500 ? "Internal server error" : err.message,
    requestId: req.id,
  });
}
