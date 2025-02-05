"use client";

import { useEffect, useState} from "react";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { PDFDownloadLink } from '@react-pdf/renderer';
import OrderPDF from "./OrderPDF"; 
import Link from 'next/link'; // Importa el componente Link de Next.js
import RemisionPDF from "./RemisionPDF"; 
import AnticiposPDF from './AnticiposPDF';
import CotizacionPDF from "./CotizacionPDF";


//-- Modal --
import ModalProduct from './Modal/ModalProduct'
import ModalAbonar from './Modal/ModalAbonar';
import ModalEditProduct  from "./Modal/EditProduct";
import ModalDiscount from "./Modal/ModalDiscount";

export default function OrderDetails({ orderId, isNewOrder, userEmail }) {
  console.log("OrderDetails");
  const [pdfReady, setPdfReady] = useState(false);  
  const [order, setOrder] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0); // Estado para almacenar el total
  const [isEdited, setIsEdited] = useState(false); // Estado para habilitar el botón de 
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    inCharge: '',
    brand: '',
    model: '',
    paymentMethod: '',
    year: '',
    kilometros: '',
    color: '',

  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [abonos, setAbonos] = useState([]); // Estado para los abonos
  const [abonosSum, setAbonosSum] = useState(0); // Estado para la suma de los abonos 
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfUrlRemision, setPdfUrlRemision] = useState(null);
  const [pdfUrlAnticipos, setPdfUrlAnticipos] = useState(null);
  const [pdfUrlCotizacion, setPdfUrlCotizacion] = useState(null);



  // LISTAS de usuarios autorizados
  const usersTodos = [
    "emilio@hangar1.com.mx",
    "ivan@hangar1.com.mx",
    "oliver@hangar1.com.mx",
    "prueba10@gmail.com",
    "ary@hangar1.com.mx",
    "gaby@hangar1.com.mx",
    "administracion-2@hangar1.com.mx",
    "administracion-a@hangar1.com.mx",

  ];

  const usersGarantias = [
    "ary@hangar1.com.mx",
    "gaby@hangar1.com.mx",
    "administracion-2@hangar1.com.mx",
    "administracion-a@hangar1.com.mx",
    "ivan@hangar1.com.mx",

  ];

  const usersCotizaciones = [
    "isaac@hangar1.com.mx",
    "asesor2@hangar1.com.mx",
    "asesor1@hangar1.com.mx",
    "gaby@hangar1.com.mx",
    "ivan@hangar1.com.mx",
  ];

  const usersAnticipos = [
    "ary@hangar1.com.mx",
    "gaby@hangar1.com.mx",
    "administracion-2@hangar1.com.mx",
    "administracion-a@hangar1.com.mx",
    "ivan@hangar1.com.mx",

  ];

  // Verificar el correo actual
  const canSeeRemision = usersTodos.includes(userEmail); 
  const canSeeGarantia = usersGarantias.includes(userEmail);
  const canSeeCotizacion = usersCotizaciones.includes(userEmail);
  const canSeeAnticipo = usersAnticipos.includes(userEmail);

  //--Modal-- 
    const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);

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

  // -- Modal Edit -- 
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Función para abrir el modal de edición
    const openEditModal = () => {
      setIsEditModalOpen(true);
      document.querySelector('.content').classList.add('main-blur'); // Agregar la clase cuando el modal está abierto

    };

    // Función para cerrar el modal de edición
    const closeEditModal = () => {
      setIsEditModalOpen(false);
      document.querySelector('.content').classList.remove('main-blur'); // Quitar la clase cuando el modal se cierra

       // Recalcular el total si el estado de order cambió
      if (order && order.inspectionItems) {
        const updatedTotalAmount = calculateTotalAmount(order.inspectionItems);
        setTotalAmount(updatedTotalAmount);
      }

    };

    const toggleDropdown = () => {
      setIsDropdownOpen((prev) => !prev);
    };

    const openDiscountModal = () => {
      setIsDiscountModalOpen(true);
      document.querySelector('.content').classList.add('main-blur');
    };
    
    const closeDiscountModal = () => {
      setIsDiscountModalOpen(false);
      document.querySelector('.content').classList.remove('main-blur');
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
          uploadTime: orderData.uploadTime,
          year: orderData.year,
          kilometros: orderData.kilometros,
          color: orderData.color || '', 

        });

        // Calcular los inspectionItems
        const inspectionItems = orderData.inspectionItems || [];
        const totalSubtotal = inspectionItems.reduce((acc, item) => {
          const cost = parseFloat(item.partUnitPrice) || 0;
          const quantity = parseInt(item.quantity) || 0;
          const impuestos = item.impuestos === "16" ? 0.16 : 0; // Verificar el campo "impuestos"
          const taxAmount = cost * quantity * impuestos;
          const subtotal = (cost * quantity) + taxAmount;
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

  useEffect(() => {''
    // Consulta en Firebase para obtener los detalles de la orden


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
        mobile: formData.mobile,
        inCharge: formData.inCharge,
        brand: formData.brand,
        paymentMethod: formData.paymentMethod,
        year: formData.year,
        kilometros: formData.kilometros,
        color: formData.color,
      };

      // Actualizar el documento en Firebase
      await updateDoc(orderDocRef, updatedOrderData);

      console.log("== Orden actualizada en Firebase con éxito ==");
      alert("Se ha guardado correctamente"); // Mostrar alerta
      await fetchOrderFromFirebase();

      setIsEdited(false); // Deshabilitar el botón de guardar después de guardar
    } catch (error) {
      console.error("Error actualizando la orden en Firebase:", error);
    }
  };

  useEffect(() => {
    if (order && order.inspectionItems) {
      const updatedTotalAmount = calculateTotalAmount(order.inspectionItems) - abonosSum;
      setTotalAmount(updatedTotalAmount);
    }
  }, [order, abonosSum]); // Cambiamos la dependencia a 'order'

  if (!order) {
    return <p>Cargando detalles de la orden...</p>;
  }

  const inspectionItems = order.inspectionItems || [];

  // Ajustar el cálculo de impuestos en cada producto
  const calculateProductTax = (item) => {
    const cost = parseFloat(item.partUnitPrice) || 0;
    const quantity = parseInt(item.quantity) || 0;
    const impuestos = item.impuestos === "16" ? 0.16 : 0;
    return (cost * quantity * impuestos).toFixed(2);
  };

  // Calculo del subtotal por producto considerando los impuestos
  const calculateSubtotal = (item) => {
    const cost = parseFloat(item.partUnitPrice) || 0;
    const quantity = parseInt(item.quantity) || 0;
    const impuestos = item.impuestos === "16" ? 0.16 : 0;
    const taxAmount = cost * quantity * impuestos;
    const subtotal = (cost * quantity) + taxAmount;
    return subtotal.toFixed(2);
  };

  // Ajustar el total considerando los impuestos y el subtotal actualizado
  const calculateTotalAmount = (items) => {
    return items.reduce((acc, item) => {
      const cost = parseFloat(item.partUnitPrice) || 0;
      const quantity = parseInt(item.quantity) || 0;
      const impuestos = item.impuestos === "16" ? 0.16 : 0;
      const taxAmount = cost * quantity * impuestos;
      const subtotal = (cost * quantity) + taxAmount;
      return acc + subtotal;
    }, 0);
  };
  
  const calculateTotalSubtotal = (items) => {
    return items.reduce((acc, item) => acc + parseFloat(calculateSubtotal(item)), 0);
  };


// ==== Número De Garantía ====

const handleGenerateGuaranteeNumber = async () => {
  console.log("== handleGenerateGuaranteeNumber: Iniciando ==");

  try {
    // 1) Referencia al documento de la orden en la colección "orders"
    const orderRef = doc(db, "orders", order.orderNumber.toString());
    console.log("== handleGenerateGuaranteeNumber: orderRef ==", orderRef.path);

    // 2) Obtenemos los datos de la orden
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
      console.log("No existe la orden con orderNumber:", order.orderNumber);
      return;
    }

    const orderData = orderSnap.data();
    console.log("== handleGenerateGuaranteeNumber: Datos actuales de la orden ==", orderData);

    // 3) Revisamos si YA existe 'garantia_number'
    if (typeof orderData.garantia_number === "number") {
      // Si existe, solo lo usamos
      console.log("El campo 'garantia_number' YA existe:", orderData.garantia_number);

      // Reflejamos en el estado local (para que se muestre en el PDF, si corresponde)
      setOrder({ ...order, garantia_number: orderData.garantia_number });
      return;
    }

    // 4) Si NO existe, consultamos la colección "contadores", doc "contadores-garantia"
    const contadoresRef = doc(db, "contadores", "contadores-garantia");
    console.log("== handleGenerateGuaranteeNumber: contadoresRef ==", contadoresRef.path);

    let contadoresSnap = await getDoc(contadoresRef);

    if (!contadoresSnap.exists()) {
      console.log("No se encontró el documento 'contadores-garantia'. Creándolo...");

      // Creamos el documento con "garantia: 0" (o el valor inicial que desees)
      await setDoc(contadoresRef, { garantia: 0 });
      console.log("Documento 'contadores-garantia' creado con 'garantia = 0'");

      // Volvemos a leerlo para continuar la lógica
      contadoresSnap = await getDoc(contadoresRef);

      if (!contadoresSnap.exists()) {
        // Si sigue sin existir, algo falló
        console.log("Error: No se pudo crear 'contadores-garantia'");
        return;
      }
    }

    // Ahora sí existe, extraemos la data
    const currentGarantia = contadoresSnap.data().garantia;
    console.log("== handleGenerateGuaranteeNumber: currentGarantia (antes de sumar) ==", currentGarantia);

    // 5) Sumamos +1 al contador
    const newGarantia = currentGarantia + 1;
    console.log("== handleGenerateGuaranteeNumber: newGarantia (después de sumar) ==", newGarantia);

    // 6) Actualizamos la orden con el nuevo 'garantia_number'
    await updateDoc(orderRef, { garantia_number: newGarantia });
    console.log("== handleGenerateGuaranteeNumber: 'garantia_number' actualizado en la orden ==", newGarantia);

    // 7) Actualizamos el mismo contador en "contadores-garantia"
    await updateDoc(contadoresRef, { garantia: newGarantia });
    console.log("== handleGenerateGuaranteeNumber: 'garantia' actualizado en contadores-garantia ==", newGarantia);

    // 8) Reflejamos en el estado local
    setOrder({ ...order, garantia_number: newGarantia });
    console.log("== handleGenerateGuaranteeNumber: State order.garantia_number ==", newGarantia);

  } catch (error) {
    console.error("Error en handleGenerateGuaranteeNumber:", error);
  }
};

