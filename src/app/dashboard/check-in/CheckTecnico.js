// Checks/application/check_tecnico/CheckTecnico.js
"use client";

import React from "react";

export default function CheckTecnico({ orderId }) {
  return (
    <div className="check-tecnico-container">
      <h2>Check-Tecnico - Orden #{orderId}</h2>
      
      <div className="container-diagnostico-vehicular">
        {/* Title */}
        <div className="title">
          <h3>Diagnóstico Vehicular</h3>
        </div>

        {/* Row Input */}
        <div className="row-input-problem">
          {/* Input Problema */}
          <div className="input">
            <p>Problema</p>
            <input type="text" name="problema" />
          </div>
          {/* Input Descripción */}
          <div className="input">
            <p>Diagnóstico</p>
            <input type="text" name="descripcion" />
          </div>
          {/* Input Lugar */}
          <div className="input">
            <p>Lugar</p>
            <input type="text" name="lugar" />
          </div>
          {/* Botón Agregar */}
          <div className="buttons">
            <button>Agregar</button>
          </div>
        </div>

        {/* Tabla de diagnósticos */}
        <div className="container-table-list">
          <table className="diagnostico-table">
            <thead>
              <tr>
                <th>Problema</th>
                <th>Descripción</th>
                <th>Lugar</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {/* Ejemplo de fila; reemplaza con map de tus datos */}
              <tr>
                <td>Ejemplo problema</td>
                <td>Ejemplo descripción</td>
                <td>Ejemplo lugar</td>
                <td>
                  <img
                    src="/check-in/erase.svg"
                    alt="Eliminar"
                    className="icon-erase"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
