import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");

    let url = "https://fakestoreapi.com/products";

    if (category && category !== "all") {
      url = `https://fakestoreapi.com/products/category/${category}`;
    }
    // For "all" category, fetch all products without skip/limit

    const response = await fetch(url);
    const products = await response.json();
    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
