// src/services/filterCoches.js
/**
 * Obtiene el catálogo de marcas de coches.
 * El proxy de Next.js redirige cualquier ruta que comience con `/api/**`
 * a `http://localhost:8000/**`.
 *
 * @returns {Promise<Array<{ id_car_make: number, name: string }>>}
 */
export async function getCarBrands() {
  const url = "/api/filter-car/filter-car/marca";

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Error al obtener marcas: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data?.brands ?? [];
}
