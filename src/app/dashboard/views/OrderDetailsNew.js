"use client";

import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope, faTimes } from "@fortawesome/free-solid-svg-icons";

import ModalClient from "./Modal/ModalClient";

import { getClientInformation } from "../../../../services/ClientInformation";
import { getAllClients } from "../../../../services/ClientsDatabase";
import { createOrder } from "../../../../services/CreateOrder";
import { getCarBrands } from "../../../../services/NewOrder/filterCoches";
import { getCarModels } from "../../../../services/NewOrder/filterModelos";
import { getCarTrims } from "../../../../services/NewOrder/filterInfoCoche";

import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../../lib/firebase";

export default function OrderDetailsNew({ setSelectedOrderId, setView }) {
  const [fecha, setFecha] = useState("");

  const [isUserAssigned, setIsUserAssigned] = useState(false);
  const [clientInfo, setClientInfo] = useState(null);
  const [orderNumber, setOrderNumber] = useState("");

  const [brand, setBrand] = useState("");
  const [brandId, setBrandId] = useState(null);
  const [year, setYear] = useState("");
  const [model, setModel] = useState("");
  const [modelId, setModelId] = useState(null);
  const [motor, setMotor] = useState("");
  const [vin, setVin] = useState("");
  const [taller, setTaller] = useState("");
  const [inCharge, setInCharge] = useState("");
  const [categoria, setCategoria] = useState("");
  const [placa, setPlaca] = useState("");
  const [kilometros, setKilometros] = useState("");
  const [categoria_h, setCategoriaH] = useState("");
  const [color, setColor] = useState("");
  const [mechanic_assigment, setMechanicAssigment] = useState("");

  const [allClients, setAllClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [brands, setBrands] = useState([]);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [isOtherBrand, setIsOtherBrand] = useState(false);
  const brandInputRef = useRef(null);

  const [models, setModels] = useState([]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [isOtherModel, setIsOtherModel] = useState(false);
  const modelInputRef = useRef(null);

  const [motors, setMotors] = useState([]);
  const [showMotorDropdown, setShowMotorDropdown] = useState(false);
  const [isOtherMotor, setIsOtherMotor] = useState(false);
  const motorInputRef = useRef(null);

  useEffect(() => {
    const now = new Date();
    setFecha(now.toISOString().slice(0, 16));
  }, []);

  useEffect(() => {
    async function generateUniqueOrderNumber() {
      const auth = getAuth();
      const user = auth.currentUser;
      let advisorNumber = "03";
      if (user) {
        const email = user.email;
        if (email === "asesor1@hangar1.com.mx") advisorNumber = "01";
        if (email === "asesor2@hangar1.com.mx") advisorNumber = "02";
      }
      if (!fecha) return;

      const d = new Date(fecha);
      const y = d.getFullYear().toString().slice(-2);
      const m = (d.getMonth() + 1).toString().padStart(2, "0");
      const day = d.getDate().toString().padStart(2, "0");

      let exists = true;
      while (exists) {
        const rnd = Math.floor(Math.random() * 100).toString().padStart(2, "0");
        const num = `${advisorNumber}${y}${m}${day}${rnd}`;
        exists = await orderExists(num);
        if (!exists) setOrderNumber(num);
      }
    }

    async function orderExists(num) {
      const q = query(collection(db, "orders"), where("orderNumber", "==", num));
      const snap = await getDocs(q);
      return !snap.empty;
    }

    generateUniqueOrderNumber();
  }, [fecha]);

  const openModal = () => {
    setIsModalOpen(true);
    document.querySelector(".container-crud")?.classList.add("main-blur");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.querySelector(".container-crud")?.classList.remove("main-blur");
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchClients() {
      const clients = await getAllClients();
      setAllClients(clients);
    }
    fetchClients();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      const results = allClients.filter((c) => {
        const name = c.nombre?.toLowerCase() || "";
        const mail = c.correo?.toLowerCase() || "";
        return name.includes(lower) || mail.includes(lower);
      });
      setFilteredClients(results);
    } else {
      setFilteredClients([]);
    }
  }, [searchTerm, allClients]);

  const handleClientSelect = async (id) => {
    const data = await getClientInformation(id);
    if (data) {
      setClientInfo(data);
      setIsUserAssigned(true);
    }
  };

  const handleClientSaved = async (id) => {
    closeModal();
    const data = await getClientInformation(id);
    if (data) {
      setClientInfo(data);
      setIsUserAssigned(true);
    }
  };

  const handleBrandInputFocus = async () => {
    if (!brands.length) {
      try {
        const data = await getCarBrands();
        setBrands(data);
      } catch (_) {}
    }
    setShowBrandDropdown(true);
  };

  const handleSelectBrand = (id, name) => {
    if (name === "Otro") {
      setIsOtherBrand(true);
      setBrand("");
      setBrandId(null);
      setModels([]);
      setModel("");
      setModelId(null);
      setMotors([]);
      setMotor("");
      setIsOtherModel(false);
      setIsOtherMotor(false);
      setTimeout(() => brandInputRef.current?.focus(), 0);
    } else {
      setIsOtherBrand(false);
      setBrand(name);
      setBrandId(id);
      setModels([]);
      setModel("");
      setModelId(null);
      setMotors([]);
      setMotor("");
      setIsOtherModel(false);
      setIsOtherMotor(false);
    }
    setShowBrandDropdown(false);
  };

  const handleModelInputFocus = async () => {
    if (brandId && !models.length && !isOtherModel) {
      try {
        const data = await getCarModels(brandId);
        setModels(data);
      } catch (_) {}
    }
    if (brandId) setShowModelDropdown(true);
  };

  const handleSelectModel = (id, name) => {
    if (name === "Otro") {
      setIsOtherModel(true);
      setModel("");
      setModelId(null);
      setMotors([]);
      setMotor("");
      setIsOtherMotor(false);
      setTimeout(() => modelInputRef.current?.focus(), 0);
    } else {
      setIsOtherModel(false);
      setModel(name);
      setModelId(id);
      setMotors([]);
      setMotor("");
      setIsOtherMotor(false);
    }
    setShowModelDropdown(false);
  };

  const handleMotorInputFocus = async () => {
    if (modelId && !motors.length && !isOtherMotor) {
      try {
        const data = await getCarTrims(modelId);
        setMotors(data);
      } catch (_) {}
    }
    if (modelId) setShowMotorDropdown(true);
  };

  const handleSelectMotor = (name) => {
    if (name === "Otro") {
      setIsOtherMotor(true);
      setMotor("");
      setTimeout(() => motorInputRef.current?.focus(), 0);
    } else {
      setIsOtherMotor(false);
      setMotor(name);
    }
    setShowMotorDropdown(false);
  };

  const handleClickOutside = (e) => {
    if (
      brandInputRef.current &&
      !brandInputRef.current.contains(e.target) &&
      !e.target.closest(".brand-results")
    ) {
      setShowBrandDropdown(false);
    }
    if (
      modelInputRef.current &&
      !modelInputRef.current.contains(e.target) &&
      !e.target.closest(".model-results")
    ) {
      setShowModelDropdown(false);
    }
    if (
      motorInputRef.current &&
      !motorInputRef.current.contains(e.target) &&
      !e.target.closest(".motor-results")
    ) {
      setShowMotorDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreateOrder = async () => {
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
      firstName: clientInfo.nombre,
      email: clientInfo.correo,
      mobile: clientInfo.telefono,
      orderID: orderNumber,
      orderNumber,
      estado_orden: "Presupuesto",
      paymentMethod: "Deposito",
      inspectionItems: [],
      uploadTime: fecha,
      brand,
      year,
      categoria,
      taller,
      placa_coche: placa,
      kilometros: parseInt(kilometros, 10),
      categoria_h,
      color,
      inCharge,
      model,
      motor,
      vin,
      mechanic_assigment,
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
        {/* Cliente */}
        {isUserAssigned ? (
          <div className="user-asignado">
            <div className="title-new">
              <p>Cliente</p>
              <FontAwesomeIcon icon={faTimes} onClick={() => setIsUserAssigned(false)} />
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
                  {filteredClients.map((c) => (
                    <li key={c.id} onClick={() => handleClientSelect(c.id)}>
                      {c.nombre} - {c.correo}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="button-container">
              <button onClick={openModal} className="nuevo-cliente">
                Nuevo Cliente
              </button>
            </div>
          </div>
        )}

        {/* Vehículo */}
        <div className="car-container-new">
          <div className="title-new">
            <p>Automóvil</p>
          </div>

          {/* Marca / Año */}
          <div className="row-forms">
            <div className="input" ref={brandInputRef}>
              <p>Marca</p>
              <input
                type="text"
                value={brand}
                readOnly={!isOtherBrand}
                placeholder="Selecciona marca o escribe"
                onChange={(e) => setBrand(e.target.value)}
                onFocus={handleBrandInputFocus}
              />
              {showBrandDropdown && (
                <ul className="brand-results">
                  {brands.map((b) => (
                    <li key={b.id_car_make} onClick={() => handleSelectBrand(b.id_car_make, b.name)}>
                      {b.name}
                    </li>
                  ))}
                  <li onClick={() => handleSelectBrand(null, "Otro")}>Otro</li>
                </ul>
              )}
            </div>

            <div className="input">
              <p>Año</p>
              <input type="text" onChange={(e) => setYear(e.target.value)} />
            </div>
          </div>

          {/* Modelo / Motor */}
          <div className="row-forms">
            <div className="input" ref={modelInputRef}>
              <p>Modelo</p>
              <input
                type="text"
                value={model}
                readOnly={!isOtherModel}
                placeholder="Selecciona modelo o escribe"
                onChange={(e) => setModel(e.target.value)}
                onFocus={handleModelInputFocus}
              />
              {showModelDropdown && (
                <ul className="model-results">
                  {models.map((m) => (
                    <li key={m.id_car_model} onClick={() => handleSelectModel(m.id_car_model, m.name)}>
                      {m.name}
                    </li>
                  ))}
                  <li onClick={() => handleSelectModel(null, "Otro")}>Otro</li>
                </ul>
              )}
            </div>

            <div className="input" ref={motorInputRef}>
              <p>Motor</p>
              <input
                type="text"
                value={motor}
                readOnly={!isOtherMotor}
                placeholder="Selecciona motor o escribe"
                onChange={(e) => setMotor(e.target.value)}
                onFocus={handleMotorInputFocus}
              />
              {showMotorDropdown && (
                <ul className="motor-results">
                  {motors.map((t) => (
                    <li key={t.id_car_trim} onClick={() => handleSelectMotor(t.name)}>
                      {t.name}
                    </li>
                  ))}
                  <li onClick={() => handleSelectMotor("Otro")}>Otro</li>
                </ul>
              )}
            </div>
          </div>

          {/* Categoría / Color */}
          <div className="row-forms">
            <div className="input">
              <p>Categoría de Coche</p>
              <select onChange={(e) => setCategoria(e.target.value)}>
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
            <div className="input">
              <p>Color</p>
              <input type="text" onChange={(e) => setColor(e.target.value)} />
            </div>
          </div>

          {/* Placa / VIN */}
          <div className="row-forms">
            <div className="input">
              <p>Placa</p>
              <input type="text" onChange={(e) => setPlaca(e.target.value)} />
            </div>
            <div className="input">
              <p>VIN</p>
              <input type="text" onChange={(e) => setVin(e.target.value)} />
            </div>
          </div>

          {/* Kilometraje / Servicio */}
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
              <select onChange={(e) => setCategoriaH(e.target.value)}>
                <option value="">Selecciona un tipo de servicio</option>
                <option value="SpeedCenter">SpeedCenter</option>
                <option value="PrimeService">PrimeService</option>
              </select>
            </div>
          </div>

          {/* Hangar */}
          <div className="title-new">
            <p>Hangar</p>
          </div>

          {/* Taller / Asesor */}
          <div className="row-forms">
            <div className="input">
              <p>Taller Asignado</p>
              <select onChange={(e) => setTaller(e.target.value)}>
                <option value="">Selecciona Taller</option>
                <option value="H1">H1</option>
                <option value="H2">H2</option>
                <option value="H3">H3</option>
              </select>
            </div>
            <div className="input">
              <p>Asesor Asignado</p>
              <select onChange={(e) => setInCharge(e.target.value)}>
                <option value="">Selecciona Asesor</option>
                <option value="Cristian Abarca">Cristian Abarca</option>
                <option value="Jorge Sanchez">Jorge Sanchez</option>
              </select>
            </div>
          </div>

          {/* Mecánico / Fecha */}
          <div className="row-forms">
            <div className="input">
              <p>Mecánico Asignado</p>
              <select
                onChange={(e) => setMechanicAssigment(e.target.value)}
                value={mechanic_assigment}
              >
                <option value="">Selecciona Mecánico</option>
                {inCharge === "Cristian Abarca" && (
                  <>
                    <option value="Alvaro German">Alvaro German</option>
                    <option value="carlos Cruz">Carlos Cruz</option>
                    <option value="Alejandro Barragan">Alejandro Barragan</option>
                  </>
                )}
                {inCharge === "Jorge Sanchez" && (
                  <>
                    <option value="Luiyi Ariel Cartela Flores">Luiyi Ariel Cartela Flores</option>
                    <option value="Erick Roberto Rangel Lozada">Erick Roberto Rangel Lozada</option>
                  </>
                )}
              </select>
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
            <button className="new-order" onClick={handleCreateOrder}>
              Crear Order
            </button>
          </div>
        </div>
      </div>

      <ModalClient isOpen={isModalOpen} onClose={closeModal} onClientSaved={handleClientSaved} />
    </div>
  );
}
