"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { PDFDownloadLink } from '@react-pdf/renderer';
import OrderPDF from "./OrderPDF"; // Importa el nuevo componente

export default function OrderDetails({ orderId }) {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const docRef = doc(db, "orders", orderId.toString());
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setOrder(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (!order) {
    return <p>Cargando detalles de la orden...</p>;
  }

  return (
    <div className="order-details">
      <div className="order-title">
          <h2>Detalles de la Orden /  <span>{order.orderNumber}</span></h2>
      </div>

      <div className="subtitle">
        <h3>Fecha: {new Date(order.uploadTime).toLocaleDateString()} </h3>
        <div className="container-print">
          <PDFDownloadLink document={<OrderPDF order={order} />} fileName={`Orden_${order.orderNumber}.pdf`}>
            {({ loading }) => (
              loading ? <p>Cargando PDF...</p> : <img src="icons/print.svg" alt="Imprimir" />
            )}
          </PDFDownloadLink>
        </div>
      </div>
     
      {/* Container Orden */}
      <div className="container-orden">
        {/* Estado de la Orden */}
        <div className={`presupuesto-container ${order.estado_orden?.toLowerCase()}`}>
          <div>
            <p>
              {order.estado_orden || "Presupuesto"}
            </p>
          </div>
        </div>
        
        {/* Nombre del cliente */}
        <div className="row-client">
          <p>
            Nombre del cliente:
          </p>

          <p className="nombre-cliente">
            {`${order.firstName || ''} ${order.lastName || ''}`}
          </p>
        </div> 

        {/* Asesor */}
        <div className="row-client">
          <p>
            Asesor:
          </p>

          <p className="nombre-cliente">
            {order.inCharge}
          </p>
        </div>

        {/* Teléfono */}
        <div className="row-client">
          <p>
            Teléfono:
          </p>

          <p className="nombre-cliente">
            {order.mobile || 'N/A'}
          </p>
        </div>
        
        {/* Auto */}
        <div className="row-client">
          <p>
            Auto: 
          </p>

          <p className="nombre-cliente">
            {`${order.brand || ''} ${order.model || ''}`}
          </p>
        </div>

        {/* Método de Pago */}
        <div className="row-client">
          <p>
            Método de Pago: 
          </p>

          <p className="nombre-cliente">
            {order.paymentMethod || 'N/A'}
          </p>
        </div>

        <div className="precio-container">
          <h2> Total: 12,500</h2>
        </div>
      </div>
      
      {/* Productos & Servicios */}
      <div className="container-productos">
        <h2>Productos & Servicios</h2>      
      </div>

      <table className="table-order">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Marca</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Impuestos</th>
            <th>Descuentos</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>

      <div className="producto-abonar">
        <p>Abonar</p>
      </div>
      <div className="producto-boton">
        Agregar un producto
      </div>

      <div className="abonar"></div>
    </div>
  );
}
