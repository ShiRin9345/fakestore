"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
  productId: number;
}

export function AddToCartButton({ productId }: AddToCartButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    const session = await authClient.getSession();
    
    if (!session || !("data" in session) || !session.data?.user) {
      router.push("/login?redirect=/products/" + productId);
      return;
    }

    setLoading(true);
    
    // Optimistic update: increment count immediately
    window.dispatchEvent(new CustomEvent("cartUpdated", { 
      detail: { type: "increment", optimistic: true } 
    }));

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      if (response.ok) {
        // Confirm the update by fetching actual count
        window.dispatchEvent(new CustomEvent("cartUpdated", { 
          detail: { type: "refresh" } 
        }));
      } else {
        // Rollback on error
        window.dispatchEvent(new CustomEvent("cartUpdated", { 
          detail: { type: "decrement", optimistic: true } 
        }));
        // Also refresh to get actual state
        window.dispatchEvent(new CustomEvent("cartUpdated", { 
          detail: { type: "refresh" } 
        }));
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
      // Rollback on error
      window.dispatchEvent(new CustomEvent("cartUpdated", { 
        detail: { type: "decrement", optimistic: true } 
      }));
      // Also refresh to get actual state
      window.dispatchEvent(new CustomEvent("cartUpdated", { 
        detail: { type: "refresh" } 
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleAddToCart} disabled={loading} size="lg" className="w-full md:w-auto">
      <ShoppingCart className="mr-2 h-5 w-5" />
      {loading ? "Adding..." : "Add to Cart"}
    </Button>
  );
}

