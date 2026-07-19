import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Code Generator – Create QR Codes Online Free | CreatorKit",
  description:
    "Create customizable QR codes online for free. Generate and download PNG or SVG QR codes directly in your browser.",
};

export default function QRLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
