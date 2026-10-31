import express from "express";
import { requestId } from "./middleware/requestId.js";
import { httpLogger } from "./middleware/httpLogger.js";
import { auth } from "./middleware/auth.js";
import { observabilityMiddleware } from "./middleware/observability.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import todoRoutes from "./routes/todo.routes.js";

export const app = express();

app.use(express.json());
app.use(requestId);
app.use(httpLogger);

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use(auth);
app.use(observabilityMiddleware);

app.use("/todos", todoRoutes);

// Triggers a 500 to test error logs, traces, and metrics.
app.get("/debug/error", () => {
  throw new Error("Intentional test error");
});

app.use(notFound);
app.use(errorHandler);
