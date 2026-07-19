import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | CreatorKit",
  description:
    "Read the CreatorKit Privacy Policy and learn how browser-based tools process files and protect user privacy.",
};

const sections = [
  {
    title: "1. Overview",
    paragraphs: [
      "CreatorKit provides free browser-based tools for working with images, colors, QR codes, and other digital content.",
      "This Privacy Policy explains what information may be collected when you use CreatorKit, how that information may be used, and the choices available to you.",
    ],
  },
  {
    title: "2. Files processed by CreatorKit",
    paragraphs: [
      "CreatorKit is designed so that supported image and QR code processing happens directly inside your web browser.",
      "Files you select for browser-based tools are not intentionally uploaded to or stored on CreatorKit servers. Closing or refreshing the page generally clears the working files from the browser session.",
      "You should still avoid processing highly sensitive, confidential, or legally restricted information through any online service.",
    ],
  },
  {
    title: "3. Information collected automatically",
    paragraphs: [
      "Like most websites, CreatorKit may receive limited technical information when you visit, such as browser type, device type, operating system, referring page, approximate region, and pages viewed.",
      "This information may be used to understand website performance, detect technical problems, improve tools, and protect the website from abuse.",
    ],
  },
  {
    title: "4. Cookies and similar technologies",
    paragraphs: [
      "CreatorKit may use cookies, local storage, or similar browser technologies to remember preferences such as your selected appearance theme.",
      "In the future, analytics or advertising services may also use cookies or similar technologies, subject to applicable consent requirements and their own privacy policies.",
    ],
  },
  {
    title: "5. Analytics",
    paragraphs: [
      "CreatorKit may use privacy-conscious analytics services to understand general usage patterns, such as which pages are visited and which tools are most useful.",
      "Analytics data is used to improve the website and is not intended to directly identify individual visitors.",
    ],
  },
  {
    title: "6. Advertising",
    paragraphs: [
      "CreatorKit may display advertising in the future, including advertising provided by Google AdSense or other advertising partners.",
      "Advertising providers may use cookies or similar technologies to show, measure, and personalize advertisements where permitted by law.",
      "When advertising is enabled, this Privacy Policy may be updated with additional information and available opt-out choices.",
    ],
  },
  {
    title: "7. Third-party links",
    paragraphs: [
      "CreatorKit may contain links to third-party websites or services. CreatorKit is not responsible for the privacy practices, content, security, or availability of those third parties.",
      "You should review the privacy policy of any external website you visit.",
    ],
  },
  {
    title: "8. Data security",
    paragraphs: [
      "Reasonable measures are used to protect the website and reduce unauthorized access, misuse, or disruption.",
      "No website, browser, transmission method, or storage system can be guaranteed to be completely secure.",
    ],
  },
  {
    title: "9. Children’s privacy",
    paragraphs: [
      "CreatorKit is not directed specifically at children under the age required to provide independent consent in their country.",
      "CreatorKit does not knowingly collect personal information from children through account registration because no user account is currently required.",
    ],
  },
  {
    title: "10. Your choices",
    paragraphs: [
      "You can clear cookies and local storage through your browser settings. You can also use browser privacy controls, content blockers, or private browsing modes.",
      "Disabling browser storage may prevent some preferences, such as theme selection, from being remembered.",
    ],
  },
  {
    title: "11. Changes to this policy",
    paragraphs: [
      "This Privacy Policy may be updated when CreatorKit adds new features, analytics, advertising, legal requirements, or third-party services.",
      "The updated date shown on this page will be changed when material revisions are made.",
    ],
  },
  {
    title: "12. Contact",
    paragraphs: [
      "Questions about this Privacy Policy can be submitted through the CreatorKit contact page.",
    ],
  },
];

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-400 md:text-lg">
            CreatorKit is built around a simple principle: your files should
            remain under your control whenever possible.
          </p>

          <div className="mt-7 inline-flex rounded-full border border-zinc-800 bg-[#12151d] px-4 py-2 text-sm text-zinc-400">
            Last updated: July 19, 2026
          </div>
        </div>
      </section>

      <section className="px-5 pb-24 md:px-8 md:pb-32">
        <div className="mx-auto max-w-4xl rounded-3xl border border-zinc-800 bg-[#12151d] p-6 md:p-10">
          <div className="mb-10 rounded-2xl border border-violet-500/30 bg-violet-500/10 p-5 md:p-6">
            <h2 className="text-lg font-semibold">Privacy summary</h2>

            <p className="mt-3 leading-7 text-zinc-300">
              Supported tools process files locally in your browser. CreatorKit
              does not intentionally upload or store those working files.
              Limited technical and usage information may be collected to keep
              the website reliable and improve the service.
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

                {section.title === "12. Contact" && (
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
