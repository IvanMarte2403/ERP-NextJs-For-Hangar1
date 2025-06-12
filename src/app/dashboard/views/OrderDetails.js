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

import ModalProduct from "./Modal/ModalProduct";
import ModalAbonar from "./Modal/ModalAbonar";
import ModalEditProduct from "./Modal/EditProduct";
import ModalDiscount from "./Modal/ModalDiscount";

import CheckIn from "../check-in/CheckIn";
import CheckTecnico from "../check-in/CheckTecnico";
import CotizadorAvanzado from "../views/CotizadorAvanzado/CotizadorAvanzado";
import HistorialPagos from "../views/OrderDetails/historialPagos";

import ContainerOrden from "./Order/ContainerOrden";

import { getOrderById } from "../../../../services/orders/getOrderById";
import { getCotizadorAvanzado } from "../../../../services/CotizadorAvanzado/getCotizadorAvanzado";

/* ---------- Constantes ---------- */
const taxRate = 0.16;

/* ---------- Componente ---------- */
export default function OrderDetails({ orderId, isNewOrder, userEmail }) {
  /* ---------- vistas auxiliares ---------- */
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showCheckTecnico, setShowCheckTecnico] = useState(false);
  const [showCotizadorAvanzado, setShowCotizadorAvanzado] = useState(false);

  /* ---------- estados de la orden ---------- */
  const [order, setOrder] = useState(null);
  const [cotizadorEntry, setCotizadorEntry] = useState(null);

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

  const [isEdited, setIsEdited] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  /* ---------- PDF URLs ---------- */
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfUrlRemision, setPdfUrlRemision] = useState(null);
  const [pdfUrlAnticipos, setPdfUrlAnticipos] = useState(null);
  const [pdfUrlCotizacion, setPdfUrlCotizacion] = useState(null);

  /* ---------- Abonos y totales ---------- */
  const [abonos, setAbonos] = useState([]);
  const [abonosSum, setAbonosSum] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  /* ---------- Modales ---------- */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAbonarModalOpen, setIsAbonarModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);

  /* ---------- usuarios autorizados (sin cambios) ---------- */
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

  const canSeeRemision = usersTodos.includes(userEmail);
  const canSeeGarantia = usersGarantias.includes(userEmail);
  const canSeeCotizacion = usersCotizaciones.includes(userEmail);
  const canSeeAnticipo = usersAnticipos.includes(userEmail);

  /* ---------- Carga inicial ---------- */
  useEffect(() => {
    if (!orderId) return;
    (async () => {
      try {
        const orderData = await getOrderById(orderId);
        setOrder(orderData);

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

        const abonosList = orderData.abonos || [];
        setAbonos(abonosList);
        setAbonosSum(
          abonosList.reduce(
            (acc, a) => acc + parseFloat(a.cantidad_abono || 0),
            0
          )
        );

        const entry = await getCotizadorAvanzado(orderId);
        setCotizadorEntry(entry);
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    })();
  }, [orderId]);

  /* ---------- helpers ---------- */
  const calculateSubtotal = (item) => {
    const cost = parseFloat(item.partUnitPrice) || 0;
    const quantity = parseInt(item.quantity) || 0;
    const iva = item.impuestos === "16" ? 0.16 : 0;
    return cost * quantity * (1 + iva);
  };
  const calculateTotalAmount = (items) =>
    items.reduce((acc, i) => acc + calculateSubtotal(i), 0);

  /* actualizar total cuando cambian items o abonos */
  useEffect(() => {
    if (order?.inspectionItems) {
      setTotalAmount(
        calculateTotalAmount(order.inspectionItems) - abonosSum
      );
    }
  }, [order, abonosSum]);

  /* ---------- Edición encabezado ---------- */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsEdited(true);
  };

  const handleSave = async () => {
    if (!orderId) return;
    try {
      await updateDoc(doc(db, "orders", orderId.toString()), {
        mobile: formData.mobile,
        inCharge: formData.inCharge,
        brand: formData.brand,
        paymentMethod: formData.paymentMethod,
        year: formData.year,
        kilometros: formData.kilometros,
        color: formData.color,
      });
      setIsEdited(false);
    } catch (err) {
      console.error("Error guardando encabezado:", err);
    }
  };

  /* ---------- Generar folio de Garantía ---------- */
  const handleGenerateGuaranteeNumber = async () => {
    try {
      const orderRef = doc(db, "orders", order.orderNumber.toString());
      const orderSnap = await getDoc(orderRef);
      if (!orderSnap.exists()) return;

      /* si ya tiene folio, no lo cambia */
      if (typeof orderSnap.data().garantia_number === "number") {
        setOrder({ ...order, garantia_number: orderSnap.data().garantia_number });
        return;
      }

      const contRef = doc(db, "contadores", "contadores-garantia");
      let contSnap = await getDoc(contRef);
      if (!contSnap.exists()) {
        await setDoc(contRef, { garantia: 0 });
        contSnap = await getDoc(contRef);
      }

      const newFol = (contSnap.data().garantia || 0) + 1;
      await updateDoc(orderRef, { garantia_number: newFol });
      await updateDoc(contRef, { garantia: newFol });
      setOrder({ ...order, garantia_number: newFol });
    } catch (err) {
      console.error("Error generando garantía:", err);
    }
  };

  /* ---------- Generar folio de Remisión ---------- */
  const handleGenerateRemisionNumber = async () => {
    try {
      const orderRef = doc(db, "orders", order.orderNumber.toString());
      const orderSnap = await getDoc(orderRef);
      if (!orderSnap.exists()) return;

      if (typeof orderSnap.data().remision_number === "number") {
        setOrder({ ...order, remision_number: orderSnap.data().remision_number });
        return;
      }

      const contRef = doc(db, "contadores", "contadores-remision");
      let contSnap = await getDoc(contRef);
      if (!contSnap.exists()) {
        await setDoc(contRef, { remision: 0 });
        contSnap = await getDoc(contRef);
      }

      const newFol = (contSnap.data().remision || 0) + 1;
      await updateDoc(orderRef, { remision_number: newFol });
      await updateDoc(contRef, { remision: newFol });
      setOrder({ ...order, remision_number: newFol });
    } catch (err) {
      console.error("Error generando remisión:", err);
    }
  };

  /* ---------- Selección en dropdown de impresión ---------- */
  const handleSelectDocument = async (type) => {
    setIsDropdownOpen(false);

    if (type === "Garantía") {
      await handleGenerateGuaranteeNumber();
      if (pdfUrl) window.open(pdfUrl, "_blank");
    } else if (type === "Remisión") {
      await handleGenerateRemisionNumber();
      setTimeout(() => {
        if (pdfUrlRemision) window.open(pdfUrlRemision, "_blank");
      }, 250);
    } else if (type === "Cotización") {
      if (pdfUrlCotizacion) window.open(pdfUrlCotizacion, "_blank");
    } else if (type === "Anticipos") {
      if (pdfUrlAnticipos) window.open(pdfUrlAnticipos, "_blank");
    }
  };

  /* ---------- funciones para modales & dropdown (resto iguales) ---------- */
  const toggleDropdown = () => setIsDropdownOpen((p) => !p);
  const openModal = () => {
    setIsModalOpen(true);
    document.querySelector(".content")?.classList.add("main-blur");
  };
  const closeModal = () => {
    setIsModalOpen(false);
    document.querySelector(".content")?.classList.remove("main-blur");
  };
  const openAbonarModal = () => {
    setIsAbonarModalOpen(true);
    document.querySelector(".content")?.classList.add("main-blur");
  };
  const closeAbonarModal = () => {
    setIsAbonarModalOpen(false);
    document.querySelector(".content")?.classList.remove("main-blur");
  };
  const openEditModal = () => {
    setIsEditModalOpen(true);
    document.querySelector(".content")?.classList.add("main-blur");
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    document.querySelector(".content")?.classList.remove("main-blur");
    if (order?.inspectionItems) {
      setTotalAmount(
        calculateTotalAmount(order.inspectionItems) - abonosSum
      );
    }
  };
  const openDiscountModal = () => {
    setIsDiscountModalOpen(true);
    document.querySelector(".content")?.classList.add("main-blur");
  };
  const closeDiscountModal = () => {
    setIsDiscountModalOpen(false);
    document.querySelector(".content")?.classList.remove("main-blur");
  };

  /* ---------- Guardar producto ---------- */
  const saveProductToFirebase = async (_orderId, newProduct) => {
    try {
      const ref = doc(db, "orders", _orderId.toString());
      const snap = await getDoc(ref);
      if (!snap.exists()) return;
      const existing = snap.data();
      await updateDoc(ref, {
        inspectionItems: [...existing.inspectionItems, newProduct],
      });
      const updated = await getDoc(ref);
      setOrder(updated.data());
      closeModal();
    } catch (err) {
      console.error("Error guardando producto:", err);
    }
  };

  /* ---------- update abonos ---------- */
  const updateAbonosInFirebase = (updated) => {
    setAbonos(updated);
    const total = updated.reduce(
      (acc, a) => acc + parseFloat(a.cantidad_abono || 0),
      0
    );
    setAbonosSum(total);
  };

  /* ---------- Mostrar vistas auxiliares ---------- */
  if (showCheckIn) return <CheckIn orderId={orderId} />;
  if (showCheckTecnico) return <CheckTecnico orderId={orderId} />;
  if (showCotizadorAvanzado) return <CotizadorAvanzado orderId={orderId} />;

  if (!order) return <p>Cargando detalles de la orden...</p>;
  const inspectionItems = order.inspectionItems || [];

  /* ---------- cálculos de desglose ---------- */
  const totalProductos = calculateTotalAmount(inspectionItems);
  const descuento =
    order.discount?.cantidad_dinero
      ? parseFloat(order.discount.cantidad_dinero)
      : 0;
  const impuestosValue = inspectionItems.reduce((acc, i) => {
    if (i.impuestos === "16") {
      return (
        acc + parseFloat(i.partUnitPrice) * parseInt(i.quantity) * 0.16
      );
    }
    return acc;
  }, 0);
  const totalFinal = totalProductos - descuento - impuestosValue;

  /* ---------- render ---------- */
  return (
    <div className="order-details">
      <div className="content">
        {/* ---------- Título ---------- */}
        <div className="order-title">
          <h2>
            Detalles de la Orden / <span>{order.orderNumber}</span>
          </h2>
        </div>

        {/* ---------- Fecha & Print ---------- */}
        <div className="subtitle">
          <h3>
            <p>Fecha</p>
            <p>
              {formData.uploadTime
                ? new Date(formData.uploadTime).toLocaleDateString("es-MX")
                : "Fecha no disponible"}
            </p>
          </h3>

          {/* PDF ocultos + botón imprimir */}
          <div className="container-print">
            <PDFDownloadLink
              document={<OrderPDF order={order} cotizador={cotizadorEntry} />}
              fileName={`Orden_${order.orderNumber}.pdf`}
            >
              {({ loading, url }) => {
                if (!loading && url && pdfUrl !== url) setPdfUrl(url);
                return null;
              }}
            </PDFDownloadLink>

            <PDFDownloadLink
              document={<RemisionPDF order={order} />}
              fileName={`Remision_${order.orderNumber}.pdf`}
            >
              {({ loading, url }) => {
                if (!loading && url && pdfUrlRemision !== url)
                  setPdfUrlRemision(url);
                return null;
              }}
            </PDFDownloadLink>

            <PDFDownloadLink
              document={<AnticiposPDF order={order} />}
              fileName={`Anticipos_${order.orderNumber}.pdf`}
            >
              {({ loading, url }) => {
                if (!loading && url && pdfUrlAnticipos !== url)
                  setPdfUrlAnticipos(url);
                return null;
              }}
            </PDFDownloadLink>

            <PDFDownloadLink
              document={<CotizacionPDF order={order} />}
              fileName={`Cotizacion_${order.orderNumber}.pdf`}
            >
              {({ loading, url }) => {
                if (!loading && url && pdfUrlCotizacion !== url)
                  setPdfUrlCotizacion(url);
                return null;
              }}
            </PDFDownloadLink>

            <button onClick={toggleDropdown}>
              <img src="icons/print.svg" alt="Imprimir" />
            </button>

            {isDropdownOpen && (
              <ul className="print-dropdown">
                {canSeeRemision && (
                  <li onClick={() => handleSelectDocument("Remisión")}>
                    Remisión
                  </li>
                )}
                {canSeeGarantia && (
                  <li onClick={() => handleSelectDocument("Garantía")}>
                    Garantía
                  </li>
                )}
                {canSeeCotizacion && (
                  <li onClick={() => handleSelectDocument("Cotización")}>
                    Cotización
                  </li>
                )}
                {canSeeAnticipo && (
                  <li onClick={() => handleSelectDocument("Anticipos")}>
                    Anticipos
                  </li>
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

        {/* ---------- Checks ---------- */}
        <div className="checks-container">
          <button className="link" onClick={() => setShowCheckIn(true)}>
            <p>Check-in</p>
          </button>
          <button className="link" onClick={() => setShowCheckTecnico(true)}>
            <p>Check-Tecnico</p>
          </button>
          <button
            className="link"
            onClick={() => setShowCotizadorAvanzado(true)}
          >
            <p>Cotizador Avanzado</p>
          </button>
        </div>

        {/* ---------- Datos del cliente / coche ---------- */}
        <ContainerOrden
          order={order}
          formData={formData}
          handleInputChange={handleInputChange}
        />

        {/* ---------- Desglose cantidades ---------- */}
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

        {/* ---------- Productos & Servicios ---------- */}
        <div className="container-productos">
          <h2>Productos & Servicios</h2>
          <div className="container-buttons">
            <button onClick={openModal}>
              <img src="icons/plus.svg" alt="Agregar" />
            </button>
            <button onClick={openEditModal}>
              <img src="icons/edit.svg" alt="Editar" />
            </button>
            <button onClick={openAbonarModal}>Anticipo</button>
            <button onClick={openDiscountModal}>Descuento</button>
          </div>
        </div>

        {/* ---------- Tabla productos ---------- */}
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
            {inspectionItems.length ? (
              inspectionItems.map((item, i) => {
                const cost = parseFloat(item.partUnitPrice) || 0;
                const quantity = parseInt(item.quantity) || 0;
                const impuestos = item.impuestos === "16" ? "16%" : "0%";
                const subtotal = calculateSubtotal(item);

                return (
                  <tr key={i}>
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
                      {subtotal.toLocaleString("es-MX", {
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

        {/* ---------- Historial de pagos ---------- */}
        <HistorialPagos abonos={abonos} />
      </div>

      {/* ---------- Modales ---------- */}
      <ModalProduct
        isOpen={isModalOpen}
        onClose={closeModal}
        orderId={orderId}
        onSaveProduct={saveProductToFirebase}
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
