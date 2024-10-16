"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { PDFDownloadLink } from '@react-pdf/renderer';
import OrderPDF from "./OrderPDF"; 
import Link from 'next/link'; // Importa el componente Link de Next.js
import ModalProduct from './Modal/ModalProduct'
import ModalAbonar from './Modal/ModalAbonar';



export default function OrderDetails({ orderId }) {
  console.log("OrderDetails");
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
  });{}

  const [abonos, setAbonos] = useState([]); // Estado para los abonos
  const [abonosSum, setAbonosSum] = useState(0); // Estado para la suma de los abonos


  //--Modal-- 
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Función para abrir el modal
  const openModal = () => {
    setIsModalOpen(true);
    document.querySelector('.content').classList.add('main-blur'); // Agregar la clase cuando el modal está abierto

  };

  const [isAbonarModalOpen, setIsAbonarModalOpen] = useState(false);

  // Función para cerrar el modal
  const closeModal = async () => {
    setIsModalOpen(false);
    document.querySelector('.content').classList.remove('main-blur'); // Quitar la clase cuando el modal se cierra
      // Recargar la información de la orden para actualizar los productos
      const orderDocRef = doc(db, "orders", orderId.toString());
      const docSnap = await getDoc(orderDocRef);
  
      if (docSnap.exists()) {
          const orderData = docSnap.data();
          setOrder(orderData); // Actualizar el estado de la orden con los nuevos productos
          const inspectionItems = orderData.inspectionItems || [];
  
          // Calcular el total después de agregar los productos
          const totalSubtotal = inspectionItems.reduce((acc, item) => {
              const cost = item.partUnitPrice || 0;
              const quantity = item.quantity || 0;
              const taxAmount = cost * quantity * taxRate;
              const subtotal = (cost * quantity) + taxAmount - discount;
              return acc + subtotal;
          }, 0);
  
          setTotalAmount(totalSubtotal); // Actualizar el total con los productos nuevos
      } else {
          console.error("Error: No se encontró el documento después de cerrar el modal");
      }
  };
  // Función para abrir el modal de abonar
  const openAbonarModal = () => {
    setIsAbonarModalOpen(true);
    document.querySelector('.content').classList.add('main-blur');
  };


//--- Abonos ---

  // Función para actualizar los abonos en Firebase
// Función para actualizar los abonos en Firebase y recalcular el total
const updateAbonosInFirebase = (updatedAbonos) => {
  setAbonos(updatedAbonos); // Actualizar los abonos en el estado local

  // Recalcular la suma de abonos
  const abonosTotal = updatedAbonos.reduce((acc, abono) => acc + parseFloat(abono.cantidad_abono || 0), 0);
  setAbonosSum(abonosTotal);

  // Recalcular el total de la orden restando los abonos
  const totalSubtotal = order.inspectionItems.reduce((acc, item) => {
    const cost = item.partUnitPrice || 0;
    const quantity = item.quantity || 0;
    const taxAmount = cost * quantity * taxRate;
    const subtotal = (cost * quantity) + taxAmount - discount;
    return acc + subtotal;
  }, 0);

  setTotalAmount(totalSubtotal - abonosTotal); // Actualizar el total con los abonos
};
 // Función para cerrar el modal de abonar
 const closeAbonarModal = async () => {
  setIsAbonarModalOpen(false);
  document.querySelector('.content').classList.remove('main-blur');


};

// --- Productos --- 
  // Función para guardar el nuevo producto en Firebase
  const saveProductToFirebase = async (orderId, newProduct) => {
    try {
      const orderDocRef = doc(db, "orders", orderId.toString());
      const orderSnap = await getDoc(orderDocRef);

      if (orderSnap.exists()) {
        const existingOrder = orderSnap.data();
        const updatedInspectionItems = [...existingOrder.inspectionItems, newProduct];

        await updateDoc(orderDocRef, { inspectionItems: updatedInspectionItems });
        console.log("Producto agregado exitosamente");


        // Después de guardar el producto, recargar la lista de productos
        await closeModal(); // Recargar la lista de productos en tiempo real
      }
    } catch (error) {
      console.error("Error al guardar el producto:", error);
    }
  };

  const taxRate = 0.16; // Impuesto del 16%
  const discount = 0; // Descuento inicial en 0


