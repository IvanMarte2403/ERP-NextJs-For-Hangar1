"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importa el componente FontAwesomeIcon
import { faPhone, faEnvelope, faTimes} from '@fortawesome/free-solid-svg-icons'; // Importa el icono específico
// --Modales--
import ModalClient from './Modal/ModalClient'; // Importa el modal

//--Services--

import { getClientInformation } from '../../../../services/ClientInformation'; // Importamos la consulta
import { getAllClients } from '../../../../services/ClientsDatabase'; // Importamos la consulta



export default function OrderDetailsNew() {

const [isUserAssigned, setIsUserAssigned] = useState(false); // Estado para manejar si el usuario está asignado
const [clientInfo, setClientInfo] = useState(null); // Estado para la información del cliente

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

//--- Generar un número aleatorio----
// Generar número aleatorio de 8 dígitos al montar el componente
useEffect(() => {
  const randomOrderNumber = Math.floor(10000000 + Math.random() * 90000000).toString();
  setOrderNumber(randomOrderNumber);
}, []);



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
                      
                      />
                    </div>
                    {/* Input */}
                    <div className="input">
                      <p>Año</p>
                      <input
                      type="text"
                      
                      />
                    </div>


                </div>
                  
                {/* Row Forms */}
                <div className="row-forms">
                    {/* Input */}
                    <div className="input">
                      <p>Taller</p>
                      <input
                      type="text"
                      
                      />
                    </div>
                    {/* Input */}
                    <div className="input">
                      <p>Asesor</p>
                      <input
                      type="text"
                      
                      />
                    </div>


                </div>
                {/* Row Forms */}
                <div className="row-forms">
                    {/* Input */}
                    <div className="input">
                      <p>Categoría</p>
                      <input
                      type="text"
                      
                      />
                    </div>
                    {/* Input */}
                    <div className="input">
                      <p>Fecha</p>
                      <input
                      type="text"
                      
                      />
                    </div>


                </div>
                  {/* Placa */}
                <div className="container-placa">
                  <div className="placa">
                    <p>Placa</p>
                    <input
                      type="text"
                    />
                  </div>
                </div>

                {/* Bottoms */}

                  <div className="container-button">
                    <button className="new-order">
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
