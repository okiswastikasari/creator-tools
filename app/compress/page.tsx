"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";

export default function CompressPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);
  const [quality, setQuality] = useState(0.8);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      return;
    }

    setOriginalFile(file);
    setCompressedFile(null);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleCompress() {
    if (!originalFile) {
      alert("Please choose an image first.");
      return;
    }

    try {
      setIsCompressing(true);

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 2400,
        useWebWorker: true,
        initialQuality: quality,
      };

      const result = await imageCompression(originalFile, options);

      setCompressedFile(result);
    } catch (error) {
      console.error(error);
      alert("Compression failed. Please try another image.");
    } finally {
      setIsCompressing(false);
    }
  }

  function handleDownload() {
    if (!compressedFile) return;

    const url = URL.createObjectURL(compressedFile);
    const link = document.createElement("a");

    link.href = url;
    link.download = `compressed-${originalFile?.name ?? "image"}`;
    link.click();

    URL.revokeObjectURL(url);
  }

  function formatBytes(bytes: number) {
    if (bytes === 0) return "0 KB";

    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return (
    <main className="min-h-screen bg-[#090b10] px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <a
          href="/"
          className="mb-8 inline-block text-sm text-violet-400 hover:text-violet-300"
        >
          ← Back to CreatorKit
        </a>

        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            Free image tool
          </p>

          <h1 className="text-4xl font-semibold md:text-6xl">
            Compress Image
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base text-zinc-400 md:text-lg">
            Reduce JPG, PNG, and WebP file sizes directly in your browser.
            Your image is not uploaded to a server.
          </p>
        </div>

        <section className="rounded-3xl border border-zinc-800 bg-[#12151d] p-6 md:p-10">
          <label className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-700 bg-[#0d1016] px-6 text-center transition hover:border-violet-500">
            <span className="mb-4 text-4xl">🖼️</span>

            <span className="text-lg font-semibold">
              Choose an image
            </span>

            <span className="mt-2 text-sm text-zinc-500">
              JPG, PNG, or WebP
            </span>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {originalFile && (
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-black">
                <img
                  src={previewUrl}
                  alt="Selected preview"
                  className="h-72 w-full object-contain"
                />
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-[#0d1016] p-6">
                <h2 className="text-lg font-semibold">Compression settings</h2>

                <div className="mt-6">
                  <div className="mb-3 flex justify-between text-sm">
                    <span className="text-zinc-400">Quality</span>
                    <span>{Math.round(quality * 100)}%</span>
                  </div>

                  <input
                    type="range"
                    min="0.2"
                    max="1"
                    step="0.05"
                    value={quality}
                    onChange={(event) =>
                      setQuality(Number(event.target.value))
                    }
                    className="w-full"
                  />
                </div>

                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Original size</span>
                    <span>{formatBytes(originalFile.size)}</span>
                  </div>

                  {compressedFile && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Compressed size</span>
                        <span>{formatBytes(compressedFile.size)}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-zinc-500">Saved</span>
                        <span className="text-emerald-400">
                          {Math.max(
                            0,
                            Math.round(
                              (1 - compressedFile.size / originalFile.size) * 100
                            )
                          )}
                          %
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <button
                  onClick={handleCompress}
                  disabled={isCompressing}
                  className="mt-8 w-full rounded-xl bg-violet-500 px-5 py-3 font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isCompressing ? "Compressing..." : "Compress image"}
                </button>

                {compressedFile && (
                  <button
                    onClick={handleDownload}
                    className="mt-3 w-full rounded-xl border border-zinc-700 px-5 py-3 font-semibold transition hover:border-violet-500"
                  >
                    Download compressed image
                  </button>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}