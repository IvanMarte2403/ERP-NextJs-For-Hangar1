"use client";

export default function CheckTecnico({ orderId }) {
  return (
    <div className="check-tecnico-container">
      <h2>Check-Tecnico – Orden #{orderId}</h2>
      
      <div className="container-diagnostico-vehicular">
        {/* Title */}
        <div className="title">
            <h3>Diagnostico Vehicular</h3>
        </div>
        {/* Row Input */}
        <div className="row-input-problem">

            {/* Input */}
            <div className="input">
                <p>Problema</p>
                <input type="text"  />
            </div>
            {/* Diagnostico */}
            <div className="input">
                <p>Diagnóstico</p>
                <input type="text"  />
            </div>
            {/* Lugar */}
            <div className="input">
                <p>Lugar</p>
                <input type="text"  />
            </div>
            
            <div className="buttons">
                <button> Agregar</button>
            </div>
        </div>

        <div className="container-table-list">
            
        </div>
      </div>
    </div>
  );
}
