import { ExpenseRequest } from "@/types/requests";
import { db } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { participants, payer_id, amount, description, date }: ExpenseRequest =
    await request.json();

  const group_id = request.cookies.get("group_id")?.value;

  if (!group_id) {
    return NextResponse.json(
      { error: "Group ID not found or invalid." },
      { status: 404 }
    );
  }

  try {
    const client = await db.connect();
    const expense = (
      await client.sql`
      INSERT INTO expenses (amount, description, date, payer_id, group_id)
      VALUES (${amount}, ${description}, ${date}, ${payer_id}, ${group_id})
      RETURNING id, amount;
    `
    ).rows[0];

    const p = participants.length;

    participants.map(async (participant_id) => {
      await client.sql`
        INSERT INTO expenses_participants (expense_id, user_id, amount_owed)
        VALUES (${expense.id}, ${participant_id}, ${(
        parseFloat(expense.amount) / p
      ).toFixed(2)})
      `;
    });

    return NextResponse.json({ message: "Expense created successfully." });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Something went wrong! Try again later." },
      { status: 500 }
    );
  }
}
