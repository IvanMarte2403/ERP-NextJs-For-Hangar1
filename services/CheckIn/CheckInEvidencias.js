// src/app/dashboard/check-in/CheckIn-Evidencias.js

import { storage } from "../../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Sube un video de evidencia a Firebase Storage en la ruta:
 * Check-in/CheckIn_{orderId}_{tipo}/
 * @param {string} orderId - ID de la orden.
 * @param {"frontal"|"trasera"|"lateral"|"tablero"} type - Tipo de evidencia.
 * @param {File} file - Archivo de video a subir.
 * @returns {Promise<string>} - URL de descarga del archivo.
 */
export const uploadEvidence = async (orderId, type, file) => {
  const folderMap = {
    frontal: `CheckIn_${orderId}_frontal`,
    trasera: `CheckIn_${orderId}_trasera`,
    lateral: `CheckIn_${orderId}_lateral`,
    tablero: `CheckIn_${orderId}_tablero`,
  };

  const folderName = folderMap[type];
  if (!folderName) {
    throw new Error(`Tipo de evidencia inválido: ${type}`);
  }

  // Referencia al archivo dentro de Storage
  const fileRef = ref(storage, `Check-in/${folderName}/${file.name}`);

  // Subir el archivo
  const snapshot = await uploadBytes(fileRef, file);

  // Obtener la URL pública de descarga
  const downloadURL = await getDownloadURL(snapshot.ref);

  return downloadURL;
};
