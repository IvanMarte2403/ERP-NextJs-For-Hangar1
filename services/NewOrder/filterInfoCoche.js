// src/services/NewOrder.js/filterInfoCoche.js
/**
 * Devuelve los motores (trims) asociados a un modelo.
 *
 * @param {number|string} idCarModel – ID del modelo.
 * @returns {Promise<Array<{ id_car_trim: number, name: string }>>}
 */
export async function getCarTrims(idCarModel) {
  const query = new URLSearchParams({ id_car_model: idCarModel.toString() }).toString();
  const url = `/api/filter-car/filter-car/info_coche?${query}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Error al obtener trims: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data?.trims ?? [];
}
