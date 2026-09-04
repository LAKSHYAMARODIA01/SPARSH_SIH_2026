import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPARSH — Startup Procurement, Acceleration, Risk-sharing & Scaling Hub",
  description: "Government of Maharashtra MSInS Innovation Pipeline Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#07080a] text-[#f4f4f6] antialiased">
        {children}
      </body>
    </html>
  );
}
