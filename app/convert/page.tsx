"use client";

import { useEffect, useState } from "react";
import ToolShell, { ui } from "../components/ToolShell";

type OutputFormat = "image/jpeg" | "image/png" | "image/webp";
const formats = [
  { value: "image/jpeg" as OutputFormat, label: "JPG", ext: "jpg" },
  { value: "image/png" as OutputFormat, label: "PNG", ext: "png" },
  { value: "image/webp" as OutputFormat, label: "WebP", ext: "webp" },
];

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ConvertPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [format, setFormat] = useState<OutputFormat>("image/webp");
  const [quality, setQuality] = useState(0.9);
  const [result, setResult] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState("");
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
  }, [preview, resultUrl]);

  function clearResult() {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResult(null); setResultUrl("");
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.files?.[0];
    if (!next) return;
    if (!["image/jpeg","image/png","image/webp"].includes(next.type)) {
      setError("Please choose a JPG, PNG, or WebP image."); return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setFile(next); setPreview(URL.createObjectURL(next)); setError(""); clearResult();
  }

  async function convert() {
    if (!file) return;
    try {
      setWorking(true); setError(""); clearResult();
      const src = URL.createObjectURL(file);
      const image = new Image(); image.src = src;
      await new Promise<void>((resolve, reject) => { image.onload=()=>resolve(); image.onerror=()=>reject(); });
      const canvas = document.createElement("canvas");
      canvas.width=image.naturalWidth; canvas.height=image.naturalHeight;
      const ctx=canvas.getContext("2d");
      if (!ctx) throw new Error();
      if (format==="image/jpeg") { ctx.fillStyle="#fff"; ctx.fillRect(0,0,canvas.width,canvas.height); }
      ctx.drawImage(image,0,0);
      const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(),format,format==="image/png"?undefined:quality));
      URL.revokeObjectURL(src);
      setResult(blob); setResultUrl(URL.createObjectURL(blob));
    } catch { setError("Conversion failed. Please try another image."); }
    finally { setWorking(false); }
  }

  function download() {
    if (!result || !file) return;
    const chosen=formats.find(f=>f.value===format)!;
    const link=document.createElement("a");
    link.href=resultUrl;
    link.download=`${file.name.replace(/\.[^/.]+$/,"")}.${chosen.ext}`;
    link.click();
  }

  const chosen=formats.find(f=>f.value===format)!;

  return (
    <ToolShell eyebrow="Free image tool" title="Convert Image" icon="↻"
      description="Convert JPG, PNG, and WebP images locally with quality controls and instant previews.">
      <label className={ui.upload}>
        <span className="mb-4 text-4xl">⇄</span>
        <span className="text-xl font-semibold">Drop an image here</span>
        <span className="mt-2 text-sm text-zinc-500">or click to browse · JPG, PNG, WebP</span>
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile} className="hidden" />
      </label>
      {error && <div className={`mt-5 ${ui.error}`}>{error}</div>}

      {file && (
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className={ui.panel}>
            <img src={preview} alt="Original preview" className="h-80 w-full rounded-xl bg-black object-contain" />
            <p className="mt-4 truncate font-medium">{file.name}</p>
            <p className="mt-1 text-sm text-zinc-500">Original · {formatBytes(file.size)}</p>
          </div>

          <div className={ui.panel}>
            <h2 className="text-xl font-semibold">Conversion settings</h2>
            <label className="mt-6 block text-sm text-zinc-400">Convert to</label>
            <select value={format} onChange={(e)=>{setFormat(e.target.value as OutputFormat);clearResult();}} className={`mt-2 ${ui.input}`}>
              {formats.map(f=><option key={f.value} value={f.value}>{f.label}</option>)}
            </select>

            {format!=="image/png" && <>
              <div className="mt-6 flex justify-between text-sm">
                <span className="text-zinc-400">Quality</span><span>{Math.round(quality*100)}%</span>
              </div>
              <input type="range" min="0.2" max="1" step="0.05" value={quality}
                onChange={(e)=>{setQuality(Number(e.target.value));clearResult();}}
                className="mt-3 w-full accent-violet-500" />
            </>}

            <button onClick={convert} disabled={working} className={`mt-8 ${ui.primary}`}>
              {working ? "Converting..." : `Convert to ${chosen.label}`}
            </button>
            {result && <div className={`mt-5 ${ui.success}`}>
              <div className="flex justify-between text-sm"><span className="text-zinc-400">Converted size</span><span>{formatBytes(result.size)}</span></div>
              <button onClick={download} className={`mt-4 ${ui.secondary}`}>Download {chosen.label}</button>
            </div>}
          </div>
        </div>
      )}

      {resultUrl && <div className={`mt-5 ${ui.panel}`}>
        <h2 className="mb-4 text-xl font-semibold">Converted preview</h2>
        <img src={resultUrl} alt="Converted preview" className="max-h-[520px] w-full rounded-xl bg-black object-contain" />
      </div>}
    </ToolShell>
  );
}
