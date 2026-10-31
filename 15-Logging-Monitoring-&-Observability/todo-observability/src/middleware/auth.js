import { logger } from "../config/logger.js";
import { AppError } from "../utils/AppError.js";

// Static bearer token, enough to produce 401s for the observability demo.
export function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token || token !== (process.env.API_TOKEN || "dev-token")) {
    logger.warn({ event: "auth.failed", requestId: req.id, path: req.path }, "Unauthorized request");
    return next(new AppError(401, "Unauthorized"));
  }

  req.user = { id: "demo-user" };
  next();
}
