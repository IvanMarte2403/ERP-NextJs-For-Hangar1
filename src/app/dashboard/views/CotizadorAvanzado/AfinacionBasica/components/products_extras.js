// CotizadorAvanzado/AfinacionBasica/components/products_extras.js

/* Los objetos con { divider: true } generan una línea separadora <hr>. */
export const extrasProducts = [
  // Bloque principal de extras básicos
  {
    key: "bateria_acumulador",
    name: "Batería(s) / Acumulador(es)",
    icon: "CotizadorAvanzado/AfinacionBasica/engrane.svg",
    apiId: "CAP0993",
    fields: ["cantidad", "tipo", "marca", "costo"],
  },
  {
    key: "plumas_lim",
    name: "Pluma(s) Limpiaparabrisas",
    icon: "CotizadorAvanzado/AfinacionBasica/luces.svg",
    apiId: "CAP0993",
    fields: ["cantidad", "tipo", "subtipo", "marca", "costo"],
  },
  {
    key: "rev_chisgueteros",
    name: "Revisión & Calibración de chisgueteros",
    icon: "CotizadorAvanzado/AfinacionBasica/chisgeteros.svg",
    fields: ["cantidad", "costo"],
  },
  {
    key: "quimico_parabrisas",
    name: "Químico(s) Alto Rendimiento Parabrisas",
    icon: "CotizadorAvanzado/AfinacionBasica/quimicos_high.svg",
    apiId: "CAP5788",
    fields: ["cantidad", "marca", "costo"],
  },

  /* ---------- Separación 1 ---------- */
  { divider: true },

  // Grupo 1
  {
    key: "kit_focos",
    name: "Kit(s) de Focos",
    icon: "CotizadorAvanzado/AfinacionBasica/luces.svg",
    apiId: "CAP8482",
    fields: ["cantidad", "tipo", "marca", "costo"],
  },
  {
    key: "balastra",
    name: "Balastra",
    icon: "CotizadorAvanzado/AfinacionBasica/luces.svg",
    apiId: "CAP0478",
    fields: ["cantidad", "marca", "costo"],
  },
  {
    key: "fusible",
    name: "Fusible(s)",
    icon: "CotizadorAvanzado/AfinacionBasica/luces.svg",
    apiId: "CAP0905",
    fields: ["cantidad", "tipo", "marca", "costo"],
  },
  {
    key: "ecu",
    name: "Computadora ECU",
    icon: "CotizadorAvanzado/AfinacionBasica/engrane.svg",
    apiId: "CAP8010",
    fields: ["cantidad", "marca", "costo"],
  },
  {
    key: "cuerpo_aceleracion",
    name: "Cuerpo de Aceleración",
    icon: "CotizadorAvanzado/AfinacionBasica/engrane.svg",
    apiId: "CAP3533",
    fields: ["cantidad", "marca", "costo"],
  },
  {
    key: "rect_embrague_clutch",
    name: "Rectificado de Embrague/Clutch",
    icon: "CotizadorAvanzado/AfinacionBasica/engrane.svg",
    apiId: "CAP3145",
    fields: ["cantidad", "costo"],
  },
  {
    key: "rect_vol_clutch",
    name: "Rectificado de Volante Embrague/Clutch",
    icon: "CotizadorAvanzado/AfinacionBasica/engrane.svg",
    apiId: "CAP2209",
    fields: ["cantidad", "costo"],
  },

  /* ---------- Separación 2 ---------- */
  { divider: true },

  // Grupo 2
  {
    key: "refrigerante_motor",
    name: "Refrigerante de Motor",
    icon: "CotizadorAvanzado/AfinacionBasica/quimicos_high.svg",
    apiId: "CAP2595",
    fields: ["cantidad", "tipo", "marca", "costo"],
  },
  {
    key: "aceite_diferencial",
    name: "Aceite de Diferencial",
    icon: "CotizadorAvanzado/AfinacionBasica/aceite.svg",
    apiId: "CAP9058",
    fields: ["cantidad", "marca", "costo"],
  },
  {
    key: "aceite_transmision",
    name: "Aceite de Transmisión",
    icon: "CotizadorAvanzado/AfinacionBasica/aceite.svg",
    apiId: "CAP3971",
    fields: ["cantidad", "tipo", "marca", "costo"],
  },
  {
    key: "aceite_direccion",
    name: "Aceite de Dirección Hidráulica",
    icon: "CotizadorAvanzado/AfinacionBasica/aceite.svg",
    apiId: "CAP4379",
    fields: ["cantidad", "marca", "costo"],
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
    fields: ["cantidad", "tipo", "subtipo", "marca", "costo"],
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
    fields: ["cantidad", "costo"],
  },
  {
    key: "compresor_ac",
    name: "Compresor de aire acondicionado",
    icon: "CotizadorAvanzado/AfinacionBasica/quimicos_high.svg",
    fields: ["cantidad", "costo"],
  },
  {
    key: "carga_ac",
    name: "Carga aire acondicionado",
    icon: "CotizadorAvanzado/AfinacionBasica/quimicos_high.svg",
    fields: ["cantidad", "tipo", "costo"],
  },
  {
    key: "alternador",
    name: "Alternador",
    icon: "CotizadorAvanzado/AfinacionBasica/engrane.svg",
    fields: ["cantidad", "costo"],
  },
  {
    key: "marcha",
    name: "Marcha",
    icon: "CotizadorAvanzado/AfinacionBasica/engrane.svg",
    fields: ["cantidad", "costo"],
  },

  /* ---------- Separación 4 ---------- */
  { divider: true },

  // Grupo 4
  {
    key: "motor_ventilador",
    name: "Motor ventilador",
    icon: "CotizadorAvanzado/AfinacionBasica/quimicos_high.svg",
    fields: ["cantidad", "costo"],
  },
  {
    key: "bomba_agua",
    name: "Bomba de agua",
    icon: "CotizadorAvanzado/AfinacionBasica/quimicos_high.svg",
    fields: ["cantidad", "costo"],
  },
  {
    key: "tapa_term",
    name: "Tapa y termostato",
    icon: "CotizadorAvanzado/AfinacionBasica/quimicos_high.svg",
    fields: ["cantidad", "costo"],
  },
  {
    key: "termostato",
    name: "Termostato",
    icon: "CotizadorAvanzado/AfinacionBasica/quimicos_high.svg",
    fields: ["cantidad", "costo"],
  },
  {
    key: "manguera_refrig",
    name: "Manguera de sistema de refrigeración",
    icon: "CotizadorAvanzado/AfinacionBasica/quimicos_high.svg",
    fields: ["cantidad", "costo"],
  },
  {
    key: "tapon_dep_refrig",
    name: "Tapón depósito de refrigerante",
    icon: "CotizadorAvanzado/AfinacionBasica/quimicos_high.svg",
    fields: ["cantidad", "costo"],
  },
  {
    key: "deposito_refrig",
    name: "Depósito de refrigerante",
    icon: "CotizadorAvanzado/AfinacionBasica/quimicos_high.svg",
    fields: ["cantidad", "costo"],
  },
  {
    key: "tapas_radiador",
    name: "Tapas de radiador",
    icon: "CotizadorAvanzado/AfinacionBasica/quimicos_high.svg",
    fields: ["cantidad", "costo"],
  },
  {
    key: "tapon_radiador",
    name: "Tapón de radiador",
    icon: "CotizadorAvanzado/AfinacionBasica/quimicos_high.svg",
    fields: ["cantidad", "costo"],
  },

  /* ---------- Separación 5 ---------- */
  { divider: true },

  // Grupo 5
  {
    key: "banda_poliv",
    name: "Banda Poli V motor",
    icon: "CotizadorAvanzado/AfinacionBasica/quimicos_high.svg",
    fields: ["cantidad", "costo"],
  },
  {
    key: "polea_loca",
    name: "Polea loca",
    icon: "CotizadorAvanzado/AfinacionBasica/quimicos_high.svg",
    fields: ["cantidad", "costo"],
  },
  {
    key: "polea_tensora",
    name: "Polea tensora",
    icon: "CotizadorAvanzado/AfinacionBasica/quimicos_high.svg",
    fields: ["cantidad", "costo"],
  },
  {
    key: "banda_tiempo",
    name: "Banda de tiempo",
    icon: "CotizadorAvanzado/AfinacionBasica/quimicos_high.svg",
    fields: ["cantidad", "costo"],
  },

  /* ---------- Separación 6 ---------- */
  { divider: true },

  // Grupo 6
  {
    key: "banda_motor",
    name: "Banda motor",
    icon: "CotizadorAvanzado/AfinacionBasica/quimicos_high.svg",
    fields: ["cantidad", "costo"],
  },

  /* ---------- Separación 7 ---------- */
  { divider: true },

  // Grupo 7
  {
    key: "tapa_carter",
    name: "Tapa de cárter",
    icon: "CotizadorAvanzado/AfinacionBasica/engrane.svg",
    fields: ["cantidad", "costo"],
  },
  {
    key: "tornillo_carter",
    name: "Tornillo de cárter",
    icon: "CotizadorAvanzado/AfinacionBasica/engrane.svg",
    fields: ["cantidad", "costo"],
  },
  {
    key: "junta_carter",
    name: "Junta de cárter",
    icon: "CotizadorAvanzado/AfinacionBasica/engrane.svg",
    fields: ["cantidad", "costo"],
  },

  /* ---------- Separación 8 ---------- */
  { divider: true },

  // Grupo 8
  {
    key: "bobina_encendido",
    name: "Bobina de encendido",
    icon: "CotizadorAvanzado/AfinacionBasica/engrane.svg",
    fields: ["cantidad", "costo"],
  },

  /* ---------- Separación 9 ---------- */
  { divider: true },

  // Grupo 9
  {
    key: "cables_bujias",
    name: "Cables de bujías",
    icon: "CotizadorAvanzado/AfinacionBasica/bujias.svg",
    fields: ["cantidad", "tipo", "marca", "costo"],
  },
];
