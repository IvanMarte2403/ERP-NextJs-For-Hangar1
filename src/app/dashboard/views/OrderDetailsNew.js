"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faPhone, faEnvelope, faTimes } from '@fortawesome/free-solid-svg-icons';
// --Modales--
import ModalClient from './Modal/ModalClient'; 
//--Services--
import { getClientInformation } from '../../../../services/ClientInformation';
import { getAllClients } from '../../../../services/ClientsDatabase';
import { createOrder } from '../../../../services/CreateOrder';
import { getAuth } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../../lib/firebase";

export default function OrderDetailsNew({ setSelectedOrderId, setView }) {

  const [fecha, setFecha] = useState('');

  const [isUserAssigned, setIsUserAssigned] = useState(false);
  const [clientInfo, setClientInfo] = useState(null);
  const [dailyCount, setDailyCount] = useState(1);
  const [orderNumber, setOrderNumber] = useState('');

  // --- Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ---------- CAMPOS EXISTENTES ----------
  const [brand, setBrand] = useState('');          // Antes se usaba "model" para la marca
  const [year, setYear] = useState('');
  const [taller, setTaller] = useState('');
  const [inCharge, setInCharge] = useState('');
  const [categoria, setCategoria] = useState(''); 
  const [placa, setPlaca] = useState('');
  const [kilometros, setKilometros] = useState('');
  const [categoria_h, setCategoriaH] = useState('');
  const [color, setColor] = useState('');

  // ---------- NUEVOS CAMPOS ----------
  const [model, setModel] = useState('');                // (Obligatorio)
  const [motor, setMotor] = useState('');                // (Obligatorio)
  const [vin, setVin] = useState('');                    // (Opcional)
  const [mechanic_assigment, setMechanicAssigment] = useState(''); // (Obligatorio)

  // Verifica si ya existe el número de orden
  async function checkIfOrderExists(orderNum) {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("orderNumber", "==", orderNum));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }

  // Función para abrir el modal
  const openModal = () => {
    setIsModalOpen(true);
    document.querySelector('.container-crud')?.classList.add('main-blur');
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    document.querySelector('.container-crud')?.classList.remove('main-blur');
  };

  // Establece la fecha actual al cargar
  useEffect(() => {
    const now = new Date();
    // Formato YYYY-MM-DDTHH:MM
    const formattedNow = now.toISOString().slice(0, 16);
    setFecha(formattedNow);
  }, []);

  // Generar número de orden único
  useEffect(() => {
    async function generateUniqueOrderNumber() {
      const auth = getAuth();
      const user = auth.currentUser;

      let advisorNumber = '03'; // Por defecto
      if (user) {
        const email = user.email;
        if (email === 'asesor1@hangar1.com.mx') {
          advisorNumber = '01';
        } else if (email === 'asesor2@hangar1.com.mx') {
          advisorNumber = '02';
        }
      }

      if (fecha) {
        const currentDateObj = new Date(fecha);
        const yearStr = currentDateObj.getFullYear().toString().slice(-2);
        const monthStr = (currentDateObj.getMonth() + 1).toString().padStart(2, '0');
        const dayStr = currentDateObj.getDate().toString().padStart(2, '0');

        let randomSequence;
        let formattedOrderNumber;
        let exists = true;

        while (exists) {
          randomSequence = Math.floor(Math.random() * 100).toString().padStart(2, '0');
          formattedOrderNumber = `${advisorNumber}${yearStr}${monthStr}${dayStr}${randomSequence}`;
          exists = await checkIfOrderExists(formattedOrderNumber);
          if (!exists) {
            setOrderNumber(formattedOrderNumber);
          }
        }
      }
    }
    generateUniqueOrderNumber();
  }, [fecha]);

  // Cuando se guarda un nuevo cliente desde el Modal
  const handleClientSaved = async (clientId) => {
    closeModal();
    const clientData = await getClientInformation(clientId);
    if (clientData) {
      setClientInfo(clientData);
      setIsUserAssigned(true);
    }
  };

  // --- Carga y Filtrado de Clientes ---
  const [allClients, setAllClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      const clients = await getAllClients();
      setAllClients(clients);
    };
    fetchClients();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const results = allClients.filter(client => {
        const clientName = client.nombre ? client.nombre.toLowerCase() : '';
        const clientEmail = client.correo ? client.correo.toLowerCase() : '';
        return (
          clientName.includes(searchTerm.toLowerCase()) ||
          clientEmail.includes(searchTerm.toLowerCase())
        );
      });
      setFilteredClients(results);
    } else {
      setFilteredClients([]);
    }
  }, [searchTerm, allClients]);

  const handleClientSelect = async (clientId) => {
    const clientData = await getClientInformation(clientId);
    if (clientData) {
      setClientInfo(clientData);
      setIsUserAssigned(true);
    }
  };

  // Crear Orden
  const handleCreateOrder = async () => {
    // Validación de campos obligatorios
    if (
      !brand ||
      !year ||
      !model ||
      !motor ||
      !mechanic_assigment ||
      !taller ||
      !inCharge ||
      !categoria ||
      !fecha ||
      !placa ||
      !kilometros ||
      !categoria_h ||
      !color
    ) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    if (!isUserAssigned || !clientInfo) {
      alert("Por favor, asigna un cliente antes de crear la orden.");
      return;
    }

    const orderData = {
      // Datos de cliente
      firstName: clientInfo.nombre,
      email: clientInfo.correo,
      mobile: clientInfo.telefono,

      // Datos de la Orden
      orderID: orderNumber,
      orderNumber: orderNumber,
      estado_orden: "Presupuesto",
      paymentMethod: "Deposito",
      inspectionItems: [],
      uploadTime: fecha,

      // Campos antiguos (sin cambios):
      brand,            // Marca
      year,
      categoria,
      taller,
      placa_coche: placa,
      kilometros: parseInt(kilometros),
      categoria_h,
      color,
      inCharge,

      // Campos nuevos:
      model,            // Modelo
      motor,            // Motor
      vin,              // VIN (opcional, puede ir vacío)
      mechanic_assigment
    };

    const success = await createOrder(orderData);
    if (success) {
      alert("Orden creada con éxito.");
      setSelectedOrderId(orderNumber);
      setView("orderDetails");
    } else {
      alert("Hubo un error al crear la orden.");
    }
  };

  return (
    <div className="order-details-new">
      <div className="title-order">
        <h3>New Order / {orderNumber}</h3>
      </div>

      <div className="container-crud">
        {/* Información del Cliente */}
        {isUserAssigned ? (
          <div className="user-asignado">
            <div className="title-new">
              <p>Cliente</p>
              <FontAwesomeIcon 
                icon={faTimes}
                onClick={() => setIsUserAssigned(false)}
              />
            </div>

            <div className="container-usuario-info">
              <img src="perfil-photos/default.svg" alt="Perfil" />
              <h3>{clientInfo?.nombre || "Sin nombre"}</h3>
            </div>

            <div className="data-cliente">
              <div className="row-cellphone">
                <FontAwesomeIcon icon={faPhone} />
                <p>{clientInfo?.telefono || "Sin teléfono"}</p>
              </div>

              <div className="row-email">
                <FontAwesomeIcon icon={faEnvelope} />
                <p>{clientInfo?.correo || "Sin correo"}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="user-no-asignado">
            <div className="input-client">
              <p>Cliente</p>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre o correo"
              />
              {filteredClients.length > 0 && (
                <ul className="client-results">
                  {filteredClients.map(client => (
                    <li 
                      key={client.id} 
                      onClick={() => handleClientSelect(client.id)}
                    >
                      {client.nombre} - {client.correo}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="button-container">
              <button 
                onClick={openModal}
                className="nuevo-cliente"
              >
                Nuevo Cliente
              </button>
            </div>
          </div>
        )}

        {/* Datos del Vehículo y Orden */}
        <div className="car-container-new">
          <div className="title-new">
            <p>Automóvil</p>
          </div>

          {/* Marca / Año */}
          <div className="row-forms">
            <div className="input">
              <p>Marca</p>
              <input
                type="text"
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
            <div className="input">
              <p>Año</p>
              <input
                type="text"
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
          </div>

          {/* Modelo / Motor */}
          <div className="row-forms">
            <div className="input">
              <p>Modelo</p>
              <input
                type="text"
                onChange={(e) => setModel(e.target.value)}
              />
            </div>
            <div className="input">
              <p>Motor</p>
              <input
                type="text"
                onChange={(e) => setMotor(e.target.value)}
              />
            </div>
          </div>

          {/* Categoría / Color */}
          <div className="row-forms">
            <div className="input">
              <p>Categoría de Coche</p>
              <input
                type="text"
                onChange={(e) => setCategoria(e.target.value)}
              />
            </div>
            <div className="input">
              <p>Color</p>
              <input
                type="text"
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
          </div>

          {/* Placa / VIN */}
          <div className="row-forms">
            <div className="input">
              <p>Placa</p>
              <input
                type="text"
                onChange={(e) => setPlaca(e.target.value)}
              />
            </div>
            <div className="input">
              <p>VIN</p>
              <input
                type="text"
                onChange={(e) => setVin(e.target.value)}
              />
            </div>
          </div>

          {/* Kilometraje / Tipo de Servicio (categoria_h) */}
          <div className="row-forms">
            <div className="input">
              <p>Kilometraje</p>
              <input
                type="number"
                placeholder="km"
                onChange={(e) => setKilometros(e.target.value)}
              />
            </div>
            <div className="input">
              <p>Servicio (SpeedCenter/PrimeService)</p>
              <select
                onChange={(e) => setCategoriaH(e.target.value)}
              >
                <option value="">Selecciona un tipo de servicio</option>
                <option value="SpeedCenter">SpeedCenter</option>
                <option value="PrimeService">PrimeService</option>
              </select>
            </div>
          </div>

          <div className="title-new">
            <p>Hangar</p>
          </div>

          {/* Taller / Asesor */}
          <div className="row-forms">
            <div className="input">
              <p>Taller Asignado</p>
              <input
                type="text"
                onChange={(e) => setTaller(e.target.value)}
              />
            </div>
            <div className="input">
              <p>Asesor Asignado</p>
              <input
                type="text"
                onChange={(e) => setInCharge(e.target.value)}
              />
            </div>
          </div>

          {/* Mecánico / Fecha & Hora */}
          <div className="row-forms">
            <div className="input">
              <p>Mecánico Asignado</p>
              <input
                type="text"
                onChange={(e) => setMechanicAssigment(e.target.value)}
              />
            </div>
            <div className="input">
              <p>Fecha & Hora</p>
              <input
                type="datetime-local"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </div>
          </div>

          <div className="container-button">
            <button 
              className="new-order"
              onClick={handleCreateOrder}
            >
              Crear Order
            </button>
          </div>
        </div>
      </div>

      {/* Modal para seleccionar cliente */}
      <ModalClient 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onClientSaved={handleClientSaved} 
      />
    </div>
  );
}
