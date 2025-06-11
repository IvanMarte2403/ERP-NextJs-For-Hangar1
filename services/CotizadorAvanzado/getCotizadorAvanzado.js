// src/services/CotizadorAvanzado/getCotizadorAvanzado.js
/**
 * Consulta la información del cotizador avanzado para una orden.
 * (type_cotizador = 1 → Afinación Básica)
 *
 * @param {string|number} orderId
 * @returns {Promise<null|Object>}  entry o null si no hay datos
 */
export async function getCotizadorAvanzado(orderId) {
  const url = `/api/cotizador-avanzado/cotizador-avanzado?order_id=${orderId}&type_cotizador=1`;
  const res = await fetch(url);

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Error ${res.status} al consultar cotizador avanzado`);
  }

  const data = await res.json();
  return data?.entry ?? null;
}
