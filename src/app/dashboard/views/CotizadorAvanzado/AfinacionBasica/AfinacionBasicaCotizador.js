// src/CotizadorAvanzado/AfinacionBasica/AfinacionBasicaCotizador.js
"use client";

import { useState, useMemo } from "react";
import PartCotizador from "./components/PartCotizador";
import ComponentCostos from "./components/ComponentCostos";
import ComponentDescuentos from "./components/ComponentDescuentos";
import ComponentServicios from "./components/ComponentServicios";
import { postCotizadorAvanzado } from "../../../../../../services/CotizadorAvanzado/postCotizadorAvanzado";

export default function AfinacionBasicaCotizador({ orderId }) {
  const [services, setServices] = useState([]);
  const [taxEnabled, setTaxEnabled] = useState(true);
  const [descuento, setDescuento] = useState(0);
  const [discountCode, setDiscountCode] = useState("");
  const [cilindrosNumber, setCilindrosNumber] = useState(null);
  const [includeServices, setIncludeServices] = useState([]);

  const cilindrosCost = {
    3: 1300,
    4: 1400,
    5: 1500,
    6: 1600,
    8: 1800,
    10: 2000,
    12: 2200,
  };

  const handleAddService = (service) => {
    setServices((prev) => [...prev, service]);
  };

  const handleCilindrosChange = (num) => {
    setCilindrosNumber(num);
  };

  const handleIncludeServicesChange = (arr) => {
    setIncludeServices(arr);
  };

  const { subtotal, impuestos, total } = useMemo(() => {
    const costoCilindraje = cilindrosCost[cilindrosNumber] ?? 0;

    const rawSubtotal =
      services.reduce((acc, s) => acc + s.cantidad * s.costo, 0) +
      costoCilindraje;

    const ivaCalc = taxEnabled ? rawSubtotal * 0.16 : 0;
    const rawTotal = rawSubtotal + ivaCalc - descuento;

    return { subtotal: rawSubtotal, impuestos: ivaCalc, total: rawTotal };
  }, [services, cilindrosNumber, taxEnabled, descuento]);

  const toggleTax = () => setTaxEnabled((prev) => !prev);

  const handleEnviarCotizador = async () => {
    try {
      if (!orderId) {
        alert("Falta el ID de la orden.");
        return;
      }
      if (!cilindrosNumber) {
        alert("Selecciona el número de cilindros.");
        return;
      }

      const ivaParam = taxEnabled ? 16 : 0;

      const productsCotizador = services.map((s) => ({
        product_id: s.productId,
        cost_product: s.costo,
        quantity: s.cantidad,
        type: s.tipo,
        subtype: s.subtipo,
        brand: s.marca,
      }));

      const includeServicesPayload = includeServices.map((name) => ({
        name_service: name,
        cost: 0,
      }));

      const descuentosPayload =
        descuento || discountCode
          ? [
              {
                cantidad_descuento: descuento,
                codigo_descuento: discountCode,
              },
            ]
          : [];

      await postCotizadorAvanzado({
        orderId,
        cilindrosNumber,
        iva: ivaParam,
        includeServices: includeServicesPayload,
        descuentos: descuentosPayload,
        productsCotizador,
      });

      alert("Cotizador enviado con éxito");
    } catch (err) {
      console.error(err);
      alert("Error al enviar el cotizador");
    }
  };

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
          <PartCotizador
            onAddService={handleAddService}
            onCilindrosChange={handleCilindrosChange}
            onIncludeServicesChange={handleIncludeServicesChange}
          />

          <div className="container-desgloce">
            <div className="container-componentes-desgloce">
              <ComponentCostos
                subtotal={subtotal}
                impuestos={impuestos}
                descuento={descuento}
                total={total}
                taxEnabled={taxEnabled}
                onToggleTax={toggleTax}
              />

              <ComponentDescuentos
                subtotal={subtotal}
                descuento={descuento}
                setDescuento={setDescuento}
                setDiscountCode={setDiscountCode}
              />

              <ComponentServicios services={services} taxEnabled={taxEnabled} />
            </div>

            <div className="container-buttons">
              <button onClick={handleEnviarCotizador}>Agregar a la Orden</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
