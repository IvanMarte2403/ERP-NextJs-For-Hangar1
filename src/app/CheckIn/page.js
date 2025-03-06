"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase"; // Ajusta la ruta si es necesario
import NavBar from "../../components/NavBar";

export default function CheckIn() {
  // 1) Obtener el orderId desde la URL
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  // 2) Estado para almacenar la orden obtenida de Firebase
  const [orderData, setOrderData] = useState(null);

  // 3) useEffect para obtener la orden desde Firestore
  useEffect(() => {
    const fetchOrderData = async () => {
      if (orderId) {
        try {
          const docRef = doc(db, "orders", orderId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setOrderData(docSnap.data());
          } else {
            console.log("No existe el documento con ese orderId en orders");
          }
        } catch (error) {
          console.error("Error al obtener la orden:", error);
        }
      }
    };

    fetchOrderData();
  }, [orderId]);

  // ----------------------------
  // ESTADOS PARA CAPTURAR DATOS
  // ----------------------------

  // Revisión Interna
  const [revisionInterna, setRevisionInterna] = useState({
    llantas_refaccion: false,
    tapones_rueda: false,
    tuercas_seguridad: false,
    gato: false,
    llave_ruedas: false,
    extintor: false,
    reflejantes: false,
    notas: "",
  });

  // Problemas del Vehículo (array). Podemos agregar varios problemas.
  const [problemasVehiculo, setProblemasVehiculo] = useState([]);
  // Para capturar el problema que se quiere añadir
  const [newProblema, setNewProblema] = useState({ nota: "", descripcion: "" });

  // Recomendaciones (con todos los checkboxes mencionados)
  const [recomendaciones, setRecomendaciones] = useState({
    fascia: {
      delantera: false,
      trasera: false,
    },
    rines: {
      delantero_d: false,
      delantero_i: false,
      trasero_d: false,
      trasero_i: false,
    },
    piezas_extras: "",
    // Ejemplo de "Revisión de Servicio"
    revision_servicio: {
      bujias: { bueno: false, malo: false },
      filtro_aire: { bueno: false, malo: false },
      lubricante: { bueno: false, malo: false },
      refrigerante: { bueno: false, malo: false },
    },
    // Columna 2
    plumas_limpiaparabrisas: { bueno: false, malo: false },
    bandas: "",
    mangueras: "",
    frenos: {
      balatas: { bueno: false, malo: false },
      delanteras: { bueno: false, malo: false },
    },
    discos: {
      delanteras: { bueno: false, malo: false },
      traseros: { bueno: false, malo: false },
    },
    liquido_frenos: { bueno: false, malo: false },

    // Columna 3
    amortiguadores: {
      delanteros: { bueno: false, malo: false },
      traseros: { bueno: false, malo: false },
    },
    suspension_direccion: "",
    neumaticos: {
      delantero_d_bueno: false,
      delantero_i_bueno: false,
      trasero_d_bueno: false,
      trasero_i_bueno: false,
      delantero_d_malo: false,
      delantero_i_malo: false,
      trasero_d_malo: false,
      trasero_i_malo: false,
    },
    quimicos: {
      delanteras: false,
      traseros: false,
    },

    // Columna 4
    antifriccionante_muscle: false,
    antifriccionante_motor_liqui: false,
    descarbonizante1: false,
    descarbonizante2: false,
    tratamiento_refrigerante: false,

    // Fábrica
    struct_bar: false,
    kit_alto_flujo: false,
    discos_hiperventilados: false,
    manguera_inox: false,
    pintura_calipers: false,
  });

  // ----------------------------
  // FUNCIONES PARA MANEJAR DATOS
  // ----------------------------

  // Handler para checkboxes de Revisión Interna
  const handleRevisionChange = (field) => {
    setRevisionInterna((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Handler para el input de "notas" en Revisión Interna
  const handleRevisionNotas = (value) => {
    setRevisionInterna((prev) => ({
      ...prev,
      notas: value,
    }));
  };

  // Agregar un problema al array de problemas
  const handleAddProblema = () => {
    if (newProblema.nota.trim() === "" && newProblema.descripcion.trim() === "") {
      alert("Completa el problema y la descripción, por favor");
      return;
    }
    setProblemasVehiculo((prev) => [...prev, newProblema]);
    setNewProblema({ nota: "", descripcion: "" });
  };

  // Manejo de inputs para el "nuevo problema"
  const handleNewProblemaChange = (field, value) => {
    setNewProblema((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Eliminar un problema del array (opcional)
  const handleDeleteProblema = (index) => {
    setProblemasVehiculo((prev) => prev.filter((_, i) => i !== index));
  };

  // Handler genérico para checkboxes en Recomendaciones (que sean boolean)
  const handleRecomendacionCheckbox = (pathArray) => {
    // pathArray será algo como ['fascia', 'delantera']
    setRecomendaciones((prev) => {
      // Clonamos el objeto para no mutarlo directamente
      const clone = structuredClone(prev);

      // Navegamos según el path
      let current = clone;
      for (let i = 0; i < pathArray.length - 1; i++) {
        current = current[pathArray[i]];
      }
      const lastKey = pathArray[pathArray.length - 1];
      current[lastKey] = !current[lastKey];

      return clone;
    });
  };

  // Handler para textos en Recomendaciones
  const handleRecomendacionText = (key, value) => {
    // key: 'piezas_extras', 'bandas', 'mangueras', 'suspension_direccion', ...
    setRecomendaciones((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handler para un "subnivel" textual, si fuese necesario
  // (Aquí no es imprescindible, pero se muestra la idea)

  // ----------------------------
  // GUARDAR EN FIREBASE
  // ----------------------------
  const handleSaveCheckIn = async () => {
    if (!orderId) {
      alert("No existe un orderId para guardar.");
      return;
    }

    try {
      const docRef = doc(db, "orders", orderId);

      // Estructura final para "check_in"
      const checkInData = {
        revision_interna: revisionInterna,
        problemas_vehiculo: problemasVehiculo,
        recomendaciones: recomendaciones,
      };

      await updateDoc(docRef, {
        check_in: checkInData,
      });

      alert("Check-in guardado correctamente");
    } catch (error) {
      console.error("Error guardando check_in en Firebase:", error);
      alert("Error al guardar el Check-in");
    }
  };

  // ----------------------------
  // RENDER
  // ----------------------------
  return (
    <main className="container-home">
      {/* Nav Bar */}
      <div className="nav-bar-home">
        <div className="container-image">
          <img src="img/logo-hangar-1.png" alt="Logo" />
        </div>
        <NavBar />
      </div>

      {/* Check-in Title */}
      <div className="container-check-title">
        <div className="info-orden">
          {/* 1) Muestra el orderId */}
          <h1>Detalles de la orden / {orderId || "N/A"}</h1>

          {/* 2) Muestra la fecha 'uploadTime' formateada */}
          <p>
            {orderData?.uploadTime
              ? new Date(orderData.uploadTime).toLocaleDateString("es-MX")
              : "Fecha no disponible"}
          </p>
        </div>

        {/* Revisión */}
        <div className="container-revision">
          {/* Nav Revision */}
          <div className="nav-revision">
            {/* Presupuesto */}
            <div className="block-revision">
              <p>Presupuesto</p>
            </div>

            {/* Check In */}
            <div className="block-revision check-in">
              <p>CheckIn</p>
            </div>
          </div>

          {/* Revision Interna Accesorios */}
          <div className="container-revision-forms">
            {/* Title */}
            <div className="title">
              <h3>Revisión Interna Accesorios</h3>
              <h3>Asesor Responsable: {orderData?.inCharge || "N/A"}</h3>
            </div>

            {/* Forms Check */}
            <div className="forms-check">
              <label>
                <input
                  type="checkbox"
                  checked={revisionInterna.llantas_refaccion}
                  onChange={() => handleRevisionChange("llantas_refaccion")}
                />
                Llantas Refacción
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={revisionInterna.tapones_rueda}
                  onChange={() => handleRevisionChange("tapones_rueda")}
                />
                Tapones de Rueda
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={revisionInterna.tuercas_seguridad}
                  onChange={() => handleRevisionChange("tuercas_seguridad")}
                />
                Tuercas de Seguridad
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={revisionInterna.gato}
                  onChange={() => handleRevisionChange("gato")}
                />
                Gato
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={revisionInterna.llave_ruedas}
                  onChange={() => handleRevisionChange("llave_ruedas")}
                />
                Llave de Ruedas
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={revisionInterna.extintor}
                  onChange={() => handleRevisionChange("extintor")}
                />
                Extintor
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={revisionInterna.reflejantes}
                  onChange={() => handleRevisionChange("reflejantes")}
                />
                Reflejantes
              </label>
            </div>
            {/* Input */}
            <div className="container-input-text">
              <p>Declarar si hay algo de valor</p>
              <input
                type="text"
                value={revisionInterna.notas}
                onChange={(e) => handleRevisionNotas(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Problemas de Vehiculo */}
        <div className="container-problemas-vehiculo">
          {/* Title */}
          <div className="title">
            <h3>Problemas de vehiculo</h3>
          </div>

          {/* Add Problemas */}
          <div className="forms-problemas">
            {/* Problema */}
            <div className="box-forms">
              <p>Problema</p>
              <input
                type="text"
                value={newProblema.nota}
                onChange={(e) => handleNewProblemaChange("nota", e.target.value)}
              />
            </div>
            {/* Descripcion */}
            <div className="box-forms">
              <p>Agregar</p>
              <input
                type="text"
                value={newProblema.descripcion}
                onChange={(e) =>
                  handleNewProblemaChange("descripcion", e.target.value)
                }
              />
            </div>
            {/* Botón Agregar */}
            <div className="box-bottons">
              <button onClick={handleAddProblema}>Agregar</button>
            </div>
          </div>

          {/* Listado de Problemas (opcional, para ver qué se capturó) */}
          {problemasVehiculo.length > 0 && (
            <div className="listado-problemas">
              <h4>Problemas Agregados</h4>
              <ul>
                {problemasVehiculo.map((prob, idx) => (
                  <li key={idx}>
                    <strong>Problema:</strong> {prob.nota}{" "}
                    <strong>Descripción:</strong> {prob.descripcion}{" "}
                    <button onClick={() => handleDeleteProblema(idx)}>
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Recomendaciones */}
        <div className="container-recomendaciones">
          <div className="container-title">
            <h4>Recomendaciones</h4>
          </div>

          {/* Container Columnas */}
          <div className="container-columnas">
            {/* Columna 1 */}
            <div className="container-column-recomendacion">
              {/* Fascia */}
              <div className="box-recomendacion">
                <div className="titles-recomendacion">
                  <h4>Fascia</h4>
                  <p>Delantera</p>
                  <p>Trasera</p>
                </div>
                {/* Inputs Recomendación */}
                <div className="inputs-recomendacion">
                  <div className="row-izq">
                    <p>B</p>
                    <input
                      type="checkbox"
                      checked={recomendaciones.fascia.delantera}
                      onChange={() =>
                        handleRecomendacionCheckbox(["fascia", "delantera"])
                      }
                    />
                    <input
                      type="checkbox"
                      checked={recomendaciones.fascia.trasera}
                      onChange={() =>
                        handleRecomendacionCheckbox(["fascia", "trasera"])
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Rines */}
              <div className="box-recomendacion">
                <div className="titles-recomendacion">
                  <h4>Rines</h4>
                  <p>Delantero-(D)</p>
                  <p>Delantero-(I)</p>
                  <p>Trasero-(D)</p>
                  <p>Trasero-(I)</p>
                </div>
                <div className="inputs-recomendacion">
                  <div className="row-izq">
                    <p>B</p>
                    <input
                      type="checkbox"
                      checked={recomendaciones.rines.delantero_d}
                      onChange={() =>
                        handleRecomendacionCheckbox(["rines", "delantero_d"])
                      }
                    />
                    <input
                      type="checkbox"
                      checked={recomendaciones.rines.delantero_i}
                      onChange={() =>
                        handleRecomendacionCheckbox(["rines", "delantero_i"])
                      }
                    />
                    <input
                      type="checkbox"
                      checked={recomendaciones.rines.trasero_d}
                      onChange={() =>
                        handleRecomendacionCheckbox(["rines", "trasero_d"])
                      }
                    />
                    <input
                      type="checkbox"
                      checked={recomendaciones.rines.trasero_i}
                      onChange={() =>
                        handleRecomendacionCheckbox(["rines", "trasero_i"])
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Piezas Extras - Texto */}
              <div className="box-recomendacion box-texto">
                <h4>Piezas Extras</h4>
                <input
                  type="text"
                  value={recomendaciones.piezas_extras}
                  onChange={(e) =>
                    handleRecomendacionText("piezas_extras", e.target.value)
                  }
                />
              </div>

              {/* Revisión de Servicio */}
              <div className="box-recomendacion">
                <div className="titles-recomendacion">
                  <h4>Revisión de Servicio</h4>
                  <p>Bujias</p>
                  <p>Filtros de Aire</p>
                  <p>Lubricante/Aceite</p>
                  <p>Refrigerante/Anticongelante</p>
                </div>
                <div className="inputs-recomendacion">
                  <div className="row-izq">
                    <p>B</p>
                    {/* Bujias */}
                    <input
                      type="checkbox"
                      checked={recomendaciones.revision_servicio.bujias.bueno}
                      onChange={() =>
                        handleRecomendacionCheckbox([
                          "revision_servicio",
                          "bujias",
                          "bueno",
                        ])
                      }
                    />
                    {/* Filtro de aire */}
                    <input
                      type="checkbox"
                      checked={recomendaciones.revision_servicio.filtro_aire.bueno}
                      onChange={() =>
                        handleRecomendacionCheckbox([
                          "revision_servicio",
                          "filtro_aire",
                          "bueno",
                        ])
                      }
                    />
                    {/* Lubricante */}
                    <input
                      type="checkbox"
                      checked={recomendaciones.revision_servicio.lubricante.bueno}
                      onChange={() =>
                        handleRecomendacionCheckbox([
                          "revision_servicio",
                          "lubricante",
                          "bueno",
                        ])
                      }
                    />
                    {/* Refrigerante */}
                    <input
                      type="checkbox"
                      checked={recomendaciones.revision_servicio.refrigerante.bueno}
                      onChange={() =>
                        handleRecomendacionCheckbox([
                          "revision_servicio",
                          "refrigerante",
                          "bueno",
                        ])
                      }
                    />
                  </div>

                  <div className="row-der">
                    <p>M</p>
                    {/* Bujias */}
                    <input
                      type="checkbox"
                      checked={recomendaciones.revision_servicio.bujias.malo}
                      onChange={() =>
                        handleRecomendacionCheckbox([
                          "revision_servicio",
                          "bujias",
                          "malo",
                        ])
                      }
                    />
                    {/* Filtro de aire */}
                    <input
                      type="checkbox"
                      checked={recomendaciones.revision_servicio.filtro_aire.malo}
                      onChange={() =>
                        handleRecomendacionCheckbox([
                          "revision_servicio",
                          "filtro_aire",
                          "malo",
                        ])
                      }
                    />
                    {/* Lubricante */}
                    <input
                      type="checkbox"
                      checked={recomendaciones.revision_servicio.lubricante.malo}
                      onChange={() =>
                        handleRecomendacionCheckbox([
                          "revision_servicio",
                          "lubricante",
                          "malo",
                        ])
                      }
                    />
                    {/* Refrigerante */}
                    <input
                      type="checkbox"
                      checked={recomendaciones.revision_servicio.refrigerante.malo}
                      onChange={() =>
                        handleRecomendacionCheckbox([
                          "revision_servicio",
                          "refrigerante",
                          "malo",
                        ])
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Columna 2 */}
            <div className="container-column-recomendacion">
              {/* Plumas Limpiaparabrisas */}
              <div className="box-recomendacion">
                <div className="titles-recomendacion">
                  <h4>Plumas Limpiaparabrisas</h4>
                  <p>Plumas Limpiaparabrisas</p>
                </div>
                <div className="inputs-recomendacion">
                  <div className="row-izq">
                    <p>B</p>
                    <input
                      type="checkbox"
                      checked={recomendaciones.plumas_limpiaparabrisas.bueno}
                      onChange={() =>
                        handleRecomendacionCheckbox([
                          "plumas_limpiaparabrisas",
                          "bueno",
                        ])
                      }
                    />
                  </div>

                  <div className="row-der">
                    <p>M</p>
                    <input
                      type="checkbox"
                      checked={recomendaciones.plumas_limpiaparabrisas.malo}
                      onChange={() =>
                        handleRecomendacionCheckbox([
                          "plumas_limpiaparabrisas",
                          "malo",
                        ])
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Bandas */}
              <div className="box-recomendacion box-texto">
                <h4>Bandas</h4>
                <input
                  type="text"
                  value={recomendaciones.bandas}
                  onChange={(e) =>
                    handleRecomendacionText("bandas", e.target.value)
                  }
                />
              </div>

              {/* Mangueras */}
              <div className="box-recomendacion box-texto">
                <h4>Mangueras</h4>
                <input
                  type="text"
                  value={recomendaciones.mangueras}
                  onChange={(e) =>
                    handleRecomendacionText("mangueras", e.target.value)
                  }
                />
              </div>

              {/* Frenos */}
              <div className="box-recomendacion">
                <div className="titles-recomendacion">
                  <h4>Frenos</h4>
                  <p>Balatas</p>
                  <p>Delanteras</p>
                </div>
                <div className="inputs-recomendacion">
                  <div className="row-izq">
                    <p>B</p>
                    <input
                      type="checkbox"
                      checked={recomendaciones.frenos.balatas.bueno}
                      onChange={() =>
                        handleRecomendacionCheckbox([
                          "frenos",
                          "balatas",
                          "bueno",
                        ])
                      }
                    />
                    <input
                      type="checkbox"
                      checked={recomendaciones.frenos.delanteras.bueno}
                      onChange={() =>
                        handleRecomendacionCheckbox([
                          "frenos",
                          "delanteras",
                          "bueno",
                        ])
                      }
                    />
                  </div>

                  <div className="row-der">
                    <p>M</p>
                    <input
                      type="checkbox"
                      checked={recomendaciones.frenos.balatas.malo}
                      onChange={() =>
                        handleRecomendacionCheckbox([
                          "frenos",
                          "balatas",
                          "malo",
                        ])
                      }
                    />
                    <input
                      type="checkbox"
                      checked={recomendaciones.frenos.delanteras.malo}
                      onChange={() =>
                        handleRecomendacionCheckbox([
                          "frenos",
                          "delanteras",
                          "malo",
                        ])
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Discos */}
              <div className="box-recomendacion">
                <div className="titles-recomendacion">
                  <h4>Discos</h4>
                  <p>Delanteras</p>
                  <p>Traseros</p>
                </div>
                <div className="inputs-recomendacion">
                  <div className="row-izq">
                    <p>B</p>
                    <input
                      type="checkbox"
                      checked={recomendaciones.discos.delanteras.bueno}
                      onChange={() =>
                        handleRecomendacionCheckbox([
                          "discos",
                          "delanteras",
                          "bueno",
                        ])
                      }
                    />
                    <input
                      type="checkbox"
                      checked={recomendaciones.discos.traseros.bueno}
                      onChange={() =>
                        handleRecomendacionCheckbox([
                          "discos",
                          "traseros",
                          "bueno",
                        ])
                      }
                    />
                  </div>

                  <div className="row-der">
                    <p>M</p>
                    <input
                      type="checkbox"
                      checked={recomendaciones.discos.delanteras.malo}
                      onChange={() =>
                        handleRecomendacionCheckbox([
                          "discos",
                          "delanteras",
                          "malo",
                        ])
                      }
                    />
                    <input
                      type="checkbox"
                      checked={recomendaciones.discos.traseros.malo}
                      onChange={() =>
                        handleRecomendacionCheckbox([
                          "discos",
                          "traseros",
                          "malo",
                        ])
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Líquido de Frenos */}
              <div className="box-recomendacion">
                <div className="titles-recomendacion">
                  <h4>Líquido de Frenos</h4>
                </div>
                <div className="inputs-recomendacion">
                  <div className="row-izq">
                    <p>B</p>
                    <input
                      type="checkbox"
                      checked={recomendaciones.liquido_frenos.bueno}
                      onChange={() =>
                        handleRecomendacionCheckbox([
                          "liquido_frenos",
                          "bueno",
                        ])
                      }
                    />
                  </div>

                  <div className="row-der">
                    <p>M</p>
                    <input
                      type="checkbox"
                      checked={recomendaciones.liquido_frenos.malo}
                      onChange={() =>
                        handleRecomendacionCheckbox(["liquido_frenos", "malo"])
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Columna 3 */}
            <div className="container-column-recomendacion">
              {/* Amortiguadores */}
              <div className="box-recomendacion">
                <div className="titles-recomendacion">
                  <h4>Amortiguadores</h4>
                  <p>Delanteros</p>
                  <p>Traseros</p>
                </div>
                <div className="inputs-recomendacion">
                  <div className="row-izq">
                    <p>B</p>
                    <input
                      type="checkbox"
                      checked={recomendaciones.amortiguadores.delanteros.bueno}
                      onChange={() =>
                        handleRecomendacionCheckbox([
                          "amortiguadores",
                          "delanteros",
                          "bueno",
                        ])
                      }
                    />
                    <input
                      type="checkbox"
                      checked={recomendaciones.amortiguadores.traseros.bueno}
                      onChange={() =>
                        handleRecomendacionCheckbox([
                          "amortiguadores",
                          "traseros",
                          "bueno",
                        ])
                      }
                    />
                  </div>

                  <div className="row-der">
                    <p>M</p>
                    <input
                      type="checkbox"
                      checked={recomendaciones.amortiguadores.delanteros.malo}
                      onChange={() =>
                        handleRecomendacionCheckbox([
                          "amortiguadores",
                          "delanteros",
                          "malo",
                        ])
                      }
                    />
                    <input
                      type="checkbox"
                      checked={recomendaciones.amortiguadores.traseros.malo}
                      onChange={() =>
                        handleRecomendacionCheckbox([
                          "amortiguadores",
                          "traseros",
                          "malo",
                        ])
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Partes de la suspensión y dirección */}
              <div className="box-recomendacion box-texto">
                <h4>Partes de la suspensión y dirección</h4>
                <input
                  type="text"
                  value={recomendaciones.suspension_direccion}
                  onChange={(e) =>
                    handleRecomendacionText("suspension_direccion", e.target.value)
                  }
                />
              </div>

              {/* Neumáticos */}
              <div className="box-recomendacion">
                <div className="titles-recomendacion">
                  <h4>Neumáticos</h4>
                  <p>Delantero-(D)</p>
                  <p>Delantero-(I)</p>
                  <p>Trasero-(D)</p>
                  <p>Trasero-(I)</p>
                </div>
                <div className="inputs-recomendacion">
                  <div className="row-izq">
                    <p>B</p>
                    <input
                      type="checkbox"
                      checked={recomendaciones.neumaticos.delantero_d_bueno}
                      onChange={() =>
                        handleRecomendacionCheckbox([
                          "neumaticos",
                          "delantero_d_bueno",
                        ])
                      }
                    />
                    <input
                      type="checkbox"
                      checked={recomendaciones.neumaticos.delantero_i_bueno}
                      onChange={() =>
                        handleRecomendacionCheckbox([
                          "neumaticos",
                          "delantero_i_bueno",
                        ])
                      }
                    />
                    <input
                      type="checkbox"
                      checked={recomendaciones.neumaticos.trasero_d_bueno}
                      onChange={() =>
                        handleRecomendacionCheckbox([
                          "neumaticos",
                          "trasero_d_bueno",
                        ])
                      }
                    />
                    <input
                      type="checkbox"
                      checked={recomendaciones.neumaticos.trasero_i_bueno}
                      onChange={() =>
                        handleRecomendacionCheckbox([
                          "neumaticos",
                          "trasero_i_bueno",
                        ])
                      }
                    />
                  </div>

                  <div className="row-der">
                    <p>M</p>
                    <input
                      type="checkbox"
                      checked={recomendaciones.neumaticos.delantero_d_malo}
                      onChange={() =>
                        handleRecomendacionCheckbox([
                          "neumaticos",
                          "delantero_d_malo",
                        ])
                      }
                    />
                    <input
                      type="checkbox"
                      checked={recomendaciones.neumaticos.delantero_i_malo}
                      onChange={() =>
                        handleRecomendacionCheckbox([
                          "neumaticos",
                          "delantero_i_malo",
                        ])
                      }
                    />
                    <input
                      type="checkbox"
                      checked={recomendaciones.neumaticos.trasero_d_malo}
                      onChange={() =>
                        handleRecomendacionCheckbox([
                          "neumaticos",
                          "trasero_d_malo",
                        ])
                      }
                    />
                    <input
                      type="checkbox"
                      checked={recomendaciones.neumaticos.trasero_i_malo}
                      onChange={() =>
                        handleRecomendacionCheckbox([
                          "neumaticos",
                          "trasero_i_malo",
                        ])
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Químicos */}
              <div className="box-recomendacion">
                <div className="titles-recomendacion">
                  <h4>Químicos</h4>
                  <p>Delanteras</p>
                  <p>Traseros</p>
                </div>
                <div className="inputs-recomendacion">
                  <div className="row-izq">
                    <p>B</p>
                    <input
                      type="checkbox"
                      checked={recomendaciones.quimicos.delanteras}
                      onChange={() =>
                        handleRecomendacionCheckbox(["quimicos", "delanteras"])
                      }
                    />
                    <input
                      type="checkbox"
                      checked={recomendaciones.quimicos.traseros}
                      onChange={() =>
                        handleRecomendacionCheckbox(["quimicos", "traseros"])
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Columna 4 */}
            <div className="container-column-recomendacion">
              {/* Antifriccionante Muscle */}
              <div className="row-recomendacion">
                <p>Antifriccionante Muscle</p>
                <input
                  type="checkbox"
                  checked={recomendaciones.antifriccionante_muscle}
                  onChange={() =>
                    handleRecomendacionCheckbox(["antifriccionante_muscle"])
                  }
                />
              </div>

              {/* Antifriccionante Motor Protect Liqui Moly */}
              <div className="row-recomendacion">
                <p>Antifriccionante Motor Protect Liqui Moly</p>
                <input
                  type="checkbox"
                  checked={recomendaciones.antifriccionante_motor_liqui}
                  onChange={() =>
                    handleRecomendacionCheckbox(["antifriccionante_motor_liqui"])
                  }
                />
              </div>

              {/* Descarbonizante (1) */}
              <div className="row-recomendacion">
                <p>Descarbonizante de Motor Rocketfuel</p>
                <input
                  type="checkbox"
                  checked={recomendaciones.descarbonizante1}
                  onChange={() =>
                    handleRecomendacionCheckbox(["descarbonizante1"])
                  }
                />
              </div>

              {/* Descarbonizante (2) */}
              <div className="row-recomendacion">
                <p>Descarbonizante de Motor Rocketfuel</p>
                <input
                  type="checkbox"
                  checked={recomendaciones.descarbonizante2}
                  onChange={() =>
                    handleRecomendacionCheckbox(["descarbonizante2"])
                  }
                />
              </div>

              {/* Tratamiento Refrigerante */}
              <div className="row-recomendacion">
                <p>Tratamiento Refrigerante Water weller red line</p>
                <input
                  type="checkbox"
                  checked={recomendaciones.tratamiento_refrigerante}
                  onChange={() =>
                    handleRecomendacionCheckbox(["tratamiento_refrigerante"])
                  }
                />
              </div>

              {/* Title Fábrica */}
              <div className="row-recomendacion">
                <h4>Fábrica</h4>
              </div>

              {/* Struct Bar */}
              <div className="row-recomendacion">
                <p>Struct Bar</p>
                <input
                  type="checkbox"
                  checked={recomendaciones.struct_bar}
                  onChange={() => handleRecomendacionCheckbox(["struct_bar"])}
                />
              </div>

              {/* Kit de filtro de alto flujo H1 */}
              <div className="row-recomendacion">
                <p>Kit de filtro de alto flujo H1</p>
                <input
                  type="checkbox"
                  checked={recomendaciones.kit_alto_flujo}
                  onChange={() => handleRecomendacionCheckbox(["kit_alto_flujo"])}
                />
              </div>

              {/* Discos Hiperventilados */}
              <div className="row-recomendacion">
                <p>Discos Hiperventilados</p>
                <input
                  type="checkbox"
                  checked={recomendaciones.discos_hiperventilados}
                  onChange={() =>
                    handleRecomendacionCheckbox(["discos_hiperventilados"])
                  }
                />
              </div>

              {/* Manguera Inox */}
              <div className="row-recomendacion">
                <p>Manguera Inox</p>
                <input
                  type="checkbox"
                  checked={recomendaciones.manguera_inox}
                  onChange={() => handleRecomendacionCheckbox(["manguera_inox"])}
                />
              </div>

              {/* Pintura de Calipers */}
              <div className="row-recomendacion">
                <p>Pintura de Calipers</p>
                <input
                  type="checkbox"
                  checked={recomendaciones.pintura_calipers}
                  onChange={() =>
                    handleRecomendacionCheckbox(["pintura_calipers"])
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Evidencias Gráficas */}
        <div className="container-evidencias-graficas">
          <h3>Evidencias Gráficas</h3>
          <div className="container-icono-camara">
            <img src="icons/check-in/camera.svg" alt="" />
          </div>
        </div>

        {/* Container Buttons */}
        <div className="container-buttons">
          <button onClick={handleSaveCheckIn}>Guardar Check-in</button>
        </div>
      </div>
    </main>
  );
}
