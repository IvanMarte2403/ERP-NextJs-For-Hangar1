// ContainerOrden.js
"use client";

export default function ContainerOrden({ order, formData, handleInputChange }) {
  const estadoClase = order.estado_orden
    ? order.estado_orden.toLowerCase()
    : "";

  return (
    <div className="container-orden">
      <div className={`presupuesto-container ${estadoClase}`}>
        <div>
          <p>{order.estado_orden || "Presupuesto"}</p>
        </div>
      </div>

      {/* Nombre del cliente */}
      <div className="row-client">
        <div className="column-client">
          <p className="span-client">Nombre del cliente:</p>
        </div>
        <div className="column-client">
          <input
            className="input-two"
            name="firstName"
            value={formData.firstName}
            readOnly
          />
        </div>
      </div>

      {/* Asesor */}
      <div className="row-client">
        <div className="column-client">
          <p className="span-client">Asesor:</p>
        </div>
        <div className="column-client">
          <select
            name="inCharge"
            value={formData.inCharge}
            onChange={handleInputChange}
          >
            <option value="Cristian Abarca">Cristian Abarca</option>
            <option value="Jorge Sanchez">Jorge Sanchez</option>
          </select>
        </div>
      </div>

      {/* Teléfono */}
      <div className="row-client">
        <div className="column-client">
          <p className="span-client">Teléfono:</p>
        </div>
        <div className="column-client">
          <input
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Auto y Año */}
      <div className="row-client">
        <div className="column-client">
          <p className="span-client">Auto:</p>
        </div>
        <div className="column-client">
          <input
            className="input-two"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
          />
          <input
            className="input-two"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Kilometraje */}
      <div className="row-client">
        <div className="column-client">
          <p className="span-client">Kilometraje:</p>
        </div>
        <div className="column-client">
          <input
            className="input-two"
            name="kilometros"
            value={formData.kilometros}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Color */}
      <div className="row-client">
        <div className="column-client">
          <p className="span-client">Color:</p>
        </div>
        <div className="column-client">
          <input
            name="color"
            value={formData.color}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Método de pago */}
      <div className="row-client">
        <div className="column-client">
          <p className="span-client">Método de Pago:</p>
        </div>
        <div className="column-client">
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleInputChange}
          >
            <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
            <option value="Tarjeta de Débito">Tarjeta de Débito</option>
            <option value="Depósito">Depósito</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Transferencia">Transferencia</option>
          </select>
        </div>
      </div>
    </div>
  );
}
