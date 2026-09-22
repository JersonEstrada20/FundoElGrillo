/**
 * Script de importación de datos: JSON → Supabase
 *
 * Toma los JSON exportados por export-data.js y los inserta en Supabase.
 *
 * Uso:
 *   cd migration/scripts
 *   npm install @supabase/supabase-js dotenv
 *   node import-data-to-supabase.js
 */

require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Faltan VITE_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const outputDir = path.join(__dirname, "exported-data");

// ============================================================
// Importar
// ============================================================
async function importAll() {
  // ---- Cabin ----
  await importTable("cabins.json", "cabin", (r) => ({
    name: r.name,
    type: r.type || "cabaña",
    description: r.description,
    capacity: r.capacity,
    rooms: r.rooms,
    pool: r.pool,
    high_season_price: r.high_season_price,
    low_season_price: r.low_season_price,
    sector: r.sector,
    images: r.images || [],
    is_active: r.is_active !== false,
    order: r.order || 0,
    created_date: r.created_date,
    updated_date: r.updated_date,
  }));

  // ---- BookingRequest ----
  await importTable("booking-requests.json", "booking_request", (r) => ({
    name: r.name,
    email: r.email,
    phone: r.phone,
    cabin: r.cabin,
    arrival_date: r.arrival_date,
    departure_date: r.departure_date,
    guests: r.guests,
    message: r.message,
    status: r.status || "pendiente",
    created_date: r.created_date,
    updated_date: r.updated_date,
  }));

  // ---- VisitorEntry ----
  await importTable("visitor-entries.json", "visitor_entry", (r) => ({
    cabin: r.cabin,
    entry_date: r.entry_date,
    check_in_time: r.check_in_time,
    check_out_time: r.check_out_time,
    people: r.people || [],
    signature_url: r.signature_url,
    notes: r.notes,
    created_date: r.created_date,
    updated_date: r.updated_date,
  }));

  console.log("\n✅ Importación completada");
}

async function importTable(filename, tableName, mapFn) {
  const filePath = path.join(outputDir, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${filename} no encontrado — saltando`);
    return;
  }

  const records = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  if (!records || records.length === 0) {
    console.log(`⚠️  ${filename} vacío — saltando`);
    return;
  }

  console.log(`Importando ${records.length} registros → ${tableName}...`);

  // Insertar en lotes de 100
  const batchSize = 100;
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize).map(mapFn);
    const { error } = await supabase.from(tableName).insert(batch);
    if (error) {
      console.error(`  ERROR en lote ${i / batchSize + 1}: ${error.message}`);
    } else {
      console.log(`  Lote ${i / batchSize + 1} OK (${batch.length} registros)`);
    }
  }
}

importAll().catch(console.error);