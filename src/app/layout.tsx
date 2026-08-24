import type { Metadata } from "next";
import "./globals.css";

// Using the system font stack (configured in globals.css) instead of
// next/font/google — it looks great, ships with zero extra weight, and
// doesn't require a network call to Google Fonts at build time. If you'd
// like a custom font later, next/font/google works well once you know
// your build environment has internet access.

export const metadata: Metadata = {
  title: "Martinson Vacation Rentals",
  description:
    "Handpicked vacation rental properties, professionally managed by Martinson Vacation Rentals. Book direct and skip the platform fees.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}
