import { GroupRequest } from "@/types/requests";
import { GroupResponse } from "@/types/responses";
import { db } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const client = await db.connect();
  try {
    const group_id = request.cookies.get("group_id")?.value;

    if (!group_id) {
      throw new Error("Group ID not found or invalid.");
    }

    const res = await client.sql`
      SELECT * 
      FROM groups
      WHERE id = ${group_id}
    `;
    const groups = res.rows[0] as GroupResponse;

    return NextResponse.json({
      data: groups,
    });
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong! Try again later.");
  } finally {
    client.release();
  }
}

export async function POST(request: Request) {
  const client = await db.connect();
  const { title, photo_url, user }: GroupRequest = await request.json();

  try {
    const g = await client.sql`
      WITH new_group AS (
        INSERT INTO groups (title, photo_url)
        VALUES (${title}, ${photo_url})
        RETURNING id AS group_id
      ),
      new_user AS (
        INSERT INTO users (name, photo_url, group_id)
        SELECT ${user.name}, ${user.photo_url}, group_id
        FROM new_group
        RETURNING id AS user_id
      )
      SELECT new_group.group_id, new_user.user_id FROM new_group, new_user
    `;

    const { group_id, user_id } = g.rows[0];

    await client.sql`
      UPDATE groups
      SET admin_id = ${user_id}
      WHERE id = ${group_id}
    `;

    const response = NextResponse.json({
      message: "Group created successfully.",
      data: {
        group_id,
        user_id,
      },
    });

    response.cookies.set("group_id", group_id, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });

    response.cookies.set("user_id", user_id, {
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
