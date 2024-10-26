"use client";

import { useState, useEffect } from "react";
import Ordenes from "./views/Ordenes";
import Dashboard from "./views/Dashboard";
import Notificaciones from "./views/Notificaciones";
import OrderDetails from "./views/OrderDetails";
import NavBar from "../../components/NavBar"
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Importar Firebase Auth

//--- Views --- 

import OrderDetailsNew from "./views/OrderDetailsNew";
import Products from "./views/Product";


export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState(null); // Estado para almacenar el correo del usuario

  // Obtener el correo del usuario autenticado
    useEffect(() => {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserEmail(user.email); // Establecer el correo del usuario autenticado
        } else {
          setUserEmail(null); // Usuario no autenticado
        }
      });

      return () => unsubscribe(); // Limpiar la suscripción al desmontar
    }, []);


  const [view, setView] = useState("ordenes"); // Estado para manejar la vista actual
  const [selectedOrderId, setSelectedOrderId] = useState(null); // Estado para manejar la ID de la orden seleccionada
  //Estado para controlar si es una nueva orden
  const [isNewOrder, setIsNewOrder] = useState(false);

  // Función para renderizar la vista seleccionada
  const renderView = () => {
    switch (view) {
      case "ordenes":
        return <Ordenes onOrderClick={(orderId) => {
          setSelectedOrderId(orderId);
          setView("orderDetails");
          setIsNewOrder(false); // No es una nueva orden
        }} />;
      case "dashboard":
        return <Dashboard />;
      case "notificaciones":
        return <Notificaciones />;
      case "orderDetails":
        return <OrderDetails orderId={selectedOrderId} isNewOrder={isNewOrder} />;
      case "orderDetailsNew":
        return <OrderDetailsNew setSelectedOrderId={setSelectedOrderId} setView={setView} />;
      case "productos":
        return <Products userEmail={userEmail} />; 
        default:
        return <Ordenes />;
    }
  };
  

    // Función para generar un ID de orden aleatorio de 8 dígitos
  const generateRandomOrderId = () => {
      return Math.floor(10000000 + Math.random() * 90000000).toString();
    };

  return (
    <main className="container-home">
      {/* Menu Nav */} 
      <div className="nav-bar-home">
        <div className="container-image">
          <img src="img/logo-hangar-1.png" alt="Logo" />
        </div>

        <NavBar setView={setView} />

      </div>

      <div className="home-container">
        <div className="header-profile">
          <h1>¡Bienvenidos a Hangar1 System! 🏎️</h1>
          <div className="search-container">
            <img src="icons/search.png" />
          </div>

          <div className="container-nueva-order">
            <button className="botton-nuevaOrden"
            onClick={() => {
              setIsNewOrder(true); // Es una nueva orden
              setView("orderDetailsNew"); // Cambiar la vista a OrderDetailsNew
            }}
            >
              Nueva Orden
            </button>
          </div>
        </div>
        {renderView()} {/* Renderiza la vista seleccionada */}
      </div>
    </main>
  );
}
