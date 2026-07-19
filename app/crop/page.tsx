"use client";

import Link from "next/link";
import {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
  ReactCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { getCroppedImg } from "@/lib/cropImage";

type AspectOption = {
  label: string;
  value: number | null;
};

type OutputFormat = "image/jpeg" | "image/png" | "image/webp";

const aspectOptions: AspectOption[] = [
  { label: "Free form", value: null },
  { label: "Square 1:1", value: 1 },
  { label: "Landscape 4:3", value: 4 / 3 },
  { label: "Wide 16:9", value: 16 / 9 },
  { label: "Portrait 3:4", value: 3 / 4 },
  { label: "Story 9:16", value: 9 / 16 },
];

const outputOptions: Array<{
  label: string;
  value: OutputFormat;
  extension: string;
}> = [
  { label: "JPG", value: "image/jpeg", extension: "jpg" },
  { label: "PNG", value: "image/png", extension: "png" },
  { label: "WebP", value: "image/webp", extension: "webp" },
];

function getCenteredCrop(
  imageWidth: number,
  imageHeight: number,
  aspect: number | null
): Crop {
  if (!aspect) {
    return {
      unit: "%",
      x: 10,
      y: 10,
      width: 80,
      height: 80,
    };
  }

  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 80,
      },
      aspect,
      imageWidth,
      imageHeight
    ),
    imageWidth,
    imageHeight
  );
}

