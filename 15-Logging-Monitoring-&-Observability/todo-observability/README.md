# To-do API with local observability

Express + MongoDB to-do API. Logging, metrics, and tracing are the focus.

## Run

```
docker compose up --build
./scripts/traffic.sh
```

The API runs in Docker so Grafana Alloy can collect its stdout logs.

| Tool       | URL                    |
| ---------- | ---------------------- |
| API        | http://localhost:4000  |
| Grafana    | http://localhost:3000  |
| Jaeger     | http://localhost:16686 |
| Prometheus | http://localhost:9090  |

Auth header: `Authorization: Bearer dev-token`.

## Endpoints

`GET /health`, `POST/GET /todos`, `GET/PATCH/DELETE /todos/:id`, `GET /debug/error` (forces a 500).

## What to check

- **Logs (Grafana → Explore → Loki):** `{service="todo-api"} | json | level="error"`. Use `level="warn"` for the 401, 400, and 404 cases. Open a log line and follow the `trace_id` link to Jaeger.
- **Traces (Jaeger):** service `todo-api`. Look for the `todo.create` span inside the HTTP request trace.
- **Metrics (Prometheus):** `todo_operations_total`, `todo_operation_duration_milliseconds_bucket`, `app_errors_total`, plus HTTP and Node.js runtime metrics (heap, event loop). Metrics appear after the 10s export interval; exact names vary slightly by package version, so check the Prometheus metric browser.

## Local logs without Docker

`npm install`, copy `.env.example` to `.env`, start MongoDB and the Collector from compose (`docker compose up mongo otel-collector jaeger`), then `npm run dev` for pretty logs. Alloy will not see these logs, so Loki stays empty in this mode.
