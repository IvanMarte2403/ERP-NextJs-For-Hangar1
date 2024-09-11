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
// Función para actualizar los detalles de la orden en clearMechanic
export async function updateOrder(order_number, repair_shop_id, updated_data) {
  // Construimos la URL para la actualización de la orden
  const access_token = await login();
  const url = `/api/cm/orders/${order_number}?repairShopId=${repair_shop_id}`;

  // Configuramos los encabezados, incluido el token de autorización
  const headers = {
      "Authorization": `Bearer ${access_token}`,
      "Content-Type": "application/json"
  };

  // Log para verificar URL y headers
  console.log("URL:", url);
  console.log("Headers:", headers);
  const body = JSON.stringify(updated_data);
  console.log("Body:", body);
  return fetch(url, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(updated_data)
  })
  .then(response => {
      // Log para verificar el estado de la respuesta
      console.log("Response Status:", response.status);

      if (response.ok) {
          return response.json();
      } else {
          // Si la respuesta no es ok, log el contenido del error
          return response.json().then(err => {
              console.log("Error response data:", err);
              throw new Error(`Error updating order: ${err.message || 'Unknown error'}`);
          });
      }
  })
  .then(data => {
      // Log de la respuesta exitosa
      console.log("Orden actualizada con éxito:", data);
      return data;
  })
  .catch(error => {
      // Log del error capturado
      console.log("Error en la actualización de la orden:", error);
      throw error;
  });
}

//Función para actualizar los detalles de la orden en Firebase

export async function updatedFirebaseOrder(orderId, updatedData){
    try{
      const orderDocRef = doc(db, "orders", orderId.toString());

      await updateDoc(orderDocRef, updatedData);

      console.log("Orden de Firebase Actualizada con exito");
    }catch(error){
      console.error("Error al actualizar la orden en Firebase",error);
      throw error;
    }

}