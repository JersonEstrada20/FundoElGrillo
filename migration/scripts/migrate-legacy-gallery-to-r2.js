/**
 * Copia la galería histórica desde el sitio anterior hacia R2.
 * Mantiene las imágenes bajo legacy-gallery/ para que el sitio público no
 * dependa de la disponibilidad del dominio anterior.
 *
 * Ejecutar desde migration/scripts: node migrate-legacy-gallery-to-r2.js
 */
require("dotenv").config();
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");

const accountId = (process.env.R2_ACCOUNT_ID || "").trim();
const accessKeyId = (process.env.R2_ACCESS_KEY_ID || "").trim();
const secretAccessKey = (process.env.R2_SECRET_ACCESS_KEY || "").trim();
const bucket = (process.env.R2_BUCKET || "fundo-el-grillo").trim();

if (!accountId || !accessKeyId || !secretAccessKey) {
  throw new Error("Faltan las credenciales de R2 en migration/scripts/.env");
}

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  forcePathStyle: true,
  credentials: { accessKeyId, secretAccessKey },
});

const html = fs.readFileSync(path.resolve(__dirname, "../../temp-nosotros.html"), "utf8");
const names = [...new Set([...html.matchAll(/<img src="\/images\/galerias\/nosotros\/([^"]+)"/g)].map((match) => match[1]))];

async function run() {
  console.log(`Migrando ${names.length} imágenes históricas...`);
  const failures = [];
  await Promise.all(names.map(async (name, index) => {
    const source = `https://xn--cabaasfundoelgrillo-y3b.cl/images/galerias/nosotros/${encodeURIComponent(name)}`;
    try {
      const response = await fetch(source);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const body = new Uint8Array(await response.arrayBuffer());
      await s3.send(new PutObjectCommand({
        Bucket: bucket,
        Key: `legacy-gallery/${name}`,
        Body: body,
        ContentType: response.headers.get("content-type") || "image/jpeg",
      }));
      console.log(`[${index + 1}/${names.length}] ${name}`);
    } catch (error) {
      failures.push(`${name}: ${error.message}`);
      console.error(`Error al migrar ${name}: ${error.message}`);
    }
  }));
  if (failures.length) {
    throw new Error(`No se pudieron migrar ${failures.length} imágenes:\n${failures.join("\n")}`);
  }
  console.log("Galería histórica migrada correctamente a R2.");
}

run();
