/**
 * Script de migración de imágenes: Base44 → Cloudflare R2
 *
 * Uso:
 *   cd migration/scripts
 *   npm install @aws-sdk/client-s3
 *   node migrate-images-to-r2.js
 *
 * Genera: image-url-mapping.json con las URLs nuevas para buscar y reemplazar en el código.
 */

require("dotenv").config();
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");

// ============================================================
// Configuración desde .env
// ============================================================
const R2_ACCOUNT_ID = (process.env.R2_ACCOUNT_ID || "").trim();
const R2_ACCESS_KEY_ID = (process.env.R2_ACCESS_KEY_ID || "").trim();
const R2_SECRET_ACCESS_KEY = (process.env.R2_SECRET_ACCESS_KEY || "").trim();
const R2_BUCKET = (process.env.R2_BUCKET || "fundo-el-grillo").trim();
const R2_PUBLIC_URL = (process.env.R2_PUBLIC_URL || "").trim();

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.error("Faltan variables de entorno R2. Crea un .env con R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY");
  process.exit(1);
}

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  forcePathStyle: true,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

// ============================================================
// Todas las URLs de imágenes en Base44 que hay que migrar
// (extraídas de cabins.js, Galeria.jsx, Home.jsx, ElFundo.jsx, Eventos.jsx)
// ============================================================
const BASE44_PREFIX = "https://base44.app/api/apps/6ab198431b520d2f22e78e1a/files/mp/public/6ab198431b520d2f22e78e1a";

const imageFiles = [
  // Cabañas (ya en Base44)
  "bed56be4b_boldo-1.jpg", "2e0f3133d_boldo-2.jpg", "88e4f71ba_boldo-3.jpg", "f8756203b_boldo-4.jpg",
  "217483da6_capilla-1.jpg", "b0eddf5c2_capilla-2.jpg", "45488ff99_capilla-3.jpg", "0874e88d2_capilla-4.jpg",
  "b1b0b7145_arrayan-1.jpg", "2164989e3_arrayan-2.jpg", "2a6bac421_arrayan-3.jpg", "3223838f1_arrayan-4.jpg",
  "2ae5d2e27_barro-1.jpg", "704604d80_barro-2.jpg", "47aebad91_barro-3.jpg", "5f7209a2c_barro-4.jpg",
  "65f357ea7_cerro-1.jpg", "d56e207e4_cerro-2.jpg", "b16715962_cerro-3.jpg", "d5599cd07_cerro-4.jpg",
  "81c3e69c4_chincol-1.jpg", "c8a2e949c_chincol-2.jpg", "283045bf1_chincol-3.jpg", "7a93638bd_chincol-4.jpg",
  "655ef386b_colibri-1.jpg", "592568e09_colibri-2.jpg", "2a94c1350_colibri-3.jpg", "ad31f5774_colibri-4.jpg",
  "d40b65945_ecologica-1.jpg", "03739a536_ecologica-2.jpg", "e1d1b10cd_ecologica-3.jpg", "e1db26277_ecologica-4.jpg",
  "4c8352722_honeymoon-1.jpg", "63733d037_honeymoon-2.jpg", "c89fb43ec_honeymoon-3.jpg", "cfe10d4e8_honeymoon-4.jpg",
  "bc6366f02_iglesia1-1.jpg", "51d483aa4_iglesia1-2.jpg", "7f50b387a_iglesia1-3.jpg", "cea124ac2_iglesia1-4.jpg",
  "0e377fab6_iglesia2-1.jpg", "9ed4995f4_iglesia2-2.jpg", "46996d554_iglesia2-3.jpg", "012b9c786_iglesia2-4.jpg",
  "930253e6c_loica-1.jpg", "961a4002d_loica-2.jpg", "8a7ba3f6c_loica-3.jpg", "ba38199c6_loica-4.jpg",
  "44765e55a_monasterio-1.jpg", "f2e77a6cd_monasterio-2.jpg",
  // Migradas de la página anterior
  "b1c86bc39_Monasterio-13-9f8e999e09ab6f407f1d639bad6707bd.jpg",
  "18828050e_Monasterio-9-4791bdc0fd6853686d23911fb2729897.jpg",
  "426a23a44_Naranjal-1-17.jpg", "0aca295d9_Naranjal-1-7-5d4f9a4f7fa0122a6ebbab605467d6e2.jpg",
  "2977c63a3_Naranjal-1-19-86eb8db8a12ef62c90126f11a9957528.jpg", "20f05926e_Naranjal-1-21-f6012a6dfe45e92cdd109150758887ba.jpg",
  "dd2abd342_Naranjal-2-14.jpg", "227b94778_Naranjal-2-13-d2149099a6a3838acb5edbfcc504c086.jpg",
  "86a038a60_Naranjal-2-8-f4749f571ceb2e467c84edcb34a60482.jpg", "0b72596c0_Naranjal-2-10-429c5bc9289cf831b0072482b3fc8597.jpg",
  "18f076b2c_Orgnica-15.jpg", "797d3d0e4_Orgnica-18-840aeeea771fd61c8633d9fea8cfdc0e.jpg",
  "8e626216d_Orgnica-4-b3564c928281f8aae8f596104b1d17e8.jpg", "d345bf3b3_Orgnica-11-c7fa9be7f40e258fc65194ad10d2481f.jpg",
  // Salones y galería home
  "10b57c29c_YUNC0020b.jpg", "7a4a85385_quincho1.jpg",
  "9c94d72e6_DSC_8191.jpg", "ee2f8502e_DSC_8064.jpg", "ba7794f1a_DSC_8238.jpg", "bf79c5ba8_DSC_0960.jpg",
  // Home
  "8982de563_mariana2.jpg", "4a50e1996_signature.png", "6a37a0352_DSC_0985.jpg",
  // Galería
  "a642c8897_granja_7.jpg", "8226adcf4_granja_8.jpg", "07b1e1d0d_granja_10.jpg", "9ec93ffac_granja_3.jpg", "cce7bd6d8_granja_6.jpg",
  "8d5e07e1a_animales9.jpg", "5fb6fbbc4_animales1.jpg",
  "2ea31ef5d_jardin8.jpg", "981264b10_jardin2.jpg", "33d5023da_jardin9.jpg", "a9c7f127b_jardin15.jpg",
  "9c5c14598_jardin20.jpg", "c5f7ccfb3_jardin16.jpg", "afb24a4f0_jardin23.jpg", "f27053945_jardin11.jpg",
  "be616b14c_jardin18.jpg", "8c9b1e82a_jardin17.jpg", "10ff0471f_jardin24.jpg", "250f6bc8c_jardin25.jpg",
  "797000476_DSC_0215.jpg", "7800eb222_DSC_0573.jpg", "a88682ad2_DSC_0708.jpg", "4ae89ed54_DSC_0639.jpg",
  "09fc7dd23_DSC_0607.jpg", "104b70bf7_DSC_0718.jpg", "5868285f6_DSC_0381.jpg", "a1fb25d2b_DSC_0730.jpg",
  "ebe168671_DSC_0671.jpg", "97bf19083_DSC_0584.jpg", "5df60fdfa_DSC_0591.jpg", "65141c0f1_DSC_0612.jpg",
  "cfb98f988_DSC_0599.jpg", "e57baae71_DSC_0218.jpg", "d8aa69fd1_DSC_0464.jpg", "fe897790f_DSC_0307.jpg",
  "b7a1666b7_DSC_0627.jpg", "0c4e8bf3f_grillo-95.jpg", "6cb6b4811_grillo-57.jpg", "92df81177_g4.jpg",
  "c7408f458_g8.jpg", "92fcf52e8_general4.jpg",
  "4adb734d5_YUNC0005.jpg", "9f6fade58_YUNC0019.jpg", "9770be25f_YUNC0010.jpg", "96b57a135_YUNC0013.jpg",
];

