 // src/app/dashboard/views/NavBar.js
 import React, { useEffect, useState } from 'react';

 import { auth } from '../../lib/firebase'; 


 export default function NavBar({ setView}) {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email); // Establecer el correo del usuario autenticado
      } else {
        setUserEmail(''); // Vaciar el correo si no hay usuario
      }
    });
  
    return () => unsubscribe(); // Limpia la suscripción al desmontar
  }, []);
  

  // Lista de correos autorizados para ver la opción "Productos"
  const allowedEmails = ['isaac@hangar1.com.mx', 'ivan@hangar1.com.mx', 'oliver@hangar1.com.mx', 'emilio@hangar1.com.mx'];
  const allowedDashboardEmails = ['admin@hangar1.com.mx', 'ivan@hangar1.com.mx', 'oliver@hangar1.com.mx', 'emilio@hangar1.com.mx'];

  return (
    <div className="container-nav">
      <ul>
        <li onClick={() => setView("ordenes")}>
          <img src="icons/car-solid.png" alt="Órdenes Icono" /> Ordenes
        </li>

        {allowedDashboardEmails.includes(userEmail) && (
          
          <li onClick={() => setView("dashboard")}
          >
            <img src="icons/dashboard.png" alt="" />
            Dashboard</li>
        )}


        {allowedEmails.includes(userEmail) && (
          <li onClick={() => setView("productos")}>
            <img src="icons/products.svg" alt="Creación Producto" /> Productos 
          </li>
        )}


      </ul>
    </div>
  );
}
