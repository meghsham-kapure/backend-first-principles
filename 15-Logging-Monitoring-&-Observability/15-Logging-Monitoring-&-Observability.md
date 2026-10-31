# Logging, Monitoring & Observability

## Why Are Logging and Monitoring Required?

- Modern applications are distributed and often run in asynchronous environments, where the failure of one component may affect another component or even the entire system. Without visibility into each component, it becomes difficult to find where the failure started.
- Logging and monitoring help detect and diagnose issues in a system and fix them before they spread and cause further problems.
- They help track the system's behavior, identify errors, and troubleshoot problems.

## Logging

- Recording events and their metadata, such as timestamps, severity, and source, for debugging and auditing purposes in a structured and standardized way.
- A log entry records something that happened in the system, such as a request, response, error, or database query.
- Logging answers: "What happened, when, and where?"
  - What: The event that occurred.
  - When: The timestamp of the event.
  - Where: The component or service where the event occurred.

  ### Logging Levels

- Logging levels categorize log entries based on their severity.

- A logging system can be configured to record only entries at or above a specified severity level.

- Common logging levels, ordered from least severe to most severe:

1. `TRACE`:
   - Records highly detailed information about the application's execution flow.
   - Used when investigating fine-grained execution details, usually temporarily during debugging.
   - Example: "Request at routing layer"
2. `DEBUG`:
   - Records detailed information useful for debugging and troubleshooting.
   - Used primarily during development and enabled in production when necessary for troubleshooting.
   - Example: "Request input data "+ data
3. `INFO`:
   - Records general information about normal application operations.
   - Used to track important application events in production.
   - Example: "Request received at `/app/XYZ` endpoint."
4. `WARN`:
   - Indicates a potentially harmful situation or an issue that may require attention.
   - Used when an operation can continue despite an unexpected condition.
   - Example: "Login failed due to incorrect credentials."
5. `ERROR`:
   - Indicates an error that prevents an operation from completing successfully.
   - Used when an operation fails and requires investigation.
   - Example: "Database connection failed."
6. `FATAL`:
   - Indicates a critical error that may cause the application to terminate.
   - Used when the application cannot continue safely.
   - Example: "A required environment variable is missing, preventing application startup."

- When a logging level is set, entries with lower severity are ignored. For example, setting the level to WARN records WARN, ERROR, and FATAL entries but ignores INFO, DEBUG, and TRACE.

- ALL and FATAL are not supported by every logging framework; available levels and their exact behavior depend on the framework.

### Types of Logging

1. Unstructured Logging:
   - A logging technique that records log entries as plain text without a predefined schema.
   - The data is a readable string that can be printed to the console or written to a file.
   - Used for simple applications, quick debugging, and development.

2. Structured Logging:
   - A logging technique that records log entries using a predefined schema, commonly in JSON format, making them easier to search, filter, and analyze.
   - The data consists of named fields, such as timestamp, severity, message, and service name, which can be processed by logging and observability tools.
   - Used in production systems, especially distributed and high-throughput applications.

> Unstructured logging is often used in combination with structured logging to provide a balance between flexibility and efficiency.

## Monitoring

- Continuously collecting and analyzing system data, primarily metrics, to track health and performance and detect anomalies.
- Monitoring triggers alerts when predefined conditions are met, such as when API response time exceeds a threshold.
- It answers: "Is the system healthy right now?"
- Monitoring observes and reports the system's behavior without directly interfering with its operation.

### Monitoring Tools Used in Production

- New Relic: A proprietary platform for application performance monitoring and observability.
- Prometheus: An open-source tool for collecting metrics and triggering alerts.
- Grafana: An open-source platform for visualizing metrics, logs, and traces.
- OpenTelemetry: An open-source framework for collecting and exporting logs, metrics, and traces.
- ELK Stack (Elasticsearch, Logstash, Kibana): A collection of tools for collecting, searching, and visualizing logs.

> Open-source tools often require more configuration and maintenance, whereas proprietary tools typically offer managed services and simpler setup.

## Observability

- The ability to understand a system's internal state by analyzing its outputs: logs, metrics, and traces.
- It goes beyond detecting a problem and helps identify its root cause, even for problems that were not anticipated in advance.
- Monitoring tells us that something is wrong, while observability helps us understand why it is wrong.

### Three Pillars of Observability

1. Logs
   - Records of events and their metadata in the system.
   - Example: A record of an API request, its response status, and any errors.

