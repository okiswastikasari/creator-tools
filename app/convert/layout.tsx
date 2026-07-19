import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Converter – Convert JPG, PNG & WebP Online | CreatorKit",
  description:
    "Convert images between JPG, PNG, and WebP formats online for free. Fast browser-based conversion with no file uploads.",
};

export default function ConvertLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