// =====Selección de Documento=======

const handleSelectDocument = async (docType) => {
  console.log("Documento seleccionado:", docType);

  // Cerramos el dropdown
  setIsDropdownOpen(false);

  if (docType === "Garantía") {
    try {
      // 1) Generar / Incrementar "garantia_number" (misma lógica existente)
      await handleGenerateGuaranteeNumber();

      // 2) Abrir el PDF en otra pestaña (si ya se generó la url)
      if (pdfUrl) {
        console.log("Abriendo PDF Garantía con url =", pdfUrl);
        window.open(pdfUrl, "_blank");
      } else {
        console.log("No se ha generado la url del PDF todavía.");
      }
    } catch (error) {
      console.error("Error generando garantía:", error);
    }
  } else if (docType === "Remisión") {
    try {
      // Generar / Incrementar 'remision_number'
      await handleGenerateRemisionNumber();

      setTimeout(() => {
        if (pdfUrlRemision) {
          console.log("Abriendo PDF Remisión con url =", pdfUrlRemision);
          window.open(pdfUrlRemision, "_blank");
        } else {
          console.log("No se ha generado la url del RemisionPDF todavía.");
        }
      }, 200);
    } catch (error) {
      console.error("Error generando remisión:", error);
    }

  } else if (docType === "Anticipos") {
    try {
      // No se genera un número o contador
      if (pdfUrlAnticipos) {
        window.open(pdfUrlAnticipos, "_blank");
      } else {
        console.log("No se ha generado la url del PDF de Anticipos todavía.");
      }
    } catch (error) {
      console.error("Error generando PDF de Anticipos:", error);
    }
  } else if (docType === "Cotización") {
    try {
      // No hay contador en Cotización, así que no llamamos a nada extra
      // Directamente abrimos el PDF en otra pestaña
      if (pdfUrlCotizacion) {
        window.open(pdfUrlCotizacion, "_blank");
      } else {
        console.log("No se ha generado la url del PDF de Cotización todavía.");
      }
    } catch (error) {
      console.error("Error generando Cotización:", error);
    }
  }
};

