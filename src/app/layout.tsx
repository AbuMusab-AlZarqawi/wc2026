import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WC2026 Fantasy | Build. Battle. Immortalise.",
  description: "Fantasy football card game on Ritual Chain Testnet — WorldCup 2026 Edition",
  icons: { icon: "/logo.PNG" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
