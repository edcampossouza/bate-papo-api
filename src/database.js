import { MongoClient } from "mongodb";
import dayjs from "dayjs";
import * as dotenv from "dotenv";
import { userSchema } from "./validation.js";
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
      message: value.name,
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

function getUsers() {}

function addMessage(user, message) {}

function getMessages(user, limit) {}

function updateStatus(user) {}

function cleanInactiveUsers() {}

export { addUser, getUsers };
