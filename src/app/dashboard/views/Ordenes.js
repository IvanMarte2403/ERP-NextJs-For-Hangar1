"use client";

import { useEffect, useState } from "react";
import { fetchAndStoreOrders } from "../../../../lib/apiService";
import { collection, query, orderBy, limit, startAfter, getDocs } from "firebase/firestore";
import { db } from "../../../../lib/firebase";

export default function Ordenes() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const ordersPerPage = 15;
  const totalPages = 40; // Total de páginas (ajusta según tus datos)

  useEffect(() => {
    async function loadOrders() {
      setLoading(true); // Indica que se están cargando nuevos datos
      setOrders([]); // Limpia las órdenes actuales para mostrar un estado limpio durante la carga

      let ordersQuery = query(
        collection(db, "orders"),
        orderBy("uploadTime", "desc"),
        limit(ordersPerPage)
      );

      if (lastVisible && currentPage > 1) {
        ordersQuery = query(
          collection(db, "orders"),
          orderBy("uploadTime", "desc"),
          startAfter(lastVisible),
          limit(ordersPerPage)
        );
      }

      const querySnapshot = await getDocs(ordersQuery);
      const fetchedOrders = [];
      querySnapshot.forEach(doc => {
        fetchedOrders.push(doc.data());
      });

      setOrders(fetchedOrders);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setLoading(false); // Finaliza el estado de carga
    }

    loadOrders();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setLastVisible(null);  // Resetea para cargar la nueva página
  };

  const renderPagination = () => {
    const pages = [];

    if (currentPage > 1) {
      pages.push(
        <button key={1} onClick={() => handlePageChange(1)}>
          1
        </button>
      );
    }

    if (currentPage > 10) {
      pages.push(<span key="left-dots">...</span>);
    }

    for (let i = Math.max(2, currentPage - 4); i <= Math.min(totalPages - 1, currentPage + 5); i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          style={{ fontWeight: i === currentPage ? 'bold' : 'normal' }}
        >
          {i}
        </button>
      );
    }

    if (currentPage < totalPages - 9) {
      pages.push(<span key="right-dots">...</span>);
    }

    if (currentPage < totalPages) {
      pages.push(
        <button key={totalPages} onClick={() => handlePageChange(totalPages)}>
          {totalPages}
        </button>
      );
    }

    return pages;
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
        {loading ? (
          <p>Cargando órdenes...</p>  
        ) : (
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
                  <td>{`${order.firstName || ''} ${order.lastName || ''}`}</td>
                  <td>{`${order.brand || ''} ${order.model || ''}`}</td>
                  <td>{order.inCharge}</td>
                  <td>{/* Aquí puedes calcular el total si tienes esa información */}</td>
                  <td className="presupuesto">Presupuesto</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Paginación */}
        <div className="pagination">
          {renderPagination()}
        </div>
      </div>
    </div>
  );
}
