/**
 * Envía un diagnóstico (POST) usando query-string y XMLHttpRequest,
 * para replicar el flujo de /check_in/upload.
 *
 * @param {Object}  params
 * @param {string}  params.orderId
 * @param {string}  params.id_service
 * @param {number}  params.status         — 1, 2 o 3
 * @param {string}  params.descripcion
 *
 * @returns {Promise<{ order_id:string, entry:Object }>}
 */
export function updateCheckTecnico({
    orderId,
    id_service,
    status,
    descripcion,
  }) {
    return new Promise((resolve, reject) => {
      if (!orderId || !id_service || !status || descripcion == null) {
        reject(new Error("Faltan parámetros obligatorios"));
        return;
      }
  
      const qs = new URLSearchParams({
        order_id: orderId,
        id_service,
        status: status.toString(),
        description: descripcion,
      }).toString();
  
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `/api/check-tecnico/check-tecnico?${qs}`);
  
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch {
            resolve({});
          }
        } else {
          reject(new Error(`Error ${xhr.status}: ${xhr.statusText}`));
        }
      };
  
      xhr.onerror = () =>
        reject(new Error("Error de red al enviar diagnóstico"));
  
      xhr.send();
    });
  }
  