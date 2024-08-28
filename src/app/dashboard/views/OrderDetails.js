"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";

export default function OrderDetails({ orderId }) {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const docRef = doc(db, "orders", orderId.toString()); // Asegúrate de que el orderId sea un string
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
          <img
          src="icons/print.svg"
          />
          
        </div>
      </div>
     
      {/* Container Orden */}
      <div className="container-orden">
        {/* Presupuesto Containerl */}
        <div className="presupuesto-container">
          <div>
            <p>
              Presupuesto
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

        {/* Telefono */}
        <div className="row-client">
          <p>
            Telefono
          </p>

          <p className="nombre-cliente">

          </p>
        </div>
        {/* Coche */}
        <div className="row-client">
          <p>
            Auto: 
          </p>

          <p className="nombre-cliente">
          {`${order.brand || ''} ${order.model || ''}`}
          </p>
        </div>

        {/* Metodo de pago */}

        <div className="row-client">
          <p>
            Método de Pago: 
          </p>

          <p className="nombre-cliente">
          
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

      <table>
        <td>
          <tr>
            Producto
          </tr>

          <tr>
            Marca
          </tr>

          <tr>
            Descripción
          </tr>

          <tr>
            Cantidad 
          </tr>

          <tr>
            Impuestos
          </tr>

          <tr>
            Descuentos
          </tr>
        </td>
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
