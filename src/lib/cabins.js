// Catálogo de cabañas y salones — Cabañas Fundo El Grillo
// Fotos almacenadas en el storage de la app.

const UP = "https://pub-bf044be5e1644eeea160056cc2074860.r2.dev";

export const cabins = [
  {
    id: "boldo", name: "Boldo", capacity: "6 personas", rooms: "2 dormitorios", pool: "Piscina compartida", high: 110000, low: 90000, sector: "Sector Bosque Nativo",
    images: [`${UP}/bed56be4b_boldo-1.jpg`, `${UP}/2e0f3133d_boldo-2.jpg`, `${UP}/88e4f71ba_boldo-3.jpg`, `${UP}/f8756203b_boldo-4.jpg`],
  },
  {
    id: "capilla", name: "Capilla", capacity: "2–3 personas", rooms: "1 dormitorio", pool: "Piscina propia", high: 95000, low: 75000, sector: "Espacio Central",
    images: [`${UP}/217483da6_capilla-1.jpg`, `${UP}/b0eddf5c2_capilla-2.jpg`, `${UP}/45488ff99_capilla-3.jpg`, `${UP}/0874e88d2_capilla-4.jpg`],
  },
  {
    id: "arrayan", name: "Casa Arrayán", capacity: "8 personas", rooms: "3 dormitorios", pool: "Piscina propia", high: 140000, low: 120000, sector: "Sector Bosque Nativo",
    images: [`${UP}/b1b0b7145_arrayan-1.jpg`, `${UP}/2164989e3_arrayan-2.jpg`, `${UP}/2a6bac421_arrayan-3.jpg`, `${UP}/3223838f1_arrayan-4.jpg`],
  },
  {
    id: "barro", name: "Casa de Barro", capacity: "10 personas", rooms: "4 dormitorios", pool: "Piscina propia", high: 150000, low: 130000, sector: "Sector Bosque Nativo",
    images: [`${UP}/2ae5d2e27_barro-1.jpg`, `${UP}/704604d80_barro-2.jpg`, `${UP}/47aebad91_barro-3.jpg`, `${UP}/5f7209a2c_barro-4.jpg`],
  },
  {
    id: "cerro", name: "Casa del Cerro", capacity: "4 personas", rooms: "1 dormitorio", pool: "Piscina propia", high: 100000, low: 80000, sector: "Area De Acceso",
    images: [`${UP}/65f357ea7_cerro-1.jpg`, `${UP}/d56e207e4_cerro-2.jpg`, `${UP}/b16715962_cerro-3.jpg`, `${UP}/d5599cd07_cerro-4.jpg`],
  },
  {
    id: "chincol", name: "Chincol", capacity: "2 personas", rooms: "1 ambiente", pool: "Piscina compartida", high: 85000, low: 65000, sector: "Area De Acceso",
    images: [`${UP}/81c3e69c4_chincol-1.jpg`, `${UP}/c8a2e949c_chincol-2.jpg`, `${UP}/283045bf1_chincol-3.jpg`, `${UP}/7a93638bd_chincol-4.jpg`],
  },
  {
    id: "colibri", name: "Colibrí", capacity: "4 personas", rooms: "1 ambiente", pool: "Piscina compartida", high: 95000, low: 85000, sector: "Area De Acceso",
    images: [`${UP}/655ef386b_colibri-1.jpg`, `${UP}/592568e09_colibri-2.jpg`, `${UP}/2a94c1350_colibri-3.jpg`, `${UP}/ad31f5774_colibri-4.jpg`],
  },
  {
    id: "ecologica", name: "Ecológica", capacity: "8 personas", rooms: "3 dormitorios", pool: "Piscina propia", high: 140000, low: 120000, sector: "Sector Bosque Nativo",
    images: [`${UP}/d40b65945_ecologica-1.jpg`, `${UP}/03739a536_ecologica-2.jpg`, `${UP}/e1d1b10cd_ecologica-3.jpg`, `${UP}/e1db26277_ecologica-4.jpg`],
  },
  {
    id: "honeymoon", name: "Honey Moon", capacity: "8 personas", rooms: "3 dormitorios", pool: "Piscina propia", high: 140000, low: 120000, sector: "Sector Bosque Nativo",
    images: [`${UP}/4c8352722_honeymoon-1.jpg`, `${UP}/63733d037_honeymoon-2.jpg`, `${UP}/c89fb43ec_honeymoon-3.jpg`, `${UP}/cfe10d4e8_honeymoon-4.jpg`],
  },
  {
    id: "iglesia1", name: "Iglesia 1", capacity: "6–7 personas", rooms: "2 dormitorios", pool: "Piscina compartida", high: 110000, low: 90000, sector: "Espacio Central",
    images: [`${UP}/bc6366f02_iglesia1-1.jpg`, `${UP}/51d483aa4_iglesia1-2.jpg`, `${UP}/7f50b387a_iglesia1-3.jpg`, `${UP}/cea124ac2_iglesia1-4.jpg`],
  },
  {
    id: "iglesia2", name: "Iglesia 2", capacity: "6–7 personas", rooms: "2 dormitorios", pool: "Piscina compartida", high: 110000, low: 90000, sector: "Espacio Central",
    images: [`${UP}/0e377fab6_iglesia2-1.jpg`, `${UP}/9ed4995f4_iglesia2-2.jpg`, `${UP}/46996d554_iglesia2-3.jpg`, `${UP}/012b9c786_iglesia2-4.jpg`],
  },
  {
    id: "loica", name: "Loica", capacity: "6 personas", rooms: "2 dormitorios", pool: "Piscina compartida", high: 110000, low: 100000, sector: "Espacio Central",
    images: [`${UP}/930253e6c_loica-1.jpg`, `${UP}/961a4002d_loica-2.jpg`, `${UP}/8a7ba3f6c_loica-3.jpg`, `${UP}/ba38199c6_loica-4.jpg`],
  },
  {
    id: "monasterio", name: "Monasterio", capacity: "9 personas", rooms: "3 dormitorios", pool: "Piscina propia", high: 140000, low: 120000, sector: "Sector Bosque Nativo",
    images: [`${UP}/44765e55a_monasterio-1.jpg`, `${UP}/f2e77a6cd_monasterio-2.jpg`, `${UP}/b1c86bc39_Monasterio-13-9f8e999e09ab6f407f1d639bad6707bd.jpg`, `${UP}/18828050e_Monasterio-9-4791bdc0fd6853686d23911fb2729897.jpg`],
  },
  {
    id: "naranjal1", name: "Naranjal 1", capacity: "4 personas", rooms: "2 dormitorios", pool: "Piscina propia", high: 105000, low: 85000, sector: "Sector Bosque Nativo",
    images: [`${UP}/426a23a44_Naranjal-1-17.jpg`, `${UP}/0aca295d9_Naranjal-1-7-5d4f9a4f7fa0122a6ebbab605467d6e2.jpg`, `${UP}/2977c63a3_Naranjal-1-19-86eb8db8a12ef62c90126f11a9957528.jpg`, `${UP}/20f05926e_Naranjal-1-21-f6012a6dfe45e92cdd109150758887ba.jpg`],
  },
  {
    id: "naranjal2", name: "Naranjal 2", capacity: "4 personas", rooms: "2 dormitorios", pool: "Piscina propia", high: 100000, low: 80000, sector: "Sector Bosque Nativo",
    images: [`${UP}/dd2abd342_Naranjal-2-14.jpg`, `${UP}/227b94778_Naranjal-2-13-d2149099a6a3838acb5edbfcc504c086.jpg`, `${UP}/86a038a60_Naranjal-2-8-f4749f571ceb2e467c84edcb34a60482.jpg`, `${UP}/0b72596c0_Naranjal-2-10-429c5bc9289cf831b0072482b3fc8597.jpg`],
  },
  {
    id: "organica", name: "Orgánica", capacity: "6–7 personas", rooms: "2 dormitorios", pool: "Piscina compartida", high: 110000, low: 90000, sector: "Espacio Central",
    images: [`${UP}/18f076b2c_Orgnica-15.jpg`, `${UP}/797d3d0e4_Orgnica-18-840aeeea771fd61c8633d9fea8cfdc0e.jpg`, `${UP}/8e626216d_Orgnica-4-b3564c928281f8aae8f596104b1d17e8.jpg`, `${UP}/d345bf3b3_Orgnica-11-c7fa9be7f40e258fc65194ad10d2481f.jpg`],
  },
];

