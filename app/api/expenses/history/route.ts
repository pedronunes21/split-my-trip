import { ExpenseHistoryResponse } from "@/types/responses";
import { db } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const client = await db.connect();
  const group_id = request.cookies.get("group_id")?.value;

  if (!group_id) {
    throw new Error("Group ID not found or invalid.");
  }

  try {
    const expenses = (
      await client.sql`
      SELECT 
        e.id,
        e.amount,
        e.description,
        e.date,
        e.payer_id,
        e.group_id,
        json_build_object(
            'name', u.name,
            'photo_url', u.photo_url
        ) AS "user"
      FROM expenses e
      JOIN users u ON e.payer_id = u.id
      WHERE e.group_id = ${group_id}
      ORDER BY e.date DESC;
    `
    ).rows as ExpenseHistoryResponse[];

    return NextResponse.json({
      data: expenses,
    });
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong! Try again later.");
  }
}
