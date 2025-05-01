// src/services/CheckTecnico/getAllServices.js

/**
 * Obtiene la lista completa de servicios desde el backend.
 * El proxy de Next.js (next.config.js) envía /api/** a http://localhost:8000/**
 *
 * @returns {Promise<{ count: number, services: Array<{ service_id: string, name: string }> }>}
 */
export async function getAllServices() {
    const res = await fetch('/api/services/services/all');
  
    if (!res.ok) {
      throw new Error(`Error al obtener servicios: ${res.status} ${res.statusText}`);
    }
  
    return res.json();
  }
  