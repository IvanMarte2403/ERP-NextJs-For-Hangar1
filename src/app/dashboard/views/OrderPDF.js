import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import stylesPDF from './OrderPDFStyles';

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Inter',
  },  
  title: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  section: {
    marginBottom: 10,
    padding: 10,
    fontSize: 12,
  },
  text: {
    marginBottom: 5,
  },
  footer: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 50,
  },
  headerContainer: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 40,
  },
  headerColumn: {
    width: '55%',
  },
  headerColumn2: {
    width: '30%',
  },
  textInfo: {
    fontSize: 12,
    textAlign: 'right',
    fontWeight: 'bold',
  },

  rowHeader: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 15,
  },
  spanText: {
    fontWeight: 800,
  },
  asesorContainer: {
    marginTop: 80,
  },
  productName: {
    fontSize: 12,
  },
  productBrand: {
    fontSize: 10,
    color: '#555',
  },
});

Font.register({
  family: 'Inter',
  fonts: [
    { src: '/fonts/Inter.ttf', fontWeight: '100' }, // Thin
    { src: '/fonts/Inter.ttf', fontWeight: '400' }, // Regular
    { src: '/fonts/Inter.ttf', fontWeight: '700' }, // Bold
    { src: '/fonts/Inter.ttf', fontWeight: '800' }, // Extra Bold
  ],
});


