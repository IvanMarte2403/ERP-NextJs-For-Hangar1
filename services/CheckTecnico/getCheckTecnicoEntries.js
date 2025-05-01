/**
 * Obtiene los diagnósticos existentes de un check-técnico.
 *
 *   GET /api/check-tecnico?order_id=...
 *
 * @param {string|number} orderId — document_name
 * @returns {Promise<{ order_id:string, entries:Array }>}
 */
export async function getCheckTecnicoEntries(orderId) {
  if (!orderId) {
    throw new Error("orderId es requerido");
  }

  const url = `/api/check-tecnico/check-tecnico?order_id=${encodeURIComponent(orderId)}`;

  const res = await fetch(url, { method: "GET" });

  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}
