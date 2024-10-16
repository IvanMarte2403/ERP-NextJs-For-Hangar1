import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase"; // Ajusta la ruta según tu configuración

// Función para obtener todos los clientes
export const getAllClients = async () => {
  try {
    const clientsSnapshot = await getDocs(collection(db, "clientes"));
    const clientsList = clientsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return clientsList;
  } catch (error) {
    console.error("Error al obtener los clientes:", error);
    return [];
  }
};
