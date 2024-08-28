"use client";  // Indica que este es un Client Component

import { useState } from "react";
import Ordenes from "./views/Ordenes";
import Dashboard from "./views/Dashboard";
import Notificaciones from "./views/Notificaciones";

export default function DashboardPage() {
  const [view, setView] = useState("ordenes"); // Estado para manejar la vista actual

  // Función para renderizar la vista seleccionada
  const renderView = () => {
    switch (view) {
      case "ordenes":
        return <Ordenes />;
      case "dashboard":
        return <Dashboard />;
      case "notificaciones":
        return <Notificaciones />;
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
