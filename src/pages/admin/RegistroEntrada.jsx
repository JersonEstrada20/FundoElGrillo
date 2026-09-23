import React, { useState, useRef, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
// Cabin options loaded from DB
import { formatRut, isValidRut } from "@/lib/rut";
import { UserPlus, Trash2, Save, Loader2, Check, Car, AlertTriangle, Clock, PenLine } from "lucide-react";
import SignaturePad from "@/components/SignaturePad";
import MobileSelect from "@/components/admin/MobileSelect";

const emptyPerson = () => ({ full_name: "", doc_type: "rut", rut: "", phone: "", plate: "", nationality: "Chilena" });

const nationalities = ["Chilena", "Argentina", "Peruana", "Boliviana", "Colombiana", "Venezolana", "Ecuatoriana", "Brasileña", "Uruguaya", "Paraguaya", "Mexicana", "Española", "Estadounidense", "Otra"];

export default function RegistroEntrada() {
  const [cabin, setCabin] = useState("");
  const [entryDate, setEntryDate] = useState(new Date().toISOString().slice(0, 10));
  const [checkInTime, setCheckInTime] = useState("");
  const [people, setPeople] = useState([emptyPerson()]);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(null);
  const [error, setError] = useState("");
  const [existingEntries, setExistingEntries] = useState([]);
  const [, setHasSignature] = useState(false);
  const [confirmOccupied, setConfirmOccupied] = useState(false);
  const [cabinOptions, setCabinOptions] = useState([]);
  const firstFieldRef = useRef(null);
  const signatureRef = useRef(null);

  useEffect(() => {
    base44.entities.VisitorEntry.list("-created_date", 500).then(setExistingEntries).catch(() => {});
    base44.entities.Cabin.list("order", 200).then((all) => {
      setCabinOptions(all.filter((c) => c.is_active !== false).map((c) => c.name));
    }).catch(() => {});
  }, []);

  // Patentes ya registradas anteriormente (para alertar visitantes recurrentes)
  const knownPlates = useMemo(() => {
    const set = new Set();
    existingEntries.forEach((e) => {
      (e.people || []).forEach((p) => {
        if (p.plate) set.add(p.plate.toUpperCase().replace(/\s/g, ""));
      });
    });
    return set;
  }, [existingEntries]);

  const isPlateKnown = (plate) => {
    const clean = (plate || "").toUpperCase().replace(/\s/g, "");
    return clean && knownPlates.has(clean);
  };

  // Verifica si la cabaña seleccionada ya tiene huéspedes dentro (entrada sin salida)
  const cabinOccupied = useMemo(() => {
    if (!cabin) return null;
    return existingEntries.find(
      (e) => e.cabin === cabin && e.check_in_time && !e.check_out_time
    );
  }, [cabin, existingEntries]);

  const updatePerson = (i, field, value) => {
    setPeople((prev) => prev.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)));
  };

  const formatRutField = (i, value) => {
    if (!value) return;
    setPeople((prev) => {
      if (prev[i]?.doc_type !== "rut") return prev;
      return prev.map((p, idx) => (idx === i ? { ...p, rut: formatRut(value) } : p));
    });
  };

  const addPerson = () => {
    setPeople((prev) => [...prev, emptyPerson()]);
    setTimeout(() => {
      if (firstFieldRef.current) firstFieldRef.current.focus();
    }, 50);
  };

  const removePerson = (i) => {
    setPeople((prev) => prev.filter((_, idx) => idx !== i));
  };

  const docErrors = people.map((p) => {
    if (!p.rut) return "";
    if (p.doc_type === "rut" && !isValidRut(p.rut)) return "RUT inválido";
    return "";
  });
  const valid =
    people.length > 0 &&
    people.every((p) => !p.rut || p.doc_type !== "rut" || isValidRut(p.rut)) &&
    cabin &&
    entryDate &&
    (!cabinOccupied || confirmOccupied);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    // Optimistic: show done state immediately with known data
    setDone({ cabin, entry_date: entryDate, check_in_time: checkInTime || undefined, people, notes, signature_url: null });
    setSaving(true);
    try {
      let signature_url;
      const sigBlob = await signatureRef.current?.toBlob();
      if (sigBlob) {
        const sigFile = new File([sigBlob], `firma-${Date.now()}.png`, { type: "image/png" });
        const upload = await base44.integrations.Core.UploadPublicFile({ file: sigFile });
        signature_url = upload.file_url;
      }
      const record = await base44.entities.VisitorEntry.create({
        cabin,
        entry_date: entryDate,
        check_in_time: checkInTime || undefined,
        people,
        notes,
        signature_url,
      });
      setDone(record);
    } catch (err) {
      setError(err?.message || "No se pudo guardar el registro.");
      setDone(null);
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setDone(null);
    setCabin("");
    setEntryDate(new Date().toISOString().slice(0, 10));
    setCheckInTime("");
    setPeople([emptyPerson()]);
    setNotes("");
    setHasSignature(false);
    setConfirmOccupied(false);
  };

  if (done) {
    return (
      <div className="max-w-xl">
        <div className="border border-border bg-card p-10">
          <div className="w-14 h-14 mb-5 rounded-full bg-accent/10 flex items-center justify-center">
            <Check className="w-7 h-7 text-accent" />
          </div>
          <h1 className="font-display text-3xl mb-2">Ingreso registrado</h1>
          <p className="text-foreground/70 mb-6">
            Se registraron <strong>{done.people.length}</strong> persona(s) en{" "}
            <strong>{done.cabin}</strong> para el{" "}
            <strong>{done.entry_date}</strong>.
            {done.check_in_time && <> a las <strong>{done.check_in_time}</strong></>}
          </p>
          <div className="border-t border-border pt-5 space-y-2">
            {done.people.map((p, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{p.full_name}</span>
                <span className="text-foreground/50">{p.plate || "Sin vehículo"}</span>
              </div>
            ))}
          </div>
          {done.signature_url && (
            <div className="border-t border-border pt-5 mt-5">
              <p className="text-xs tracking-architectural uppercase text-foreground/40 mb-2">Firma registrada</p>
              <img src={done.signature_url} alt="Firma" className="max-h-24 border border-border p-2 bg-background" />
            </div>
          )}
          {saving && (
            <p className="mt-4 text-sm text-foreground/50 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Guardando registro…
            </p>
          )}
          <button onClick={reset} disabled={saving} className="mt-8 px-6 py-3 bg-accent text-accent-foreground text-sm tracking-architectural uppercase hover:bg-accent/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            Registrar otro ingreso
          </button>
        </div>
      </div>
    );
  }

  const inputCls = "w-full bg-background border border-border px-3 py-2.5 text-sm focus:border-accent focus:outline-none transition-colors min-h-11 md:min-h-0";

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl">Registrar ingreso</h1>
        <p className="text-foreground/60 mt-2">
          Ingresa los datos del grupo. Usa <kbd className="px-1.5 py-0.5 bg-muted border border-border text-xs">Tab</kbd> para moverte entre campos y agrega acompañantes con el botón.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-8">
        {/* Asignación */}
        <div className="grid md:grid-cols-3 gap-5">
          <div>
            <label className="text-xs tracking-architectural uppercase text-foreground/50 block mb-2">Cabaña asignada</label>
            <MobileSelect
              value={cabin}
              onChange={setCabin}
              options={[{ value: "", label: "Selecciona una cabaña" }, ...cabinOptions.map((c) => ({ value: c, label: c }))]}
              placeholder="Selecciona una cabaña"
              className={inputCls}
            />
            {cabinOccupied && (
              <div className="mt-2 p-3 bg-destructive/10 border border-destructive/30 text-sm">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-destructive font-medium">Cabaña con huéspedes dentro</p>
                    <p className="text-foreground/70 text-xs mt-0.5">
                      {cabinOccupied.people?.[0]?.full_name || "Grupo"} ingresó a las{" "}
                      {cabinOccupied.check_in_time} y no ha registrado salida.
                    </p>
                  </div>
                </div>
                <label className="mt-2 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmOccupied}
                    onChange={(e) => setConfirmOccupied(e.target.checked)}
                    className="w-4 h-4 accent-accent"
                  />
                  <span className="text-xs text-foreground/70">Confirmo que verificé y es correcto registrar otro grupo</span>
                </label>
              </div>
            )}
          </div>
          <div>
            <label className="text-xs tracking-architectural uppercase text-foreground/50 block mb-2">Fecha de ingreso</label>
            <input type="date" className={inputCls} value={entryDate} onChange={(e) => setEntryDate(e.target.value)} required />
          </div>
          <div>
            <label className="text-xs tracking-architectural uppercase text-foreground/50 block mb-2 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Hora de entrada
            </label>
            <input type="time" className={inputCls} value={checkInTime} onChange={(e) => setCheckInTime(e.target.value)} />
          </div>
        </div>

        {/* Matriz de personas */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-2xl">
              Personas del grupo <span className="text-foreground/40 text-base">({people.length})</span>
            </h2>
            <button type="button" onClick={addPerson} className="inline-flex items-center gap-2 px-4 py-2 border border-accent text-accent text-sm tracking-architectural uppercase hover:bg-accent hover:text-accent-foreground transition-colors">
              <UserPlus className="w-4 h-4" /> Agregar persona
            </button>
          </div>

          <div className="border border-border">
            {/* Header */}
            <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-2 bg-muted text-xs tracking-architectural uppercase text-foreground/50">
              <div className="col-span-3">Nombre y apellido</div>
              <div className="col-span-2">Documento</div>
              <div className="col-span-2">Celular</div>
              <div className="col-span-2">Patente</div>
              <div className="col-span-2">Nacionalidad</div>
              <div className="col-span-1"></div>
            </div>
            <div className="divide-y divide-border">
              {people.map((p, i) => {
                const plateKnown = isPlateKnown(p.plate);
                return (
                  <div key={i} className="grid md:grid-cols-12 gap-2 px-4 py-3 items-start">
                    <div className="md:col-span-3">
                      <input
                        ref={i === 0 ? firstFieldRef : null}
                        className={inputCls}
                        placeholder="Nombre y apellido"
                        value={p.full_name}
                        onChange={(e) => updatePerson(i, "full_name", e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <div className="space-y-1.5">
                        <MobileSelect
                          value={p.doc_type || "rut"}
                          onChange={(v) => updatePerson(i, "doc_type", v)}
                          options={[
                            { value: "rut", label: "RUT" },
                            { value: "pasaporte", label: "Pasaporte" },
                            { value: "otro", label: "Otro" },
                          ]}
                          placeholder="Tipo doc"
                          className={`${inputCls} py-1.5 text-xs`}
                        />
                        <input
                          className={`${inputCls} ${docErrors[i] ? "border-destructive" : ""}`}
                          placeholder={p.doc_type === "pasaporte" ? "N° pasaporte" : p.doc_type === "otro" ? "N° documento" : "12.345.678-9"}
                          value={p.rut}
                          onChange={(e) => updatePerson(i, "rut", e.target.value)}
                          onBlur={(e) => formatRutField(i, e.target.value)}
                        />
                        {docErrors[i] && <p className="text-xs text-destructive mt-1">{docErrors[i]}</p>}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <input className={inputCls} placeholder="+56 9 1234 5678" value={p.phone} onChange={(e) => updatePerson(i, "phone", e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                      <input className={`${inputCls} font-mono uppercase tracking-wider`} placeholder="AB CD 12" value={p.plate} onChange={(e) => updatePerson(i, "plate", e.target.value.toUpperCase())} />
                      {p.plate && (
                        <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-1 bg-foreground text-background font-mono text-xs tracking-widest">
                          <Car className="w-3 h-3" /> {p.plate}
                        </div>
                      )}
                      {plateKnown && (
                        <p className="text-xs text-accent mt-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Patente ya registrada antes
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <MobileSelect
                        value={p.nationality}
                        onChange={(v) => updatePerson(i, "nationality", v)}
                        options={nationalities}
                        placeholder="Nacionalidad"
                        className={inputCls}
                      />
                    </div>
                    <div className="md:col-span-1 flex justify-end">
                      {people.length > 1 && (
                        <button type="button" onClick={() => removePerson(i)} className="p-2 text-foreground/40 hover:text-destructive transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Observaciones */}
        <div>
          <label className="text-xs tracking-architectural uppercase text-foreground/50 block mb-2">Observaciones</label>
          <textarea className={inputCls} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notas internas sobre este ingreso" />
        </div>

        {/* Firma del grupo */}
        <div>
          <label className="text-xs tracking-architectural uppercase text-foreground/50 block mb-2 flex items-center gap-1">
            <PenLine className="w-3 h-3" /> Firma del titular (una por grupo)
          </label>
          <SignaturePad ref={signatureRef} onChange={setHasSignature} />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-3 sticky bottom-4 bg-background/95 backdrop-blur p-4 border border-border">
          <button type="submit" disabled={!valid || saving} className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-accent-foreground text-sm tracking-architectural uppercase hover:bg-accent/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Guardar registro
          </button>
          <span className="text-xs text-foreground/50 self-center">
            {valid ? "Listo para guardar" : "Selecciona la cabaña y fecha de ingreso"}
          </span>
        </div>
      </form>
    </div>
  );
}
