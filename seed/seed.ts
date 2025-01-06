// import { placeholderUsers } from "@/lib/placeholder-data";
import { db } from "@vercel/postgres";

async function seedUsers() {
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
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_admin FOREIGN KEY (admin_id) REFERENCES users(id)
    );
  `;

  // await Promise.all(
  //   placeholderUsers.map(async (user) => {
  //     return client.sql`
  //       INSERT INTO users (id, name, email, password)
  //       VALUES (${user.id}, ${user.name}, ${user.email}, ${user.password})
  //       ON CONFLICT (id) DO NOTHING;
  //     `;
  //   })
  // );
}

seedUsers();
