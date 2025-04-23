// src/services/CheckIn-Evidencias.js
import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
  } from "firebase/storage";
  import { storage } from "../../lib/firebase";
  
  /**
   * Sube un video de evidencia al Storage.
   *
   * @param {string|number} orderId   - Id de la orden.
   * @param {"lateral"|"frontal"|"trasera"|"tablero"} evidenceType
   * @param {File} file               - Archivo de video (mp4, mov, etc.).
   * @param {(percent:number)=>void}  onProgress        - Callback opcional de avance.
   * @returns {Promise<string>}       - URL de descarga del archivo subido.
   */
  export const uploadCheckInEvidence = async (
    orderId,
    evidenceType,
    file,
    onProgress = () => {}
  ) => {
    console.log("=== Iniciando uploadCheckInEvidence ===");
    console.log("orderId:", orderId);
    console.log("evidenceType:", evidenceType);
    console.log("file.name:", file.name, "size:", file.size);
  
    try {
      // 1) Construir la ruta
      const folderPath = `Check-in/CheckIn_${orderId}_${evidenceType}`;
      const fileRef = ref(storage, `${folderPath}/${file.name}`);
      console.log("Storage path:", fileRef.fullPath);
  
      // 2) Lanzar la subida
      const uploadTask = uploadBytesResumable(fileRef, file);
      console.log("UploadTask creado, esperando eventos…");
  
      // 3) Envolver en Promise para esperar resultado
      return await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snap) => {
            // Progreso
            const pct = (snap.bytesTransferred / snap.totalBytes) * 100;
            onProgress(Math.round(pct));
            console.log(
              `Progreso ${evidenceType}: ${pct.toFixed(1)}% (${snap.bytesTransferred}/${snap.totalBytes})`
            );
          },
          (err) => {
            // Error
            console.error("🔥 Error en uploadBytesResumable:", err);
            reject(err);
          },
          async () => {
            // Éxito
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("✅ Subida terminada. Download URL:", url);
            resolve(url);
          }
        );
      });
    } catch (err) {
      // Capturamos errores inesperados (p.ej. reglas, falta de conexión)
      console.error("❌ Error catch general en uploadCheckInEvidence:", err);
      throw err;
    }
  };
  