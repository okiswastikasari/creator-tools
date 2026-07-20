"use client";

import Link from "next/link";
import QRCode from "qrcode";
import { useMemo, useState } from "react";

type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export default function QRPage() {
  const [value, setValue] = useState("https://creator-tools-two.vercel.app");
  const [size, setSize] = useState(320);
  const [foreground, setForeground] = useState("#111827");
  const [background, setBackground] = useState("#FFFFFF");
  const [errorCorrectionLevel, setErrorCorrectionLevel] =
    useState<ErrorCorrectionLevel>("M");
  const [qrPngUrl, setQrPngUrl] = useState("");
  const [qrSvg, setQrSvg] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const trimmedValue = useMemo(() => value.trim(), [value]);

  function clearResult() {
    setQrPngUrl("");
    setQrSvg("");
    setErrorMessage("");
  }

  async function handleGenerate() {
    if (!trimmedValue) {
      setErrorMessage("Please enter a URL or text first.");
      setQrPngUrl("");
      setQrSvg("");
      return;
    }

    try {
      setIsGenerating(true);
      setErrorMessage("");

      const commonOptions = {
        width: size,
        margin: 2,
        errorCorrectionLevel,
        color: { dark: foreground, light: background },
      };

      const [pngUrl, svgText] = await Promise.all([
        QRCode.toDataURL(trimmedValue, {
          ...commonOptions,
          type: "image/png",
        }),
        QRCode.toString(trimmedValue, {
          ...commonOptions,
          type: "svg",
        }),
      ]);

      setQrPngUrl(pngUrl);
      setQrSvg(svgText);
    } catch (error) {
      console.error(error);
      setErrorMessage("Could not generate the QR code. Please try again.");
      setQrPngUrl("");
      setQrSvg("");
    } finally {
      setIsGenerating(false);
    }
  }

  function handleDownloadPng() {
    if (!qrPngUrl) return;
    const link = document.createElement("a");
    link.href = qrPngUrl;
    link.download = "creatorkit-qr-code.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function handleDownloadSvg() {
    if (!qrSvg) return;
    const blob = new Blob([qrSvg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "creatorkit-qr-code.svg";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  async function handleCopyText() {
    if (!trimmedValue) return;
    try {
      await navigator.clipboard.writeText(trimmedValue);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setErrorMessage("Could not copy the text.");
    }
  }

  function handleReset() {
    setValue("");
    setSize(320);
    setForeground("#111827");
    setBackground("#FFFFFF");
    setErrorCorrectionLevel("M");
    setQrPngUrl("");
    setQrSvg("");
    setErrorMessage("");
    setCopied(false);
  }

  const panelClass =
    "rounded-2xl border border-zinc-200 bg-white p-5 text-zinc-950 shadow-sm dark:border-zinc-800 dark:bg-[#0d1016] dark:text-white md:p-6";

  const fieldClass =
    "w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-[#12151d] dark:text-white dark:placeholder:text-zinc-600";

  return (
    <main className="min-h-screen bg-[#090b10] px-5 py-10 text-white md:px-8 md:py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex rounded-full border border-zinc-800 bg-zinc-900/70 px-4 py-2 text-sm text-zinc-200 transition hover:border-violet-500 hover:text-violet-300"
          >
            ← CreatorKit
          </Link>

          <span className="rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-1.5 text-xs text-zinc-400">
            Private · Browser-based
          </span>
        </div>

        <header className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-500/10 text-xl text-violet-300">
            ▦
          </div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-violet-400">
            Free utility tool
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            QR Code Generator
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-400 md:text-lg">
            Create custom QR codes from any URL or text and download them as PNG or SVG.
          </p>
        </header>

        <section className="rounded-3xl border border-zinc-800 bg-[#12151d] p-4 shadow-2xl shadow-black/20 md:p-7">
          {errorMessage && (
            <div className="mb-6 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {errorMessage}
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
            <div className={panelClass}>
              <h2 className="text-xl font-semibold">QR settings</h2>

              <div className="mt-6">
                <label htmlFor="qr-value" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  URL or text
                </label>
                <textarea
                  id="qr-value"
                  value={value}
                  onChange={(event) => {
                    setValue(event.target.value);
                    clearResult();
                  }}
                  placeholder="Paste a URL, message, phone number, email, or any text..."
                  rows={5}
                  className={`${fieldClass} resize-none`}
                />
                <div className="mt-2 flex items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                  <span>{value.length} characters</span>
                  <button
                    type="button"
                    onClick={handleCopyText}
                    disabled={!trimmedValue}
                    className="font-medium text-violet-600 transition hover:text-violet-500 disabled:cursor-not-allowed disabled:opacity-40 dark:text-violet-300"
                  >
                    {copied ? "Copied!" : "Copy text"}
                  </button>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="qr-size" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    QR size
                  </label>
                  <select
                    id="qr-size"
                    value={size}
                    onChange={(event) => {
                      setSize(Number(event.target.value));
                      clearResult();
                    }}
                    className={fieldClass}
                  >
                    <option value={256}>256 × 256</option>
                    <option value={320}>320 × 320</option>
                    <option value={512}>512 × 512</option>
                    <option value={768}>768 × 768</option>
                    <option value={1024}>1024 × 1024</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="qr-level" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Error correction
                  </label>
                  <select
                    id="qr-level"
                    value={errorCorrectionLevel}
                    onChange={(event) => {
                      setErrorCorrectionLevel(event.target.value as ErrorCorrectionLevel);
                      clearResult();
                    }}
                    className={fieldClass}
                  >
                    <option value="L">Low</option>
                    <option value="M">Medium</option>
                    <option value="Q">Quartile</option>
                    <option value="H">High</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-[#12151d]">
                  <span className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">QR color</span>
                  <div className="mt-3 flex items-center gap-3">
                    <input
                      type="color"
                      value={foreground}
                      onChange={(event) => {
                        setForeground(event.target.value);
                        clearResult();
                      }}
                      className="h-10 w-14 cursor-pointer rounded border-0 bg-transparent"
                    />
                    <span className="font-mono text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                      {foreground.toUpperCase()}
                    </span>
                  </div>
                </label>

                <label className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-[#12151d]">
                  <span className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Background</span>
                  <div className="mt-3 flex items-center gap-3">
                    <input
                      type="color"
                      value={background}
                      onChange={(event) => {
                        setBackground(event.target.value);
                        clearResult();
                      }}
                      className="h-10 w-14 cursor-pointer rounded border-0 bg-transparent"
                    />
                    <span className="font-mono text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                      {background.toUpperCase()}
                    </span>
                  </div>
                </label>
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || !trimmedValue}
                className="mt-8 w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isGenerating ? "Generating..." : "Generate QR code"}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="mt-3 w-full rounded-xl border border-zinc-300 bg-white px-5 py-3 font-semibold text-zinc-800 transition hover:border-violet-500 hover:text-violet-600 dark:border-zinc-700 dark:bg-transparent dark:text-zinc-200 dark:hover:text-violet-300"
              >
                Reset
              </button>
            </div>

            <div className={panelClass}>
              <h2 className="text-xl font-semibold">QR preview</h2>
              <div
                className="mt-6 flex min-h-[360px] items-center justify-center rounded-2xl border border-dashed border-zinc-300 p-6 dark:border-zinc-700"
                style={{ backgroundColor: qrPngUrl ? background : undefined }}
              >
                {qrPngUrl ? (
                  <img src={qrPngUrl} alt="Generated QR code" className="h-auto max-h-[320px] w-full max-w-[320px]" />
                ) : (
                  <div className="text-center">
                    <div className="text-5xl text-zinc-400 dark:text-zinc-500">▦</div>
                    <p className="mt-4 font-semibold text-zinc-800 dark:text-zinc-200">Your QR code will appear here</p>
                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Enter text and click Generate QR code.</p>
                  </div>
                )}
              </div>

              {qrPngUrl && (
                <div className="mt-5 space-y-3">
                  <button type="button" onClick={handleDownloadPng} className="w-full rounded-xl bg-zinc-950 px-5 py-3 font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200">
                    Download PNG
                  </button>
                  <button type="button" onClick={handleDownloadSvg} className="w-full rounded-xl border border-zinc-300 px-5 py-3 font-semibold text-zinc-800 transition hover:border-violet-500 hover:text-violet-600 dark:border-zinc-700 dark:text-zinc-200 dark:hover:text-violet-300">
                    Download SVG
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              { title: "No uploads", text: "Your text is processed locally in your browser." },
              { title: "PNG and SVG", text: "Download a sharp file for digital use or printing." },
              { title: "Custom colors", text: "Match your QR code to your personal or business branding." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-zinc-200 bg-white p-5 text-zinc-950 dark:border-zinc-800 dark:bg-[#0d1016] dark:text-white">
                <p className="font-semibold">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-5 text-center text-xs text-zinc-500">
          Your files stay on your device and are processed locally in your browser.
        </p>
      </div>
    </main>
  );
}
