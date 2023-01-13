import { MongoClient } from "mongodb";
import dayjs from "dayjs";
import * as dotenv from "dotenv";
import { messageSchema, userSchema } from "./validation.js";
dotenv.config();

const DB_URL = process.env.DATABASE_URL;
const mongoClient = new MongoClient(DB_URL);
try {
  await mongoClient.connect();
  console.log(`mongo connected to ${DB_URL}`);
} catch (error) {
  console.log(error.message);
}

const db = mongoClient.db();

async function addUser(user) {
  const { error, value } = userSchema.validate(user);
  if (error) {
    console.log(error.details);
    return { code: 422, message: "erro de validação" };
  }

  try {
    const exists = await db
      .collection("participants")
      .findOne({ name: value.name });
    if (exists) return { code: 409, message: "usuario ja existe" };
    await db
      .collection("participants")
      .insertOne({ ...value, lastStatus: Date.now() });
    await db.collection("messages").insertOne({
      from: value.name,
      to: "Todos",
      text: "entra na sala...",
      type: "status",
      time: dayjs().format("HH:mm:ss"),
    });
    return { code: 201, message: "OK" };
  } catch (error) {
    console.log(error.message);
    return { code: 201, message: "erro desconhecido" };
  }
}

async function getUsers() {
  const users = await db.collection("participants").find().toArray();
  return { code: 200, data: users };
}

async function addMessage(user, message) {
  const { error } = messageSchema.validate(message);
  message = { from: user, ...message };
  if (error) {
    console.log(error.details);
    return { code: 422, message: "erro de validação" };
  }
  try {
    const senderExists = await db
      .collection("participants")
      .findOne({ name: user });
    const recipientExists = await db
      .collection("participants")
      .findOne({ name: message.to });
    if (!senderExists)
      return { code: 402, message: "Participante nao cadastrado" };
    if (!recipientExists && message.to !== "Todos")
      return { code: 404, message: "Participante nao encontrado" };
    await db.collection("messages").insertOne({
      ...message,
      time: dayjs().format("HH:mm:ss"),
    });
    return { code: 201, message: "ok" };
  } catch (error) {
    console.log(error.message);
    return { code: 500, message: "erro desconhecido" };
  }
}

async function getMessages(user, limit) {
  if (limit) {
    limit = parseInt(limit);
    if (limit < 1 || isNaN(limit))
      return { code: 400, data: "limite inválido" };
  }
  const filter = {
    $or: [{ to: user }, { to: "Todos" }],
  };

  const messages = await (
    await db.collection("messages").find(filter).toArray()
  ).reverse();
  const limitedMessages = limit ? messages.slice(0, limit) : messages;
  console.log(limit, limitedMessages);
  return {
    code: 200,
    data: limitedMessages,
  };
}

async function updateStatus(user) {
  if (!user) return { code: 422, message: "dados invalidos" };
  try {
    const userObject = await db
      .collection("participants")
      .findOne({ name: user });
    if (!userObject) {
      return { code: 404, message: "participante nao encontrado" };
    } else {
      db.collection("participants").updateOne(
        { _id: userObject._id },
        { $set: { lastStatus: Date.now() } }
      );
    }
    return { code: 200, message: "OK" };
  } catch (error) {
    console.log(error.message);
    return { code: 500, message: "erro desconhecido" };
  }
}

function cleanInactiveUsers() {}

export { addUser, getUsers, getMessages, addMessage, updateStatus };
