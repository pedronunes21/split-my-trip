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
  const { title, admin_id, photo_url } = await request.json();

  await client.sql`
    INSERT INTO groups (title, admin_id, photo_url)
    VALUES (${title}, ${admin_id}, ${photo_url})
  `;

  return NxResponse.success("Group created successfully.", {});
}
