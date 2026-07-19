"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import QRCode from "qrcode";
import {
  downloadBlob,
  extensionFor,
  extractPalette,
  formatBytes,
  ImageFormat,
  readFileAsDataUrl,
  transformImage,
} from "@/lib/imageUtils";

type ToolId = "compress" | "convert" | "resize" | "crop" | "palette" | "qr";

type ImageFileState = {
  file: File;
  url: string;
  width: number;
  height: number;
};

const tools: Array<{ id: ToolId; icon: string; title: string; description: string }> = [
  { id: "compress", icon: "↘", title: "Compress Image", description: "Reduce JPG, PNG, and WebP file sizes." },
  { id: "convert", icon: "⇄", title: "Convert Image", description: "Convert between JPG, PNG, and WebP." },
  { id: "resize", icon: "↔", title: "Resize Image", description: "Change image dimensions while keeping quality." },
  { id: "crop", icon: "⌗", title: "Crop Image", description: "Drag, zoom, and crop images precisely." },
  { id: "palette", icon: "◉", title: "Color Palette", description: "Extract useful colors from any image." },
  { id: "qr", icon: "▦", title: "QR Generator", description: "Create downloadable QR codes instantly." },
];

function useImageFile() {
  const [image, setImage] = useState<ImageFileState | null>(null);
  const [error, setError] = useState("");

  const select = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose a valid image file.");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setError("Maximum file size is 25 MB.");
      return;
    }

    try {
      setError("");
      const url = await readFileAsDataUrl(file);
      const preview = new Image();
      preview.onload = () =>
        setImage({ file, url, width: preview.naturalWidth, height: preview.naturalHeight });
      preview.onerror = () => setError("This image could not be opened.");
      preview.src = url;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not read the image.");
    }
  };

  const reset = () => {
    setImage(null);
    setError("");
  };

  return { image, error, select, reset };
}

function UploadBox({
  image,
  error,
  onSelect,
  onReset,
}: {
  image: ImageFileState | null;
  error: string;
  onSelect: (event: ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}) {
  return (
    <div className="upload-wrap">
      {!image ? (
        <label className="upload-box">
          <span className="upload-icon">＋</span>
          <strong>Choose an image</strong>
          <span>JPG, PNG, or WebP · up to 25 MB</span>
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onSelect} />
        </label>
      ) : (
        <div className="file-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.url} alt="Selected upload preview" />
          <div>
            <strong>{image.file.name}</strong>
            <span>
              {image.width} × {image.height} · {formatBytes(image.file.size)}
            </span>
          </div>
          <button className="text-button" onClick={onReset} type="button">
            Replace
          </button>
        </div>
      )}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

function ResultCard({
  url,
  filename,
  size,
  originalSize,
  onDownload,
}: {
  url: string;
  filename: string;
  size: number;
  originalSize?: number;
  onDownload: () => void;
}) {
  const saving = originalSize ? Math.max(0, Math.round((1 - size / originalSize) * 100)) : null;
  return (
    <div className="result-card">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt="Processed result preview" />
      <div className="result-info">
        <strong>{filename}</strong>
        <span>
          {formatBytes(size)} {saving !== null && saving > 0 ? `· ${saving}% smaller` : ""}
        </span>
      </div>
      <button className="primary-button" onClick={onDownload} type="button">
        Download
      </button>
    </div>
  );
}

function CompressTool() {
  const upload = useImageFile();
  const [quality, setQuality] = useState(75);
  const [format, setFormat] = useState<ImageFormat>("image/webp");
  const [working, setWorking] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; url: string; name: string } | null>(null);
  const [error, setError] = useState("");

  const process = async () => {
    if (!upload.image) return;
    try {
      setWorking(true);
      setError("");
      const blob = await transformImage({
        source: upload.image.url,
        format,
        quality: quality / 100,
      });
      if (result) URL.revokeObjectURL(result.url);
      const name = `compressed-${upload.image.file.name.replace(/\.[^.]+$/, "")}.${extensionFor(format)}`;
      setResult({ blob, url: URL.createObjectURL(blob), name });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Compression failed.");
    } finally {
      setWorking(false);
    }
  };

  return (
    <ToolPanel title="Compress Image" subtitle="Files are processed locally in your browser and are not uploaded.">
      <UploadBox {...upload} onSelect={upload.select} onReset={() => { upload.reset(); setResult(null); }} />
      {upload.image && (
        <div className="settings-grid">
          <label className="field">
            <span>Output format</span>
            <select value={format} onChange={(event) => setFormat(event.target.value as ImageFormat)}>
              <option value="image/webp">WebP — smallest</option>
              <option value="image/jpeg">JPG — compatible</option>
              <option value="image/png">PNG — lossless</option>
            </select>
          </label>
          <label className="field">
            <span>Quality: {quality}%</span>
            <input type="range" min="25" max="95" value={quality} onChange={(event) => setQuality(Number(event.target.value))} />
          </label>
        </div>
      )}
      {error && <p className="error-text">{error}</p>}
      {upload.image && <button className="primary-button wide" onClick={process} disabled={working}>{working ? "Compressing…" : "Compress image"}</button>}
      {result && <ResultCard url={result.url} filename={result.name} size={result.blob.size} originalSize={upload.image?.file.size} onDownload={() => downloadBlob(result.blob, result.name)} />}
    </ToolPanel>
  );
}

function ConvertTool() {
  const upload = useImageFile();
  const [format, setFormat] = useState<ImageFormat>("image/png");
  const [working, setWorking] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; url: string; name: string } | null>(null);
  const [error, setError] = useState("");

  const process = async () => {
    if (!upload.image) return;
    try {
      setWorking(true);
      setError("");
      const blob = await transformImage({ source: upload.image.url, format, quality: 0.92 });
      if (result) URL.revokeObjectURL(result.url);
      const name = `${upload.image.file.name.replace(/\.[^.]+$/, "")}.${extensionFor(format)}`;
      setResult({ blob, url: URL.createObjectURL(blob), name });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Conversion failed.");
    } finally {
      setWorking(false);
    }
  };

  return (
    <ToolPanel title="Convert Image" subtitle="Convert JPG, PNG, and WebP without sending files to a server.">
      <UploadBox {...upload} onSelect={upload.select} onReset={() => { upload.reset(); setResult(null); }} />
      {upload.image && (
        <label className="field single-field">
          <span>Convert to</span>
          <select value={format} onChange={(event) => setFormat(event.target.value as ImageFormat)}>
            <option value="image/jpeg">JPG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WebP</option>
          </select>
        </label>
      )}
      {error && <p className="error-text">{error}</p>}
      {upload.image && <button className="primary-button wide" onClick={process} disabled={working}>{working ? "Converting…" : "Convert image"}</button>}
      {result && <ResultCard url={result.url} filename={result.name} size={result.blob.size} onDownload={() => downloadBlob(result.blob, result.name)} />}
    </ToolPanel>
  );
}

