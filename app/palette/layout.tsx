import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Color Palette Generator from Image | CreatorKit",
  description:
    "Extract a color palette from any image online. Generate useful HEX colors directly in your browser for free.",
};

export default function PaletteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
