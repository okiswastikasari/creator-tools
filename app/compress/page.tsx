"use client";

import { DragEvent, useEffect, useState } from "react";
import imageCompression from "browser-image-compression";
import ToolLayout from "../components/ToolLayout";

export default function CompressPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);
  const [quality, setQuality] = useState(0.8);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function selectFile(file?: File) {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setErrorMessage("Please choose a JPG, PNG, or WebP image.");
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setOriginalFile(file);
    setCompressedFile(null);
    setPreviewUrl(URL.createObjectURL(file));
    setErrorMessage("");
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    selectFile(event.dataTransfer.files?.[0]);
  }

  async function handleCompress() {
    if (!originalFile) return;
    try {
      setIsCompressing(true);
      setErrorMessage("");
      const result = await imageCompression(originalFile, {
        maxSizeMB: 1,
        maxWidthOrHeight: 2400,
        useWebWorker: true,
        initialQuality: quality,
      });
      setCompressedFile(result);
    } catch {
      setErrorMessage("Compression failed. Please try another image.");
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
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function formatBytes(bytes: number) {
    return bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  }

  const saved = originalFile && compressedFile
    ? Math.max(0, Math.round((1 - compressedFile.size / originalFile.size) * 100))
    : 0;

  return (
    <ToolLayout eyebrow="Free image tool" title="Compress Image"
      description="Reduce JPG, PNG, and WebP file sizes without sacrificing more quality than necessary."
      icon={<span>⇣</span>}>
      <label
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 text-center transition ${
          isDragging
            ? "border-violet-500 bg-violet-50 dark:bg-violet-500/10"
            : "border-zinc-300 bg-zinc-50/80 hover:border-violet-400 dark:border-white/10 dark:bg-black/20"
        }`}
      >
        <span className="mb-4 rounded-2xl bg-white p-4 text-3xl shadow-sm dark:bg-white/5">🖼️</span>
        <span className="text-lg font-semibold">Drop an image here</span>
        <span className="mt-2 text-sm text-zinc-500">or click to browse · JPG, PNG, WebP</span>
        <input type="file" accept="image/jpeg,image/png,image/webp"
          onChange={(e) => selectFile(e.target.files?.[0])} className="hidden" />
      </label>

      {errorMessage && <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">{errorMessage}</div>}

      {originalFile && (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
          <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-100 dark:border-white/10 dark:bg-black/30">
            <img src={previewUrl} alt="Selected preview" className="h-80 w-full object-contain" />
            <div className="border-t border-zinc-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="truncate font-medium">{originalFile.name}</p>
              <p className="mt-1 text-sm text-zinc-500">{formatBytes(originalFile.size)}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-black/20 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Compression settings</h2>
              <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                {Math.round(quality * 100)}%
              </span>
            </div>

            <input type="range" min="0.2" max="1" step="0.05" value={quality}
              onChange={(e) => { setQuality(Number(e.target.value)); setCompressedFile(null); }}
              className="mt-6 w-full accent-violet-600" />

            <div className="mt-6 grid grid-cols-3 gap-2">
              {[0.6, 0.8, 0.95].map((value) => (
                <button key={value} onClick={() => { setQuality(value); setCompressedFile(null); }}
                  className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                    quality === value
                      ? "border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"
                      : "border-zinc-200 hover:border-violet-400 dark:border-white/10"
                  }`}>
                  {value === 0.6 ? "Small" : value === 0.8 ? "Balanced" : "High"}
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-3 rounded-2xl bg-zinc-50 p-4 text-sm dark:bg-white/5">
              <div className="flex justify-between"><span className="text-zinc-500">Original</span><span>{formatBytes(originalFile.size)}</span></div>
              {compressedFile && <>
                <div className="flex justify-between"><span className="text-zinc-500">Compressed</span><span>{formatBytes(compressedFile.size)}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Saved</span><span className="font-semibold text-emerald-600 dark:text-emerald-400">{saved}%</span></div>
              </>}
            </div>

            <button onClick={handleCompress} disabled={isCompressing}
              className="mt-6 w-full rounded-2xl bg-violet-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:-translate-y-0.5 hover:bg-violet-500 disabled:opacity-50">
              {isCompressing ? "Compressing..." : "Compress image"}
            </button>
            {compressedFile && (
              <button onClick={handleDownload}
                className="mt-3 w-full rounded-2xl border border-zinc-300 px-5 py-3.5 font-semibold transition hover:border-violet-500 hover:text-violet-600 dark:border-white/15 dark:hover:text-violet-300">
                Download compressed image
              </button>
            )}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
