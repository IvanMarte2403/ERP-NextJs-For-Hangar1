// src/services/CheckIn/uploadDocument.js

/**
 * Sube un archivo de check-in al backend.
 *
 * El proxy de Next.js (next.config.js) convierte cualquier llamada
 * a /api/** en http://localhost:8000/**.
 *
 * @param {string|number} orderId                   — order_id / document_name
 * @param {"frontal"|"trasero"|"lateral"|"tablero"} typeDoc
 * @param {File} file                               — archivo de video
 * @param {(pct:number)=>void} [onProgress]         — callback de progreso (0-100)
 *
 * @returns {Promise<{ name:string, url:string, uploaded_at:string }>}
 */
export function uploadDocument(orderId, typeDoc, file, onProgress = () => {}) {
    return new Promise((resolve, reject) => {
      if (!orderId || !typeDoc || !file) {
        reject(new Error("orderId, typeDoc y file son requeridos"));
        return;
      }
  
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/check_in/upload");
  
      // Seguimiento de progreso
      xhr.upload.onprogress = (evt) => {
        if (evt.lengthComputable) {
          const pct = Math.round((evt.loaded / evt.total) * 100);
          onProgress(pct);
        }
      };
  
      // Al completarse la subida
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText)); // { name, url, uploaded_at }
          } catch {
            resolve({});
          }
        } else {
          reject(new Error(`Error ${xhr.status}: ${xhr.statusText}`));
        }
      };
  
      // Error de red
      xhr.onerror = () => reject(new Error("Error de red al subir archivo"));
  
      // Construir el form-data
      const formData = new FormData();
      formData.append("order_id", orderId);
      formData.append("type_doc", typeDoc); // ahora acepta "trasero"
      formData.append("file", file);
  
      xhr.send(formData);
    });
  }
  