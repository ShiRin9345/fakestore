import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { cartItems } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return NextResponse.json({ count: 0 });
    }

    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(cartItems)
      .where(eq(cartItems.userId, session.user.id));

    const count = Number(result[0]?.count || 0);
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
