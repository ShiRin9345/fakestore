import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://fakestoreapi.com/products/categories",
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "application/json",
          "Accept-Language": "en-US,en;q=0.9",
          Referer: "https://fakestoreapi.com/",
        },
      }
    );

    if (!response.ok) {
      console.error(
        `FakeStoreAPI error: ${response.status} ${response.statusText}`
      );
      return NextResponse.json(
        { error: "Failed to fetch categories", categories: [] },
        { status: 500 }
      );
    }

    const categories = await response.json();

    // Ensure we return an array
    if (!Array.isArray(categories)) {
      console.error("FakeStoreAPI returned non-array data:", categories);
      return NextResponse.json(
        { error: "Invalid data format", categories: [] },
        { status: 500 }
      );
    }

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories", categories: [] },
      { status: 500 }
    );
  }
}
