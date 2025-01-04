import { db } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const client = await db.connect();
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
    return NextResponse.json(
      { error: "Something went wrong! Try again later." },
      { status: 500 }
    );
  }
}
