// CotizadorAvanzado/AfinacionBasica/components/products_extras.js

/* Los objetos con { divider: true } generan una línea separadora <hr>. */
export const extrasProducts = [
  // Bloque principal de extras básicos
  {
    key: "plumas_lim",
    name: "Pluma(s) limpiaparabrisas",
    icon: "CotizadorAvanzado/AfinacionBasica/luces.svg",
    fields: ["cantidad", "marca", "costo", "tipo", "subtipo"],
  },
  {
    key: "rev_chisgueteros",
    name: "Revisión y recalibración de chisgueteros",
    icon: "CotizadorAvanzado/AfinacionBasica/chisgeteros.svg",
    fields: ["cantidad", "marca", "costo", "tipo"],
  },
  {
    key: "quimico_parabrisas",
    name: "Químico alto rendimiento parabrisas",
    icon: "CotizadorAvanzado/AfinacionBasica/quimicos_high.svg",
    fields: ["cantidad", "marca", "costo"],
  },

  /* ---------- Separación 1 ---------- */
  { divider: true },

  // Grupo 1
  {
    key: "kit_focos",
    name: "Kit de focos",
    icon: "CotizadorAvanzado/AfinacionBasica/luces.svg",
    fields: ["cantidad", "marca", "costo", "tipo"],
  },
  {
    key: "balastra",
    name: "Ballastra",
    icon: "CotizadorAvanzado/AfinacionBasica/luces.svg",
    fields: ["cantidad", "marca", "costo"],
  },
  {
    key: "fusible",
    name: "Fusible",
    icon: "CotizadorAvanzado/AfinacionBasica/luces.svg",
    fields: ["cantidad", "marca", "costo", "tipo"],
  },
  {
    key: "ecu",
    name: "Computadora ECU",
    icon: "CotizadorAvanzado/AfinacionBasica/engrane.svg",
    fields: ["cantidad", "marca", "costo"],
  },
  {
    key: "cuerpo_aceleracion",
    name: "Cuerpo de Aceleración",
    icon: "CotizadorAvanzado/AfinacionBasica/engrane.svg",
    fields: ["cantidad", "marca", "costo"],
  },
  {
    key: "rect_vol_clutch",
    name: "Rectificado de Volante Embrague/Clutch",
    icon: "CotizadorAvanzado/AfinacionBasica/engrane.svg",
    fields: ["cantidad", "marca", "costo"],
  },

  /* ---------- Separación 2 ---------- */
  { divider: true },

  // Grupo 2
  {
    key: "refrigerante_motor",
    name: "Refrigerante de motor",
    icon: "CotizadorAvanzado/AfinacionBasica/quimicos_high.svg",
    fields: ["cantidad", "marca", "costo", "tipo"],
  },
  {
    key: "aceite_diferencial",
    name: "Aceite de diferencial",
    icon: "CotizadorAvanzado/AfinacionBasica/aceite.svg",
    fields: ["cantidad", "marca", "costo"],
  },
  {
    key: "aceite_transmision",
    name: "Aceite de transmisión",
    icon: "CotizadorAvanzado/AfinacionBasica/aceite.svg",
    fields: ["cantidad", "marca", "costo", "tipo"],
  },
  {
    key: "embrague",
    name: "Embrague/Clutch",
    icon: "CotizadorAvanzado/AfinacionBasica/engrane.svg",
    fields: ["cantidad", "marca", "costo"],
  },
  {
    key: "mangueras",
    name: "Manguera(s)",
    icon: "CotizadorAvanzado/AfinacionBasica/quimicos_high.svg",
    fields: ["cantidad", "marca", "costo", "tipo", "subtipo"],
  },
  {
    key: "bomba_direccion",
    name: "Bomba de dirección hidráulica",
    icon: "CotizadorAvanzado/AfinacionBasica/engrane.svg",
    fields: ["cantidad", "marca", "costo"],
  },

  /* ---------- Separación 3 ---------- */
  { divider: true },

  // Grupo 3
  {
    key: "manguera_ac",
    name: "Manguera aire acondicionado",
    icon: "CotizadorAvanzado/AfinacionBasica/quimicos_high.svg",
    fields: ["cantidad", "marca", "costo"],
  },
  {
    key: "compresor_ac",
    name: "Compresor de aire acondicionado",
    icon: "CotizadorAvanzado/AfinacionBasica/quimicos_high.svg",
    fields: ["cantidad", "marca", "costo"],
  },
  {
    key: "carga_ac",
    name: "Carga aire acondicionado",
    icon: "CotizadorAvanzado/AfinacionBasica/quimicos_high.svg",
    fields: ["cantidad", "marca", "costo", "tipo"],
  },
  {
    key: "alternador",
    name: "Alternador",
    icon: "CotizadorAvanzado/AfinacionBasica/engrane.svg",
    fields: ["cantidad", "marca", "costo"],
  },
  {
    key: "marcha",
    name: "Marcha",
    icon: "CotizadorAvanzado/AfinacionBasica/engrane.svg",
    fields: ["cantidad", "marca", "costo"],
  },

  /* ---------- Separación 4 ---------- */
  { divider: true },

  // Grupo 4
  {
    key: "motor_ventilador",
    name: "Motor ventilador",
    icon: "CotizadorAvanzado/AfinacionBasica/quimicos_high.svg",
    fields: ["cantidad", "marca", "costo"],
  },
  {
    key: "bomba_agua",
    name: "Bomba de agua",
    icon: "CotizadorAvanzado/AfinacionBasica/quimicos_high.svg",
    fields: ["cantidad", "marca", "costo"],
  },
  {
    key: "tapa_term",
    name: "Tapa y termostato",
    icon: "CotizadorAvanzado/AfinacionBasica/quimicos_high.svg",
    fields: ["cantidad", "marca", "costo"],
  },
  {
    key: "termostato",
    name: "Termostato",
    icon: "CotizadorAvanzado/AfinacionBasica/quimicos_high.svg",
    fields: ["cantidad", "marca", "costo"],
  },
  {
    key: "manguera_refrig",
    name: "Manguera de sistema de refrigeración",
    icon: "CotizadorAvanzado/AfinacionBasica/quimicos_high.svg",
    fields: ["cantidad", "marca", "costo"],
  },
  {
    key: "tapon_dep_refrig",
    name: "Tapón depósito de refrigerante",
    icon: "CotizadorAvanzado/AfinacionBasica/quimicos_high.svg",
    fields: ["cantidad", "marca", "costo"],
  },
  {
    key: "deposito_refrig",
    name: "Depósito de refrigerante",
    icon: "CotizadorAvanzado/AfinacionBasica/quimicos_high.svg",
    fields: ["cantidad", "marca", "costo"],
  },
  {
    key: "tapas_radiador",
    name: "Tapas de radiador",
    icon: "CotizadorAvanzado/AfinacionBasica/quimicos_high.svg",
    fields: ["cantidad", "marca", "costo"],
  },
  {
    key: "tapon_radiador",
    name: "Tapón de radiador",
    icon: "CotizadorAvanzado/AfinacionBasica/quimicos_high.svg",
    fields: ["cantidad", "marca", "costo"],
  },

  /* ---------- Separación 5 ---------- */
  { divider: true },

  // Grupo 5
  {
    key: "banda_poliv",
    name: "Banda Poli V motor",
    icon: "CotizadorAvanzado/AfinacionBasica/quimicos_high.svg",
    fields: ["cantidad", "marca", "costo"],
  },
  {
    key: "polea_loca",
    name: "Polea loca",
    icon: "CotizadorAvanzado/AfinacionBasica/quimicos_high.svg",
    fields: ["cantidad", "marca", "costo"],
  },
  {
    key: "polea_tensora",
    name: "Polea tensora",
    icon: "CotizadorAvanzado/AfinacionBasica/quimicos_high.svg",
    fields: ["cantidad", "marca", "costo"],
  },
  {
    key: "banda_tiempo",
    name: "Banda de tiempo",
    icon: "CotizadorAvanzado/AfinacionBasica/quimicos_high.svg",
    fields: ["cantidad", "marca", "costo"],
  },

  /* ---------- Separación 6 ---------- */
  { divider: true },

  // Grupo 6
  {
    key: "banda_motor",
    name: "Banda motor",
    icon: "CotizadorAvanzado/AfinacionBasica/quimicos_high.svg",
    fields: ["cantidad", "marca", "costo"],
  },

  /* ---------- Separación 7 ---------- */
  { divider: true },

  // Grupo 7
  {
    key: "tapa_carter",
    name: "Tapa de cárter",
    icon: "CotizadorAvanzado/AfinacionBasica/engrane.svg",
    fields: ["cantidad", "marca", "costo"],
  },
  {
    key: "tornillo_carter",
    name: "Tornillo de cárter",
    icon: "CotizadorAvanzado/AfinacionBasica/engrane.svg",
    fields: ["cantidad", "marca", "costo"],
  },
  {
    key: "junta_carter",
    name: "Junta de cárter",
    icon: "CotizadorAvanzado/AfinacionBasica/engrane.svg",
    fields: ["cantidad", "marca", "costo"],
  },

  /* ---------- Separación 8 ---------- */
  { divider: true },

  // Grupo 8
  {
    key: "bobina_encendido",
    name: "Bobina de encendido",
    icon: "CotizadorAvanzado/AfinacionBasica/engrane.svg",
    fields: ["cantidad", "marca", "costo"],
  },

  /* ---------- Separación 9 ---------- */
  { divider: true },

  // Grupo 9
  {
    key: "cables_bujias",
    name: "Cables de bujías",
    icon: "CotizadorAvanzado/AfinacionBasica/bujias.svg",
    fields: ["cantidad", "marca", "costo", "tipo"],
  },
];
