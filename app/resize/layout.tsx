import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Resizer – Resize Images Online Free | CreatorKit",
  description:
    "Resize JPG, PNG, and WebP images online for free. Choose custom dimensions and process files securely in your browser.",
};

export default function ResizeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
