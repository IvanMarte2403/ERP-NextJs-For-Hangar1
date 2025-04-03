"use client";

import { useEffect, useState } from "react";
import { fetchAndStoreOrders } from "../../../../lib/apiService";
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  startAfter, 
  getDocs, 
  doc, 
  updateDoc 
} from "firebase/firestore";
import { db } from "../../../../lib/firebase";

export default function Ordenes({ onOrderClick }) {
  const [orders, setOrders] = useState([]);            // Órdenes para paginación
  const [allOrders, setAllOrders] = useState([]);        // Todas las órdenes cargadas
  const [filteredOrders, setFilteredOrders] = useState([]); // Órdenes filtradas en memoria
  
  const [loading, setLoading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');    // Filtro por texto
  const [selectedAdvisor, setSelectedAdvisor] = useState(''); // Filtro por asesor
  const [selectedDate, setSelectedDate] = useState(''); // Filtro por fecha (YYYY-MM-DD)

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesLastDoc, setPagesLastDoc] = useState({});
  const [totalOrders, setTotalOrders] = useState(0);
  const ordersPerPage = 15;

  // 1) Obtener el total de órdenes
  const getTotalOrdersCount = async () => {
    const snapshot = await getDocs(collection(db, "orders"));
    setTotalOrders(snapshot.size);
  };

  // 2) Cargar las órdenes paginadas (sin filtros)
  const loadOrders = async () => {
    setLoading(true);
    setOrders([]);
    let ordersQuery;
    if (currentPage === 1) {
      ordersQuery = query(
        collection(db, "orders"),
        orderBy("uploadTime", "desc"),
        limit(ordersPerPage)
      );
    } else if (pagesLastDoc[currentPage - 1]) {
      ordersQuery = query(
        collection(db, "orders"),
        orderBy("uploadTime", "desc"),
        startAfter(pagesLastDoc[currentPage - 1]),
        limit(ordersPerPage)
      );
    } else {
      ordersQuery = query(
        collection(db, "orders"),
        orderBy("uploadTime", "desc"),
        limit(ordersPerPage)
      );
    }

    const querySnapshot = await getDocs(ordersQuery);
    const fetchedOrders = [];
    for (const docSnap of querySnapshot.docs) {
      fetchedOrders.push(docSnap.data());
    }
    setOrders(fetchedOrders);

    // Guardar la referencia del último documento para paginación
    if (querySnapshot.docs.length > 0) {
      setPagesLastDoc((prev) => ({
        ...prev,
        [currentPage]: querySnapshot.docs[querySnapshot.docs.length - 1],
      }));
    }
    setLoading(false);
  };

  // 3) Manejo de la paginación
  const totalPages = Math.ceil(totalOrders / ordersPerPage);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 4) Recargar órdenes desde la fuente externa
  const handleReload = async () => {
    setLoading(true);
    await fetchAndStoreOrders();
    loadOrders();
    setLoading(false);
  };

  // 5) Cargar todas las órdenes una sola vez (para filtrar localmente)
  useEffect(() => {
    const fetchAllOrders = async () => {
      setLoading(true);
      const ordersQuery = query(collection(db, "orders"), orderBy("uploadTime", "desc"));
      const querySnapshot = await getDocs(ordersQuery);
      const fetchedOrders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAllOrders(fetchedOrders);
      setLoading(false);
    };

    fetchAllOrders();
    getTotalOrdersCount();
  }, []);

  // 6) Cargar las órdenes paginadas inicialmente
  useEffect(() => {
    loadOrders();
  }, [currentPage]);

  // 7) Filtrado unificado: texto, asesor y fecha
  useEffect(() => {
    let result = [...allOrders];

    // Filtro por texto (orderID, email, firstName o brand)
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      result = result.filter(order =>
        (order.orderID && order.orderID.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (order.email && order.email.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (order.firstName && order.firstName.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (order.brand && order.brand.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }

    // Filtro por asesor (inCharge)
    if (selectedAdvisor) {
      result = result.filter(o => o.inCharge === selectedAdvisor);
    }

    // Filtro por fecha
    if (selectedDate) {
      // Separamos año, mes y día para crear un Date en horario local
      const [year, month, day] = selectedDate.split("-");
      const startDay = new Date(year, month - 1, day); // 00:00:00 local
      const endDay = new Date(year, month - 1, Number(day) + 1); // Inicio del día siguiente

      result = result.filter(o => {
        const ut = new Date(o.uploadTime);
        return ut >= startDay && ut < endDay;
      });
    }

    // Ordenar de más reciente a más antiguo
    result.sort((a, b) => new Date(b.uploadTime) - new Date(a.uploadTime));
    setFilteredOrders(result);
  }, [searchTerm, selectedAdvisor, selectedDate, allOrders]);

  // Manejo del dropdown de estado
  const toggleDropdown = (orderId) => {
    setActiveDropdown(activeDropdown === orderId ? null : orderId);
  };

  const changeOrderStatus = async (orderId, newStatus) => {
    const orderRef = doc(db, "orders", orderId.toString());
    await updateDoc(orderRef, { estado_orden: newStatus });
    setOrders((prev) =>
      prev.map((order) =>
        order.orderID === orderId ? { ...order, estado_orden: newStatus } : order
      )
    );
    setAllOrders((prev) =>
      prev.map((order) =>
        order.orderID === orderId ? { ...order, estado_orden: newStatus } : order
      )
    );
    setActiveDropdown(null);
  };

  // Calcular total de una orden
  const calculateOrderTotal = (order) => {
    if (!order.inspectionItems || !Array.isArray(order.inspectionItems)) {
      return '0.00';
    }
    const total = order.inspectionItems.reduce((acc, item) => {
      const partUnitPrice = parseFloat(item.partUnitPrice) || 0;
      const quantity = parseFloat(item.quantity) || 0;
      const impuestos = item.impuestos ? item.impuestos.trim() : "0";
      let itemTotal = partUnitPrice * quantity;
      if (impuestos === "16") {
        itemTotal *= 1.16;
      }
      return acc + itemTotal;
    }, 0);
    return total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Decidir qué datos mostrar: si hay algún filtro, usamos filteredOrders; de lo contrario, la paginación
  const isAnyFilterActive = searchTerm || selectedAdvisor || selectedDate;
  const dataToRender = isAnyFilterActive ? filteredOrders : orders;

  // Renderizar paginación (solo sin filtros)
  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
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
    return pages;
  };

  return (
    <div className="containerOrdenes">
      {/* Buscadores y Filtros */}
      <div className="container-buscador">
        <input 
          className="buscador-ordenes"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por No. Orden, correo electrónico, nombre o coche"
        />
        <select
          className="filtro-asesor"
          value={selectedAdvisor}
          onChange={(e) => setSelectedAdvisor(e.target.value)}
        >
          <option value="">Todos los asesores</option>
          <option value="Cristian Abarca">Cristian Abarca</option>
          <option value="Jorge Sanchez">Jorge Sanchez</option>
        </select>
        <input 
          type="date"  
          className="filtro-asesor"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div className="ordenes-container">
        {loading ? (
          <p>Cargando órdenes...</p>
        ) : (
          <table className="ordenes-table">
            <thead className="no-hover">
              <tr className="no-hover">
                <th>Número</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Auto</th>
                <th>Asesor</th>
                <th>Estado</th>
                <th>Categoría</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {dataToRender.map(order => (
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
                  <div 
                    className="tb-padding" 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown(order.orderID);
                    }}
                  >
                    <td className={order.estado_orden.toLowerCase()}>
                      {order.estado_orden}
                    </td>
                    {activeDropdown === order.orderID && (
                      <div className="dropdown">
                        {order.estado_orden !== "Presupuesto" && (
                          <p 
                            onClick={() => changeOrderStatus(order.orderID, "Presupuesto")} 
                            className="presupuesto"
                          >
                            Presupuesto
                          </p>
                        )}
                        {order.estado_orden !== "Vendido" && (
                          <p 
                            onClick={() => changeOrderStatus(order.orderID, "Vendido")} 
                            className="vendido"
                          >
                            Vendido
                          </p>
                        )}
                        {order.estado_orden !== "Negociación" && (
                          <p 
                            onClick={() => changeOrderStatus(order.orderID, "Negociación")} 
                            className="negociación"
                          >
                            Negociación
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <td>{order.categoria_h || 'SpeedCenter'}</td>
                  <td>$ {calculateOrderTotal(order)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!isAnyFilterActive && (
          <div className="pagination">
            {renderPagination()}
          </div>
        )}
      </div>
    </div>
  );
}
