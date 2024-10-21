import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase'; // Importa Firestore

export default function ModalAbonar({ isOpen, onClose, orderId, existingAbonos = [], onUpdateAbonos }) {
  const [abonos, setAbonos] = useState([]);
  const [newAbono, setNewAbono] = useState({ cantidad_abono: '', fecha_abono: '', metodo_pago: 'Deposito' });

  useEffect(() => {
    // Cargar los abonos desde Firebase cuando el modal se abre
    const fetchAbonos = async () => {
      if (isOpen && orderId) {
        const orderDocRef = doc(db, "orders", orderId.toString());
        const orderSnap = await getDoc(orderDocRef);

        if (orderSnap.exists()) {
          const orderData = orderSnap.data();
          const existingAbonos = orderData.abonos || []; // Verificar si hay abonos
          setAbonos(existingAbonos); // Establecer los abonos obtenidos
        }
      }
    };

    fetchAbonos(); // Llamar a la función para obtener los abonos
  }, [isOpen, orderId]); // Ejecutar cuando se abre el modal o cambia el orderId

  // Manejar los cambios en los inputs del nuevo abono
  const handleInputChange = (field, value) => {
    setNewAbono((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Agregar un nuevo abono a la lista
  const addNewAbono = () => {
    if (!newAbono.cantidad_abono || !newAbono.fecha_abono || !newAbono.metodo_pago) {
      alert("Por favor, llena todos los campos");
      return;
    }

    setAbonos((prev) => [...prev, newAbono]); // Añadir el nuevo abono localmente
    setNewAbono({ cantidad_abono: '', fecha_abono: '', metodo_pago: 'Deposito' }); // Limpiar los campos
  };

  // Eliminar un abono de la lista
  const removeAbono = (index) => {
    setAbonos((prev) => prev.filter((_, i) => i !== index));
  };

  // Guardar los cambios en Firebase y cerrar el modal
  const handleUpdate = async () => {
    try {
      const orderDocRef = doc(db, "orders", orderId.toString());
      await updateDoc(orderDocRef, { abonos }); // Guardar los abonos en Firestore

      onUpdateAbonos(abonos); // Actualizar en el componente principal si es necesario
      onClose(); // Cerrar el modal después de guardar
    } catch (error) {
      console.error("Error al guardar los abonos en Firebase:", error);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modalAbonar">
      <div className="modal-content">
        <h2>Gestionar Abonos</h2>

        {/* Mostrar los abonos existentes */}
        <div className="abonos-list">
          {abonos.map((abono, index) => (
            <div key={index} className="abono-item">
              <p>Cantidad: {abono.cantidad_abono}</p>
              <p>Fecha: {abono.fecha_abono}</p>
              <p>Método de Pago: {abono.metodo_pago}</p>
              <button onClick={() => removeAbono(index)}>Eliminar</button>
            </div>
          ))}
        </div>

        {/* Agregar un nuevo abono */}
        <h3>Agregar Nuevo Abono</h3>
        <div className="nuevo-abono">
          <input
            type="number"
            placeholder="Cantidad de Abono"
            value={newAbono.cantidad_abono}
            onChange={(e) => handleInputChange('cantidad_abono', e.target.value)}
          />
          <input
            type="date"
            placeholder="Fecha de Abono"
            value={newAbono.fecha_abono}
            onChange={(e) => handleInputChange('fecha_abono', e.target.value)}
          />
          <select
            value={newAbono.metodo_pago}
            onChange={(e) => handleInputChange('metodo_pago', e.target.value)}
          >
            <option value="Deposito">Deposito</option>
            <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
            <option value="Tarjeta de Débito">Tarjeta de Débito</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Transferencia">Transferencia</option>

          </select>
          
          <button onClick={addNewAbono}>Añadir Abono</button>
        </div>

        {/* Botones de acciones */}
        <div className="modal-actions">
          <button onClick={onClose}>Cancelar</button>
          <button onClick={handleUpdate}>Guardar Cambios</button>
        </div>
      </div>
    </div>
  );
}
