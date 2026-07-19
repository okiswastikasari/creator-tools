"use client";

import ToolLayout from "../components/ToolLayout";
import { useEffect, useState } from "react";

type OutputFormat = "image/jpeg" | "image/png" | "image/webp";

const formatOptions: {
  value: OutputFormat;
  label: string;
  extension: string;
}[] = [
  {
    value: "image/jpeg",
    label: "JPG",
    extension: "jpg",
  },
  {
    value: "image/png",
    label: "PNG",
    extension: "png",
  },
  {
    value: "image/webp",
    label: "WebP",
    extension: "webp",
  },
];

export default function ConvertPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [outputFormat, setOutputFormat] =
    useState<OutputFormat>("image/webp");
  const [quality, setQuality] = useState(0.9);
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [convertedUrl, setConvertedUrl] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      if (convertedUrl) {
        URL.revokeObjectURL(convertedUrl);
      }
    };
  }, [previewUrl, convertedUrl]);

  function formatBytes(bytes: number) {
    if (bytes === 0) return "0 KB";

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  function resetConvertedResult() {
    if (convertedUrl) {
      URL.revokeObjectURL(convertedUrl);
    }

    setConvertedBlob(null);
    setConvertedUrl("");
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

    setOriginalFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setErrorMessage("");
    resetConvertedResult();
  }

  async function handleConvert() {
    if (!originalFile) {
      setErrorMessage("Please choose an image first.");
      return;
    }

    try {
      setIsConverting(true);
      setErrorMessage("");
      resetConvertedResult();

      const image = new Image();
      const sourceUrl = URL.createObjectURL(originalFile);

      image.src = sourceUrl;

      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("Unable to read image."));
      });

      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Your browser does not support image conversion.");
      }

      /*
        JPG does not support transparency.
        We add a white background before drawing transparent images.
      */
      if (outputFormat === "image/jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
      }

      context.drawImage(image, 0, 0);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (result) => {
            if (result) {
              resolve(result);
            } else {
              reject(new Error("Conversion failed."));
            }
          },
          outputFormat,
          outputFormat === "image/png" ? undefined : quality
        );
      });

      URL.revokeObjectURL(sourceUrl);

      const newUrl = URL.createObjectURL(blob);

      setConvertedBlob(blob);
      setConvertedUrl(newUrl);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Conversion failed. Please try another image."
      );
    } finally {
      setIsConverting(false);
    }
  }

  function handleDownload() {
    if (!convertedBlob || !originalFile) return;

    const selectedFormat = formatOptions.find(
      (format) => format.value === outputFormat
    );

    const originalName =
      originalFile.name.replace(/\.[^/.]+$/, "") || "converted-image";

    const link = document.createElement("a");

    link.href = convertedUrl;
    link.download = `${originalName}.${selectedFormat?.extension ?? "png"}`;

    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  const selectedFormat = formatOptions.find(
    (format) => format.value === outputFormat
  );

  return (
    <ToolLayout
      eyebrow="Free image tool"
      title="Convert Image"
      description="Convert JPG, PNG, and WebP images locally with quality controls and instant previews."
      icon={<span>↻</span>}
    >

      <div>
          <label className="flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 dark:border-white/15 bg-[#0d1016] px-6 text-center transition hover:border-violet-500">
            <span className="mb-4 text-4xl">🔄</span>

            <span className="text-lg font-semibold">
              Choose an image
            </span>

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
                    Original: {formatBytes(originalFile.size)}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 dark:border-white/10 dark:bg-zinc-100 dark:bg-black/40/20 p-6">
                <h2 className="text-xl font-semibold">
                  Conversion settings
                </h2>

                <div className="mt-6">
                  <label
                    htmlFor="output-format"
                    className="mb-3 block text-sm text-zinc-600 dark:text-zinc-400"
                  >
                    Convert to
                  </label>

                  <select
                    id="output-format"
                    value={outputFormat}
                    onChange={(event) => {
                      setOutputFormat(event.target.value as OutputFormat);
                      resetConvertedResult();
                    }}
                    className="w-full rounded-2xl border border-zinc-300 bg-white dark:border-white/10 dark:bg-white/5 px-4 py-3 text-zinc-950 dark:text-white outline-none transition focus:border-violet-500"
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
                    <div className="mb-3 flex items-center justify-between text-sm">
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
                        resetConvertedResult();
                      }}
                      className="w-full accent-violet-500"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleConvert}
                  disabled={isConverting}
                  className="mt-8 w-full rounded-2xl bg-violet-600 px-5 py-3 font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isConverting
                    ? "Converting..."
                    : `Convert to ${selectedFormat?.label ?? "image"}`}
                </button>

                {convertedBlob && (
                  <div className="mt-6 rounded-2xl border border-emerald-900/60 bg-emerald-950/20 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">
                        Converted size
                      </span>

                      <span className="font-medium text-emerald-400">
                        {formatBytes(convertedBlob.size)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleDownload}
                      className="mt-4 w-full rounded-2xl border border-zinc-300 dark:border-white/15 px-5 py-3 font-semibold transition hover:border-violet-500 hover:text-violet-300"
                    >
                      Download {selectedFormat?.label ?? "converted"} image
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {convertedUrl && (
            <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50/80 dark:border-white/10 dark:bg-zinc-100 dark:bg-black/40/20 p-5">
              <h2 className="mb-4 text-lg font-semibold">
                Converted preview
              </h2>

              <div className="overflow-hidden rounded-2xl bg-zinc-100 dark:bg-black/40">
                <img
                  src={convertedUrl}
                  alt="Converted image preview"
                  className="max-h-[500px] w-full object-contain"
                />
              </div>
            </div>
          )}
      </div>
    </ToolLayout>
  );
}