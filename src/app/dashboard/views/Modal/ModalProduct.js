import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase';

export default function ModalProduct({ isOpen, onClose, orderId, onSaveProduct }) {
  const [productName, setProductName] = useState('');
  const [partUnitPrice, setPartUnitPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [taxRate, setTaxRate] = useState("16"); // Estado para el IVA

  const subtotal = partUnitPrice * quantity;
  const taxAmount = subtotal * (parseFloat(taxRate) / 100);
  const total = subtotal + taxAmount;

  // Restablecer los campos al abrir el modal
  useEffect(() => {
    if (isOpen) {
      setProductName('');
      setPartUnitPrice(0);
      setQuantity(1);
      setTaxRate("16");
      setSuggestions([]);
    }
  }, [isOpen]);

  // Cargar todos los productos una vez al montar el componente
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const productsRef = collection(db, 'productos');
        const querySnapshot = await getDocs(productsRef);
        const products = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllProducts(products);
        console.log('Productos cargados:', products.length);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };

    fetchAllProducts();
  }, []);

  const calculateRelevance = (productName, searchTerm) => {
    const index = productName.toLowerCase().indexOf(searchTerm.toLowerCase());
    if (index === -1) return -1;
    return (searchTerm.length / productName.length) + (1 / (index + 1));
  };

  const filterProducts = (searchTerm) => {
    console.log('Buscando sugerencias para:', searchTerm);
    if (!searchTerm) {
      setSuggestions([]);
      return;
    }

    const filteredSuggestions = allProducts
      .map((product) => ({
        ...product,
        relevance: calculateRelevance(product.id, searchTerm),
      }))
      .filter((product) => product.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 15);

    setSuggestions(filteredSuggestions);
    console.log('Sugerencias obtenidas:', filteredSuggestions);
  };

  const handleProductNameChange = (e) => {
    const value = e.target.value;
    console.log('Valor ingresado:', value);
    setProductName(value);

    if (debounceTimeout) clearTimeout(debounceTimeout);

    if (value.endsWith(' ') || value.split(' ').length > 1) {
      const newTimeout = setTimeout(() => {
        const lastWord = value.trim().split(' ').pop();
        filterProducts(lastWord);
      }, 300);

      setDebounceTimeout(newTimeout);
    }
  };

  const handleSave = () => {
    const newProduct = {
      inspectionItemName: productName,
      partUnitPrice: parseFloat(partUnitPrice),
      quantity: parseInt(quantity),
      taxAmount: taxAmount.toFixed(2),
      subtotal: subtotal.toFixed(2),
      impuestos: taxRate.toString(),
    };
    onSaveProduct(orderId, newProduct);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modalProduct">
      <div className="modal-content">
        <h2>Agregar Producto</h2>
        <div className='name-product' style={{ position: 'relative' }}>
          <label>Nombre del Producto</label>
          <input
            type="text"
            value={productName}
            onChange={handleProductNameChange}
          />
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => {
                    console.log('Sugerencia seleccionada:', suggestion);
                    setProductName(suggestion.id);
                    setPartUnitPrice(suggestion.partUnitPrice || 0);
                    setSuggestions([]);
                  }}
                >
                  {suggestion.id}
                </li>
              ))}
            </ul>
          )}
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
          <label>IVA:</label>
          <select
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
          >
            <option value="16">16%</option>
            <option value="0">0%</option>
          </select>
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
