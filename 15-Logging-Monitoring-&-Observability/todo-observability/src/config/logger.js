import pino from "pino";
import { trace } from "@opentelemetry/api";

const isProd = process.env.NODE_ENV === "production";

export const logger = pino({
  level: process.env.LOG_LEVEL || (isProd ? "info" : "debug"),

  redact: {
    paths: ["password", "token", "*.password", "*.token", "req.headers.authorization"],
    censor: "[redacted]",
  },

  // Adds the active trace/span IDs so logs can link to traces in Grafana.
  mixin() {
    const spanContext = trace.getActiveSpan()?.spanContext();
    if (!spanContext) return {};
    return { trace_id: spanContext.traceId, span_id: spanContext.spanId };
  },

  ...(isProd
    ? { formatters: { level: (label) => ({ level: label }) } }
    : { transport: { target: "pino-pretty", options: { colorize: true } } }),
});
