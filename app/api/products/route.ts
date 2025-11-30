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
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://fakestoreapi.com/",
      },
    });

    if (!response.ok) {
      console.error(
        `FakeStoreAPI error: ${response.status} ${response.statusText}`
      );
      return NextResponse.json(
        {
          error: "Failed to fetch products",
          products: [],
          status: response.status,
          statusText: response.statusText,
        },
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
