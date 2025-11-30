import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Shop",
  description: "Sign in to your account to start shopping",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

