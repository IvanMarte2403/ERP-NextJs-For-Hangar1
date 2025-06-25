// CotizadorAvanzado/AfinacionBasica/components/PartCotizador.js
"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import ContainerCilindros from "./ContainerCilindros";
import ContainerServiciosIncluidos from "./ContainerServiciosIncluidos";

/* Listas de productos modulares */
import { esencialesProducts } from "./products_esenciales";
import { premiumProducts, maxRendProducts } from "./products_premium";
import { extrasProducts } from "./products_extras";

/* Servicio para marcas / tipos / subtipos */
import {
  getProductCotizador,
  mapDropdownOptions,
} from "../../../../../../../services/CotizadorAvanzado/getProductCotizador";

/* Utilidad simple */
const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);

/* ------------------------------------------------------------------ */
/* Componente reutilizable con identidad estable */
function ProductForm({ prod, productState, handleField, tryAdd }) {
  const state = productState;
  const loadedRef = useRef(false);
  const [dropdowns, setDropdowns] = useState({ brands: [], types: [] });

  /* Petición de datos para dropdowns */
  const fetchDropdowns = async () => {
    if (loadedRef.current || !prod.apiId) return;
    loadedRef.current = true;
    try {
      const data = await getProductCotizador(prod.apiId);
      const mapped = mapDropdownOptions(data);
      setDropdowns(mapped);
    } catch (e) {
      console.error("Error al cargar dropdowns:", e);
    }
  };

  /* Sub-tipos dependientes del tipo seleccionado */
  const subTypeOptions = useMemo(() => {
    if (!state.tipo) return [];
    const match = dropdowns.types.find((t) => t.label === state.tipo);
    return match?.subTypes ?? [];
  }, [state.tipo, dropdowns.types]);

  return (
    <div className="form-input-cotizador">
      <div className="title-product">
        <img src={prod.icon} alt="" />
        <p>{prod.name}</p>
      </div>

      <div className="section-form-avanzado">
        <div className="inputs-section">
          {prod.fields.map((field) => {
            const label = field === "cantidad" ? "Cantidad" : cap(field);

            /* -------- Marca -------- */
            if (field === "marca" && dropdowns.brands.length) {
              return (
                <div key={field} className={`container-${field}`}>
                  <p>{label}</p>
                  <select
                    className="dropdown-select"
                    value={state[field]}
                    onFocus={fetchDropdowns}
                    onChange={(e) =>
                      handleField(prod.key, field, e.target.value)
                    }
                  >
                    <option value="">Selecciona marca</option>
                    {dropdowns.brands.map((b) => (
                      <option key={b.value} value={b.label}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            /* -------- Tipo -------- */
            if (field === "tipo" && dropdowns.types.length) {
              return (
                <div key={field} className={`container-${field}`}>
                  <p>{label}</p>
                  <select
                    className="dropdown-select"
                    value={state[field]}
                    onFocus={fetchDropdowns}
                    onChange={(e) =>
                      handleField(prod.key, field, e.target.value)
                    }
                  >
                    <option value="">Selecciona tipo</option>
                    {dropdowns.types.map((t) => (
                      <option key={t.value} value={t.label}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            /* -------- Sub-tipo -------- */
            if (field === "subtipo" && subTypeOptions.length) {
              return (
                <div key={field} className={`container-${field}`}>
                  <p>{label}</p>
                  <select
                    className="dropdown-select"
                    value={state[field]}
                    onChange={(e) =>
                      handleField(prod.key, field, e.target.value)
                    }
                  >
                    <option value="">Selecciona subtipo</option>
                    {subTypeOptions.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            /* -------- Inputs genéricos -------- */
            return (
              <div key={field} className={`container-${field}`}>
                <p>{label}</p>
                <input
                  type="text"
                  value={state[field]}
                  onFocus={field === "marca" || field === "tipo" ? fetchDropdowns : undefined}
                  onChange={(e) =>
                    handleField(prod.key, field, e.target.value)
                  }
                />
              </div>
            );
          })}
        </div>

        <div className="confirmation-insection">
          <img
            src="CotizadorAvanzado/+.svg"
            alt=""
            onClick={() => tryAdd(prod.key, prod.name)}
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export default function PartCotizador({
  onAddService,
  onCilindrosChange,
  onIncludeServicesChange,
}) {
  /* ---------- STATE GLOBAL ---------- */
  const [productsState, setProductsState] = useState(() => {
    const seed = {};
    const all = [
      ...esencialesProducts,
      ...premiumProducts,
      ...maxRendProducts,
      ...extrasProducts.filter((p) => !p.divider),
    ];
    all.forEach((p) => {
      seed[p.key] = p.fields.reduce((acc, f) => ({ ...acc, [f]: "" }), {});
    });
    return seed;
  });

  /* ---------- HANDLERS ---------- */
  const handleField = useCallback((key, field, value) => {
    setProductsState((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  }, []);

  const tryAdd = useCallback(
    (key, name) => {
      const st = productsState[key];
      if (!st.cantidad || !st.costo) return;
      onAddService?.({
        cantidad: Number(st.cantidad),
        servicio: name,
        costo: Number(st.costo),
      });
      setProductsState((prev) => ({
        ...prev,
        [key]: Object.fromEntries(Object.keys(prev[key]).map((k) => [k, ""])),
      }));
    },
    [productsState, onAddService]
  );

  /* ---------- EXTRAS (con divisores) ---------- */
  const extrasContent = useMemo(
    () =>
      extrasProducts.map((prod, i) =>
        prod.divider ? (
          <hr key={`hr-${i}`} className="divider" />
        ) : (
          <ProductForm
            key={prod.key}
            prod={prod}
            productState={productsState[prod.key]}
            handleField={handleField}
            tryAdd={tryAdd}
          />
        )
      ),
    [productsState, handleField, tryAdd]
  );

  /* ---------- RENDER PRINCIPAL ---------- */
  return (
    <div className="container-forms-cotizador">
      {/* Cilindros y Servicios Incluidos */}
      <div className="container-part">
        <ContainerCilindros onSelect={onCilindrosChange} />
        <ContainerServiciosIncluidos onChange={onIncludeServicesChange} />

        {/* Esenciales */}
        {esencialesProducts.map((p) => (
          <ProductForm
            key={p.key}
            prod={p}
            productState={productsState[p.key]}
            handleField={handleField}
            tryAdd={tryAdd}
          />
        ))}

        {/* Premium */}
        <div className="title-cotizador">
          <h3>Premium</h3>
        </div>
        {premiumProducts.map((p) => (
          <ProductForm
            key={p.key}
            prod={p}
            productState={productsState[p.key]}
            handleField={handleField}
            tryAdd={tryAdd}
          />
        ))}
      </div>

      {/* Máximo Rendimiento */}
      <div className="title-part">
        <h4>Máximo Rendimiento</h4>
      </div>
      <div className="container-part">
        {maxRendProducts.map((p) => (
          <ProductForm
            key={p.key}
            prod={p}
            productState={productsState[p.key]}
            handleField={handleField}
            tryAdd={tryAdd}
          />
        ))}
      </div>

      {/* Extras */}
      <div className="title-part">
        <h4>Extra</h4>
      </div>
      <div className="container-part">{extrasContent}</div>
    </div>
  );
}
