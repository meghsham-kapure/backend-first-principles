import { metrics } from "@opentelemetry/api";

const meter = metrics.getMeter("todo-api");

export const todoOperations = meter.createCounter("todo_operations", {
  description: "Todo operations by name and outcome",
});

export const todoOperationDuration = meter.createHistogram("todo_operation_duration", {
  description: "Todo operation duration",
  unit: "ms",
});

export const appErrors = meter.createCounter("app_errors", {
  description: "Unhandled application errors",
});