2. Metrics
   - Numerical measurements of a system's health and performance over time.
   - They help track current system behavior and identify historical trends.
   - Example: An API's average response time is 200 ms, its error rate is 2%, and it handles 500 requests per minute.

3. Traces
   - Records of how a request travels through different components of a system, from the initial request to the final response.
   - They help identify bottlenecks, errors, and performance issues.
   - Example: A request reaches an API, passes through a service that queries the database, and returns a response to the client.

### Instrumentation

- The process of adding code or libraries to an application so it can generate and expose telemetry data, such as logs, metrics, and traces, for observability tools to collect and analyze.

### OpenTelemetry

- An open-source framework for collecting and exporting logs, metrics, and traces from applications to observability tools.

> Logging, monitoring, and observability tools typically collect data in real time, but it may appear with a slight delay in logs or monitoring dashboards because data is often buffered or processed in batches to reduce system overhead.

## SOP: How Logs, Monitoring, and Observability Work Together to Debug and Fix Production Issues

1. Detect the Issue: Monitoring tracks system health and performance and triggers an alert when a predefined condition is met.
2. Check Logs: Examine logs to identify errors and understand what happened, when, and where.
3. Analyze Metrics and Traces: Use metrics to identify performance changes and traces to locate bottlenecks across services.
4. Identify the Root Cause: Correlate logs, metrics, and traces to determine why the issue occurred.
5. Fix the Issue: Apply the appropriate fix, such as correcting code, optimizing a database query, or adjusting configuration.
6. Test and Deploy: Verify the fix and deploy it to production using the appropriate deployment process.
7. Verify the Resolution: Check logs, metrics, and traces to confirm that the issue is resolved and the system is healthy.
8. Prevent Recurrence: Add or update alerts, tests, and monitoring where necessary to detect similar issues earlier.

### Example: Consider an API endpoint that takes 1000 milliseconds to respond instead of the expected 200 milliseconds

1. Logs: Record what happened, such as the API request, response status, and database query execution time.
2. Monitoring: Tracks metrics such as API response time and error rate. It triggers an alert when response time exceeds the defined threshold.
3. Observability: Uses logs, metrics, and traces to investigate why the API is slow and identify the root cause, such as a slow database query.
4. Fix: Optimize the slow database query or add the appropriate database index.
5. Deploy: Test the fix and deploy it to production.
6. Verify: Check the API response time and confirm that it has returned to the expected 200 milliseconds.

## Logging, Monitoring and Observability: Practical Implementation (JavaScript)

### 1. Open-Source Tooling Stack

Use the following stack to replicate the same observability workflow in a Node.js + Express application without proprietary services.

- Grafana: dashboards for metrics, logs, and traces.
- Prometheus: collects and stores metrics.
- Grafana Loki: stores and queries logs.
- Grafana Alloy: collects application/container logs and forwards them to Loki.
- Jaeger: collects and visualizes distributed traces.
- OpenTelemetry: instruments the Node.js application and exports telemetry data.
- OpenTelemetry Collector: receives, processes, and routes telemetry to the appropriate backends.

The stack is open-source, but you must configure and maintain its components. Promtail is deprecated; use Grafana Alloy for new log-collection setups.

### 2. Logger Setup

Create a logger before starting the Express server, using Pino.

- Configure the log level and output format centrally.
- Use `process.env.NODE_ENV` to distinguish development from production.
- Use readable, human-friendly logs in development.
- Use structured JSON logs in production so observability tools can parse and query them.
- Log meaningful application events, errors, and relevant metadata.

### 3. Log Levels

Configure the log level based on the environment.

- Development: `debug` — includes detailed diagnostic information.
- Production: `info` — records normal application events and more severe messages.
- `warn`: records unexpected but recoverable conditions.
- `error`: records failed operations.

The logger filters messages below the configured severity. For example, with the `info` level, `debug` messages are excluded.

### 4. Install the JavaScript Dependencies

For an Express application using ESM and npm:

```
npm install pino
npm install @opentelemetry/api @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node
npm install @opentelemetry/exporter-trace-otlp-http @opentelemetry/exporter-metrics-otlp-http
npm install @opentelemetry/sdk-metrics
```

OpenTelemetry's JavaScript SDK supports automatic instrumentation for many popular frameworks and libraries, including HTTP and Express.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://opentelemetry.io&sz=32)

OpenTelemetry

+1

### 5. Configure the Logger

Create `src/config/logger.js`:

