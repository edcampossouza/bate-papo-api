import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import * as db from "./database.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

app.post("/participants", (req, res) => {
  const user = req.body;
  const msg = `inserindo usuario: ${JSON.stringify(user)}`;
  console.log(msg);
  res.send(msg);
});

app.get("/participants", (req, res) => {
  const msg = `retornando participantes`;
  console.log(msg);
  res.send(msg);
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

app.get("/messages", (req, res) => {
  const msg = `retornando mensagens`;
  console.log(msg);
  res.send(msg);
});

app.get("/participants", (req, res) => {
  const msg = `retornando participantes`;
  console.log(msg);
  res.send(msg);
});

app.post("/status", (req, res) => {
  const { user } = req.headers;
  const msg = `atualizando status: ${user}`;
  console.log(msg);
  res.send(msg);
});

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
