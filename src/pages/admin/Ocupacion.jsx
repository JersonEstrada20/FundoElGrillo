import React, { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

function getMonthMatrix(year, month) {
  const firstDay = new Date(year, month, 1);
  let startDay = firstDay.getDay() - 1; // lunes = 0
  if (startDay < 0) startDay = 6; // domingo
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function fmtDate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function Ocupacion() {
  const [entries, setEntries] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = new Date();
  const [viewDate, setViewDate] = useState({ year: today.getFullYear(), month: today.getMonth() });

  useEffect(() => {
    Promise.all([
      base44.entities.VisitorEntry.list("-entry_date", 500),
      base44.entities.BookingRequest.filter({ status: "confirmada" }, "-arrival_date", 500),
    ])
      .then(([e, b]) => {
        setEntries(e);
        setBookings(b);
      })
      .finally(() => setLoading(false));
  }, []);

  const cells = useMemo(() => getMonthMatrix(viewDate.year, viewDate.month), [viewDate]);

  // Mapa: fecha → Set de cabañas ocupadas
  const occupancy = useMemo(() => {
    const map = {};
    const add = (date, cabin, type) => {
      if (!map[date]) map[date] = [];
      map[date].push({ cabin, type });
    };
    entries.forEach((e) => add(e.entry_date, e.cabin, "entry"));
    bookings.forEach((b) => {
      if (!b.arrival_date || !b.departure_date) return;
      let cur = new Date(b.arrival_date);
      const end = new Date(b.departure_date);
      while (cur <= end) {
        const ds = cur.toISOString().slice(0, 10);
        add(ds, b.cabin, "booking");
        cur.setDate(cur.getDate() + 1);
      }
    });
    return map;
  }, [entries, bookings]);

  const prevMonth = () => {
    setViewDate((v) => (v.month === 0 ? { year: v.year - 1, month: 11 } : { year: v.year, month: v.month - 1 }));
  };
  const nextMonth = () => {
    setViewDate((v) => (v.month === 11 ? { year: v.year + 1, month: 0 } : { year: v.year, month: v.month + 1 }));
  };
  const goToday = () => setViewDate({ year: today.getFullYear(), month: today.getMonth() });

  const todayStr = new Date().toISOString().slice(0, 10);

  // Contar cabañas únicas ocupadas este mes
  const monthCabins = useMemo(() => {
    const set = new Set();
    cells.forEach((d) => {
      if (!d) return;
      const ds = fmtDate(viewDate.year, viewDate.month, d);
      (occupancy[ds] || []).forEach((o) => set.add(o.cabin));
    });
    return set.size;
  }, [cells, occupancy, viewDate]);

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Ocupación</h1>
          <p className="text-foreground/60 mt-2">
            {loading ? "Cargando…" : `${monthCabins} cabaña(s) con actividad este mes`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-2 border border-border hover:bg-muted transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={goToday} className="px-4 py-2 border border-border text-sm hover:bg-muted transition-colors">
            Hoy
          </button>
          <button onClick={nextMonth} className="p-2 border border-border hover:bg-muted transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-4 text-xs">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 bg-accent/30 border border-accent" /> Ingreso registrado
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 bg-chart-1/30 border border-chart-1" /> Reserva confirmada
        </span>
      </div>

      {/* Encabezado días */}
      <div className="grid grid-cols-7 gap-px bg-border border border-border">
        {WEEKDAYS.map((d) => (
          <div key={d} className="bg-muted px-2 py-2 text-xs tracking-architectural uppercase text-foreground/50 text-center">
            {d}
          </div>
        ))}
        {/* Celdas */}
        {cells.map((d, i) => {
          if (!d) return <div key={i} className="bg-muted/30 min-h-[80px] md:min-h-[110px]" />;
          const ds = fmtDate(viewDate.year, viewDate.month, d);
          const occ = occupancy[ds] || [];
          const isToday = ds === todayStr;
          // Deduplicar cabañas, mantener el tipo predominante
          const cabinMap = {};
          occ.forEach((o) => {
            if (!cabinMap[o.cabin] || o.type === "entry") cabinMap[o.cabin] = o.type;
          });
          const cabinList = Object.entries(cabinMap);
          return (
            <div key={i} className={`bg-background p-2 min-h-[80px] md:min-h-[110px] ${isToday ? "ring-2 ring-accent ring-inset" : ""}`}>
              <span className={`text-sm font-medium ${isToday ? "text-accent" : "text-foreground/70"}`}>{d}</span>
              <div className="mt-1 space-y-1">
                {cabinList.slice(0, 3).map(([cabin, type]) => (
                  <div
                    key={cabin}
                    className={`text-xs px-1.5 py-0.5 truncate border ${
                      type === "entry"
                        ? "bg-accent/15 text-accent border-accent/30"
                        : "bg-chart-1/15 text-chart-1 border-chart-1/30"
                    }`}
                    title={cabin}
                  >
                    {cabin}
                  </div>
                ))}
                {cabinList.length > 3 && (
                  <span className="text-xs text-foreground/40">+{cabinList.length - 3} más</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}