import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import SmoothScroll from "./components/SmoothScroll";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dot & Key — Strawberry Dew Skincare",
  description:
    "Fruit-powered skincare. Strawberry Dew moisturizer, lip balm and serums that melt like cream and glow like dew.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable} antialiased`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
