import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

// Función para obtener la información del cliente por ID
export async function getClientInformation(clientId) {
  try {
    const clientRef = doc(db, "clientes", clientId);
    const clientSnap = await getDoc(clientRef);

    if (clientSnap.exists()) {
      return clientSnap.data(); // Devuelve la información del cliente
    } else {
      console.log("No se encontró el cliente con el ID proporcionado");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener la información del cliente:", error);
    return null;
  }
}
