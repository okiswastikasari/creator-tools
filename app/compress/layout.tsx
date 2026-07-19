import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Compressor – Compress JPG, PNG & WebP Online Free | CreatorKit",
  description:
    "Compress JPG, PNG, and WebP images online for free. Reduce image file size directly in your browser without uploading files.",
};

export default function CompressLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
