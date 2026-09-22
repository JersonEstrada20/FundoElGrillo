import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const titles = {
  "/cabanas": "Cabañas",
  "/eventos": "Eventos",
  "/el-fundo": "El Fundo",
  "/galeria": "Galería",
  "/reservas": "Reservas",
};

export default function MobilePublicHeader() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  if (pathname === "/" || !titles[pathname]) return null;

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <header className="md:hidden fixed top-0 inset-x-0 z-50 bg-background/95 backdrop-blur border-b border-border pt-safe-area">
      <div className="flex items-center gap-3 px-4 h-14">
        <button
          onClick={handleBack}
          className="h-11 w-11 -ml-2 flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors active:scale-95"
          aria-label="Volver"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-lg flex-1 truncate">{titles[pathname]}</h1>
      </div>
    </header>
  );
}