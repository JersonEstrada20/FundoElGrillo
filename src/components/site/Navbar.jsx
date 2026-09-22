import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/useTheme";

const LOGO = "https://media.base44.com/images/public/6ab198431b520d2f22e78e1a/87d1b1328_image.png";

const links = [
  { label: "Inicio", to: "/" },
  { label: "Cabañas", to: "/cabanas" },
  { label: "Eventos", to: "/eventos" },
  { label: "Galería", to: "/galeria" },
  { label: "El Fundo", to: "/el-fundo" },
  { label: "Reservas", to: "/reservas" },
];

const noHeroRoutes = ["/reservas"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { dark, toggle } = useTheme();
  const solid = scrolled || noHeroRoutes.includes(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 pt-safe-area ${
        pathname !== "/" ? "hidden md:block" : ""
      } ${
        solid
          ? "bg-background/95 backdrop-blur-sm border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={LOGO} alt="Cabañas Fundo El Grillo" className="h-12 w-12 sm:h-14 sm:w-14 object-contain" />
          <span
            className={`font-display text-xl tracking-tight transition-colors hidden sm:block ${
              solid ? "text-foreground" : "text-hero"
            }`}
          >
            Fundo El Grillo
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={`text-sm tracking-architectural uppercase transition-colors relative py-1 ${
                  solid
                    ? "text-foreground/80 hover:text-accent"
                    : "text-hero/90 hover:text-hero"
                } ${pathname === l.to ? "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-accent" : ""}`}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={toggle}
              className={`p-2 transition-colors ${solid ? "text-foreground/80 hover:text-accent" : "text-hero/90 hover:text-hero"}`}
              aria-label="Cambiar tema"
            >
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </li>
          <li>
            <Link
              to="/reservas"
              className="text-sm tracking-architectural uppercase px-5 py-2.5 border border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Reservar
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={toggle}
            className={`p-2 ${solid ? "text-foreground" : "text-hero"}`}
            aria-label="Cambiar tema"
          >
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menú"
          >
            {solid ? (
              open ? <X className="text-foreground" /> : <Menu className="text-foreground" />
            ) : (
              open ? <X className="text-hero" /> : <Menu className="text-hero" />
            )}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden bg-background border-b border-border">
          <ul className="px-6 py-4 space-y-3">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="block text-sm tracking-architectural uppercase text-foreground/80 hover:text-accent py-2"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}