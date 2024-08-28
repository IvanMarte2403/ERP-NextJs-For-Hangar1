"use client";

import { useState } from "react";
import Ordenes from "./views/Ordenes";
import Dashboard from "./views/Dashboard";
import Notificaciones from "./views/Notificaciones";
import OrderDetails from "./views/OrderDetails";

export default function DashboardPage() {
  const [view, setView] = useState("ordenes"); // Estado para manejar la vista actual
  const [selectedOrderId, setSelectedOrderId] = useState(null); // Estado para manejar la ID de la orden seleccionada

  // Función para renderizar la vista seleccionada
  const renderView = () => {
    switch (view) {
      case "ordenes":
        return <Ordenes onOrderClick={(orderId) => {
          setSelectedOrderId(orderId);
          setView("orderDetails");
        }} />;
      case "dashboard":
        return <Dashboard />;
      case "notificaciones":
        return <Notificaciones />;
      case "orderDetails":
        return <OrderDetails orderId={selectedOrderId} />;
      default:
        return <Ordenes />;
    }
  };

  return (
    <main className="container-home">
      <div className="nav-bar-home">
        <div className="container-image">
          <img src="img/logo-hangar-1.png" alt="Logo" />
        </div>

        <div className="container-nav">
          <ul>
            <li onClick={() => setView("ordenes")}>
              <img src="icons/car-solid.png" alt="Órdenes Icono" />Ordenes
            </li>

            <li onClick={() => setView("dashboard")}>
              <img src="icons/dashboard.png" alt="Dashboard Icono" />Dashboard
            </li>

            <li onClick={() => setView("notificaciones")}>
              <img src="icons/notificaciones.png" alt="Notificaciones Icono" />Notificaciones
            </li>
          </ul>
        </div>
      </div>

      <div className="home-container">
        {renderView()} {/* Renderiza la vista seleccionada */}
      </div>
    </main>
  );
}
