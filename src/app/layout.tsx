import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ETC",
  description:
    "ETC is an open-source platform that simplifies email development by offering ready-to-use, customizable HTML & CSS email templates. Preview, publish, contribute, and copy high-quality templates with ease — no config needed.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} dark`}>{children}</body>
    </html>
  );
}
