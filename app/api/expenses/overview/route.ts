import { ExpensesOverviewResponse } from "@/types/responses";
import { db } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const client = await db.connect();
  const group_id = request.cookies.get("group_id")?.value;

  if (!group_id) {
    return NextResponse.json(
      { error: "Group ID not found or invalid." },
      { status: 404 }
    );
  }

  try {
    const expensesSummary = (
      await client.sql`
      SELECT
      u.id AS user_id,
      u.name AS user_name,
      COALESCE(SUM(
          CASE
              WHEN e.payer_id = u.id THEN 0
              ELSE ep.amount_owed 
              END
      ), 0) AS debt,
      COALESCE(SUM(
          CASE 
              WHEN e.payer_id = u.id AND ep.user_id = u.id THEN e.amount - ep.amount_owed
              WHEN e.payer_id = u.id THEN e.amount
              ELSE 0 
              END
          ), 0) AS surplus,
      COALESCE(SUM(CASE WHEN e.payer_id = u.id THEN e.amount ELSE 0 END), 0) - COALESCE(SUM(ep.amount_owed), 0) AS balance
      FROM users u
      LEFT JOIN expenses_participants ep ON u.id = ep.user_id
      LEFT JOIN expenses e ON ep.expense_id = e.id
      WHERE u.group_id = ${group_id}
      GROUP BY u.id;
    `
    ).rows as ExpensesOverviewResponse[];

    return NextResponse.json({
      data: expensesSummary,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong! Try again later." },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
