import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import SectionHeading, { CTAButton } from "@/components/site/SectionHeading";
import { gallery, formatCLP } from "@/lib/cabins";
import { withCatalogImagesList } from "@/lib/cabinMedia";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { ArrowDown, MapPin } from "lucide-react";

const services = [
  { n: "01", title: "Cabañas equipadas", desc: "TV satelital, calefacción, cocina equipada, baño privado, estacionamiento, piscina, parrillas y horno de barro." },
  { n: "02", title: "Rutas de trekking", desc: "Senderos desde Quebrada del Ají hasta el cerro Alto del Francés y Chile Cauquén, con vista de la costa de Valparaíso a Zapallar." },
  { n: "03", title: "Productos orgánicos", desc: "Cultivos orgánicos durante todo el año: piñas, naranjas, miel y aceite de oliva del fundo." },
  { n: "04", title: "Granja educativa", desc: "Gallinas, patos, caballos, cabras, ovejas y avestruces para que los más chicos aprendan en contacto con la naturaleza." },
  { n: "05", title: "Salones de eventos", desc: "Matrimonios, convenciones, encuentros religiosos, capacitaciones, paseos de colegio, campamentos y retiros." },
  { n: "06", title: "Áreas comunes", desc: "Multicancha, juegos infantiles, mesas de ping pong, juegos típicos y extensas áreas verdes de vegetación nativa." },
];

const testimonials = [
  { name: "María Loreto B.", text: "El mejor lugar para relajarse. Entorno hermoso que permite disfrutar de la naturaleza, las cabañas impecables, recomendables 100%.", role: "Tripadvisor" },
  { name: "María V.", text: "Lugar para matrimonios. Realmente un matrimonio soñado, el lugar perfecto, las cabañas para los invitados y la atención increíbles.", role: "Tripadvisor" },
  { name: "Paola A.", text: "Son hermosas, lo pasamos genial años atrás con mis mejores amigos y espero pronto volver con mi familia.", role: "Facebook" },
];

