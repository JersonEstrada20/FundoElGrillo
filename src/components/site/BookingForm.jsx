import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Check, Loader2 } from "lucide-react";
import MobileSelect from "@/components/admin/MobileSelect";

export default function BookingForm({ defaultCabin = "" }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    cabin: defaultCabin,
    arrival_date: "",
    departure_date: "",
    guests: 2,
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [refCode, setRefCode] = useState("");
  const [error, setError] = useState("");
  const [cabinOptions, setCabinOptions] = useState([]);

  useEffect(() => {
    base44.entities.Cabin.list("order", 200).then((all) => {
      setCabinOptions(all.filter((c) => c.is_active !== false).map((c) => c.name));
    }).catch(() => {});
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const created = await base44.entities.BookingRequest.create({ ...form, status: "pendiente" });
      base44.functions.invoke("notifyNewBooking", { booking_id: created.id }).catch((notifyError) => {
        console.error("No se pudo notificar la nueva solicitud:", notifyError);
      });
      setRefCode((created.id || "").slice(-6).toUpperCase());
      setDone(true);
    } catch (err) {
      setError(err?.message || "No se pudo enviar la solicitud. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="border border-border bg-card p-10 text-center">
        <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-accent/10 flex items-center justify-center">
          <Check className="w-7 h-7 text-accent" />
        </div>
        <h3 className="font-display text-3xl mb-3">Solicitud enviada</h3>
        <p className="text-foreground/70 max-w-md mx-auto">
          Gracias, {form.name.split(" ")[0]}. Hemos recibido tu solicitud de
          reserva para <strong>{form.cabin}</strong>. Nuestro equipo te
          contactará a la brevedad para confirmar disponibilidad.
        </p>
        {refCode && (
          <div className="mt-5 inline-block border border-accent/30 bg-accent/5 px-5 py-3">
            <p className="text-xs tracking-architectural uppercase text-foreground/50">N° de seguimiento</p>
            <p className="font-mono text-lg text-accent tracking-widest mt-1">{refCode}</p>
          </div>
        )}
        <button
          onClick={() => {
            setDone(false);
            setRefCode("");
            setForm({ name: "", email: "", phone: "", cabin: defaultCabin, arrival_date: "", departure_date: "", guests: 2, message: "" });
          }}
          className="mt-6 text-sm tracking-architectural uppercase text-accent hover:text-foreground transition-colors"
        >
          Enviar otra solicitud
        </button>
      </div>
    );
  }

  const field = "w-full bg-transparent border-b border-border py-3 px-0 text-foreground placeholder:text-foreground/40 focus:border-accent focus:outline-none transition-colors min-h-11 md:min-h-0";

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="text-xs tracking-architectural uppercase text-foreground/50">Nombre y apellido</label>
          <input className={field} value={form.name} onChange={(e) => set("name", e.target.value)} required placeholder="Tu nombre completo" />
        </div>
        <div>
          <label className="text-xs tracking-architectural uppercase text-foreground/50">Correo electrónico</label>
          <input type="email" className={field} value={form.email} onChange={(e) => set("email", e.target.value)} required placeholder="tu@correo.cl" />
        </div>
        <div>
          <label className="text-xs tracking-architectural uppercase text-foreground/50">Teléfono</label>
          <input className={field} value={form.phone} onChange={(e) => set("phone", e.target.value)} required placeholder="+56 9 1234 5678" />
        </div>
        <div>
          <label className="text-xs tracking-architectural uppercase text-foreground/50">Cabaña / Salón</label>
          <MobileSelect
            value={form.cabin}
            onChange={(v) => set("cabin", v)}
            options={[{ value: "", label: "Selecciona una cabaña" }, ...cabinOptions.map((c) => ({ value: c, label: c }))]}
            placeholder="Selecciona una cabaña"
            className={field}
          />
        </div>
        <div>
          <label className="text-xs tracking-architectural uppercase text-foreground/50">Llegada</label>
          <input type="date" className={field} value={form.arrival_date} onChange={(e) => set("arrival_date", e.target.value)} required />
        </div>
        <div>
          <label className="text-xs tracking-architectural uppercase text-foreground/50">Salida</label>
          <input type="date" className={field} value={form.departure_date} onChange={(e) => set("departure_date", e.target.value)} required />
        </div>
        <div>
          <label className="text-xs tracking-architectural uppercase text-foreground/50">N° de personas</label>
          <input type="number" min="1" className={field} value={form.guests} onChange={(e) => set("guests", Number(e.target.value))} required />
        </div>
      </div>
      <div>
        <label className="text-xs tracking-architectural uppercase text-foreground/50">Mensaje (opcional)</label>
        <textarea className={field} rows={3} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Cuéntanos sobre tu estadía o evento" />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-accent-foreground tracking-architectural uppercase text-sm hover:bg-accent/90 transition-colors disabled:opacity-60"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enviar solicitud"}
      </button>
    </form>
  );
}
