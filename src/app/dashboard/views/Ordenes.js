"use client";

export default function Ordenes() {
  return (
    <div className="containerOrdenes">
       <div className="header-ordenes">
          <h1>¡Bienvenida Ariel Moreno</h1>
          <div className="search-container">
            <img
            src="icons/search.png"
            />
          </div>
        </div>     

        <div className="ordenes-container">
        <h2>Órdenes</h2>
      <table className="ordenes-table">
        <thead>
          <tr>
            <th>Número</th>
            <th>Fecha-Creación</th>
            <th>Cliente</th>
            <th>Auto</th>
            <th>Asesor</th>
            <th>Total</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>s102</td>
            <td>21/08/2024</td>
            <td>Oliver Gonzales</td>
            <td>Auto</td>
            <td>Cristian Abarca</td>
            <td>12,000</td>
            <td className="presupuesto">Presupuesto</td>
          </tr>
          <tr>
            <td>s103</td>
            <td>22/08/2024</td>
            <td>Lucia Martinez</td>
            <td>Auto</td>
            <td>Maria Perez</td>
            <td>15,000</td>
            <td className="negociacion">Negociación</td>
          </tr>

          <tr>
            <td>s103</td>
            <td>22/08/2024</td>
            <td>Lucia Martinez</td>
            <td>Auto</td>
            <td>Maria Perez</td>
            <td>15,000</td>
            <td className="vendido">Vendido
            </td>
          </tr>.
        </tbody>
      </table>
        </div>
    </div>
  );
}
