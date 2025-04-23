// src/app/dashboard/check-in/CheckIn.js
"use client";

import { useState } from "react";
import { uploadEvidence } from "../../../../services/CheckIn/CheckInEvidencias";

export default function CheckIn({ orderId }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadEvidence(orderId, type, file);
      console.log("Evidencia subida (URL):", url);
      // Aquí puedes guardar la URL en Firestore si lo deseas
    } catch (error) {
      console.error("Error subiendo evidencia:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="checkin-container">
      <h2>Check-in Orden #{orderId}</h2>

      <div className="container-evidencias-graficas">
        <div className="row-evidencias">
          {/* Parte Frontal */}
          <div className="container-evidencia">
            <div className="container-left">
              <img src="check-in/eg-1.svg" alt="" />
            </div>
            <div className="container-right">
              <h3>Parte Frontal</h3>
              <p>
                Graba claramente el frente del coche, capturando detalles como cofre,
                parrilla, faros, defensa, emblema, matrícula y parabrisas...
              </p>
              <div className="container-update">
                <label className="cube">
                  <input
                    type="file"
                    accept="video/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleUpload(e, "frontal")}
                  />
                  {uploading ? (
                    <p>Subiendo...</p>
                  ) : (
                    <>
                      <img src="check-in/camera.svg" alt="" />
                      <p>Subir Evidencia</p>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Parte Trasera */}
          <div className="container-evidencia">
            <div className="container-left">
              <img src="check-in/eg-2.svg" alt="" />
            </div>
            <div className="container-right">
              <h3>Parte Trasera</h3>
              <p>
                Graba cuidadosamente la parte trasera del coche, mostrando claramente
                la tapa del maletero, defensa, luces traseras...              
              </p>
              <div className="container-update">
                <label className="cube">
                  <input
                    type="file"
                    accept="video/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleUpload(e, "trasera")}
                  />
                  {uploading ? (
                    <p>Subiendo...</p>
                  ) : (
                    <>
                      <img src="check-in/camera.svg" alt="" />
                      <p>Subir Evidencia</p>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="row-evidencias">
          {/* Lado Piloto/Copiloto */}
          <div className="container-evidencia">
            <div className="container-left">
              <img src="check-in/eg-3.svg" alt="" />
            </div>
            <div className="container-right">
              <h3>Lado Piloto/Copiloto</h3>
              <p>
                Graba cuidadosamente ambos laterales del coche (izquierdo y derecho),
                mostrando puertas, espejos, ventanas...
              </p>
              <div className="container-update">
                <label className="cube">
                  <input
                    type="file"
                    accept="video/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleUpload(e, "lateral")}
                  />
                  {uploading ? (
                    <p>Subiendo...</p>
                  ) : (
                    <>
                      <img src="check-in/camera.svg" alt="" />
                      <p>Subir Evidencia</p>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Tablero */}
          <div className="container-evidencia">
            <div className="container-left">
              <img src="check-in/eg-4.svg" alt="" />
            </div>
            <div className="container-right">
              <h3>Tablero - Motor Andando</h3>
              <p>
                Graba cuidadosamente el interior, mostrando tablero, volante,
                asientos, cinturones, paneles...
              </p>
              <div className="container-update">
                <label className="cube">
                  <input
                    type="file"
                    accept="video/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleUpload(e, "tablero")}
                  />
                  {uploading ? (
                    <p>Subiendo...</p>
                  ) : (
                    <>
                      <img src="check-in/camera.svg" alt="" />
                      <p>Subir Evidencia</p>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
