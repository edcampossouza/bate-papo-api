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
  const msg = `inserindo usuario: ${JSON.stringify(user)}`;
  console.log(msg);
  const result = await db.addUser(user);
  return res.status(result.code).send(result.message);
});

app.get("/participants", async (req, res) => {
  const msg = `retornando participantes`;
  console.log(msg);
  const users = await db.getUsers();
  res.status(users.code).send(users.data);
});

app.post("/messages", (req, res) => {
  const message = req.body;
  const { user } = req.headers;
  const msg = `inserindo mensagem: ${JSON.stringify(
    message
  )} do participante ${user}`;
  console.log(msg);
  res.send(msg);
});

app.get("/messages", async (req, res) => {
  const limit = req.query.limit;
  const user = req.headers.user;
  const msg = `retornando mensagens`;
  const result = await db.getMessages(user, limit);
  return res.status(result.code).send(result.data);
});

app.post("/status", (req, res) => {
  const { user } = req.headers;
  const msg = `atualizando status: ${user}`;
  console.log(msg);
  res.send(msg);
});

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
