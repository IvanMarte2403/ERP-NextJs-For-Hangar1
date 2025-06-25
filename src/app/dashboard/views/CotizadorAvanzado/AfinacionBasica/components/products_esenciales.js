// CotizadorAvanzado/AfinacionBasica/components/products_esenciales.js

export const esencialesProducts = [
  {
    key: "mano_obra",
    name: "Mano de Obra",
    icon: "CotizadorAvanzado/AfinacionBasica/engrane.svg",
    apiId: "CAP4761",
    fields: ["cantidad", "tipo", "marca", "costo"],
  },
  {
    key: "lavado_aspirado",
    name: "Lavado & Aspirado",
    icon: "CotizadorAvanzado/AfinacionBasica/bujias.svg",
    apiId: "CAP1936",
    fields: ["cantidad", "tipo", "costo"],
  },
  {
    key: "servicio_verificacion",
    name: "Llevado a verificar",
    icon: "CotizadorAvanzado/AfinacionBasica/engrane.svg",
    apiId: "CAP5300",
    fields: ["cantidad", "costo"],
  },
];
