import { InvitationResponse } from "@/types/responses";
import { db } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

const client = await db.connect();

export async function POST(request: NextRequest) {
  try {
    const group_id = request.cookies.get("group_id")?.value;

    if (!group_id) {
      throw new Error("Group ID not found or invalid.");
    }
    await client.sql`
      DELETE FROM invitations
      WHERE group_id = ${group_id}
    `;

    const res = await client.sql`
      INSERT INTO invitations (group_id)
      VALUES (${group_id})
      RETURNING invite_code
    `;

    const { invite_code } = res.rows[0] as InvitationResponse;

    return NextResponse.json({
      message: "Invitation created successfully.",
      data: {
        invite_code,
      },
    });
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong! Try again later.");
  }
}
