/**
 * Script de exportación de datos: Base44 → JSON
 *
 * Descarga todas las entidades desde Base44 y las guarda como JSON
 * para luego importarlas a Supabase.
 *
 * Uso:
 *   cd migration/scripts
 *   node export-data.js
 *
 * Requiere: VITE_SUPABASE_URL y el token de Base44 en el localStorage del navegador.
 * Como alternativa, exporta manualmente desde el panel de admin de Base44.
 */

const fs = require("fs");
const path = require("path");

// ============================================================
// CONFIGURACIÓN — reemplaza con tus valores
// ============================================================
const BASE44_APP_ID = "6ab198431b520d2f22e78e1a";
// Obtén este token desde el panel de admin de Base44 (Network tab → Authorization header)
const BASE44_TOKEN = process.env.BASE44_TOKEN || "PON_AQUI_TU_TOKEN";

const API = `https://base44.app/api/apps/${BASE44_APP_ID}`;

const entities = [
  { name: "Cabin", file: "cabins.json" },
  { name: "BookingRequest", file: "booking-requests.json" },
  { name: "VisitorEntry", file: "visitor-entries.json" },
  { name: "User", file: "users.json" },
];

async function exportAll() {
  const outputDir = path.join(__dirname, "exported-data");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  for (const ent of entities) {
    try {
      console.log(`Exportando ${ent.name}...`);
      const resp = await fetch(`${API}/entities/${ent.name}`, {
        headers: {
          "Authorization": `Bearer ${BASE44_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (!resp.ok) {
        console.error(`  ERROR: HTTP ${resp.status}`);
        continue;
      }

      const data = await resp.json();
      const records = data.data || data || [];
      fs.writeFileSync(
        path.join(outputDir, ent.file),
        JSON.stringify(records, null, 2)
      );
      console.log(`  ✅ ${records.length} registros → ${ent.file}`);
    } catch (e) {
      console.error(`  ERROR: ${e.message}`);
    }
  }

  console.log(`\n📄 Datos exportados en: ${outputDir}/`);
  console.log(`\nAhora importa a Supabase con: node import-data-to-supabase.js`);
}

exportAll().catch(console.error);