// CotizadorAvanzado.js
"use client";

import { useState } from "react";
import AfinacionBasicaCotizador from "../CotizadorAvanzado/AfinacionBasica/AfinacionBasicaCotizador";

export default function CotizadorAvanzado({ orderId }) {
  const [selectedView, setSelectedView] = useState("afinacionBasica");

  return (
    <div className="cotizador-avanzado-main">
      {selectedView === "afinacionBasica" && (
        <AfinacionBasicaCotizador orderId={orderId} />
      )}
    </div>
  );
}
