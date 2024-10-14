"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { PDFDownloadLink } from '@react-pdf/renderer';
import OrderPDF from "./OrderPDF"; 
import Link from 'next/link'; // Importa el componente Link de Next.js

export default function OrderDetailsNew({ orderId }) {
  const [order, setOrder] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0); // Estado para almacenar el total
  const [isEdited, setIsEdited] = useState(false); // Estado para habilitar el botón de guardar
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    inCharge: '',
    brand: '',
    model: '',
    paymentMethod: ''
  });

  const taxRate = 0.16; // Impuesto del 16%
  const discount = 0; // Descuento inicial en 0
  
  useEffect(() => {
    console.log('Orden Nueva');
    const fetchOrderFromFirebase = async () => {
      try {
        console.log("Iniciando consulta en Firebas~e para obtener la orden usando orderID:", orderId);
  
        const docRef = doc(db, "orders", orderId.toString());
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          const orderData = docSnap.data();
          console.log("Detalles de la orden obtenidos de Firebase:", orderData);

           // Verificar si el campo orderID existe, y si no, agregarlo
           if (!orderData.orderID) {
            await updateDoc(docRef, { orderID: orderId.toString() });
            console.log("Campo orderID agregado a la orden.");
            orderData.orderID = orderId.toString(); // Actualizar localmente
          }
  
          setOrder(orderData);
          setFormData({
            firstName: orderData.firstName,
            lastName: orderData.lastName,
            mobile: orderData.mobile,
            inCharge: orderData.inCharge,
            brand: orderData.brand,
            model: orderData.model,
            paymentMethod: orderData.paymentMethod,
            orderID: orderId.toString(), // Usar orderId como el valor de orderID

          });
  
          const inspectionItems = orderData.inspectionItems || [];
          const totalSubtotal = inspectionItems.reduce((acc, item) => {
            const cost = item.partUnitPrice || 0;
            const quantity = item.quantity || 0;
            const taxAmount = cost * quantity * taxRate;
            const subtotal = (cost * quantity) + taxAmount - discount;
            return acc + subtotal;
          }, 0);
  
          setTotalAmount(totalSubtotal);
        } else {
          console.log("No se encontró el documento en Firebase!");
        }
      } catch (error) {
        console.error("Error obteniendo la orden de Firebase:", error);
      }
    };
  
    fetchOrderFromFirebase();
  }, [orderId]);
  

  // Habilita el Botón de Guardar
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setIsEdited(true); // Habilita el botón de guardar cuando hay cambios
  };

  const handleSave = async () => {
    try {
      const orderDocRef = doc(db, "orders", orderId.toString()); // Usa el orderId generado anteriormente
    
      const newOrderData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobile: formData.mobile,
        inCharge: formData.inCharge,
        brand: formData.brand,
        model: formData.model,
        paymentMethod: formData.paymentMethod,
        // Rellena los campos adicionales en blanco
        assignedTo: formData.assignedTo || '',
        assignedToUserID: formData.assignedToUserID || '',
        businessName: formData.businessName || '',
        documentType: formData.documentType || '',
        email: formData.email || '',
        identificationNumber: formData.identificationNumber || '',
        lastUpdatedTime: formData.lastUpdatedTime || '',
        licensePlate: formData.licensePlate || '',
        mainPhone: formData.mainPhone || '',
        notes: formData.notes || '',
        orderID: formData.orderNumber || '', // Asigna el mismo valor que orderNumber
        inspectionFormStatus: formData.inspectionFormStatus || '',
        kilometers: formData.kilometers || '',
        orderNumber: formData.orderNumber || '',
        orderType: formData.orderType || '',
        phase: formData.phase || '',
        promisedDate: formData.promisedDate || '',
        repairOrderKey: formData.repairOrderKey || '',
        repairShopID: formData.repairShopID || '',
        tower: formData.tower || '',
        uploadTime: formData.uploadTime || '',
        uploadedByUserID: formData.uploadedByUserID || '',
        vin: formData.vin || '',
        year: formData.year || '',
      };
    
      await setDoc(orderDocRef, newOrderData); // Crear el documento en Firebase
      console.log("== Nueva Orden creada en Firebase con éxito ==");
    
      setIsEdited(false); // Deshabilitar el botón de guardar después de guardar
    } catch (error) {
      console.error("Error creando la nueva orden en Firebase:", error);
    }
  };

  
  

  if (!order) {
    return <p>Cargando detalles de la orden...</p>;
  }

  const inspectionItems = order.inspectionItems || [];

  // Calculo del total con el subtotal 
  const calculateSubtotal = (item) => {
    const cost = item.partUnitPrice || 0;
    const quantity = item.quantity || 0;
    const taxAmount = cost * quantity * taxRate;
    const subtotal = (cost * quantity) + taxAmount - discount;
    return subtotal.toFixed(2);
  };

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

          {isEdited && (
            <div className="save-container" onClick={handleSave}>
              <img src="icons/save.svg" alt="Guardar" />
            </div>
          )}
        </div>
      </div>
                 {/* Checks Container  */}
      <div className="checks-container">
          <Link
            className="link"
            href = '/CheckIn'
          >
            <p>
              Check-in
            </p>
          </Link>
      </div>
  
      {/* Container Orden */}
      <div className="container-orden">
        {/* Estado de la Orden */}
        <div className={`presupuesto-container ${order.estado_orden?.toLowerCase()}`}>
          <div>
            <p>{order.estado_orden || "Presupuesto"}</p>
          </div>
        </div>

        {/* Campos Editables */}
        <div className="row-client">
            <div className="column-client">
              <p className="span-client">Nombre del cliente:</p>
            </div>
            
            <div className="column-client">
              <input 
                className="input-two"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
              <input
                className="input-two"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
        </div>

        <div className="row-client">

          <div className="column-client">
            <p className="span-client">Asesor:</p>
          </div>
          <div className="column-client">
            <input
              name="inCharge"
              value={formData.inCharge}
              onChange={handleInputChange}
            />
          </div>
        </div>
        

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
                name="model"
                value={formData.model}
                onChange={handleInputChange}
              />
          </div>
      
        </div>

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
                </select>
              </div>
          
          </div>

        <div className="precio-container">
          <h2>Total: ${totalAmount.toFixed(2)}</h2> {/* Mostrar el total calculado */}
        </div>
      </div>
      {/* Productos & Servicios */}
      <div className="container-productos">
        <h2>Productos & Servicios</h2>
      </div>
      {/* Productos & Servicios */}
      <table className="table-order">
        <thead className="no-hover">
          <tr className="no-hover">
            <th>Producto</th>
            <th>Marca</th>
            <th>Costo</th>
            <th>Cantidad</th>
            <th>Impuestos</th>
            <th>Descuentos</th>
            <th>SubTotal</th>
          </tr>
        </thead>
        <tbody>
          {inspectionItems.length > 0 ? (
            inspectionItems.map((item, index) => (
              <tr key={index}>
                <td>{item.inspectionItemName}</td>
                <td>{item.brand || 'N/A'}</td>
                <td>${(item.partUnitPrice || 0).toFixed(2)}</td>
                <td>{item.quantity || 0}</td>
                <td>${((item.partUnitPrice || 0) * taxRate).toFixed(2)}</td>
                <td>${discount.toFixed(2)}</td>
                <td>${calculateSubtotal(item)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No hay productos o servicios asociados</td>
            </tr>
          )}
        </tbody>
      </table>  

      
      {/* Abonar */}
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
