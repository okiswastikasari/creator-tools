import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CreatorKit — Free Image & Creator Tools",
  description:
    "Free, private browser tools to compress, convert, resize and crop images, extract color palettes, and create QR codes.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
