import React, { useRef } from "react";
import { Link, NavLink, useNavigate, useLocation, useOutlet } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { LayoutDashboard, UserPlus, ClipboardList, LogOut, ExternalLink, CalendarClock, CalendarDays, BedDouble, Moon, Sun, User } from "lucide-react";

const LOGO = "https://media.base44.com/images/public/6ab198431b520d2f22e78e1a/87d1b1328_image.png";
import { useTheme } from "@/lib/useTheme";
import MobileAdminHeader from "@/components/admin/MobileAdminHeader";

const allNav = [
  { to: "/admin", label: "Panel", icon: LayoutDashboard, end: true, adminOnly: false },
  { to: "/admin/registro", label: "Nuevo ingreso", icon: UserPlus, adminOnly: false },
  { to: "/admin/ingresos", label: "Registro de ingresos", icon: ClipboardList, adminOnly: false },
  // Recepción también debe gestionar las solicitudes que llegan desde el sitio público.
  { to: "/admin/solicitudes", label: "Solicitudes de reserva", icon: CalendarClock, adminOnly: false },
  { to: "/admin/ocupacion", label: "Ocupación", icon: CalendarDays, adminOnly: false },
  // El acceso se mantiene visible como en el panel original. La página valida
  // permisos antes de permitir cambios a las fichas de cabañas y salones.
  { to: "/admin/cabanas", label: "Cabañas y salones", icon: BedDouble, adminOnly: false },
  { to: "/admin/cuenta", label: "Mi cuenta", icon: User, adminOnly: false },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();
  const location = useLocation();
  const outlet = useOutlet();
  const cacheRef = useRef({});
  cacheRef.current[location.pathname] = outlet;
  const nav = allNav.filter((n) => !n.adminOnly || user?.role === "admin");

  const handleLogout = () => {
    logout(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="md:w-64 md:min-h-screen bg-sidebar text-sidebar-foreground flex md:flex-col flex-row md:flex-shrink-0">
        <div className="p-6 border-b border-sidebar-border md:block flex items-center flex-1">
          <Link to="/admin" className="flex items-center gap-2">
            <img src={LOGO} alt="Fundo El Grillo" className="h-10 w-10 object-contain" />
            <span className="font-display text-xl">Fundo El Grillo</span>
          </Link>
          <p className="text-xs tracking-architectural uppercase text-sidebar-foreground/40 mt-1 hidden md:block">
            Panel de recepción
          </p>
        </div>

        <nav className="p-4 md:p-6 flex md:flex-col gap-1 md:flex-1 overflow-x-auto">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                }`
              }
            >
              <n.icon className="w-4 h-4" />
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 md:p-6 border-t border-sidebar-border hidden md:block">
          <div className="mb-4 text-xs text-sidebar-foreground/50 truncate">
            {user?.email || "Conectado"}
          </div>
          <Link to="/" className="flex items-center gap-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground mb-3">
            <ExternalLink className="w-4 h-4" /> Ver sitio público
          </Link>
          <button onClick={toggle} className="flex items-center gap-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground mb-3">
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />} {dark ? "Modo claro" : "Modo oscuro"}
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-sidebar-foreground/70 hover:text-accent">
            <LogOut className="w-4 h-4" /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-4 md:p-10 max-w-6xl">
        <MobileAdminHeader />
        {Object.entries(cacheRef.current).map(([path, element]) => (
          <div
            key={path}
            className={path === location.pathname ? "block" : "hidden"}
            aria-hidden={path !== location.pathname}
          >
            {element}
          </div>
        ))}
      </main>
    </div>
  );
}
