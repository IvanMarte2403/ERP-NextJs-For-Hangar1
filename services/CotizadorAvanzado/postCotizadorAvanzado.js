// src/services/CotizadorAvanzado/postCotizadorAvanzado.js
/**
 * Envía la información del cotizador avanzado al backend.
 * El proxy de Next.js redirige cualquier ruta que comience con `/api/**`
 * a `http://localhost:8000/**`.
 *
 * @param {Object}  params
 * @param {string|number} params.orderId             – ID de la orden.
 * @param {number}        params.cilindrosNumber     – Nº de cilindros seleccionado.
 * @param {number}        params.iva                – IVA calculado (en $).
 * @param {number}        params.total              – Total final (subtotal + IVA − descuentos).
 * @param {string[]}      params.includeServices     – Nombres de los servicios incluidos.
 * @param {Array<Object>} params.descuentos          – Array con objetos { cantidad_descuento, codigo_descuento }.
 * @param {string[]}      params.productsCotizador   – IDs de los productos añadidos.
 * @returns {Promise<any>} – Respuesta del backend.
 */
export async function postCotizadorAvanzado({
  orderId,
  cilindrosNumber,
  iva,
  total,
  includeServices = [],
  descuentos = [],
  productsCotizador = [],
}) {
  /* --- Query-string: solo order_id y type_cotizador --- */
  const query = new URLSearchParams({
    order_id: orderId.toString(),
    type_cotizador: "1",
  }).toString();

  const url = `/api/cotizador-avanzado/cotizador-avanzado?${query}`;

  /* --- Body en el formato requerido --- */
  const body = JSON.stringify({
    cilindros_number: cilindrosNumber,
    iva,
    total,
    include_services: includeServices.map((name) => ({
      name_service: name,
      cost: 0,
    })),
    descuentos,
    products_cotizador: productsCotizador,
  });

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  if (!res.ok) {
    throw new Error(
      `Error al enviar cotizador: ${res.status} ${res.statusText}`,
    );
  }

  return res.json();
}
