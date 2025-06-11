// src/services/orders/getOrderById.js
"use client";

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

/**
 * Lee (o crea) la orden en Firebase y devuelve el documento completo.
 * Si la orden no existe se crea vacía con los campos mínimos.
 *
 * @param {string|number} orderId
 * @returns {Promise<Object>}  Datos completos de la orden
 */
export async function getOrderById(orderId) {
  if (!orderId) throw new Error("orderId requerido");

  const docRef = doc(db, "orders", orderId.toString());
  const snap = await getDoc(docRef);

  if (snap.exists()) {
    return snap.data();
  }

  /* ---- Crear orden vacía ---- */
  const now = new Date().toISOString();
  const newOrder = {
    firstName: "",
    lastName: "",
    mobile: "",
    inCharge: "",
    brand: "",
    model: "",
    paymentMethod: "",
    orderNumber: orderId,
    inspectionItems: [],
    uploadTime: now,
  };

  await setDoc(docRef, newOrder);
  return newOrder;
}
