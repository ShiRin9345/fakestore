"use client";

import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const session = await authClient.getSession();
        if (session && "data" in session && session.data?.user) {
          const response = await fetch("/api/cart/count");
          const data = await response.json();
          setCartCount(data.count || 0);
          setUser(session.data.user);
        }
      } catch (error) {
        console.error("Failed to fetch cart count:", error);
      }
    };

    fetchCartCount();
    
    // Listen for cart updates with optimistic updates
    const handleCartUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      const detail = customEvent.detail || {};
      
      if (detail.optimistic) {
        // Optimistic update: update UI immediately
        const count = detail.count || 1;
        if (detail.type === "increment") {
          setCartCount((prev) => prev + count);
        } else if (detail.type === "decrement") {
          setCartCount((prev) => Math.max(0, prev - count));
        }
      } else if (detail.type === "refresh") {
        // Refresh from server to get actual state
        fetchCartCount();
      } else {
        // Default: refresh from server
        fetchCartCount();
      }
    };
    
    window.addEventListener("cartUpdated", handleCartUpdate);
    
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    setUser(null);
    setCartCount(0);
    window.location.href = "/";
  };

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          Shop
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost">Products</Button>
          </Link>
          <Link href="/cart">
            <Button variant="ghost" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>
          {user ? (
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span className="text-sm">{user.email}</span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
