// OrderDetails.js
"use client";

/* ---------- Librerías & Firebase ---------- */
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { PDFDownloadLink } from "@react-pdf/renderer";

/* ---------- Documentos PDF ---------- */
import OrderPDF from "./OrderPDF";
import RemisionPDF from "./RemisionPDF";
import AnticiposPDF from "./AnticiposPDF";
import CotizacionPDF from "./CotizacionPDF";

/* ---------- Modales ---------- */
import ModalProduct from "./Modal/ModalProduct";
import ModalAbonar from "./Modal/ModalAbonar";
import ModalEditProduct from "./Modal/EditProduct";
import ModalDiscount from "./Modal/ModalDiscount";

/* ---------- Vistas auxiliares ---------- */
import CheckIn from "../check-in/CheckIn";
import CheckTecnico from "../check-in/CheckTecnico";
import CotizadorAvanzado from "../views/CotizadorAvanzado/CotizadorAvanzado";
import HistorialPagos from "../views/OrderDetails/historialPagos";

/* ---------- Componentes internos ---------- */
import ContainerOrden from "./Order/ContainerOrden";
import DesgloseCantidades from "./OrderDetails/desgloceCantidades";

/* ---------- Services ---------- */
import { getOrderById } from "../../../../services/orders/getOrderById";
import { getCotizadorAvanzado } from "../../../../services/CotizadorAvanzado/getCotizadorAvanzado";

/* ---------- Constantes ---------- */
const taxRate = 0.16;

