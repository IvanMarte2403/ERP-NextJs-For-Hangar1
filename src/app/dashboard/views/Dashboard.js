"use client";
import { useEffect, useState } from "react";
import { getMonthlySalesData, getWeeklySalesData, getMonthlyDataByInCharge } from "../../../../services/AdminService"; 
// Agrega estas importaciones al inicio del archivo
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

export default function Dashboard() {
  
  // --Totales de Data--
  const [salesData, setSalesData] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);

  // -- Gráfica--

  const [presupuestoData, setPresupuestoData] = useState(null);
  const [negociacionData, setNegociacionData] = useState(null);

  //-- Data in Charge-- 

  const [jorgeData, setJorgeData] = useState(null);
  const [cristianData, setCristianData] = useState(null);


  const chartDataPresupuesto = {
    labels: presupuestoData ? Object.keys(presupuestoData) : [],
    datasets: [
      {
        label: 'Presupuesto',
        data: presupuestoData ? Object.values(presupuestoData) : [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)', // puedes ajustar colores si deseas
      },
    ],
  };
  
  const chartDataNegociacion = {
    labels: negociacionData ? Object.keys(negociacionData) : [],
    datasets: [
      {
        label: 'Negociacion',
        data: negociacionData ? Object.values(negociacionData) : [],
        backgroundColor: 'rgba(75, 192, 192, 0.5)', // puedes ajustar colores si deseas
      },
    ],
  };

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMonthlySalesData();
        if (data) {
          setSalesData(data);
        }
        
        
        const weeklySales = await getWeeklySalesData("Vendido");
        if (weeklySales) {
          console.log("Datos recibidos para ventas diarias (Vendido):", weeklySales);
          setWeeklyData(weeklySales);
        }
  
        // -- Campos de Presupuesto y Negociacion --
        const dataPresupuesto = await getWeeklySalesData("Presupuesto");
        if (dataPresupuesto) {
          console.log("Datos recibidos para Presupuesto:", dataPresupuesto);
          setPresupuestoData(dataPresupuesto);
        }

        const dataNegociacion = await getWeeklySalesData("Negociación");
          if (dataNegociacion) {
            console.log("Datos recibidos para Negociación:", dataNegociacion);
            setNegociacionData(dataNegociacion);

        // --Data In Charge--

        const jorgeInfo = await getMonthlyDataByInCharge("Jorge Sanchez");
        setJorgeData(jorgeInfo);

        const cristianInfo = await getMonthlyDataByInCharge("Cristian Abarca");
        setCristianData(cristianInfo);
    }

      } catch (error) {
        console.error("Error al obtener los datos de ventas:", error);
      }
    };
  
    fetchData();
  }, []);

    // Preparar datos para la gráfica
    const chartData = (weeklyData && presupuestoData && negociacionData) ? {
      labels: Object.keys(weeklyData),
      datasets: [
        {
          label: 'Ventas Diarias',
          data: Object.values(weeklyData),
          backgroundColor: 'rgba(255, 203, 8, 0.5)',
        },
        {
          label: 'Presupuesto',
          data: Object.values(presupuestoData),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        },
        {
          label: 'Negociacion',
          data: Object.values(negociacionData),
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
      ],
    } : null;
    

    const chartOptions = {
      plugins: {
        legend: {
          display: true,
          position: 'bottom', // Mueve el cuadro de identificador abajo
          labels: {
            color: '#000', // Color amarillo para las etiquetas del identificador
            font: {
              size: 14, // Ajusta el tamaño del texto del identificador
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#000', // Color negro para las etiquetas del eje X
            font: {
              size: 10, // Ajusta el tamaño del texto de los días de la semana
            },
          },
          grid: {
            display: false, // Quita las líneas de fondo del eje X
          },
        },
        y: {
          ticks: {
            color: '#000', // Color negro para las etiquetas del eje Y
          },
          grid: {
            display: false, // Quita las líneas de fondo del eje Y
          },
        },
      },
    };
  

  return (
    <div className="containerDashboard">
      <h2>Finanzas / {new Date().toLocaleString("es-ES", { month: "long" })}</h2>

      <div className="dashboard-main">
        <div className="dashboard-left">
          {/* Container Blocks */}
          <div className="container-blocks">
            {/* Block-1 */}
            <div className="block">
              <img src="icons/dashboard/ventas-mensuales.png"/>
              <h3>Total Ventas Mensuales </h3>
              <p>
                $
                {salesData
                  ? salesData.totalSales.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : "Cargando..."}
              </p>
              
            </div>

            {/* Block-2 */}
            <div className="block">b
                <img src="icons/dashboard/ventasPrime.png"/>
                <h3>Ventas Mensuales</h3>
                  <p>
                    $
                    {salesData
                      ? salesData.primeServiceTotal.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : "Cargando..."}
                  </p>
              
                </div>


            {/* Block-3 */}
            <div className="block">
                <img src="icons/dashboard/ventasSpeed.png"/>
                <h3>Ventas Mensuales</h3>
                <p>
                  $
                  {salesData
                    ? salesData.speedCenterTotal.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : "Cargando..."}
                </p>
            </div>

          </div>  
          
          {/* Container Gráfica de Ventas Semanales */}
          <div className="container-semanal">
            <div className="title">
              <h3>Overview / <span>semanal</span></h3>
            </div>

            <div className="container-grafica">
            <div className="grafica">
              {chartData ? (
                  <Bar data={chartData} options={chartOptions} />
                ) : (
                  <p>Cargando gráfica...</p>
                )}

            </div>


              <div className="texto-grafica">
                <p><span>Top Día Martes: </span>Martes</p>
                <p>Top Semana</p>

              </div>
            </div>
          </div>

          <div className="container-asesores">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Presupuestos</th>
                  <th>Negociaciones</th>
                  <th>Ventas Cerradas</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Cristian Abarca</td>
                  <td>{cristianData ? cristianData.presupuesto : "Cargando..."}</td>
                  <td>{cristianData ? cristianData.negociacion : "Cargando..."}</td>
                  <td>{cristianData ? cristianData.vendido : "Cargando..."}</td>
                  <td>
                    {cristianData
                      ? cristianData.total.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : "Cargando..."}
                  </td>                
                  {/* Jorge Informacion */}
                </tr>
                <tr>
                  <td>Jorge Sanchez</td>
                  <td>{jorgeData ? jorgeData.presupuesto : "Cargando..."}</td>
                  <td>{jorgeData ? jorgeData.negociacion : "Cargando..."}</td>
                  <td>{jorgeData ? jorgeData.vendido : "Cargando..."}</td>
                  <td>
                    {jorgeData
                      ? jorgeData.total.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : "Cargando..."}
                  </td>
                        </tr>
              </tbody>
            </table>
          </div>


        </div>

        <div className="dashboard-right">
          
        </div>
  

      </div>

    </div>
  );
}
