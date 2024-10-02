 // src/app/dashboard/views/NavBar.js

import React from 'react';

export default function NavBar({ setView }) {
  return (
    <div className="container-nav">
      <ul>
        <li onClick={() => setView("ordenes")}>
          <img src="icons/car-solid.png" alt="Órdenes Icono" /> Ordenes
        </li>

        <li onClick={() => setView("dashboard")}>
          <img src="icons/dashboard.png" alt="Dashboard Icono" /> Dashboard
        </li>

        <li onClick={() => setView("notificaciones")}>
          <img src="icons/notificaciones.png" alt="Notificaciones Icono" /> Notificaciones
        </li>
      </ul>
    </div>
  );
}
