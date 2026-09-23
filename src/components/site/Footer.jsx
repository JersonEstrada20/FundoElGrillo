import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-hero-bg text-hero">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h3 className="font-display text-4xl mb-4">Fundo El Grillo</h3>
            <p className="text-hero/70 max-w-md leading-relaxed">
              Aquí y en la Quebrada del Ají. Cabañas inmersas en la naturaleza,
              salones de eventos y 500 hectáreas de bosque nativo en Quillota.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://www.instagram.com/fundoelgrillo/" target="_blank" rel="noreferrer" className="p-2 border border-hero/20 hover:border-accent hover:text-accent transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/fundoelgrillo/" target="_blank" rel="noreferrer" className="p-2 border border-hero/20 hover:border-accent hover:text-accent transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs tracking-architectural uppercase text-hero/50 mb-5">Navegación</h4>
            <ul className="space-y-3">
              <li><Link to="/cabanas" className="text-hero/80 hover:text-accent transition-colors">Cabañas</Link></li>
              <li><Link to="/eventos" className="text-hero/80 hover:text-accent transition-colors">Eventos</Link></li>
            <li><Link to="/galeria" className="text-hero/80 hover:text-accent transition-colors">Galería</Link></li>
              <li><Link to="/el-fundo" className="text-hero/80 hover:text-accent transition-colors">El Fundo</Link></li>
              <li><Link to="/reservas" className="text-hero/80 hover:text-accent transition-colors">Reservas</Link></li>
              <li><Link to="/terminos" className="text-hero/80 hover:text-accent transition-colors">Términos y condiciones</Link></li>
              <li><Link to="/privacidad" className="text-hero/80 hover:text-accent transition-colors">Política de privacidad</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-architectural uppercase text-hero/50 mb-5">Contacto</h4>
            <ul className="space-y-3 text-hero/80">
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-accent" /> (33) 231 6500</li>
              <li className="pl-6">(33) 231 2800 · (33) 225 3197</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-accent" /> consultas@cabañasfundoelgrillo.cl</li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 text-accent mt-1" /> Cam. Fundó El Grillo, Quillota, Valparaíso</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-hero/15 flex flex-col md:flex-row justify-between gap-4 text-xs text-hero/50 tracking-architectural uppercase">
          <span>© {new Date().getFullYear()} Cabañas Fundo El Grillo</span>
          <span>Quebrada del Ají · Quillota · Valparaíso</span>
        </div>
      </div>
    </footer>
  );
}
