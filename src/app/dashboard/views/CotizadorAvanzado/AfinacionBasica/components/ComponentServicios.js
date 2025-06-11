// src/CotizadorAvanzado/AfinacionBasica/components/ComponentServicios.js
"use client";
import React from "react";

/**
 * Renders a table of all added services.
 */
export default function ComponentServicios({ services }) {
  return (
    <div className="component-servicios">
      <table>
        <thead>
          <tr>
            <th>Cantidad</th>
            <th>Servicio</th>
            <th>Costo</th>
            <th>IVA</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {services.map((item) => {
            const raw = item.cantidad * item.costo;
            const iva = raw * 0.16;
            const subtotal = raw + iva;
            return (
              <tr key={item.id}>
                <td>{item.cantidad}</td>
                <td>{item.servicio}</td>
                <td>${item.costo.toLocaleString()}</td>
                <td>${iva.toLocaleString()}</td>
                <td>${subtotal.toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
