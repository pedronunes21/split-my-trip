import { User } from "@/lib/definitions";
import { NxResponse } from "@/lib/nx-response";
import { ApiErrorCodes } from "@/types/global";
import { db } from "@vercel/postgres";
import bcrypt from "bcryptjs";

const client = await db.connect();

async function getUserByEmail(email: string) {
  try {
    const user = await client.sql<User>`
      SELECT * 
      FROM users
      WHERE email=${email}
  `;
    return user.rows[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }

  return undefined;
}

export async function POST(request: Request) {
  const { name, email, password } = await request.json();

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return NxResponse.fail("User already exists.", {
      code: ApiErrorCodes.CONFLICT,
      details: null,
    });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  await client.sql`
    INSERT INTO users (name, email, password)
    VALUES (${name}, ${email}, ${hashedPassword})
  `;

  return NxResponse.success("User created.", {});
}
