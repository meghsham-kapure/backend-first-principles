import mongoose from "mongoose";
import { Todo } from "../models/todo.model.js";
import { AppError } from "../utils/AppError.js";
import { withSpan } from "../utils/withSpan.js";
import { logger } from "../config/logger.js";

function assertValidId(id) {
  if (!mongoose.isValidObjectId(id)) throw new AppError(400, "Invalid todo id");
}

export function createTodo({ userId, title, priority }) {
  return withSpan("todo.create", { "app.user_id": userId, "todo.priority": priority ?? "default" }, async (span) => {
    if (typeof title !== "string" || !title.trim()) {
      throw new AppError(400, "title is required");
    }

    const todo = await Todo.create({ userId, title, priority });

    span.setAttribute("todo.id", String(todo._id));
    span.addEvent("todo.created");
    logger.debug({ todoId: String(todo._id) }, "To-do created successfully");

    return todo;
  });
}

export function listTodos({ userId }) {
  return withSpan("todo.list", { "app.user_id": userId }, async (span) => {
    const todos = await Todo.find({ userId }).sort({ createdAt: -1 });
    span.setAttribute("todo.count", todos.length);
    return todos;
  });
}

export function getTodo({ userId, id }) {
  return withSpan("todo.get", { "app.user_id": userId, "todo.id": String(id) }, async () => {
    assertValidId(id);
    const todo = await Todo.findOne({ _id: id, userId });
    if (!todo) throw new AppError(404, "Todo not found");
    return todo;
  });
}

export function updateTodo({ userId, id, changes }) {
  return withSpan("todo.update", { "app.user_id": userId, "todo.id": String(id) }, async () => {
    assertValidId(id);
    const allowed = {};
    for (const key of ["title", "priority", "completed"]) {
      if (changes[key] !== undefined) allowed[key] = changes[key];
    }
    const todo = await Todo.findOneAndUpdate({ _id: id, userId }, allowed, {
      new: true,
      runValidators: true,
    });
    if (!todo) throw new AppError(404, "Todo not found");
    return todo;
  });
}

export function deleteTodo({ userId, id }) {
  return withSpan("todo.delete", { "app.user_id": userId, "todo.id": String(id) }, async () => {
    assertValidId(id);
    const todo = await Todo.findOneAndDelete({ _id: id, userId });
    if (!todo) throw new AppError(404, "Todo not found");
    return todo;
  });
}
