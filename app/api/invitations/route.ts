import { InvitationResponse } from "@/types/responses";
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
    const res = await client.sql`
      SELECT invite_code
      FROM invitations
      WHERE group_id=${group_id}
    `;

    const { invite_code } = res.rows[0] as InvitationResponse;

    return NextResponse.json({
      data: {
        invite_code,
        group_id,
      },
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Something went wrong! Try again later." },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function POST(request: NextRequest) {
  const client = await db.connect();
  const group_id = request.cookies.get("group_id")?.value;

  if (!group_id) {
    return NextResponse.json(
      { error: "Group ID not found or invalid." },
      { status: 404 }
    );
  }

  try {
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
        group_id,
      },
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Something went wrong! Try again later." },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
