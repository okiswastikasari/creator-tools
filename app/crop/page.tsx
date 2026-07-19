"use client";

import Link from "next/link";
import Cropper, { Area, Point } from "react-easy-crop";
import { useEffect, useState } from "react";
import { getCroppedImg } from "@/lib/cropImage";

type AspectOption = {
  label: string;
  value: number;
};

const aspectOptions: AspectOption[] = [
  { label: "Square 1:1", value: 1 },
  { label: "Landscape 4:3", value: 4 / 3 },
  { label: "Wide 16:9", value: 16 / 9 },
  { label: "Portrait 3:4", value: 3 / 4 },
];

export default function CropPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<Area | null>(null);

  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [croppedUrl, setCroppedUrl] = useState("");
  const [isCropping, setIsCropping] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }

      if (croppedUrl) {
        URL.revokeObjectURL(croppedUrl);
      }
    };
  }, [imageUrl, croppedUrl]);

  function formatBytes(bytes: number) {
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

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const supportedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!supportedTypes.includes(file.type)) {
      setErrorMessage("Please choose a JPG, PNG, or WebP image.");
      return;
    }

    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }

    const newImageUrl = URL.createObjectURL(file);

    setOriginalFile(file);
    setImageUrl(newImageUrl);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setAspect(1);
    setCroppedAreaPixels(null);
    setErrorMessage("");
    clearResult();
  }

  function handleCropComplete(
    _croppedArea: Area,
    croppedPixels: Area
  ) {
    setCroppedAreaPixels(croppedPixels);
  }

  async function handleCropImage() {
    if (!imageUrl || !originalFile) {
      setErrorMessage("Please choose an image first.");
      return;
    }

    if (!croppedAreaPixels) {
      setErrorMessage("Please adjust the crop area first.");
      return;
    }

    try {
      setIsCropping(true);
      setErrorMessage("");
      clearResult();

      const blob = await getCroppedImg(
        imageUrl,
        croppedAreaPixels
      );

      if (!blob) {
        throw new Error("Crop failed.");
      }

      const newUrl = URL.createObjectURL(blob);

      setCroppedBlob(blob);
      setCroppedUrl(newUrl);
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
    if (!croppedBlob || !originalFile) return;

    const originalName =
      originalFile.name.replace(/\.[^/.]+$/, "") || "cropped-image";

    const link = document.createElement("a");

    link.href = croppedUrl;
    link.download = `${originalName}-cropped.jpg`;

    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <main className="min-h-screen bg-[#090b10] px-5 py-10 text-white md:px-8 md:py-12">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-8 inline-flex text-sm text-zinc-300 transition hover:text-violet-400"
        >
          ← Back to CreatorKit
        </Link>

        <header className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-violet-400">
            Free image tool
          </p>

          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Crop Image
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-400 md:text-lg">
            Drag, zoom, and crop images directly in your browser.
            Your image is never uploaded to a server.
          </p>
        </header>

        <section className="rounded-3xl border border-zinc-800 bg-[#12151d] p-5 md:p-10">
          <label className="flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-700 bg-[#0d1016] px-6 text-center transition hover:border-violet-500">
            <span className="mb-4 text-4xl">✂️</span>

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

          {errorMessage && (
            <div className="mt-5 rounded-xl border border-red-900/70 bg-red-950/30 px-4 py-3 text-sm text-red-300">
              {errorMessage}
            </div>
          )}

          {originalFile && imageUrl && (
            <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
              <div>
                <div className="relative h-[420px] overflow-hidden rounded-2xl border border-zinc-800 bg-black md:h-[520px]">
                  <Cropper
                    image={imageUrl}
                    crop={crop}
                    zoom={zoom}
                    aspect={aspect}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={handleCropComplete}
                    showGrid
                  />
                </div>

                <div className="mt-3 rounded-xl border border-zinc-800 bg-[#0d1016] px-4 py-3">
                  <p className="truncate text-sm font-medium">
                    {originalFile.name}
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Original size: {formatBytes(originalFile.size)}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-[#0d1016] p-6">
                <h2 className="text-xl font-semibold">
                  Crop settings
                </h2>

                <div className="mt-6">
                  <label className="mb-3 block text-sm text-zinc-400">
                    Aspect ratio
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    {aspectOptions.map((option) => {
                      const isActive = aspect === option.value;

                      return (
                        <button
                          key={option.label}
                          type="button"
                          onClick={() => {
                            setAspect(option.value);
                            clearResult();
                          }}
                          className={`rounded-xl border px-3 py-3 text-sm transition ${
                            isActive
                              ? "border-violet-500 bg-violet-500/10 text-violet-300"
                              : "border-zinc-700 hover:border-violet-500"
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mb-3 flex items-center justify-between text-sm">
                    <span className="text-zinc-400">Zoom</span>
                    <span>{zoom.toFixed(1)}×</span>
                  </div>

                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={zoom}
                    onChange={(event) => {
                      setZoom(Number(event.target.value));
                      clearResult();
                    }}
                    className="w-full accent-violet-500"
                  />
                </div>

                {croppedAreaPixels && (
                  <div className="mt-6 space-y-3 rounded-xl border border-zinc-800 bg-[#12151d] p-4 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-zinc-500">
                        Crop width
                      </span>

                      <span>
                        {Math.round(croppedAreaPixels.width)}px
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-zinc-500">
                        Crop height
                      </span>

                      <span>
                        {Math.round(croppedAreaPixels.height)}px
                      </span>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleCropImage}
                  disabled={isCropping}
                  className="mt-8 w-full rounded-xl bg-violet-500 px-5 py-3 font-semibold transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isCropping ? "Cropping..." : "Crop image"}
                </button>

                {croppedBlob && (
                  <div className="mt-5 rounded-xl border border-emerald-900/60 bg-emerald-950/20 p-4">
                    <div className="flex justify-between gap-4 text-sm">
                      <span className="text-zinc-400">
                        Cropped file
                      </span>

                      <span className="text-emerald-400">
                        {formatBytes(croppedBlob.size)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleDownload}
                      className="mt-4 w-full rounded-xl border border-zinc-700 px-5 py-3 font-semibold transition hover:border-violet-500 hover:text-violet-300"
                    >
                      Download cropped image
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {croppedUrl && (
            <div className="mt-6 rounded-2xl border border-zinc-800 bg-[#0d1016] p-5">
              <h2 className="mb-4 text-lg font-semibold">
                Cropped preview
              </h2>

              <div className="overflow-hidden rounded-xl bg-black">
                <img
                  src={croppedUrl}
                  alt="Cropped image preview"
                  className="max-h-[520px] w-full object-contain"
                />
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}