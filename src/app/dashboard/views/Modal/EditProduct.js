import { useState, useEffect } from "react";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../../../../lib/firebase";

export default function ModalEditProduct({ isOpen, onClose, orderId, inspectionItems, setOrder }) {
  const [editedItems, setEditedItems] = useState([]);

  // Actualizar la lista de productos cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setEditedItems(inspectionItems);
    }
  }, [isOpen, inspectionItems]);

  // Función para manejar el cambio de campos
  const handleInputChange = (index, field, value) => {
    setEditedItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  // Función para calcular el subtotal basado en el impuesto y cantidad
  const calculateSubtotal = (item) => {
    const cost = parseFloat(item.partUnitPrice) || 0;
    const quantity = parseInt(item.quantity) || 0;
    const taxRate = item.impuestos === "16" ? 0.16 : 0; // Verificar el campo "impuestos"
    const subtotal = cost * quantity * (1 + taxRate);
    return subtotal.toFixed(2);
  };

  // Función para eliminar un producto de la lista
  const handleDeleteItem = (index) => {
    const updatedItems = editedItems.filter((_, i) => i !== index);
    setEditedItems(updatedItems);
  };

  // Función para guardar cambios en la base de datos
  // En EditProduct.js
const handleSaveChanges = async () => {
    try {
      const formattedItems = editedItems.map(item => ({
        inspectionItemName: item.inspectionItemName || '',
        partUnitPrice: parseFloat(item.partUnitPrice) || 0,
        quantity: parseInt(item.quantity) || 0,
        brand: item.brand || '',
        impuestos: item.impuestos || "0",
      }));
  
      const orderDocRef = doc(db, "orders", orderId.toString());
      await updateDoc(orderDocRef, { inspectionItems: formattedItems });
  
      // Actualiza el estado 'order' en 'OrderDetails.js'
      setOrder(prevOrder => ({ ...prevOrder, inspectionItems: formattedItems }));
  
      alert("Productos actualizados correctamente");
      onClose();
    } catch (error) {
      console.error("Error al actualizar productos:", error);
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="modal-edit-product">
      <div className="modal-content">
        <h2>Editar Productos</h2>
        <table className="table-order">
          <thead className="no-hover">
            <tr className="no-hover">
              <th>Producto</th>
              <th>Marca</th>
              <th>Costo</th>
              <th>Cantidad</th>
              <th>Impuestos</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {editedItems.map((item, index) => (
              <tr key={index}>
                <td>{item.inspectionItemName}</td>
                <td>
                  <input
                    type="text"
                    value={item.brand || ''}
                    onChange={(e) =>
                      handleInputChange(index, "brand", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.partUnitPrice || 0}
                    onChange={(e) =>
                      handleInputChange(index, "partUnitPrice", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.quantity || 0}
                    onChange={(e) =>
                      handleInputChange(index, "quantity", e.target.value)
                    }
                  />
                </td>
                <td>
                  <select
                    value={item.impuestos || "0"}
                    onChange={(e) => {
                      const newImpuestos = e.target.value;
                      handleInputChange(index, "impuestos", newImpuestos);
                    }}
                  >
                    <option value="0">0%</option>
                    <option value="16">16%</option>
                  </select>
                </td>
                <td>{calculateSubtotal(item)}</td>
                <td>
                  <button
                    onClick={() => handleDeleteItem(index)}
                    className="delete-button"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="modal-actions">
          <button onClick={onClose}>Cerrar</button>
          <button onClick={handleSaveChanges}>Guardar Cambios</button>
        </div>
      </div>
    </div>
  );
}
