"use client";

import { useRef, useState } from "react";
import { UploadCloud, Loader2 } from "lucide-react";

export default function GalleryField({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string[];
}) {
  const [value, setValue] = useState((defaultValue || []).join("\n"));
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList) {
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const body = new FormData();
        body.set("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body });
        const data = (await res.json()) as { url?: string; error?: string };
        if (res.ok && data.url) urls.push(data.url);
      }
      setValue((prev) => [prev, ...urls].filter(Boolean).join("\n"));
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-ink-800">
          Gallery photos (one image URL per line)
        </label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-medium text-ink-700 hover:bg-ink-50 disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <UploadCloud className="h-3.5 w-3.5" />
          )}
          Upload photos
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFiles(e.target.files);
            }
            e.target.value = "";
          }}
        />
      </div>
      <textarea
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={5}
        placeholder="https://example.com/photo1.jpg&#10;https://example.com/photo2.jpg"
        className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 font-mono text-xs focus:border-clay-500 focus:outline-none"
      />
    </div>
  );
}