// ===== Número de Remisión =====

const handleGenerateRemisionNumber = async () => {
  console.log("== handleGenerateRemisionNumber: Iniciando ==");

  try {
    // 1) Referencia al documento de la orden en la colección "orders"
    const orderRef = doc(db, "orders", order.orderNumber.toString());
    console.log("== handleGenerateRemisionNumber: orderRef ==", orderRef.path);

    // 2) Obtenemos los datos de la orden
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
      console.log("No existe la orden con orderNumber:", order.orderNumber);
      return;
    }

    const orderData = orderSnap.data();
    console.log("== handleGenerateRemisionNumber: Datos actuales de la orden ==", orderData);

    // 3) Revisamos si YA existe 'remision_number'
    if (typeof orderData.remision_number === "number") {
      // Si existe, solo lo usamos
      console.log("El campo 'remision_number' YA existe:", orderData.remision_number);
      setOrder({ ...order, remision_number: orderData.remision_number });
      return;
    }

    // 4) Si NO existe, consultamos la colección "contadores", doc "contadores-remision"
    const contadoresRef = doc(db, "contadores", "contadores-remision");
    console.log("== handleGenerateRemisionNumber: contadoresRef ==", contadoresRef.path);

    let contadoresSnap = await getDoc(contadoresRef);

    if (!contadoresSnap.exists()) {
      console.log("No se encontró el documento 'contadores-remision'. Creándolo...");

      // Creamos el documento con "remision: 0"
      await setDoc(contadoresRef, { remision: 0 });
      console.log("Documento 'contadores-remision' creado con 'remision = 0'");

      // Volvemos a leerlo para continuar la lógica
      contadoresSnap = await getDoc(contadoresRef);

      if (!contadoresSnap.exists()) {
        console.log("Error: No se pudo crear 'contadores-remision'");
        return;
      }
    }

    const currentRemision = contadoresSnap.data().remision;
    console.log("== handleGenerateRemisionNumber: currentRemision (antes de sumar) ==", currentRemision);

    // 5) Sumamos +1 al contador
    const newRemision = currentRemision + 1;
    console.log("== handleGenerateRemisionNumber: newRemision (después de sumar) ==", newRemision);

    // 6) Actualizamos la orden con el nuevo 'remision_number'
    await updateDoc(orderRef, { remision_number: newRemision });
    console.log("== handleGenerateRemisionNumber: 'remision_number' actualizado en la orden ==", newRemision);

    // 7) Actualizamos el mismo contador en "contadores-remision"
    await updateDoc(contadoresRef, { remision: newRemision });
    console.log("== handleGenerateRemisionNumber: 'remision' actualizado en contadores-remision ==", newRemision);

    // 8) Reflejamos en el estado local
    setOrder({ ...order, remision_number: newRemision });
    console.log("== handleGenerateRemisionNumber: State order.remision_number ==", newRemision);

  } catch (error) {
    console.error("Error en handleGenerateRemisionNumber:", error);
  }
};

