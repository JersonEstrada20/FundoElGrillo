import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { UserPlus, ClipboardList, Users, Car, Calendar, CalendarClock, CalendarDays, Search, LogIn } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [quickSearch, setQuickSearch] = useState("");

  useEffect(() => {
    base44.entities.VisitorEntry.list("-created_date", 200)
      .then(setEntries)
      .finally(() => setLoading(false));
    if (isAdmin) {
      base44.entities.BookingRequest.list("-created_date", 200).then(setBookings);
    }
  }, [isAdmin]);

  const today = new Date().toISOString().slice(0, 10);
  const todayEntries = entries.filter((e) => e.entry_date === today);
  const todayPeople = todayEntries.reduce((acc, e) => acc + (e.people?.length || 0), 0);
  const totalPeople = entries.reduce((acc, e) => acc + (e.people?.length || 0), 0);
  const vehicles = entries.reduce(
    (acc, e) => acc + (e.people || []).filter((p) => p.plate).length,
    0
  );
  const pendingBookings = bookings.filter((b) => b.status === "pendiente").length;
  const insideNow = entries.filter((e) => e.check_in_time && !e.check_out_time);

  const last7Days = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      days.push({
        day: d.toLocaleDateString("es-CL", { weekday: "short" }).replace(".", ""),
        ingresos: entries.filter((e) => e.entry_date === dateStr).length,
      });
    }
    return days;
  }, [entries]);

  const topCabins = useMemo(() => {
    const counts = {};
    entries.forEach((e) => { if (e.cabin) counts[e.cabin] = (counts[e.cabin] || 0) + 1; });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [entries]);

  const stats = [
    { label: "Ingresos hoy", value: todayEntries.length, icon: Calendar, accent: true },
    { label: "Personas hoy", value: todayPeople, icon: Users },
    ...(isAdmin ? [{ label: "Reservas pendientes", value: pendingBookings, icon: CalendarClock }] : [{ label: "Total registros", value: entries.length, icon: ClipboardList }]),
    { label: "Vehículos registrados", value: vehicles, icon: Car },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl">Panel de recepción</h1>
        <p className="text-foreground/60 mt-2">Resumen del ingreso de visitantes al recinto.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border mb-6">
        {stats.map((s) => (
          <div key={s.label} className={`p-6 bg-card border-l-2 ${s.accent ? "border-l-accent" : "border-l-transparent"}`}>
            <s.icon className={`w-5 h-5 mb-3 ${s.accent ? "text-accent" : "text-foreground/40"}`} />
            <p className="font-display text-4xl">{loading ? "–" : s.value}</p>
            <p className="text-xs tracking-architectural uppercase mt-1 opacity-60">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Huéspedes dentro + búsqueda rápida */}
      <div className="grid md:grid-cols-2 gap-px bg-border border border-border mb-10">
        <div className="bg-card p-6">
          <div className="flex items-center gap-2 mb-2">
            <LogIn className="w-4 h-4 text-accent" />
            <span className="text-xs tracking-architectural uppercase text-foreground/50">Huéspedes dentro del recinto</span>
          </div>
          <p className="font-display text-4xl">{insideNow.length}</p>
          {insideNow.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {insideNow.map((e) => (
                <span key={e.id} className="text-xs px-2 py-1 bg-accent/10 text-accent border border-accent/30">
                  {e.cabin} · {e.people?.[0]?.full_name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-foreground/40 mt-2">Sin ingresos activos.</p>
          )}
        </div>
        <div className="bg-card p-6 flex flex-col justify-center">
          <span className="text-xs tracking-architectural uppercase text-foreground/50 mb-3">Búsqueda rápida</span>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/admin/ingresos?q=${encodeURIComponent(quickSearch.trim())}`);
            }}
            className="relative"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              placeholder="Nombre, RUT, patente o cabaña…"
              className="w-full pl-10 pr-4 py-3 bg-background border border-border text-sm focus:border-accent focus:outline-none transition-colors"
            />
          </form>
        </div>
      </div>

      {/* Gráficos */}
      {!loading && entries.length > 0 && (
        <div className="grid md:grid-cols-2 gap-px bg-border border border-border mb-10">
          <div className="bg-card p-6">
            <h3 className="text-xs tracking-architectural uppercase text-foreground/50 mb-4">Ingresos últimos 7 días</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={last7Days}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Bar dataKey="ingresos" fill="hsl(var(--accent))" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-card p-6">
            <h3 className="text-xs tracking-architectural uppercase text-foreground/50 mb-4">Cabañas más visitadas</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={topCabins} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={95} />
                <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className={`grid ${isAdmin ? "md:grid-cols-4" : "md:grid-cols-3"} gap-px bg-border border border-border mb-10`}>
        <Link to="/admin/registro" className="bg-background p-8 hover:bg-card transition-colors group">
          <UserPlus className="w-8 h-8 text-accent mb-4" />
          <h2 className="font-display text-2xl mb-2">Registrar nuevo ingreso</h2>
          <p className="text-foreground/60 text-sm">
            Registra el ingreso de un grupo: titular y acompañantes con sus
            datos y vehículos.
          </p>
        </Link>
        <Link to="/admin/ingresos" className="bg-background p-8 hover:bg-card transition-colors group">
          <ClipboardList className="w-8 h-8 text-accent mb-4" />
          <h2 className="font-display text-2xl mb-2">Ver registro de ingresos</h2>
          <p className="text-foreground/60 text-sm">
            Consulta en tiempo real todas las personas y vehículos que han
            ingresado, hoy o en fechas anteriores.
          </p>
        </Link>
        {isAdmin && (
          <Link to="/admin/solicitudes" className="bg-background p-8 hover:bg-card transition-colors group">
            <CalendarClock className="w-8 h-8 text-accent mb-4" />
            <h2 className="font-display text-2xl mb-2">Solicitudes de reserva</h2>
            <p className="text-foreground/60 text-sm">
              Revisa y gestiona las solicitudes que llegan desde el formulario
              público del sitio web.
            </p>
          </Link>
        )}
        <Link to="/admin/ocupacion" className="bg-background p-8 hover:bg-card transition-colors group">
          <CalendarDays className="w-8 h-8 text-accent mb-4" />
          <h2 className="font-display text-2xl mb-2">Ocupación</h2>
          <p className="text-foreground/60 text-sm">
            Calendario con las cabañas ocupadas según ingresos y reservas
            confirmadas.
          </p>
        </Link>
      </div>

      <div>
        <h2 className="font-display text-2xl mb-4">Últimos ingresos</h2>
        {loading ? (
          <p className="text-foreground/50">Cargando…</p>
        ) : todayEntries.length === 0 ? (
          <p className="text-foreground/50 border border-border p-6">
            No hay ingresos registrados hoy.
          </p>
        ) : (
          <div className="border border-border divide-y divide-border">
            {todayEntries.slice(0, 5).map((e) => (
              <div key={e.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">{e.cabin}</p>
                  <p className="text-sm text-foreground/60">
                    {e.people?.length || 0} persona(s) ·{" "}
                    {e.people?.[0]?.full_name}
                  </p>
                </div>
                <span className="text-xs tracking-architectural uppercase text-accent">Hoy</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}