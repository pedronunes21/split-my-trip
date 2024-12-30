import { NxResponse } from "@/lib/nx-response";
import { db } from "@vercel/postgres";
import { NextResponse } from "next/server";

const client = await db.connect();

export async function GET() {
  // const { database } = await connectToDatabase();
  // const groupsCollection = database.collection("groups");

  // const groups = await groupsCollection.find().toArray();

  // return NextResponse.json(groups);

  const groups = await client.sql`SELECT * FROM groups`;

  return NextResponse.json({
    groups: groups.rows,
  });
}

export async function POST(request: Request) {
  const data = await request.json();

  const { title } = data;

  await client.sql`
    INSERT INTO groups (title)
    VALUES (${title})
  `;

  return NxResponse.success("Group created successfully.", {});
}
