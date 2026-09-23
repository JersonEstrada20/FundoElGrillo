import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { formatCLP } from "@/lib/cabins";
import { withCatalogImagesList } from "@/lib/cabinMedia";
import PhotoUploader from "@/components/admin/PhotoUploader";
import { Pencil, Trash2, X, Loader2, Save, BedDouble, Building2 } from "lucide-react";
import MobileSelect from "@/components/admin/MobileSelect";

const sectors = ["Area De Acceso", "Espacio Central", "Sector Bosque Nativo", "Club House"];

const empty = (type = "cabaña") => ({
  name: "", type, description: "", capacity: "", rooms: "", pool: "",
  high_season_price: null, low_season_price: null, sector: "",
  images: [], is_active: true, order: 0,
});

export default function CabanasAdmin() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("todos");

  const load = () => {
    setLoading(true);
    base44.entities.Cabin.list("order", 200)
      .then((data) => setItems(withCatalogImagesList(data)))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = filter === "todos" ? items : items.filter((i) => i.type === filter);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      // Solo se envían columnas reales de la tabla cabin. En especial, no
      // enviar `desc`, que pertenecía al catálogo antiguo y Supabase rechaza.
      const {
        id, created_date, updated_date, created_by_id, desc,
        ...data
      } = editing;
      if (!data.high_season_price) data.high_season_price = null;
      if (!data.low_season_price) data.low_season_price = null;
      if (!data.order) data.order = 0;
      if (id) {
        await base44.entities.Cabin.update(id, data);
      } else {
        await base44.entities.Cabin.create(data);
      }
      setEditing(null);
      load();
    } catch (err) {
      setError(err?.message || "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item) => {
    if (!confirm(`¿Eliminar "${item.name}"?`)) return;
    try {
      await base44.entities.Cabin.delete(item.id);
      load();
    } catch (err) {
      alert("No se pudo eliminar: " + (err?.message || ""));
    }
  };

  const update = (field, value) => setEditing((prev) => ({ ...prev, [field]: value }));

  if (!isAdmin) {
    return <p className="text-foreground/60">Solo los administradores pueden gestionar cabañas.</p>;
  }

  const inputCls = "w-full bg-background border border-border px-3 py-2.5 text-sm focus:border-accent focus:outline-none transition-colors min-h-11 md:min-h-0";
  const labelCls = "text-xs tracking-architectural uppercase text-foreground/50 block mb-2";

  // ===== FORM VIEW =====
  if (editing) {
    const isCabin = editing.type === "cabaña";
    return (
      <div>
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="font-display text-4xl">{editing.id ? "Editar" : "Nueva"} {isCabin ? "cabaña" : "salón"}</h1>
            <p className="text-foreground/60 mt-2">Completa los datos y sube las fotos desde tu dispositivo.</p>
          </div>
          <button onClick={() => setEditing(null)} className="p-2 hover:text-accent transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={save} className="space-y-6">
          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <label className={labelCls}>Nombre</label>
              <input className={inputCls} value={editing.name} onChange={(e) => update("name", e.target.value)} required />
            </div>
            <div>
              <label className={labelCls}>Tipo</label>
              <MobileSelect
                value={editing.type}
                onChange={(v) => update("type", v)}
                options={[{ value: "cabaña", label: "Cabaña" }, { value: "salón", label: "Salón de eventos" }]}
                placeholder="Tipo"
                className={inputCls}
              />
            </div>
            {isCabin && (
              <div>
                <label className={labelCls}>Sector</label>
                <MobileSelect
                  value={editing.sector || ""}
                  onChange={(v) => update("sector", v)}
                  options={[{ value: "", label: "Sin sector" }, ...sectors.map((s) => ({ value: s, label: s }))]}
                  placeholder="Sector"
                  className={inputCls}
                />
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <label className={labelCls}>Capacidad</label>
              <input className={inputCls} placeholder="6 personas" value={editing.capacity || ""} onChange={(e) => update("capacity", e.target.value)} />
            </div>
            {isCabin && (
              <>
                <div>
                  <label className={labelCls}>Dormitorios / Ambientes</label>
                  <input className={inputCls} placeholder="2 dormitorios" value={editing.rooms || ""} onChange={(e) => update("rooms", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Piscina</label>
                  <input className={inputCls} placeholder="Piscina compartida" value={editing.pool || ""} onChange={(e) => update("pool", e.target.value)} />
                </div>
              </>
            )}
          </div>

          {isCabin && (
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Precio temporada alta (CLP)</label>
                <input type="number" className={inputCls} placeholder="110000" value={editing.high_season_price || ""} onChange={(e) => update("high_season_price", e.target.value ? Number(e.target.value) : null)} />
              </div>
              <div>
                <label className={labelCls}>Precio temporada baja (CLP)</label>
                <input type="number" className={inputCls} placeholder="90000" value={editing.low_season_price || ""} onChange={(e) => update("low_season_price", e.target.value ? Number(e.target.value) : null)} />
              </div>
            </div>
          )}

          <div>
            <label className={labelCls}>Descripción</label>
            <textarea className={inputCls} rows={3} value={editing.description || ""} onChange={(e) => update("description", e.target.value)} placeholder="Descripción del lugar..." />
          </div>

          <div>
            <label className={labelCls}>Fotos (sube desde tu dispositivo)</label>
            <PhotoUploader images={editing.images || []} onChange={(imgs) => update("images", imgs)} />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={editing.is_active !== false} onChange={(e) => update("is_active", e.target.checked)} className="w-4 h-4" />
              <span className="text-sm">Activa / visible en el sitio</span>
            </label>
            <div>
              <label className={labelCls}>Orden</label>
              <input type="number" className={`${inputCls} w-24`} value={editing.order || 0} onChange={(e) => update("order", Number(e.target.value) || 0)} />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-3 sticky bottom-4 bg-background/95 backdrop-blur p-4 border border-border">
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-accent-foreground text-sm tracking-architectural uppercase hover:bg-accent/90 transition-colors disabled:opacity-40">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Guardar
            </button>
            <button type="button" onClick={() => setEditing(null)} className="px-6 py-3 border border-border text-sm tracking-architectural uppercase hover:bg-muted transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ===== LIST VIEW =====
  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Cabañas y salones</h1>
          <p className="text-foreground/60 mt-2">Gestiona las cabañas, salones de eventos, precios y fotos.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setEditing(empty("cabaña"))} className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-accent-foreground text-sm tracking-architectural uppercase hover:bg-accent/90 transition-colors">
            <BedDouble className="w-4 h-4" /> Nueva cabaña
          </button>
          <button onClick={() => setEditing(empty("salón"))} className="inline-flex items-center gap-2 px-5 py-2.5 border border-accent text-accent text-sm tracking-architectural uppercase hover:bg-accent hover:text-accent-foreground transition-colors">
            <Building2 className="w-4 h-4" /> Nuevo salón
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {["todos", "cabaña", "salón"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 text-sm tracking-architectural uppercase border transition-colors ${filter === f ? "bg-foreground text-background border-foreground" : "border-border text-foreground/70 hover:border-foreground"}`}>
            {f === "todos" ? "Todos" : f === "cabaña" ? "Cabañas" : "Salones"}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-foreground/50">Cargando…</p>
      ) : filtered.length === 0 ? (
        <p className="text-foreground/50 border border-border p-6">No hay registros. Crea una nueva cabaña o salón.</p>
      ) : (
        <div className="border border-border divide-y divide-border">
          {filtered.map((item) => (
            <div key={item.id} className="p-4 flex items-center gap-4">
              <div className="w-16 h-16 flex-shrink-0 overflow-hidden bg-muted">
                {item.images?.[0] ? <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-foreground/20"><BedDouble className="w-6 h-6" /></div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{item.name}</p>
                  <span className="text-xs px-2 py-0.5 bg-muted tracking-architectural uppercase">{item.type}</span>
                  {item.is_active === false && <span className="text-xs px-2 py-0.5 bg-destructive/10 text-destructive">Inactiva</span>}
                </div>
                <p className="text-sm text-foreground/50 truncate">
                  {item.capacity || "—"}
                  {item.type === "cabaña" && item.high_season_price ? ` · ${formatCLP(item.high_season_price)}` : ""}
                  {item.sector ? ` · ${item.sector}` : ""}
                  {` · ${item.images?.length || 0} foto(s)`}
                </p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEditing({ ...item })} className="p-2 text-foreground/50 hover:text-accent transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => remove(item)} className="p-2 text-foreground/50 hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
