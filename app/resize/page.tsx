"use client";

import ToolLayout from "../components/ToolLayout";
import { useEffect, useState } from "react";

type OutputFormat = "image/jpeg" | "image/png" | "image/webp";

const formatOptions: {
  value: OutputFormat;
  label: string;
  extension: string;
}[] = [
  { value: "image/jpeg", label: "JPG", extension: "jpg" },
  { value: "image/png", label: "PNG", extension: "png" },
  { value: "image/webp", label: "WebP", extension: "webp" },
];

export default function ResizePage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [keepRatio, setKeepRatio] = useState(true);

  const [outputFormat, setOutputFormat] =
    useState<OutputFormat>("image/jpeg");
  const [quality, setQuality] = useState(0.9);

  const [resizedBlob, setResizedBlob] = useState<Blob | null>(null);
  const [resizedUrl, setResizedUrl] = useState("");
  const [isResizing, setIsResizing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resizedUrl) URL.revokeObjectURL(resizedUrl);
    };
  }, [previewUrl, resizedUrl]);

  function formatBytes(bytes: number) {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  function clearResult() {
    if (resizedUrl) {
      URL.revokeObjectURL(resizedUrl);
    }

    setResizedBlob(null);
    setResizedUrl("");
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const supportedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!supportedTypes.includes(file.type)) {
      setErrorMessage("Please choose a JPG, PNG, or WebP image.");
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const newPreviewUrl = URL.createObjectURL(file);
    const image = new Image();

    image.src = newPreviewUrl;

    image.onload = () => {
      setOriginalFile(file);
      setPreviewUrl(newPreviewUrl);

      setOriginalWidth(image.naturalWidth);
      setOriginalHeight(image.naturalHeight);

      setWidth(image.naturalWidth);
      setHeight(image.naturalHeight);

      setErrorMessage("");
      clearResult();
    };

    image.onerror = () => {
      URL.revokeObjectURL(newPreviewUrl);
      setErrorMessage("The selected image could not be read.");
    };
  }

  function handleWidthChange(value: number) {
    const safeWidth = Math.max(1, Math.round(value));

    setWidth(safeWidth);
    clearResult();

    if (keepRatio && originalWidth > 0 && originalHeight > 0) {
      const ratio = originalHeight / originalWidth;
      setHeight(Math.max(1, Math.round(safeWidth * ratio)));
    }
  }

  function handleHeightChange(value: number) {
    const safeHeight = Math.max(1, Math.round(value));

    setHeight(safeHeight);
    clearResult();

    if (keepRatio && originalWidth > 0 && originalHeight > 0) {
      const ratio = originalWidth / originalHeight;
      setWidth(Math.max(1, Math.round(safeHeight * ratio)));
    }
  }

  async function handleResize() {
    if (!originalFile) {
      setErrorMessage("Please choose an image first.");
      return;
    }

    if (width < 1 || height < 1) {
      setErrorMessage("Width and height must be greater than zero.");
      return;
    }

    if (width > 12000 || height > 12000) {
      setErrorMessage("Maximum supported size is 12,000 × 12,000 pixels.");
      return;
    }

    try {
      setIsResizing(true);
      setErrorMessage("");
      clearResult();

      const image = new Image();
      const sourceUrl = URL.createObjectURL(originalFile);

      image.src = sourceUrl;

      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("Unable to read image."));
      });

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Your browser does not support image resizing.");
      }

      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";

      if (outputFormat === "image/jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, width, height);
      }

      context.drawImage(image, 0, 0, width, height);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (result) => {
            if (result) {
              resolve(result);
            } else {
              reject(new Error("Resize failed."));
            }
          },
          outputFormat,
          outputFormat === "image/png" ? undefined : quality
        );
      });

      URL.revokeObjectURL(sourceUrl);

      const newUrl = URL.createObjectURL(blob);

      setResizedBlob(blob);
      setResizedUrl(newUrl);
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Resize failed. Please try another image."
      );
    } finally {
      setIsResizing(false);
    }
  }

  function handleDownload() {
    if (!resizedBlob || !originalFile) return;

    const selectedFormat = formatOptions.find(
      (format) => format.value === outputFormat
    );

    const originalName =
      originalFile.name.replace(/\.[^/.]+$/, "") || "resized-image";

    const link = document.createElement("a");

    link.href = resizedUrl;
    link.download = `${originalName}-${width}x${height}.${
      selectedFormat?.extension ?? "jpg"
    }`;

    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function applyPercentage(percentage: number) {
    if (!originalWidth || !originalHeight) return;

    setWidth(Math.max(1, Math.round(originalWidth * percentage)));
    setHeight(Math.max(1, Math.round(originalHeight * percentage)));

    clearResult();
  }

  const selectedFormat = formatOptions.find(
    (format) => format.value === outputFormat
  );

  return (
    <ToolLayout
      eyebrow="Free image tool"
      title="Resize Image"
      description="Change image dimensions while preserving proportions and export in the format you need."
      icon={<span>↔</span>}
    >

      <div>
          <label className="flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 dark:border-white/15 bg-[#0d1016] px-6 text-center transition hover:border-violet-500">
            <span className="mb-4 text-4xl">↔️</span>

            <span className="text-lg font-semibold">Choose an image</span>

            <span className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
              JPG, PNG, or WebP
            </span>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {errorMessage && (
            <div className="mt-5 rounded-2xl border border-red-900/70 bg-red-950/30 px-4 py-3 text-sm text-red-300">
              {errorMessage}
            </div>
          )}

          {originalFile && (
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-100 dark:bg-black/40">
                <img
                  src={previewUrl}
                  alt="Original image preview"
                  className="h-80 w-full object-contain"
                />

                <div className="border-t border-zinc-200 bg-zinc-50/80 dark:border-white/10 dark:bg-zinc-100 dark:bg-black/40/20 p-4">
                  <p className="truncate text-sm font-medium">
                    {originalFile.name}
                  </p>

                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                    Original: {originalWidth} × {originalHeight}px ·{" "}
                    {formatBytes(originalFile.size)}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 dark:border-white/10 dark:bg-zinc-100 dark:bg-black/40/20 p-6">
                <h2 className="text-xl font-semibold">Resize settings</h2>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm text-zinc-600 dark:text-zinc-400">
                      Width
                    </label>

                    <input
                      type="number"
                      min="1"
                      max="12000"
                      value={width}
                      onChange={(event) =>
                        handleWidthChange(Number(event.target.value))
                      }
                      className="w-full rounded-2xl border border-zinc-300 bg-white dark:border-white/10 dark:bg-white/5 px-4 py-3 outline-none transition focus:border-violet-500"
                    />

                    <p className="mt-2 text-xs text-zinc-600">Pixels</p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-zinc-600 dark:text-zinc-400">
                      Height
                    </label>

                    <input
                      type="number"
                      min="1"
                      max="12000"
                      value={height}
                      onChange={(event) =>
                        handleHeightChange(Number(event.target.value))
                      }
                      className="w-full rounded-2xl border border-zinc-300 bg-white dark:border-white/10 dark:bg-white/5 px-4 py-3 outline-none transition focus:border-violet-500"
                    />

                    <p className="mt-2 text-xs text-zinc-600">Pixels</p>
                  </div>
                </div>

                <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-zinc-300">
                  <input
                    type="checkbox"
                    checked={keepRatio}
                    onChange={(event) => setKeepRatio(event.target.checked)}
                    className="h-4 w-4 accent-violet-500"
                  />

                  Keep original proportions
                </label>

                <div className="mt-6">
                  <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">Quick sizes</p>

                  <div className="grid grid-cols-4 gap-2">
                    {[0.25, 0.5, 0.75, 1].map((percentage) => (
                      <button
                        key={percentage}
                        type="button"
                        onClick={() => applyPercentage(percentage)}
                        className="rounded-lg border border-zinc-300 dark:border-white/15 px-2 py-2 text-sm transition hover:border-violet-500 hover:text-violet-300"
                      >
                        {Math.round(percentage * 100)}%
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="mb-2 block text-sm text-zinc-600 dark:text-zinc-400">
                    Output format
                  </label>

                  <select
                    value={outputFormat}
                    onChange={(event) => {
                      setOutputFormat(event.target.value as OutputFormat);
                      clearResult();
                    }}
                    className="w-full rounded-2xl border border-zinc-300 bg-white dark:border-white/10 dark:bg-white/5 px-4 py-3 outline-none transition focus:border-violet-500"
                  >
                    {formatOptions.map((format) => (
                      <option key={format.value} value={format.value}>
                        {format.label}
                      </option>
                    ))}
                  </select>
                </div>

                {outputFormat !== "image/png" && (
                  <div className="mt-6">
                    <div className="mb-3 flex justify-between text-sm">
                      <span className="text-zinc-600 dark:text-zinc-400">Quality</span>
                      <span>{Math.round(quality * 100)}%</span>
                    </div>

                    <input
                      type="range"
                      min="0.2"
                      max="1"
                      step="0.05"
                      value={quality}
                      onChange={(event) => {
                        setQuality(Number(event.target.value));
                        clearResult();
                      }}
                      className="w-full accent-violet-500"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleResize}
                  disabled={isResizing}
                  className="mt-8 w-full rounded-2xl bg-violet-600 px-5 py-3 font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isResizing
                    ? "Resizing..."
                    : `Resize to ${width} × ${height}px`}
                </button>

                {resizedBlob && (
                  <div className="mt-5 rounded-2xl border border-emerald-900/60 bg-emerald-950/20 p-4">
                    <div className="flex justify-between gap-4 text-sm">
                      <span className="text-zinc-600 dark:text-zinc-400">Resized file</span>

                      <span className="text-emerald-400">
                        {formatBytes(resizedBlob.size)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleDownload}
                      className="mt-4 w-full rounded-2xl border border-zinc-300 dark:border-white/15 px-5 py-3 font-semibold transition hover:border-violet-500 hover:text-violet-300"
                    >
                      Download {selectedFormat?.label ?? "resized"} image
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {resizedUrl && (
            <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50/80 dark:border-white/10 dark:bg-zinc-100 dark:bg-black/40/20 p-5">
              <h2 className="mb-4 text-lg font-semibold">Resized preview</h2>

              <div className="overflow-hidden rounded-2xl bg-zinc-100 dark:bg-black/40">
                <img
                  src={resizedUrl}
                  alt="Resized image preview"
                  className="max-h-[500px] w-full object-contain"
                />
              </div>
            </div>
          )}
      </div>
    </ToolLayout>
  );
}