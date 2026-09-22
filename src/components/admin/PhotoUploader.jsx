import React, { useRef, useState } from "react";
import { Upload, Trash2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function PhotoUploader({ images, onChange }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files) => {
    setUploading(true);
    try {
      const urls = [];
      for (const file of files) {
        const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
        urls.push(file_url);
      }
      onChange([...(images || []), ...urls]);
    } catch (e) {
      alert("Error al subir foto: " + (e?.message || ""));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const remove = (i) => {
    onChange((images || []).filter((_, idx) => idx !== i));
  };

  const move = (i, dir) => {
    const newIdx = i + dir;
    if (newIdx < 0 || newIdx >= (images || []).length) return;
    const copy = [...(images || [])];
    [copy[i], copy[newIdx]] = [copy[newIdx], copy[i]];
    onChange(copy);
  };

  return (
    <div>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
        {(images || []).map((url, i) => (
          <div key={i} className="relative group aspect-[4/3] border border-border overflow-hidden">
            <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
            {i === 0 && (
              <span className="absolute top-1 left-1 bg-accent text-accent-foreground text-xs px-1.5 py-0.5">
                Portada
              </span>
            )}
            <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
              <button type="button" onClick={() => move(i, -1)} className="p-1.5 text-background hover:text-accent disabled:opacity-30" disabled={i === 0}>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => remove(i)} className="p-1.5 text-background hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => move(i, 1)} className="p-1.5 text-background hover:text-accent disabled:opacity-30" disabled={i === (images || []).length - 1}>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="aspect-[4/3] border-2 border-dashed border-border hover:border-accent flex items-center justify-center transition-colors"
        >
          {uploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-foreground/40" />
          ) : (
            <div className="text-center">
              <Upload className="w-6 h-6 mx-auto text-foreground/40" />
              <span className="text-xs text-foreground/50 mt-1 block">Subir foto</span>
            </div>
          )}
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files.length && handleFiles(Array.from(e.target.files))}
      />
      <p className="text-xs text-foreground/40 mt-2">La primera foto es la portada. Sube desde tu dispositivo.</p>
    </div>
  );
}