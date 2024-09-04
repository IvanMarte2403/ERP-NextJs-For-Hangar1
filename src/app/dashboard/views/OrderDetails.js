"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { PDFDownloadLink } from '@react-pdf/renderer';
import OrderPDF from "./OrderPDF"; // Importa el componente para generar el PDF
import { fetchAndStoreOrderDetails } from "../../../../lib/apiService"; // Importa la función de apiService

export default function OrderDetails({ orderId }) {
  const [order, setOrder] = useState(null);
  const [orderNumber, setOrderNumber] = useState(null);

  useEffect(() => {
    const fetchOrderFromFirebase = async () => {
      try {
        console.log("Iniciando consulta en Firebase para obtener el orderNumber usando orderID:", orderId);

        // Consulta Firebase usando el orderID
        const docRef = doc(db, "orders", orderId.toString());
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const orderData = docSnap.data();
          console.log("Detalles de la orden obtenidos de Firebase:", orderData);

          // Obtener el orderNumber
          const fetchedOrderNumber = orderData.orderNumber;
          setOrderNumber(fetchedOrderNumber);

          // Si obtenemos el orderNumber, hacemos la consulta a la API
          if (fetchedOrderNumber) {
            console.log("Iniciando consulta de detalles de la orden a la API con orderNumber:", fetchedOrderNumber);
            await fetchAndStoreOrderDetails(fetchedOrderNumber); // Consulta y almacena los detalles
            console.log("Consulta de detalles de la orden finalizada.");
          } else {
            console.log("No se encontró el orderNumber en Firebase.");
          }

          setOrder(orderData);
        } else {
          console.log("No se encontró el documento en Firebase!");
        }
      } catch (error) {
        console.error("Error obteniendo la orden de Firebase:", error);
      }
    };

    fetchOrderFromFirebase(); // Ejecutar la consulta al cargar el componente
  }, [orderId]);

  if (!order) {
    return <p>Cargando detalles de la orden...</p>;
  }

  // Verifica si 'inspectionItems' está dentro de `order.data` si viene de la API o de Firebase.
  const inspectionItems = order.inspectionItems || [];

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
          <p>Nombre del cliente:</p>
          <p className="nombre-cliente">
            {`${order.firstName || ''} ${order.lastName || ''}`}
          </p>
        </div> 

        {/* Asesor */}
        <div className="row-client">
          <p>Asesor:</p>
          <p className="nombre-cliente">
            {order.inCharge}
          </p>
        </div>

        {/* Teléfono */}
        <div className="row-client">
          <p>Teléfono:</p>
          <p className="nombre-cliente">
            {order.mobile || 'N/A'}
          </p>
        </div>
        
        {/* Auto */}
        <div className="row-client">
          <p>Auto:</p>
          <p className="nombre-cliente">
            {`${order.brand || ''} ${order.model || ''}`}
          </p>
        </div>

        {/* Método de Pago */}
        <div className="row-client">
          <p>Método de Pago:</p>
          <p className="nombre-cliente">
            {order.paymentMethod || 'N/A'}
          </p>
        </div>

        <div className="precio-container">
          <h2>Total: 12,500</h2>
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
            <th>Costo</th>
            <th>Cantidad</th>
            <th>Impuestos</th>
            <th>Descuentos</th>
          </tr>
        </thead>
        <tbody>
          {/* Itera sobre los inspectionItems */}
          {inspectionItems.length > 0 ? (
            inspectionItems.map((item, index) => (
              <tr key={index}>
                <td>{item.inspectionItemName}</td>
                <td>{item.brand || 'N/A'}</td>
                <td>{item.partUnitPrice}</td>
                <td>{item.quantity}</td>
                <td>{item.impuestos || 'N/A'}</td>
                <td>{item.discounts || 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No hay productos o servicios asociados</td>
            </tr>
          )}
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
