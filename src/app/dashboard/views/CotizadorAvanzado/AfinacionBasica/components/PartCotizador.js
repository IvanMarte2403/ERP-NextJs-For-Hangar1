// CotizadorAvanzado/AfinacionBasica/components/PartCotizador.js
"use client";

import ContainerCilindros from "./ContainerCilindros";
import ContainerServiciosIncluidos from "./ContainerServiciosIncluidos";

export default function PartCotizador() {
  return (
    <div className="container-forms-cotizador">
      {/* First Part */}
      <div className="container-part">
        <ContainerCilindros />
        <ContainerServiciosIncluidos />

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
                <input type="text" />
              </div>
              <div className="container-marca">
                <p>Marca</p>
                <input type="text" />
              </div>
              <div className="container-costo">
                <p>Costo</p>
                <input type="text" />
              </div>
            </div>
            <div className="confirmation-insection">
              <img src="CotizadorAvanzado/+.svg" alt="" />
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
                <input type="text" />
              </div>
              <div className="container-marca">
                <p>Marca</p>
                <input type="text" />
              </div>
              <div className="container-costo">
                <p>Costo</p>
                <input type="text" />
              </div>
            </div>
            <div className="confirmation-insection">
              <img src="CotizadorAvanzado/+.svg" alt="" />
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
                <input type="text" />
              </div>
              <div className="container-marca">
                <p>Marca</p>
                <input type="text" />
              </div>
              <div className="container-costo">
                <p>Costo</p>
                <input type="text" />
              </div>
            </div>
            <div className="confirmation-insection">
              <img src="CotizadorAvanzado/+.svg" alt="" />
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
                <input type="text" />
              </div>
              <div className="container-marca">
                <p>Marca</p>
                <input type="text" />
              </div>
              <div className="container-costo">
                <p>Costo</p>
                <input type="text" />
              </div>
            </div>
            <div className="confirmation-insection">
              <img src="CotizadorAvanzado/+.svg" alt="" />
            </div>
          </div>
        </div>

        {/* Cotizador Filtros de Bujias */}
        <div className="form-input-cotizador">
          <div className="title-product">
            <img src="CotizadorAvanzado/AfinacionBasica/bujias.svg" alt="" />
            <p>Bujias</p>
          </div>
          <div className="section-form-avanzado">
            <div className="inputs-section">
              <div className="container-cantidad">
                <p>Cantidad</p>
                <input type="text" />
              </div>
              <div className="container-marca">
                <p>Marca</p>
                <input type="text" />
              </div>
              <div className="container-costo">
                <p>Costo</p>
                <input type="text" />
              </div>
              <div className="container-tipo">
                <p>Tipo</p>
                <input type="text" />
              </div>
            </div>
            <div className="confirmation-insection">
              <img src="CotizadorAvanzado/+.svg" alt="" />
            </div>
          </div>
        </div>
      </div>

      {/* Second Part */}
      <div className="title-part">
        <h4>Performance</h4>
      </div>

      <div className="container-part">
        {/* Cotizador Limpieza de Inyectores de Alta Precisión */}
        <div className="form-input-cotizador">
          <div className="title-product">
            <img src="CotizadorAvanzado/AfinacionBasica/bujias.svg" alt="" />
            <p>Limpieza de Inyectores de Alta precisión</p>
          </div>
          <div className="section-form-avanzado">
            <div className="inputs-section">
              <div className="container-cantidad">
                <p>Cantidad</p>
                <input type="text" />
              </div>
              <div className="container-costo">
                <p>Costo</p>
                <input type="text" />
              </div>
            </div>
            <div className="confirmation-insection">
              <img src="CotizadorAvanzado/+.svg" alt="" />
            </div>
          </div>
        </div>

        {/* Cotizador Aceite */}
        <div className="form-input-cotizador">
          <div className="title-product">
            <img src="CotizadorAvanzado/AfinacionBasica/aceite.svg" alt="" />
            <p>Aceite</p>
          </div>
          <div className="section-form-avanzado">
            <div className="inputs-section">
              <div className="container-cantidad">
                <p>Cantidad</p>
                <input type="text" />
              </div>
              <div className="container-marca">
                <p>Marca</p>
                <input type="text" />
              </div>
              <div className="container-costo">
                <p>Costo</p>
                <input type="text" />
              </div>
              <div className="container-tipo">
                <p>Tipo</p>
                <input type="text" />
              </div>
            </div>
            <div className="confirmation-insection">
              <img src="CotizadorAvanzado/+.svg" alt="" />
            </div>
          </div>
        </div>

        {/* Cotizador Químicos High Performance */}
        <div className="form-input-cotizador">
          <div className="title-product">
            <img
              src="CotizadorAvanzado/AfinacionBasica/quimicos_high.svg"
              alt=""
            />
            <p>Químicos Hight Performance</p>
          </div>
          <div className="section-form-avanzado">
            <div className="inputs-section">
              <div className="container-cantidad">
                <p>Cantidad</p>
                <input type="text" />
              </div>
              <div className="container-marca">
                <p>Marca</p>
                <input type="text" />
              </div>
              <div className="container-costo">
                <p>Costo</p>
                <input type="text" />
              </div>
              <div className="container-tipo">
                <p>Tipo</p>
                <input type="text" />
              </div>
            </div>
            <div className="confirmation-insection">
              <img src="CotizadorAvanzado/+.svg" alt="" />
            </div>
          </div>
        </div>

        {/* Cotizador Sistema de refrigeración */}
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
                <input type="text" />
              </div>
              <div className="container-marca">
                <p>Marca</p>
                <input type="text" />
              </div>
              <div className="container-costo">
                <p>Costo</p>
                <input type="text" />
              </div>
              <div className="container-tipo">
                <p>Tipo</p>
                <input type="text" />
              </div>
            </div>
            <div className="confirmation-insection">
              <img src="CotizadorAvanzado/+.svg" alt="" />
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
            <p>Limpieza de Parabrisass</p>
          </div>
          <div className="section-form-avanzado">
            <div className="inputs-section">
              <div className="container-cantidad">
                <p>Cantidad</p>
                <input type="text" />
              </div>
              <div className="container-costo">
                <p>Costo</p>
                <input type="text" />
              </div>
            </div>
            <div className="confirmation-insection">
              <img src="CotizadorAvanzado/+.svg" alt="" />
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
            <p>Revisión & Calibración de Chisgeteros</p>
          </div>
          <div className="section-form-avanzado">
            <div className="inputs-section">
              <div className="container-cantidad">
                <p>Cantidad</p>
                <input type="text" />
              </div>
              <div className="container-costo">
                <p>Costo</p>
                <input type="text" />
              </div>
            </div>
            <div className="confirmation-insection">
              <img src="CotizadorAvanzado/+.svg" alt="" />
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
                <input type="text" />
              </div>
              <div className="container-marca">
                <p>Marca</p>
                <input type="text" />
              </div>
              <div className="container-costo">
                <p>Costo</p>
                <input type="text" />
              </div>
              <div className="container-tipo">
                <p>Tipo</p>
                <input type="text" />
              </div>
            </div>
            <div className="confirmation-insection">
              <img src="CotizadorAvanzado/+.svg" alt="" />
            </div>
          </div>
        </div>

        {/* Revisión de Luces (Exteriores) */}
        <div className="form-input-cotizador">
          <div className="title-product">
            <img src="CotizadorAvanzado/AfinacionBasica/luces.svg" alt="" />
            <p>Revisión de Luces(Exteriores)</p>
          </div>
          <div className="section-form-avanzado">
            <div className="inputs-section">
              <div className="container-cantidad">
                <p>Cantidad</p>
                <input type="text" />
              </div>
              <div className="container-costo">
                <p>Costo</p>
                <input type="text" />
              </div>
            </div>
            <div className="confirmation-insection">
              <img src="CotizadorAvanzado/+.svg" alt="" />
            </div>
          </div>
        </div>

        {/* Revisión de Luces (Interiores) */}
        <div className="form-input-cotizador">
          <div className="title-product">
            <img src="CotizadorAvanzado/AfinacionBasica/luces.svg" alt="" />
            <p>Revisión de Luces(Interiores)</p>
          </div>
          <div className="section-form-avanzado">
            <div className="inputs-section">
              <div className="container-cantidad">
                <p>Cantidad</p>
                <input type="text" />
              </div>
              <div className="container-costo">
                <p>Costo</p>
                <input type="text" />
              </div>
            </div>
            <div className="confirmation-insection">
              <img src="CotizadorAvanzado/+.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
