import { cabins, halls } from "@/lib/cabins";

const catalog = [...cabins, ...halls.map((hall) => ({ ...hall, images: [hall.image] }))];
const OLD_R2_BASE = "https://pub-b9d30b344c8144668e2115f92a734075.r2.dev";
const CURRENT_R2_BASE = "https://pub-bf044be5e1644eeea160056cc2074860.r2.dev";

const normalizeUrl = (url) => typeof url === "string" ? url.replace(OLD_R2_BASE, CURRENT_R2_BASE) : url;

// Los datos importados pueden no traer el arreglo de imágenes. Mantener este
// respaldo permite publicar el catálogo completo desde R2 mientras se editan
// las fichas desde el panel de administración.
export function withCatalogImages(item) {
  const fallback = catalog.find((entry) => entry.name === item?.name);
  const { desc: fallbackDescription, ...fallbackData } = fallback || {};
  const itemImages = (item?.images || []).map(normalizeUrl).filter(Boolean);
  const fallbackImages = fallback?.images || [];

  // La primera foto original del Salón Darwin no quedó disponible en R2.
  // Usamos la portada verificada, sin quitar las demás fotos ya cargadas.
  const images = item?.name === "Salón Darwin" && fallbackImages.length
    ? [...fallbackImages, ...itemImages.filter((image) => !fallbackImages.includes(image))]
    : itemImages.length ? itemImages : fallbackImages;

  return {
    ...fallbackData,
    ...item,
    images,
    description: item?.description || fallbackDescription || "Espacio para eventos rodeado de naturaleza.",
  };
}

export function withCatalogImagesList(items) {
  return (items || []).map(withCatalogImages);
}
