import { UserRequest } from "@/types/requests";
import { InvitationResponse, UserResponse } from "@/types/responses";
import { db } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const client = await db.connect();
  const group_id = request.cookies.get("group_id")?.value;

  if (!group_id) {
    throw new Error("Group ID not found or invalid.");
  }

  try {
    const users = (
      await client.sql`
      SELECT *
      FROM users
      WHERE group_id = ${group_id} AND status = 'A'
    `
    ).rows as UserResponse[];

    return NextResponse.json({
      data: users,
    });
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong! Try again later.");
  } finally {
    client.release();
  }
}

export async function POST(request: NextRequest) {
  const client = await db.connect();
  const { name, photo_url, invite_code }: UserRequest = await request.json();

  try {
    const invitation = (
      await client.sql`
      SELECT group_id
      FROM invitations
      WHERE invite_code = ${invite_code}
    `
    ).rows[0] as InvitationResponse;

    if (!invitation) {
      return NextResponse.json(
        { error: "Invalid invitation code." },
        { status: 404 }
      );
    }

    const user = await client.sql`
      INSERT INTO users (name, photo_url, group_id)
      VALUES (${name}, ${photo_url}, ${invitation.group_id})
      RETURNING id
    `;

    const response = NextResponse.json({
      message: "User created successfully.",
      data: {
        userId: user.rows[0].id,
      },
    });

    response.cookies.set("group_id", invitation.group_id, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });

    response.cookies.set("user_id", user.rows[0].id, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });

    return response;
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

export async function DELETE(request: NextRequest) {
  const client = await db.connect();
  const user_id = request.cookies.get("user_id")?.value;

  if (!user_id) {
    return NextResponse.json(
      { error: "Group ID not found or invalid." },
      { status: 404 }
    );
  }

  try {
    await client.sql`
      UPDATE users
      SET status = 'I'
      WHERE id = ${user_id}
    `;
    const response = NextResponse.json({
      message: "User deleted successfully.",
    });

    response.cookies.delete("group_id");
    response.cookies.delete("user_id");

    return response;
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
