"use client";

import { useEffect, useState, useRouter } from "react";
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

  const [allOrders, setAllOrders] = useState([]); // Estado para todas las órdenes
  const [filteredOrders, setFilteredOrders] = useState([]); // Órdenes filtradas para la búsqueda
  const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda



  // Total de Ordenes
  const [totalOrders, setTotalOrders] = useState(0);
  const [pagesLastDoc, setPagesLastDoc] = useState({});

    // Función para obtener la cantidad total de órdenes
  const getTotalOrdersCount = async () => {
    const snapshot = await getDocs(collection(db, "orders"));
    setTotalOrders(snapshot.size);
  };

  useEffect(() => {
    loadOrders();
  }, [currentPage]);

    // Llamar a la función al montar el componente
  useEffect(() => {
    getTotalOrdersCount();
  }, []);


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
  }, []);

  // -- Filtro de Búsqueda -- 
  useEffect(() => {
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const results = allOrders.filter(order => 
      (order.orderID && order.orderID.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (order.email && order.email.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (order.firstName && order.firstName.toLowerCase().includes(lowerCaseSearchTerm))
    );
      setFilteredOrders(results);
    } else {
      setFilteredOrders([]);
    }
  }, [searchTerm, allOrders]);

  const totalPages = Math.ceil(totalOrders / ordersPerPage); // Calcular el total de páginas dinámicamente


  const loadOrders = async () => {
    setLoading(true);
    setOrders([]);
    
    // Obtención de la información de Clear Mechanics
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
      // Si no se tiene referencia, se puede volver a la primera página o manejar error
      ordersQuery = query(
        collection(db, "orders"),
        orderBy("uploadTime", "desc"),
        limit(ordersPerPage)
      );
    }
  
    const querySnapshot = await getDocs(ordersQuery);
    const fetchedOrders = [];
  
    for (const docSnap of querySnapshot.docs) {
      const order = docSnap.data();
      // ... lógica de actualización de estados ...
      fetchedOrders.push(order);
    }
  
    setOrders(fetchedOrders);
  
    // Guardar la referencia del último documento para la página actual
    if (querySnapshot.docs.length > 0) {
      setPagesLastDoc((prev) => ({
        ...prev,
        [currentPage]: querySnapshot.docs[querySnapshot.docs.length - 1],
      }));
    }
  
    setLoading(false);
  };
  
  // Al cambiar de página, ya NO debemos resetear el lastVisible
  const handlePageChange = (page) => {
    setCurrentPage(page);
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

// --Calculos--


const calculateOrderTotal = (order) => {
  if (!order.inspectionItems || !Array.isArray(order.inspectionItems)) {
    return '0.00';
  }

  const total = order.inspectionItems.reduce((acc, item) => {
    const partUnitPrice = parseFloat(item.partUnitPrice) || 0;
    const quantity = parseFloat(item.quantity) || 0;
    const impuestos = item.impuestos ? item.impuestos.trim() : "0"; // "16" o "0"

    let itemTotal = partUnitPrice * quantity;

    if (impuestos === "16") {
      itemTotal *= 1.16; // Agregar el 16% de IVA
    }

    return acc + itemTotal;
  }, 0);

  return total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};



  return (
    <div className="containerOrdenes">
      
      <div className="container-buscador">
        <input 
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por No. Orden, correo electrónico, nombre"
        />
        {filteredOrders.length > 0 && (
          <ul className="dropdown-buscador">
            {filteredOrders.map(order => (
              <li 
                key={order.id} 
                onClick={() => onOrderClick(order.orderID)} 
                >
              {order.orderID} - {order.firstName} {order.lastName}
        </li>
            ))}
          </ul>
        )}
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
                <th>Categoria</th>
                <th>Total</th>
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

                  <td>{order.categoria_h || 'SpeedCenter'}</td>
                  <td>$ {calculateOrderTotal(order)}</td>

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
