import React, { useState, useEffect } from "react";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const UP = "https://pub-b9d30b344c8144668e2115f92a734075.r2.dev";

const categories = ["Todo", "Animales", "Jardines", "Vistas", "Vistas Aéreas"];

const items = [
  { src: `${UP}/a642c8897_granja_7.jpg`, cat: "Animales" },
  { src: `${UP}/8226adcf4_granja_8.jpg`, cat: "Animales" },
  { src: `${UP}/07b1e1d0d_granja_10.jpg`, cat: "Animales" },
  { src: `${UP}/9ec93ffac_granja_3.jpg`, cat: "Animales" },
  { src: `${UP}/cce7bd6d8_granja_6.jpg`, cat: "Animales" },
  { src: `${UP}/8d5e07e1a_animales9.jpg`, cat: "Animales" },
  { src: `${UP}/5fb6fbbc4_animales1.jpg`, cat: "Animales" },
  { src: `${UP}/2ea31ef5d_jardin8.jpg`, cat: "Jardines" },
  { src: `${UP}/981264b10_jardin2.jpg`, cat: "Jardines" },
  { src: `${UP}/33d5023da_jardin9.jpg`, cat: "Jardines" },
  { src: `${UP}/a9c7f127b_jardin15.jpg`, cat: "Jardines" },
  { src: `${UP}/9c5c14598_jardin20.jpg`, cat: "Jardines" },
  { src: `${UP}/c5f7ccfb3_jardin16.jpg`, cat: "Jardines" },
  { src: `${UP}/afb24a4f0_jardin23.jpg`, cat: "Jardines" },
  { src: `${UP}/f27053945_jardin11.jpg`, cat: "Jardines" },
  { src: `${UP}/be616b14c_jardin18.jpg`, cat: "Jardines" },
  { src: `${UP}/8c9b1e82a_jardin17.jpg`, cat: "Jardines" },
  { src: `${UP}/10ff0471f_jardin24.jpg`, cat: "Jardines" },
  { src: `${UP}/250f6bc8c_jardin25.jpg`, cat: "Jardines" },
  { src: `${UP}/797000476_DSC_0215.jpg`, cat: "Vistas" },
  { src: `${UP}/7800eb222_DSC_0573.jpg`, cat: "Vistas" },
  { src: `${UP}/a88682ad2_DSC_0708.jpg`, cat: "Vistas" },
  { src: `${UP}/4ae89ed54_DSC_0639.jpg`, cat: "Vistas" },
  { src: `${UP}/09fc7dd23_DSC_0607.jpg`, cat: "Vistas" },
  { src: `${UP}/104b70bf7_DSC_0718.jpg`, cat: "Vistas" },
  { src: `${UP}/5868285f6_DSC_0381.jpg`, cat: "Vistas" },
  { src: `${UP}/a1fb25d2b_DSC_0730.jpg`, cat: "Vistas" },
  { src: `${UP}/ebe168671_DSC_0671.jpg`, cat: "Vistas" },
  { src: `${UP}/97bf19083_DSC_0584.jpg`, cat: "Vistas" },
  { src: `${UP}/5df60fdfa_DSC_0591.jpg`, cat: "Vistas" },
  { src: `${UP}/65141c0f1_DSC_0612.jpg`, cat: "Vistas" },
  { src: `${UP}/cfb98f988_DSC_0599.jpg`, cat: "Vistas" },
  { src: `${UP}/e57baae71_DSC_0218.jpg`, cat: "Vistas" },
  { src: `${UP}/d8aa69fd1_DSC_0464.jpg`, cat: "Vistas" },
  { src: `${UP}/fe897790f_DSC_0307.jpg`, cat: "Vistas" },
  { src: `${UP}/b7a1666b7_DSC_0627.jpg`, cat: "Vistas" },
  { src: `${UP}/0c4e8bf3f_grillo-95.jpg`, cat: "Vistas" },
  { src: `${UP}/6cb6b4811_grillo-57.jpg`, cat: "Vistas" },
  { src: `${UP}/92df81177_g4.jpg`, cat: "Vistas" },
  { src: `${UP}/c7408f458_g8.jpg`, cat: "Vistas" },
  { src: `${UP}/92fcf52e8_general4.jpg`, cat: "Vistas" },
  { src: `${UP}/4adb734d5_YUNC0005.jpg`, cat: "Vistas Aéreas" },
  { src: `${UP}/9f6fade58_YUNC0019.jpg`, cat: "Vistas Aéreas" },
  { src: `${UP}/9770be25f_YUNC0010.jpg`, cat: "Vistas Aéreas" },
  { src: `${UP}/96b57a135_YUNC0013.jpg`, cat: "Vistas Aéreas" },
];

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