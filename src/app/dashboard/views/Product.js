import React, { useState } from 'react';
import { createProduct } from '../../../../services/CreateProduct';

export default function Products({ userEmail }) {
  const [nombreProducto, setNombreProducto] = useState('');         
  const [categoria, setCategoria] = useState('');
  const [rama, setRama] = useState('');
  const [subCat1, setSubCat1] = useState('');
  const [subCat2, setSubCat2] = useState('');
  const [subCat3, setSubCat3] = useState('');
  const [tipo, setTipo] = useState('');
  const [unidadMedida, setUnidadMedida] = useState('');
  const [descuento, setDescuento] = useState(0); // Estado para el descuento

  const handleSave = async () => {
    // Verificar si todos los campos están completos
    if (
      !nombreProducto ||
      !categoria ||
      !rama ||
      !subCat1 ||
      !subCat2 ||
      !subCat3 ||
      !tipo ||
      !unidadMedida
    ) {
      alert("Por favor, completa todos los campos antes de guardar.");
      return;
    }

    const productData = {
      nombreProducto,
      categoria,
      rama,
      subCat1,
      subCat2,
      subCat3,
      tipo,
      unidadMedida,
      descuento,
    };

    const isCreated = await createProduct(productData, userEmail);
    if (isCreated) {
      alert("Producto creado exitosamente");
      // Limpiar los campos después de guardar
      setNombreProducto('');
      setCategoria('');
      setRama('');
      setSubCat1('');
      setSubCat2('');
      setSubCat3('');
      setTipo('');
      setUnidadMedida('');
    } else {
      alert("Error al crear el producto");
    }
  };

  return (
    <div className="products-container">
      <h1>Añadir Producto</h1>

      <div className="container-forms-product">
        {/* Nombre & Categoria */}
        <div className="row-forms">
          <div className="input">
            <h3>Nombre Producto</h3>
            <input 
              type="text" 
              value={nombreProducto}
              onChange={(e) => setNombreProducto(e.target.value)}
            />
          </div>

          <div className="input">
            <h3>Categoría</h3>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              <option value="">Seleccionar</option>
              <option value="PERSONALIZACION">PERSONALIZACION</option>
              <option value="SEGURIDAD">SEGURIDAD</option>
              <option value="VELOCIDAD Y POTENCIA">VELOCIDAD Y POTENCIA</option>
            </select>
          </div>
        </div>

        {/* Rama & Sub Cat 1 */}
        <div className="row-forms">
          <div className="input">
            <h3>Rama</h3>
            <select value={rama} onChange={(e) => setRama(e.target.value)}>
              <option value="">Seleccionar</option>
              <option value="SPEEDCENTER">SPEEDCENTER</option>
              <option value="PROVEEDOR EXTERNO">PROVEEDOR EXTERNO</option>
              <option value="PRIMESERVICE">PRIMESERVICE</option>
              <option value="STYLE">STYLE</option>
            </select>
          </div>

          <div className="input">
            <h3>Sub Categoría 1</h3>
            <select value={subCat1} onChange={(e) => setSubCat1(e.target.value)}>
              <option value="">Seleccionar</option>
              <option value="FABRICACIÓN">FABRICACIÓN</option>
              <option value="IMPORTACIÓN">IMPORTACIÓN</option>
              <option value="MANO DE OBRA">MANO DE OBRA</option>
              <option value="VENTAS Y MANO DE OBRA">VENTAS Y MANO DE OBRA</option>
            </select>
          </div>
        </div>

        {/* Sub Cat 2 & Sub Cat 3 */}
        <div className="row-forms">
          <div className="input">
            <h3>Sub Categoría 2</h3>
            <select value={subCat2} onChange={(e) => setSubCat2(e.target.value)}>
              <option value="">Seleccionar</option>
              <option value="ELECTRO POTENCIA">ELECTRO POTENCIA</option>
              <option value=" ">ELECTRO TRANSFERENCIA</option>
              <option value="EQUIPO DE  PROTECCIÓN">EQUIPO DE PROTECCIÓN</option>
              <option value="EQUIPO ELECTRICO Y ELECTRÓNICO">EQUIPO ELECTRICO Y ELECTRÓNICO|</option>
              <option value="ESTETICA EXTERIOR">ESTETICA EXTERIOR</option>
              <option value="FILTROS DE AIRE DE ALTO FLUJO">FILTROS DE AIRE DE ALTO FLUJO</option>  
              <option value="FRENOS">FRENOS</option>  
              <option value="ILUMINACIÓN Y VISIÓN">ILUMINACIÓN Y VISIÓN</option>    
              <option value="KITS AERODINÁMICOS">KITS AERODINÁMICOS</option>  
              <option value="KITS AERODINÁMICOS DE FIBRA DE CARBONO">KITS AERODINÁMICOS DE FIBRA DE CARBONO</option>      
              <option value="KITS AERODINÁMICOS POLIURETANO">KITS AERODINÁMICOS POLIURETANO</option>      
              <option value="MANO DE OBRA">MANO DE OBRA</option>  
              <option value="PELICULA DE VIDRIOS">PELICULA DE VIDRIOS</option>          
              <option value="PINTURA">PINTURA</option>          
              <option value="PLACA INVISIBLE">PLACA INVISIBLE</option>  
              <option value="RINES">RINES</option>
              <option value="SERVICIOS">SERVICIOS</option>
              <option value="SISTEMAS DE ESCAPE">SISTEMAS DE ESCAPE</option>    
              <option value="SUNROOFS">SUNROOFS</option>        
              <option value="SUSPENSIÓN">SUSPENSIÓN</option>   
              <option value="VALVULAS TURBO">VALVULAS TURBO</option>               
              <option value="VINIL/WRAP">VINIL/WRAP</option>
              <option value="OTRO">OTRO</option>
            </select>
          </div>

          <div className="input">
            <h3>Sub Categoría 3</h3>
            <select value={subCat3} onChange={(e) => setSubCat3(e.target.value)}>
              <option value="">Seleccionar</option>
              <option value="MANO DE OBRA">MANO DE OBRA</option>
              <option value="SERVICIOS">SERVICIOS</option>
              <option value="VENTA">VENTA</option>
            </select>
          </div>
        </div>

        {/* Tipo & Unidad de Medida */}
        <div className="row-forms">
          <div className="input">
            <h3>Tipo</h3>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="">Seleccionar</option>
              <option value="SERVICIO">SERVICIO</option>
              <option value="INVENTARIABLE">INVENTARIABLE</option>
            </select>
          </div>

          <div className="input">
            <h3>Unidad de Medida</h3>
            <select value={unidadMedida} onChange={(e) => setUnidadMedida(e.target.value)}>
              <option value="">Seleccionar</option>
              <option value="srv">srv</option>
              <option value="pza">pza</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container-actions">
        <button onClick={handleSave}>Guardar</button>
      </div>
    </div>
  );
}
