// CotizadorAvanzado/AfinacionBasica/components/ContainerServiciosIncluidos.js
"use client";

import { useState, useEffect, useMemo } from "react";

/**
 * Checkbox grid para seleccionar los servicios incluidos.
 * Prop onChange devuelve un array con los nombres seleccionados.
 */
export default function ContainerServiciosIncluidos({ onChange }) {
  const rawServicios = [
    "Revisión con Escaner",
    "Revisión Física con puntos de seguridad",
    "Revisión y rellenado de niveles",
    "Revisión y rellenado de niveles",
    "Limpieza de Inyectores Básica",
    "Limpieza de MAF",
    "Limpieza de Sensor MAF",
    "Limpieza de cuerpo de aceleración básica",
    "Limpieza cuerpo de aceleración básica",
    "Eliminación de olores en S. de refrigeración",
    "Limpieza de motor",
    "Reset de Servicio",
    "Lavado de Carrocería",
    "Relleno de Líquidos",
    "Carpeta de Servicio",
    "+",
  ];

  /* Elimina duplicados exactos conservando la primera aparición */
  const servicios = useMemo(() => {
    const seen = new Set();
    return rawServicios.filter((s) => {
      if (seen.has(s)) return false;
      seen.add(s);
      return true;
    });
  }, []);

  const [seleccionados, setSeleccionados] = useState(
    servicios.map(() => false)
  );

  const toggleServicio = (index) => {
    setSeleccionados((prev) =>
      prev.map((v, i) => (i === index ? !v : v))
    );
  };

  const seleccionarTodos = () => {
    setSeleccionados(servicios.map(() => true));
  };

  /* Notifica al padre solo cuando cambia la selección,
     evitando dependencias que cambian cada render. */
  useEffect(() => {
    if (typeof onChange === "function") {
      const activos = servicios.filter((_, idx) => seleccionados[idx]);
      onChange(activos);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seleccionados]);

  /* Agrupa en filas de 4 */
  const filas = [];
  for (let i = 0; i < servicios.length; i += 4) {
    filas.push(servicios.slice(i, i + 4));
  }

  return (
    <div className="container-servicios-incluidos">
      <div className="title-servicios-incluidos">
        <h4>Servicios Incluidos</h4>
        <button onClick={seleccionarTodos}>Seleccionar Todos</button>
      </div>

      <div className="container-forms-servicios">
        {filas.map((fila, rowIdx) => (
          <div key={rowIdx} className="row-servicios">
            {fila.map((servicio, colIdx) => {
              const index = rowIdx * 4 + colIdx;
              return (
                <div key={servicio} className="servicio">
                  <label>
                    <input
                      type="checkbox"
                      checked={seleccionados[index]}
                      onChange={() => toggleServicio(index)}
                    />
                    <p>{servicio}</p>
                  </label>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
