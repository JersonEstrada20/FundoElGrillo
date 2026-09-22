import React, { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Search, RefreshCw, Mail, Phone, Users, Calendar, Check, X, Clock, MessageSquare, Download, FileText } from "lucide-react";
import { exportToCsv } from "@/lib/exportCsv";
import { exportToPdf } from "@/lib/exportPdf";
import PullToRefresh from "@/components/PullToRefresh";

const STATUS_CONFIG = {
  pendiente: { label: "Pendiente", icon: Clock, cls: "bg-accent/15 text-accent border-accent/30" },
  confirmada: { label: "Confirmada", icon: Check, cls: "bg-chart-1/15 text-chart-1 border-chart-1/30" },
  rechazada: { label: "Rechazada", icon: X, cls: "bg-destructive/10 text-destructive border-destructive/30" },
};

export default function Solicitudes() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [expanded, setExpanded] = useState({});
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    return base44.entities.BookingRequest.list("-created_date", 500)
      .then(setRequests)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    const unsub = base44.entities.BookingRequest.subscribe(() => load());
    return unsub;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return requests.filter((r) => {
      if (statusFilter && r.status !== statusFilter) return false;
      if (!q) return true;
      return (
        r.name?.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q) ||
        r.cabin?.toLowerCase().includes(q) ||
        r.phone?.toLowerCase().includes(q)
      );
    });
  }, [requests, query, statusFilter]);

  const toggle = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  const updateStatus = async (id, status) => {
    setError("");
    const prevRequests = requests;
    setRequests((current) => current.map((r) => (r.id === id ? { ...r, status } : r)));
    setUpdating(id);
    try {
      await base44.functions.invoke("manageBooking", { bookingId: id, status });
    } catch (err) {
      setRequests(prevRequests);
      setError(err?.message || "No se pudo actualizar el estado.");
    } finally {
      setUpdating(null);
    }
  };

  const counts = useMemo(() => {
    const c = { pendiente: 0, confirmada: 0, rechazada: 0 };
    requests.forEach((r) => { if (c[r.status] !== undefined) c[r.status]++; });
    return c;
  }, [requests]);

  return (
    <PullToRefresh onRefresh={load}>
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Solicitudes de reserva</h1>
          <p className="text-foreground/60 mt-2">
            {loading ? "Cargando…" : `${filtered.length} solicitud(es)`}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={load} className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors self-start">
            <RefreshCw className="w-4 h-4" /> Actualizar
          </button>
          <button
            onClick={() => exportToCsv(
              filtered.map((r) => ({
                name: r.name,
                email: r.email,
                phone: r.phone,
                cabin: r.cabin,
                arrival_date: r.arrival_date,
                departure_date: r.departure_date,
                guests: r.guests,
                status: (STATUS_CONFIG[r.status] || {}).label || r.status,
                message: r.message || "",
              })),
              [
                { key: "name", label: "Nombre" },
                { key: "email", label: "Email" },
                { key: "phone", label: "Teléfono" },
                { key: "cabin", label: "Cabaña" },
                { key: "arrival_date", label: "Llegada" },
                { key: "departure_date", label: "Salida" },
                { key: "guests", label: "Personas" },
                { key: "status", label: "Estado" },
                { key: "message", label: "Mensaje" },
              ],
              "solicitudes"
            )}
            className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors self-start"
          >
            <Download className="w-4 h-4" /> Exportar CSV
          </button>
          <button
            onClick={() => exportToPdf(
              filtered.map((r) => ({
                name: r.name,
                email: r.email,
                phone: r.phone,
                cabin: r.cabin,
                arrival_date: r.arrival_date,
                departure_date: r.departure_date,
                guests: r.guests,
                status: (STATUS_CONFIG[r.status] || {}).label || r.status,
                message: r.message || "",
              })),
              [
                { key: "name", label: "Nombre" },
                { key: "email", label: "Email" },
                { key: "phone", label: "Teléfono" },
                { key: "cabin", label: "Cabaña" },
                { key: "arrival_date", label: "Llegada" },
                { key: "departure_date", label: "Salida" },
                { key: "guests", label: "Pers." },
                { key: "status", label: "Estado" },
                { key: "message", label: "Mensaje" },
              ],
              "solicitudes"
            )}
            className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors self-start"
          >
            <FileText className="w-4 h-4" /> Exportar PDF
          </button>
        </div>
      </div>

      {/* Contadores por estado */}
      <div className="grid grid-cols-3 gap-px bg-border border border-border mb-6">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setStatusFilter(statusFilter === key ? "" : key)}
            className={`p-4 text-left transition-colors ${statusFilter === key ? "bg-foreground text-background" : "bg-background hover:bg-muted/50"}`}
          >
            <cfg.icon className="w-4 h-4 mb-2 opacity-60" />
            <p className="font-display text-2xl">{counts[key]}</p>
            <p className="text-xs tracking-architectural uppercase opacity-60">{cfg.label}</p>
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      {/* Filtro de búsqueda */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre, correo, cabaña o teléfono…"
          className="w-full pl-10 pr-4 py-3 bg-background border border-border text-sm focus:border-accent focus:outline-none transition-colors"
        />
      </div>

      {/* Lista */}
      {loading ? (
        <p className="text-foreground/50 py-10 text-center">Cargando solicitudes…</p>
      ) : filtered.length === 0 ? (
        <div className="border border-border p-10 text-center text-foreground/50">
          No hay solicitudes que coincidan con la búsqueda.
        </div>
      ) : (
        <div className="border border-border divide-y divide-border">
          {filtered.map((r) => {
            const isOpen = expanded[r.id];
            const cfg = STATUS_CONFIG[r.status] || STATUS_CONFIG.pendiente;
            return (
              <div key={r.id} className="border-l-2 border-l-transparent hover:border-l-accent transition-colors">
                <button
                  onClick={() => toggle(r.id)}
                  className="w-full px-4 py-4 text-left flex flex-col md:flex-row md:items-center gap-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-medium">{r.name}</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs border ${cfg.cls}`}>
                        <cfg.icon className="w-3 h-3" /> {cfg.label}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/60 mt-1">
                      {r.cabin} · {r.guests} persona(s) · {r.arrival_date} → {r.departure_date}
                    </p>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 grid md:grid-cols-2 gap-6">
                    {/* Datos de contacto */}
                    <div className="space-y-3">
                      <h3 className="text-xs tracking-architectural uppercase text-foreground/40">Contacto</h3>
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center gap-2 text-foreground/70">
                          <Mail className="w-4 h-4 text-foreground/40" /> {r.email}
                        </p>
                        <p className="flex items-center gap-2 text-foreground/70">
                          <Phone className="w-4 h-4 text-foreground/40" /> {r.phone}
                        </p>
                        <p className="flex items-center gap-2 text-foreground/70">
                          <Users className="w-4 h-4 text-foreground/40" /> {r.guests} persona(s)
                        </p>
                        <p className="flex items-center gap-2 text-foreground/70">
                          <Calendar className="w-4 h-4 text-foreground/40" /> {r.arrival_date} → {r.departure_date}
                        </p>
                      </div>
                    </div>

                    {/* Mensaje + acciones */}
                    <div className="space-y-3">
                      {r.message && (
                        <div>
                          <h3 className="text-xs tracking-architectural uppercase text-foreground/40 mb-2 flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" /> Mensaje
                          </h3>
                          <p className="text-sm text-foreground/70 bg-muted/50 border border-border p-3">
                            {r.message}
                          </p>
                        </div>
                      )}
                      <div>
                        <h3 className="text-xs tracking-architectural uppercase text-foreground/40 mb-2">Cambiar estado</h3>
                        <div className="flex gap-2 flex-wrap">
                          {Object.entries(STATUS_CONFIG).map(([key, sc]) => (
                            <button
                              key={key}
                              disabled={updating === r.id || r.status === key}
                              onClick={() => updateStatus(r.id, key)}
                              className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm border transition-colors disabled:opacity-40 ${
                                r.status === key ? sc.cls : "border-border text-foreground/60 hover:text-foreground hover:border-foreground/30"
                              }`}
                            >
                              <sc.icon className="w-3.5 h-3.5" /> {sc.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
    </PullToRefresh>
  );
}