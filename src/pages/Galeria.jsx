import React, { useState, useEffect } from "react";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const UP = "https://pub-bf044be5e1644eeea160056cc2074860.r2.dev";

const categories = ["Todo", "Animales", "Jardines", "Vistas", "Vistas Aéreas"];

// Las 104 fotografías originales viven ahora en R2, no en el sitio antiguo.
const legacyFiles = ["DSC_0381.jpg", "granja_4.jpg", "DSC_0286.jpg", "granja_10.jpg", "DSC_0552.jpg", "g4.jpg", "YUNC0014.jpg", "g9.jpg", "jardin23.jpg", "jardin24.jpg", "granja_1.jpg", "DSC_0639.jpg", "jardin15.jpg", "jardin8.jpg", "animales1.jpg", "DSC_0559.jpg", "granja_3.jpg", "DSC_0573.jpg", "YUNC0004.jpg", "jardin3.jpg", "animales5.jpg", "DSC_0391.jpg", "animales9.jpg", "DSC_0379.jpg", "YUNC0016.jpg", "granja_5.jpg", "g8.jpg", "DSC_0607.jpg", "DSC_0218.jpg", "jardin7.jpg", "jardin9.jpg", "jardin22.jpg", "DSC_0292.jpg", "general6.jpg", "YUNC0009.jpg", "jardin6.jpg", "jardin1.jpg", "DSC_0129.jpg", "jardin5.jpg", "general8.jpg", "jardin25.jpg", "YUNC0012.jpg", "jardin21.jpg", "YUNC0032.jpg", "DSC_0461.jpg", "animales6.jpg", "DSC_0437.jpg", "jardin10.jpg", "YUNC0027.jpg", "DSC_0584.jpg", "granja_9.jpg", "animales4.jpg", "g3.jpg", "DSC_0368.jpg", "jardin11.jpg", "DSC_0385.jpg", "DSC_0296.jpg", "jardin17.jpg", "g6.jpg", "DSC_0215.jpg", "DSC_0708.jpg", "DSC_0602.jpg", "DSC_0464.jpg", "DSC_0680.jpg", "DSC_0627.jpg", "DSC_0553.jpg", "jardin14.jpg", "DSC_0300.jpg", "jardin20.jpg", "jardin4.jpg", "granja_2.jpg", "YUNC0019.jpg", "YUNC0034.jpg", "DSC_0612.jpg", "YUNC0007.jpg", "DSC_0718.jpg", "jardin18.jpg", "jardin16.jpg", "YUNC0029.jpg", "DSC_0730.jpg", "DSC_0599.jpg", "animales7.jpg", "DSC_0411.jpg", "DSC_0445.jpg", "granja_6.jpg", "grillo-66.jpg", "YUNC0023.jpg", "general4.jpg", "grillo-57.jpg", "DSC_0290.jpg", "DSC_0671.jpg", "YUNC0005.jpg", "DSC_0700.jpg", "YUNC0013.jpg", "grillo-95.jpg", "YUNC0030.jpg", "granja_7.jpg", "granja_8.jpg", "jardin2.jpg", "DSC_0307.jpg", "DSC_0591.jpg", "jardin19.jpg", "DSC_0630.jpg", "YUNC0010.jpg"];

const items = legacyFiles.map((filename) => {
  const name = filename.toLowerCase();
  const cat = name.startsWith("yunc") ? "Vistas Aéreas"
    : name.includes("animal") || name.includes("granja") ? "Animales"
      : name.includes("jardin") || name.startsWith("g") || name.includes("general") || name.includes("grillo") ? "Jardines"
        : "Vistas";
  return { src: `${UP}/legacy-gallery/${filename}`, cat };
});

export default function Galeria() {
  const [cat, setCat] = useState("Todo");
  const [lightbox, setLightbox] = useState(null);

  const filtered = cat === "Todo" ? items : items.filter((i) => i.cat === cat);

  const closeLightbox = () => setLightbox(null);
  const prev = () => setLightbox((idx) => (idx - 1 + filtered.length) % filtered.length);
  const next = () => setLightbox((idx) => (idx + 1) % filtered.length);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, filtered]);

  return (
    <div className="bg-background">
      <Navbar />

      <section className="relative h-[52vh] min-h-[420px] flex items-end overflow-hidden">
        <img src={`${UP}/7800eb222_DSC_0573.jpg`} alt="Galería" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-grad" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pb-16 w-full">
          <span className="text-xs tracking-architectural uppercase text-hero/70 mb-4 block">Recorre el fundo</span>
          <h1 className="font-display text-hero text-5xl md:text-7xl leading-[1.05]">Galería</h1>
        </div>
      </section>

      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 lg:px-10">
        <p className="text-foreground/70 text-lg leading-relaxed max-w-2xl mb-10">
          Te invitamos a tomarte un tiempo para relajarte y conectarte con la
          naturaleza. Recorre nuestras extensas áreas verdes y enamórate de los
          bellos paisajes que encontrarás aquí.
        </p>

        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => { setCat(c); setLightbox(null); }}
              className={`px-5 py-2 text-sm tracking-architectural uppercase border transition-colors ${
                cat === c
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-foreground/70 hover:border-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item, i) => (
            <button
              key={`${item.cat}-${i}`}
              onClick={() => setLightbox(i)}
              className="group relative overflow-hidden aspect-square"
            >
              <img src={item.src} alt={item.cat} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-hero-bg/0 group-hover:bg-hero-bg/20 transition-colors duration-300" />
            </button>
          ))}
        </div>
      </section>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] bg-hero-bg/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button className="absolute top-6 right-6 text-hero/80 hover:text-hero transition-colors" onClick={closeLightbox}>
            <X className="w-8 h-8" />
          </button>
          <button
            className="absolute left-4 md:left-8 text-hero/80 hover:text-hero transition-colors"
            onClick={(e) => { e.stopPropagation(); prev(); }}
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          <img
            src={filtered[lightbox].src}
            alt={filtered[lightbox].cat}
            className="max-w-[90vw] max-h-[85vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-4 md:right-8 text-hero/80 hover:text-hero transition-colors"
            onClick={(e) => { e.stopPropagation(); next(); }}
          >
            <ChevronRight className="w-10 h-10" />
          </button>
          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-hero/60 text-sm tracking-architectural uppercase">
            {lightbox + 1} / {filtered.length}
          </span>
        </div>
      )}

      <Footer />
    </div>
  );
}