// ============================================================
// Migrar
// ============================================================
async function migrate() {
  const mapping = {};
  let count = 0;
  let errors = 0;

  for (const filename of imageFiles) {
    const oldUrl = `${BASE44_PREFIX}/${filename}`;
    const r2Key = filename; // mismo nombre en R2

    try {
      console.log(`[${count + 1}/${imageFiles.length}] ${filename}`);
      const resp = await fetch(oldUrl);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const buffer = await resp.arrayBuffer();

      await s3.send(new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: r2Key,
        Body: new Uint8Array(buffer),
        ContentType: filename.endsWith(".png") ? "image/png" : "image/jpeg",
      }));

      const newUrl = R2_PUBLIC_URL
        ? `${R2_PUBLIC_URL}/${r2Key}`
        : `${oldUrl}`; // fallback si no hay URL pública configurada

      mapping[oldUrl] = newUrl;
      count++;
    } catch (e) {
      console.error(`  ERROR: ${e.message}`);
      mapping[oldUrl] = `ERROR: ${e.message}`;
      errors++;
    }
  }

  fs.writeFileSync(
    path.join(__dirname, "image-url-mapping.json"),
    JSON.stringify(mapping, null, 2)
  );

  console.log(`\n✅ ${count} imágenes migradas, ${errors} errores`);
  console.log(`📄 Mapeo guardado en: image-url-mapping.json`);
  console.log(`\nAhora busca y reemplaza las URLs viejas por las nuevas en el código.`);
}

migrate().catch(console.error);