"use client";

import ToolLayout from "../components/ToolLayout";
import QRCode from "qrcode";
import { useMemo, useState } from "react";

type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export default function QRPage() {
  const [value, setValue] = useState("https://creator-tools-5dflticq4-creators-kit.vercel.app");
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

  return (
    <ToolLayout
      eyebrow="Free utility tool"
      title="QR Code Generator"
      description="Create custom QR codes from any URL or text and download them as PNG or SVG."
      icon={<span>▦</span>}
    >

      <div>
          {errorMessage && (
            <div className="mb-6 rounded-2xl border border-red-900/70 bg-red-950/30 px-4 py-3 text-sm text-red-300">{errorMessage}</div>
          )}

          <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 dark:border-white/10 dark:bg-zinc-100 dark:bg-black/40/20 p-5 md:p-6">
              <h2 className="text-xl font-semibold">QR settings</h2>

              <div className="mt-6">
                <label htmlFor="qr-value" className="mb-2 block text-sm text-zinc-600 dark:text-zinc-400">URL or text</label>
                <textarea
                  id="qr-value"
                  value={value}
                  onChange={(event) => {
                    setValue(event.target.value);
                    setQrPngUrl("");
                    setQrSvg("");
                    setErrorMessage("");
                  }}
                  placeholder="Paste a URL, message, phone number, email, or any text..."
                  rows={5}
                  className="w-full resize-none rounded-2xl border border-zinc-300 bg-white dark:border-white/10 dark:bg-white/5 px-4 py-3 text-zinc-950 dark:text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
                />
                <div className="mt-2 flex items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-500">
                  <span>{value.length} characters</span>
                  <button type="button" onClick={handleCopyText} disabled={!trimmedValue} className="transition hover:text-violet-300 disabled:cursor-not-allowed disabled:opacity-40">
                    {copied ? "Copied" : "Copy text"}
                  </button>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="qr-size" className="mb-2 block text-sm text-zinc-600 dark:text-zinc-400">QR size</label>
                  <select
                    id="qr-size"
                    value={size}
                    onChange={(event) => {
                      setSize(Number(event.target.value));
                      setQrPngUrl("");
                      setQrSvg("");
                    }}
                    className="w-full rounded-2xl border border-zinc-300 bg-white dark:border-white/10 dark:bg-white/5 px-4 py-3 text-zinc-950 dark:text-white outline-none transition focus:border-violet-500"
                  >
                    <option value={256}>256 × 256</option>
                    <option value={320}>320 × 320</option>
                    <option value={512}>512 × 512</option>
                    <option value={768}>768 × 768</option>
                    <option value={1024}>1024 × 1024</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="qr-level" className="mb-2 block text-sm text-zinc-600 dark:text-zinc-400">Error correction</label>
                  <select
                    id="qr-level"
                    value={errorCorrectionLevel}
                    onChange={(event) => {
                      setErrorCorrectionLevel(event.target.value as ErrorCorrectionLevel);
                      setQrPngUrl("");
                      setQrSvg("");
                    }}
                    className="w-full rounded-2xl border border-zinc-300 bg-white dark:border-white/10 dark:bg-white/5 px-4 py-3 text-zinc-950 dark:text-white outline-none transition focus:border-violet-500"
                  >
                    <option value="L">Low</option>
                    <option value="M">Medium</option>
                    <option value="Q">Quartile</option>
                    <option value="H">High</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-100 dark:bg-black/40/20 p-4">
                  <span className="block text-sm text-zinc-600 dark:text-zinc-400">QR color</span>
                  <div className="mt-3 flex items-center gap-3">
                    <input type="color" value={foreground} onChange={(event) => { setForeground(event.target.value); setQrPngUrl(""); setQrSvg(""); }} className="h-10 w-14 cursor-pointer rounded border-0 bg-transparent" />
                    <span className="font-mono text-sm">{foreground.toUpperCase()}</span>
                  </div>
                </label>

                <label className="rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-100 dark:bg-black/40/20 p-4">
                  <span className="block text-sm text-zinc-600 dark:text-zinc-400">Background</span>
                  <div className="mt-3 flex items-center gap-3">
                    <input type="color" value={background} onChange={(event) => { setBackground(event.target.value); setQrPngUrl(""); setQrSvg(""); }} className="h-10 w-14 cursor-pointer rounded border-0 bg-transparent" />
                    <span className="font-mono text-sm">{background.toUpperCase()}</span>
                  </div>
                </label>
              </div>

              <button type="button" onClick={handleGenerate} disabled={isGenerating || !trimmedValue} className="mt-8 w-full rounded-2xl bg-violet-600 px-5 py-3 font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50">
                {isGenerating ? "Generating..." : "Generate QR code"}
              </button>

              <button type="button" onClick={handleReset} className="mt-3 w-full rounded-2xl border border-zinc-300 dark:border-white/15 px-5 py-3 font-semibold transition hover:border-violet-500 hover:text-violet-300">Reset</button>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 dark:border-white/10 dark:bg-zinc-100 dark:bg-black/40/20 p-5 md:p-6">
              <h2 className="text-xl font-semibold">QR preview</h2>
              <div className="mt-6 flex min-h-[360px] items-center justify-center rounded-2xl border border-dashed border-zinc-300 dark:border-white/15 p-6" style={{ backgroundColor: qrPngUrl ? background : undefined }}>
                {qrPngUrl ? (
                  <img src={qrPngUrl} alt="Generated QR code" className="h-auto max-h-[320px] w-full max-w-[320px]" />
                ) : (
                  <div className="text-center">
                    <div className="text-5xl">▦</div>
                    <p className="mt-4 font-medium text-zinc-300">Your QR code will appear here</p>
                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">Enter text and click Generate QR code.</p>
                  </div>
                )}
              </div>

              {qrPngUrl && (
                <div className="mt-5 space-y-3">
                  <button type="button" onClick={handleDownloadPng} className="w-full rounded-2xl bg-white px-5 py-3 font-semibold text-zinc-950 transition hover:bg-zinc-200">Download PNG</button>
                  <button type="button" onClick={handleDownloadSvg} className="w-full rounded-2xl border border-zinc-300 dark:border-white/15 px-5 py-3 font-semibold transition hover:border-violet-500 hover:text-violet-300">Download SVG</button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-4 text-sm text-zinc-600 dark:text-zinc-400 md:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 dark:border-white/10 dark:bg-zinc-100 dark:bg-black/40/20 p-5">
              <p className="font-semibold text-zinc-950 dark:text-white">No uploads</p>
              <p className="mt-2 leading-6">Your text is processed locally in your browser.</p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 dark:border-white/10 dark:bg-zinc-100 dark:bg-black/40/20 p-5">
              <p className="font-semibold text-zinc-950 dark:text-white">PNG and SVG</p>
              <p className="mt-2 leading-6">Download a sharp file for digital use or printing.</p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 dark:border-white/10 dark:bg-zinc-100 dark:bg-black/40/20 p-5">
              <p className="font-semibold text-zinc-950 dark:text-white">Custom colors</p>
              <p className="mt-2 leading-6">Match the QR code to your personal or business branding.</p>
            </div>
          </div>
      </div>
    </ToolLayout>
  );
}
