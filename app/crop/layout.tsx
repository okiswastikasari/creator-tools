import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Cropper – Crop Images Online Free | CreatorKit",
  description:
    "Crop images online for free with an easy browser-based image cropper. Adjust the crop area and download your result instantly.",
};

export default function CropLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
