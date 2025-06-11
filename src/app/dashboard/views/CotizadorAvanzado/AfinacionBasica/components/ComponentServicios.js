// src/CotizadorAvanzado/AfinacionBasica/components/ComponentServicios.js
"use client";
import React from "react";

/**
 * Component that displays a table of services with quantities, costs, taxes, and subtotals.
 */
export default function ComponentServicios() {
  // Sample data for demonstration purposes
  const sampleServices = [
    { cantidad: 1, servicio: "Cambio de aceite", costo: 500, iva: 80, subtotal: 580 },
    { cantidad: 2, servicio: "Alineación y balanceo", costo: 300, iva: 48, subtotal: 696 },
    { cantidad: 1, servicio: "Revisión de frenos", costo: 400, iva: 64, subtotal: 464 },
  ];

  return (
    <div className="component-servicios">
      {/* Title */}
      <div className="title">
        <h3>Servicios</h3>
      </div>

      <div className="container-table">
        {/* Services Table */}
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
                {sampleServices.map((item, index) => (
                    <tr key={index}>
                    <td>{item.cantidad}</td>
                    <td>{item.servicio}</td>
                    <td>${item.costo.toLocaleString()}</td>
                    <td>${item.iva.toLocaleString()}</td>
                    <td>${item.subtotal.toLocaleString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
      </div>

    </div>
  );
}
