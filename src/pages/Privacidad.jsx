import React from "react";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";

export default function Privacidad() {
  return <div className="bg-background"><Navbar />
    <main className="pt-32 pb-24 max-w-4xl mx-auto px-6 lg:px-10">
      <span className="text-xs tracking-architectural uppercase text-accent">Transparencia</span>
      <h1 className="font-display text-5xl md:text-6xl mt-4">Política de privacidad</h1>
      <div className="mt-10 space-y-7 text-foreground/75 text-lg leading-relaxed">
        <p>Cuando envías una solicitud de reserva recopilamos los datos que ingresas en el formulario, como nombre, correo, teléfono, fechas de estadía, cantidad de personas y cabaña o salón de interés.</p>
        <p>Usamos estos datos únicamente para responder la solicitud, revisar disponibilidad, gestionar la reserva y comunicarnos contigo. El equipo de recepción autorizado puede acceder a esta información para cumplir esas tareas.</p>
        <p>No vendemos ni entregamos tus datos personales a terceros con fines comerciales. Puedes solicitar la actualización o eliminación de la información asociada a una solicitud escribiendo a <a className="text-accent hover:underline" href="mailto:consultas@cabañasfundoelgrillo.cl">consultas@cabañasfundoelgrillo.cl</a>.</p>
        <p>Este sitio puede usar servicios técnicos necesarios para funcionar, como alojamiento web, almacenamiento de imágenes y mapas. Estos servicios pueden procesar datos técnicos mínimos, como dirección IP y tipo de navegador.</p>
      </div>
    </main><Footer />
  </div>;
}
