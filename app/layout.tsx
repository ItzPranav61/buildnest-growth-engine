import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BuildNest Growth Engine",
  description: "A simple resource dashboard for the BuildNest Discord community."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
