import React, { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCLP } from "@/lib/cabins";

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

  const isCabin = cabin.type === "cabaña";

  return (
    <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm p-3 md:p-8 flex items-center justify-center" onClick={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-label={`Detalles de ${cabin.name}`}
        className="w-full max-w-7xl max-h-[94vh] overflow-hidden bg-hero-bg text-hero border border-hero/15 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="shrink-0 px-5 py-4 md:px-8 md:py-5 border-b border-hero/15 flex gap-4 items-start justify-between">
          <div className="min-w-0">
            <p className="text-[11px] tracking-architectural uppercase text-accent mb-1">
              {isCabin ? "Cabaña" : "Salón de eventos"} · Foto {idx + 1} de {images.length}
            </p>
            <h2 className="font-display text-3xl md:text-4xl leading-none">{cabin.name}</h2>
            {cabin.description && <p className="text-sm md:text-base text-hero/70 mt-2 max-w-2xl line-clamp-2">{cabin.description}</p>}
          </div>
          <button onClick={onClose} className="shrink-0 p-2 border border-hero/20 text-hero/75 hover:text-hero hover:border-accent transition-colors" aria-label="Cerrar detalles">
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="px-5 py-3 md:px-8 border-b border-hero/15 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          {cabin.capacity && <span><span className="text-hero/45">Capacidad:</span> {cabin.capacity}</span>}
          {isCabin && cabin.rooms && <span><span className="text-hero/45">Habitaciones:</span> {cabin.rooms}</span>}
          {isCabin && cabin.pool && <span><span className="text-hero/45">Piscina:</span> {cabin.pool}</span>}
          {isCabin && cabin.high_season_price && <span className="text-accent">Desde {formatCLP(cabin.high_season_price)} / noche</span>}
          <Link to="/reservas" state={{ cabin: cabin.name }} onClick={onClose} className="ml-auto px-4 py-2 bg-accent text-accent-foreground text-xs tracking-architectural uppercase hover:bg-accent/90 transition-colors">
            {isCabin ? "Reservar" : "Solicitar cotización"}
          </Link>
        </div>

        <div className="relative flex-1 min-h-0 bg-black/35 flex items-center justify-center p-3 md:p-5">
          {images.length > 1 && (
            <button onClick={prev} className="absolute left-4 md:left-7 z-10 p-3 rounded-full bg-black/50 text-hero hover:bg-accent transition-colors" aria-label="Foto anterior">
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          <img src={images[idx]} alt={`${cabin.name} ${idx + 1}`} className="w-full h-full max-h-[52vh] object-contain" />
          {images.length > 1 && (
            <button onClick={next} className="absolute right-4 md:right-7 z-10 p-3 rounded-full bg-black/50 text-hero hover:bg-accent transition-colors" aria-label="Foto siguiente">
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        <footer className="shrink-0 p-3 md:px-6 md:py-4 border-t border-hero/15 bg-black/20">
          <div className="flex gap-2 overflow-x-auto">
            {images.map((src, i) => (
              <button key={src} onClick={() => setIdx(i)} aria-label={`Ver foto ${i + 1}`} className={`flex-shrink-0 w-16 h-12 md:w-20 md:h-14 overflow-hidden border-2 transition-colors ${i === idx ? "border-accent opacity-100" : "border-transparent opacity-60 hover:opacity-100 hover:border-hero/40"}`}>
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </footer>
      </section>
    </div>
  );
}
