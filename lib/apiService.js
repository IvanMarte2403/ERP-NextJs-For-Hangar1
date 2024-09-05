import axios from 'axios';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth } from './firebase';

const db = getFirestore();

// Función de login
async function login() {
  const url = '/api/users/login';  // Usando el proxy configurado en next.config.js
  const payload = { email: "hangar1@hangar1.com.mx", password: "gK9fR3pF6iT1rS3h*" };
  
  console.log("1. Se hizo POST a la API:", url);
  
  try {
    const response = await axios.post(url, payload);
    console.log("2. Respuesta del POST de login:", response.data);
    
    if (response.status === 200) {
      return response.data.accessToken;
    } else {
      throw new Error('Error al iniciar sesión');
    }
  } catch (error) {
    console.error("Error durante el login:", error);
    throw error;
  }
}

// Función para obtener órdenes de reparación
async function getRepairOrders(accessToken) {
  const url = `/api/cm/orders?repairShopId=3080`;
  const headers = {
    "Authorization": `Bearer ${accessToken}`
  };

  console.log("3. Se hizo GET a la API :", url);
  
  try {
    const response = await axios.get(url, { headers });
    console.log("4. Respuesta del GET de órdenes:", response.data);
    
    if (response.status === 200) {
      return response.data.data;  // Acceder al array de órdenes dentro del objeto data
    } else {
      throw new Error('Error al obtener las órdenes de reparación');
    }
  } catch (error) {
    console.error("Error durante la obtención de órdenes:", error);
    throw error;
  }
}

// Función para obtener detalles de la orden específica
async function getOrderDetails(accessToken, orderNumber, repairShopId) {
  const url = `/api/cm/orders/${orderNumber}?repairShopId=${repairShopId}`;
  const headers = {
    "Authorization": `Bearer ${accessToken}`
  };

  console.log("3. Se hizo GET a la API para detalles de la orden:", url);
  
  try {
    const response = await axios.get(url, { headers });
    console.log("4. Respuesta del GET de detalles de la orden:", response.data);
    
    if (response.status === 200) {
      return response.data;  // Retorna los detalles de la orden
    } else {
      throw new Error('Error al obtener los detalles de la orden');
    }
  } catch (error) {
    console.error("Error durante la obtención de detalles de la orden:", error);
    throw error;
  }
}

// Función para obtener detalles de la orden y almacenar en Firebase
export async function fetchAndStoreOrderDetails(orderNumber) {
  try {
    const accessToken = await login();  // Obtener token de acceso
    const repairShopId = 3080;  // ID de la tienda de reparación
    const orderDetails = await getOrderDetails(accessToken, orderNumber, repairShopId);

    console.log("Detalles de la orden:", orderDetails);

    // Accediendo a los detalles dentro del objeto 'data'
    const { orderID, inspectionItems } = orderDetails.data;

    // Verificar si la orden tiene inspectionItems y almacenarlos en Firebase
    if (inspectionItems && inspectionItems.length > 0) {
      const orderDoc = doc(db, "orders", orderID.toString());
      await updateDoc(orderDoc, { inspectionItems });

      console.log(`Inspection items actualizados para la orden ${orderID}`);
    } else {
      console.log(`No se encontraron inspectionItems para la orden ${orderID}`);
    }
  } catch (error) {
    console.error("Error en fetchAndStoreOrderDetails:", error);
    throw error;
  }
}

// Función para obtener y almacenar órdenes en Firebase
export async function fetchAndStoreOrders() {
  try {
    const accessToken = await login();
    const orders = await getRepairOrders(accessToken);

    if (!Array.isArray(orders)) {
      throw new Error("Las órdenes no son un array.");
    }

    for (const order of orders) {
      if (!order.orderID) {
        console.warn("Orden sin orderID o no válida:", order);
        continue;
      }

      console.log("Procesando orden:", order);

      const orderDoc = doc(db, "orders", order.orderID.toString());
      const docSnap = await getDoc(orderDoc);

      if (!docSnap.exists()) {
        await setDoc(orderDoc, order);
        console.log("Firebase status: Orden guardada:", order.orderID);
      } else {
        console.log("Firebase status: Orden ya existe:", order.orderID);
      }
    }

    console.log("Mostrando órdenes en la tabla");
    return orders; // Retorna las órdenes para mostrarlas en la tabla
  } catch (error) {
    console.error("Error en fetchAndStoreOrders:", error);
    throw error;
  }
}