// Componente que genera el PDF
const OrderPDF = ({ order }) => {
  
  if (!order || !order.orderNumber) {
    return (
      <Document>
        <Page style={styles.page}>
          <Text>Cargando datos de la orden...</Text>
        </Page>
      </Document>
    );
  }

  // Función para calcular el subtotal y total incluyendo impuestos
  const calculateSubtotal = (item) => {
    const price = parseFloat(item.partUnitPrice) || 0;
    const quantity = parseInt(item.quantity) || 0;
    const impuestos = item.impuestos === "16" ? 0.16 : 0;
    const taxAmount = price * quantity * impuestos;
    const subtotal = price * quantity + taxAmount;
    return {
      taxAmount,
      subtotal,
    };
  };

  const total = order.inspectionItems.reduce((acc, item) => {
    const { subtotal } = calculateSubtotal(item);
    return acc + subtotal;
  }, 0);

  const discountAmount = order.discount && order.discount.cantidad_dinero
  ? parseFloat(order.discount.cantidad_dinero)
  : 0;

  const grandTotal = total - discountAmount;
  
  return (
    <Document>
      <Page style={styles.page}>

        {/* Header Section */}
        <View style={stylesPDF.headerContainer}>
          <View style={stylesPDF.headerOrderNumberContainer}>
            <Text style={stylesPDF.textOrderNumber}> 
                  <Text style={stylesPDF.spanText}>Número de Órden/</Text> {order.orderNumber}
            </Text>

              <Text style={stylesPDF.textFecha}> 
                {order.uploadTime
                  ? new Date(order.uploadTime).toLocaleDateString('es-MX')
                  : 'Fecha no disponible'}
             </Text>
          </View>

          <View style={stylesPDF.containerCategoriaImagen}>
            <Image style={stylesPDF.imagesnSc} src="img/speedCenter.png" />
          </View>
        </View>
                  
        {/* UserName */}
        <View style={stylesPDF.containerNameUser}>
          <View style={stylesPDF.userView}>
            <Image style={stylesPDF.imageUser} src="icons/user.png"/>  
            <Text style={stylesPDF.firstName}>{`${order.firstName || ''} ${order.lastName || ''}`}
            </Text> 
          </View>
        </View>

        {/* Datos de Usuario y Coche */}
        
        <View style={stylesPDF.containerDatos}>
            {/* Usuario */}
            <View style={stylesPDF.containerUsuario}>
              {/* Telefono */}
              <Text style={stylesPDF.infoText}>
                Telefono: {order.mobile || 'N/A'}
              </Text>
              {/* Correo */}
              <Text style={stylesPDF.infoText}>
                Correo: prueba@hangar1.com.mx 
              </Text>
              {/* Asesor */}
              <Text style={stylesPDF.infoText}>
                  Asesor: {order.inCharge}
              </Text>
              <Text style={stylesPDF.infoText}>
                Folio Garantía: {order.garantia_number}
              </Text>

              <Text style={stylesPDF.infoText}>
                Método de Pago: {order.paymentMethod || 'N/A'}
              </Text>
            </View>
            
            {/* Auto */}
            <View style={stylesPDF.containerCoche}>
                <View style={stylesPDF.carIconContainer}>
                  <Image style={stylesPDF.carIcon} src="icons/car.png" />
                  <Text style={stylesPDF.infoText}>
                    {`${order.brand || ''}`}
                  </Text>
                </View>
                <Text style={stylesPDF.infoText}>
                  Color: {order.color || 'N/A'}               
                </Text>
                <Text style={stylesPDF.infoText}>
                  Placa: {order.placa_coche || 'N/A'}
                </Text>
                <Text style={stylesPDF.infoText}>
                  Kilometraje: {order.kilometros || 'N/A'}
                </Text>
                <Text style={stylesPDF.infoText}>
                  Año: {order.year || ''}
                </Text>
                  
            </View>
        </View>

        {/* Info Principal */}
        <View style={styles.section}>
          {/* Productos */}
          <View style={{ marginTop: 40, border:'2px solid #000', padding: '10px'}}>
            {/* Encabezados de la tabla actualizados */}
            <View style={{
              flexDirection: 'row',
              borderBottom: '1 solid black',
              paddingBottom: 5,
              justifyContent: 'space-between'
            }}>
              <Text style={{ width: '28%', fontWeight: 'bold', textAlign: 'left' }}>Producto</Text>
              <Text style={{ width: '13%', fontWeight: 'bold', textAlign: 'left' }}>Costo</Text>
              <Text style={{ width: '13%', fontWeight: 'bold', textAlign: 'left' }}>Cantidad</Text>
              <Text style={{ width: '13%', fontWeight: 'bold', textAlign: 'left' }}>IVA</Text>
              <Text style={{ width: '23%', fontWeight: 'bold', textAlign: 'left' }}>Subtotal</Text>
            </View>

            {/* Filas de productos actualizadas */}
            {order.inspectionItems && order.inspectionItems.length > 0 ? (
              order.inspectionItems.map((item, index) => {
                const price = parseFloat(item.partUnitPrice) || 0;
                const quantity = parseInt(item.quantity) || 0;
                const impuestos = item.impuestos === "16" ? 0.16 : 0;
                const { taxAmount, subtotal } = calculateSubtotal(item);

                return (
                  <View key={index} style={{ flexDirection: 'row', marginBottom: 10, marginTop: 5, justifyContent: 'space-between' }}>
                    <Text style={{ width: '28%' ,   }}>
                      <Text style={styles.productName}>{item.inspectionItemName}</Text>
                      {'\n'}
                      <Text style={styles.productBrand}>{item.brand || 'N/A'}</Text>
                    </Text>
                    <Text style={{ width: '13%' ,}}>${price.toFixed(2)}</Text>
                    <Text style={{ width: '13%',  }}>{quantity}</Text>
                    <Text style={{ width: '13%' }}>${taxAmount.toFixed(2)}</Text>
                    <Text style={{ width: '23%', }}>${subtotal.toFixed(2)}</Text>
                  </View>
                );
              })
            ) : (
              <Text>No hay productos o servicios asociados</Text>
            )}
          </View>

          {/* Subtotal */}
          <View style={{ flexDirection: 'row', borderTop: '1 solid black', paddingTop: 10, marginTop: 40, width: '50%'}}>
            <Text style={{ width: '75%', fontWeight: '700', textAlign: 'left', paddingRight: 10, fontSize: 10}}>Subtotal:</Text>
            <Text style={{ width: '25%', fontWeight: 'bold', textAlign: 'left', fontSize: 10 }}>
              ${total.toFixed(2)}
            </Text>
          </View>

          
          {/* Descuentos */}
          <View style={{ flexDirection: 'row', paddingTop: 10,width: '50%'}}>
            <Text style={{ width: '75%', fontWeight: '700', textAlign: 'left', paddingRight: 10, fontSize: 10}}>Descuentos:</Text>
            <Text style={{ width: '25%', fontWeight: 'bold', textAlign: 'left', fontSize: 10 }}>
              ${discountAmount.toFixed(2)}
            </Text>
          </View>

          {/* Total */}
          <View style={{ flexDirection: 'row', paddingTop: 10,width: '50%'}}>
            <Text style={{ width: '75%', fontWeight: '700', textAlign: 'left', paddingRight: 10, fontSize: 13}}>Total:</Text>
            <Text style={{ width: '25%', fontWeight: 'bold', textAlign: 'left', fontSize: 12 }}>
              ${grandTotal.toFixed(2)}
            </Text>
          </View>



          {/* Historial de Pagos */}
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
              Anticipos
            </Text>
            {order.abonos && order.abonos.length > 0 ? (
              <>
                {/* Encabezados de la tabla */}
                <View
                  style={{
                    flexDirection: 'row',
                    borderBottom: '1 solid black',
                    paddingBottom: 5,
                  }}
                >
                  <Text style={{ width: '33%', fontWeight: 'bold', textAlign: 'left' }}>
                    Cantidad
                  </Text>
                  <Text style={{ width: '33%', fontWeight: 'bold', textAlign: 'left' }}>
                    Método de Pago
                  </Text>
                  <Text style={{ width: '34%', fontWeight: 'bold', textAlign: 'left' }}>
                    Fecha
                  </Text>
                </View>
                {/* Filas de pagos */}
                {order.abonos.map((abono, index) => (
                  <View
                    key={index}
                    style={{ flexDirection: 'row', marginBottom: 5, marginTop: 5 }}
                  >
                    <Text style={{ width: '33%' }}>${abono.cantidad_abono}</Text>
                    <Text style={{ width: '33%' }}>{abono.metodo_pago}</Text>
                    <Text style={{ width: '34%' }}>
                      {new Date(abono.fecha_abono).toLocaleDateString('es-MX')}
                    </Text>
                  </View>
                ))}
              </>
            ) : (
              <Text>No hay pagos registrados</Text>
            )}
          </View>

          {/* <View style={styles.asesorContainer}>
            <Text style={styles.text}></Text>
            <Text style={styles.text}>Estado: {order.estado_orden || 'Presupuesto'}</Text>
          </View> */}
        </View>

        <Text style={styles.footer}>Firma Cliente</Text>
      </Page>
    </Document> 
  );
};

export default OrderPDF;
