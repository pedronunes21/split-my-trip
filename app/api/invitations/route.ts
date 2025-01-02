import { NxResponse } from "@/lib/nx-response";
import { InvitationRequest } from "@/types/requests";
import { InvitationResponse } from "@/types/responses";
import { db } from "@vercel/postgres";

const client = await db.connect();

export async function POST(request: Request) {
  const { group_id }: InvitationRequest = await request.json();

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

    return NxResponse.success("Invitation created successfully.", {
      invite_code,
    });
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong! Try again later.");
  }
}
