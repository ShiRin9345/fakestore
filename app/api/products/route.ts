import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");

    let url = "https://fakestoreapi.com/products";

    if (category && category !== "all") {
      url = `https://fakestoreapi.com/products/category/${category}`;
    }

    const response = await fetch(url, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      console.error(
        `FakeStoreAPI error: ${response.status} ${response.statusText}`
      );
      return NextResponse.json(
        { error: "Failed to fetch products", products: [], response },
        { status: 500 }
      );
    }

    const products = await response.json();

    // Ensure we return an array
    if (!Array.isArray(products)) {
      console.error("FakeStoreAPI returned non-array data:", products);
      return NextResponse.json(
        { error: "Invalid data format", products: [] },
        { status: 500 }
      );
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products", products: [] },
      { status: 500 }
    );
  }
}
