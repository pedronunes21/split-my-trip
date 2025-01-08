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
    let expensesOverview;

    if (!paramForUser) {
      expensesOverview = (
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
      ).rows;

      return NextResponse.json({
        data: expensesOverview,
      });
    } else {
      expensesOverview = (
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
          WHERE u.group_id = ${group_id} AND u.id = ${user_id}
          GROUP BY u.id;
      `
      ).rows[0];
      return NextResponse.json({
        data: expensesOverview,
      });
    }
  } catch (err) {
    console.error(err);
    throw new Error("Something went wrong! Try again later.");
  }
}
