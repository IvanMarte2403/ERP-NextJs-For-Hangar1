// src/CotizadorAvanzado/AfinacionBasica/components/ComponentDescuentos.js
"use client";
import React from "react";

/**
 * Component that handles discount inputs including fixed amount, percentage, and discount codes.
 */
export default function ComponentDescuentos() {
  return (
    <div className="component-descuentos">
      {/* Title */}
      <div className="title">
        <h3>Descuentos</h3>
      </div>

      <div className="container-descuentos">
        {/* Cantidades Left */}
        <div className="cantidades">
          {/* Cantidad en $ */}
          <div className="input">
            <p>Cantidad en $</p>
            <input type="text" />
          </div>

          {/* Cantidad en % */}
          <div className="input">
            <p>Cantidad en %</p>
            <input type="text" />
          </div>

          {/* Total del descuento */}
          <div className="input">
            <p>Total del descuento</p>
            <input type="text" />
          </div>
        </div>

        {/* Código de Descuento Right */}
        <div className="codigo">
          <div className="input">
            <p>Código de Descuento</p>
            <input type="text" />
          </div>
        </div>
      </div>
    </div>
  );
}
