type CropArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));

    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: CropArea,
  outputType: "image/jpeg" | "image/png" | "image/webp" = "image/jpeg",
  quality = 0.92
): Promise<Blob | null> {
  const image = await createImage(imageSrc);

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Your browser could not create the crop canvas.");
  }

  const outputWidth = Math.max(1, Math.round(pixelCrop.width * scaleX));
  const outputHeight = Math.max(1, Math.round(pixelCrop.height * scaleY));

  canvas.width = outputWidth;
  canvas.height = outputHeight;

  if (outputType === "image/jpeg") {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, outputWidth, outputHeight);
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  context.drawImage(
    image,
    Math.round(pixelCrop.x * scaleX),
    Math.round(pixelCrop.y * scaleY),
    Math.round(pixelCrop.width * scaleX),
    Math.round(pixelCrop.height * scaleY),
    0,
    0,
    outputWidth,
    outputHeight
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("The cropped image could not be created."));
          return;
        }

        resolve(blob);
      },
      outputType,
      outputType === "image/png" ? undefined : quality
    );
  });
}
