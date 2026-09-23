import React from "react";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";

const rules = [
  "El ingreso a las cabañas es desde las 13:00 y la salida hasta las 11:00. El late check-out hasta las 20:00 tiene un valor adicional del 50%, sujeto a disponibilidad.",
  "Para confirmar una reserva se requiere el abono del 50%. El saldo debe pagarse a más tardar dos días antes de la llegada.",
  "En temporada alta la estadía mínima es de 2 noches; durante fines de semana largos y Año Nuevo es de 3 noches.",
  "Las personas adicionales tienen un valor de $10.000 y las visitas de $5.000 por persona.",
  "El servicio de mucama está disponible por $12.000. Si la cabaña no se entrega en las condiciones de orden e higiene recibidas, se aplica un recargo de aseo de $25.000.",
  "Las cabañas incluyen ropa de cama y vajilla; no incluyen toallas. Las mascotas se aceptan solo en cabañas seleccionadas y previo acuerdo.",
  "No se permiten equipos de audio. Entre las 22:00 y las 08:00 se debe mantener un nivel de ruido que respete el descanso de los demás huéspedes.",
  "En ciertas zonas, por el carácter rural del fundo, puede haber cobertura baja o ausencia de señal telefónica e internet.",
  "Los precios publicados no incluyen IVA. Las piscinas privadas son de refresco y las compartidas son de nado.",
];

export default function Terminos() {
  return <div className="bg-background"><Navbar />
    <main className="pt-32 pb-24 max-w-4xl mx-auto px-6 lg:px-10">
      <span className="text-xs tracking-architectural uppercase text-accent">Reservas</span>
      <h1 className="font-display text-5xl md:text-6xl mt-4">Términos y condiciones</h1>
      <p className="mt-8 text-foreground/70 text-lg leading-relaxed">Estas condiciones complementan la solicitud de reserva. La reserva queda confirmada una vez coordinado el pago con nuestro equipo.</p>
      <ol className="mt-10 space-y-5 text-foreground/75 leading-relaxed list-decimal pl-6">{rules.map((rule) => <li key={rule}>{rule}</li>)}</ol>
    </main><Footer />
  </div>;
}
