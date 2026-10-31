import { trace } from "@opentelemetry/api";

export function observabilityMiddleware(req, res, next) {
  const span = trace.getActiveSpan();

  span?.setAttribute("http.request_id", req.id ?? "unknown");
  span?.setAttribute("deployment.environment", process.env.NODE_ENV ?? "development");

  if (req.user?.id) {
    span?.setAttribute("app.user_id", String(req.user.id));
  }

  next();
}
