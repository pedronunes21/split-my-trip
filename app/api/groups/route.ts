import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const { database } = await connectToDatabase();
  const groupsCollection = database.collection("groups");

  const groups = await groupsCollection.find().toArray();

  return NextResponse.json(groups);
}

export async function POST(request: Request) {
  const { database } = await connectToDatabase();
  const groupsCollection = database.collection("groups");

  const data = await request.json();

  const newGroup = {
    ...data,
    createdAt: new Date(),
  };

  await groupsCollection.insertOne(newGroup);

  return NextResponse.json({
    message: "Group created!",
    data: newGroup,
  });
}
