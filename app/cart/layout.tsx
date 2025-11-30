import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart - Shop",
  description: "View and manage your shopping cart",
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

