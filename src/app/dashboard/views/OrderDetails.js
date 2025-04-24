// OrderDetails.js
"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { PDFDownloadLink } from "@react-pdf/renderer";
import OrderPDF from "./OrderPDF";
import RemisionPDF from "./RemisionPDF";
import AnticiposPDF from "./AnticiposPDF";
import CotizacionPDF from "./CotizacionPDF";

// -- Modal --
import ModalProduct from "./Modal/ModalProduct";
import ModalAbonar from "./Modal/ModalAbonar";
import ModalEditProduct from "./Modal/EditProduct";
import ModalDiscount from "./Modal/ModalDiscount";

import CheckIn from "../check-in/CheckIn"; 
import CheckTecnico from "../check-in/CheckTecnico";

export default function OrderDetails({ orderId, isNewOrder, userEmail }) {
  console.log("OrderDetails");

  /* ----------  estado para mostrar Check-in ---------- */
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showCheckTecnico, setShowCheckTecnico] = useState(false);


  /* ---------- Estados existentes ---------- */
  const [pdfReady, setPdfReady] = useState(false);
  const [order, setOrder] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isEdited, setIsEdited] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    inCharge: "",
    brand: "",
    model: "",
    paymentMethod: "",
    year: "",
    kilometros: "",
    color: "",
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [abonos, setAbonos] = useState([]);
  const [abonosSum, setAbonosSum] = useState(0);
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

  // -- Modal --
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    document.querySelector(".content").classList.add("main-blur");
  };
  const [isAbonarModalOpen, setIsAbonarModalOpen] = useState(false);
  const closeModal = async () => {
    setIsModalOpen(false);
    document.querySelector(".content").classList.remove("main-blur");
    const orderDocRef = doc(db, "orders", orderId.toString());
    const docSnap = await getDoc(orderDocRef);

    if (docSnap.exists()) {
      const orderData = docSnap.data();
      setOrder(orderData);
      const inspectionItems = orderData.inspectionItems || [];

      const totalSubtotal = inspectionItems.reduce((acc, item) => {
        const cost = item.partUnitPrice || 0;
        const quantity = item.quantity || 0;
        const taxAmount = cost * quantity * taxRate;
        const subtotal = cost * quantity + taxAmount - discount;
        return acc + subtotal;
      }, 0);

      setTotalAmount(totalSubtotal);
    } else {
      console.error("Error: No se encontró el documento después de cerrar el modal");
    }
  };
  const openAbonarModal = () => {
    setIsAbonarModalOpen(true);
    document.querySelector(".content").classList.add("main-blur");
  };

  // -- Modal Edit --
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openEditModal = () => {
    setIsEditModalOpen(true);
    document.querySelector(".content").classList.add("main-blur");
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    document.querySelector(".content").classList.remove("main-blur");

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
    document.querySelector(".content").classList.add("main-blur");
  };

  const closeDiscountModal = () => {
    setIsDiscountModalOpen(false);
    document.querySelector(".content").classList.remove("main-blur");
  };

  // --- Abonos ---
  const updateAbonosInFirebase = (updatedAbonos) => {
    setAbonos(updatedAbonos);

    const abonosTotal = updatedAbonos.reduce(
      (acc, abono) => acc + parseFloat(abono.cantidad_abono || 0),
      0
    );
    setAbonosSum(abonosTotal);

    const totalSubtotal = order.inspectionItems.reduce((acc, item) => {
      const cost = item.partUnitPrice || 0;
      const quantity = item.quantity || 0;
      const taxAmount = cost * quantity * taxRate;
      const subtotal = cost * quantity + taxAmount - discount;
      return acc + subtotal;
    }, 0);

    setTotalAmount(totalSubtotal - abonosTotal);
  };
  const closeAbonarModal = async () => {
    setIsAbonarModalOpen(false);
    document.querySelector(".content").classList.remove("main-blur");
  };

  // --- Productos ---
  const saveProductToFirebase = async (orderId, newProduct) => {
    try {
      const orderDocRef = doc(db, "orders", orderId.toString());
      const orderSnap = await getDoc(orderDocRef);

      if (orderSnap.exists()) {
        const existingOrder = orderSnap.data();
        const updatedInspectionItems = [...existingOrder.inspectionItems, newProduct];

        await updateDoc(orderDocRef, { inspectionItems: updatedInspectionItems });
        console.log("Producto agregado exitosamente");

        await closeModal();
      }
    } catch (error) {
      console.error("Error al guardar el producto:", error);
    }
  };

  const taxRate = 0.16;
  const discount = 0;

  /* ---------- Consulta de Datos ---------- */
  const fetchOrderFromFirebase = async () => {
    try {
      console.log(
        "Iniciando consulta en Firebase para obtener la orden usando orderID:",
        orderId
      );

      if (!orderId) {
        console.error("Error: orderId es undefined o null");
        return;
      }

      const docRef = doc(db, "orders", orderId.toString());
      console.log("Referencia del documento creada:", docRef);

      const docSnap = await getDoc(docRef);
      console.log("Resultado de la consulta:", docSnap.exists());

      if (docSnap.exists()) {
        const orderData = docSnap.data();
        console.log("Detalles de la orden obtenidos de Firebase:", orderData);

        setOrder(orderData);

        const abonosList = orderData.abonos || [];
        setAbonos(abonosList);

        const abonosTotal = abonosList.reduce(
          (acc, abono) => acc + parseFloat(abono.cantidad_abono || 0),
          0
        );
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
          color: orderData.color || "",
        });

        const inspectionItems = orderData.inspectionItems || [];
        const totalSubtotal = inspectionItems.reduce((acc, item) => {
          const cost = parseFloat(item.partUnitPrice) || 0;
          const quantity = parseInt(item.quantity) || 0;
          const impuestos = item.impuestos === "16" ? 0.16 : 0;
          const taxAmount = cost * quantity * impuestos;
          const subtotal = cost * quantity + taxAmount;
          return acc + subtotal;
        }, 0);

        setTotalAmount(totalSubtotal - abonosTotal);
      } else {
        console.log("No se encontró el documento en Firebase!");
        const newOrderData = {
          firstName: "",
          lastName: "",
          mobile: "",
          inCharge: "",
          brand: "",
          model: "",
          paymentMethod: "",
          orderNumber: orderId,
          inspectionItems: [],
          uploadTime: new Date().toISOString(),
        };

        await setDoc(docRef, newOrderData);

        setOrder(newOrderData);
        setFormData(newOrderData);
        setTotalAmount(0);
      }
    } catch (error) {
      console.error("Error obteniendo la orden de Firebase:", error);
    }
  };

  useEffect(() => {
    fetchOrderFromFirebase();
  }, [orderId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setIsEdited(true);
  };

  const handleSave = async () => {
    try {
      const orderDocRef = doc(db, "orders", orderId.toString());

      const updatedOrderData = {
        mobile: formData.mobile,
        inCharge: formData.inCharge,
        brand: formData.brand,
        paymentMethod: formData.paymentMethod,
        year: formData.year,
        kilometros: formData.kilometros,
        color: formData.color,
      };

      await updateDoc(orderDocRef, updatedOrderData);

      console.log("== Orden actualizada en Firebase con éxito ==");
      alert("Se ha guardado correctamente");
      await fetchOrderFromFirebase();

      setIsEdited(false);
    } catch (error) {
      console.error("Error actualizando la orden en Firebase:", error);
    }
  };

  useEffect(() => {
    if (order && order.inspectionItems) {
      const updatedTotalAmount = calculateTotalAmount(order.inspectionItems) - abonosSum;
      setTotalAmount(updatedTotalAmount);
    }
  }, [order, abonosSum]);

  if (showCheckIn) {

    /* ----------  sustituir .content por CheckIn ---------- */
    return <CheckIn orderId={orderId} />;
  }

  if (showCheckTecnico) {
    return <CheckTecnico orderId={orderId} />;
  }

  if (!order) {
    return <p>Cargando detalles de la orden...</p>;
  }

  const inspectionItems = order.inspectionItems || [];

  const calculateProductTax = (item) => {
    const cost = parseFloat(item.partUnitPrice) || 0;
    const quantity = parseInt(item.quantity) || 0;
    const impuestos = item.impuestos === "16" ? 0.16 : 0;
    return (cost * quantity * impuestos).toFixed(2);
  };

  const calculateSubtotal = (item) => {
    const cost = parseFloat(item.partUnitPrice) || 0;
    const quantity = parseInt(item.quantity) || 0;
    const impuestos = item.impuestos === "16" ? 0.16 : 0;
    const taxAmount = cost * quantity * impuestos;
    const subtotal = cost * quantity + taxAmount;
    return subtotal.toFixed(2);
  };

  const calculateTotalAmount = (items) => {
    return items.reduce((acc, item) => {
      const cost = parseFloat(item.partUnitPrice) || 0;
      const quantity = parseInt(item.quantity) || 0;
      const impuestos = item.impuestos === "16" ? 0.16 : 0;
      const taxAmount = cost * quantity * impuestos;
      const subtotal = cost * quantity + taxAmount;
      return acc + subtotal;
    }, 0);
  };

  const calculateTotalSubtotal = (items) => {
    return items.reduce((acc, item) => acc + parseFloat(calculateSubtotal(item)), 0);
  };

  /* ---------- Número De Garantía ---------- */
  const handleGenerateGuaranteeNumber = async () => {
    try {
      const orderRef = doc(db, "orders", order.orderNumber.toString());
      const orderSnap = await getDoc(orderRef);

      if (!orderSnap.exists()) return;

      const orderData = orderSnap.data();

      if (typeof orderData.garantia_number === "number") {
        setOrder({ ...order, garantia_number: orderData.garantia_number });
        return;
      }

      const contadoresRef = doc(db, "contadores", "contadores-garantia");
      let contadoresSnap = await getDoc(contadoresRef);

      if (!contadoresSnap.exists()) {
        await setDoc(contadoresRef, { garantia: 0 });
        contadoresSnap = await getDoc(contadoresRef);
        if (!contadoresSnap.exists()) return;
      }

      const currentGarantia = contadoresSnap.data().garantia;
      const newGarantia = currentGarantia + 1;

      await updateDoc(orderRef, { garantia_number: newGarantia });
      await updateDoc(contadoresRef, { garantia: newGarantia });
      setOrder({ ...order, garantia_number: newGarantia });
    } catch (error) {
      console.error("Error en handleGenerateGuaranteeNumber:", error);
    }
  };

  /* ---------- Selección de Documento ---------- */
  const handleSelectDocument = async (docType) => {
    setIsDropdownOpen(false);

    if (docType === "Garantía") {
      try {
        await handleGenerateGuaranteeNumber();
        if (pdfUrl) window.open(pdfUrl, "_blank");
      } catch (error) {
        console.error("Error generando garantía:", error);
      }
    } else if (docType === "Remisión") {
      try {
        await handleGenerateRemisionNumber();
        setTimeout(() => {
          if (pdfUrlRemision) window.open(pdfUrlRemision, "_blank");
        }, 200);
      } catch (error) {
        console.error("Error generando remisión:", error);
      }
    } else if (docType === "Anticipos") {
      if (pdfUrlAnticipos) window.open(pdfUrlAnticipos, "_blank");
    } else if (docType === "Cotización") {
      if (pdfUrlCotizacion) window.open(pdfUrlCotizacion, "_blank");
    }
  };

  /* ---------- Número de Remisión ---------- */
  const handleGenerateRemisionNumber = async () => {
    try {
      const orderRef = doc(db, "orders", order.orderNumber.toString());
      const orderSnap = await getDoc(orderRef);

      if (!orderSnap.exists()) return;

      const orderData = orderSnap.data();

      if (typeof orderData.remision_number === "number") {
        setOrder({ ...order, remision_number: orderData.remision_number });
        return;
      }

      const contadoresRef = doc(db, "contadores", "contadores-remision");
      let contadoresSnap = await getDoc(contadoresRef);

      if (!contadoresSnap.exists()) {
        await setDoc(contadoresRef, { remision: 0 });
        contadoresSnap = await getDoc(contadoresRef);
        if (!contadoresSnap.exists()) return;
      }

      const currentRemision = contadoresSnap.data().remision;
      const newRemision = currentRemision + 1;

      await updateDoc(orderRef, { remision_number: newRemision });
      await updateDoc(contadoresRef, { remision: newRemision });
      setOrder({ ...order, remision_number: newRemision });
    } catch (error) {
      console.error("Error en handleGenerateRemisionNumber:", error);
    }
  };

  /* ---------- Desglose de Cantidades ---------- */
  const totalProductos = calculateTotalSubtotal(inspectionItems);
  const descuento =
    order.discount && order.discount.cantidad_dinero
      ? parseFloat(order.discount.cantidad_dinero)
      : 0;
  const impuestosValue = inspectionItems.reduce((acc, item) => {
    if (item.impuestos === "16") {
      return acc + parseFloat(item.partUnitPrice) * parseInt(item.quantity) * 0.16;
    }
    return acc;
  }, 0);
  const totalFinal = totalProductos - descuento - impuestosValue;

  return (
    <div className="order-details">
      <div className="content">
        <div className="order-title">
          <h2>
            Detalles de la Orden / <span>{order.orderNumber}</span>
          </h2>
        </div>

        <div className="subtitle">
          <h3>
            <p>Fecha</p>
            <p>
              {formData.uploadTime
                ? new Date(formData.uploadTime).toLocaleDateString("es-MX")
                : "Fecha no disponible"}
            </p>
          </h3>

          {/* ---------------- Container Print ---------------- */}
          <div className="container-print">
            {/* PDFDownloadLink ocultos */}
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

            {/* Botón imprimir */}
            <button onClick={toggleDropdown}>
              <img src="icons/print.svg" alt="Imprimir" />
            </button>

            {isDropdownOpen && (
              <ul className="print-dropdown">
                {canSeeRemision && (
                  <li onClick={() => handleSelectDocument("Remisión")}>Remisión</li>
                )}
                {canSeeGarantia && (
                  <li onClick={() => handleSelectDocument("Garantía")}>Garantía</li>
                )}
                {canSeeCotizacion && (
                  <li onClick={() => handleSelectDocument("Cotización")}>
                    Cotización
                  </li>
                )}
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

        {/* ---------------- Checks Container ---------------- */}
        <div className="checks-container">
          <button className="link" onClick={() => setShowCheckIn(true)}>
            <p>Check-in</p>
          </button>
          {/* Check Tecnico */}
          <button className="link" onClick={() => setShowCheckTecnico(true)}>
            <p>Check-Tecnico</p>
          </button>
        </div>

        {/* ---------------- Container Orden ---------------- */}
        <div className="container-orden">
          {/* Estado de la Orden */}
          <div className={`presupuesto-container ${order.estado_orden?.toLowerCase()}`}>
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
              <input
                type="text"
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
                <option value="Tarjeta de Crédito">Tarjeta de Credito</option>
                <option value="Tarjeta de Débito">Tarjeta de Debito</option>
                <option value="Depósito">Deposito</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Transferencia">Transferencia</option>
              </select>
            </div>
          </div>
        </div>

        {/* ---------------- Desgloce Cantidades ---------------- */}
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

          {/* Folios */}
          <div className="container-folios">
            <div className="folios">
              <div className="row-cantidad">
                <p>Folio Garantía: </p>
                {order.garantia_number ? <p>#{order.garantia_number}</p> : null}
              </div>
              <div className="row-cantidad">
                <p>Número Remisión: </p>
                {order.remision_number ? <p>#{order.remision_number}</p> : null}
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

        {/* ---------------- Productos & Servicios ---------------- */}
        <div className="container-productos">
          <h2>Productos & Servicios</h2>
          <div className="container-buttons">
            <button onClick={openModal}>
              <img src="icons/plus.svg" />
            </button>
            <button onClick={openEditModal}>
              <img src="icons/edit.svg" />
            </button>
            <button onClick={openAbonarModal}>Anticipo</button>
            <button onClick={openDiscountModal}>Descuento</button>
          </div>
        </div>

        {/* Tabla de productos */}
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
                const subtotal = calculateSubtotal(item);

                return (
                  <tr key={index}>
                    <td>{item.inspectionItemName}</td>
                    <td>{item.brand || "N/A"}</td>
                    <td>
                      $
                      {cost.toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td>{quantity}</td>
                    <td>{impuestos}</td>
                    <td>
                      $
                      {parseFloat(subtotal).toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
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

        {/* ---------------- Historial de Pagos ---------------- */}
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
                      <td>
                        $
                        {parseFloat(abono.cantidad_abono).toLocaleString("es-MX", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td>{abono.metodo_pago}</td>
                      <td>{new Date(abono.fecha_abono).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>

      {/* ---------------- Modales ---------------- */}
      <ModalProduct
        isOpen={isModalOpen}
        onClose={closeModal}
        orderId={orderId}
        onSaveProduct={saveProductToFirebase}
        className="modalProduct"
      />

      <ModalAbonar
        isOpen={isAbonarModalOpen}
        onClose={closeAbonarModal}
        orderId={orderId}
        existingAbonos={order?.abonos || []}
        onUpdateAbonos={updateAbonosInFirebase}
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
