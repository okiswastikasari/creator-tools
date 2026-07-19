export type ImageFormat = "image/jpeg" | "image/png" | "image/webp";

export type PixelCrop = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

export function extensionFor(format: ImageFormat): string {
  if (format === "image/jpeg") return "jpg";
  if (format === "image/webp") return "webp";
  return "png";
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the selected file."));
    reader.readAsDataURL(file);
  });
}

export function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not load the selected image."));
    image.src = source;
  });
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: ImageFormat,
  quality = 0.85,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Your browser could not create the output image."));
      },
      format,
      quality,
    );
  });
}

export async function transformImage(options: {
  source: string;
  width?: number;
  height?: number;
  format: ImageFormat;
  quality?: number;
  crop?: PixelCrop;
  background?: string;
}): Promise<Blob> {
  const image = await loadImage(options.source);
  const crop = options.crop ?? {
    x: 0,
    y: 0,
    width: image.naturalWidth,
    height: image.naturalHeight,
  };

  const targetWidth = Math.max(1, Math.round(options.width ?? crop.width));
  const targetHeight = Math.max(1, Math.round(options.height ?? crop.height));
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is not available in this browser.");

  if (options.format === "image/jpeg") {
    context.fillStyle = options.background ?? "#ffffff";
    context.fillRect(0, 0, targetWidth, targetHeight);
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    targetWidth,
    targetHeight,
  );

  return canvasToBlob(canvas, options.format, options.quality ?? 0.85);
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function extractPalette(source: string, count = 6): Promise<string[]> {
  const image = await loadImage(source);
  const maxSide = 180;
  const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Canvas is not available in this browser.");
  context.drawImage(image, 0, 0, width, height);

  const { data } = context.getImageData(0, 0, width, height);
  const buckets = new Map<string, { r: number; g: number; b: number; total: number }>();

  for (let index = 0; index < data.length; index += 16) {
    const alpha = data[index + 3];
    if (alpha < 180) continue;

    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    const saturation = Math.max(r, g, b) - Math.min(r, g, b);
    const brightness = (r + g + b) / 3;
    if (brightness < 10 || brightness > 247) continue;

    const qr = Math.round(r / 32) * 32;
    const qg = Math.round(g / 32) * 32;
    const qb = Math.round(b / 32) * 32;
    const key = `${qr}-${qg}-${qb}`;
    const bucket = buckets.get(key) ?? { r: 0, g: 0, b: 0, total: 0 };
    const weight = 1 + saturation / 64;
    bucket.r += r * weight;
    bucket.g += g * weight;
    bucket.b += b * weight;
    bucket.total += weight;
    buckets.set(key, bucket);
  }

  const colors = [...buckets.values()]
    .sort((a, b) => b.total - a.total)
    .map((bucket) => {
      const r = Math.round(bucket.r / bucket.total);
      const g = Math.round(bucket.g / bucket.total);
      const b = Math.round(bucket.b / bucket.total);
      return { r, g, b };
    });

  const selected: typeof colors = [];
  for (const color of colors) {
    const isDifferent = selected.every((picked) => {
      const distance = Math.sqrt(
        (color.r - picked.r) ** 2 +
          (color.g - picked.g) ** 2 +
          (color.b - picked.b) ** 2,
      );
      return distance > 70;
    });
    if (isDifferent) selected.push(color);
    if (selected.length === count) break;
  }

  return selected.map(({ r, g, b }) =>
    `#${[r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("")}`.toUpperCase(),
  );
}
