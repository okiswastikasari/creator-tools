import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-[#090b10]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white font-bold text-zinc-900">
                CK
              </div>
              <h2 className="text-xl font-bold text-white">CreatorKit</h2>
            </div>

            <p className="mt-4 max-w-sm text-sm leading-7 text-zinc-400">
              Free online creator tools for compressing, converting, resizing,
              cropping images, generating QR codes, and more.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white">Tools</h3>

            <ul className="mt-4 space-y-2 text-zinc-400">
              <li><Link href="/compress" className="hover:text-white">Image Compressor</Link></li>
              <li><Link href="/convert" className="hover:text-white">Image Converter</Link></li>
              <li><Link href="/resize" className="hover:text-white">Image Resizer</Link></li>
              <li><Link href="/crop" className="hover:text-white">Image Cropper</Link></li>
              <li><Link href="/palette" className="hover:text-white">Color Palette</Link></li>
              <li><Link href="/qr" className="hover:text-white">QR Generator</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white">Company</h3>

            <ul className="mt-4 space-y-2 text-zinc-400">
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-zinc-800 pt-6 text-sm text-zinc-500 md:flex-row">
          <p>© {new Date().getFullYear()} CreatorKit. All rights reserved.</p>

          <p>Built with ❤️ for creators.</p>
        </div>
      </div>
    </footer>
  );
}
