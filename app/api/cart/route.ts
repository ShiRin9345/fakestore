import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { cartItems } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userCartItems = await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.userId, session.user.id));

    // Fetch product details for each cart item
    const cartWithProducts = await Promise.all(
      userCartItems.map(async (item) => {
        const productResponse = await fetch(
          `https://fakestoreapi.com/products/${item.productId}`
        );
        const product = await productResponse.json();
        return {
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          product,
        };
      })
    );

    return NextResponse.json(cartWithProducts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Check if item already exists in cart
    const existingItem = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.userId, session.user.id),
          eq(cartItems.productId, productId)
        )
      )
      .limit(1);

    if (existingItem.length > 0) {
      // Update quantity
      const updated = await db
        .update(cartItems)
        .set({
          quantity: existingItem[0].quantity + quantity,
          updatedAt: new Date(),
        })
        .where(eq(cartItems.id, existingItem[0].id))
        .returning();

      return NextResponse.json(updated[0]);
    } else {
      // Insert new item
      const newItem = await db
        .insert(cartItems)
        .values({
          userId: session.user.id,
          productId,
          quantity,
        })
        .returning();

      return NextResponse.json(newItem[0]);
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}

