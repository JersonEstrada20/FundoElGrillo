import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import SectionHeading, { CTAButton } from "@/components/site/SectionHeading";
import { formatCLP } from "@/lib/cabins";
import { withCatalogImagesList } from "@/lib/cabinMedia";
import { Link } from "react-router-dom";
import CabinGallery from "@/components/CabinGallery";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";

const sectors = ["Todas", "Area De Acceso", "Espacio Central", "Sector Bosque Nativo"];
const HERO_IMAGE = "https://pub-bf044be5e1644eeea160056cc2074860.r2.dev/44765e55a_monasterio-1.jpg";

export default function Cabanas() {
  const [sector, setSector] = useState("Todas");
  const [galleryCabin, setGalleryCabin] = useState(null);
  const { data: cabins = [], isLoading: loading } = useQuery({
    queryKey: ["public-cabins"],
    queryFn: async () => {
      const all = await base44.entities.Cabin.list("order", 200);
      return withCatalogImagesList(all).filter((c) => c.type === "cabaña" && c.is_active !== false);
    },
    staleTime: 5 * 60 * 1000,
  });

  const list = sector === "Todas" ? cabins : cabins.filter((c) => c.sector === sector);

  return (
    <div className="bg-background">
      <Navbar />

      <section className="relative h-[52vh] min-h-[420px] flex items-end overflow-hidden">
        <Image src={cabins.find((c) => c.name === "Monasterio")?.images?.[0] || HERO_IMAGE} alt="Cabañas" fittingType="fill" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-grad" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pb-16 w-full">
          <span className="text-xs tracking-architectural uppercase text-hero/70 mb-4 block">Hospedaje</span>
          <h1 className="font-display text-hero text-5xl md:text-7xl leading-[1.05]">Cabañas</h1>
        </div>
      </section>

      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading eyebrow="Nuestras cabañas" title="Elegantes cabañas inmersas en la naturaleza">
          Cada cabaña cuenta con agua de vertiente, calefacción, cocina
          completamente equipada, baño privado y estacionamiento. Revisa los
          detalles y valores, y solicita tu reserva directamente.
        </SectionHeading>

        <div className="flex flex-wrap gap-2 mb-10">
          {sectors.map((s) => (
            <button
              key={s}
              onClick={() => setSector(s)}
              className={`px-5 py-2 text-sm tracking-architectural uppercase border transition-colors ${
                sector === s
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-foreground/70 hover:border-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-foreground/50">Cargando cabañas…</p>
        ) : list.length === 0 ? (
          <p className="text-foreground/50 border border-border p-6">No hay cabañas en este sector.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {list.map((c) => (
              <article key={c.id} className="group">
                <div className="aspect-[4/3] overflow-hidden bg-muted relative cursor-pointer" onClick={() => setGalleryCabin(c)}>
                  <Image src={c.images?.[0]} alt={c.name} fittingType="fill" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  {c.images?.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-foreground/80 text-background text-xs px-3 py-1 tracking-architectural uppercase">
                      {c.images.length} fotos
                    </div>
                  )}
                </div>
                <div className="pt-5">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-display text-3xl">{c.name}</h3>
                    <span className="text-xs tracking-architectural uppercase text-foreground/40">{c.sector}</span>
                  </div>
                  <ul className="mt-4 space-y-1.5 text-sm text-foreground/70">
                    <li>01 · Capacidad: {c.capacity}</li>
                    <li>02 · {c.rooms}</li>
                    <li>03 · {c.pool}</li>
                  </ul>
                  <div className="mt-5 pt-5 border-t border-border flex justify-between items-center">
                    <div>
                      <p className="text-xs tracking-architectural uppercase text-foreground/50">Temporada alta</p>
                      <p className="font-display text-2xl">{c.high_season_price ? formatCLP(c.high_season_price) : "—"}</p>
                      <p className="text-xs text-foreground/50 mt-1">Baja: {c.low_season_price ? formatCLP(c.low_season_price) : "—"}</p>
                    </div>
                    <Link
                      to="/reservas"
                      state={{ cabin: c.name }}
                      className="text-sm tracking-architectural uppercase text-accent hover:text-foreground transition-colors"
                    >
                      Solicitar →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="py-20 md:py-28 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-display text-3xl md:text-4xl mb-4">Información de reservas</h2>
            <ul className="space-y-3 text-foreground/70">
              <li>· Los valores son por noche y por cabaña, según capacidad indicada.</li>
              <li>· Temporada alta: octubre a marzo y feriados.</li>
              <li>· Temporada baja: abril a septiembre.</li>
              <li>· Todas las cabañas incluyen cocina equipada, TV satelital y calefacción.</li>
              <li>· Se solicita seña para confirmar la reserva.</li>
            </ul>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-foreground/70 mb-6">¿Lista tu escapada? Envíanos tu solicitud y te contactamos para confirmar disponibilidad.</p>
            <CTAButton to="/reservas">Solicitar reserva</CTAButton>
          </div>
        </div>
      </section>

      {galleryCabin && <CabinGallery cabin={galleryCabin} onClose={() => setGalleryCabin(null)} />}
      <Footer />
    </div>
  );
}
