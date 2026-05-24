import type { Metadata } from "next";
import { ScrollbarVisibility } from "@/components/scrollbar-visibility";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eves Market Protocol Docs",
  description:
    "Public documentation for Eves Market prediction markets, collateral, resolution, settlement, and integrations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ScrollbarVisibility />
        {children}
      </body>
    </html>
  );
}
