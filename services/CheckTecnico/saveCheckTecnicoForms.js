/**
 * Envía los formularios de Check-Técnico al backend.
 *
 * @param {string} orderId  –  Ej. “ORD-12345”
 * @param {Array<object>} forms
 * @returns {Promise<any>}
 */
export async function saveCheckTecnicoForms(orderId, forms) {
  /* Payload que el backend espera: solo “forms” */
  const payload = { forms };
  console.log("[saveCheckTecnicoForms] payload:", payload);

  /* URL correcta (sin duplicar “check-tecnico”) */
  const url = `/api/check-tecnico/check-tecnico/forms?order_id=${orderId}`;
  console.log("[saveCheckTecnicoForms] url:", url);

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  console.log("[saveCheckTecnicoForms] response status:", res.status);

  if (!res.ok) {
    const errorBody = await res.text().catch(() => "");
    console.error(
      "[saveCheckTecnicoForms] error body:",
      errorBody || res.statusText
    );
    throw new Error(
      `Error al guardar formularios: ${res.status} ${res.statusText}`
    );
  }

  const data = await res.json().catch(() => ({}));
  console.log("[saveCheckTecnicoForms] response data:", data);
  return data;
}
