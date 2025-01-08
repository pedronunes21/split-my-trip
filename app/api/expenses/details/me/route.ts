import { ExpensesDetailsResponse } from "@/types/responses";
import { db } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const group_id = request.cookies.get("group_id")?.value;
  const user_id = request.cookies.get("user_id")?.value;

  if (!group_id) {
    throw new Error("Group ID not found or invalid.");
  }
  if (!user_id) {
    throw new Error("User ID not found or invalid.");
  }

  try {
    const client = await db.connect();
    const expensesDetails = (
      await client.sql`
        SELECT
          json_build_object(
            'id', p2.id,
            'name', p2.name
          ) AS "ower",
          json_build_object(
            'id', p1.id,
            'name', p1.name
          ) AS "payer",
          COALESCE(SUM(
              CASE 
                  WHEN e.payer_id = p1.id AND ep.user_id = p2.id THEN ep.amount_owed 
                  ELSE 0 
              END
          ), 0) - (
              SELECT COALESCE(SUM(ep2.amount_owed),0) 
              FROM expenses e2 
              JOIN expenses_participants ep2 ON e2.id = ep2.expense_id 
              WHERE e2.payer_id = p2.id AND ep2.user_id = p1.id
          ) AS amount_owed
        FROM expenses_participants ep
        JOIN expenses e ON ep.expense_id = e.id
        JOIN users p1 ON e.payer_id = p1.id -- The person who paid
        JOIN users p2 ON ep.user_id = p2.id  AND p1.id <> p2.id -- The person who owes
        WHERE ep.amount_owed > 0 AND e.group_id = ${group_id} AND (p1.id = ${user_id} OR p2.id = ${user_id})
        GROUP BY p1.id, p2.id
        HAVING COALESCE(SUM(
            CASE
                WHEN e.payer_id = p1.id AND ep.user_id = p2.id THEN ep.amount_owed 
                ELSE 0
            END
        ), 0) - (
            SELECT COALESCE(SUM(ep2.amount_owed),0) 
            FROM expenses e2 
            JOIN expenses_participants ep2 ON e2.id = ep2.expense_id 
            WHERE e2.payer_id = p2.id AND ep2.user_id = p1.id
        ) > 0
      `
    ).rows as ExpensesDetailsResponse[];

    return NextResponse.json({
      data: expensesDetails,
    });
  } catch (err) {
    console.error(err);
    throw new Error("Something went wrong! Try again later.");
  }
}
