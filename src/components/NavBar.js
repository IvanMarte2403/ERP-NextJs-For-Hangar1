 // src/app/dashboard/views/NavBar.js
 import React, { useEffect, useState } from 'react';

 import { auth } from '../../lib/firebase'; 


export default function NavBar({ setView }) {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Obtener el correo electrónico del usuario actual
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
    }
  }, []);

  // Lista de correos autorizados para ver la opción "Productos"
  const allowedEmails = ['isaac@hangar1.com.mx', 'ivan@hangar1.com.mx', 'oliver@hangar1.com.mx', 'emilio@hangar1.com.mx'];

  return (
    <div className="container-nav">
      <ul>
        <li onClick={() => setView("ordenes")}>
          <img src="icons/car-solid.png" alt="Órdenes Icono" /> Ordenes
        </li>
{/* 
        <li onClick={() => setView("dashboard")}>
          <img src="icons/dashboard.png" alt="Dashboard Icono" /> Dashboard
        </li>

        <li onClick={() => setView("notificaciones")}>
          <img src="icons/notificaciones.png" alt="Notificaciones Icono" /> Notificaciones
        </li> */}

        {allowedEmails.includes(userEmail) && (
          <li onClick={() => setView("productos")}>
            <img src="icons/products.svg" alt="Creación Producto" /> Productos 
          </li>
        )}


      </ul>
    </div>
  );
}
