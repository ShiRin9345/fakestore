import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register - Shop",
  description: "Create a new account to start shopping",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
