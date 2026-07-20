"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type ToolShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: string;
  children: ReactNode;
};

export default function ToolShell({
  eyebrow,
  title,
  description,
  icon,
  children,
}: ToolShellProps) {
  return (
    <main className="min-h-screen bg-[#090b10] px-5 py-8 text-white md:px-8 md:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex rounded-full border border-zinc-800 bg-[#12151d] px-4 py-2 text-sm text-zinc-300 transition hover:border-violet-500 hover:text-white"
          >
            ← CreatorKit
          </Link>

          <span className="rounded-full border border-zinc-800 bg-[#12151d] px-3 py-2 text-xs text-zinc-500">
            Private · Browser-based
          </span>
        </div>

        <header className="mx-auto mb-10 max-w-3xl text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-500/10 text-2xl text-violet-300">
            {icon}
          </div>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-violet-400">
            {eyebrow}
          </p>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            {title}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-400 md:text-lg">
            {description}
          </p>
        </header>

        <section className="rounded-3xl border border-zinc-800 bg-[#12151d] p-4 shadow-2xl shadow-black/20 md:p-7">
          {children}
        </section>

        <p className="mt-5 text-center text-xs text-zinc-500">
          Your files stay on your device and are processed locally in your browser.
        </p>
      </div>
    </main>
  );
}

export const ui = {
  panel:
    "rounded-2xl border border-zinc-800 bg-[#0d1016] p-5 md:p-6",
  upload:
    "flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-700 bg-[#0a0d13] px-6 text-center transition hover:border-violet-500 hover:bg-violet-500/[0.03]",
  input:
    "w-full rounded-xl border border-zinc-700 bg-[#12151d] px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500",
  primary:
    "w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3.5 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50",
  secondary:
    "w-full rounded-xl border border-zinc-700 px-5 py-3 font-semibold text-zinc-200 transition hover:border-violet-500 hover:text-violet-300",
  error:
    "rounded-xl border border-red-900/70 bg-red-950/30 px-4 py-3 text-sm text-red-300",
  success:
    "rounded-xl border border-emerald-900/60 bg-emerald-950/20 p-4",
};
