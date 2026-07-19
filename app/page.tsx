import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import MobileNav from "./components/MobileNav";
import ThemeToggle from "./components/ThemeToggle";

export const metadata: Metadata = {
  title: "Creator Tools – Free Online Image, Color & QR Tools",
  description:
    "Free browser-based tools to compress, convert, resize and crop images, extract color palettes, and generate QR codes.",
};

const tools = [
  {
    title: "Image Compressor",
    shortTitle: "Compress",
    description:
      "Reduce JPG, PNG, and WebP file size while keeping your images sharp.",
    href: "/compress",
    icon: "↘",
    formats: "JPG · PNG · WebP",
  },
  {
    title: "Image Converter",
    shortTitle: "Convert",
    description:
      "Convert common image formats directly in your browser without uploading.",
    href: "/convert",
    icon: "↻",
    formats: "JPG · PNG · WebP",
  },
  {
    title: "Image Resizer",
    shortTitle: "Resize",
    description:
      "Set custom dimensions for websites, online stores, and social media.",
    href: "/resize",
    icon: "↗",
    formats: "Custom dimensions",
  },
  {
    title: "Image Cropper",
    shortTitle: "Crop",
    description:
      "Reframe your image quickly with an easy browser-based crop editor.",
    href: "/crop",
    icon: "⌗",
    formats: "Flexible crop area",
  },
  {
    title: "Color Palette",
    shortTitle: "Palette",
    description:
      "Extract useful HEX colors from an image for your next creative project.",
    href: "/palette",
    icon: "◉",
    formats: "HEX color output",
  },
  {
    title: "QR Code Generator",
    shortTitle: "QR Code",
    description:
      "Create customizable QR codes and download them as PNG or SVG.",
    href: "/qr",
    icon: "▦",
    formats: "PNG · SVG",
  },
];

const benefits = [
  {
    number: "01",
    title: "Private by design",
    description:
      "Supported files are processed locally in your browser instead of being intentionally uploaded to our servers.",
  },
  {
    number: "02",
    title: "Fast by default",
    description:
      "Each tool focuses on one task, so you can finish without menus, accounts, or complicated setup.",
  },
  {
    number: "03",
    title: "Made for real workflows",
    description:
      "Useful for creators, designers, store owners, marketers, students, and small teams.",
  },
];

const faqs = [
  {
    question: "Is Creator Tools free?",
    answer:
      "Yes. The current tools are free to use and do not require an account.",
  },
  {
    question: "Do you upload my files?",
    answer:
      "Supported image processing is designed to happen locally in your browser. Your working files are not intentionally uploaded to Creator Tools servers.",
  },
  {
    question: "Does it work on mobile and tablet?",
    answer:
      "Yes. The homepage and tools are designed to adapt to desktop, tablet, and mobile screens.",
  },
  {
    question: "Can I use the results commercially?",
    answer:
      "Yes, provided that you own or have permission to use the original content and comply with applicable licenses and laws.",
  },
];