function ResizeTool() {
  const upload = useImageFile();
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(800);
  const [locked, setLocked] = useState(true);
  const [format, setFormat] = useState<ImageFormat>("image/webp");
  const [working, setWorking] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; url: string; name: string } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (upload.image) {
      setWidth(upload.image.width);
      setHeight(upload.image.height);
    }
  }, [upload.image]);

  const changeWidth = (value: number) => {
    const safe = Math.max(1, Math.min(12000, value || 1));
    setWidth(safe);
    if (locked && upload.image) setHeight(Math.max(1, Math.round(safe * upload.image.height / upload.image.width)));
  };
  const changeHeight = (value: number) => {
    const safe = Math.max(1, Math.min(12000, value || 1));
    setHeight(safe);
    if (locked && upload.image) setWidth(Math.max(1, Math.round(safe * upload.image.width / upload.image.height)));
  };

  const process = async () => {
    if (!upload.image) return;
    try {
      setWorking(true);
      setError("");
      const blob = await transformImage({ source: upload.image.url, width, height, format, quality: 0.9 });
      if (result) URL.revokeObjectURL(result.url);
      const name = `resized-${width}x${height}.${extensionFor(format)}`;
      setResult({ blob, url: URL.createObjectURL(blob), name });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Resize failed.");
    } finally {
      setWorking(false);
    }
  };

  return (
    <ToolPanel title="Resize Image" subtitle="Set exact pixel dimensions with optional aspect-ratio lock.">
      <UploadBox {...upload} onSelect={upload.select} onReset={() => { upload.reset(); setResult(null); }} />
      {upload.image && (
        <>
          <div className="settings-grid three">
            <label className="field"><span>Width (px)</span><input type="number" min="1" max="12000" value={width} onChange={(event) => changeWidth(Number(event.target.value))} /></label>
            <label className="field"><span>Height (px)</span><input type="number" min="1" max="12000" value={height} onChange={(event) => changeHeight(Number(event.target.value))} /></label>
            <label className="field"><span>Output</span><select value={format} onChange={(event) => setFormat(event.target.value as ImageFormat)}><option value="image/webp">WebP</option><option value="image/jpeg">JPG</option><option value="image/png">PNG</option></select></label>
          </div>
          <label className="check-row"><input type="checkbox" checked={locked} onChange={(event) => setLocked(event.target.checked)} /><span>Keep original proportions</span></label>
        </>
      )}
      {error && <p className="error-text">{error}</p>}
      {upload.image && <button className="primary-button wide" onClick={process} disabled={working}>{working ? "Resizing…" : "Resize image"}</button>}
      {result && <ResultCard url={result.url} filename={result.name} size={result.blob.size} onDownload={() => downloadBlob(result.blob, result.name)} />}
    </ToolPanel>
  );
}

