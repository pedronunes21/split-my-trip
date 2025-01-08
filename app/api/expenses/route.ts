import { ExpenseRequest } from "@/types/requests";
import { db } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const {
    participants,
    payer_id,
    amount,
    description,
    date,
    created_by,
  }: ExpenseRequest = await request.json();

  const group_id = request.cookies.get("group_id")?.value;

  if (!group_id) {
    return NextResponse.json(
      { error: "Group ID not found or invalid." },
      { status: 404 }
    );
  }

  if (!created_by) {
    return NextResponse.json(
      { error: "Expense owner not found or invalid." },
      { status: 404 }
    );
  }

  try {
    const client = await db.connect();
    const expense = (
      await client.sql`
      INSERT INTO expenses (amount, description, date, payer_id, group_id, created_by)
      VALUES (${amount}, ${description}, ${date}, ${payer_id}, ${group_id}, ${created_by})
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

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  const user_id = request.cookies.get("user_id")?.value;

  if (!user_id) {
    return NextResponse.json(
      { error: "User ID not found or invalid." },
      { status: 404 }
    );
  }

  if (!id) {
    return NextResponse.json(
      { error: "You must inform an Expense ID." },
      { status: 404 }
    );
  }

  try {
    const client = await db.connect();
    const expense = (
      await client.sql`
      SELECT created_by
      FROM expenses
      WHERE id = ${id} AND created_by = ${user_id}
    `
    ).rows;

    if (expense.length <= 0) {
      return NextResponse.json(
        { error: "You don't have permission to do this!" },
        { status: 403 }
      );
    }

    await client.sql`
      DELETE FROM expenses
      WHERE id = ${id}
    `;

    return NextResponse.json({ message: "Expense deleted!" });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Something went wrong! Try again later." },
      { status: 500 }
    );
  }
}