export default function CropPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | null>(null);

  const [outputFormat, setOutputFormat] =
    useState<OutputFormat>("image/jpeg");
  const [quality, setQuality] = useState(0.92);

  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [croppedUrl, setCroppedUrl] = useState("");
  const [isCropping, setIsCropping] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const selectedOutput = useMemo(
    () =>
      outputOptions.find((option) => option.value === outputFormat) ??
      outputOptions[0],
    [outputFormat]
  );

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      if (croppedUrl) URL.revokeObjectURL(croppedUrl);
    };
  }, [imageUrl, croppedUrl]);

  function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  function clearResult() {
    if (croppedUrl) {
      URL.revokeObjectURL(croppedUrl);
    }

    setCroppedBlob(null);
    setCroppedUrl("");
  }

  function loadFile(file: File) {
    const supportedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!supportedTypes.includes(file.type)) {
      setErrorMessage("Please choose a JPG, PNG, or WebP image.");
      return;
    }

    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }

    clearResult();

    const newImageUrl = URL.createObjectURL(file);

    setOriginalFile(file);
    setImageUrl(newImageUrl);
    setAspect(null);
    setCrop(undefined);
    setCompletedCrop(undefined);
    setErrorMessage("");
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    loadFile(file);
    event.target.value = "";
  }

  function handleDrop(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDraggingFile(false);

    const file = event.dataTransfer.files?.[0];

    if (file) loadFile(file);
  }

  function handleImageLoad(event: React.SyntheticEvent<HTMLImageElement>) {
    const { naturalWidth, naturalHeight } = event.currentTarget;

    setCrop(getCenteredCrop(naturalWidth, naturalHeight, aspect));
  }

  function handleAspectChange(nextAspect: number | null) {
    setAspect(nextAspect);
    clearResult();

    const image = imageRef.current;

    if (!image) return;

    setCrop(
      getCenteredCrop(image.naturalWidth, image.naturalHeight, nextAspect)
    );
  }

  function handleResetCrop() {
    const image = imageRef.current;

    if (!image) return;

    setCrop(
      getCenteredCrop(image.naturalWidth, image.naturalHeight, aspect)
    );
    clearResult();
  }

  async function handleCropImage() {
    if (!imageUrl || !originalFile) {
      setErrorMessage("Please choose an image first.");
      return;
    }

    if (
      !completedCrop ||
      completedCrop.width < 1 ||
      completedCrop.height < 1
    ) {
      setErrorMessage("Please select a crop area first.");
      return;
    }

    try {
      setIsCropping(true);
      setErrorMessage("");
      clearResult();

      const blob = await getCroppedImg(
        imageUrl,
        {
          x: completedCrop.x,
          y: completedCrop.y,
          width: completedCrop.width,
          height: completedCrop.height,
        },
        outputFormat,
        quality
      );

      if (!blob) {
        throw new Error("Crop failed.");
      }

      const nextUrl = URL.createObjectURL(blob);

      setCroppedBlob(blob);
      setCroppedUrl(nextUrl);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Crop failed. Please try another image."
      );
    } finally {
      setIsCropping(false);
    }
  }

  function handleDownload() {
    if (!croppedBlob || !originalFile || !croppedUrl) return;

    const originalName =
      originalFile.name.replace(/\.[^/.]+$/, "") || "cropped-image";

    const link = document.createElement("a");

    link.href = croppedUrl;
    link.download = `${originalName}-cropped.${selectedOutput.extension}`;

    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <main className="ck-page min-h-screen px-5 py-8 md:px-8 md:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="ck-muted inline-flex text-sm transition hover:opacity-70"
          >
            ← Back to Creator Tools
          </Link>

          {originalFile && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="ck-secondary-button rounded-full px-4 py-2 text-sm font-semibold"
            >
              Choose another image
            </button>
          )}
        </div>

        <header className="mx-auto mb-10 max-w-3xl text-center">
          <p className="ck-accent mb-3 text-sm font-semibold uppercase tracking-[0.24em]">
            Free image tool
          </p>

          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Crop Image
          </h1>

          <p className="ck-muted mx-auto mt-5 max-w-2xl text-base leading-7 md:text-lg">
            Drag the crop box, resize it from any corner, and export the exact
            area you need. Your image stays in your browser.
          </p>
        </header>

        <section className="ck-surface rounded-3xl border p-5 md:p-8">
          {!originalFile && (
            <label
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDraggingFile(true);
              }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={() => setIsDraggingFile(false)}
              onDrop={handleDrop}
              className={`ck-surface-2 flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-6 text-center transition ${
                isDraggingFile
                  ? "scale-[1.01] border-violet-500"
                  : "hover:border-violet-500"
              }`}
            >
              <span
                className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
                style={{
                  color: "var(--ck-accent)",
                  background: "var(--ck-accent-soft)",
                }}
              >
                ↥
              </span>

              <span className="mt-5 text-xl font-semibold">
                Drag and drop an image
              </span>

              <span className="ck-muted mt-2 text-sm">
                or click to browse from your device
              </span>

              <span className="ck-muted mt-5 rounded-full border px-4 py-2 text-xs">
                JPG, PNG, or WebP
              </span>

              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}

          {originalFile && (
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          )}

          {errorMessage && (
            <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {errorMessage}
            </div>
          )}

          {originalFile && imageUrl && (
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_380px]">
              <div>
                <div className="ck-surface-2 flex min-h-[420px] items-center justify-center overflow-hidden rounded-2xl border p-3 md:min-h-[620px] md:p-5">
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentageCrop) => {
                      setCrop(percentageCrop);
                      clearResult();
                    }}
                    onComplete={(pixelCrop) => {
                      setCompletedCrop(pixelCrop);
                    }}
                    aspect={aspect ?? undefined}
                    minWidth={30}
                    minHeight={30}
                    keepSelection
                    ruleOfThirds
                  >
                    <img
                      ref={imageRef}
                      src={imageUrl}
                      alt="Image selected for cropping"
                      onLoad={handleImageLoad}
                      className="max-h-[580px] max-w-full object-contain"
                    />
                  </ReactCrop>
                </div>

                <div className="ck-surface-2 mt-3 flex flex-col gap-3 rounded-xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {originalFile.name}
                    </p>
                    <p className="ck-muted mt-1 text-xs">
                      Original size: {formatBytes(originalFile.size)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetCrop}
                    className="ck-secondary-button shrink-0 rounded-lg px-4 py-2 text-sm font-semibold"
                  >
                    Reset crop
                  </button>
                </div>
              </div>

              <aside className="ck-surface-2 h-fit rounded-2xl border p-5 md:p-6">
                <div>
                  <p className="ck-accent text-xs font-semibold uppercase tracking-[0.2em]">
                    Editor
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">Crop settings</h2>
                </div>

                <div className="mt-6">
                  <label className="ck-muted mb-3 block text-sm">
                    Aspect ratio
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    {aspectOptions.map((option) => {
                      const active = aspect === option.value;

                      return (
                        <button
                          key={option.label}
                          type="button"
                          onClick={() => handleAspectChange(option.value)}
                          className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                            active
                              ? "border-violet-500 bg-violet-500/10 text-violet-300"
                              : "ck-surface hover:border-violet-500"
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>

                  <p className="ck-muted mt-3 text-xs leading-5">
                    Free form lets you drag and resize every edge and corner
                    independently.
                  </p>
                </div>

                {completedCrop && (
                  <div className="ck-surface mt-6 space-y-3 rounded-xl border p-4 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="ck-muted">Crop width</span>
                      <span>{Math.round(completedCrop.width)} px</span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="ck-muted">Crop height</span>
                      <span>{Math.round(completedCrop.height)} px</span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="ck-muted">Ratio</span>
                      <span>
                        {completedCrop.height
                          ? (
                              completedCrop.width / completedCrop.height
                            ).toFixed(2)
                          : "—"}
                      </span>
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <label className="ck-muted mb-3 block text-sm">
                    Output format
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    {outputOptions.map((option) => {
                      const active = outputFormat === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setOutputFormat(option.value);
                            clearResult();
                          }}
                          className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                            active
                              ? "border-violet-500 bg-violet-500/10 text-violet-300"
                              : "ck-surface hover:border-violet-500"
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {outputFormat !== "image/png" && (
                  <div className="mt-6">
                    <div className="mb-3 flex items-center justify-between text-sm">
                      <span className="ck-muted">Quality</span>
                      <span>{Math.round(quality * 100)}%</span>
                    </div>

                    <input
                      type="range"
                      min="0.5"
                      max="1"
                      step="0.01"
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
                  onClick={handleCropImage}
                  disabled={isCropping}
                  className="mt-8 w-full rounded-xl bg-violet-500 px-5 py-3 font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isCropping ? "Creating crop..." : "Crop image"}
                </button>

                {croppedBlob && (
                  <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                    <div className="flex justify-between gap-4 text-sm">
                      <span className="ck-muted">Cropped file</span>
                      <span className="text-emerald-400">
                        {formatBytes(croppedBlob.size)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleDownload}
                      className="ck-secondary-button mt-4 w-full rounded-xl px-5 py-3 font-semibold"
                    >
                      Download {selectedOutput.label}
                    </button>
                  </div>
                )}
              </aside>
            </div>
          )}

          {croppedUrl && (
            <section className="mt-6">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="ck-accent text-xs font-semibold uppercase tracking-[0.2em]">
                    Result
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">
                    Before and after
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="ck-primary-button rounded-full px-5 py-2.5 text-sm font-bold"
                >
                  Download result
                </button>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="ck-surface-2 rounded-2xl border p-4">
                  <p className="ck-muted mb-3 text-sm font-semibold">
                    Original
                  </p>
                  <div className="flex min-h-72 items-center justify-center overflow-hidden rounded-xl bg-black/80">
                    <img
                      src={imageUrl}
                      alt="Original image preview"
                      className="max-h-[520px] w-full object-contain"
                    />
                  </div>
                </div>

                <div className="ck-surface-2 rounded-2xl border p-4">
                  <p className="ck-muted mb-3 text-sm font-semibold">
                    Cropped result
                  </p>
                  <div className="flex min-h-72 items-center justify-center overflow-hidden rounded-xl bg-black/80">
                    <img
                      src={croppedUrl}
                      alt="Cropped image preview"
                      className="max-h-[520px] w-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </section>
          )}
        </section>
      </div>
    </main>
  );
}
