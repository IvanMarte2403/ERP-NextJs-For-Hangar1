// src/CotizadorAvanzado/AfinacionBasica/components/ComponentCostos.js
"use client";
import React from "react";

/**
 * Displays subtotal, taxes, discounts and total.
 */
export default function ComponentCostos({
  subtotal,
  impuestos,
  descuento,
  total,
  taxEnabled,
  onToggleTax,
}) {
  return (
    <div className="component-costos">
      {/* Title */}
      <div className="title">
        <h3>Costos</h3>
      </div>



      <div className="container-desgloce">
        {/* Subtotal */}
        <div className="row-desgloce">
          <div className="title-row">
            <p>Subtotal</p>
          </div>
          <div className="cantidad-desgloce">
            <p>${subtotal.toLocaleString()}</p>
          </div>
        </div>

      

        {/* Impuestos */}
        <div className="row-desgloce">
          <div className="title-row">
            <p>Impuestos</p>
          </div>
          <div className="cantidad-desgloce">
            <p>${impuestos.toLocaleString()}</p>
          </div>
        </div>

        {/* Descuentos */}
        <div className="row-desgloce">
          <div className="title-row">
            <p>Descuentos</p>
          </div>
          <div className="cantidad-desgloce">
            <p>${descuento.toLocaleString()}</p>
          </div>
        </div>

        {/* Total */}
        <div className="row-desgloce">
          <div className="title-row">
            <p>Total</p>
          </div>
          <div className="cantidad-desgloce">
            <p>${total.toLocaleString()}</p>
          </div>
        </div>
      </div>

        {/* IVA toggle */}
        <div className="iva-toggle">
          <label>
            <input
              type="checkbox"
              checked={taxEnabled}
              onChange={onToggleTax}
            />
            <p>Incluir IVA</p>
          </label>
        </div>
    </div>
  );
}
