import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  // const { participants, payer, amount, description, date }: ExpenseRequest =
  await request.json();

  try {
    const group_id = request.cookies.get("group_id")?.value;

    if (!group_id) {
      throw new Error("Group ID not found or invalid.");
    }
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong! Try again later.");
  }
}
