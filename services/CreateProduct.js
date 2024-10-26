import { doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

// Función para generar SKU aleatorio
const generateSKU = (productName) => {
  const prefix = productName.slice(0, 2).toUpperCase();
  const randomNumber = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}${randomNumber}`;
};

// Función para crear un producto
export const createProduct = async (productData, userEmail) => {
  const {
    nombreProducto,
    categoria,
    rama,
    subCat1,
    subCat2,
    subCat3,
    tipo,
    unidadMedida,
  } = productData;

  try {
    // Definir el nombre del documento como el nombre del producto
    const productRef = doc(db, "productos", nombreProducto);

    // Crear el objeto del producto
    const newProduct = {
      Categoria: categoria,
      Costo: 0, // Valor predeterminado
      "Nombre del Producto": nombreProducto,
      SKU: generateSKU(nombreProducto),
      "Sub Cat 1": subCat1,
      "Sub Cat 2": subCat2,
      "Sub Cat 3": subCat3,
      Tipo: tipo,
      cantidad_compras: 0, // Valor predeterminado
      fecha_uso: null, // Valor predeterminado
      fecha_creación: new Date(),
      usuario_creación: userEmail,
      Rama: rama,
      "Unidad Medida": unidadMedida,
    };

    // Guardar el producto en Firestore
    await setDoc(productRef, newProduct);
    console.log("Producto creado exitosamente:", nombreProducto);
    return true;
  } catch (error) {
    console.error("Error al crear el producto:", error);
    return false;
  }
};
