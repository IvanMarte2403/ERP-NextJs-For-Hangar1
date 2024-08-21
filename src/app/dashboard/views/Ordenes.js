"use client";

import { useEffect, useState } from "react";
import { fetchAndStoreOrders } from "../../../../lib/apiService";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../../../../lib/firebase";

export default function Ordenes() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    async function loadOrders() {
      await fetchAndStoreOrders(); // Fetch and store orders in Firebase
      
      // Fetch orders from Firebase to display in the table
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, orderBy("uploadTime", "desc"), limit(ordersPerPage));
      const querySnapshot = await getDocs(q);
      
      const fetchedOrders = [];
      querySnapshot.forEach(doc => {
        fetchedOrders.push(doc.data());
      });
      
      setOrders(fetchedOrders);
    }

    loadOrders();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="containerOrdenes">
      <div className="header-ordenes">
        <h1>¡Bienvenida Ariel Moreno</h1>
        <div className="search-container">
          <img src="icons/search.png" />
        </div>
      </div>     

      <div className="ordenes-container">
        <h2>Órdenes</h2>
        <table className="ordenes-table">
          <thead>
            <tr>
              <th>Número</th>
              <th>Fecha-Creación</th>
              <th>Cliente</th>
              <th>Auto</th>
              <th>Asesor</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.orderID}>
                <td>{order.orderNumber}</td>
                <td>{new Date(order.uploadTime).toLocaleDateString()}</td>
                <td>{`${order.firstName} ${order.lastName}`}</td>
                <td>{`${order.brand} ${order.model}`}</td>
                <td>{order.inCharge}</td>
                <td>{/* Aquí puedes calcular el total si tienes esa información */}</td>
                <td className="presupuesto">Presupuesto</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginación */}
        <div className="pagination">
          {Array.from({ length: Math.ceil(orders.length / ordersPerPage) }, (_, i) => (
            <button key={i + 1} onClick={() => handlePageChange(i + 1)}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
