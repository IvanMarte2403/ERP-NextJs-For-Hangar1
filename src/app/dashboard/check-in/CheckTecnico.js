"use client";

import React, { useState, useEffect, useRef } from "react";
import { getAllServices } from "../../../../services/CheckTecnico/getAllServices";
import { updateCheckTecnico } from "../../../../services/CheckTecnico/updateCheckTecnico";
import { getCheckTecnicoEntries } from "../../../../services/CheckTecnico/getCheckTecnicoEntries";

export default function CheckTecnico({ orderId }) {
  /* ─── Servicios para el buscador ─── */
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  /* ─── Control del buscador de “Problema” ─── */
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedService, setSelectedService] = useState({
    service_id: "",
    name: "",
  });
  const dropdownRef = useRef(null);

  /* ─── Otros campos ─── */
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");

  /* ─── Diagnósticos existentes ─── */
  const [entries, setEntries] = useState([]);
  const [loadingEntries, setLoadingEntries] = useState(true);

  /* ────────────────────────────────────────────────────────── */
  /* Cargar catálogo de servicios al montar                     */
  /* ────────────────────────────────────────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const data = await getAllServices();
        setServices(data.services || []);
      } catch (err) {
        console.error("Error al cargar servicios:", err);
      } finally {
        setLoadingServices(false);
      }
    })();
  }, []);

  /* ────────────────────────────────────────────────────────── */
  /* Cargar diagnósticos existentes                             */
  /* ────────────────────────────────────────────────────────── */
  const fetchEntries = async () => {
    try {
      setLoadingEntries(true);
      const data = await getCheckTecnicoEntries(orderId);
      setEntries(data.entries || []);
    } catch (err) {
      console.error("Error al obtener diagnósticos:", err);
    } finally {
      setLoadingEntries(false);
    }
  };

  useEffect(() => {
    fetchEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  /* ─── Auxiliar ─── */
  const statusLabel = (s) => {
    if (s === "1" || s === 1) return "Verde";
    if (s === "2" || s === 2) return "Amarillo";
    if (s === "3" || s === 3) return "Rojo";
    return s;
  };

  /* ─── Handlers ─── */
  const onSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  const onOptionSelect = (svc) => {
    setSelectedService(svc);
    setSearchTerm(svc.name);
    setShowDropdown(false);
  };

  const handleSemaforoClick = (value) => setStatus(value);

  const handleAgregar = async () => {
    if (!selectedService.service_id || !status || !description) {
      setResponseMessage("Completa todos los campos antes de agregar.");
      return;
    }

    try {
      const res = await updateCheckTecnico({
        orderId,
        id_service: selectedService.service_id,
        status,
        descripcion: description,
      });

      if (res?.entry) {
        setResponseMessage("Diagnóstico agregado correctamente.");
        /* Limpiar formulario */
        setSelectedService({ service_id: "", name: "" });
        setSearchTerm("");
        setStatus(null);
        setDescription("");

        /* ─── volver a consultar para refrescar tabla ─── */
        await fetchEntries();
      } else {
        setResponseMessage("Error al guardar diagnóstico.");
      }
    } catch (err) {
      console.error("Error al enviar diagnóstico:", err);
      setResponseMessage(err.message || "Error en la comunicación con el servidor.");
    }
  };

  /* ─── UI ─── */
  return (
    <div className="check-tecnico-container">
      <h2>Check-Tecnico&nbsp;– Orden #{orderId}</h2>

      {/* ───────────────────────────────────────── */}
      {/* Formulario de alta                        */}
      {/* ───────────────────────────────────────── */}
      <div className="container-diagnostico-vehicular">
        <div className="title">
          <h3>Diagnóstico Vehicular</h3>
        </div>

        <div className="row-input-problem" ref={dropdownRef}>
          {/* Buscador de Problema */}
          <div className="input">
            <p>Problema</p>
            {loadingServices ? (
              <p>Cargando opciones…</p>
            ) : (
              <>
                <input
                  type="text"
                  autoComplete="off"
                  value={searchTerm}
                  onChange={onSearchChange}
                  onFocus={() => setShowDropdown(true)}
                />
                {showDropdown && (
                  <ul className="dropdown-list">
                    {services
                      .filter((svc) =>
                        svc.name.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((svc) => (
                        <li
                          key={svc.service_id}
                          onClick={() => onOptionSelect(svc)}
                        >
                          {svc.name}
                        </li>
                      ))}
                    {services.length === 0 && (
                      <li className="no-results">No se encontraron servicios</li>
                    )}
                  </ul>
                )}
              </>
            )}
          </div>

          {/* Semáforo */}
          <div className="input">
            <p>Diagnóstico</p>
            <div className="container-semaforo">
              <img
                src="check_tecnico/semaforo/green.svg"
                alt="Verde"
                onClick={() => handleSemaforoClick(1)}
                style={{
                  opacity: status === 1 ? 1 : 0.4,
                  cursor: "pointer",
                }}
              />
              <img
                src="check_tecnico/semaforo/yellow.svg"
                alt="Amarillo"
                onClick={() => handleSemaforoClick(2)}
                style={{
                  opacity: status === 2 ? 1 : 0.4,
                  cursor: "pointer",
                }}
              />
              <img
                src="check_tecnico/semaforo/red.svg"
                alt="Rojo"
                onClick={() => handleSemaforoClick(3)}
                style={{
                  opacity: status === 3 ? 1 : 0.4,
                  cursor: "pointer",
                }}
              />
            </div>
          </div>

          {/* Descripción */}
          <div className="input">
            <p>Descripción</p>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Botón Agregar */}
          <div className="buttons">
            <button onClick={handleAgregar}>Agregar</button>
          </div>
        </div>

        {responseMessage && (
          <p className="response-message">{responseMessage}</p>
        )}
      </div>

      {/* ───────────────────────────────────────── */}
      {/* Tabla de diagnósticos existentes          */}
      {/* ───────────────────────────────────────── */}
      <div className="tabla-diagnosticos">
        <h3>Diagnósticos detectados</h3>
        {loadingEntries ? (
          <p>Cargando diagnósticos…</p>
        ) : entries.length === 0 ? (
          <p>No hay diagnósticos registrados.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Fecha de detección</th>
                <th>Descripción</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, idx) => (
                <tr key={idx}>
                  <td>{e.service_name}</td>
                  <td>
                    {new Date(e.date_servicio).toLocaleString("es-MX", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                  <td>{e.description}</td>
                  <td>{statusLabel(e.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
