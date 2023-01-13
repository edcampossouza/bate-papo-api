import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
dotenv.config();

async function initDb() {
  const DB_URL = process.env.DATABASE_URL;
  const mongoClient = new MongoClient(DB_URL);
  await mongoClient.connect();
  console.log(`connected to database ${DB_URL}`);
}

initDb();

function addUser(user) {}

function getUsers() {}

function addMessage(user, message) {}

function getMessages(user, limit) {}

function updateStatus(user) {}

function cleanInactiveUsers() {}

export { addUser, getUsers };
