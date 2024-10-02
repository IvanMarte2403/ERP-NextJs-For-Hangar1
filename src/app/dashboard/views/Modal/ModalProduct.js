import React, { useState } from 'react';

export default function ModalProduct({ isOpen, onClose, orderId, onSaveProduct }) {
  const [productName, setProductName] = useState('');
  const [partUnitPrice, setPartUnitPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const taxRate = 0.16;
  const subtotal = partUnitPrice * quantity;
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  const handleSave = () => {
    const newProduct = {
      inspectionItemName: productName,
      partUnitPrice: parseFloat(partUnitPrice),
      quantity: parseInt(quantity),
      taxAmount: taxAmount.toFixed(2),
      subtotal: subtotal.toFixed(2),
    };
    onSaveProduct(orderId, newProduct); // Guardar en Firebase
    onClose(); // Cerrar el modal
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modalProduct">
      <div className="modal-content">
        <h2>Agregar Producto</h2>
        <div className='name-product'>
          <label>Nombre del Producto</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>

        <div className='precio-cantidad'>
          <label>Precio Unitario</label>
          <input
            type="number"
            value={partUnitPrice}
            onChange={(e) => setPartUnitPrice(e.target.value)}
          />

        </div>

        <div className='cantidad'>
        <label>Cantidad</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
      


        <h3>Desglose del Total</h3>

        <div className='desgloce'>
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p>IVA (16%): ${taxAmount.toFixed(2)}</p>
          <p>Total: ${total.toFixed(2)}</p>
        </div>


        <div className="modal-actions">
          <button onClick={onClose}>Cancelar</button>
          <button onClick={handleSave}>Guardar</button>
        </div>
      </div>
    </div>
  );
}
