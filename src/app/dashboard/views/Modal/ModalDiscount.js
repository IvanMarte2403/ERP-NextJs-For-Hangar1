// ModalDiscount.js
import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../../lib/firebase"; // Ajusta la ruta según tu estructura

export default function ModalDiscount({ isOpen, onClose, orderId }) {
  // Estados para subtotal, descuento (en pesos y %), notas y subtotal con descuento
  const [subtotal, setSubtotal] = useState(0);
  const [discountAmount, setDiscountAmount] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [notes, setNotes] = useState("");
  const [discountedSubtotal, setDiscountedSubtotal] = useState(0);

  // Al abrir el modal se obtiene la orden y se calcula el subtotal
  useEffect(() => {
    if (isOpen && orderId) {
      const fetchOrder = async () => {
        try {
          const orderDocRef = doc(db, "orders", orderId.toString());
          const orderSnap = await getDoc(orderDocRef);
          if (orderSnap.exists()) {
            const orderData = orderSnap.data();
            const items = orderData.inspectionItems || [];
            let total = 0;
            items.forEach(item => {
              const price = parseFloat(item.partUnitPrice) || 0;
              const qty = parseFloat(item.quantity) || 0;
              // Si impuestos es "16", se suma el 16% al costo
              if (item.impuestos === "16") {
                total += price * qty * 1.16;
              } else {
                total += price * qty;
              }
            });
            setSubtotal(total);
            setDiscountedSubtotal(total);
          }
        } catch (error) {
          console.error("Error fetching order data: ", error);
        }
      };

      fetchOrder();
    }
  }, [isOpen, orderId]);

  // Cuando cambia el input de descuento en pesos, se actualiza el porcentaje y el subtotal con descuento
  const handleDiscountAmountChange = (e) => {
    const value = e.target.value;
    setDiscountAmount(value);
    let percent = 0;
    if (subtotal > 0 && value !== "") {
      percent = (parseFloat(value) / subtotal) * 100;
    }
    setDiscountPercent(percent ? percent.toFixed(2) : "");
    setDiscountedSubtotal(subtotal - (parseFloat(value) || 0));
  };

  // Cuando cambia el input de descuento en porcentaje, se actualiza el valor en pesos y el subtotal con descuento
  const handleDiscountPercentChange = (e) => {
    const value = e.target.value;
    setDiscountPercent(value);
    let amount = 0;
    if (subtotal > 0 && value !== "") {
      amount = (parseFloat(value) / 100) * subtotal;
    }
    setDiscountAmount(amount ? amount.toFixed(2) : "");
    setDiscountedSubtotal(subtotal - (amount || 0));
  };

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  // Al guardar se valida que se haya ingresado algún descuento (en pesos o %) y que las notas no estén vacías.
  // Luego se actualiza el documento en Firebase agregando (o actualizando) el campo "discount"
  const handleSave = async () => {
    const discountAmt = parseFloat(discountAmount) || 0;
    const discountPct = parseFloat(discountPercent) || 0;

    if ((discountAmt === 0 && discountPct === 0) || notes.trim() === "") {
      alert("Favor de llenar alguno de los campos de descuento y las notas.");
      return;
    }

    const discountData = {
      notes: notes.trim(),
      porcentaje: discountPct,
      cantidad_dinero: discountAmt,
    };

    try {
      const orderDocRef = doc(db, "orders", orderId.toString());
      await updateDoc(orderDocRef, { discount: discountData });
      alert("Descuento guardado exitosamente.");
      onClose();
    } catch (error) {
      console.error("Error al guardar descuento: ", error);
      alert("Error al guardar el descuento.");
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modalDiscount">
      <div className="modal-content">
        {/* Headar Modal */}
        <div className="container-title-modal">
          {/* Title */}
          <div className="title">
            <img src="icons/modal/discountModal.svg" alt="" />
            <h2>Descuentos</h2>
          </div>
          {/* Total */}
          <div className="total">
            <h1>${discountedSubtotal.toFixed(2)}</h1>
          </div>
        
        </div>

        <div>

          <p>
            Subtotal antes de descuento ${subtotal.toFixed(2)} 
          </p>
        </div>
        <div className="container-discount-inputs">
          {/* Inputs Price */}
          <div className="inputs-price">
            {/* Pesos */}
            <label>
              Descuento en Pesos:
              <input
                type="number"
                value={discountAmount}
                onChange={handleDiscountAmountChange}
                placeholder="Cantidad en pesos"
              />
            </label>
            <label>
              Descuento en %:
              <input
                type="number"
                value={discountPercent}
                onChange={handleDiscountPercentChange}
                placeholder="Porcentaje"
              />
            </label>
          </div>
        </div>

        {/* Notes Inputs */}
        <div className="notes-input">
          <label>
            Notas:
            <input
              type="text"
              value={notes}
              onChange={handleNotesChange}
              placeholder="Ingrese notas"
            />
          </label>
        </div>
        <div className="modal-actions">
          <div className="container-buttons">
            <button className="cancelar" onClick={onClose}>Cancelar</button>
            <button className="guardar" onClick={handleSave}>Guardar</button>
          </div>
       
        </div>
      </div>
    </div>
  );
}
