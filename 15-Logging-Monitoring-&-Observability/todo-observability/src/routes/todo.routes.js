import { Router } from "express";
import * as todos from "../services/todo.service.js";

const router = Router();

router.post("/", async (req, res) => {
  const todo = await todos.createTodo({ userId: req.user.id, ...req.body });
  res.status(201).json(todo);
});

router.get("/", async (req, res) => {
  res.json(await todos.listTodos({ userId: req.user.id }));
});

router.get("/:id", async (req, res) => {
  res.json(await todos.getTodo({ userId: req.user.id, id: req.params.id }));
});

router.patch("/:id", async (req, res) => {
  res.json(await todos.updateTodo({ userId: req.user.id, id: req.params.id, changes: req.body }));
});

router.delete("/:id", async (req, res) => {
  await todos.deleteTodo({ userId: req.user.id, id: req.params.id });
  res.status(204).end();
});

export default router;
