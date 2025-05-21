// src/services/CheckTecnico/getCheckTecnicoForms.js

/**
 * Obtiene todos los formularios guardados de Check-Técnico para una orden.
 *
 * @param {string} orderId – ID o documentName de la orden.
 * @returns {Promise<{ order_id: string, forms: Array<object>, message: string }>}
 */
export async function getCheckTecnicoForms(orderId) {
  const url = `/api/check-tecnico/check-tecnico/forms?order_id=${orderId}`;
  console.log("[getCheckTecnicoForms] url:", url);

  const res = await fetch(url);

  console.log("[getCheckTecnicoForms] response status:", res.status);

  if (!res.ok) {
    const errorBody = await res.text().catch(() => "");
    console.error(
      "[getCheckTecnicoForms] error body:",
      errorBody || res.statusText
    );
    throw new Error(
      `Error al obtener formularios: ${res.status} ${res.statusText}`
    );
  }

  const data = await res.json().catch(() => ({}));
  console.log("[getCheckTecnicoForms] data:", data);
  return data;
}
