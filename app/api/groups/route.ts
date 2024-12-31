import { NxResponse } from "@/lib/nx-response";
import { db } from "@vercel/postgres";
import { NextResponse } from "next/server";

const client = await db.connect();

export async function GET() {
  const groups = await client.sql`SELECT * FROM groups`;

  return NextResponse.json({
    groups: groups.rows,
  });
}

export async function POST(request: Request) {
  const { title } = await request.json();

  await client.sql`
    INSERT INTO groups (title)
    VALUES (${title})
  `;

  return NxResponse.success("Group created successfully.", {});
}
