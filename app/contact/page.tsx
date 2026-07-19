import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact | CreatorKit",
  description:
    "Get in touch with CreatorKit for questions, bug reports, feature requests, or business enquiries.",
};

const cards = [
  {
    title: "General Questions",
    text: "Need help using a tool or have a general question about CreatorKit?",
  },
  {
    title: "Bug Reports",
    text: "Found something that isn't working? Let us know so we can fix it.",
  },
  {
    title: "Feature Requests",
    text: "Have an idea for a new tool or improvement? We'd love to hear it.",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#090b10] text-white">
      <header className="border-b border-zinc-800/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
          <Link href="/" className="flex items-center gap-3 font-semibold">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-zinc-900 font-bold">CK</span>
            <span>CreatorKit</span>
          </Link>

          <nav className="flex gap-5 text-sm text-zinc-400">
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-20 md:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-400">
          Contact
        </p>

        <h1 className="mt-4 text-5xl font-semibold tracking-tight">
          We'd love your feedback.
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
          Whether you've found a bug, have a feature request, or simply want to
          say hello, feel free to get in touch.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-3xl border border-zinc-800 bg-[#12151d] p-6"
            >
              <h2 className="text-xl font-semibold">{card.title}</h2>
              <p className="mt-3 leading-7 text-zinc-400">{card.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border border-violet-500/30 bg-violet-500/10 p-8">
          <h2 className="text-2xl font-semibold">Email</h2>

          <p className="mt-4 leading-8 text-zinc-300">
            For now, you can contact CreatorKit at:
          </p>

          <a
            href="mailto:kyo.officialstore@gmail.com"
            className="mt-4 inline-block text-xl font-semibold text-violet-300 hover:text-violet-200"
          >
            kyo.officialstore@gmail.com
          </a>

          <p className="mt-5 text-zinc-400">
            We'll do our best to reply as soon as possible.
          </p>
        </div>
      </section>

    </main>
  );
}
