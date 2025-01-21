import { ExpenseHistoryResponse } from "@/types/responses";
import { db } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const group_id = request.cookies.get("group_id")?.value;
  const pageSizeParam = request.nextUrl.searchParams.get("size");
  const pageNumberParam = request.nextUrl.searchParams.get("number");
  const from = request.nextUrl.searchParams.get("from");
  const to = request.nextUrl.searchParams.get("to");
  const payer = request.nextUrl.searchParams.get("payer");

  if (!group_id) {
    throw new Error("Group ID not found or invalid.");
  }

  if (!pageSizeParam || !pageNumberParam) {
    throw new Error("The 'size' and 'number' parameters are required!");
  }

  const pageSize = parseInt(pageSizeParam);
  const pageNumber = parseInt(pageNumberParam);

  const offset = (pageNumber - 1) * pageSize;

  try {
    const client = await db.connect();
    const queryParams: (string | number)[] = [group_id];

    let countQuery = `
      SELECT COUNT(e.id)
      FROM expenses e
      WHERE e.group_id = $${queryParams.length}
    `;

    let query = `
      SELECT 
        e.id,
        e.amount,
        e.description,
        e.date,
        e.payer_id,
        e.group_id,
        e.created_by,
        json_build_object(
            'name', u.name,
            'photo_url', u.photo_url
        ) AS "user"
      FROM expenses e
      JOIN users u ON e.payer_id = u.id
      WHERE e.group_id = $${queryParams.length}
    `;

    if (from && to) {
      queryParams.push(from);
      countQuery += ` AND e.date > $${queryParams.length}`;
      query += ` AND e.date > $${queryParams.length}`;

      queryParams.push(to);
      countQuery += ` AND e.date < $${queryParams.length}`;
      query += ` AND e.date < $${queryParams.length}`;
    }

    if (payer) {
      queryParams.push(payer);
      countQuery += ` AND e.payer_id = $${queryParams.length}`;
      query += ` AND e.payer_id = $${queryParams.length}`;
    }

    const count = await client.query(countQuery, queryParams);

    queryParams.push(pageSize);
    query += `
        ORDER BY e.date DESC
        LIMIT $${queryParams.length}
        
    `;

    queryParams.push(offset);
    query += `
      OFFSET $${queryParams.length}
    `;

    const result = await client.query(query, queryParams);

    const expenses = result.rows as ExpenseHistoryResponse[];

    return NextResponse.json({
      data: expenses,
      count: count.rows[0].count,
    });
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong! Try again later.");
  }
}
