import { cabins, halls } from "@/lib/cabins";

const catalog = [...cabins, ...halls.map((hall) => ({ ...hall, images: [hall.image] }))];

// Los datos importados pueden no traer el arreglo de imágenes. Mantener este
// respaldo permite publicar el catálogo completo desde R2 mientras se editan
// las fichas desde el panel de administración.
export function withCatalogImages(item) {
  if (item?.images?.length) return item;
  const fallback = catalog.find((entry) => entry.name === item?.name);
  return { ...item, images: fallback?.images || [] };
}

export function withCatalogImagesList(items) {
  return (items || []).map(withCatalogImages);
}