/* ====================================================================== */
/*                                Componente                              */
/* ====================================================================== */
export default function OrderDetails({ orderId, isNewOrder, userEmail }) {
  /* --------------------------------------------------------------------
   * 1. Vista auxiliar seleccionada
   * ------------------------------------------------------------------ */
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showCheckTecnico, setShowCheckTecnico] = useState(false);
  const [showCotizadorAvanzado, setShowCotizadorAvanzado] = useState(false);

  /* --------------------------------------------------------------------
   * 2. Datos de la orden y cotizador avanzado
   * ------------------------------------------------------------------ */
  const [order, setOrder] = useState(null);
  const [cotizadorEntry, setCotizadorEntry] = useState(null);

  /* --------------------------------------------------------------------
   * 3. Formulario encabezado
   * ------------------------------------------------------------------ */
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

  /* --------------------------------------------------------------------
   * 4. Estados UI (dropdown, modales)
   * ------------------------------------------------------------------ */
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAbonarModalOpen, setIsAbonarModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);

  /* --------------------------------------------------------------------
   * 5. PDF URLs
   * ------------------------------------------------------------------ */
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfUrlRemision, setPdfUrlRemision] = useState(null);
  const [pdfUrlAnticipos, setPdfUrlAnticipos] = useState(null);
  const [pdfUrlCotizacion, setPdfUrlCotizacion] = useState(null);

  /* --------------------------------------------------------------------
   * 6. Abonos y totales
   * ------------------------------------------------------------------ */
  const [abonos, setAbonos] = useState([]);
  const [abonosSum, setAbonosSum] = useState(0);

  /* --------------------------------------------------------------------
   * 7. Usuarios autorizados
   * ------------------------------------------------------------------ */
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

  /* ======================================================================
   *  useEffect: cargar datos iniciales de Firebase y cotizador avanzado
   * ==================================================================== */
  useEffect(() => {
    if (!orderId) return;

    (async () => {
      try {
        /* Load order */
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

        /* Load abonos */
        const abonosList = orderData.abonos || [];
        setAbonos(abonosList);
        setAbonosSum(
          abonosList.reduce(
            (acc, a) => acc + parseFloat(a.cantidad_abono || 0),
            0
          )
        );

        /* Load cotizador avanzado */
        const entry = await getCotizadorAvanzado(orderId);
        setCotizadorEntry(entry);
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    })();
  }, [orderId]);

  /* ======================================================================
   *  Helpers para tabla productos
   * ==================================================================== */
  const calculateSubtotal = (item) => {
    const cost = parseFloat(item.partUnitPrice) || 0;
    const quantity = parseInt(item.quantity) || 0;
    const iva = item.impuestos === "16" ? 0.16 : 0;
    return cost * quantity * (1 + iva);

  };

  /* ======================================================================
   *  handleInputChange / handleSave encabezado
   * ==================================================================== */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsEdited(true);
  };

  const handleSave = async () => {
    if (!orderId) return;
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
  };

  /* ======================================================================
   *  Folios: Garantía y Remisión
   * ==================================================================== */
  const generateFolio = async (tipo) => {
    const field = tipo === "garantia" ? "garantia_number" : "remision_number";
    const contadorId =
      tipo === "garantia" ? "contadores-garantia" : "contadores-remision";
    const contadorField = tipo === "garantia" ? "garantia" : "remision";

    const orderRef = doc(db, "orders", order.orderNumber.toString());
    const orderSnap = await getDoc(orderRef);
    if (!orderSnap.exists()) return;

    if (typeof orderSnap.data()[field] === "number") {
      setOrder({ ...order, [field]: orderSnap.data()[field] });
      return;
    }

    const contRef = doc(db, "contadores", contadorId);
    let contSnap = await getDoc(contRef);
    if (!contSnap.exists()) {
      await setDoc(contRef, { [contadorField]: 0 });
      contSnap = await getDoc(contRef);
    }

    const nuevo = (contSnap.data()[contadorField] || 0) + 1;
    await updateDoc(orderRef, { [field]: nuevo });
    await updateDoc(contRef, { [contadorField]: nuevo });
    setOrder({ ...order, [field]: nuevo });
  };

  /* ======================================================================
   *  Dropdown imprimir
   * ==================================================================== */
  const handleSelectDocument = async (tipo) => {
    setIsDropdownOpen(false);

    if (tipo === "Garantía") {
      await generateFolio("garantia");
      if (pdfUrl) window.open(pdfUrl, "_blank");
    } else if (tipo === "Remisión") {
      await generateFolio("remision");
      setTimeout(() => {
        if (pdfUrlRemision) window.open(pdfUrlRemision, "_blank");
      }, 250);
    } else if (tipo === "Cotización") {
      if (pdfUrlCotizacion) window.open(pdfUrlCotizacion, "_blank");
    } else if (tipo === "Anticipos") {
      if (pdfUrlAnticipos) window.open(pdfUrlAnticipos, "_blank");
    }
  };

  /* ======================================================================
   *  Lógica de Productos & Abonos
   *  ==================================================================== */
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
  };

  const openDiscountModal = () => {
    setIsDiscountModalOpen(true);
    document.querySelector(".content")?.classList.add("main-blur");
  };
  const closeDiscountModal = () => {
    setIsDiscountModalOpen(false);
    document.querySelector(".content")?.classList.remove("main-blur");
  };

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

  const updateAbonosInFirebase = (updated) => {
    setAbonos(updated);
    const total = updated.reduce(
      (acc, a) => acc + parseFloat(a.cantidad_abono || 0),
      0
    );
    setAbonosSum(total);
  };

  /* ======================================================================
   *  Early returns: vistas auxiliares
   * ==================================================================== */
  if (showCheckIn) return <CheckIn orderId={orderId} />;
  if (showCheckTecnico) return <CheckTecnico orderId={orderId} />;
  if (showCotizadorAvanzado) return <CotizadorAvanzado orderId={orderId} />;
  if (!order) return <p>Cargando detalles de la orden…</p>;

  const inspectionItems = order.inspectionItems || [];

  /* ======================================================================
   *  Render principal
   * ==================================================================== */
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

          <div className="container-print">
            {/* PDF ocultos */}
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

            <button onClick={() => setIsDropdownOpen((p) => !p)}>
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

        {/* ---------- Datos cliente / auto ---------- */}
        <ContainerOrden
          order={order}
          formData={formData}
          handleInputChange={handleInputChange}
        />

        {/* ---------- Desglose cantidades ---------- */}
        <DesgloseCantidades
          inspectionItems={inspectionItems}
          order={order}
          abonosSum={abonosSum}
        />

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
