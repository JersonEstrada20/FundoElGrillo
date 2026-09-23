import React, { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function CabinGallery({ cabin, onClose }) {
  const [idx, setIdx] = useState(0);
  const images = cabin?.images || [];

  const next = useCallback(() => setIdx((i) => (i + 1) % images.length), [images.length]);
  const prev = useCallback(() => setIdx((i) => (i - 1 + images.length) % images.length), [images.length]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, next, prev]);

  if (!cabin) return null;

  return (
    <div className="fixed inset-0 z-50 bg-foreground/95 flex flex-col" onClick={onClose}>
      {/* Header */}
      <div className="flex justify-between items-center p-5 text-background" onClick={(e) => e.stopPropagation()}>
        <div>
          <h2 className="font-display text-3xl">{cabin.name}</h2>
          <p className="text-xs tracking-architectural uppercase text-background/50 mt-1">
            Foto {idx + 1} de {images.length}
          </p>
          {cabin.description && <p className="text-sm text-background/75 mt-2 max-w-xl">{cabin.description}</p>}
          {cabin.capacity && <p className="text-xs tracking-architectural uppercase text-accent mt-2">{cabin.capacity}</p>}
        </div>
        <button onClick={onClose} className="p-2 hover:text-accent transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main image */}
      <div className="flex-1 flex items-center justify-center px-4 md:px-16 relative" onClick={(e) => e.stopPropagation()}>
        {images.length > 1 && (
          <button onClick={prev} className="absolute left-2 md:left-8 p-2 text-background/60 hover:text-background transition-colors">
            <ChevronLeft className="w-8 h-8" />
          </button>
        )}
        <img
          src={images[idx]}
          alt={`${cabin.name} ${idx + 1}`}
          className="max-h-full max-w-full object-contain"
        />
        {images.length > 1 && (
          <button onClick={next} className="absolute right-2 md:right-8 p-2 text-background/60 hover:text-background transition-colors">
            <ChevronRight className="w-8 h-8" />
          </button>
        )}
      </div>

      {/* Thumbnails */}
      <div className="p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex gap-2 justify-center overflow-x-auto pb-2">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`flex-shrink-0 w-20 h-16 overflow-hidden border-2 transition-colors ${
                i === idx ? "border-accent" : "border-transparent hover:border-background/30"
              }`}
            >
              <img src={src} alt={`Miniatura ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
