// src/services/CotizadorAvanzado/postCotizadorAvanzado.js

/**
 * Envía la información del cotizador avanzado al backend.
 *
 * @param {Object}   params
 * @param {string}   params.orderId             – ID de la orden.
 * @param {number}   params.cilindrosNumber     – Nº de cilindros seleccionado.
 * @param {number}   params.iva                 – 16 o 0 según selección.
 * @param {Object[]} params.includeServices     – Servicios incluidos.
 * @param {Object[]} params.descuentos          – Descuentos aplicados.
 * @param {Object[]} params.productsCotizador   – Productos con detalle completo.
 * @returns {Promise<any>}                      – Respuesta del backend.
 */
export async function postCotizadorAvanzado({
  orderId,
  cilindrosNumber,
  iva,
  includeServices,
  descuentos,
  productsCotizador,
}) {
  const query = new URLSearchParams({
    order_id: orderId.toString(),
    type_cotizador: "1",
  }).toString();

  const url = `/api/cotizador-avanzado/cotizador-avanzado?${query}`;

  const body = JSON.stringify({
    cilindros_number: cilindrosNumber,
    iva,
    include_services: includeServices,
    descuentos,
    products_cotizador: productsCotizador,
  });

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  if (!res.ok) {
    throw new Error(`Error al enviar cotizador: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
