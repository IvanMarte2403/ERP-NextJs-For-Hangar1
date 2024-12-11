"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importa el componente FontAwesomeIcon
import { faPhone, faEnvelope, faTimes} from '@fortawesome/free-solid-svg-icons'; // Importa el icono específico
// --Modales--
import ModalClient from './Modal/ModalClient'; // Importa el modal
//--Services--
import { getClientInformation } from '../../../../services/ClientInformation'; // Importamos la consulta
import { getAllClients } from '../../../../services/ClientsDatabase'; // Importamos la consulta
import {createOrder} from '../../../../services/CreateOrder'
import { getAuth } from "firebase/auth";

export default function OrderDetailsNew({ setSelectedOrderId, setView}) {
  const [fecha, setFecha] = useState(''); 

const [isUserAssigned, setIsUserAssigned] = useState(false); // Estado para manejar si el usuario está asignado
const [clientInfo, setClientInfo] = useState(null); // Estado para la información del cliente
const [dailyCount, setDailyCount] = useState(1);
// Estado para el número de orden aleatorio
const [orderNumber, setOrderNumber] = useState('');

// --- Modal --- 
const [isModalOpen, setIsModalOpen] = useState(false); // Estado para manejar si el modal está abierto

// Función para abrir el modal
const openModal = () => {
    setIsModalOpen(true);
    document.querySelector('.container-crud').classList.add('main-blur'); // Agregar la clase .main-blur
};

// Función para cerrar el modal
const closeModal = () => {
    setIsModalOpen(false);
    document.querySelector('.container-crud').classList.remove('main-blur'); // Quitar la clase .main-blur
};

useEffect(() => {
  const now = new Date();
  // Formato YYYY-MM-DDTHH:MM para el input datetime-local
  const formattedNow = now.toISOString().slice(0,16);
  setFecha(formattedNow);
}, []);


//--- Generar un número inteligente
useEffect(() => {
  console.log("useEffect para generar el número de orden ejecutado");
  const auth = getAuth();
  const user = auth.currentUser;
  console.log("Usuario actual:", user);

  
  let advisorNumber = '03'; // Por defecto
  if (user) {
    const email = user.email;
    if (email === 'asesor1@hangar1.com.mx') {
      advisorNumber = '01';
    } else if (email === 'asesor2@hangar1.com.mx') {
      advisorNumber = '02';
    }
  }

  console.log("advisorNumber seleccionado:", advisorNumber);

  console.log("Valor de fecha:", fecha);
  console.log("Valor de dailyCount:", dailyCount);

  if (fecha) {
    const currentDateObj = new Date(fecha);
    const yearStr = currentDateObj.getFullYear().toString().slice(-2);
    const monthStr = (currentDateObj.getMonth() + 1).toString().padStart(2, '0');
    const dayStr = currentDateObj.getDate().toString().padStart(2, '0');

    const sequence = dailyCount.toString().padStart(2, '0');
    const formattedOrderNumber = `${advisorNumber}${yearStr}${monthStr}${dayStr}${sequence}`;

    console.log("formattedOrderNumber generado:", formattedOrderNumber);

    setOrderNumber(formattedOrderNumber);
  }else{
    console.log("No se generó número porque 'fecha' está vacío");

  }
}, [fecha, dailyCount]);



// ---- Client Information ---- 
  // Función para manejar cuando el cliente es guardado
  const handleClientSaved = async (clientId) => {
    closeModal(); // Cerrar el modal
    const clientData = await getClientInformation(clientId); // Consultar la información del cliente
    if (clientData) {
      setClientInfo(clientData); // Guardar la información del cliente en el estado
      setIsUserAssigned(true); // Marcar como asignado
    }
  };

  // --- All Clients --- 

  const [allClients, setAllClients] = useState([]); // Almacenar todos los clientes en caché
  const [filteredClients, setFilteredClients] = useState([]); // Clientes filtrados
  const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda

    // Cargar todos los clientes al montar el componente y almacenarlos en caché
    useEffect(() => {
      const fetchClients = async () => {
        const clients = await getAllClients();
        setAllClients(clients); // Guardar en caché
      };
      fetchClients();
    }, []);

    useEffect(() => {
      if (searchTerm) {
        const results = allClients.filter(client => {
          const clientName = client.nombre ? client.nombre.toLowerCase() : '';
          const clientEmail = client.correo ? client.correo.toLowerCase() : '';
          
          return clientName.includes(searchTerm.toLowerCase()) || 
                 clientEmail.includes(searchTerm.toLowerCase());
        });
        setFilteredClients(results); // Actualizar lista filtrada
      } else {
        setFilteredClients([]); // Limpiar resultados cuando no hay búsqueda
      }
    }, [searchTerm, allClients]);
    

    // --- Selector de All Clientes --- 

    const handleClientSelect = async (clientId) => {
      const clientData = await getClientInformation(clientId); // Consultar la información del cliente
      if (clientData) {
        setClientInfo(clientData); // Guardar la información del cliente en el estado
        setIsUserAssigned(true); // Marcar como asignado
      }
    };
    // --- Formulario de Crear Order---

    const [model, setModel] = useState(''); 
    const [year, setYear] = useState(''); 
    const [taller, setTaller] = useState(''); 
    const [inCharge, setInCharge] = useState(''); 
    const [categoria, setCategoria] = useState(''); 
    const [placa, setPlaca] = useState(''); 
    const [kilometros, setKilometros] = useState('');
    const [categoria_h, setCategoriaH] = useState('');
    const [color, setColor] = useState(''); // Estado para el color



    const handleCreateOrder = async () => {
      if (!model || !year || !taller || !inCharge || !categoria || !fecha || !placa || !kilometros || !categoria_h || !color) {
        alert("Por favor, completa todos los campos del formulario");
        return;
      }
          
      // Depurar para verificar los datos del cliente
      console.log("Datos del cliente asignado:", clientInfo);

    
      if (!isUserAssigned || !clientInfo) {
        alert("Por favor, asigna un cliente antes de crear la orden");
        return;
      }
    
      // Si todo está completo, crear la orden
      const orderData = {
        firstName: clientInfo.nombre,
        brand: model,
        email: clientInfo.correo,
        estado_orden: "Presupuesto",
        inCharge,
        inspectionItems: [],
        mobile: clientInfo.telefono,
        orderID: orderNumber,
        orderNumber: orderNumber,
        paymentMethod: "Deposito",
        uploadTime: fecha,
        year,
        categoria,
        taller,
        placa_coche: placa,
        kilometros: parseInt(kilometros), 
        categoria_h: categoria_h,
        color: color,   
      };
    
      const success = await createOrder(orderData);
      if (success) {
        alert("Orden creada con éxito");
      // Redirigir a la vista de detalles de la orden y pasar el orderId generado
      setSelectedOrderId(orderNumber);
      setView("orderDetails"); // Cambiar la vista a OrderDetails
      } else {
        alert("Hubo un error al crear la orden");
      }
    };




  return (
    <div className="order-details-new">
        <div className="title-order">
          <h3>New Order / {orderNumber}</h3>
        </div >

        {/* -- Container CRUD --  */}

        <div className="container-crud">
          {/* Renderizar condicionalmente según el estado */}
            {isUserAssigned ? (
              <div className="user-asignado">
                {/* Sección de usuario asignado */}
                <div className="title-new">
                  <p>Cliente</p>
                  <FontAwesomeIcon icon={faTimes}
                  onClick={() => setIsUserAssigned(false)}
                  />
                </div>

                <div className="container-usuario-info">
                  <img src="perfil-photos/default.svg" />
                  <h3>{clientInfo?.nombre || "Sin nombre"}</h3> {/* Mostrar nombre del cliente */}
                  </div>

                <div className="data-cliente">
                  <div className="row-cellphone">
                    <FontAwesomeIcon icon={faPhone} />
                    <p>{clientInfo?.telefono || "Sin teléfono"}</p> {/* Mostrar teléfono del cliente */}
                    </div>

                  <div className="row-email">
                    <FontAwesomeIcon icon={faEnvelope} />
                    <p>{clientInfo?.correo || "Sin correo"}</p> {/* Mostrar correo del cliente */}
                    </div>
                </div>
              </div>
            ) : (
          <div className="user-no-asignado">
                {/* Nueva sección de usuario no asignado */}
            
                <div className="input-client">
                  <p>Cliente</p>
                  <input type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} // Actualizar el término de búsqueda
                  placeholder="Buscar por nombre o correo"

                  />

                  {/* Mostrar resultados de búsqueda */}
                  {filteredClients.length > 0 && (
                  <ul className="client-results">
                    {filteredClients.map(client => (
                      <li key={client.id} onClick={() => handleClientSelect(client.id)}>
                        {client.nombre} - {client.correo}
                      </li>
                    ))}
                   </ul>
                  )}
                </div>

          

                <div className="button-container">
                  <button 
                  onClick={openModal}
                  className="nuevo-cliente">
                      Nuevo Cliente
                  </button>
                </div>

               
              </div>
            )}
            
              {/* ----- Container Information -----  */}
              <div className="car-container-new">
                <div className="title-new">
                    <p>Campos del Auto</p>
                </div>
                  
                {/* Row Forms */}
                <div className="row-forms">
                    {/* Input */}
                    <div className="input">
                      <p>Módelo</p>
                      <input
                      type="text"
                      onChange={(e) => setModel(e.target.value)}

                      />
                    </div>
                    {/* Input */}
                    <div className="input">
                      <p>Año</p>
                      <input
                      type="text"
                      onChange={(e) => setYear(e.target.value)}

                      />
                    </div>


                </div>
                  
                {/* Row Forms */}
                <div className="row-forms">
                    {/* Input */}
                    <div className="input">
                      <p>Taller</p>
                      <select
                        onChange={(e) => setTaller(e.target.value)}
                      >
                        <option value="">Selecciona un taller</option>
                        <option value="H1">H1</option>
                        <option value="H2">H2</option>
                        <option value="H3">H3</option>
                      </select>
                    </div>
                    {/* Input */}
                    <div className="input">
                      <p>Asesor</p>
                      <select
                        onChange={(e) => setInCharge(e.target.value)}
                      >
                        <option value="">Selecciona un asesor</option>
                        <option value="Cristian Abarca">Cristian Abarca</option>
                        <option value="Jorge Sanchez">Jorge Sanchez</option>
                      </select>
                    </div>



                </div>

                {/* Kilometraje / SpeedCenter */}
                <div className="row-forms">
                    {/* Input */}
                    <div className="input">
                      <p>Kilometraje</p>
                      <input
                        type="number"
                        placeholder="km"
                        onChange={(e) => setKilometros(e.target.value)}
                      />
                    </div>
                    {/* Input */}
                    <div className="input">
                      <p>Categoría</p>
                      <select
                          onChange={(e) => setCategoriaH(e.target.value)}
                        >
                          <option value="">Selecciona una categoría</option>
                          <option value="SpeedCenter">SpeedCenter</option>
                          <option value="PrimeService">PrimeService</option>
                        </select>
                    </div>



                </div>
                {/* Row Forms */}
                <div className="row-forms">
                    {/* Input */}
                    <div className="input">
                      <p>Categoría de Coche</p>
                      <select
                        onChange={(e) => setCategoria(e.target.value)}
                      >
                        <option value="">Selecciona una categoría</option>
                        <option value="Hot Hatches Turbo">Hot Hatches Turbo</option>
                        <option value="Muscle Cars">Muscle Cars</option>
                        <option value="4x4 Off Road">4x4 Off Road</option>
                        <option value="Hatch Back">Hatch Back</option>
                        <option value="Sedan/Coupe Turbo">Sedan/Coupe Turbo</option>
                        <option value="Sedan/Coupe Premium">Sedan/Coupe Premium</option>
                        <option value="Deportivo">Deportivo</option>
                        <option value="Carreras">Carreras</option>
                        <option value="Exótico">Exótico</option>
                        <option value="Blindado">Blindado</option>
                        <option value="Clásico">Clásico</option>
                        <option value="Cross Over">Cross Over</option>
                        <option value="Pick Up">Pick Up</option>
                        <option value="Mini Van">Mini Van</option>
                        <option value="Suv">Suv</option>
                        <option value="Suv Europea">Suv Europea</option>
                        <option value="Moto">Moto</option>
                      </select>
                    </div>

                    {/* Input */}
                    <div className="input">
                      <p>Fecha y Hora</p>
                      <input
                        type="datetime-local"
                        value={fecha} // Establece el estado de la fecha
                        onChange={(e) => setFecha(e.target.value)}
                      />
                    </div>




                </div>


                  {/* Placa */}
                <div className="container-placa">
                  <div className="placa">
                    <p>Placa</p>
                    <input
                      type="text"
                      onChange={(e) => setPlaca(e.target.value)}

                    />
                  </div>

                       {/* Input */}
                       <div className="input">
                      <p>Color</p>
                      <input
                        type="text"
                        onChange={(e) => setColor(e.target.value)} // Actualizar el estado color

                      />
                    </div>
                </div>

                {/* Bottoms */}

                  <div className="container-button">
                    <button className="new-order"
                     onClick={handleCreateOrder}
                    >
                      Crear Order
                    </button>
                  </div>
                  
              </div>

                 
          
        </div>


      {/* Modal para seleccionar cliente */}
      <ModalClient isOpen={isModalOpen} onClose={closeModal} onClientSaved={handleClientSaved} />


    </div>
  );
}
