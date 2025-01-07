import { db } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

const client = await db.connect();

export async function GET(request: NextRequest) {
  const group_id = request.cookies.get("group_id")?.value;

  if (!group_id) {
    throw new Error("Group ID not found or invalid.");
  }

  try {
    const count = (
      await client.sql`
        SELECT COUNT(id)
        FROM expenses
        WHERE group_id = ${group_id}
    `
    ).rows[0].count;

    return NextResponse.json({
      data: {
        count,
      },
    });
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong! Try again later.");
  }
}
