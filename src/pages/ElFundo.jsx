import React from "react";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import SectionHeading from "@/components/site/SectionHeading";

const features = [
  { n: "01", title: "500 hectáreas", desc: "De bosque nativo y todos los servicios que necesitarás para una estadía completa." },
  { n: "02", title: "Camino histórico", desc: "Único camino a la costa durante la colonia, habitado originalmente por los incas." },
  { n: "03", title: "Flora y fauna", desc: "Microclima único mencionado por Charles Darwin como un lugar maravilloso." },
  { n: "04", title: "Productos orgánicos", desc: "Piñas, naranjas, miel y aceite de oliva cultivados de forma totalmente orgánica." },
];

export default function ElFundo() {
  return (
    <div className="bg-background">
      <Navbar />

      <section className="relative h-[52vh] min-h-[420px] flex items-end overflow-hidden">
        <video
          src="https://media.base44.com/videos/public/6ab198431b520d2f22e78e1a/b5f5e4810_TeaserFundoElGrillo.mp4"
          autoPlay muted loop playsInline preload="metadata"
          poster="https://pub-bf044be5e1644eeea160056cc2074860.r2.dev/6a37a0352_DSC_0985.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-grad" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pb-16 w-full">
          <span className="text-xs tracking-architectural uppercase text-hero/70 mb-4 block">Nuestra historia</span>
          <h1 className="font-display text-hero text-5xl md:text-7xl leading-[1.05]">El Fundo</h1>
        </div>
      </section>

      <section className="py-24 md:py-32 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <span className="text-xs tracking-architectural uppercase text-accent">Historia</span>
            <h2 className="font-display text-4xl md:text-5xl mt-4 leading-[1.1] text-balance">
              Un lugar que hemos preservado por generaciones
            </h2>
          </div>
          <div className="md:col-span-7 space-y-6 text-foreground/75 text-lg leading-relaxed">
            <p>
              Este fue el único camino a la costa durante la colonia, lo que nos
              ha llevado a preservar este lugar histórico para dar valor al
              dicho: <em>"Aquí y en la Quebrada del Ají"</em>.
            </p>
            <p>
              Originalmente habitado por los incas, quienes cultivaron ají para
              ser enviado al Perú. Charles Darwin lo menciona como un lugar
              maravilloso por su flora, fauna y microclima.
            </p>
            <p>
              Hoy, Fundo El Grillo se extiende sobre 500 hectáreas de bosque
              nativo, ofreciendo cabañas, salones de eventos, rutas de trekking,
              granja educativa y cultivos orgánicos.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <SectionHeading eyebrow="Características" title="Lo que hace único al fundo" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
            {features.map((f) => (
              <div key={f.n} className="bg-card p-10">
                <span className="font-display text-5xl text-accent/30">{f.n}</span>
                <h3 className="font-display text-2xl mt-4 mb-3">{f.title}</h3>
                <p className="text-foreground/70 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
