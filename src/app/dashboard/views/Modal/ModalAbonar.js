import React, { useState, useEffect } from 'react';

export default function ModalAbonar({ isOpen, onClose, orderId, existingAbonos = [], onUpdateAbonos }) {
  const [abonos, setAbonos] = useState([]);
  const [newAbono, setNewAbono] = useState({ cantidad_abono: '', fecha_abono: '' });

  useEffect(() => {
    // Inicializa los abonos solo si el modal se abre por primera vez
    if (isOpen) {
      setAbonos([...existingAbonos]);
    }
  }, [isOpen]); // Usar solo isOpen como dependencia

  // Manejar los cambios en los inputs del nuevo abono
  const handleNewAbonoChange = (field, value) => {
    setNewAbono((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Agregar un nuevo abono a la lista
  const addNewAbono = () => {
    setAbonos((prev) => [...prev, newAbono]);
    setNewAbono({ cantidad_abono: '', fecha_abono: '' }); // Limpiar los campos del nuevo abono
  };

  // Eliminar un abono de la lista
  const removeAbono = (index) => {
    setAbonos((prev) => prev.filter((_, i) => i !== index));
  };

  // Guardar los cambios en la base de datos
  const handleUpdate = () => {
    onUpdateAbonos(orderId, abonos);
    onClose(); // Cerrar el modal
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
            onChange={(e) => handleNewAbonoChange('cantidad_abono', e.target.value)}
          />
          <input
            type="date"
            placeholder="Fecha de Abono"
            value={newAbono.fecha_abono}
            onChange={(e) => handleNewAbonoChange('fecha_abono', e.target.value)}
          />
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
