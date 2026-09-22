import React, { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Search, ChevronDown, ChevronRight, Car, Users, RefreshCw, Download, FileText, Clock } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { exportToCsv } from "@/lib/exportCsv";
import { exportToPdf } from "@/lib/exportPdf";
import MobileSelect from "@/components/admin/MobileSelect";
import PullToRefresh from "@/components/PullToRefresh";

export default function Ingresos() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState({});
  const [dateFilter, setDateFilter] = useState("");
  const [cabinFilter, setCabinFilter] = useState("");
  const [searchParams] = useSearchParams();

  const load = () => {
    setLoading(true);
    return base44.entities.VisitorEntry.list("-entry_date", 500)
      .then(setEntries)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setQuery(q);
    load();
    const unsub = base44.entities.VisitorEntry.subscribe(() => load());
    return unsub;
  }, [searchParams]);

  const today = new Date().toISOString().slice(0, 10);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((e) => {
      if (dateFilter && e.entry_date !== dateFilter) return false;
      if (cabinFilter && e.cabin !== cabinFilter) return false;
      if (!q) return true;
      if (e.cabin?.toLowerCase().includes(q)) return true;
      return (e.people || []).some(
        (p) =>
          p.full_name?.toLowerCase().includes(q) ||
          p.rut?.toLowerCase().includes(q) ||
          p.plate?.toLowerCase().includes(q)
      );
    });
  }, [entries, query, dateFilter]);

  const cabins = useMemo(() => {
    return [...new Set(entries.map((e) => e.cabin).filter(Boolean))].sort();
  }, [entries]);

  const toggle = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  const registerCheckout = async (id) => {
    const now = new Date().toTimeString().slice(0, 5);
    try {
      await base44.entities.VisitorEntry.update(id, { check_out_time: now });
      setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, check_out_time: now } : e)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <PullToRefresh onRefresh={load}>
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Registro de ingresos</h1>
          <p className="text-foreground/60 mt-2">
            {loading ? "Cargando…" : `${filtered.length} registro(s)`}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={load} className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors self-start">
            <RefreshCw className="w-4 h-4" /> Actualizar
          </button>
          <button
            onClick={() => exportToCsv(
              filtered.flatMap((e) => (e.people || []).map((p) => ({
                cabin: e.cabin,
                entry_date: e.entry_date,
                check_in_time: e.check_in_time || "",
                check_out_time: e.check_out_time || "",
                full_name: p.full_name,
                rut: p.rut,
                phone: p.phone,
                plate: p.plate,
                nationality: p.nationality,
                notes: e.notes || "",
              }))),
              [
                { key: "cabin", label: "Cabaña" },
                { key: "entry_date", label: "Fecha ingreso" },
                { key: "check_in_time", label: "Hora entrada" },
                { key: "check_out_time", label: "Hora salida" },
                { key: "full_name", label: "Nombre" },
                { key: "rut", label: "RUT" },
                { key: "phone", label: "Celular" },
                { key: "plate", label: "Patente" },
                { key: "nationality", label: "Nacionalidad" },
                { key: "notes", label: "Observaciones" },
              ],
              "ingresos"
            )}
            className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors self-start"
          >
            <Download className="w-4 h-4" /> Exportar CSV
          </button>
          <button
            onClick={() => exportToPdf(
              filtered.flatMap((e) => (e.people || []).map((p) => ({
                cabin: e.cabin,
                entry_date: e.entry_date,
                check_in_time: e.check_in_time || "",
                check_out_time: e.check_out_time || "",
                full_name: p.full_name,
                rut: p.rut,
                phone: p.phone,
                plate: p.plate,
                nationality: p.nationality,
                notes: e.notes || "",
              }))),
              [
                { key: "cabin", label: "Cabaña" },
                { key: "entry_date", label: "Fecha" },
                { key: "check_in_time", label: "Entrada" },
                { key: "check_out_time", label: "Salida" },
                { key: "full_name", label: "Nombre" },
                { key: "rut", label: "RUT" },
                { key: "phone", label: "Celular" },
                { key: "plate", label: "Patente" },
                { key: "nationality", label: "Nacionalidad" },
                { key: "notes", label: "Obs." },
              ],
              "ingresos"
            )}
            className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors self-start"
          >
            <FileText className="w-4 h-4" /> Exportar PDF
          </button>
        </div>
      </div>

      {/* Filtro */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, RUT, patente o cabaña…"
            className="w-full pl-10 pr-4 py-3 bg-background border border-border text-sm focus:border-accent focus:outline-none transition-colors"
          />
        </div>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-4 py-3 bg-background border border-border text-sm focus:border-accent focus:outline-none transition-colors"
        />
        <MobileSelect
          value={cabinFilter}
          onChange={setCabinFilter}
          options={[{ value: "", label: "Todas las cabañas" }, ...cabins.map((c) => ({ value: c, label: c }))]}
          placeholder="Todas las cabañas"
          className="w-full md:w-auto px-4 py-3 bg-background border border-border text-sm focus:border-accent focus:outline-none transition-colors"
        />
        {(dateFilter || cabinFilter) && (
          <button
            onClick={() => { setDateFilter(""); setCabinFilter(""); }}
            className="px-4 py-3 border border-border text-sm text-foreground/60 hover:text-foreground"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Tabla */}
      {loading ? (
        <p className="text-foreground/50 py-10 text-center">Cargando registros…</p>
      ) : filtered.length === 0 ? (
        <div className="border border-border p-10 text-center text-foreground/50">
          No hay registros que coincidan con la búsqueda.
        </div>
      ) : (
        <div className="border border-border">
          <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-3 bg-muted text-xs tracking-architectural uppercase text-foreground/50 border-b border-border">
            <div className="col-span-1"></div>
            <div className="col-span-3">Cabaña</div>
            <div className="col-span-2">Fecha</div>
            <div className="col-span-2">Titular</div>
            <div className="col-span-2">Personas</div>
            <div className="col-span-2">Vehículos</div>
          </div>
          <div className="divide-y divide-border">
            {filtered.map((e) => {
              const isOpen = expanded[e.id];
              const isToday = e.entry_date === today;
              const vehicles = (e.people || []).filter((p) => p.plate);
              return (
                <div key={e.id} className={`border-l-2 ${isToday ? "border-l-accent" : "border-l-transparent"}`}>
                  <button
                    onClick={() => toggle(e.id)}
                    className="w-full grid md:grid-cols-12 gap-2 px-4 py-4 items-center text-left hover:bg-muted/50 transition-colors"
                  >
                    <div className="md:col-span-1 flex items-center">
                      {isOpen ? <ChevronDown className="w-4 h-4 text-foreground/40" /> : <ChevronRight className="w-4 h-4 text-foreground/40" />}
                    </div>
                    <div className="md:col-span-3 font-medium">{e.cabin}</div>
                    <div className="md:col-span-2 text-sm text-foreground/70">
                      {e.entry_date}
                      {isToday && <span className="ml-2 text-xs text-accent tracking-architectural uppercase">Hoy</span>}
                    </div>
                    <div className="md:col-span-2 text-sm text-foreground/70 truncate">{e.people?.[0]?.full_name}</div>
                    <div className="md:col-span-2 text-sm flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-foreground/40" /> {e.people?.length || 0}
                    </div>
                    <div className="md:col-span-2 text-sm flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-foreground/40" /> {vehicles.length}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 md:pl-14">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border border-border">
                          <thead>
                            <tr className="bg-muted text-xs tracking-architectural uppercase text-foreground/50">
                              <th className="text-left px-3 py-2 font-medium">Nombre y apellido</th>
                              <th className="text-left px-3 py-2 font-medium">RUT</th>
                              <th className="text-left px-3 py-2 font-medium">Celular</th>
                              <th className="text-left px-3 py-2 font-medium">Patente</th>
                              <th className="text-left px-3 py-2 font-medium">Nacionalidad</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {(e.people || []).map((p, i) => (
                              <tr key={i} className={isToday ? "" : "text-foreground/70"}>
                                <td className="px-3 py-2">{p.full_name}</td>
                                <td className="px-3 py-2 font-mono">{p.rut}</td>
                                <td className="px-3 py-2">{p.phone}</td>
                                <td className="px-3 py-2">
                                  {p.plate ? (
                                    <span className="inline-block px-2 py-0.5 bg-foreground text-background font-mono text-xs tracking-widest">{p.plate}</span>
                                  ) : "—"}
                                </td>
                                <td className="px-3 py-2">{p.nationality}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {(e.check_in_time || e.check_out_time) && (
                        <div className="mt-3 flex gap-4 text-sm text-foreground/60">
                          {e.check_in_time && (
                            <span className="inline-flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-accent" /> Entrada: <strong>{e.check_in_time}</strong>
                            </span>
                          )}
                          {e.check_out_time && (
                            <span className="inline-flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-foreground/40" /> Salida: <strong>{e.check_out_time}</strong>
                            </span>
                          )}
                        </div>
                      )}
                      {e.notes && (
                        <p className="mt-3 text-sm text-foreground/60">
                          <span className="tracking-architectural uppercase text-xs text-foreground/40">Obs: </span>
                          {e.notes}
                        </p>
                      )}
                      {e.signature_url && (
                        <div className="mt-3">
                          <p className="text-xs tracking-architectural uppercase text-foreground/40 mb-1">Firma del grupo</p>
                          <img src={e.signature_url} alt="Firma" className="max-h-20 border border-border p-1 bg-background" />
                        </div>
                      )}
                      {!e.check_out_time && (
                        <button
                          onClick={(ev) => { ev.stopPropagation(); registerCheckout(e.id); }}
                          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          <Clock className="w-3 h-3" /> Registrar salida ahora
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
    </PullToRefresh>
  );
}