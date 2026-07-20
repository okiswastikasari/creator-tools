type CropArea = { x:number; y:number; width:number; height:number };

function createImage(url:string):Promise<HTMLImageElement>{
  return new Promise((resolve,reject)=>{
    const image=new Image();
    image.addEventListener("load",()=>resolve(image));
    image.addEventListener("error",reject);
    image.setAttribute("crossOrigin","anonymous");
    image.src=url;
  });
}

export async function getCroppedImg(
  imageSrc:string,
  pixelCrop:CropArea,
  outputType:"image/jpeg"|"image/png"|"image/webp"="image/jpeg",
  quality=.92
):Promise<Blob|null>{
  const image=await createImage(imageSrc);
  const canvas=document.createElement("canvas");
  const ctx=canvas.getContext("2d");
  if(!ctx) throw new Error("Canvas unavailable.");
  canvas.width=Math.max(1,Math.round(pixelCrop.width));
  canvas.height=Math.max(1,Math.round(pixelCrop.height));
  if(outputType==="image/jpeg"){ctx.fillStyle="#fff";ctx.fillRect(0,0,canvas.width,canvas.height)}
  ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality="high";
  ctx.drawImage(image,pixelCrop.x,pixelCrop.y,pixelCrop.width,pixelCrop.height,0,0,canvas.width,canvas.height);
  return new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error("Crop failed.")),outputType,outputType==="image/png"?undefined:quality));
}
