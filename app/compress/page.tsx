"use client";

import { useEffect, useState } from "react";
import imageCompression from "browser-image-compression";
import ToolShell, { ui } from "../components/ToolShell";

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function CompressPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);
  const [quality, setQuality] = useState(0.8);
  const [error, setError] = useState("");

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg","image/png","image/webp"].includes(file.type)) {
      setError("Please choose a JPG, PNG, or WebP image.");
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setOriginalFile(file);
    setCompressedFile(null);
    setPreviewUrl(URL.createObjectURL(file));
    setError("");
  }

  async function handleCompress() {
    if (!originalFile) return;
    try {
      setIsCompressing(true);
      setError("");
      const result = await imageCompression(originalFile, {
        maxSizeMB: 1,
        maxWidthOrHeight: 2400,
        useWebWorker: true,
        initialQuality: quality,
      });
      setCompressedFile(result);
    } catch {
      setError("Compression failed. Please try another image.");
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

  const saved = originalFile && compressedFile
    ? Math.max(0, Math.round((1 - compressedFile.size / originalFile.size) * 100))
    : 0;

  return (
    <ToolShell eyebrow="Free image tool" title="Compress Image" icon="↘"
      description="Reduce JPG, PNG, and WebP file sizes while keeping your images sharp.">
      <label className={ui.upload}>
        <span className="mb-4 text-4xl">▣</span>
        <span className="text-xl font-semibold">Drop an image here</span>
        <span className="mt-2 text-sm text-zinc-500">or click to browse · JPG, PNG, WebP</span>
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="hidden" />
      </label>

      {error && <div className={`mt-5 ${ui.error}`}>{error}</div>}

      {originalFile && (
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className={ui.panel}>
            <img src={previewUrl} alt="Original preview" className="h-80 w-full rounded-xl bg-black object-contain" />
            <div className="mt-4">
              <p className="truncate font-medium">{originalFile.name}</p>
              <p className="mt-1 text-sm text-zinc-500">Original · {formatBytes(originalFile.size)}</p>
            </div>
          </div>

          <div className={ui.panel}>
            <h2 className="text-xl font-semibold">Compression settings</h2>
            <div className="mt-6">
              <div className="mb-3 flex justify-between text-sm">
                <span className="text-zinc-400">Quality</span>
                <span>{Math.round(quality * 100)}%</span>
              </div>
              <input type="range" min="0.2" max="1" step="0.05" value={quality}
                onChange={(e) => { setQuality(Number(e.target.value)); setCompressedFile(null); }}
                className="w-full accent-violet-500" />
            </div>

            {compressedFile && (
              <div className={`mt-6 ${ui.success}`}>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Compressed</span>
                  <span>{formatBytes(compressedFile.size)}</span>
                </div>
                <div className="mt-3 flex justify-between text-sm">
                  <span className="text-zinc-400">Saved</span>
                  <span className="font-semibold text-emerald-400">{saved}%</span>
                </div>
              </div>
            )}

            <button onClick={handleCompress} disabled={isCompressing} className={`mt-8 ${ui.primary}`}>
              {isCompressing ? "Compressing..." : "Compress image"}
            </button>
            {compressedFile && (
              <button onClick={handleDownload} className={`mt-3 ${ui.secondary}`}>
                Download compressed image
              </button>
            )}
          </div>
        </div>
      )}
    </ToolShell>
  );
}
