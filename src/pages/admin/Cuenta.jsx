import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { AlertTriangle, Loader2, Trash2, Check } from "lucide-react";

export default function Cuenta() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      await base44.functions.invoke("deleteAccount", {});
      setDone(true);
      setTimeout(() => {
        logout(false);
        navigate("/");
      }, 3000);
    } catch (err) {
      setError(err?.message || "No se pudo eliminar la cuenta.");
      setDeleting(false);
    }
  };

  if (done) {
    return (
      <div className="max-w-xl">
        <div className="border border-border bg-card p-10 text-center">
          <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-chart-1/10 flex items-center justify-center">
            <Check className="w-7 h-7 text-chart-1" />
          </div>
          <h1 className="font-display text-3xl mb-2">Cuenta eliminada</h1>
          <p className="text-foreground/70">
            Tu cuenta y datos asociados han sido eliminados. Serás redirigido al sitio público.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h1 className="font-display text-4xl">Mi cuenta</h1>
        <p className="text-foreground/60 mt-2">Gestiona tu cuenta y datos personales.</p>
      </div>

      <div className="border border-border bg-card p-6 mb-8">
        <h2 className="font-display text-xl mb-4">Información de la cuenta</h2>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-foreground/50">Nombre</dt>
            <dd>{user?.full_name || "—"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-foreground/50">Correo</dt>
            <dd>{user?.email || "—"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-foreground/50">Rol</dt>
            <dd className="uppercase tracking-architectural text-xs">{user?.role || "—"}</dd>
          </div>
        </dl>
      </div>

      <div className="border border-destructive/30 bg-destructive/5 p-6">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="font-display text-xl text-destructive">Eliminar cuenta</h2>
            <p className="text-sm text-foreground/70 mt-1">
              Esta acción eliminará permanentemente tu cuenta y todos los registros de ingresos que hayas creado. Esta acción no se puede deshacer.
            </p>
          </div>
        </div>

        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-destructive text-destructive text-sm tracking-architectural uppercase hover:bg-destructive hover:text-destructive-foreground transition-colors select-none"
          >
            <Trash2 className="w-4 h-4" /> Eliminar mi cuenta
          </button>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-foreground/70">
              Para confirmar, escribe <strong>ELIMINAR</strong> en el campo de abajo:
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="ELIMINAR"
              className="w-full bg-background border border-border px-3 py-2.5 text-sm focus:border-destructive focus:outline-none"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={confirmText !== "ELIMINAR" || deleting}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-destructive text-destructive-foreground text-sm tracking-architectural uppercase hover:bg-destructive/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed select-none"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Confirmar eliminación
              </button>
              <button
                onClick={() => {
                  setConfirming(false);
                  setConfirmText("");
                  setError("");
                }}
                className="px-5 py-2.5 border border-border text-sm text-foreground/60 hover:text-foreground transition-colors select-none"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}