"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from "lucide-react";
import { useState } from "react";

interface CartItemProps {
  id: number;
  product: {
    id: number;
    title: string;
    price: number;
    image: string;
  };
  quantity: number;
  onUpdateQuantity: (id: number, quantity: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function CartItem({
  id,
  product,
  quantity,
  onUpdateQuantity,
  onDelete,
}: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleIncrease = async () => {
    setIsUpdating(true);
    await onUpdateQuantity(id, quantity + 1);
    setIsUpdating(false);
  };

  const handleDecrease = async () => {
    if (quantity > 1) {
      setIsUpdating(true);
      await onUpdateQuantity(id, quantity - 1);
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(id);
    setIsDeleting(false);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative w-24 h-24 bg-gray-100 rounded-md shrink-0">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-contain p-2"
              loading="lazy"
              sizes="96px"
            />
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold line-clamp-2">{product.title}</h3>
              <p className="text-lg font-bold mt-2">
                ${(product.price * quantity).toFixed(2)}
              </p>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDecrease}
                  disabled={isUpdating || quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleIncrease}
                  disabled={isUpdating}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
