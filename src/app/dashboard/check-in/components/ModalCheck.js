"use client";

import React from "react";

/**
 * Modal genérico para Check-Técnico.
 * @param {{ open:boolean, title:string, onSave:()=>void, onClose:()=>void }} props
 */
export default function ModalCheck({ open, title, onSave, onClose }) {
  if (!open) return null;

  return (
    <div className="check-modal-overlay">
      <div className="check-modal">
        <h2>{title}</h2>

        {/* Espacio para inputs extra en el futuro */}
        <div className="modal-body">
          <p>Aquí podrás capturar información adicional.</p>
        </div>

        <div className="modal-actions">
          <button onClick={onSave}>Guardar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
