"use client";

import { useEffect, useRef, useState } from "react";
import { getPaletteSync } from "colorthief";
import ToolShell, { ui } from "../components/ToolShell";

function formatBytes(bytes:number){return bytes<1048576?`${(bytes/1024).toFixed(1)} KB`:`${(bytes/1048576).toFixed(2)} MB`}

export default function PalettePage(){
  const [file,setFile]=useState<File|null>(null);const [preview,setPreview]=useState("");const [colors,setColors]=useState<string[]>([]);
  const [working,setWorking]=useState(false);const [error,setError]=useState("");const [copied,setCopied]=useState("");
  const imageRef=useRef<HTMLImageElement|null>(null);
  useEffect(()=>()=>{if(preview)URL.revokeObjectURL(preview)},[preview]);

  function onFile(e:React.ChangeEvent<HTMLInputElement>){const f=e.target.files?.[0];if(!f)return;if(!["image/jpeg","image/png","image/webp"].includes(f.type)){setError("Please choose a JPG, PNG, or WebP image.");return}if(preview)URL.revokeObjectURL(preview);setFile(f);setPreview(URL.createObjectURL(f));setColors([]);setError("")}
  function generate(){if(!imageRef.current)return;try{setWorking(true);setError("");const p=getPaletteSync(imageRef.current,{colorCount:6,quality:10});if(!p)throw new Error();setColors(p.map(c=>c.hex().toUpperCase()))}catch{setError("Could not extract colors from this image.")}finally{setWorking(false)}}
  async function copy(c:string){await navigator.clipboard.writeText(c);setCopied(c);setTimeout(()=>setCopied(""),1200)}
  function download(){
    if(!colors.length)return;const canvas=document.createElement("canvas");canvas.width=1200;canvas.height=720;const ctx=canvas.getContext("2d");if(!ctx)return;
    ctx.fillStyle="#090b10";ctx.fillRect(0,0,1200,720);ctx.fillStyle="#fff";ctx.font="bold 52px Arial";ctx.fillText("CreatorKit Color Palette",70,90);
    const gap=20,w=(1060-gap*5)/6;colors.forEach((c,i)=>{const x=70+i*(w+gap);ctx.fillStyle=c;ctx.fillRect(x,180,w,340);ctx.fillStyle="#fff";ctx.fillRect(x,520,w,80);ctx.fillStyle="#111827";ctx.font="bold 20px Arial";ctx.textAlign="center";ctx.fillText(c,x+w/2,570)});
    canvas.toBlob(b=>{if(!b)return;const u=URL.createObjectURL(b),a=document.createElement("a");a.href=u;a.download="creatorkit-palette.png";a.click();URL.revokeObjectURL(u)},"image/png")
  }

  return <ToolShell eyebrow="Free design tool" title="Color Palette" icon="◉"
    description="Extract useful colors from any image, copy their HEX values, and export a shareable palette.">
    <label className={ui.upload}><span className="mb-4 text-4xl">◉</span><span className="text-xl font-semibold">Drop an image here</span><span className="mt-2 text-sm text-zinc-500">or click to browse · JPG, PNG, WebP</span><input className="hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile}/></label>
    {error&&<div className={`mt-5 ${ui.error}`}>{error}</div>}
    {file&&<div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
      <div className={ui.panel}><img ref={imageRef} src={preview} crossOrigin="anonymous" alt="Selected" className="h-96 w-full rounded-xl bg-black object-contain"/><p className="mt-4 truncate font-medium">{file.name}</p><p className="mt-1 text-sm text-zinc-500">{formatBytes(file.size)}</p></div>
      <div className={ui.panel}><h2 className="text-xl font-semibold">Palette settings</h2><p className="mt-3 text-sm leading-6 text-zinc-400">CreatorKit will find six dominant colors from your image.</p><button onClick={generate} disabled={working} className={`mt-8 ${ui.primary}`}>{working?"Generating...":"Generate palette"}</button>{colors.length>0&&<button onClick={download} className={`mt-3 ${ui.secondary}`}>Download palette PNG</button>}</div>
    </div>}
    {colors.length>0&&<div className={`mt-5 ${ui.panel}`}><div className="mb-5 flex items-center justify-between"><div><h2 className="text-xl font-semibold">Extracted colors</h2><p className="mt-1 text-sm text-zinc-500">Click a color to copy its HEX value.</p></div>{copied&&<span className="text-sm text-emerald-400">Copied {copied}</span>}</div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{colors.map(c=><button key={c} onClick={()=>copy(c)} className="overflow-hidden rounded-2xl border border-zinc-800 text-left transition hover:-translate-y-1 hover:border-violet-500"><span className="block h-36" style={{backgroundColor:c}}/><span className="flex justify-between bg-[#12151d] px-4 py-4"><strong className="font-mono">{c}</strong><small className="text-zinc-500">Copy</small></span></button>)}</div></div>}
  </ToolShell>
}