function CropTool() {
  const upload = useImageFile();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(1);
  const [pixels, setPixels] = useState<Area | null>(null);
  const [working, setWorking] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; url: string; name: string } | null>(null);
  const [error, setError] = useState("");

  const process = async () => {
    if (!upload.image || !pixels) return;
    try {
      setWorking(true);
      setError("");
      const blob = await transformImage({ source: upload.image.url, crop: pixels, format: "image/png" });
      if (result) URL.revokeObjectURL(result.url);
      const name = `cropped-${upload.image.file.name.replace(/\.[^.]+$/, "")}.png`;
      setResult({ blob, url: URL.createObjectURL(blob), name });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Crop failed.");
    } finally {
      setWorking(false);
    }
  };

  return (
    <ToolPanel title="Crop Image" subtitle="Drag the image, adjust zoom, then download the cropped result.">
      <UploadBox {...upload} onSelect={upload.select} onReset={() => { upload.reset(); setResult(null); }} />
      {upload.image && (
        <>
          <div className="crop-stage">
            <Cropper image={upload.image.url} crop={crop} zoom={zoom} aspect={aspect} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={(_, croppedAreaPixels) => setPixels(croppedAreaPixels)} />
          </div>
          <div className="settings-grid">
            <label className="field"><span>Shape</span><select value={aspect} onChange={(event) => setAspect(Number(event.target.value))}><option value={1}>Square 1:1</option><option value={4 / 3}>Landscape 4:3</option><option value={16 / 9}>Wide 16:9</option><option value={3 / 4}>Portrait 3:4</option></select></label>
            <label className="field"><span>Zoom: {zoom.toFixed(1)}×</span><input type="range" min="1" max="3" step="0.1" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} /></label>
          </div>
        </>
      )}
      {error && <p className="error-text">{error}</p>}
      {upload.image && <button className="primary-button wide" onClick={process} disabled={working}>{working ? "Cropping…" : "Crop image"}</button>}
      {result && <ResultCard url={result.url} filename={result.name} size={result.blob.size} onDownload={() => downloadBlob(result.blob, result.name)} />}
    </ToolPanel>
  );
}

function PaletteTool() {
  const upload = useImageFile();
  const [colors, setColors] = useState<string[]>([]);
  const [working, setWorking] = useState(false);
  const [copied, setCopied] = useState("");
  const [error, setError] = useState("");

  const generate = async () => {
    if (!upload.image) return;
    try {
      setWorking(true);
      setError("");
      setColors(await extractPalette(upload.image.url, 6));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not extract colors.");
    } finally {
      setWorking(false);
    }
  };

  const copy = async (color: string) => {
    await navigator.clipboard.writeText(color);
    setCopied(color);
    window.setTimeout(() => setCopied(""), 1200);
  };

  return (
    <ToolPanel title="Color Palette" subtitle="Extract six dominant colors for design, branding, and content creation.">
      <UploadBox {...upload} onSelect={upload.select} onReset={() => { upload.reset(); setColors([]); }} />
      {error && <p className="error-text">{error}</p>}
      {upload.image && <button className="primary-button wide" onClick={generate} disabled={working}>{working ? "Finding colors…" : "Generate palette"}</button>}
      {colors.length > 0 && <div className="palette-grid">{colors.map((color) => <button key={color} className="color-card" type="button" onClick={() => copy(color)}><span style={{ background: color }} /><strong>{color}</strong><small>{copied === color ? "Copied!" : "Click to copy"}</small></button>)}</div>}
    </ToolPanel>
  );
}

