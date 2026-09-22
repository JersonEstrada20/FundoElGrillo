import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import BookingForm from "@/components/site/BookingForm";
import { Phone, Mail } from "lucide-react";

export default function Reservas() {
  const { state } = useLocation();
  const defaultCabin = state?.cabin || "";

  return (
    <div className="bg-background">
      <Navbar />

      <section className="pt-32 pb-20 md:pt-40 md:pb-28 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <span className="text-xs tracking-architectural uppercase text-accent mb-4 block">Reservas y contacto</span>
            <h1 className="font-display text-5xl md:text-6xl leading-[1.05] text-balance">
              Solicita tu reserva
            </h1>
            <p className="mt-6 text-foreground/70 text-lg leading-relaxed">
              Completa el formulario con los datos de tu estadía. Nuestro equipo
              revisará la disponibilidad y te contactará para confirmar.
            </p>

            <div className="mt-12 space-y-5">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-xs tracking-architectural uppercase text-foreground/50">Teléfonos</p>
                  <p className="text-foreground/85">(33) 231 6500 · (33) 231 2800 · (33) 225 3197</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-xs tracking-architectural uppercase text-foreground/50">Correo</p>
                  <p className="text-foreground/85">consultas@cabañasfundoelgrillo.cl</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="border border-border bg-background p-8 md:p-10">
              <BookingForm defaultCabin={defaultCabin} />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}