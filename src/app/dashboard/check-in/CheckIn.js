// src/app/dashboard/check-in/CheckIn.js
"use client";

import { useRef, useState } from "react";
import { uploadCheckInEvidence } from "../../../../services/CheckIn/CheckInEvidencias"; 

export default function CheckIn({ orderId }) {
  /* ----------- estado para avance de subida ----------- */
  const [progress, setProgress] = useState({
    frontal: 0,
    trasera: 0,
    lateral: 0,
    tablero: 0,
  });

  /* ----------- refs de inputs ----------- */
  const fileInputs = {
    frontal: useRef(null),
    trasera: useRef(null),
    lateral: useRef(null),
    tablero: useRef(null),
  };

  /* ----------- helpers ----------- */
  const openFileDialog = (type) => fileInputs[type].current?.click();

  const handleFileChange = async (type, e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await uploadCheckInEvidence(
        orderId,
        type,
        file,
        (pct) => setProgress((p) => ({ ...p, [type]: pct }))
      );
      alert("Evidencia subida correctamente ✅");
    } catch {
      alert("❌ Hubo un problema al subir la evidencia");
    } finally {
      // Limpiar el input para permitir volver a escoger el mismo archivo si se quiere
      e.target.value = "";
      setProgress((p) => ({ ...p, [type]: 0 }));
    }
  };

  /* ----------- UI ----------- */
  return (
    <div className="checkin-container">
      <h2>Check-in Orden #{orderId}</h2>

      {/* ---------- Evidencias gráficas ---------- */}
      <div className="container-evidencias-graficas">
        {/* ----- Fila 1 ----- */}
        <div className="row-evidencias">
          {/* Frontal */}
          <EvidenciaCard
            img="check-in/eg-1.svg"
            titulo="Parte Frontal"
            descripcion="Graba claramente el frente del coche, capturando..."
            onUpload={() => openFileDialog("frontal")}
            progress={progress.frontal}
          />
          <input
            type="file"
            accept="video/*"
            hidden
            ref={fileInputs.frontal}
            onChange={(e) => handleFileChange("frontal", e)}
          />

          {/* Trasera */}
          <EvidenciaCard
            img="check-in/eg-2.svg"
            titulo="Parte Trasera"
            descripcion="Graba cuidadosamente la parte trasera del coche..."
            onUpload={() => openFileDialog("trasera")}
            progress={progress.trasera}
          />
          <input
            type="file"
            accept="video/*"
            hidden
            ref={fileInputs.trasera}
            onChange={(e) => handleFileChange("trasera", e)}
          />
        </div>

        {/* ----- Fila 2 ----- */}
        <div className="row-evidencias">
          {/* Lateral */}
          <EvidenciaCard
            img="check-in/eg-3.svg"
            titulo="Lado Piloto/Copiloto"
            descripcion="Graba cuidadosamente ambos laterales del coche..."
            onUpload={() => openFileDialog("lateral")}
            progress={progress.lateral}
          />
          <input
            type="file"
            accept="video/*"
            hidden
            ref={fileInputs.lateral}
            onChange={(e) => handleFileChange("lateral", e)}
          />

          {/* Tablero */}
          <EvidenciaCard
            img="check-in/eg-4.svg"
            titulo="Tablero - Motor Andando"
            descripcion="Graba cuidadosamente el interior del vehículo..."
            onUpload={() => openFileDialog("tablero")}
            progress={progress.tablero}
          />
          <input
            type="file"
            accept="video/*"
            hidden
            ref={fileInputs.tablero}
            onChange={(e) => handleFileChange("tablero", e)}
          />
        </div>


      </div>

      
    </div>
  );
}

/* ======================================================
  Tarjeta reutilizable para cada evidencia
  ======================================================*/
function EvidenciaCard({ img, titulo, descripcion, onUpload, progress }) {
  return (
    <div className="container-evidencia">
      {/* Lado izquierdo */}
      <div className="container-left">
        <img src={img} alt={titulo} />
      </div>

      {/* Lado derecho */}
      <div className="container-right">
        <h3>{titulo}</h3>
        <p>{descripcion}</p>

        <div className="container-update">
          <div className="cube" onClick={onUpload}>
            <img src="check-in/camera.svg" alt="" />
            <p>Subir Evidencia</p>
          </div>
          {progress > 0 && progress < 100 && (
            <span className="upload-progress">{progress}%</span>
          )}
          {progress === 100 && <span className="upload-done">✓</span>}
        </div>
      </div>
    </div>
  );
}
