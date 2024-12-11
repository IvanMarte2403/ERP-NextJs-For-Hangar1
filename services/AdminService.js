// AdminService.js
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

// Función para obtener las órdenes con estado "Vendido" y filtrar por fecha en el lado del cliente
export const getMonthlySalesData = async () => {
  try {
    // Obtener todas las órdenes con estado "Vendido"
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("estado_orden", "==", "Vendido"));

    console.log("Ejecutando consulta...");

    const querySnapshot = await getDocs(q);

    console.log("Cantidad de órdenes obtenidas:", querySnapshot.size);

    let primeServiceTotal = 0;
    let speedCenterTotal = 0;

    // Obtener rango de fechas para el mes actual
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    console.log(
      "Rango de fechas:",
      startOfMonth.toISOString(),
      endOfMonth.toISOString()
    );

    // Filtrar las órdenes por fecha en el lado del cliente
    const filteredDocs = querySnapshot.docs.filter((doc) => {
      const data = doc.data();
      if (data.uploadTime) {
        let uploadTime;

        // Determinar el tipo de data.uploadTime y convertirlo a Date
        if (data.uploadTime.toDate) {
          // Es un Timestamp de Firebase
          uploadTime = data.uploadTime.toDate();
        } else if (data.uploadTime instanceof Date) {
          // Es un objeto Date
          uploadTime = data.uploadTime;
        } else if (typeof data.uploadTime === "number") {
          // Es un número (timestamp en milisegundos o segundos)
          // Si es en segundos, multiplicar por 1000
          uploadTime = new Date(data.uploadTime * 1000);
        } else if (typeof data.uploadTime === "string") {
          // Es una cadena de texto
          uploadTime = new Date(data.uploadTime);
        } else {
          console.warn(
            "Formato desconocido de uploadTime:",
            data.uploadTime
          );
          return false;
        }

        return uploadTime >= startOfMonth && uploadTime <= endOfMonth;
      }
      return false;
    });

    console.log(
      "Órdenes después de filtrar por fecha:",
      filteredDocs.length
    );

    // Procesar las órdenes filtradas
    filteredDocs.forEach((doc) => {
      const data = doc.data();
      console.log("Datos de la orden:", data);

      const categoria = data.categoria_h || "SpeedCenter";
      const impuestos = parseFloat(data.impuestos) || 0;

      let orderTotal = 0;

      if (Array.isArray(data.inspectionItems)) {
        data.inspectionItems.forEach((item) => {
          const partUnitPrice = parseFloat(item.partUnitPrice) || 0;
          const quantity = parseFloat(item.quantity) || 0;
          let itemTotal = partUnitPrice * quantity;

          // Aplicar IVA si corresponde
          if (impuestos === 16) {
            itemTotal *= 1.16; // Agregar 16% de IVA
          }

          orderTotal += itemTotal;
        });
      }

      if (categoria === "PrimeService") {
        primeServiceTotal += orderTotal;
      } else {
        speedCenterTotal += orderTotal;
      }
    });

    const totalSales = primeServiceTotal + speedCenterTotal;

    console.log("Total PrimeService:", primeServiceTotal);
    console.log("Total SpeedCenter:", speedCenterTotal);
    console.log("Ventas Totales:", totalSales);

    return {
      primeServiceTotal,
      speedCenterTotal,
      totalSales,
    };
  } catch (error) {
    console.error("Error obteniendo datos de ventas mensuales:", error);
    return null;
  }
};


