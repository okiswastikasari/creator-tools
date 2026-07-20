"use client";

import { useEffect, useState } from "react";
import ToolShell, { ui } from "../components/ToolShell";

type OutputFormat = "image/jpeg" | "image/png" | "image/webp";
const formats = [
  { value: "image/jpeg" as OutputFormat, label: "JPG", ext: "jpg" },
  { value: "image/png" as OutputFormat, label: "PNG", ext: "png" },
  { value: "image/webp" as OutputFormat, label: "WebP", ext: "webp" },
];

function formatBytes(bytes:number){return bytes<1048576?`${(bytes/1024).toFixed(1)} KB`:`${(bytes/1048576).toFixed(2)} MB`}

export default function ResizePage(){
  const [file,setFile]=useState<File|null>(null);
  const [preview,setPreview]=useState("");
  const [ow,setOw]=useState(0); const [oh,setOh]=useState(0);
  const [width,setWidth]=useState(0); const [height,setHeight]=useState(0);
  const [ratio,setRatio]=useState(true);
  const [format,setFormat]=useState<OutputFormat>("image/jpeg");
  const [quality,setQuality]=useState(.9);
  const [result,setResult]=useState<Blob|null>(null); const [resultUrl,setResultUrl]=useState("");
  const [working,setWorking]=useState(false); const [error,setError]=useState("");

  useEffect(()=>()=>{if(preview)URL.revokeObjectURL(preview);if(resultUrl)URL.revokeObjectURL(resultUrl)},[preview,resultUrl]);
  function clear(){if(resultUrl)URL.revokeObjectURL(resultUrl);setResult(null);setResultUrl("")}
  function onFile(e:React.ChangeEvent<HTMLInputElement>){
    const f=e.target.files?.[0]; if(!f)return;
    if(!["image/jpeg","image/png","image/webp"].includes(f.type)){setError("Please choose a JPG, PNG, or WebP image.");return}
    if(preview)URL.revokeObjectURL(preview);
    const url=URL.createObjectURL(f), img=new Image(); img.src=url;
    img.onload=()=>{setFile(f);setPreview(url);setOw(img.naturalWidth);setOh(img.naturalHeight);setWidth(img.naturalWidth);setHeight(img.naturalHeight);setError("");clear()}
  }
  function changeW(v:number){v=Math.max(1,Math.round(v));setWidth(v);if(ratio&&ow) setHeight(Math.max(1,Math.round(v*oh/ow)));clear()}
  function changeH(v:number){v=Math.max(1,Math.round(v));setHeight(v);if(ratio&&oh) setWidth(Math.max(1,Math.round(v*ow/oh)));clear()}
  function preset(p:number){setWidth(Math.round(ow*p));setHeight(Math.round(oh*p));clear()}
  async function resize(){
    if(!file)return;
    if(width>12000||height>12000){setError("Maximum supported size is 12,000 × 12,000 pixels.");return}
    try{
      setWorking(true);setError("");clear();
      const src=URL.createObjectURL(file),img=new Image();img.src=src;
      await new Promise<void>((res,rej)=>{img.onload=()=>res();img.onerror=()=>rej()});
      const canvas=document.createElement("canvas");canvas.width=width;canvas.height=height;
      const ctx=canvas.getContext("2d");if(!ctx)throw new Error();
      ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality="high";
      if(format==="image/jpeg"){ctx.fillStyle="#fff";ctx.fillRect(0,0,width,height)}
      ctx.drawImage(img,0,0,width,height);
      const blob=await new Promise<Blob>((res,rej)=>canvas.toBlob(b=>b?res(b):rej(),format,format==="image/png"?undefined:quality));
      URL.revokeObjectURL(src);setResult(blob);setResultUrl(URL.createObjectURL(blob));
    }catch{setError("Resize failed. Please try another image.")}finally{setWorking(false)}
  }
  function download(){if(!result||!file)return;const f=formats.find(x=>x.value===format)!;const a=document.createElement("a");a.href=resultUrl;a.download=`${file.name.replace(/\.[^/.]+$/,"")}-${width}x${height}.${f.ext}`;a.click()}
  const chosen=formats.find(f=>f.value===format)!;

  return <ToolShell eyebrow="Free image tool" title="Resize Image" icon="↔"
    description="Change image dimensions while preserving proportions and export in the format you need.">
    <label className={ui.upload}><span className="mb-4 text-4xl">↔</span><span className="text-xl font-semibold">Drop an image here</span><span className="mt-2 text-sm text-zinc-500">or click to browse · JPG, PNG, WebP</span><input className="hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile}/></label>
    {error&&<div className={`mt-5 ${ui.error}`}>{error}</div>}
    {file&&<div className="mt-6 grid gap-5 lg:grid-cols-2">
      <div className={ui.panel}><img src={preview} alt="Original" className="h-80 w-full rounded-xl bg-black object-contain"/><p className="mt-4 truncate font-medium">{file.name}</p><p className="mt-1 text-sm text-zinc-500">{ow} × {oh}px · {formatBytes(file.size)}</p></div>
      <div className={ui.panel}>
        <h2 className="text-xl font-semibold">Resize settings</h2>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <label className="text-sm text-zinc-400">Width<input className={`mt-2 ${ui.input}`} type="number" value={width} onChange={e=>changeW(Number(e.target.value))}/></label>
          <label className="text-sm text-zinc-400">Height<input className={`mt-2 ${ui.input}`} type="number" value={height} onChange={e=>changeH(Number(e.target.value))}/></label>
        </div>
        <label className="mt-5 flex items-center gap-3 text-sm text-zinc-300"><input type="checkbox" checked={ratio} onChange={e=>setRatio(e.target.checked)} className="accent-violet-500"/>Keep original proportions</label>
        <div className="mt-6 grid grid-cols-4 gap-2">{[.25,.5,.75,1].map(p=><button key={p} onClick={()=>preset(p)} className="rounded-lg border border-zinc-700 py-2 text-sm hover:border-violet-500">{p*100}%</button>)}</div>
        <select value={format} onChange={e=>{setFormat(e.target.value as OutputFormat);clear()}} className={`mt-6 ${ui.input}`}>{formats.map(f=><option key={f.value} value={f.value}>{f.label}</option>)}</select>
        {format!=="image/png"&&<input type="range" min=".2" max="1" step=".05" value={quality} onChange={e=>{setQuality(Number(e.target.value));clear()}} className="mt-6 w-full accent-violet-500"/>}
        <button onClick={resize} disabled={working} className={`mt-8 ${ui.primary}`}>{working?"Resizing...":`Resize to ${width} × ${height}px`}</button>
        {result&&<button onClick={download} className={`mt-3 ${ui.secondary}`}>Download {chosen.label}</button>}
      </div>
    </div>}
    {resultUrl&&<div className={`mt-5 ${ui.panel}`}><h2 className="mb-4 text-xl font-semibold">Resized preview</h2><img src={resultUrl} alt="Resized" className="max-h-[520px] w-full rounded-xl bg-black object-contain"/></div>}
  </ToolShell>
}
