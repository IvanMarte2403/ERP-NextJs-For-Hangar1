// CotizadorAvanzado/AfinacionBasica/components/PartCotizador.js
"use client";

import { useState } from "react";
import ContainerCilindros from "./ContainerCilindros";
import ContainerServiciosIncluidos from "./ContainerServiciosIncluidos";

/**
 * Formulario principal de partes del cotizador.
 */
export default function PartCotizador({
  onAddService,
  onCilindrosChange,
  onIncludeServicesChange,
}) {
  const [filtersAire, setFiltersAire] = useState({
    cantidad: "",
    marca: "",
    costo: "",
  });
  const [filtersCabina, setFiltersCabina] = useState({
    cantidad: "",
    marca: "",
    costo: "",
  });
  const [filtersCombustible, setFiltersCombustible] = useState({
    cantidad: "",
    marca: "",
    costo: "",
  });
  const [filtersAceite, setFiltersAceite] = useState({
    cantidad: "",
    marca: "",
    costo: "",
  });
  const [filtersBujias, setFiltersBujias] = useState({
    cantidad: "",
    marca: "",
    costo: "",
    tipo: "",
  });
  const [injPrecision, setInjPrecision] = useState({
    cantidad: "",
    costo: "",
  });
  const [aceitePerf, setAceitePerf] = useState({
    cantidad: "",
    marca: "",
    costo: "",
    tipo: "",
  });
  const [quimHigh, setQuimHigh] = useState({
    cantidad: "",
    marca: "",
    costo: "",
    tipo: "",
  });
  const [sistRefrig, setSistRefrig] = useState({
    cantidad: "",
    marca: "",
    costo: "",
    tipo: "",
  });
  const [limpParabrisas, setLimpParabrisas] = useState({
    cantidad: "",
    costo: "",
  });
  const [chisgueteros, setChisgueteros] = useState({
    cantidad: "",
    costo: "",
  });
  const [aditivoQuim, setAditivoQuim] = useState({
    cantidad: "",
    marca: "",
    costo: "",
    tipo: "",
  });
  const [lucesExt, setLucesExt] = useState({
    cantidad: "",
    costo: "",
  });
  const [lucesInt, setLucesInt] = useState({
    cantidad: "",
    costo: "",
  });

  const tryAdd = (state, serviceName, resetFn) => {
    const { cantidad, costo } = state;
    if (!cantidad || !costo) return;
    onAddService?.({
      cantidad: Number(cantidad),
      servicio: serviceName,
      costo: Number(costo),
    });
    resetFn();
  };

  return (
    <div className="container-forms-cotizador">
      {/* First Part */}
      <div className="container-part">
        {/* Cilindros y servicios incluidos */}
        <ContainerCilindros onSelect={onCilindrosChange} />
        <ContainerServiciosIncluidos onChange={onIncludeServicesChange} />

        {/* Cotizador Filtros de Aire */}
        <div className="form-input-cotizador">
          <div className="title-product">
            <img
              src="CotizadorAvanzado/AfinacionBasica/filtro_aire.svg"
              alt=""
            />
            <p>Filtros de Aire</p>
          </div>
          <div className="section-form-avanzado">
            <div className="inputs-section">
              <div className="container-cantidad">
                <p>Cantidad</p>
                <input
                  type="text"
                  value={filtersAire.cantidad}
                  onChange={(e) =>
                    setFiltersAire({ ...filtersAire, cantidad: e.target.value })
                  }
                />
              </div>
              <div className="container-marca">
                <p>Marca</p>
                <input
                  type="text"
                  value={filtersAire.marca}
                  onChange={(e) =>
                    setFiltersAire({ ...filtersAire, marca: e.target.value })
                  }
                />
              </div>
              <div className="container-costo">
                <p>Costo</p>
                <input
                  type="text"
                  value={filtersAire.costo}
                  onChange={(e) =>
                    setFiltersAire({ ...filtersAire, costo: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="confirmation-insection">
              <img
                src="CotizadorAvanzado/+.svg"
                alt=""
                onClick={() =>
                  tryAdd(filtersAire, "Filtros de Aire", () =>
                    setFiltersAire({ cantidad: "", marca: "", costo: "" })
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* Cotizador Filtros de Cabina */}
        <div className="form-input-cotizador">
          <div className="title-product">
            <img
              src="CotizadorAvanzado/AfinacionBasica/filtro_cabina.svg"
              alt=""
            />
            <p>Filtros de Cabina</p>
          </div>
          <div className="section-form-avanzado">
            <div className="inputs-section">
              <div className="container-cantidad">
                <p>Cantidad</p>
                <input
                  type="text"
                  value={filtersCabina.cantidad}
                  onChange={(e) =>
                    setFiltersCabina({
                      ...filtersCabina,
                      cantidad: e.target.value,
                    })
                  }
                />
              </div>
              <div className="container-marca">
                <p>Marca</p>
                <input
                  type="text"
                  value={filtersCabina.marca}
                  onChange={(e) =>
                    setFiltersCabina({ ...filtersCabina, marca: e.target.value })
                  }
                />
              </div>
              <div className="container-costo">
                <p>Costo</p>
                <input
                  type="text"
                  value={filtersCabina.costo}
                  onChange={(e) =>
                    setFiltersCabina({ ...filtersCabina, costo: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="confirmation-insection">
              <img
                src="CotizadorAvanzado/+.svg"
                alt=""
                onClick={() =>
                  tryAdd(filtersCabina, "Filtros de Cabina", () =>
                    setFiltersCabina({ cantidad: "", marca: "", costo: "" })
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* Cotizador Filtros de Combustible */}
        <div className="form-input-cotizador">
          <div className="title-product">
            <img
              src="CotizadorAvanzado/AfinacionBasica/filtro_combustible.svg"
              alt=""
            />
            <p>Filtros de Combustible</p>
          </div>
          <div className="section-form-avanzado">
            <div className="inputs-section">
              <div className="container-cantidad">
                <p>Cantidad</p>
                <input
                  type="text"
                  value={filtersCombustible.cantidad}
                  onChange={(e) =>
                    setFiltersCombustible({
                      ...filtersCombustible,
                      cantidad: e.target.value,
                    })
                  }
                />
              </div>
              <div className="container-marca">
                <p>Marca</p>
                <input
                  type="text"
                  value={filtersCombustible.marca}
                  onChange={(e) =>
                    setFiltersCombustible({
                      ...filtersCombustible,
                      marca: e.target.value,
                    })
                  }
                />
              </div>
              <div className="container-costo">
                <p>Costo</p>
                <input
                  type="text"
                  value={filtersCombustible.costo}
                  onChange={(e) =>
                    setFiltersCombustible({
                      ...filtersCombustible,
                      costo: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="confirmation-insection">
              <img
                src="CotizadorAvanzado/+.svg"
                alt=""
                onClick={() =>
                  tryAdd(filtersCombustible, "Filtros de Combustible", () =>
                    setFiltersCombustible({
                      cantidad: "",
                      marca: "",
                      costo: "",
                    })
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* Cotizador Filtros de Aceite */}
        <div className="form-input-cotizador">
          <div className="title-product">
            <img
              src="CotizadorAvanzado/AfinacionBasica/filtro_aceite.svg"
              alt=""
            />
            <p>Filtros de Aceite</p>
          </div>
          <div className="section-form-avanzado">
            <div className="inputs-section">
              <div className="container-cantidad">
                <p>Cantidad</p>
                <input
                  type="text"
                  value={filtersAceite.cantidad}
                  onChange={(e) =>
                    setFiltersAceite({
                      ...filtersAceite,
                      cantidad: e.target.value,
                    })
                  }
                />
              </div>
              <div className="container-marca">
                <p>Marca</p>
                <input
                  type="text"
                  value={filtersAceite.marca}
                  onChange={(e) =>
                    setFiltersAceite({ ...filtersAceite, marca: e.target.value })
                  }
                />
              </div>
              <div className="container-costo">
                <p>Costo</p>
                <input
                  type="text"
                  value={filtersAceite.costo}
                  onChange={(e) =>
                    setFiltersAceite({ ...filtersAceite, costo: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="confirmation-insection">
              <img
                src="CotizadorAvanzado/+.svg"
                alt=""
                onClick={() =>
                  tryAdd(filtersAceite, "Filtros de Aceite", () =>
                    setFiltersAceite({ cantidad: "", marca: "", costo: "" })
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* Cotizador Bujías */}
        <div className="form-input-cotizador">
          <div className="title-product">
            <img src="CotizadorAvanzado/AfinacionBasica/bujias.svg" alt="" />
            <p>Bujias</p>
          </div>
          <div className="section-form-avanzado">
            <div className="inputs-section">
              <div className="container-cantidad">
                <p>Cantidad</p>
                <input
                  type="text"
                  value={filtersBujias.cantidad}
                  onChange={(e) =>
                    setFiltersBujias({
                      ...filtersBujias,
                      cantidad: e.target.value,
                    })
                  }
                />
              </div>
              <div className="container-marca">
                <p>Marca</p>
                <input
                  type="text"
                  value={filtersBujias.marca}
                  onChange={(e) =>
                    setFiltersBujias({ ...filtersBujias, marca: e.target.value })
                  }
                />
              </div>
              <div className="container-costo">
                <p>Costo</p>
                <input
                  type="text"
                  value={filtersBujias.costo}
                  onChange={(e) =>
                    setFiltersBujias({
                      ...filtersBujias,
                      costo: e.target.value,
                    })
                  }
                />
              </div>
              <div className="container-tipo">
                <p>Tipo</p>
                <input
                  type="text"
                  value={filtersBujias.tipo}
                  onChange={(e) =>
                    setFiltersBujias({ ...filtersBujias, tipo: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="confirmation-insection">
              <img
                src="CotizadorAvanzado/+.svg"
                alt=""
                onClick={() =>
                  tryAdd(filtersBujias, "Bujias", () =>
                    setFiltersBujias({
                      cantidad: "",
                      marca: "",
                      costo: "",
                      tipo: "",
                    })
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Second Part */}
      <div className="title-part">
        <h4>Performance</h4>
      </div>
      <div className="container-part">
        {/* Limpieza de Inyectores de Alta precisión */}
        <div className="form-input-cotizador">
          <div className="title-product">
            <img src="CotizadorAvanzado/AfinacionBasica/bujias.svg" alt="" />
            <p>Limpieza de Inyectores de Alta precisión</p>
          </div>
          <div className="section-form-avanzado">
            <div className="inputs-section">
              <div className="container-cantidad">
                <p>Cantidad</p>
                <input
                  type="text"
                  value={injPrecision.cantidad}
                  onChange={(e) =>
                    setInjPrecision({
                      ...injPrecision,
                      cantidad: e.target.value,
                    })
                  }
                />
              </div>
              <div className="container-costo">
                <p>Costo</p>
                <input
                  type="text"
                  value={injPrecision.costo}
                  onChange={(e) =>
                    setInjPrecision({ ...injPrecision, costo: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="confirmation-insection">
              <img
                src="CotizadorAvanzado/+.svg"
                alt=""
                onClick={() =>
                  tryAdd(
                    injPrecision,
                    "Limpieza Inyectores Alta Precisión",
                    () => setInjPrecision({ cantidad: "", costo: "" })
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* Aceite */}
        <div className="form-input-cotizador">
          <div className="title-product">
            <img src="CotizadorAvanzado/AfinacionBasica/aceite.svg" alt="" />
            <p>Aceite</p>
          </div>
          <div className="section-form-avanzado">
            <div className="inputs-section">
              <div className="container-cantidad">
                <p>Cantidad</p>
                <input
                  type="text"
                  value={aceitePerf.cantidad}
                  onChange={(e) =>
                    setAceitePerf({
                      ...aceitePerf,
                      cantidad: e.target.value,
                    })
                  }
                />
              </div>
              <div className="container-marca">
                <p>Marca</p>
                <input
                  type="text"
                  value={aceitePerf.marca}
                  onChange={(e) =>
                    setAceitePerf({ ...aceitePerf, marca: e.target.value })
                  }
                />
              </div>
              <div className="container-costo">
                <p>Costo</p>
                <input
                  type="text"
                  value={aceitePerf.costo}
                  onChange={(e) =>
                    setAceitePerf({ ...aceitePerf, costo: e.target.value })
                  }
                />
              </div>
              <div className="container-tipo">
                <p>Tipo</p>
                <input
                  type="text"
                  value={aceitePerf.tipo}
                  onChange={(e) =>
                    setAceitePerf({ ...aceitePerf, tipo: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="confirmation-insection">
              <img
                src="CotizadorAvanzado/+.svg"
                alt=""
                onClick={() =>
                  tryAdd(aceitePerf, "Aceite", () =>
                    setAceitePerf({
                      cantidad: "",
                      marca: "",
                      costo: "",
                      tipo: "",
                    })
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* Químicos High Performance */}
        <div className="form-input-cotizador">
          <div className="title-product">
            <img
              src="CotizadorAvanzado/AfinacionBasica/quimicos_high.svg"
              alt=""
            />
            <p>Químicos High Performance</p>
          </div>
          <div className="section-form-avanzado">
            <div className="inputs-section">
              <div className="container-cantidad">
                <p>Cantidad</p>
                <input
                  type="text"
                  value={quimHigh.cantidad}
                  onChange={(e) =>
                    setQuimHigh({ ...quimHigh, cantidad: e.target.value })
                  }
                />
              </div>
              <div className="container-marca">
                <p>Marca</p>
                <input
                  type="text"
                  value={quimHigh.marca}
                  onChange={(e) =>
                    setQuimHigh({ ...quimHigh, marca: e.target.value })
                  }
                />
              </div>
              <div className="container-costo">
                <p>Costo</p>
                <input
                  type="text"
                  value={quimHigh.costo}
                  onChange={(e) =>
                    setQuimHigh({ ...quimHigh, costo: e.target.value })
                  }
                />
              </div>
              <div className="container-tipo">
                <p>Tipo</p>
                <input
                  type="text"
                  value={quimHigh.tipo}
                  onChange={(e) =>
                    setQuimHigh({ ...quimHigh, tipo: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="confirmation-insection">
              <img
                src="CotizadorAvanzado/+.svg"
                alt=""
                onClick={() =>
                  tryAdd(quimHigh, "Químicos High Performance", () =>
                    setQuimHigh({
                      cantidad: "",
                      marca: "",
                      costo: "",
                      tipo: "",
                    })
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* Sistema de refrigeración */}
        <div className="form-input-cotizador">
          <div className="title-product">
            <img
              src="CotizadorAvanzado/AfinacionBasica/quimicos_high.svg"
              alt=""
            />
            <p>Sistema de refrigeración</p>
          </div>
          <div className="section-form-avanzado">
            <div className="inputs-section">
              <div className="container-cantidad">
                <p>Cantidad</p>
                <input
                  type="text"
                  value={sistRefrig.cantidad}
                  onChange={(e) =>
                    setSistRefrig({
                      ...sistRefrig,
                      cantidad: e.target.value,
                    })
                  }
                />
              </div>
              <div className="container-marca">
                <p>Marca</p>
                <input
                  type="text"
                  value={sistRefrig.marca}
                  onChange={(e) =>
                    setSistRefrig({ ...sistRefrig, marca: e.target.value })
                  }
                />
              </div>
              <div className="container-costo">
                <p>Costo</p>
                <input
                  type="text"
                  value={sistRefrig.costo}
                  onChange={(e) =>
                    setSistRefrig({ ...sistRefrig, costo: e.target.value })
                  }
                />
              </div>
              <div className="container-tipo">
                <p>Tipo</p>
                <input
                  type="text"
                  value={sistRefrig.tipo}
                  onChange={(e) =>
                    setSistRefrig({ ...sistRefrig, tipo: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="confirmation-insection">
              <img
                src="CotizadorAvanzado/+.svg"
                alt=""
                onClick={() =>
                  tryAdd(sistRefrig, "Sistema de refrigeración", () =>
                    setSistRefrig({
                      cantidad: "",
                      marca: "",
                      costo: "",
                      tipo: "",
                    })
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Extra Part */}
      <div className="title-part">
        <h4>Extra</h4>
      </div>
      <div className="container-part">
        {/* Limpieza de Parabrisas */}
        <div className="form-input-cotizador">
          <div className="title-product">
            <img src="CotizadorAvanzado/AfinacionBasica/bujias.svg" alt="" />
            <p>Limpieza de Parabrisas</p>
          </div>
          <div className="section-form-avanzado">
            <div className="inputs-section">
              <div className="container-cantidad">
                <p>Cantidad</p>
                <input
                  type="text"
                  value={limpParabrisas.cantidad}
                  onChange={(e) =>
                    setLimpParabrisas({
                      ...limpParabrisas,
                      cantidad: e.target.value,
                    })
                  }
                />
              </div>
              <div className="container-costo">
                <p>Costo</p>
                <input
                  type="text"
                  value={limpParabrisas.costo}
                  onChange={(e) =>
                    setLimpParabrisas({
                      ...limpParabrisas,
                      costo: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="confirmation-insection">
              <img
                src="CotizadorAvanzado/+.svg"
                alt=""
                onClick={() =>
                  tryAdd(limpParabrisas, "Limpieza de Parabrisas", () =>
                    setLimpParabrisas({ cantidad: "", costo: "" })
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* Revisión & Calibración de Chisgueteros */}
        <div className="form-input-cotizador">
          <div className="title-product">
            <img
              src="CotizadorAvanzado/AfinacionBasica/chisgeteros.svg"
              alt=""
            />
            <p>Revisión & Calibración de Chisgueteros</p>
          </div>
          <div className="section-form-avanzado">
            <div className="inputs-section">
              <div className="container-cantidad">
                <p>Cantidad</p>
                <input
                  type="text"
                  value={chisgueteros.cantidad}
                  onChange={(e) =>
                    setChisgueteros({
                      ...chisgueteros,
                      cantidad: e.target.value,
                    })
                  }
                />
              </div>
              <div className="container-costo">
                <p>Costo</p>
                <input
                  type="text"
                  value={chisgueteros.costo}
                  onChange={(e) =>
                    setChisgueteros({
                      ...chisgueteros,
                      costo: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="confirmation-insection">
              <img
                src="CotizadorAvanzado/+.svg"
                alt=""
                onClick={() =>
                  tryAdd(
                    chisgueteros,
                    "Revisión & Calibración de Chisgueteros",
                    () => setChisgueteros({ cantidad: "", costo: "" })
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* Aditivo Químico */}
        <div className="form-input-cotizador">
          <div className="title-product">
            <img
              src="CotizadorAvanzado/AfinacionBasica/quimicos_high.svg"
              alt=""
            />
            <p>Aditivo Químico</p>
          </div>
          <div className="section-form-avanzado">
            <div className="inputs-section">
              <div className="container-cantidad">
                <p>Cantidad</p>
                <input
                  type="text"
                  value={aditivoQuim.cantidad}
                  onChange={(e) =>
                    setAditivoQuim({
                      ...aditivoQuim,
                      cantidad: e.target.value,
                    })
                  }
                />
              </div>
              <div className="container-marca">
                <p>Marca</p>
                <input
                  type="text"
                  value={aditivoQuim.marca}
                  onChange={(e) =>
                    setAditivoQuim({
                      ...aditivoQuim,
                      marca: e.target.value,
                    })
                  }
                />
              </div>
              <div className="container-costo">
                <p>Costo</p>
                <input
                  type="text"
                  value={aditivoQuim.costo}
                  onChange={(e) =>
                    setAditivoQuim({
                      ...aditivoQuim,
                      costo: e.target.value,
                    })
                  }
                />
              </div>
              <div className="container-tipo">
                <p>Tipo</p>
                <input
                  type="text"
                  value={aditivoQuim.tipo}
                  onChange={(e) =>
                    setAditivoQuim({ ...aditivoQuim, tipo: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="confirmation-insection">
              <img
                src="CotizadorAvanzado/+.svg"
                alt=""
                onClick={() =>
                  tryAdd(aditivoQuim, "Aditivo Químico", () =>
                    setAditivoQuim({
                      cantidad: "",
                      marca: "",
                      costo: "",
                      tipo: "",
                    })
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* Revisión de Luces (Exteriores) */}
        <div className="form-input-cotizador">
          <div className="title-product">
            <img src="CotizadorAvanzado/AfinacionBasica/luces.svg" alt="" />
            <p>Revisión de Luces (Exteriores)</p>
          </div>
          <div className="section-form-avanzado">
            <div className="inputs-section">
              <div className="container-cantidad">
                <p>Cantidad</p>
                <input
                  type="text"
                  value={lucesExt.cantidad}
                  onChange={(e) =>
                    setLucesExt({ ...lucesExt, cantidad: e.target.value })
                  }
                />
              </div>
              <div className="container-costo">
                <p>Costo</p>
                <input
                  type="text"
                  value={lucesExt.costo}
                  onChange={(e) =>
                    setLucesExt({ ...lucesExt, costo: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="confirmation-insection">
              <img
                src="CotizadorAvanzado/+.svg"
                alt=""
                onClick={() =>
                  tryAdd(lucesExt, "Revisión de Luces (Exteriores)", () =>
                    setLucesExt({ cantidad: "", costo: "" })
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* Revisión de Luces (Interiores) */}
        <div className="form-input-cotizador">
          <div className="title-product">
            <img src="CotizadorAvanzado/AfinacionBasica/luces.svg" alt="" />
            <p>Revisión de Luces (Interiores)</p>
          </div>
          <div className="section-form-avanzado">
            <div className="inputs-section">
              <div className="container-cantidad">
                <p>Cantidad</p>
                <input
                  type="text"
                  value={lucesInt.cantidad}
                  onChange={(e) =>
                    setLucesInt({ ...lucesInt, cantidad: e.target.value })
                  }
                />
              </div>
              <div className="container-costo">
                <p>Costo</p>
                <input
                  type="text"
                  value={lucesInt.costo}
                  onChange={(e) =>
                    setLucesInt({ ...lucesInt, costo: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="confirmation-insection">
              <img
                src="CotizadorAvanzado/+.svg"
                alt=""
                onClick={() =>
                  tryAdd(lucesInt, "Revisión de Luces (Interiores)", () =>
                    setLucesInt({ cantidad: "", costo: "" })
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
