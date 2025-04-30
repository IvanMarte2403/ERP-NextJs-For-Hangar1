// src/services/CheckIn/getCheckInUrls.js
/**
 * Obtiene las URLs de videos de check-in para una orden dada.
 * El backend está proxyeado por Next.js: cualquier llamada a /api/**
 * se envía a http://localhost:8000/** (ver next.config.js).
 *
 * @param {string|number} orderId  El ID / documentName de la orden.
 * @returns {Promise<{ order_id: string, files: Array<{name: string, url: string, uploaded_at: string}> }>}
 */
export async function getCheckInUrls(orderId) {
    if (!orderId) {
      throw new Error("orderId es requerido");
    }
  
    const res = await fetch(`/api/check_in/urls?order_id=${orderId}`);
  
    if (!res.ok) {
      throw new Error(`Error al consultar las evidencias: ${res.statusText}`);
    }
  
    return res.json(); // → { order_id, files }
  }
  