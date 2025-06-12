// DesgloseCantidades.js
"use client";

/**
 * Muestra el desglose de cantidades, folios y total.
 * Calcula internamente todos los valores necesarios.
 */
export default function DesgloseCantidades({
  inspectionItems = [],
  order = {},
  abonosSum = 0,
}) {
  /* --- helpers --- */
  const calcSubtotal = (item) => {
    const cost = parseFloat(item.partUnitPrice) || 0;
    const qty = parseInt(item.quantity) || 0;
    const iva = item.impuestos === "16" ? 0.16 : 0;
    return cost * qty * (1 + iva);
  };

  const totalProductos = inspectionItems.reduce(
    (acc, it) => acc + calcSubtotal(it),
    0
  );

  const descuento = order.discount?.cantidad_dinero
    ? parseFloat(order.discount.cantidad_dinero)
    : 0;

  const impuestosValue = inspectionItems.reduce((acc, it) => {
    if (it.impuestos === "16") {
      return acc + parseFloat(it.partUnitPrice) * parseInt(it.quantity) * 0.16;
    }
    return acc;
  }, 0);

  const totalFinal = totalProductos - descuento - impuestosValue;

  /* --- render --- */
  return (
    <div className="container-desgloce-cantidades">
      <div className="container-cantidades">
        <div className="row-cantidad">
          <p>Total de Productos: </p>
          <p>
            $
            {totalProductos.toLocaleString("es-MX", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="row-cantidad">
          <p>Descuentos: </p>
          <p>
            $
            {descuento.toLocaleString("es-MX", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="row-cantidad">
          <p>Impuestos: </p>
          <p>
            $
            {impuestosValue.toLocaleString("es-MX", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="row-cantidad">
          <p>Total Anticipos: </p>
          <p>
            $
            {abonosSum.toLocaleString("es-MX", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>

      {/* Folios y total final */}
      <div className="container-folios">
        <div className="folios">
          <div className="row-cantidad">
            <p>Folio Garantía: </p>
            {order.garantia_number && <p>#{order.garantia_number}</p>}
          </div>
          <div className="row-cantidad">
            <p>Número Remisión: </p>
            {order.remision_number && <p>#{order.remision_number}</p>}
          </div>
        </div>

        <div className="total">
          <h1>
            Total $
            {totalFinal.toLocaleString("es-MX", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h1>
        </div>
      </div>
    </div>
  );
}
