import { placeholderGroups } from "@/lib/placeholder-data";
import { db } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST() {
  const client = await db.connect();

  // Drop all tables
  await client.sql`
    DROP SCHEMA public CASCADE;
    CREATE SCHEMA public;
  `;

  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  // Create Users table
  await client.sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      photo_url TEXT NOT NULL,
      group_id UUID,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Create Groups table
  await client.sql`
    CREATE TABLE IF NOT EXISTS groups (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      admin_id UUID,
      photo_url TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Adding foreign keys to Users and Groups tables
  await client.sql`
    ALTER TABLE users ADD CONSTRAINT fk_group FOREIGN KEY (group_id) REFERENCES groups(id);
    ALTER TABLE groups ADD CONSTRAINT fk_admin FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE;
  `;

  // Create Invitations table
  await client.sql`
    CREATE TABLE IF NOT EXISTS invitations (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      group_id UUID,
      invite_code VARCHAR(8) DEFAULT substring(gen_random_uuid()::text from 1 for 8),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_group FOREIGN KEY (group_id) REFERENCES groups(id)
    );
  `;

  await Promise.all(
    placeholderGroups.map(async (group) => {
      const g = await client.sql`
        WITH new_group AS (
          INSERT INTO groups (title, photo_url)
          VALUES (${group.title}, ${group.photo_url})
          RETURNING id AS group_id
        ),
        new_user AS (
          INSERT INTO users (name, photo_url, group_id)
          SELECT 'Example User', 'user.jpg', group_id
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

      await client.sql`
        INSERT INTO invitations (group_id)
        VALUES (${group_id})
      `;
    })
  );

  return NextResponse.json({
    message: "Tables created successfully and database seeded.",
  });
}
