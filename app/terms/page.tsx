import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | CreatorKit",
  description:
    "Read the CreatorKit Terms of Service covering permitted use, user responsibilities, disclaimers, and service availability.",
};

const sections = [
  {
    title: "1. Acceptance of these terms",
    paragraphs: [
      "By accessing or using CreatorKit, you agree to these Terms of Service. If you do not agree with these terms, you should not use the website or its tools.",
      "These terms apply to all visitors and users of CreatorKit.",
    ],
  },
  {
    title: "2. About CreatorKit",
    paragraphs: [
      "CreatorKit provides free browser-based utilities for images, colors, QR codes, and related digital tasks.",
      "Features may be added, changed, suspended, or removed at any time as the website develops.",
    ],
  },
  {
    title: "3. Permitted use",
    paragraphs: [
      "You may use CreatorKit for lawful personal, educational, creative, and commercial purposes.",
      "You are responsible for ensuring that your use of the website and any files you process complies with applicable laws, regulations, licenses, contracts, and third-party rights.",
    ],
  },
  {
    title: "4. Prohibited use",
    paragraphs: [
      "You must not use CreatorKit to process, create, distribute, or support unlawful, harmful, abusive, deceptive, infringing, or malicious content.",
      "You must not attempt to interfere with the website, bypass security measures, overload the service, introduce malware, scrape the website in a disruptive manner, or reverse engineer protected parts of the service.",
      "You must not represent that CreatorKit endorses your content, business, product, or service without written permission.",
    ],
  },
  {
    title: "5. Your files and content",
    paragraphs: [
      "You retain responsibility for the files, text, links, colors, and other content you submit to or process through CreatorKit.",
      "You should only process content that you own, are authorized to use, or are otherwise legally permitted to handle.",
      "CreatorKit is designed so that supported tools process files locally in your browser. However, you remain responsible for maintaining your own backups and protecting sensitive information.",
    ],
  },
  {
    title: "6. Intellectual property",
    paragraphs: [
      "CreatorKit, including its name, branding, website design, original text, code, and visual elements, is protected by applicable intellectual property laws.",
      "These terms do not transfer ownership of CreatorKit or its intellectual property to you.",
      "You may not copy, reproduce, sell, license, or redistribute substantial parts of the website except where permitted by law or with prior written permission.",
    ],
  },
  {
    title: "7. Tool output",
    paragraphs: [
      "You are responsible for reviewing all output before relying on, publishing, printing, sharing, or distributing it.",
      "Browser differences, source-file quality, compression settings, color profiles, and other technical factors may affect output.",
      "CreatorKit does not guarantee that generated or processed output will be suitable for a particular professional, legal, technical, or commercial purpose.",
    ],
  },
  {
    title: "8. No warranties",
    paragraphs: [
      "CreatorKit is provided on an “as is” and “as available” basis.",
      "To the fullest extent permitted by law, no warranties are made regarding accuracy, reliability, availability, compatibility, security, fitness for a particular purpose, or uninterrupted operation.",
      "CreatorKit may contain errors, interruptions, or features that do not work on every browser or device.",
    ],
  },
  {
    title: "9. Limitation of liability",
    paragraphs: [
      "To the fullest extent permitted by law, CreatorKit and its operators will not be liable for indirect, incidental, special, consequential, or punitive losses arising from your use of or inability to use the website.",
      "This includes loss of files, data, profits, revenue, business opportunities, reputation, or productivity.",
      "Where liability cannot legally be excluded, it will be limited to the minimum amount permitted by applicable law.",
    ],
  },
  {
    title: "10. Third-party services and links",
    paragraphs: [
      "CreatorKit may contain links to or integrations with third-party websites, analytics providers, hosting providers, advertising platforms, or other services.",
      "CreatorKit does not control and is not responsible for third-party content, availability, security, terms, or privacy practices.",
    ],
  },
  {
    title: "11. Advertising",
    paragraphs: [
      "CreatorKit may display advertisements, sponsored placements, or affiliate links in the future.",
      "The presence of advertising does not necessarily mean that CreatorKit endorses the advertised product or service.",
    ],
  },
  {
    title: "12. Service availability",
    paragraphs: [
      "CreatorKit may be unavailable temporarily because of maintenance, technical problems, security concerns, hosting issues, or circumstances outside reasonable control.",
      "No guarantee is made that every tool or page will remain available permanently.",
    ],
  },
  {
    title: "13. Termination or restriction",
    paragraphs: [
      "Access may be restricted or blocked when reasonably necessary to protect the website, other users, infrastructure, legal rights, or service availability.",
      "These terms remain applicable to activity that occurred before access was restricted or ended.",
    ],
  },
  {
    title: "14. Changes to these terms",
    paragraphs: [
      "These Terms of Service may be updated as CreatorKit develops, introduces new tools, adds advertising, or responds to legal or operational changes.",
      "Continued use of CreatorKit after updated terms are posted means you accept the revised terms.",
    ],
  },
  {
    title: "15. Governing principles",
    paragraphs: [
      "These terms should be interpreted in a manner consistent with applicable law.",
      "If any provision is found unenforceable, the remaining provisions will continue to apply.",
    ],
  },
  {
    title: "16. Contact",
    paragraphs: [
      "Questions about these Terms of Service can be submitted through the CreatorKit contact page.",
    ],
  },
];

export default function TermsPage() {
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
            <Link className="transition hover:text-white" href="/about">
              About
            </Link>
            <Link className="transition hover:text-white" href="/contact">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      <section className="px-5 pb-14 pt-16 md:px-8 md:pb-20 md:pt-24">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-400">
            Legal
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            Terms of Service
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-400 md:text-lg">
            These terms explain the rules and responsibilities that apply when
            you use CreatorKit and its browser-based tools.
          </p>

          <div className="mt-7 inline-flex rounded-full border border-zinc-800 bg-[#12151d] px-4 py-2 text-sm text-zinc-400">
            Last updated: July 19, 2026
          </div>
        </div>
      </section>

      <section className="px-5 pb-24 md:px-8 md:pb-32">
        <div className="mx-auto max-w-4xl rounded-3xl border border-zinc-800 bg-[#12151d] p-6 md:p-10">
          <div className="mb-10 rounded-2xl border border-violet-500/30 bg-violet-500/10 p-5 md:p-6">
            <h2 className="text-lg font-semibold">Plain-language summary</h2>

            <p className="mt-3 leading-7 text-zinc-300">
              Use CreatorKit lawfully, only process content you are allowed to
              use, review your output before relying on it, and keep backups of
              important files. The service is provided without guarantees and
              may change over time.
            </p>
          </div>

          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                  {section.title}
                </h2>

                <div className="mt-4 space-y-4">
                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="leading-8 text-zinc-400"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                {section.title === "16. Contact" && (
                  <Link
                    href="/contact"
                    className="mt-5 inline-flex font-semibold text-violet-400 transition hover:text-violet-300"
                  >
                    Visit the contact page →
                  </Link>
                )}
              </section>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
