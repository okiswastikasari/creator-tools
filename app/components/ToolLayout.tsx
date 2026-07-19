"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type ToolLayoutProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
};

export default function ToolLayout({
  eyebrow,
  title,
  description,
  icon,
  children,
}: ToolLayoutProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-50 px-4 py-8 text-zinc-950 dark:bg-[#080a0f] dark:text-white sm:px-6 md:py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10rem] top-[-8rem] h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute right-[-8rem] top-28 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-[-10rem] left-1/3 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-violet-400 hover:text-violet-600 dark:border-white/10 dark:bg-white/5 dark:hover:text-violet-300"
          >
            <span aria-hidden>←</span>
            CreatorKit
          </Link>

          <span className="hidden rounded-full border border-zinc-200 bg-white/70 px-3 py-1.5 text-xs text-zinc-500 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-zinc-400 sm:inline-flex">
            Private · Browser-based
          </span>
        </div>

        <header className="mx-auto mb-10 max-w-3xl text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-200 bg-violet-100 text-2xl shadow-lg shadow-violet-500/10 dark:border-violet-400/20 dark:bg-violet-500/10">
            {icon}
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-600 dark:text-violet-400">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl md:text-6xl">
            {title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400 md:text-lg">
            {description}
          </p>
        </header>

        <section className="rounded-[2rem] border border-zinc-200/80 bg-white/80 p-4 shadow-2xl shadow-zinc-950/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045] dark:shadow-black/30 sm:p-6 md:p-8">
          {children}
        </section>

        <p className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-500">
          Your files stay on your device and are processed locally in your browser.
        </p>
      </div>
    </main>
  );
}
