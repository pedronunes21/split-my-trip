import { ExpensesOverviewResponse } from "@/types/responses";
import { db } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const group_id = request.cookies.get("group_id")?.value;
  const user_id = request.cookies.get("user_id")?.value;
  const paramForUser = request.nextUrl.searchParams.get("me");

  if (!group_id) {
    throw new Error("Group ID not found or invalid.");
  }

  if (!user_id) {
    throw new Error("User ID not found or invalid.");
  }

  try {
    const client = await db.connect();

    const queryParams: (string | number)[] = [group_id];
    let query = `
      SELECT
        u.id AS user_id,
        u.name AS user_name,
        COALESCE(ep_debt.total_debt, 0) AS debt,
        COALESCE(e_surplus.total_surplus, 0) AS surplus,
        COALESCE(e_surplus.total_surplus - ep_debt.total_debt, 0) AS balance
      FROM users u
      LEFT JOIN (
          SELECT 
              ep.user_id,
              SUM(ep.amount_owed) AS total_debt
          FROM expenses_participants ep
          GROUP BY ep.user_id
      ) ep_debt ON ep_debt.user_id = u.id
      LEFT JOIN (
          SELECT 
              e.payer_id,
              SUM(e.amount) AS total_surplus
          FROM expenses e
          GROUP BY e.payer_id
      ) e_surplus ON e_surplus.payer_id = u.id
      WHERE u.group_id = $${queryParams.length}
    `;

    if (paramForUser) {
      queryParams.push(user_id);
      query += ` AND u.id = $${queryParams.length}`;
    }

    const result = await client.query(query, queryParams);

    const expenses = result.rows as ExpensesOverviewResponse[];

    return NextResponse.json({
      data: expenses,
    });
  } catch (err) {
    console.error(err);
    throw new Error("Something went wrong! Try again later.");
  }
}
