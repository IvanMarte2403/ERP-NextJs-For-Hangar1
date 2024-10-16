"use client";

import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; // Importa Firestore
import { db } from "../../../../../lib/firebase"; // Asegúrate de importar correctamente tu configuración de Firebase

export default function ModalClient({ isOpen, onClose, onClientSaved}) {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');

  // Función para manejar el guardado en Firestore
  const handleSave = async () => {
    if (!nombre || !correo || !telefono) {
      alert("Todos los campos son obligatorios");
      return;
    }

    try {
      // Crear un nuevo documento en la colección "clientes"
      const docRef = await addDoc(collection(db, "clientes"), {
        nombre,
        correo,
        telefono,
        hangar: [], // Inicializa el campo 'hangar' como un array vacío
        fecha_ultima_vez: serverTimestamp(), // Guardar la fecha/hora del servidor como fecha de la última vez
        numero_orders: 0, // Inicializa 'numero_orders' en 0
      });

      alert("Cliente guardado con éxito");


      onClientSaved(docRef.id); // Pasamos el ID del cliente creado


      // Limpia los campos
      setNombre('');
      setCorreo('');
      setTelefono('');

      // Cerrar el modal después de guardar
      onClose();

    } catch (error) {
      console.error("Error al guardar el cliente:", error);
      alert("Hubo un error al guardar el cliente. Inténtalo de nuevo.");
    }
  };

  if (!isOpen) return null; // Si el modal no está abierto, no mostrar nada

  return (
    <div className="modal-client-overlay">
      <div className="modal-client">
        <div className="modal-header">
          <h3>NUEVO CLIENTE</h3>
          <FontAwesomeIcon icon={faTimes} onClick={onClose} />
        </div>
        <div className="modal-body">
            <div className='input'>
                <p>Nombre/Apellidos</p>
                <input 
                  type="text" 
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
            </div>

            <div className='input'>
                <p>Correo Electrónico</p>
                <input 
                  type="text" 
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
            </div>

            <div className='input'>
                <p>Teléfono</p>
                <input 
                  type="text" 
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
            </div>
        </div>
        <div className="modal-footer">
          <button onClick={handleSave}>Guardar</button> {/* Llama a handleSave al guardar */}
        </div>
      </div>
    </div>
  );
}
