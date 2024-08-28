"use client";

import { useEffect, useState } from "react";
import { fetchAndStoreOrders } from "../../../../lib/apiService";
import { collection, query, orderBy, limit, startAfter, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";

export default function Ordenes({ onOrderClick }) {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const ordersPerPage = 15;
  const totalPages = 40;

  useEffect(() => {
    loadOrders();
  }, [currentPage]);

  const loadOrders = async () => {
    setLoading(true);
    setOrders([]);

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

    for (const docSnap of querySnapshot.docs) {
      const order = docSnap.data();

      if (!order.estado_orden || typeof order.estado_orden !== "string") {
        const orderRef = doc(db, "orders", docSnap.id);
        await updateDoc(orderRef, { estado_orden: "Presupuesto" });
        order.estado_orden = "Presupuesto";
      }

      fetchedOrders.push(order);
    }

    setOrders(fetchedOrders);
    setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    setLoading(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setLastVisible(null);
  };

  const handleReload = async () => {
    setLoading(true);
    await fetchAndStoreOrders();
    loadOrders();
    setLoading(false);
  };

  const toggleDropdown = (orderId) => {
    if (activeDropdown === orderId) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(orderId);
    }
  };

  const changeOrderStatus = async (orderId, newStatus) => {
    console.log("Order ID:", orderId);
    console.log("New Status:", newStatus);

    const orderRef = doc(db, "orders", orderId.toString());
    await updateDoc(orderRef, { estado_orden: newStatus });

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderID === orderId ? { ...order, estado_orden: newStatus } : order
      )
    );

    setActiveDropdown(null);
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
        <div className="reload">
          <div>
            <h2>Órdenes</h2>
            <img src="icons/reload.png" onClick={handleReload} style={{ cursor: 'pointer' }} alt="Recargar" />
          </div>
        </div>
        {loading ? (
          <p>Cargando órdenes...</p>  
        ) : (
          <table className="ordenes-table">
            <thead className="no-hover">
              <tr className="no-hover">
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
                <tr 
                  key={order.orderID} 
                  onClick={() => onOrderClick(order.orderID)} 
                  style={{ cursor: 'pointer' }}
                >
                  <td>{order.orderNumber}</td>
                  <td>{new Date(order.uploadTime).toLocaleDateString()}</td>
                  <td>{`${order.firstName || ''} ${order.lastName || ''}`}</td>
                  <td>{`${order.brand || ''} ${order.model || ''}`}</td>
                  <td>{order.inCharge}</td>
                  <td>{/* Aquí puedes calcular el total si tienes esa información */}</td>
                  <div className="tb-padding" onClick={(e) => {
                    e.stopPropagation(); // Evita que el clic en el dropdown navegue a la página de detalles
                    toggleDropdown(order.orderID);
                  }}>
                    <td className={order.estado_orden.toLowerCase()}>{order.estado_orden}</td>
                    {activeDropdown === order.orderID && (
                      <div className="dropdown">
                        {order.estado_orden !== "Presupuesto" && <p onClick={() => changeOrderStatus(order.orderID, "Presupuesto")} className="presupuesto">Presupuesto</p>}
                        {order.estado_orden !== "Vendido" && <p onClick={() => changeOrderStatus(order.orderID, "Vendido")} className="vendido">Vendido</p>}
                        {order.estado_orden !== "Negociación" && <p onClick={() => changeOrderStatus(order.orderID, "Negociación")} className="negociación">Negociación</p>}
                      </div>
                    )}
                  </div>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="pagination">
          {renderPagination()}
        </div>
      </div>
    </div>
  );
}