// Función para obtener las ventas diarias de la semana actual
export const getWeeklySalesData = async (estado = "Vendido") => {
  try {
      // Obtener todas las órdenes con estado "Vendido"
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, where("estado_orden", "==", estado));
  
      const querySnapshot = await getDocs(q); 
  
      // Obtener rango de fechas para la semana actual
      const now = new Date();
      const currentWeekDay = now.getDay(); // 0 (Domingo) - 6 (Sábado)
      const firstDayOfWeek = new Date(now);
      firstDayOfWeek.setDate(now.getDate() - currentWeekDay);
      firstDayOfWeek.setHours(0, 0, 0, 0);
  
      const lastDayOfWeek = new Date(firstDayOfWeek);
      lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
      lastDayOfWeek.setHours(23, 59, 59, 999);
  
      // Inicializar objeto para almacenar ventas por día
      const dailySales = {};
      console.log("Datos procesados para ventas diarias:", dailySales);
      console.log("Rango de la semana (Domingo a Sábado):", firstDayOfWeek, lastDayOfWeek);

      // Preparar las claves para cada día de la semana
      for (let i = 0; i < 7; i++) {
        const date = new Date(firstDayOfWeek);
        date.setDate(firstDayOfWeek.getDate() + i);
        const key = date.toLocaleDateString('es-ES', { weekday: 'long' });
        dailySales[key] = 0;
      }
  
      // Procesar las órdenes
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        let uploadTime;
  
        if (data.uploadTime) {
          if (data.uploadTime.toDate) {
            uploadTime = data.uploadTime.toDate();
          } else if (data.uploadTime instanceof Date) {
            uploadTime = data.uploadTime;
          } else if (typeof data.uploadTime === "number") {
            uploadTime = new Date(data.uploadTime * 1000);
          } else if (typeof data.uploadTime === "string") {
            uploadTime = new Date(data.uploadTime);
          } else {
            return;
          }
  
          if (uploadTime >= firstDayOfWeek && uploadTime <= lastDayOfWeek) {
            let orderTotal = 0;
            const impuestos = parseFloat(data.impuestos) || 0;
  
            if (Array.isArray(data.inspectionItems)) {
              data.inspectionItems.forEach((item) => {
                const partUnitPrice = parseFloat(item.partUnitPrice) || 0;
                const quantity = parseFloat(item.quantity) || 0;
                let itemTotal = partUnitPrice * quantity;
  
                // Aplicar IVA si corresponde
                if (impuestos === 16) {
                  itemTotal *= 1.16;
                }
  
                orderTotal += itemTotal;
              });
            }
  
            const dayKey = uploadTime.toLocaleDateString('es-ES', { weekday: 'long' });
            dailySales[dayKey] += orderTotal;
          }
        }
      });
  
      return dailySales;
    } catch (error) {
      console.error("Error obteniendo datos de ventas semanales:", error);
      return null;
    }
  };


  // Función para obtener datos mensuales por persona inCharge
export const getMonthlyDataByInCharge = async (inChargeName) => {
  try {
    const ordersRef = collection(db, "orders");

    // Obtener rango de fechas para el mes actual
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Filtramos por inCharge
    const q = query(ordersRef, where("inCharge", "==", inChargeName));
    const querySnapshot = await getDocs(q);

    let countPresupuesto = 0;
    let countNegociacion = 0;
    let countVendido = 0;
    let totalVentas = 0;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (!data.uploadTime) return;

      let uploadTime;
      if (data.uploadTime.toDate) {
        uploadTime = data.uploadTime.toDate();
      } else if (data.uploadTime instanceof Date) {
        uploadTime = data.uploadTime;
      } else if (typeof data.uploadTime === "number") {
        uploadTime = new Date(data.uploadTime * 1000);
      } else if (typeof data.uploadTime === "string") {
        uploadTime = new Date(data.uploadTime);
      } else {
        return;
      }

      // Verificar que la orden corresponda al mes actual
      if (uploadTime >= startOfMonth && uploadTime <= endOfMonth) {
        const estado = data.estado_orden;
        if (estado === "Presupuesto") {
          countPresupuesto++;
        } else if (estado === "Negociación") {
          countNegociacion++;
        } else if (estado === "Vendido") {
          countVendido++;

          // Calcular el total de la venta
          const impuestos = parseFloat(data.impuestos) || 0;
          let orderTotal = 0;

          if (Array.isArray(data.inspectionItems)) {
            data.inspectionItems.forEach((item) => {
              const partUnitPrice = parseFloat(item.partUnitPrice) || 0;
              const quantity = parseFloat(item.quantity) || 0;
              let itemTotal = partUnitPrice * quantity;

              // Aplicar IVA si corresponde
              if (impuestos === 16) {
                itemTotal *= 1.16;
              }

              orderTotal += itemTotal;
            });
          }

          totalVentas += orderTotal;
        }
      }
    });

    return {
      presupuesto: countPresupuesto,
      negociacion: countNegociacion,
      vendido: countVendido,
      total: totalVentas,
    };
  } catch (error) {
    console.error("Error al obtener datos mensuales por inCharge:", error);
    return {
      presupuesto: 0,
      negociacion: 0,
      vendido: 0,
      total: 0,
    };
  }
};

  
