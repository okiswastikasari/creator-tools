"use client";

import ToolLayout from "../components/ToolLayout";
import { useEffect, useRef, useState } from "react";
import { getPaletteSync } from "colorthief";

type RGB = [number, number, number];

function rgbToHex([r, g, b]: RGB) {
  return `#${[r, g, b]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function PalettePage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [colors, setColors] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedColor, setCopiedColor] = useState("");

  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
    setColors([]);
    setCopiedColor("");
    setErrorMessage("");
  }

  async function handleGeneratePalette() {
    if (!imageRef.current || !originalFile) {
      setErrorMessage("Please choose an image first.");
      return;
    }

    try {
      setIsGenerating(true);
      setErrorMessage("");

      const palette = getPaletteSync(imageRef.current, {
  colorCount: 6,
  quality: 10,
});

if (!palette) {
  throw new Error("Could not extract colors from this image.");
}

const hexColors = palette.map((color) =>
  color.hex().toUpperCase()
);

setColors(hexColors);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "Could not extract colors from this image. Please try another image."
      );
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleCopyColor(color: string) {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedColor(color);

      window.setTimeout(() => {
        setCopiedColor("");
      }, 1500);
    } catch {
      setErrorMessage("Could not copy the color code.");
    }
  }

  function handleDownloadPalette() {
    if (colors.length === 0) return;

    const canvas = document.createElement("canvas");
    const width = 1200;
    const height = 720;

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
      setErrorMessage("Your browser does not support palette export.");
      return;
    }

    context.fillStyle = "#090B10";
    context.fillRect(0, 0, width, height);

    context.fillStyle = "#FFFFFF";
    context.font = "bold 52px Arial";
    context.fillText("CreatorKit Color Palette", 70, 95);

    context.fillStyle = "#A1A1AA";
    context.font = "28px Arial";
    context.fillText(
      originalFile?.name ?? "Image palette",
      70,
      145
    );

    const gap = 20;
    const boxWidth = (width - 140 - gap * 5) / 6;
    const boxHeight = 360;
    const startY = 210;

    colors.forEach((color, index) => {
      const x = 70 + index * (boxWidth + gap);

      context.fillStyle = color;
      context.fillRect(x, startY, boxWidth, boxHeight);

      context.fillStyle = "#FFFFFF";
      context.fillRect(x, startY + boxHeight, boxWidth, 90);

      context.fillStyle = "#111827";
      context.font = "bold 22px Arial";
      context.textAlign = "center";
      context.fillText(
        color,
        x + boxWidth / 2,
        startY + boxHeight + 55
      );
    });

    context.textAlign = "left";
    context.fillStyle = "#71717A";
    context.font = "24px Arial";
    context.fillText(
      "Generated with CreatorKit",
      70,
      height - 45
    );

    canvas.toBlob((blob) => {
      if (!blob) {
        setErrorMessage("Could not create palette image.");
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "creatorkit-color-palette.png";

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    }, "image/png");
  }

  return (
    <ToolLayout
      eyebrow="Free design tool"
      title="Color Palette"
      description="Extract useful colors from any image, copy their HEX values, and export a shareable palette."
      icon={<span>◉</span>}
    >

      <div>
          <label className="flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 dark:border-white/15 bg-[#0d1016] px-6 text-center transition hover:border-violet-500">
            <span className="mb-4 text-4xl">🎨</span>

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

          {originalFile && previewUrl && (
            <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-100 dark:bg-black/40">
                <img
                  ref={imageRef}
                  src={previewUrl}
                  alt="Selected image preview"
                  crossOrigin="anonymous"
                  className="h-96 w-full object-contain"
                />

                <div className="border-t border-zinc-200 bg-zinc-50/80 dark:border-white/10 dark:bg-zinc-100 dark:bg-black/40/20 p-4">
                  <p className="truncate text-sm font-medium">
                    {originalFile.name}
                  </p>

                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                    Original size: {formatBytes(originalFile.size)}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 dark:border-white/10 dark:bg-zinc-100 dark:bg-black/40/20 p-6">
                <h2 className="text-xl font-semibold">
                  Palette settings
                </h2>

                <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  CreatorKit will find six dominant colors from the selected
                  image.
                </p>

                <button
                  type="button"
                  onClick={handleGeneratePalette}
                  disabled={isGenerating}
                  className="mt-8 w-full rounded-2xl bg-violet-600 px-5 py-3 font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isGenerating
                    ? "Generating palette..."
                    : "Generate palette"}
                </button>

                {colors.length > 0 && (
                  <button
                    type="button"
                    onClick={handleDownloadPalette}
                    className="mt-3 w-full rounded-2xl border border-zinc-300 dark:border-white/15 px-5 py-3 font-semibold transition hover:border-violet-500 hover:text-violet-300"
                  >
                    Download palette PNG
                  </button>
                )}
              </div>
            </div>
          )}

          {colors.length > 0 && (
            <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50/80 dark:border-white/10 dark:bg-zinc-100 dark:bg-black/40/20 p-5 md:p-6">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">
                    Extracted colors
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
                    Click any color to copy its HEX code.
                  </p>
                </div>

                {copiedColor && (
                  <span className="rounded-full border border-emerald-900/60 bg-emerald-950/30 px-3 py-1 text-sm text-emerald-400">
                    Copied {copiedColor}
                  </span>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleCopyColor(color)}
                    className="overflow-hidden rounded-2xl border border-zinc-800 text-left transition hover:-translate-y-1 hover:border-violet-500"
                  >
                    <div
                      className="h-36 w-full"
                      style={{ backgroundColor: color }}
                    />

                    <div className="flex items-center justify-between bg-[#12151d] px-4 py-4">
                      <span className="font-mono text-base font-semibold">
                        {color}
                      </span>

                      <span className="text-xs text-zinc-500 dark:text-zinc-500">
                        Copy
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
      </div>
    </ToolLayout>
  );
}