import { NxResponse } from "@/lib/nx-response";
import { UserRequest } from "@/types/requests";
import { InvitationResponse } from "@/types/responses";
import { db } from "@vercel/postgres";

const client = await db.connect();

export async function POST(request: Request) {
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

    return NxResponse.success("User created successfully.", {
      userId: user.rows[0].id,
    });
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong! Try again later.");
  }
}
