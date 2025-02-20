import { UserResponse } from "@/types/responses";
import { db } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const user_id = request.cookies.get("user_id")?.value;

  if (!user_id) {
    throw new Error("User ID not found or invalid.");
  }

  try {
    const client = await db.connect();
    const users = (
      await client.sql`
      SELECT *
      FROM users
      WHERE id = ${user_id} AND status = 'A'
    `
    ).rows as UserResponse[];

    return NextResponse.json({
      data: users,
    });
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong! Try again later.");
  }
}