// Desgloce de Cantidades:
    // Calcular el subtotal de productos
    const totalProductos = calculateTotalSubtotal(inspectionItems);

    // Leer el descuento (cantidad_dinero) del campo discount del documento; si no existe, es 0
    const descuento = order.discount && order.discount.cantidad_dinero 
      ? parseFloat(order.discount.cantidad_dinero)
      : 0;
  
    // Calcular el total de impuestos: para cada item que tenga impuestos "16", sumar (partUnitPrice * quantity * 0.16)
    const impuestosValue = inspectionItems.reduce((acc, item) => {
      if (item.impuestos === "16") {
        return acc + (parseFloat(item.partUnitPrice) * parseInt(item.quantity) * 0.16);
      }
      return acc;
    }, 0);
  
    // Total final = Total de Productos - Descuentos - Impuestos
    const totalFinal = totalProductos - descuento - impuestosValue;
    
return (
    <div className="order-details">
      <div className="content">
      <div className="order-title">
        <h2>Detalles de la Orden /  <span>{order.orderNumber}</span></h2>
      </div>

      <div className="subtitle">
          <h3>
            <p>Fecha</p>
            <p>
            {formData.uploadTime ? new Date(formData.uploadTime).toLocaleDateString('es-MX') : 'Fecha no disponible'}
          </p>
        </h3>    
        {/* Container Print     */}
        <div className="container-print">

          {/* PDFDownloadLink oculto para generar pdfUrl de Garantía */}
          <PDFDownloadLink
            document={<OrderPDF order={order} />}
            fileName={`Orden_${order.orderNumber}.pdf`}
          >
            {({ loading, url }) => {
              if (!loading && url && pdfUrl !== url) {
                setPdfUrl(url);
              }
              return null;
            }}
          </PDFDownloadLink>

          {/* PDFDownloadLink oculto para generar pdfUrlRemision */}
          <PDFDownloadLink
            document={<RemisionPDF order={order} />}
            fileName={`Remision_${order.orderNumber}.pdf`}
          >
            {({ loading, url }) => {
              if (!loading && url && pdfUrlRemision !== url) {
                setPdfUrlRemision(url);
              }
              return null;
            }}
          </PDFDownloadLink>

          {/* PDFDownloadLink oculto para generar pdfUrlAnticipos */}
          <PDFDownloadLink
            document={<AnticiposPDF order={order} />}
            fileName={`Anticipos_${order.orderNumber}.pdf`}
          >
            {({ loading, url }) => {
              if (!loading && url && pdfUrlAnticipos !== url) {
                setPdfUrlAnticipos(url);
              }
              return null;
            }}
          </PDFDownloadLink>

          <PDFDownloadLink
            document={<CotizacionPDF order={order} />}
            fileName={`Cotizacion_${order.orderNumber}.pdf`}
          >
            {({ loading, url }) => {
              if (!loading && url && pdfUrlCotizacion !== url) {
                setPdfUrlCotizacion(url);
              }
              return null;
            }}
          </PDFDownloadLink>



          {/* Botón que abre/cierra dropdown */}
          <button onClick={toggleDropdown}>
            <img src="icons/print.svg" alt="Imprimir" />
          </button>

          {isDropdownOpen && (
          <ul className="print-dropdown">
            {/* Remisión */}
            {canSeeRemision && (
              <li onClick={() => handleSelectDocument("Remisión")}>Remisión</li>
            )}

            {/* Garantía */}
            {canSeeGarantia && (
              <li onClick={() => handleSelectDocument("Garantía")}>Garantía</li>
            )}

            {/* Cotizaciones */}
            {canSeeCotizacion && (
              <li onClick={() => handleSelectDocument("Cotización")}>Cotización</li>
            )}

            {/* Anticipos */}
            {canSeeAnticipo && (
              <li onClick={() => handleSelectDocument("Anticipos")}>Anticipos</li>
            )}
          </ul>
        )}


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

        {/* Nombre del cliente  */}
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
        
        {/* Edit Asesor,  */}
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
        
        {/* Telefono */}
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

          {/* Coche y Año */}
          <div className="column-client">
              <input
                className="input-two"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
              />
              
              {/* Input de Year */}
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
                name="kilometraje"
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
                <input type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange} 
                 />
              </div>
          
        </div>
        {/* Método de Pago */}
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
                  <option value="Tarjeta de Crédito">Tarjeta de Credito</option>
                  <option value="Tarjeta de Débito">Tarjeta de Debito</option>
                  <option value="Depósito">Deposito</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Transferencia">Transferencia</option>

                </select>
              </div>
          
        </div>
        <div className="precio-container">
          <div>

   
          </div>
       
        </div>
      </div>

      {/* Desgloce Cantidades */}
      <div className="container-desgloce-cantidades">
          {/* Cantidades */}
          <div className="container-cantidades">
              {/* Total de Productos */}
              <div className="row-cantidad">
                <p>Total de Productos: </p>
                <p>${totalProductos.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="row-cantidad">
                <p>Descuentos: </p>
                <p>${descuento.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="row-cantidad">
                <p>Impuestos: </p>
                <p>    ${impuestosValue.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="row-cantidad">
                <p>Total Anticipos: </p>
                <p> ${abonosSum.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

          </div>
          {/* Folios */}
          <div className="container-folios">
            <div className="folios">
              {/* Número de Remisión */}
              <div className="row-cantidad">
                <p>Folio Garantía: </p>
                { order.garantia_number ? <p>#{order.garantia_number}</p> : null }
              </div>
              <div className="row-cantidad">
                <p>Número Remisión: </p>
                { order.remision_number ? <p>#{order.remision_number}</p> : null }
              </div>

            </div>

            <div className="total">
                <h1>Total ${totalFinal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h1>
            </div>
          </div>
      </div>

      {/* Productos & Servicios Y botones de acción*/}
      <div className="container-productos">
        <h2>Productos & Servicios</h2>

        <div className="container-buttons">
          {/* Agregar Producto */}
          <button onClick={openModal}>
            <img
              src="icons/plus.svg"
            />
          </button>
          {/* Editar Productos */}
          <button
        
          onClick={openEditModal}>
            <img
              src="icons/edit.svg"
            />
          </button>
          {/* Anticipo */}
          <button
              onClick={openAbonarModal}

          >
            Anticipo
          </button>
          {/* Descuento */}
          <button
              onClick={openDiscountModal}   // <-- Agregar esta función
            >
              Descuento
          </button>
        </div>


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
            <th>SubTotal</th>
          </tr>
        </thead>
        <tbody>
        {inspectionItems.length > 0 ? (
          inspectionItems.map((item, index) => {
            const cost = parseFloat(item.partUnitPrice) || 0;
            const quantity = parseInt(item.quantity) || 0;
            const impuestos = item.impuestos === "16" ? "16%" : "0%";
            const taxAmount = calculateProductTax(item);
            const subtotal = calculateSubtotal(item);

            return (
              <tr key={index}>
                <td>{item.inspectionItemName}</td>
                <td>{item.brand || 'N/A'}</td>
                <td>$ {cost.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td>{quantity}</td>
                <td>{impuestos}</td>
                <td>$ {parseFloat(subtotal).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="7">No hay productos o servicios asociados</td>
          </tr>
        )}
      </tbody>
      </table>  


       {/* Historial de Pagos */}
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
                      <td>$ {parseFloat(abono.cantidad_abono).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td>{abono.metodo_pago}</td>
                      <td>{new Date(abono.fecha_abono).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
         
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


          <ModalEditProduct
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
            orderId={orderId}
            inspectionItems={order.inspectionItems}
            setOrder={setOrder}
          />

          <ModalDiscount
            isOpen={isDiscountModalOpen}
            onClose={closeDiscountModal}
            orderId={orderId}
          />
    </div>
  );
}
