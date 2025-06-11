// src/CotizadorAvanzado/AfinacionBasica/components/ComponentCostos.js
"use client";
import React from "react";

/**
 * Component that displays the cost breakdown including subtotal, taxes, discounts, and total.
 */
export default function ComponentCostos() {
  return (
    <div className="component-costos">
      {/* Title */}
      <div className="title">
        <h3>Costos</h3>
      </div>

      <div className="container-desgloce">
        {/* Subtotal */}
        <div className="row-desgloce">
          {/* Title Row */}
          <div className="title-row">
            <p>Subtotal</p>
          </div>
          <div className="cantidad-desgloce">
            <p>$40,000</p>
          </div>
        </div>

        {/* Impuestos  */}
        <div className="row-desgloce">
          {/* Title Row */}
          <div className="title-row">
            <p>Impuestos</p>
          </div>
          <div className="cantidad-desgloce">
            <p>$40,000</p>
          </div>
        </div>

        {/* Descuentos */}
        <div className="row-desgloce">
          {/* Title Row */}
          <div className="title-row">
            <p>Descuentos</p>
          </div>
          <div className="cantidad-desgloce">
            <p>$40,000</p>
          </div>
        </div>

        {/* Total */}
        <div className="row-desgloce">
          {/* Title Row */}
          <div className="title-row">
            <p>Total</p>
          </div>
          <div className="cantidad-desgloce">
            <p>$40,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}
