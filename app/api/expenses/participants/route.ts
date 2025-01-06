import { db } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

const client = await db.connect();

export async function GET(request: NextRequest) {
  const expense_id = request.nextUrl.searchParams.get("expense_id");

  try {
    const participants = (
      await client.sql`
      SELECT
        u.id AS "user_id",
        u.name AS "user_name",
        u.photo_url AS "user_photo"
      FROM expenses e
      JOIN expenses_participants ep ON ep.expense_id = e.id
      JOIN users u ON u.id = ep.user_id
      WHERE e.id = ${expense_id}
    `
    ).rows;

    return NextResponse.json({
      data: participants,
    });
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong! Try again later.");
  }
}
