import { UserRequest } from "@/types/requests";
import { InvitationResponse, UserResponse } from "@/types/responses";
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
    const users = (
      await client.sql`
      SELECT *
      FROM users
      WHERE group_id = ${group_id}
    `
    ).rows as UserResponse[];

    return NextResponse.json(users);
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

export async function POST(request: Request) {
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
      throw new Error("Invalid invitation code.");
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
