// historialPagos.js
// Componente reutilizable que muestra el Historial de Pagos
// Recibe un arreglo de abonos con la forma:
// [{ cantidad_abono: '1234.56', metodo_pago: 'Transferencia', fecha_abono: '2025-04-30' }, …]

import React from 'react';

/**
 * Formatea una fecha ISO (YYYY-MM-DD o YYYY-MM-DDTHH:mm:ss) a «DD/MM/AAAA»
 * sin aplicar la zona horaria del navegador, evitando así el desfase de un día.
 */
const formatFecha = (isoDate = '') => {
  if (!isoDate) return 'N/A';
  // Nos quedamos solo con la parte de la fecha (sin hora)
  const [year, month, day] = isoDate.slice(0, 10).split('-');
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
};

export default function HistorialPagos({ abonos = [] }) {
  if (!abonos.length) {
    return null; // No se muestra nada si no hay abonos
  }

  return (
    <div className="container-historial-de-pagos">
      <h3>Historial de Pagos</h3>

      <table>
        <thead>
          <tr>
            <th>Cantidad</th>
            <th>Método de Pago</th>
            <th>Fecha</th>
          </tr>
        </thead>

        <tbody>
          {abonos.map((abono, index) => (
            <tr key={index}>
              <td>
                $
                {parseFloat(abono.cantidad_abono || 0).toLocaleString('es-MX', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td>{abono.metodo_pago}</td>
              <td>{formatFecha(abono.fecha_abono)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
