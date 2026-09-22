import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const titles = {
  "/admin": "Panel",
  "/admin/registro": "Nuevo ingreso",
  "/admin/ingresos": "Registro de ingresos",
  "/admin/solicitudes": "Solicitudes de reserva",
  "/admin/ocupacion": "Ocupación",
  "/admin/cabanas": "Cabañas y salones",
  "/admin/cuenta": "Mi cuenta",
};

export default function MobileAdminHeader() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isSubpath = pathname !== "/admin";
  const title = titles[pathname] || "Panel";

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/admin");
    }
  };

  return (
    <header className="md:hidden sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border pt-safe-area -mx-4 -mt-4 mb-4">
      <div className="flex items-center gap-3 px-4 h-14">
        {isSubpath && (
          <button
            onClick={handleBack}
            className="h-11 w-11 -ml-2 flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors active:scale-95"
            aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h1 className="font-display text-lg flex-1 truncate">{title}</h1>
      </div>
    </header>
  );
}