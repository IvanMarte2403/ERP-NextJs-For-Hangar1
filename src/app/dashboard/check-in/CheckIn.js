// src/app/dashboard/check-in/CheckIn.js
"use client";

import { useRef, useState, useEffect } from "react";
import { getCheckInUrls } from "../../../../services/CheckIn/getCheckInUrls";
import { uploadDocument } from "../../../../services/CheckIn/uploadDocument";

export default function CheckIn({ orderId }) {
  /* ---------- estado de carga inicial ---------- */
  const [loading, setLoading] = useState(true);

  /* ---------- progreso de subida ---------- */
  const [progress, setProgress] = useState({
    frontal: 0,
    trasero: 0,
    lateral: 0,
    tablero: 0,
  });

  /* ---------- videos existentes ---------- */
  const [videos, setVideos] = useState({
    frontal: { url: null, uploadedAt: null },
    trasero: { url: null, uploadedAt: null },
    lateral: { url: null, uploadedAt: null },
    tablero: { url: null, uploadedAt: null },
  });

  /* ---------- refs de inputs ---------- */
  const fileInputs = {
    frontal: useRef(null),
    trasero: useRef(null),
    lateral: useRef(null),
    tablero: useRef(null),
  };

  /* ---------- cargar evidencias existentes ---------- */
  useEffect(() => {
    async function fetchUrls() {
      try {
        setLoading(true);
        const data = await getCheckInUrls(orderId);
        const tmp = {
          frontal: { url: null, uploadedAt: null },
          trasero: { url: null, uploadedAt: null },
          lateral: { url: null, uploadedAt: null },
          tablero: { url: null, uploadedAt: null },
        };

        data.files.forEach(({ name, url, uploaded_at }) => {
          if (name.startsWith("check-in_frontal")) {
            tmp.frontal = { url, uploadedAt: uploaded_at };
          } else if (name.startsWith("check-in_trasero")) {
            tmp.trasero = { url, uploadedAt: uploaded_at };
          } else if (name.startsWith("check-in_lateral")) {
            tmp.lateral = { url, uploadedAt: uploaded_at };
          } else if (name.startsWith("check-in_tablero")) {
            tmp.tablero = { url, uploadedAt: uploaded_at };
          }
        });

        setVideos(tmp);
      } catch (err) {
        console.error("Error fetching check-in URLs:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUrls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  /* ---------- helpers ---------- */
  const openFileDialog = (type) => fileInputs[type].current?.click();

  const handleFileChange = async (type, e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const res = await uploadDocument(orderId, type, file, (pct) =>
        setProgress((p) => ({ ...p, [type]: pct }))
      );
      alert("Evidencia subida correctamente ✅");

      setVideos((v) => ({
        ...v,
        [type]: {
          url: res.url || URL.createObjectURL(file),
          uploadedAt: res.uploaded_at || new Date().toISOString(),
        },
      }));
    } catch (err) {
      console.error("Error uploading document:", err);
      alert("❌ Hubo un problema al subir la evidencia");
    } finally {
      e.target.value = "";
      setProgress((p) => ({ ...p, [type]: 0 }));
    }
  };

  /* ---------- mostrar loading hasta terminar fetchUrls ---------- */
  if (loading) {
    return <p>Cargando evidencias...</p>;
  }

  /* ---------- UI una vez cargado ---------- */
  return (
    <div className="checkin-container">
      <h2>Check-in Orden #{orderId}</h2>

      <div className="container-evidencias-graficas">
        <div className="row-evidencias">
          <EvidenciaCard
            img="check-in/eg-1.svg"
            titulo="Parte Frontal"
            descripcion="Graba claramente el frente del coche, capturando..."
            type="frontal"
            onUpload={() => openFileDialog("frontal")}
            progress={progress.frontal}
            videoData={videos.frontal}
          />
          <input
            type="file"
            accept="video/*"
            hidden
            ref={fileInputs.frontal}
            onChange={(e) => handleFileChange("frontal", e)}
          />

          <EvidenciaCard
            img="check-in/eg-2.svg"
            titulo="Parte Trasera"
            descripcion="Graba cuidadosamente la parte trasera del coche..."
            type="trasero"
            onUpload={() => openFileDialog("trasero")}
            progress={progress.trasero}
            videoData={videos.trasero}
          />
          <input
            type="file"
            accept="video/*"
            hidden
            ref={fileInputs.trasero}
            onChange={(e) => handleFileChange("trasero", e)}
          />
        </div>

        <div className="row-evidencias">
          <EvidenciaCard
            img="check-in/eg-3.svg"
            titulo="Lado Piloto/Copiloto"
            descripcion="Graba cuidadosamente ambos laterales del coche..."
            type="lateral"
            onUpload={() => openFileDialog("lateral")}
            progress={progress.lateral}
            videoData={videos.lateral}
          />
          <input
            type="file"
            accept="video/*"
            hidden
            ref={fileInputs.lateral}
            onChange={(e) => handleFileChange("lateral", e)}
          />

          <EvidenciaCard
            img="check-in/eg-4.svg"
            titulo="Tablero - Motor Andando"
            descripcion="Graba cuidadosamente el interior del vehículo..."
            type="tablero"
            onUpload={() => openFileDialog("tablero")}
            progress={progress.tablero}
            videoData={videos.tablero}
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

function EvidenciaCard({ img, titulo, descripcion, onUpload, progress, videoData }) {
  const hasVideo = Boolean(videoData?.url);

  if (hasVideo) {
    return (
      <div className="container-evidencia">
        <div className="container-update">
          <h3>{titulo}</h3>
          <video src={videoData.url} controls width="180" />
          <p className="upload-date">
            Subido:{" "}
            {new Date(videoData.uploadedAt).toLocaleString("es-MX", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </p>
          {progress > 0 && progress < 100 && (
            <span className="upload-progress">{progress}%</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container-evidencia">
      <div className="container-left">
        <img src={img} alt={titulo} />
      </div>
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
