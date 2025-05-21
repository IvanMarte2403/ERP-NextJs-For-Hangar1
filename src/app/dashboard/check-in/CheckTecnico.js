"use client";

import React, { useState, useEffect, useCallback } from "react";
import { saveCheckTecnicoForms } from "../../../../services/CheckTecnico/saveCheckTecnicoForms";
import { getCheckTecnicoForms } from "../../../../services/CheckTecnico/getCheckTecnicoForms";

export default function CheckTecnico({ orderId }) {
  /* ─── Estados auxiliares ─── */
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  /* ─── Utilidades DOM ─── */
  const qs = (sel, el = document) => el.querySelector(sel);
  const qsa = (sel, el = document) => Array.from(el.querySelectorAll(sel));

  /* ─── Registrar clics en los semáforos ─── */
  const attachSemaforoListeners = useCallback(() => {
    qsa(".container-semaforo img").forEach((img, idx) => {
      img.addEventListener("click", () => {
        const container = img.closest(".input-check");
        if (!container) return;
        container.dataset.status = idx; // 0, 1, 2
        qsa(".container-semaforo img", container).forEach((sib, i) => {
          sib.style.opacity = i === idx ? 1 : 0.4;
        });
      });
    });
  }, []);

  /* ─── Obtener y rellenar formularios ─── */
  const populateForms = useCallback(async () => {
    try {
      const { forms = [] } = await getCheckTecnicoForms(orderId);
      if (!forms.length) return;

      const latest = {};
      forms.forEach((f) => {
        if (
          !latest[f.form_name] ||
          new Date(f.date) > new Date(latest[f.form_name].date)
        ) {
          latest[f.form_name] = f;
        }
      });

      qsa(".input-check").forEach((ic) => {
        const name = qs(".title h1", ic)?.textContent.trim();
        const data = latest[name];
        if (!data) return;

        qs(".container-cantidad input", ic).value = data.quantity;
        qs(".input-text input", ic).value = data.car_section;
        ic.dataset.status = data.status;

        qsa(".container-semaforo img", ic).forEach((img, i) => {
          img.style.opacity = i === data.status ? 1 : 0.4;
        });

        const addImg = qs(".container-add img", ic);
        if (addImg) addImg.src = "check_tecnico/check.svg";
      });
    } catch (err) {
      console.error("[populateForms] Error:", err);
    }
  }, [orderId]);

  /* ─── Efectos ─── */
  useEffect(() => {
    attachSemaforoListeners();
    populateForms();
  }, [attachSemaforoListeners, populateForms]);

  /* ─── Guardar datos ─── */
  const handleGuardar = async () => {
    try {
      setSaving(true);
      setSaveMessage("");

      const forms = qsa(".input-check").map((ic) => ({
        form_name: qs(".title h1", ic)?.textContent.trim() || "",
        quantity: Number(qs(".container-cantidad input", ic)?.value) || 0,
        car_section: qs(".input-text input", ic)?.value.trim() || "",
        status: ic.dataset.status ? Number(ic.dataset.status) : null,
        link_storage: "",
        notes: "",
        date: new Date().toISOString(),
      }));

      const valid = forms.filter(
        (f) => f.form_name && f.car_section && f.quantity > 0 && f.status !== null
      );

      console.log("[handleGuardar] validForms:", valid);

      if (!valid.length) {
        setSaveMessage(
          "Completa al menos un formulario con Lugar, Cantidad y Estatus."
        );
        return;
      }

      await saveCheckTecnicoForms(orderId, valid);
      setSaveMessage("Datos guardados correctamente.");
      await populateForms(); // refrescar vista
    } catch (err) {
      console.error("[handleGuardar] Error:", err);
      setSaveMessage(err.message || "Error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  /* ─── UI Completa ─── */
  return (
    <div className="check-tecnico-container">
      {/* Check Forms */}
      <div className="container-check-main">
        {/* Forms Check - Turbo Paint */}
        <div className="container-forms">
          {/* Container Forms */}
          <div className="container-form">
            {/* Title */}
            <div className="container-title">
              <h1>Turbo Paint</h1>
            </div>

            <div className="container-inputs">
              <div className="row-inputs">
                {/* Input - Fascia*/}
                <div className="input-check">
                  {/* Title */}
                  <div className="title">
                    <img src="check_tecnico/iconos/title-icon-1.svg" alt="" />
                    <h1>Fascias</h1>
                  </div>
                  {/* Cube Check */}
                  <div className="container-cube-check">
                    <div className="container-check">
                      {/* Input Text */}
                      <div className="input-text">
                        <p>Lugar</p>
                        <input type="text" />
                        <div className="container-semaforo">
                          <img src="check_tecnico/semaforo/red.svg" alt="" />
                          <img src="check_tecnico/semaforo/yellow.svg" alt="" />
                          <img src="check_tecnico/semaforo/green.svg" alt="" />
                        </div>
                      </div>
                      {/* Cantidad Input */}
                      <div className="container-cantidad">
                        <p>Cantidad</p>
                        <input type="text" />
                      </div>
                      {/* Cantidad + */}
                      <div className="container-add">
                        <img src="check_tecnico/add.svg" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Input - Rines*/}
                <div className="input-check">
                  {/* Title */}
                  <div className="title">
                    <img src="check_tecnico/iconos/title-icon-1.svg" alt="" />
                    <h1>Rines</h1>
                  </div>
                  {/* Cube Check */}
                  <div className="container-cube-check">
                    <div className="container-check">
                      <div className="input-text">
                        <p>Lugar</p>
                        <input type="text" />
                        <div className="container-semaforo">
                          <img src="check_tecnico/semaforo/red.svg" alt="" />
                          <img src="check_tecnico/semaforo/yellow.svg" alt="" />
                          <img src="check_tecnico/semaforo/green.svg" alt="" />
                        </div>
                      </div>
                      <div className="container-cantidad">
                        <p>Cantidad</p>
                        <input type="text" />
                      </div>
                      <div className="container-add">
                        <img src="check_tecnico/add.svg" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Piezas Extras*/}
                <div className="input-check">
                  {/* Title */}
                  <div className="title">
                    <img src="check_tecnico/iconos/title-icon-1.svg" alt="" />
                    <h1>Piezas Extras</h1>
                  </div>
                  {/* Cube Check */}
                  <div className="container-cube-check">
                    <div className="container-check">
                      <div className="input-text">
                        <p>Lugar</p>
                        <input type="text" />
                        <div className="container-semaforo">
                          <img src="check_tecnico/semaforo/red.svg" alt="" />
                          <img src="check_tecnico/semaforo/yellow.svg" alt="" />
                          <img src="check_tecnico/semaforo/green.svg" alt="" />
                        </div>
                      </div>
                      <div className="container-cantidad">
                        <p>Cantidad</p>
                        <input type="text" />
                      </div>
                      <div className="container-add">
                        <img src="check_tecnico/add.svg" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revisión Servicio*/}
        <div className="container-forms">
          <div className="container-form">
            {/* Title */}
            <div className="container-title">
              <h1>Revisión & Servicio</h1>
            </div>

            <div className="container-inputs">
              {/* Row Input 1 */}
              <div className="row-inputs">
                {/* Input - Bujías*/}
                <div className="input-check">
                  {/* Title */}
                  <div className="title">
                    <img src="check_tecnico/iconos/title-icon-1.svg" alt="" />
                    <h1>Bujías</h1>
                  </div>
                  {/* Cube Check */}
                  <div className="container-cube-check">
                    <div className="container-check">
                      <div className="input-text">
                        <p>Lugar</p>
                        <input type="text" />
                        <div className="container-semaforo">
                          <img src="check_tecnico/semaforo/red.svg" alt="" />
                          <img src="check_tecnico/semaforo/yellow.svg" alt="" />
                          <img src="check_tecnico/semaforo/green.svg" alt="" />
                        </div>
                      </div>
                      <div className="container-cantidad">
                        <p>Cantidad</p>
                        <input type="text" />
                      </div>
                      <div className="container-add">
                        <img src="check_tecnico/add.svg" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Input - Filtros de Aire*/}
                <div className="input-check">
                  <div className="title">
                    <img src="check_tecnico/iconos/title-icon-1.svg" alt="" />
                    <h1>Filtros de Aire</h1>
                  </div>
                  <div className="container-cube-check">
                    <div className="container-check">
                      <div className="input-text">
                        <p>Lugar</p>
                        <input type="text" />
                        <div className="container-semaforo">
                          <img src="check_tecnico/semaforo/red.svg" alt="" />
                          <img src="check_tecnico/semaforo/yellow.svg" alt="" />
                          <img src="check_tecnico/semaforo/green.svg" alt="" />
                        </div>
                      </div>
                      <div className="container-cantidad">
                        <p>Cantidad</p>
                        <input type="text" />
                      </div>
                      <div className="container-add">
                        <img src="check_tecnico/add.svg" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Refrigerante/Anticongelante*/}
                <div className="input-check">
                  <div className="title">
                    <img src="check_tecnico/iconos/title-icon-1.svg" alt="" />
                    <h1>Refrigerante/Anticongelante</h1>
                  </div>
                  <div className="container-cube-check">
                    <div className="container-check">
                      <div className="input-text">
                        <p>Lugar</p>
                        <input type="text" />
                        <div className="container-semaforo">
                          <img src="check_tecnico/semaforo/red.svg" alt="" />
                          <img src="check_tecnico/semaforo/yellow.svg" alt="" />
                          <img src="check_tecnico/semaforo/green.svg" alt="" />
                        </div>
                      </div>
                      <div className="container-cantidad">
                        <p>Cantidad</p>
                        <input type="text" />
                      </div>
                      <div className="container-add">
                        <img src="check_tecnico/add.svg" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row Input 2 */}
              <div className="row-inputs">
                {/* Input - Plumas Limpiaparabrisas*/}
                <div className="input-check">
                  <div className="title">
                    <img src="check_tecnico/iconos/title-icon-1.svg" alt="" />
                    <h1>Plumas LimpiaParabrisas </h1>
                  </div>
                  <div className="container-cube-check">
                    <div className="container-check">
                      <div className="input-text">
                        <p>Lugar</p>
                        <input type="text" />
                        <div className="container-semaforo">
                          <img src="check_tecnico/semaforo/red.svg" alt="" />
                          <img src="check_tecnico/semaforo/yellow.svg" alt="" />
                          <img src="check_tecnico/semaforo/green.svg" alt="" />
                        </div>
                      </div>
                      <div className="container-cantidad">
                        <p>Cantidad</p>
                        <input type="text" />
                      </div>
                      <div className="container-add">
                        <img src="check_tecnico/add.svg" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Input - Líquido Limpiaparabrisas*/}
                <div className="input-check">
                  <div className="title">
                    <img src="check_tecnico/iconos/title-icon-1.svg" alt="" />
                    <h1>Líquido Limpiaparabrisas</h1>
                  </div>
                  <div className="container-cube-check">
                    <div className="container-check">
                      <div className="input-text">
                        <p>Lugar</p>
                        <input type="text" />
                        <div className="container-semaforo">
                          <img src="check_tecnico/semaforo/red.svg" alt="" />
                          <img src="check_tecnico/semaforo/yellow.svg" alt="" />
                          <img src="check_tecnico/semaforo/green.svg" alt="" />
                        </div>
                      </div>
                      <div className="container-cantidad">
                        <p>Cantidad</p>
                        <input type="text" />
                      </div>
                      <div className="container-add">
                        <img src="check_tecnico/add.svg" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Bandas*/}
                <div className="input-check">
                  <div className="title">
                    <img src="check_tecnico/iconos/title-icon-1.svg" alt="" />
                    <h1>Bandas</h1>
                  </div>
                  <div className="container-cube-check">
                    <div className="container-check">
                      <div className="input-text">
                        <p>Lugar</p>
                        <input type="text" />
                        <div className="container-semaforo">
                          <img src="check_tecnico/semaforo/red.svg" alt="" />
                          <img src="check_tecnico/semaforo/yellow.svg" alt="" />
                          <img src="check_tecnico/semaforo/green.svg" alt="" />
                        </div>
                      </div>
                      <div className="container-cantidad">
                        <p>Cantidad</p>
                        <input type="text" />
                      </div>
                      <div className="container-add">
                        <img src="check_tecnico/add.svg" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row Input 3 */}
              <div className="row-inputs">
                {/* Input Mangueras*/}
                <div className="input-check">
                  <div className="title">
                    <img src="check_tecnico/iconos/title-icon-1.svg" alt="" />
                    <h1>Mangueras</h1>
                  </div>
                  <div className="container-cube-check">
                    <div className="container-check">
                      <div className="input-text">
                        <p>Lugar</p>
                        <input type="text" />
                        <div className="container-semaforo">
                          <img src="check_tecnico/semaforo/red.svg" alt="" />
                          <img src="check_tecnico/semaforo/yellow.svg" alt="" />
                          <img src="check_tecnico/semaforo/green.svg" alt="" />
                        </div>
                      </div>
                      <div className="container-cantidad">
                        <p>Cantidad</p>
                        <input type="text" />
                      </div>
                      <div className="container-add">
                        <img src="check_tecnico/add.svg" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Frenos*/}
        <div className="container-forms">
          <div className="container-form">
            {/* Title */}
            <div className="container-title">
              <h1>Frenos</h1>
            </div>

            <div className="container-inputs">
              {/* Row Input 1 */}
              <div className="row-inputs">
                {/* Input - Balatas*/}
                <div className="input-check">
                  <div className="title">
                    <img src="check_tecnico/iconos/title-icon-1.svg" alt="" />
                    <h1>Balatas</h1>
                  </div>
                  <div className="container-cube-check">
                    <div className="container-check">
                      <div className="input-text">
                        <p>Lugar</p>
                        <input type="text" />
                        <div className="container-semaforo">
                          <img src="check_tecnico/semaforo/red.svg" alt="" />
                          <img src="check_tecnico/semaforo/yellow.svg" alt="" />
                          <img src="check_tecnico/semaforo/green.svg" alt="" />
                        </div>
                      </div>
                      <div className="container-cantidad">
                        <p>Cantidad</p>
                        <input type="text" />
                      </div>
                      <div className="container-add">
                        <img src="check_tecnico/add.svg" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Input - Discos*/}
                <div className="input-check">
                  <div className="title">
                    <img src="check_tecnico/iconos/title-icon-1.svg" alt="" />
                    <h1>Discos</h1>
                  </div>
                  <div className="container-cube-check">
                    <div className="container-check">
                      <div className="input-text">
                        <p>Lugar</p>
                        <input type="text" />
                        <div className="container-semaforo">
                          <img src="check_tecnico/semaforo/red.svg" alt="" />
                          <img src="check_tecnico/semaforo/yellow.svg" alt="" />
                          <img src="check_tecnico/semaforo/green.svg" alt="" />
                        </div>
                      </div>
                      <div className="container-cantidad">
                        <p>Cantidad</p>
                        <input type="text" />
                      </div>
                      <div className="container-add">
                        <img src="check_tecnico/add.svg" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Líquido de Frenos */}
                <div className="input-check">
                  <div className="title">
                    <img src="check_tecnico/iconos/title-icon-1.svg" alt="" />
                    <h1>Líquido de Frenos</h1>
                  </div>
                  <div className="container-cube-check">
                    <div className="container-check">
                      <div className="input-text">
                        <p>Lugar</p>
                        <input type="text" />
                        <div className="container-semaforo">
                          <img src="check_tecnico/semaforo/red.svg" alt="" />
                          <img src="check_tecnico/semaforo/yellow.svg" alt="" />
                          <img src="check_tecnico/semaforo/green.svg" alt="" />
                        </div>
                      </div>
                      <div className="container-cantidad">
                        <p>Cantidad</p>
                        <input type="text" />
                      </div>
                      <div className="container-add">
                        <img src="check_tecnico/add.svg" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Suspensión*/}
        <div className="container-forms">
          <div className="container-form">
            {/* Title */}
            <div className="container-title">
              <h1>Suspensión</h1>
            </div>

            <div className="container-inputs">
              {/* Row Input 1 */}
              <div className="row-inputs">
                {/* Input - Amortiguadores*/}
                <div className="input-check">
                  <div className="title">
                    <img src="check_tecnico/iconos/title-icon-1.svg" alt="" />
                    <h1>Amortiguadores</h1>
                  </div>
                  <div className="container-cube-check">
                    <div className="container-check">
                      <div className="input-text">
                        <p>Lugar</p>
                        <input type="text" />
                        <div className="container-semaforo">
                          <img src="check_tecnico/semaforo/red.svg" alt="" />
                          <img src="check_tecnico/semaforo/yellow.svg" alt="" />
                          <img src="check_tecnico/semaforo/green.svg" alt="" />
                        </div>
                      </div>
                      <div className="container-cantidad">
                        <p>Cantidad</p>
                        <input type="text" />
                      </div>
                      <div className="container-add">
                        <img src="check_tecnico/add.svg" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Input - Partes de Suspensión y Dirección*/}
                <div className="input-check">
                  <div className="title">
                    <img src="check_tecnico/iconos/title-icon-1.svg" alt="" />
                    <h1>Partes de Suspensión y Dirección</h1>
                  </div>
                  <div className="container-cube-check">
                    <div className="container-check">
                      <div className="input-text">
                        <p>Lugar</p>
                        <input type="text" />
                        <div className="container-semaforo">
                          <img src="check_tecnico/semaforo/red.svg" alt="" />
                          <img src="check_tecnico/semaforo/yellow.svg" alt="" />
                          <img src="check_tecnico/semaforo/green.svg" alt="" />
                        </div>
                      </div>
                      <div className="container-cantidad">
                        <p>Cantidad</p>
                        <input type="text" />
                      </div>
                      <div className="container-add">
                        <img src="check_tecnico/add.svg" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Neumáticos*/}
        <div className="container-forms">
          <div className="container-form">
            {/* Title */}
            <div className="container-title">
              <h1>Neumáticos</h1>
            </div>

            <div className="container-inputs">
              {/* Row Input 1 */}
              <div className="row-inputs">
                {/* Input - Neumáticos*/}
                <div className="input-check">
                  <div className="title">
                    <img src="check_tecnico/iconos/title-icon-1.svg" alt="" />
                    <h1>Neumáticos</h1>
                  </div>
                  <div className="container-cube-check">
                    <div className="container-check">
                      <div className="input-text">
                        <p>Lugar</p>
                        <input type="text" />
                        <div className="container-semaforo">
                          <img src="check_tecnico/semaforo/red.svg" alt="" />
                          <img src="check_tecnico/semaforo/yellow.svg" alt="" />
                          <img src="check_tecnico/semaforo/green.svg" alt="" />
                        </div>
                      </div>
                      <div className="container-cantidad">
                        <p>Cantidad</p>
                        <input type="text" />
                      </div>
                      <div className="container-add">
                        <img src="check_tecnico/add.svg" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Extras*/}
        <div className="container-forms">
          <div className="container-form">
            {/* Title */}
            <div className="container-title">
              <h1>Extras</h1>
            </div>

            <div className="container-inputs">
              {/* Row Input 1 */}
              <div className="row-inputs">
                {/* Input - Extras*/}
                <div className="input-check">
                  <div className="title">
                    <img src="check_tecnico/iconos/title-icon-1.svg" alt="" />
                    <h1>Extras</h1>
                  </div>
                  <div className="container-cube-check">
                    <div className="container-check">
                      <div className="input-text">
                        <p>Lugar</p>
                        <input type="text" />
                        <div className="container-semaforo">
                          <img src="check_tecnico/semaforo/red.svg" alt="" />
                          <img src="check_tecnico/semaforo/yellow.svg" alt="" />
                          <img src="check_tecnico/semaforo/green.svg" alt="" />
                        </div>
                      </div>
                      <div className="container-cantidad">
                        <p>Cantidad</p>
                        <input type="text" />
                      </div>
                      <div className="container-add">
                        <img src="check_tecnico/add.svg" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botón Guardar */}
      <div className="container-check-button">
        <button onClick={handleGuardar} disabled={saving}>
          {saving ? "Guardando…" : "Guardar"}
        </button>
        {saveMessage && <p className="save-message">{saveMessage}</p>}
      </div>
    </div>
  );
}
