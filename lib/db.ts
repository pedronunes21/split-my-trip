import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
const database = client.db("SplitMyTrip");

async function connectToDatabase() {
  await client.connect();
  return { client, database };
}

export { connectToDatabase };