// Add `image` getter (first photo) for backward compatibility
cabins.forEach((c) => { c.image = c.images[0]; });

export const halls = [
  { id: "darwin", name: "Salón Darwin", desc: "Salón principal para eventos grandes, con pérgola y terraza exterior.", image: `${UP}/10b57c29c_YUNC0020b.jpg` },
  { id: "quincho", name: "Quincho Club House", desc: "Quincho con cancha de futbolito y piscina de nado, hasta 40 personas.", image: `${UP}/7a4a85385_quincho1.jpg` },
];

export const gallery = [
  { title: "Comedor", sub: "Cabaña Voluntarios", image: `${UP}/9c94d72e6_DSC_8191.jpg` },
  { title: "Jardín de acceso", sub: "Cabaña Orgánica", image: `${UP}/ee2f8502e_DSC_8064.jpg` },
  { title: "Cocina", sub: "Cabaña Monasterio", image: `${UP}/ba7794f1a_DSC_8238.jpg` },
  { title: "Exterior salón de eventos", sub: "Salón Darwin", image: `${UP}/10b57c29c_YUNC0020b.jpg` },
  { title: "Pérgola y terraza", sub: "Salón Darwin", image: `${UP}/bf79c5ba8_DSC_0960.jpg` },
  { title: "Quincho", sub: "Club House", image: `${UP}/7a4a85385_quincho1.jpg` },
];

export const formatCLP = (n) =>
  "$" + n.toLocaleString("es-CL");

export const cabinOptions = cabins.map((c) => c.name);
