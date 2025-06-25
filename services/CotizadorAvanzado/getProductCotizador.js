/**
 * Obtiene la definición completa de un producto del cotizador avanzado
 * (marcas, tipos y sub-tipos) para generar dropdowns dinámicos.
 *
 * @param {string} productId – ID del producto (ej. "CAP8039").
 * @returns {Promise<null|Object>} Objeto con la misma estructura del backend
 *                                 o null si no existe.
 */
export async function getProductCotizador(productId) {
  /* Ruta base: /api/cotizador-avanzado/cotizador-avanzado/product/{productId} */
  const url = `/api/cotizador-avanzado/cotizador-avanzado/product/${productId}`;
  const res = await fetch(url);

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Error ${res.status} al consultar producto ${productId}`);
  }

  const data = await res.json();
  return data?.product ?? null;
}

/**
 * Extrae las opciones de los dropdowns en orden jerárquico.
 * Maneja los casos en los que brands o types puedan venir como null.
 *
 * @param {Object} productData – Salida de getProductCotizador.
 * @returns {{
 *   brands: { value: string, label: string }[],
 *   types:  { value: string, label: string, subTypes: string[] }[]
 * }}
 */
export function mapDropdownOptions(productData) {
  if (!productData) return { brands: [], types: [] };

  /* Asegura que .brands y .types sean arrays antes de mapear */
  const brandsRaw = Array.isArray(productData.brands) ? productData.brands : [];
  const typesRaw  = Array.isArray(productData.types)  ? productData.types  : [];

  const brands = brandsRaw.map((b) => ({
    value: b.brand_id,
    label: b.brand_name,
  }));

  const types = typesRaw.map((t) => ({
    value: t.type_name,
    label: t.type_name,
    subTypes: t.sub_types,
  }));

  return { brands, types };
}
