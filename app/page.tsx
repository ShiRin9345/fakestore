"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
}

export default function Home() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const itemsPerPage = 5;
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Check if data is an array, if not try to get categories from error response
      const categories = Array.isArray(data) ? data : data.categories || [];
      setCategories(categories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setCategories([]);
    }
  };

  const fetchProducts = useCallback(
    async (category: string, reset: boolean = false) => {
      setLoading(true);

      try {
        let url = "/api/products?";
        if (category !== "all") {
          url += `category=${category}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Check if data is an array, if not try to get products from error response
        const products = Array.isArray(data) ? data : data.products || [];

        if (reset) {
          setAllProducts(products);
          // Display first page
          const firstPage = products.slice(0, itemsPerPage);
          setDisplayedProducts(firstPage);
          setPage(0);
          // If we have exactly itemsPerPage or less, there's no more to load
          setHasMore(products.length > itemsPerPage);
        } else {
          // This shouldn't be called when reset is false, but handle it anyway
          setAllProducts(products);
          const firstPage = products.slice(0, itemsPerPage);
          setDisplayedProducts(firstPage);
          setHasMore(products.length > itemsPerPage);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setAllProducts([]);
        setDisplayedProducts([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [itemsPerPage]
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    fetchProducts(selectedCategory, true);
  }, [selectedCategory, fetchProducts]);

  useEffect(() => {
    // Load more products when scrolling to bottom
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !loading &&
          allProducts.length > 0
        ) {
          setPage((currentPage) => {
            const nextPage = currentPage + 1;
            const startIndex = nextPage * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const nextProducts = allProducts.slice(startIndex, endIndex);

            if (nextProducts.length > 0) {
              setDisplayedProducts((prev) => {
                // Remove duplicates based on product id
                const existingIds = new Set(prev.map((p) => p.id));
                const newProducts = nextProducts.filter(
                  (p) => !existingIds.has(p.id)
                );
                return [...prev, ...newProducts];
              });
              setHasMore(endIndex < allProducts.length);
              return nextPage;
            } else {
              setHasMore(false);
              return currentPage;
            }
          });
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, allProducts, itemsPerPage]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      <Tabs
        value={selectedCategory}
        onValueChange={setSelectedCategory}
        className="mb-8"
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {loading && (
        <div className="text-center py-8">
          <p>Loading...</p>
        </div>
      )}

      <div ref={observerTarget} className="h-10" />

      {!hasMore && displayedProducts.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No more products to load</p>
        </div>
      )}
    </div>
  );
}
