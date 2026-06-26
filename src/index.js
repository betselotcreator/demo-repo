import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/tasks", async (req, res) => {
  const tasks = await prisma.task.findMany({ orderBy: { id: "asc" } });
  res.json(tasks);
});

app.post("/tasks", async (req, res) => {
  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ error: "description is required" });
  }
  const task = await prisma.task.create({ data: { description } });
  res.status(201).json(task);
});

app.patch("/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);
  const task = await prisma.task.update({
    where: { id },
    data: { done: true },
  });
  res.json(task);
});

app.delete("/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);
  await prisma.task.delete({ where: { id } });
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Task Manager API listening on port ${PORT}`);
});