function QrTool() {
  const [text, setText] = useState("https://example.com");
  const [size, setSize] = useState(600);
  const [dark, setDark] = useState("#111827");
  const [light, setLight] = useState("#FFFFFF");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const generate = async () => {
    if (!text.trim()) {
      setError("Enter a link or text first.");
      return;
    }
    try {
      setError("");
      setUrl(await QRCode.toDataURL(text.trim(), { width: size, margin: 2, errorCorrectionLevel: "M", color: { dark, light } }));
    } catch {
      setError("Could not generate this QR code.");
    }
  };

  const download = () => {
    if (!url) return;
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "creator-kit-qr.png";
    anchor.click();
  };

  return (
    <ToolPanel title="QR Code Generator" subtitle="Create a high-resolution QR code for links, contact details, Wi-Fi, or text.">
      <label className="field"><span>Link or text</span><textarea rows={4} value={text} onChange={(event) => setText(event.target.value)} placeholder="Paste a URL or type text" /></label>
      <div className="settings-grid three">
        <label className="field"><span>Size</span><select value={size} onChange={(event) => setSize(Number(event.target.value))}><option value={400}>400 px</option><option value={600}>600 px</option><option value={1000}>1000 px</option></select></label>
        <label className="field"><span>QR color</span><input type="color" value={dark} onChange={(event) => setDark(event.target.value)} /></label>
        <label className="field"><span>Background</span><input type="color" value={light} onChange={(event) => setLight(event.target.value)} /></label>
      </div>
      {error && <p className="error-text">{error}</p>}
      <button className="primary-button wide" onClick={generate}>Generate QR code</button>
      {url && <div className="qr-result">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={url} alt="Generated QR code" /><button className="primary-button" onClick={download}>Download PNG</button></div>}
    </ToolPanel>
  );
}

function ToolPanel({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return <div className="tool-panel"><div className="panel-heading"><p className="eyebrow">Free browser tool</p><h2>{title}</h2><p>{subtitle}</p></div>{children}</div>;
}

export default function ToolSuite() {
  const [active, setActive] = useState<ToolId>("compress");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("creatorkit-theme");
    const shouldUseDark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(shouldUseDark);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    window.localStorage.setItem("creatorkit-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const activeComponent = useMemo(() => {
    if (active === "compress") return <CompressTool />;
    if (active === "convert") return <ConvertTool />;
    if (active === "resize") return <ResizeTool />;
    if (active === "crop") return <CropTool />;
    if (active === "palette") return <PaletteTool />;
    return <QrTool />;
  }, [active]);

  const openTool = (id: ToolId) => {
    setActive(id);
    window.setTimeout(() => document.getElementById("workspace")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="CreatorKit home"><span>CK</span><strong>CreatorKit</strong></a>
        <nav><a href="#tools">Tools</a><a href="#privacy">Privacy</a></nav>
        <button className="theme-button" type="button" onClick={() => setDarkMode((value) => !value)} aria-label="Toggle dark mode">{darkMode ? "☀" : "☾"}</button>
      </header>

      <section className="hero" id="top">
        <div className="hero-badge">100% free · no sign-up · private</div>
        <h1>Everyday creator tools,<br /><span>without the clutter.</span></h1>
        <p>Compress, convert, resize, crop, generate palettes, and create QR codes. Everything runs directly in your browser.</p>
        <div className="hero-actions"><button className="primary-button" onClick={() => openTool("compress")}>Start with an image</button><a className="secondary-button" href="#tools">Browse all tools</a></div>
        <div className="trust-row"><span>✓ No account</span><span>✓ No uploads</span><span>✓ Works on mobile</span></div>
      </section>

      <section className="tools-section" id="tools">
        <div className="section-heading"><p className="eyebrow">Six useful tools</p><h2>Simple enough for anyone</h2><p>Choose a tool and finish the task in a few clicks.</p></div>
        <div className="tool-cards">{tools.map((tool) => <button type="button" className={`tool-card ${active === tool.id ? "active" : ""}`} key={tool.id} onClick={() => openTool(tool.id)}><span className="tool-icon">{tool.icon}</span><strong>{tool.title}</strong><p>{tool.description}</p><small>Open tool →</small></button>)}</div>
      </section>

      <section className="workspace" id="workspace">
        <div className="tool-tabs" role="tablist">{tools.map((tool) => <button type="button" key={tool.id} className={active === tool.id ? "active" : ""} onClick={() => setActive(tool.id)}>{tool.title.replace(" Image", "")}</button>)}</div>
        {activeComponent}
      </section>

      <section className="privacy-section" id="privacy">
        <div><p className="eyebrow">Privacy by design</p><h2>Your files stay on your device.</h2></div>
        <p>Image processing happens locally using your browser. CreatorKit does not upload or store your images. Closing or refreshing the page clears the working files.</p>
      </section>

      <section className="ad-placeholder" aria-label="Advertisement placeholder"><span>Advertisement space</span><small>Add Google AdSense here after your site is approved.</small></section>

      <footer><a className="brand" href="#top"><span>CK</span><strong>CreatorKit</strong></a><p>Free, lightweight browser tools for everyone.</p><small>© {new Date().getFullYear()} CreatorKit</small></footer>
    </main>
  );
}
