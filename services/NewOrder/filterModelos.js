// src/services/NewOrder.js/filterModelos.js
/**
 * Devuelve los modelos asociados a una marca.
 *
 * @param {number|string} idCarMake – ID de la marca.
 * @returns {Promise<Array<{ id_car_model: number, id_car_make: number, name: string }>>}
 */
export async function getCarModels(idCarMake) {
  const query = new URLSearchParams({ id_car_make: idCarMake.toString() }).toString();
  const url = `/api/filter-car/filter-car/modelo?${query}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Error al obtener modelos: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data?.models ?? [];
}
