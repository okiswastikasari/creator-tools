"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ToolId = "compress" | "convert" | "resize" | "crop" | "palette" | "qr";

type ToolItem = {
  id: ToolId;
  icon: string;
  title: string;
  description: string;
};

const tools: ToolItem[] = [
  { id: "compress", icon: "↘", title: "Compress Image", description: "Reduce JPG, PNG, and WebP file sizes." },
  { id: "convert", icon: "⇄", title: "Convert Image", description: "Convert between JPG, PNG, and WebP." },
  { id: "resize", icon: "↔", title: "Resize Image", description: "Change image dimensions while keeping quality." },
  { id: "crop", icon: "⌗", title: "Crop Image", description: "Drag, zoom, and crop images precisely." },
  { id: "palette", icon: "◉", title: "Color Palette", description: "Extract useful colors from any image." },
  { id: "qr", icon: "▦", title: "QR Generator", description: "Create downloadable QR codes instantly." },
];

export default function ToolSuite() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("creatorkit-theme");
    const shouldUseDark = savedTheme
      ? savedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;

    setDarkMode(shouldUseDark);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    window.localStorage.setItem(
      "creatorkit-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  return (
    <main>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="CreatorKit home">
          <span>CK</span>
          <strong>CreatorKit</strong>
        </Link>

        <nav>
          <a href="#tools">Tools</a>
          <a href="#privacy">Privacy</a>
        </nav>

        <button
          className="theme-button"
          type="button"
          onClick={() => setDarkMode((value) => !value)}
          aria-label="Toggle dark mode"
        >
          {darkMode ? "☀" : "☾"}
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-badge">100% free · no sign-up · private</div>

        <h1>
          Everyday creator tools,
          <br />
          <span>without the clutter.</span>
        </h1>

        <p>
          Compress, convert, resize, crop, generate palettes, and create QR
          codes. Everything runs directly in your browser.
        </p>

        <div className="hero-actions">
          <Link className="primary-button" href="/compress">
            Start with an image
          </Link>

          <a className="secondary-button" href="#tools">
            Browse all tools
          </a>
        </div>

        <div className="trust-row">
          <span>✓ No account</span>
          <span>✓ No uploads</span>
          <span>✓ Works on mobile</span>
        </div>
      </section>

      <section className="tools-section" id="tools">
        <div className="section-heading">
          <p className="eyebrow">Six useful tools</p>
          <h2>Simple enough for anyone</h2>
          <p>Choose a tool and finish the task in a few clicks.</p>
        </div>

        <div className="tool-cards">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={`/${tool.id}`}
              className="tool-card"
            >
              <span className="tool-icon">{tool.icon}</span>
              <strong>{tool.title}</strong>
              <p>{tool.description}</p>
              <small>Open tool →</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="privacy-section" id="privacy">
        <div>
          <p className="eyebrow">Privacy by design</p>
          <h2>Your files stay on your device.</h2>
        </div>

        <p>
          Image processing happens locally using your browser. CreatorKit does
          not upload or store your images. Closing or refreshing the page clears
          the working files.
        </p>
      </section>

      <section className="ad-placeholder" aria-label="Advertisement placeholder">
        <span>Advertisement space</span>
        <small>Add Google AdSense here after your site is approved.</small>
      </section>

      <footer>
        <Link className="brand" href="/">
          <span>CK</span>
          <strong>CreatorKit</strong>
        </Link>

        <p>Free, lightweight browser tools for everyone.</p>
        <small>© {new Date().getFullYear()} CreatorKit</small>
      </footer>
    </main>
  );
}
