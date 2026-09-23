import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import SectionHeading from "@/components/site/SectionHeading";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { withCatalogImagesList } from "@/lib/cabinMedia";
import { Image } from "@/components/ui/image";
import CabinGallery from "@/components/CabinGallery";

const eventTypes = [
  "Matrimonios", "Convenciones", "Encuentros religiosos", "Capacitaciones",
  "Paseos de colegio", "Agrupaciones", "Campamentos de verano", "Retiros",
];

const legacyDetails = {
  "Salón Darwin": "Ideal para ceremonias religiosas y eventos especiales. Cuenta con 240 m² y dependencias complementarias; podemos coordinar banquetería, sonido, iluminación, animación, música y montaje.",
  "Salón Orgánico": "Espacio con áreas verdes, piscina y terraza para ceremonias. Ideal para paseos de colegio, agrupaciones, capacitaciones, matrimonios, campamentos de verano y retiros.",
  "Quincho Club House": "Un espacio privado con áreas verdes, asaderas, juegos infantiles, piscina y quincho con vista. Es una alternativa especialmente pensada para grupos que quieran compartir y pernoctar juntos.",
};

export default function Eventos() {
  const [galleryHall, setGalleryHall] = useState(null);
  const { data: halls = [], isLoading: loading } = useQuery({
    queryKey: ["public-event-halls"],
    queryFn: async () => {
      const all = await base44.entities.Cabin.list("order", 200);
      return withCatalogImagesList(all).filter((c) => c.type === "salón" && c.is_active !== false);
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="bg-background">
      <Navbar />

      <section className="relative h-[52vh] min-h-[420px] flex items-end overflow-hidden">
        <img src="https://pub-bf044be5e1644eeea160056cc2074860.r2.dev/10b57c29c_YUNC0020b.jpg" alt="Eventos" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-grad" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pb-16 w-full">
          <span className="text-xs tracking-architectural uppercase text-hero/70 mb-4 block">Celebraciones</span>
          <h1 className="font-display text-hero text-5xl md:text-7xl leading-[1.05]">Salones de Eventos</h1>
        </div>
      </section>

      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading eyebrow="Espacios para celebrar" title="Bellos salones completamente equipados">
          Fundo El Grillo ofrece distintos salones ideales para todo tipo de
          eventos, rodeados de naturaleza y con la tranquilidad de estar lejos
          de la ciudad.
        </SectionHeading>

        {loading ? (
          <p className="text-foreground/50">Cargando salones…</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {halls.map((h) => (
              <article key={h.id} className="group">
                <button type="button" onClick={() => setGalleryHall(h)} className="aspect-[16/10] w-full overflow-hidden bg-muted block text-left">
                  {h.images?.[0] && (
                    <Image src={h.images[0]} alt={h.name} fittingType="fill" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  )}
                </button>
                <h3 className="font-display text-3xl mt-5">{h.name}</h3>
                <p className="mt-2 text-foreground/70 leading-relaxed">{legacyDetails[h.name] || h.description}</p>
                {h.capacity && (
                  <p className="mt-3 text-sm tracking-architectural uppercase text-accent">{h.capacity}</p>
                )}
                <button type="button" onClick={() => setGalleryHall(h)} className="mt-5 mr-5 inline-block text-sm tracking-architectural uppercase text-foreground/70 hover:text-accent transition-colors">
                  Ver fotos y detalles →
                </button>
                <Link
                  to="/reservas"
                  state={{ cabin: h.name }}
                  className="mt-5 inline-block text-sm tracking-architectural uppercase text-accent hover:text-foreground transition-colors"
                >
                  Solicitar cotización →
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="py-20 md:py-28 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <SectionHeading eyebrow="Para toda ocasión" title="Tipos de eventos que realizamos" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
            {eventTypes.map((e, i) => (
              <div key={e} className="bg-card p-8">
                <span className="font-display text-3xl text-accent/30">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-2 text-foreground/80">{e}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 lg:px-10 text-center">
        <h2 className="font-display text-4xl md:text-5xl mb-5">Cuéntanos tu evento</h2>
        <p className="text-foreground/70 max-w-xl mx-auto mb-8">
          Coordinamos cada detalle para que tu celebración sea inolvidable.
          Envíanos tu solicitud y te contactaremos.
        </p>
        <Link to="/reservas" className="inline-block px-10 py-4 bg-accent text-accent-foreground tracking-architectural uppercase text-sm hover:bg-accent/90 transition-colors">
          Solicitar cotización
        </Link>
      </section>

      {galleryHall && <CabinGallery cabin={galleryHall} onClose={() => setGalleryHall(null)} />}

      <Footer />
    </div>
  );
}
