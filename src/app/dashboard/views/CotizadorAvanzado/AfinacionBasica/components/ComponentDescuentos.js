// src/CotizadorAvanzado/AfinacionBasica/components/ComponentDescuentos.js
"use client";
import React, { useState } from "react";

/**
 * Handles discount inputs in currency or percentage and keeps them in sync.
 */
export default function ComponentDescuentos({
  subtotal,
  descuento,
  setDescuento,
}) {
  const [amountStr, setAmountStr] = useState(
    descuento ? descuento.toString() : ""
  );
  const [percentStr, setPercentStr] = useState("");

  /* Updates both fields when amount changes */
  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmountStr(value);
    const numeric = parseFloat(value) || 0;
    const percent = subtotal ? (numeric / subtotal) * 100 : 0;
    setPercentStr(percent ? percent.toFixed(2) : "");
    setDescuento(numeric);
  };

  /* Updates both fields when percent changes */
  const handlePercentChange = (e) => {
    const value = e.target.value;
    setPercentStr(value);
    const numericPercent = parseFloat(value) || 0;
    const amount = subtotal ? (numericPercent / 100) * subtotal : 0;
    setAmountStr(amount ? amount.toFixed(2) : "");
    setDescuento(amount);
  };

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
            <input
              type="text"
              value={amountStr}
              onChange={handleAmountChange}
            />
          </div>

          {/* Cantidad en % */}
          <div className="input">
            <p>Cantidad en %</p>
            <input
              type="text"
              value={percentStr}
              onChange={handlePercentChange}
            />
          </div>

          {/* Total del descuento */}
          <div className="input">
            <p>Total del descuento</p>
            <p>${descuento.toLocaleString()}</p>
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
