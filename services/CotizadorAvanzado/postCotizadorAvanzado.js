// src/services/CotizadorAvanzado/postCotizadorAvanzado.js
/**
 * Envía la información del cotizador avanzado al backend.
 * El proxy de Next.js redirige /api/** a http://localhost:8000/**
 *
 * @param {Object} params
 * @param {string|number} params.orderId            – ID de la orden.
 * @param {number}        params.cilindrosNumber    – Nº de cilindros seleccionado.
 * @param {string[]}      params.includeServices    – Nombres de los servicios incluidos.
 * @param {number}        params.cantidadDescuento  – Monto del descuento en dinero.
 * @param {string}        params.codigoDescuento    – Código de descuento (puede ser cadena vacía).
 * @param {string[]}      params.productsCotizador  – IDs de los productos añadidos.
 * @returns {Promise<any>}                          – Respuesta del backend.
 */
export async function postCotizadorAvanzado({
  orderId,
  cilindrosNumber,
  includeServices,
  cantidadDescuento,
  codigoDescuento,
  productsCotizador,
}) {
  const query = new URLSearchParams({
    order_id: orderId.toString(),
    type_cotizador: "1",
    cilindros_number: cilindrosNumber?.toString() || "",
  }).toString();

  const url = `/api/cotizador-avanzado/cotizador-avanzado?${query}`;

  const body = JSON.stringify({
    include_services: includeServices.map((name) => ({
      name_service: name,
      cost: 0,
    })),
    descuentos:
      cantidadDescuento || codigoDescuento
        ? [
            {
              cantidad_descuento: cantidadDescuento || 0,
              codigo_descuento: codigoDescuento || "",
            },
          ]
        : [],
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
