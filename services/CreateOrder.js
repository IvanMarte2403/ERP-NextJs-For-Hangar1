import { doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase"; // Ajusta la ruta según tu configuración

// Función para crear una nueva orden en Firestore
export const createOrder = async (orderData) => {
  try {
    const orderDocRef = doc(db, "orders", orderData.orderID.toString()); // Crear documento con el número de orden
    await setDoc(orderDocRef, orderData);
    return true; // Indicar que la orden fue creada exitosamente
  } catch (error) {
    console.error("Error creando la orden:", error);
    return false; // Indicar que hubo un error
  }
};
