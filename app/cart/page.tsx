"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/components/CartItem";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface CartItemData {
  id: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    title: string;
    price: number;
    image: string;
  };
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const session = await authClient.getSession();
        if (!session || !("data" in session) || !session.data?.user) {
          router.push("/login?redirect=/cart");
          return;
        }

        const response = await fetch("/api/cart");
        if (response.ok) {
          const data = await response.json();
          setCartItems(data);
        }
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [router]);

  const handleUpdateQuantity = async (id: number, quantity: number) => {
    // Optimistic update: update UI immediately
    const previousItems = [...cartItems];
    const previousQuantity =
      cartItems.find((item) => item.id === id)?.quantity || 0;

    setCartItems((items) =>
      items.map((item) => (item.id === id ? { ...item, quantity } : item))
    );

    // Update cart count optimistically
    const quantityDiff = quantity - previousQuantity;
    if (quantityDiff !== 0) {
      window.dispatchEvent(
        new CustomEvent("cartUpdated", {
          detail: {
            type: quantityDiff > 0 ? "increment" : "decrement",
            optimistic: true,
            count: Math.abs(quantityDiff),
          },
        })
      );
    }

    try {
      const response = await fetch(`/api/cart/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        // Rollback on error
        setCartItems(previousItems);
        if (quantityDiff !== 0) {
          window.dispatchEvent(
            new CustomEvent("cartUpdated", {
              detail: {
                type: quantityDiff > 0 ? "decrement" : "increment",
                optimistic: true,
                count: Math.abs(quantityDiff),
              },
            })
          );
        }
      }

      // Refresh cart count from server
      window.dispatchEvent(
        new CustomEvent("cartUpdated", {
          detail: { type: "refresh" },
        })
      );
    } catch (error) {
      console.error("Failed to update quantity:", error);
      // Rollback on error
      setCartItems(previousItems);
      if (quantityDiff !== 0) {
        window.dispatchEvent(
          new CustomEvent("cartUpdated", {
            detail: {
              type: quantityDiff > 0 ? "decrement" : "increment",
              optimistic: true,
              count: Math.abs(quantityDiff),
            },
          })
        );
      }
    }
  };

  const handleDelete = async (id: number) => {
    // Optimistic update: remove item immediately
    const itemToDelete = cartItems.find((item) => item.id === id);
    const previousItems = [...cartItems];

    setCartItems((items) => items.filter((item) => item.id !== id));

    // Update cart count optimistically
    if (itemToDelete) {
      window.dispatchEvent(
        new CustomEvent("cartUpdated", {
          detail: {
            type: "decrement",
            optimistic: true,
            count: itemToDelete.quantity,
          },
        })
      );
    }

    try {
      const response = await fetch(`/api/cart/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        // Rollback on error
        setCartItems(previousItems);
        if (itemToDelete) {
          window.dispatchEvent(
            new CustomEvent("cartUpdated", {
              detail: {
                type: "increment",
                optimistic: true,
                count: itemToDelete.quantity,
              },
            })
          );
        }
      } else {
        // Refresh cart count from server
        window.dispatchEvent(
          new CustomEvent("cartUpdated", {
            detail: { type: "refresh" },
          })
        );
      }
    } catch (error) {
      console.error("Failed to delete item:", error);
      // Rollback on error
      setCartItems(previousItems);
      if (itemToDelete) {
        window.dispatchEvent(
          new CustomEvent("cartUpdated", {
            detail: {
              type: "increment",
              optimistic: true,
              count: itemToDelete.quantity,
            },
          })
        );
      }
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Button asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                id={item.id}
                product={item.product}
                quantity={item.quantity}
                onUpdateQuantity={handleUpdateQuantity}
                onDelete={handleDelete}
              />
            ))}
          </div>
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <Button className="w-full" size="lg">
                  Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
