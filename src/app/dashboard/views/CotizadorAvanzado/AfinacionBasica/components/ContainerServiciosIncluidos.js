// CotizadorAvanzado/AfinacionBasica/ContainerServiciosIncluidos.js
"use client";

import { useState } from "react";

export default function ContainerServiciosIncluidos() {
  const servicios = [
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

  const filas = [
    servicios.slice(0, 4),
    servicios.slice(4, 8),
    servicios.slice(8, 12),
    servicios.slice(12, 16),
  ];

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
                <div key={colIdx} className="servicio">
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
