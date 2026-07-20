"use client";

import { useEffect, useState } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import ToolShell, { ui } from "../components/ToolShell";
import { getCroppedImg } from "@/lib/cropImage";

const aspects = [
  { label: "Square 1:1", value: 1 },
  { label: "Landscape 4:3", value: 4/3 },
  { label: "Wide 16:9", value: 16/9 },
  { label: "Portrait 3:4", value: 3/4 },
];

export default function CropPage(){
  const [file,setFile]=useState<File|null>(null);const [imageUrl,setImageUrl]=useState("");
  const [crop,setCrop]=useState<Point>({x:0,y:0});const [zoom,setZoom]=useState(1);const [aspect,setAspect]=useState(1);
  const [pixels,setPixels]=useState<Area|null>(null);const [result,setResult]=useState<Blob|null>(null);const [resultUrl,setResultUrl]=useState("");
  const [working,setWorking]=useState(false);const [error,setError]=useState("");

  useEffect(()=>()=>{if(imageUrl)URL.revokeObjectURL(imageUrl);if(resultUrl)URL.revokeObjectURL(resultUrl)},[imageUrl,resultUrl]);
  function clear(){if(resultUrl)URL.revokeObjectURL(resultUrl);setResult(null);setResultUrl("")}
  function onFile(e:React.ChangeEvent<HTMLInputElement>){const f=e.target.files?.[0];if(!f)return;if(!["image/jpeg","image/png","image/webp"].includes(f.type)){setError("Please choose a JPG, PNG, or WebP image.");return}if(imageUrl)URL.revokeObjectURL(imageUrl);setFile(f);setImageUrl(URL.createObjectURL(f));setCrop({x:0,y:0});setZoom(1);setPixels(null);setError("");clear()}
  async function process(){if(!imageUrl||!pixels)return;try{setWorking(true);setError("");clear();const blob=await getCroppedImg(imageUrl,pixels);if(!blob)throw new Error();setResult(blob);setResultUrl(URL.createObjectURL(blob))}catch{setError("Crop failed. Please try another image.")}finally{setWorking(false)}}
  function download(){if(!result||!file)return;const a=document.createElement("a");a.href=resultUrl;a.download=`${file.name.replace(/\.[^/.]+$/,"")}-cropped.jpg`;a.click()}

  return <ToolShell eyebrow="Free image tool" title="Crop Image" icon="⌗"
    description="Drag, zoom, and crop your image precisely without uploading it anywhere.">
    <label className={ui.upload}><span className="mb-4 text-4xl">⌗</span><span className="text-xl font-semibold">Drop an image here</span><span className="mt-2 text-sm text-zinc-500">or click to browse · JPG, PNG, WebP</span><input className="hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile}/></label>
    {error&&<div className={`mt-5 ${ui.error}`}>{error}</div>}
    {file&&imageUrl&&<div className="mt-6 grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
      <div className={ui.panel}><div className="relative h-[420px] overflow-hidden rounded-xl bg-black md:h-[520px]"><Cropper image={imageUrl} crop={crop} zoom={zoom} aspect={aspect} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={(_,p)=>setPixels(p)} showGrid/></div></div>
      <div className={ui.panel}>
        <h2 className="text-xl font-semibold">Crop settings</h2>
        <div className="mt-6 grid grid-cols-2 gap-2">{aspects.map(a=><button key={a.label} onClick={()=>{setAspect(a.value);clear()}} className={`rounded-xl border px-3 py-3 text-sm ${aspect===a.value?"border-violet-500 bg-violet-500/10 text-violet-300":"border-zinc-700 hover:border-violet-500"}`}>{a.label}</button>)}</div>
        <div className="mt-6 flex justify-between text-sm"><span className="text-zinc-400">Zoom</span><span>{zoom.toFixed(1)}×</span></div>
        <input type="range" min="1" max="3" step=".1" value={zoom} onChange={e=>{setZoom(Number(e.target.value));clear()}} className="mt-3 w-full accent-violet-500"/>
        {pixels&&<div className="mt-6 rounded-xl border border-zinc-800 bg-[#12151d] p-4 text-sm"><div className="flex justify-between"><span className="text-zinc-500">Output</span><span>{Math.round(pixels.width)} × {Math.round(pixels.height)}px</span></div></div>}
        <button onClick={process} disabled={working} className={`mt-8 ${ui.primary}`}>{working?"Cropping...":"Crop image"}</button>
        {result&&<button onClick={download} className={`mt-3 ${ui.secondary}`}>Download cropped image</button>}
      </div>
    </div>}
    {resultUrl&&<div className={`mt-5 ${ui.panel}`}><h2 className="mb-4 text-xl font-semibold">Cropped preview</h2><img src={resultUrl} alt="Cropped" className="max-h-[520px] w-full rounded-xl bg-black object-contain"/></div>}
  </ToolShell>
}
