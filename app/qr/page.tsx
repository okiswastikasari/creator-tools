"use client";

import { useMemo, useState } from "react";
import QRCode from "qrcode";
import ToolShell, { ui } from "../components/ToolShell";

type Level="L"|"M"|"Q"|"H";

export default function QRPage(){
  const [value,setValue]=useState("https://creator-tools-two.vercel.app");
  const [size,setSize]=useState(320);const [foreground,setForeground]=useState("#111827");const [background,setBackground]=useState("#FFFFFF");
  const [level,setLevel]=useState<Level>("M");const [png,setPng]=useState("");const [svg,setSvg]=useState("");const [working,setWorking]=useState(false);const [error,setError]=useState("");const [copied,setCopied]=useState(false);
  const trimmed=useMemo(()=>value.trim(),[value]);
  function clear(){setPng("");setSvg("");setError("")}
  async function generate(){if(!trimmed){setError("Please enter a URL or text first.");return}try{setWorking(true);setError("");const options={width:size,margin:2,errorCorrectionLevel:level,color:{dark:foreground,light:background}};const [p,s]=await Promise.all([QRCode.toDataURL(trimmed,{...options,type:"image/png"}),QRCode.toString(trimmed,{...options,type:"svg"})]);setPng(p);setSvg(s)}catch{setError("Could not generate the QR code.")}finally{setWorking(false)}}
  function downloadPng(){if(!png)return;const a=document.createElement("a");a.href=png;a.download="creatorkit-qr-code.png";a.click()}
  function downloadSvg(){if(!svg)return;const b=new Blob([svg],{type:"image/svg+xml"}),u=URL.createObjectURL(b),a=document.createElement("a");a.href=u;a.download="creatorkit-qr-code.svg";a.click();URL.revokeObjectURL(u)}
  async function copy(){if(!trimmed)return;await navigator.clipboard.writeText(trimmed);setCopied(true);setTimeout(()=>setCopied(false),1200)}
  function reset(){setValue("");setSize(320);setForeground("#111827");setBackground("#FFFFFF");setLevel("M");clear()}

  return <ToolShell eyebrow="Free utility tool" title="QR Code Generator" icon="▦"
    description="Create custom QR codes from any URL or text and download them as PNG or SVG.">
    {error&&<div className={`mb-5 ${ui.error}`}>{error}</div>}
    <div className="grid gap-5 lg:grid-cols-[1fr_.9fr]">
      <div className={ui.panel}>
        <h2 className="text-xl font-semibold">QR settings</h2>
        <label className="mt-6 block text-sm text-zinc-400">URL or text</label>
        <textarea rows={5} value={value} onChange={e=>{setValue(e.target.value);clear()}} className={`mt-2 resize-none ${ui.input}`}/>
        <div className="mt-2 flex justify-between text-xs text-zinc-500"><span>{value.length} characters</span><button onClick={copy} className="text-violet-300">{copied?"Copied!":"Copy text"}</button></div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-zinc-400">QR size<select value={size} onChange={e=>{setSize(Number(e.target.value));clear()}} className={`mt-2 ${ui.input}`}><option value={256}>256 × 256</option><option value={320}>320 × 320</option><option value={512}>512 × 512</option><option value={768}>768 × 768</option><option value={1024}>1024 × 1024</option></select></label>
          <label className="text-sm text-zinc-400">Error correction<select value={level} onChange={e=>{setLevel(e.target.value as Level);clear()}} className={`mt-2 ${ui.input}`}><option value="L">Low</option><option value="M">Medium</option><option value="Q">Quartile</option><option value="H">High</option></select></label>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="rounded-xl border border-zinc-800 bg-[#12151d] p-4 text-sm text-zinc-400">QR color<div className="mt-3 flex items-center gap-3"><input type="color" value={foreground} onChange={e=>{setForeground(e.target.value);clear()}}/><span className="font-mono text-white">{foreground.toUpperCase()}</span></div></label>
          <label className="rounded-xl border border-zinc-800 bg-[#12151d] p-4 text-sm text-zinc-400">Background<div className="mt-3 flex items-center gap-3"><input type="color" value={background} onChange={e=>{setBackground(e.target.value);clear()}}/><span className="font-mono text-white">{background.toUpperCase()}</span></div></label>
        </div>
        <button onClick={generate} disabled={working||!trimmed} className={`mt-8 ${ui.primary}`}>{working?"Generating...":"Generate QR code"}</button>
        <button onClick={reset} className={`mt-3 ${ui.secondary}`}>Reset</button>
      </div>
      <div className={ui.panel}>
        <h2 className="text-xl font-semibold">QR preview</h2>
        <div className="mt-6 flex min-h-[380px] items-center justify-center rounded-2xl border border-dashed border-zinc-700 p-6" style={{backgroundColor:png?background:undefined}}>
          {png?<img src={png} alt="Generated QR code" className="h-auto max-h-[320px] w-full max-w-[320px]"/>:<div className="text-center"><div className="text-5xl text-zinc-600">▦</div><p className="mt-4 font-semibold">Your QR code will appear here</p><p className="mt-2 text-sm text-zinc-500">Enter text and click Generate QR code.</p></div>}
        </div>
        {png&&<div className="mt-5 space-y-3"><button onClick={downloadPng} className={ui.primary}>Download PNG</button><button onClick={downloadSvg} className={ui.secondary}>Download SVG</button></div>}
      </div>
    </div>
    <div className="mt-5 grid gap-4 md:grid-cols-3">{[["No uploads","Your text is processed locally in your browser."],["PNG and SVG","Download a sharp file for digital use or printing."],["Custom colors","Match your QR code to your personal or business branding."]].map(([t,d])=><div key={t} className={ui.panel}><p className="font-semibold">{t}</p><p className="mt-2 text-sm leading-6 text-zinc-400">{d}</p></div>)}</div>
  </ToolShell>
}