//--- Consulta de Datos ---

  useEffect(() => {''
    // Consulta en Firebase para obtener los detalles de la orden
    const fetchOrderFromFirebase = async () => {
      try {
        console.log("Iniciando consulta en Firebase para obtener la orden usando orderID:", orderId);
        
         // Verificar si orderId está definido
      if (!orderId) {
        console.error("Error: orderId es undefined o null");
        return;
      }
      
        // Consulta Firebase usando el orderID
        const docRef = doc(db, "orders", orderId.toString());
        console.log("Referencia del documento creada:", docRef);

        const docSnap = await getDoc(docRef);
        console.log("Resultado de la consulta:", docSnap.exists());


        if (docSnap.exists()) {
          const orderData = docSnap.data();
          console.log("Detalles de la orden obtenidos de Firebase:", orderData);

          setOrder(orderData);

                // Obtener abonos[] si existen
          const abonosList = orderData.abonos || [];
          setAbonos(abonosList);

              // Calcular la suma de los abonos
          const abonosTotal = abonosList.reduce((acc, abono) => acc + parseFloat(abono.cantidad_abono || 0), 0);
          setAbonosSum(abonosTotal);


          setFormData({
            firstName: orderData.firstName,
            lastName: orderData.lastName,
            mobile: orderData.mobile,
            inCharge: orderData.inCharge,
            brand: orderData.brand,
            model: orderData.model,
            paymentMethod: orderData.paymentMethod,
          });

          // Calcular los inspectionItems
          const inspectionItems = orderData.inspectionItems || [];
          const totalSubtotal = inspectionItems.reduce((acc, item) => {
            const cost = item.partUnitPrice || 0;
            const quantity = item.quantity || 0;
            const taxAmount = cost * quantity * taxRate;
            const subtotal = (cost * quantity) + taxAmount - discount;
            return acc + subtotal;
          }, 0);

          setTotalAmount(totalSubtotal - abonosTotal); // Establecer el total
        } else {
          console.log("No se encontró el documento en Firebase!");
          const newOrderData = {
            firstName: '',
            lastName: '',
            mobile: '',
            inCharge: '',
            brand: '',
            model: '',
            paymentMethod: '',
            orderNumber: orderId,  // Utiliza orderId como el número de orden
            inspectionItems: [],  // Inicializa una lista vacía de productos o servicios
            uploadTime: new Date().toISOString() // Agregar el tiempo actual

          };
           // Crear el nuevo documento en Firebase
          await setDoc(docRef, newOrderData);

            // Establecer los datos de la nueva orden
          setOrder(newOrderData);
          setFormData(newOrderData);
          setTotalAmount(0);
        }
      } catch (error) {
        console.error("Error obteniendo la orden de Firebase:", error);
      }
    };

    fetchOrderFromFirebase(); // Ejecutar la consulta al cargar el componente
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

  // Actualizar los detalles en Firebase al darle guardar si existen cambios
  const handleSave = async () => {
    try {
      // Referencia al documento en Firebase
      const orderDocRef = doc(db, "orders", orderId.toString());

      // Datos actualizados que vamos a guardar
      const updatedOrderData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobile: formData.mobile,
        inCharge: formData.inCharge,
        brand: formData.brand,
        model: formData.model,
        paymentMethod: formData.paymentMethod,
        uploadTime: new Date(formData.uploadTime).toISOString() // Guardar la fecha y hora modificada


      };

      // Actualizar el documento en Firebase
      await updateDoc(orderDocRef, updatedOrderData);

      console.log("== Orden actualizada en Firebase con éxito ==");
      setIsEdited(false); // Deshabilitar el botón de guardar después de guardar
    } catch (error) {
      console.error("Error actualizando la orden en Firebase:", error);
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
      <div className="content">
      <div className="order-title">
        <h2>Detalles de la Orden /  <span>{order.orderNumber}</span></h2>
      </div>

      <div className="subtitle">
          <h3>
            <p>Fecha</p>
            <input
            type="datetime-local"
            name="uploadTime"
            value={formData.uploadTime ? new Date(formData.uploadTime).toISOString().slice(0, 16) : ''} 

            onChange={handleInputChange}
            />
        </h3>        
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
          <div>
          <h2>Total: ${totalAmount.toFixed(2)}</h2> {/* Mostrar el total calculado */}
          </div>
       
        </div>
      </div>
      {/* Productos & Servicios */}
      <div className="container-productos">
        <h2>Productos & Servicios</h2>

        <button
          onClick={openModal}
          >
          Agregar Producto
        </button>
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

      <div className="container-subtotal">
          <h3>Subtotal Productos: ${inspectionItems.reduce((acc, item) => acc + parseFloat(calculateSubtotal(item)), 0).toFixed(2)}
          </h3>
      </div>
      
      {/* Anticipo */}
      <div className="producto-abonar">
        <p
          onClick={openAbonarModal}
        >Anticipo</p>
      </div>

      <div className="container-historial-de-pagos">
          {abonos.length > 0 && (
            <>
              <h3>Historial de Pagos</h3>
              <table>
                <thead>
                  <tr>
                    <th>Cantidad</th>
                    <th>Método de Pago</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {abonos.map((abono, index) => (
                    <tr key={index}>
                      <td>${abono.cantidad_abono}</td>
                      <td>{abono.metodo_pago}</td>
                      <td>{new Date(abono.fecha_abono).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="containerAbonosTotal">
                <h3>
                Subtotal Abonos: ${abonosSum.toFixed(2)} {/* Muestra la suma de los abonos */}
                </h3>
              </div>
            </>
          )}
        </div>




     

      <div className="abonar"></div>
      </div>

          {/* Mostrar el modal */}
        <ModalProduct
        isOpen={isModalOpen}
        onClose={closeModal}
        orderId={orderId}
        onSaveProduct={saveProductToFirebase}
        className= "modalProduct"
      />

            {/* Mostrar el modal de abonar */}
            <ModalAbonar
            isOpen={isAbonarModalOpen}
            onClose={closeAbonarModal}
            orderId={orderId}
            existingAbonos={order?.abonos || []} // Pasar los abonos actuales si existen
            onUpdateAbonos={updateAbonosInFirebase} // Pasar la función de actualización
          />
    </div>
  );
}
