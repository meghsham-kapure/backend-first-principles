import { trace, SpanStatusCode } from "@opentelemetry/api";
import { logger } from "../config/logger.js";
import { todoOperations, todoOperationDuration } from "../metrics.js";

const tracer = trace.getTracer("todo-service");

// Wraps an operation with a span, logs, and metrics.
export function withSpan(name, attributes, fn) {
  const start = performance.now();

  return tracer.startActiveSpan(name, { attributes }, async (span) => {
    logger.info({ event: `${name}.started`, ...attributes }, `${name} started`);

    try {
      const result = await fn(span);
      todoOperations.add(1, { operation: name, outcome: "success" });
      logger.info({ event: `${name}.completed`, ...attributes }, `${name} completed`);
      return result;
    } catch (error) {
      const expected = error.status && error.status < 500;

      span.recordException(error);
      if (!expected) {
        span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
      }

      todoOperations.add(1, { operation: name, outcome: expected ? "rejected" : "error" });

      if (expected) {
        logger.warn({ event: `${name}.rejected`, ...attributes, reason: error.message }, `${name} rejected`);
      } else {
        logger.error({ err: error, event: `${name}.failed`, ...attributes }, `${name} failed`);
        error.logged = true;
      }

      throw error;
    } finally {
      todoOperationDuration.record(performance.now() - start, { operation: name });
      span.end();
    }
  });
}
