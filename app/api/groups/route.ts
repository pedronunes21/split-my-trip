import { NxResponse } from "@/lib/nx-response";
import { db } from "@vercel/postgres";
import { NextResponse } from "next/server";

const client = await db.connect();

export async function GET() {
  const groups = await client.sql`SELECT * FROM groups`;

  return NextResponse.json({
    groups: groups.rows,
  });
}

export async function POST(request: Request) {
  const { title, photo_url, user } = await request.json();

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

    return NxResponse.success("Group created successfully.", {
      group_id,
      user_id,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      message: "Check the fields and try again.",
    });
  }
}
