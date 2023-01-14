import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import * as db from "./database.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

app.post("/participants", async (req, res) => {
  const user = req.body;
  const result = await db.addUser(user);
  return res.status(result.code).send(result.message);
});

app.get("/participants", async (req, res) => {
  const users = await db.getUsers();
  res.status(users.code).send(users.data);
});

app.post("/messages", async (req, res) => {
  const message = req.body;
  const { user } = req.headers;
  const result = await db.addMessage(user, message);
  return res.status(result.code).send(result.message);
});

app.get("/messages", async (req, res) => {
  const limit = req.query.limit;
  const user = req.headers.user;
  const result = await db.getMessages(user, limit);
  return res.status(result.code).send(result.data);
});

app.delete("/messages/:id", async (req, res) => {
  const id = req.params.id;
  const user = req.headers.user;
  const result = await db.deleteMessage(id, user);
  return res.status(result.code).send(result.message);
});

app.put("/messages/:id", async (req, res) => {
  const id = req.params.id;
  const user = req.headers.user;
  const message = req.body;
  const result = await db.editMessage(id, message, user);
  return res.status(result.code).send(result.message);
});

app.post("/status", async (req, res) => {
  const { user } = req.headers;
  const result = await db.updateStatus(user);
  return res.status(result.code).send(result.message);
});

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