```
import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  ...(process.env.NODE_ENV !== "production" && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
      },
    },
  }),
});
```

Install the development formatter:

```
npm install -D pino-pretty
```

This gives you readable console output in development and structured JSON in production.

Example:

```
logger.info("Connecting to database");
logger.info("Background job server started");
logger.info("HTTP server started");

logger.error({ err: error }, "Failed to create to-do");
```

Avoid logging passwords, access tokens, or other secrets.

### 6. Add OpenTelemetry Instrumentation

Create `src/instrumentation.js`:

```
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter(),

  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter(),
  }),

  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
```

Configure these environment variables:

```
NODE_ENV=development
OTEL_SERVICE_NAME=todo-api
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

Start instrumentation before loading Express or database libraries. For an ESM application, verify the OpenTelemetry ESM loader requirements for your Node.js and package versions; instrumentation loaded too late may fail to capture requests.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://opentelemetry.io&sz=32)

OpenTelemetry

+1

For example, use a dedicated startup entry point that initializes instrumentation before importing your application, or follow the official [OpenTelemetry JavaScript setup](https://opentelemetry.io/docs/languages/js/?utm_source=chatgpt.com).

Important: this configuration exports traces and metrics, not Pino logs. Logs need their own collection pipeline, which is covered below.

### 7. Instrument the Request and Service Layers

OpenTelemetry's automatic HTTP/Express instrumentation creates request spans. Add custom attributes and events to capture business-level information, similar to the New Relic transaction in the original demo.

Create `src/middleware/observability.js`:

```
import { trace } from "@opentelemetry/api";

export function observabilityMiddleware(req, res, next) {
  const span = trace.getActiveSpan();

  span?.setAttribute("http.request_id", req.id ?? "unknown");
  span?.setAttribute("deployment.environment", process.env.NODE_ENV ?? "development");

  // Add authenticated user attributes after authentication middleware.
  if (req.user?.id) {
    span?.setAttribute("app.user_id", String(req.user.id));
  }

  next();
}
```

Register it after request-ID and authentication middleware, where those values are available:

```
app.use(observabilityMiddleware);
```

Do not attach IP addresses, emails, or other personal data to traces unless you have a clear operational need and appropriate data-handling controls.

### 8. Instrument the `create to-do` Service

Example `src/services/todo.service.js`:

```
import { trace, SpanStatusCode } from "@opentelemetry/api";
import { logger } from "../config/logger.js";
import { Todo } from "../models/todo.model.js";

const tracer = trace.getTracer("todo-service");

export async function createTodo({ userId, title, priority }) {
  return tracer.startActiveSpan("todo.create", async (span) => {
    try {
      span.setAttribute("app.user_id", String(userId));
      span.setAttribute("todo.title", title);

      if (priority !== undefined) {
        span.setAttribute("todo.priority", String(priority));
      }

      logger.info(
        { userId, title, priority },
        "Creating to-do",
      );

      const todo = await Todo.create({
        userId,
        title,
        priority,
      });

      span.setAttribute("todo.id", String(todo.id));
      span.addEvent("todo.created");

      logger.debug(
        { todoId: String(todo.id) },
        "To-do created successfully",
      );

      logger.info(
        {
          event: "todo.created",
          todoId: String(todo.id),
          title,
          priority,
        },
        "To-do business event",
      );

      return todo;
    } catch (error) {
      span.recordException(error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message,
      });

      logger.error({ err: error }, "Failed to create to-do");

      throw error;
    } finally {
      span.end();
    }
  });
}
```

This replicates the core workflow:

1. Start a service-level span inside the request trace.
2. Add user and operation attributes.
3. Log the operation and its relevant metadata.
4. Execute the database operation.
5. On failure, record the exception and mark the span as an error.
6. On success, record the created resource and business event.
7. End the span when the service finishes.

Use your actual Mongoose model and field names. The example assumes the `Todo` model accepts `userId`, `title`, and `priority`.

One important detail: the `finally` block ends the custom span; it does not end the entire HTTP request trace. The HTTP instrumentation manages the request span separately.

### 9. Correlate Logs with Traces

The original demo lets you open a log and navigate to its associated trace. To reproduce this, include the active trace and span IDs in your structured logs.

For example, extend your Pino logger configuration with a `mixin`:

```
import pino from "pino";
import { trace } from "@opentelemetry/api";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",

  mixin() {
    const span = trace.getActiveSpan();
    const spanContext = span?.spanContext();

    if (!spanContext) return {};

    return {
      trace_id: spanContext.traceId,
      span_id: spanContext.spanId,
    };
  },

  ...(process.env.NODE_ENV !== "production" && {
    transport: {
      target: "pino-pretty",
    },
  }),
});
```

Now logs emitted inside an active trace can contain `trace_id` and `span_id`. Configure your log and trace views to use those identifiers for navigation. The log collector does not automatically correlate arbitrary JSON logs with traces; the IDs must be present and the Grafana data sources must be configured accordingly.

### 10. Configure the Open-Source Backends

Run the observability stack with Docker Compose. Use these components:

| Service                 | Purpose                                           |
| ----------------------- | ------------------------------------------------- |
| OpenTelemetry Collector | Receives application telemetry and routes it      |
| Prometheus              | Stores metrics                                    |
| Loki                    | Stores logs                                       |
| Jaeger                  | Stores traces                                     |
| Grafana                 | Dashboards and investigation                      |
| Grafana Alloy           | Collects container logs and forwards them to Loki |

Create an `observability/` directory with separate configuration files for the Collector, Prometheus, and Alloy.

#### OpenTelemetry Collector

Configure an OTLP receiver, a Prometheus metrics exporter, and a trace exporter pointing to Jaeger.

Example `observability/otel-collector/config.yaml`:

```
receivers:
  otlp:
    protocols:
      http:
        endpoint: 0.0.0.0:4318