export default function Home() {
  const [cabins, setCabins] = useState([]);
  useEffect(() => {
    base44.entities.Cabin.list("order", 100).then((all) => {
      setCabins(withCatalogImagesList(all).filter((c) => c.type === "cabaña" && c.is_active !== false).slice(0, 6));
    }).catch(() => {});
  }, []);
  return (
    <div className="bg-background">
      <Navbar />

      {/* HERO */}
      <section className="relative h-screen min-h-[640px] flex items-end overflow-hidden">
        <video
          src="https://media.base44.com/videos/public/6ab198431b520d2f22e78e1a/b5f5e4810_TeaserFundoElGrillo.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-grad" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pb-24 w-full">
          <span className="text-xs tracking-architectural uppercase text-hero/70 mb-5 block">
            Quebrada del Ají · Quillota
          </span>
          <h1 className="font-display text-hero text-5xl md:text-7xl lg:text-8xl leading-[1.02] max-w-3xl text-balance">
            Aquí y en la Quebrada del Ají
          </h1>
          <p className="mt-6 text-hero/80 text-lg max-w-xl leading-relaxed">
            Cabañas inmersas en la naturaleza, salones de eventos y 500
            hectáreas de bosque nativo. Un lugar histórico que Charles Darwin
            describió como maravilloso.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link to="/reservas" className="px-8 py-4 bg-accent text-accent-foreground tracking-architectural uppercase text-sm hover:bg-accent/90 transition-colors">
              Solicitar reserva
            </Link>
            <Link to="/cabanas" className="px-8 py-4 border border-hero/40 text-hero tracking-architectural uppercase text-sm hover:bg-hero hover:text-hero-bg transition-colors">
              Ver cabañas
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 right-6 lg:right-10 z-10 hidden md:flex items-center gap-2 text-hero/60 text-xs tracking-architectural uppercase">
          <span>Descubre</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </div>
      </section>

      {/* INTRO */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <span className="text-xs tracking-architectural uppercase text-accent">Bienvenido a</span>
            <img
              src="https://pub-bf044be5e1644eeea160056cc2074860.r2.dev/8982de563_mariana2.jpg"
              alt="Mariana Silva"
              className="w-48 h-48 object-cover rounded-full border-2 border-accent/30 mt-6"
            />
            <div className="mt-5">
              <p className="font-display text-2xl">Mariana Silva</p>
              <img
                src="https://pub-bf044be5e1644eeea160056cc2074860.r2.dev/4a50e1996_signature.png"
                alt="Firma Mariana Silva"
                className="h-12 mt-1"
              />
              <p className="text-sm text-foreground/60 tracking-architectural uppercase mt-1">Dueña, Fundo El Grillo</p>
            </div>
          </div>
          <div className="md:col-span-8">
            <h2 className="font-display text-4xl md:text-6xl leading-[1.08] text-balance">
              Cabañas Fundo El Grillo
            </h2>
            <div className="mt-8 space-y-6 text-foreground/75 text-lg leading-relaxed max-w-2xl">
              <p>
                Este fue el único camino a la costa durante la colonia, lo que
                nos ha llevado a preservar este lugar histórico para dar valor
                al dicho: <em>"Aquí y en la Quebrada del Ají"</em>. Originalmente
                habitado por los incas, quienes cultivaron ají para ser enviado
                al Perú.
              </p>
              <p>
                Charles Darwin lo menciona como un lugar maravilloso por su
                flora, fauna y microclima. Les invito a visitarlo y a
                preservarlo, tal como lo hemos hecho nosotros.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="py-16 md:py-24 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <SectionHeading eyebrow="Qué encontrarás" title="En Fundo El Grillo puedes encontrar">
            <CTAButton to="/el-fundo">Conoce el fundo</CTAButton>
          </SectionHeading>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {services.map((s) => (
              <div key={s.n} className="bg-card p-10">
                <span className="font-display text-5xl text-accent/30">{s.n}</span>
                <h3 className="font-display text-2xl mt-4 mb-3">{s.title}</h3>
                <p className="text-foreground/70 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CABAÑAS DESTACADAS */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading eyebrow="Hospedaje" title="Cabañas inmersas en la naturaleza">
          <CTAButton to="/cabanas">Ver todas las cabañas</CTAButton>
        </SectionHeading>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cabins.map((c) => (
            <Link to="/cabanas" key={c.id} className="group">
              <div className="aspect-[4/5] overflow-hidden bg-muted">
                <Image src={c.images?.[0]} alt={c.name} fittingType="fill" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="mt-4 flex justify-between items-start">
                <div>
                  <h3 className="font-display text-2xl">{c.name}</h3>
                  <p className="text-sm text-foreground/60">{c.capacity} · {c.rooms}</p>
                </div>
                <span className="text-sm text-accent">{c.high_season_price ? formatCLP(c.high_season_price) : "—"}<span className="text-foreground/40"> /noche</span></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* GALERÍA */}
      <section className="py-16 md:py-24 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <SectionHeading eyebrow="Galería" title="Un recorrido por el fundo" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map((g) => (
              <div key={g.title} className="group relative overflow-hidden aspect-[4/3]">
                <img src={g.image} alt={g.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-hero-bg/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-hero font-display text-xl">{g.title}</p>
                  <p className="text-hero/70 text-sm">{g.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading eyebrow="Opiniones" title="Quienes nos han visitado" />
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="border-l-2 border-accent pl-6">
              <p className="font-display text-2xl leading-relaxed text-foreground/85 italic">"{t.text}"</p>
              <div className="mt-5">
                <p className="font-medium">{t.name}</p>
                <p className="text-xs tracking-architectural uppercase text-foreground/50">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <img src="https://pub-bf044be5e1644eeea160056cc2074860.r2.dev/6a37a0352_DSC_0985.jpg" alt="Eventos" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-hero-bg/70" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-hero text-4xl md:text-6xl leading-[1.08] text-balance">
            ¿Qué esperas para visitar Fundo El Grillo?
          </h2>
          <p className="mt-6 text-hero/70 text-lg">Haz tu reserva ahora mismo.</p>
          <Link to="/reservas" className="mt-8 inline-block px-10 py-4 bg-accent text-accent-foreground tracking-architectural uppercase text-sm hover:bg-accent/90 transition-colors">
            Reservar ahora
          </Link>
        </div>
      </section>

      {/* UBICACIÓN */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading eyebrow="Cómo llegar" title="Ubicación">
          A 15 minutos de Quillota, en la Quebrada del Ají. Un lugar histórico
          rodeado de bosque nativo y microclima único.
        </SectionHeading>
        <div className="aspect-[16/8] w-full overflow-hidden border border-border">
          <iframe
            title="Ubicación Fundo El Grillo"
            src="https://www.google.com/maps?q=Cam.+Fund%C3%B3+El+Grillo,+Quillota,+Valpara%C3%ADso&output=embed"
            className="w-full h-full"
            loading="lazy"
          />
        </div>
        <div className="mt-6 flex items-center gap-2 text-foreground/70">
          <MapPin className="w-4 h-4 text-accent" />
          <span>Cam. Fundó El Grillo, Quillota, Región de Valparaíso</span>
        </div>
      </section>

      <Footer />
    </div>
  );
}
