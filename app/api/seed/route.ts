import { placeholderGroups } from "@/lib/placeholder-data";
import { db } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const client = await db.connect();

    // Drop all tables
    await client.sql`
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
    `;

    // Add UUID extension
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create Users table
    await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        photo_url TEXT NOT NULL,
        group_id UUID,
        status VARCHAR(1) DEFAULT 'A',
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
      ALTER TABLE users ADD CONSTRAINT fk_group FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE;
      ALTER TABLE groups ADD CONSTRAINT fk_admin FOREIGN KEY (admin_id) REFERENCES users(id);
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

    // Create Expenses table
    await client.sql`
      CREATE TABLE IF NOT EXISTS expenses (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        amount DECIMAL(10, 2),
        description TEXT,
        date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        payer_id UUID,
        group_id UUID,
        created_by UUID,
        CONSTRAINT fk_payer FOREIGN KEY (payer_id) REFERENCES users(id),
        CONSTRAINT fk_group FOREIGN KEY (group_id) REFERENCES groups(id),
        CONSTRAINT fK_owner FOREIGN KEY (created_by) REFERENCES users(id)
      );
    `;

    // Create Expenses_Participants table
    await client.sql`
      CREATE TABLE IF NOT EXISTS expenses_participants (
        expense_id UUID,
        user_id UUID,
        amount_owed DECIMAL(10,2),
        PRIMARY KEY (expense_id, user_id),
        CONSTRAINT fk_expense FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE,
        CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `;

    // Populate tables with placeholder data
    await Promise.all(
      placeholderGroups.map(async (group) => {
        // Create group and a user to be the admin
        const g = await client.sql`
          WITH new_group AS (
            INSERT INTO groups (id, title, photo_url)
            VALUES (${group.id}, ${group.title}, ${group.photo_url})
            RETURNING id AS group_id
          ),
          new_user AS (
            INSERT INTO users (id, name, photo_url, group_id)
            SELECT ${group.admin.id}, ${group.admin.name}, ${group.admin.photo_url}, group_id
            FROM new_group
            RETURNING id AS user_id
          )
          SELECT new_group.group_id, new_user.user_id FROM new_group, new_user
        `;

        const { group_id, user_id } = g.rows[0];

        // Set the created user as the group admin
        await client.sql`
          UPDATE groups
          SET admin_id = ${user_id}
          WHERE id = ${group_id}
        `;

        // Create one invitation for the group
        await client.sql`
          INSERT INTO invitations (group_id)
          VALUES (${group_id})
        `;

        // Create user to the group
        group.users.map(async (user) => {
          await client.sql`
            INSERT INTO users (id, name, photo_url, group_id)
            VALUES(${user.id}, ${user.name}, ${user.photo_url}, ${group_id})
          `;
        });

        // Create expenses for the group
        group.expenses.map(async (expense) => {
          // Create the expense
          const e = (
            await client.sql`
            INSERT INTO expenses (id, amount, description, date, payer_id, group_id, created_by)
            VALUES (${expense.id}, ${expense.amount}, ${expense.description}, ${expense.date}, ${expense.payer_id}, ${group_id}, ${expense.created_by})
            RETURNING id, amount;
          `
          ).rows[0];

          const participants = expense.participants.length;

          // Add participants to the expense
          expense.participants.map(async (p) => {
            await client.sql`
              INSERT INTO expenses_participants (expense_id, user_id, amount_owed)
              VALUES (${e.id}, ${p.user_id}, ${(
              parseFloat(e.amount) / participants
            ).toFixed(2)})
            `;
          });
        });
      })
    );

    return NextResponse.json({
      message: "Tables created successfully and database seeded.",
    });
  } catch (err) {
    console.error(err);
    throw new Error("Something went wrong while seeding the database.");
  }
}