processors:
  batch:

exporters:
  prometheus:
    endpoint: 0.0.0.0:8889

  otlp/jaeger:
    endpoint: jaeger:4317
    tls:
      insecure: true

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp/jaeger]

    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [prometheus]
```

This configuration routes traces to Jaeger and exposes metrics for Prometheus to scrape. It does not export logs; Alloy handles the container-log path in this setup.

#### Prometheus

Create `observability/prometheus/prometheus.yml`:

```
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: otel-collector
    static_configs:
      - targets: ["otel-collector:8889"]
```

#### Loki and Alloy

Configure Alloy to collect Docker container logs and forward them to Loki. The official [Alloy-to-Loki guide](https://grafana.com/docs/loki/latest/send-data/alloy/?utm_source=chatgpt.com) documents the required collection and forwarding components.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://grafana.com&sz=32)

Grafana Loki documentation

+1

Make sure the Docker socket and Loki endpoint are accessible to Alloy. Also ensure the application writes its Pino logs to stdout so they can be collected.

For the full setup, use the official [OpenTelemetry JavaScript documentation](https://opentelemetry.io/docs/languages/js/?utm_source=chatgpt.com) and [Grafana Alloy documentation](https://grafana.com/docs/alloy/latest/?utm_source=chatgpt.com).

### 11. Connect Grafana to the Data Sources

Open Grafana at `http://localhost:3000` and configure these data sources:

- Prometheus: `http://prometheus:9090`
- Loki: `http://loki:3100`
- Jaeger: `http://jaeger:16686`

These addresses assume Grafana and the services run in the same Docker Compose network. Use the appropriate hostnames and ports for your deployment.

### 12. Reproduce the Dashboard Demo

1. Start the observability stack and your Node.js application.
2. Call your APIs using Swagger UI or Postman.
3. Send a request without an authentication token to trigger an expected `401 Unauthorized` response.
4. Open Grafana and search Loki for the corresponding error log.
5. Open Jaeger and locate the HTTP request trace, including the custom `todo.create` span when that service was called.
6. Inspect Prometheus metrics for request rates, errors, and latency.

To reproduce the original demo more closely, add application-level metrics for request counts, response duration, and error counts. Automatic instrumentation does not guarantee every metric or business attribute shown by a proprietary dashboard.

### 13. Monitor the Node.js Runtime

For runtime information, monitor:

- Heap usage and total memory usage.
- Garbage collection activity.
- Event-loop lag.
- CPU usage.
- Request throughput and response duration.

These are Node.js/V8 runtime measurements, not Go runtime metrics. Use a Node.js runtime instrumentation library or explicitly expose supported runtime metrics, then export them through your chosen metrics pipeline.

### Final workflow

Application instrumentation → OpenTelemetry Collector → Prometheus / Jaeger, with Alloy forwarding logs to Loki → Grafana for investigation.

OpenTelemetry JavaScript has stable tracing and metrics support, while its native logs support remains under development. Using Pino for structured application logs and Alloy for log collection is therefore a practical open-source approach.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://opentelemetry.io&sz=32)
