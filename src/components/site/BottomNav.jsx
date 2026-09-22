import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, BedDouble, Images, LayoutDashboard } from "lucide-react";

const tabs = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/cabanas", label: "Cabañas", icon: BedDouble },
  { to: "/galeria", label: "Galería", icon: Images },
  { to: "/admin", label: "Admin", icon: LayoutDashboard },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/admin") || pathname.startsWith("/login") || pathname.startsWith("/register")) return null;

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur border-t border-border pb-safe-area">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const active = pathname === tab.to;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors select-none ${
                active ? "text-accent" : "text-foreground/50"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-[10px] tracking-architectural uppercase">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}