export default function HomePage() {
  return (
    <main className="ck-page min-h-screen overflow-hidden">
      <header className="ck-header sticky top-0 z-50 border-b backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3 font-semibold"
            aria-label="Creator Tools home"
          >
            <span className="ck-surface flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border">
              <Image
                src="/creator-tools-icon.png"
                alt=""
                width={40}
                height={40}
                priority
              />
            </span>
            <span className="truncate text-lg">Creator Tools</span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm lg:flex">
            <Link href="#tools" className="ck-muted transition hover:opacity-70">
              Tools
            </Link>
            <Link
              href="#features"
              className="ck-muted transition hover:opacity-70"
            >
              Features
            </Link>
            <Link href="#faq" className="ck-muted transition hover:opacity-70">
              FAQ
            </Link>
            <Link href="/about" className="ck-muted transition hover:opacity-70">
              About
            </Link>
            <Link
              href="/contact"
              className="ck-muted transition hover:opacity-70"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="#tools"
              className="ck-primary-button hidden rounded-full px-4 py-2 text-sm font-bold transition sm:inline-flex"
            >
              Open tools
            </Link>
            <MobileNav />
          </div>
        </div>
      </header>

      <section className="relative px-5 pb-20 pt-14 md:px-8 md:pb-28 md:pt-20">
        <div className="pointer-events-none absolute left-[8%] top-16 h-72 w-72 rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="pointer-events-none absolute right-[6%] top-32 h-72 w-72 rounded-full bg-fuchsia-500/15 blur-[120px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] xl:gap-16">
          <div className="text-center lg:text-left">
            <div
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold"
              style={{
                background: "var(--ck-accent-soft)",
                borderColor: "var(--ck-border)",
                color: "var(--ck-accent)",
              }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: "var(--ck-accent)" }}
              />
              Fast, private, and free
            </div>

            <h1 className="mt-7 text-5xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-6xl xl:text-7xl">
              Essential tools
              <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
                for everyday creators.
              </span>
            </h1>

            <p className="ck-muted mx-auto mt-7 max-w-2xl text-base leading-8 sm:text-lg lg:mx-0">
              Compress, convert, resize, crop, extract colors, and generate QR
              codes directly in your browser—without complicated software.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <Link
                href="#tools"
                className="ck-primary-button inline-flex min-w-48 items-center justify-center rounded-full px-6 py-3 font-bold transition"
              >
                Start creating
              </Link>
              <Link
                href="/about"
                className="ck-secondary-button inline-flex min-w-48 items-center justify-center rounded-full px-6 py-3 font-bold transition"
              >
                See how it works
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold lg:justify-start">
              {["No signup", "Browser-based", "Mobile friendly"].map((item) => (
                <span
                  key={item}
                  className="ck-surface inline-flex items-center gap-2 rounded-full border px-4 py-2"
                >
                  <span className="text-emerald-400">✓</span>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div
              className="absolute inset-10 rounded-[2.5rem] blur-3xl"
              style={{ background: "var(--ck-accent-soft)" }}
            />
            <div className="ck-surface relative overflow-hidden rounded-[2rem] border p-2 shadow-2xl">
              <Image
                src="/creator-tools-hero.webp"
                alt="Creator Tools preview showing image compression, cropping, color palette extraction, and QR code generation"
                width={1536}
                height={1024}
                className="h-auto w-full rounded-[1.6rem]"
                priority
              />
            </div>

            <div className="ck-surface absolute -bottom-5 left-4 hidden rounded-2xl border px-4 py-3 shadow-xl sm:block lg:-left-6">
              <p className="text-sm font-semibold">6 useful tools</p>
              <p className="ck-muted mt-1 text-xs">One clean workspace</p>
            </div>
          </div>
        </div>
      </section>

      <section id="tools" className="scroll-mt-24 px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="ck-accent text-sm font-semibold uppercase tracking-[0.24em]">
                Creator toolkit
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
                Pick a tool and get it done.
              </h2>
            </div>
            <p className="ck-muted max-w-2xl text-lg leading-8 lg:justify-self-end">
              Every tool focuses on one job, so you can move from upload to
              result without unnecessary steps.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {tools.map((tool) => (
              <Link
                key={tool.title}
                href={tool.href}
                className="ck-surface group relative overflow-hidden rounded-3xl border p-6 transition duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between">
                  <span
                    className="ck-surface-2 flex h-12 w-12 items-center justify-center rounded-2xl border text-xl font-semibold"
                    style={{ color: "var(--ck-accent)" }}
                  >
                    {tool.icon}
                  </span>
                  <span className="ck-muted text-xl transition group-hover:translate-x-1">
                    →
                  </span>
                </div>

                <h3 className="mt-8 text-xl font-semibold">{tool.title}</h3>
                <p className="ck-muted mt-3 min-h-20 leading-7">
                  {tool.description}
                </p>

                <div className="mt-6 flex items-center justify-between gap-4">
                  <span className="ck-accent font-bold">
                    {tool.shortTitle} →
                  </span>
                  <span className="ck-muted text-xs">{tool.formats}</span>
                </div>

                <div className="pointer-events-none absolute -bottom-16 -right-16 h-36 w-36 rounded-full bg-violet-500/0 blur-3xl transition group-hover:bg-violet-500/15" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        id="features"
        className="scroll-mt-24 px-5 py-20 md:px-8 md:py-28"
      >
        <div className="ck-surface mx-auto max-w-7xl rounded-[2rem] border p-7 md:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="ck-accent text-sm font-semibold uppercase tracking-[0.24em]">
                Why Creator Tools
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Built to remove friction from small creative tasks.
              </h2>
              <p className="ck-muted mt-5 leading-8">
                No oversized software. No forced account. Just focused tools
                that work across desktop, tablet, and mobile.
              </p>
            </div>

            <div className="grid gap-4">
              {benefits.map((benefit) => (
                <div
                  key={benefit.number}
                  className="ck-surface-2 rounded-2xl border p-6"
                >
                  <div className="flex gap-4">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                      style={{
                        color: "var(--ck-accent)",
                        background: "var(--ck-accent-soft)",
                      }}
                    >
                      {benefit.number}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold">{benefit.title}</h3>
                      <p className="ck-muted mt-2 leading-7">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="ck-accent text-sm font-semibold uppercase tracking-[0.24em]">
              FAQ
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Questions, answered.
            </h2>
          </div>

          <div className="mt-12 space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="ck-surface group rounded-2xl border p-5"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-semibold">
                  {faq.question}
                  <span className="ck-accent text-xl transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="ck-muted mt-4 max-w-3xl leading-7">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-24 md:px-8 md:pb-32">
        <div
          className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border px-6 py-14 text-center md:px-12 md:py-20"
          style={{
            background:
              "linear-gradient(135deg, var(--ck-accent-soft), var(--ck-surface))",
            borderColor: "var(--ck-border)",
          }}
        >
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to make your next task easier?
          </h2>
          <p className="ck-muted mx-auto mt-4 max-w-2xl leading-8">
            Choose a tool, process your file, and download the result. No
            registration needed.
          </p>
          <Link
            href="#tools"
            className="ck-primary-button mt-8 inline-flex rounded-full px-6 py-3 font-bold transition"
          >
            Explore all tools
          </Link>
        </div>
      </section>
    </main>
  );
}
