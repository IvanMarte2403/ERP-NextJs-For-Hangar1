// src/CotizadorAvanzado/AfinacionBasica/AfinacionBasicaCotizador.js
"use client";

import PartCotizador from "./components/PartCotizador";
import ComponentCostos from "./components/ComponentCostos";
import ComponentDescuentos from "./components/ComponentDescuentos";
import ComponentServicios from "./components/ComponentServicios";

/**
 * Main component for the basic tuning advanced quotation form.
 */
export default function AfinacionBasicaCotizador() {
  return (
    <div className="container-cotizador-forms">
      <div className="container-title">
        <h3>Cotizador Avanzado</h3>
      </div>

      <div className="container-main-forms">
        <div className="cotizador-title">
          <img src="CotizadorAvanzado/AfinacionBasica/engrane.svg" alt="" />
          <h4>Afinación Básica</h4>
        </div>

        <div className="container-sections-main">
          <PartCotizador />

          <div className="container-desgloce">
            {/* Component Costos */}
            <ComponentCostos />

            {/* Component Descuentos */}
            <ComponentDescuentos />

            {/* Component Servicios */}
            <ComponentServicios />
          </div>
        </div>
      </div>
    </div>
  );
}
