"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { label: "Tools", href: "/#tools" },
  { label: "Features", href: "/#features" },
  { label: "FAQ", href: "/#faq" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="ck-surface flex h-10 w-10 items-center justify-center rounded-full border text-xl"
        aria-label="Open navigation menu"
        aria-expanded={open}
      >
        {open ? "×" : "≡"}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close navigation menu"
            className="fixed inset-0 z-40 cursor-default bg-black/30"
            onClick={() => setOpen(false)}
          />

          <nav className="ck-surface absolute right-0 top-12 z-50 w-64 rounded-2xl border p-3 shadow-2xl">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 font-semibold transition hover:opacity-70"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/#tools"
              onClick={() => setOpen(false)}
              className="ck-primary-button mt-2 flex justify-center rounded-xl px-4 py-3 font-bold"
            >
              Open tools
            </Link>
          </nav>
        </>
      )}
    </div>
  );
}
