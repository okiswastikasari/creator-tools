import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About CreatorKit",
  description:
    "Learn about CreatorKit, a collection of free, private, browser-based tools for images, colors, and QR codes.",
};

const values = [
  {
    icon: "✦",
    title: "Simple by default",
    description:
      "Every tool is designed to be easy to understand, even if you have never used an editing tool before.",
  },
  {
    icon: "◎",
    title: "Privacy first",
    description:
      "Your files are processed directly in your browser. CreatorKit does not upload or store your images.",
  },
  {
    icon: "∞",
    title: "Free to use",
    description:
      "CreatorKit is built to make useful everyday tools available without requiring an account or subscription.",
  },
];

const tools = [
  { name: "Compress Image", href: "/compress" },
  { name: "Convert Image", href: "/convert" },
  { name: "Resize Image", href: "/resize" },
  { name: "Crop Image", href: "/crop" },
  { name: "Color Palette", href: "/palette" },
  { name: "QR Generator", href: "/qr" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#090b10] text-white">
      <header className="border-b border-zinc-800/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
          <Link
            href="/"
            className="flex items-center gap-3 font-semibold tracking-tight"
            aria-label="CreatorKit home"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-bold text-zinc-950">
              CK
            </span>
            <span className="text-lg">CreatorKit</span>
          </Link>

          <nav className="flex items-center gap-5 text-sm text-zinc-400">
            <Link className="transition hover:text-white" href="/#tools">
              Tools
            </Link>
            <Link className="text-white" href="/about">
              About
            </Link>
            <Link className="transition hover:text-white" href="/contact">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      <section className="px-5 pb-20 pt-20 md:px-8 md:pb-28 md:pt-28">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-violet-400">
            About CreatorKit
          </p>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-7xl">
            Useful creator tools,
            <span className="block text-violet-400">made refreshingly simple.</span>
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-zinc-400 md:text-lg">
            CreatorKit is a growing collection of free browser-based tools for
            creators, designers, students, small businesses, and anyone who
            needs to finish a simple digital task without complicated software.
          </p>
        </div>
      </section>

      <section className="px-5 pb-20 md:px-8 md:pb-28">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {values.map((value) => (
            <article
              key={value.title}
              className="rounded-3xl border border-zinc-800 bg-[#12151d] p-7"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15 text-xl text-violet-300">
                {value.icon}
              </span>

              <h2 className="mt-6 text-xl font-semibold">{value.title}</h2>

              <p className="mt-3 leading-7 text-zinc-400">
                {value.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 pb-20 md:px-8 md:pb-28">
        <div className="mx-auto grid max-w-6xl gap-10 rounded-3xl border border-zinc-800 bg-[#12151d] p-7 md:grid-cols-2 md:p-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-violet-400">
              Why we built it
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Everyday tasks should not require expensive software.
            </h2>
          </div>

          <div className="space-y-5 leading-8 text-zinc-400">
            <p>
              Many online tools are cluttered with pop-ups, confusing controls,
              forced registrations, and unnecessary steps. CreatorKit takes a
              different approach: choose a tool, complete the task, and download
              the result.
            </p>

            <p>
              Whenever possible, processing happens locally on your device.
              That keeps the experience fast and gives you more control over
              your files.
            </p>

            <p>
              CreatorKit will continue to grow with practical tools and helpful
              guides while keeping the experience lightweight and accessible.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 md:px-8 md:pb-28">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-violet-400">
              Available now
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Six free tools, ready to use.
            </h2>

            <p className="mt-4 leading-7 text-zinc-400">
              No account is required. Pick a tool and start immediately.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex items-center justify-between rounded-2xl border border-zinc-800 bg-[#12151d] px-5 py-5 transition hover:-translate-y-0.5 hover:border-violet-500"
              >
                <span className="font-medium">{tool.name}</span>
                <span className="text-violet-400 transition group-hover:translate-x-1">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-24 md:px-8 md:pb-32">
        <div className="mx-auto max-w-5xl rounded-3xl border border-violet-500/30 bg-violet-500/10 px-7 py-12 text-center md:px-12">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Have a question or tool suggestion?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-zinc-300">
            We welcome feedback, bug reports, and ideas that could make
            CreatorKit more useful.
          </p>

          <Link
            href="/contact"
            className="mt-7 inline-flex rounded-xl bg-violet-500 px-6 py-3 font-semibold transition hover:bg-violet-400"
          >
            Contact CreatorKit
          </Link>
        </div>
      </section>

    </main>
  );
}