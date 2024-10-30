import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
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
  imagenSc: {
    width: '150%',
    objectFit: 'cover',
  },
  rowHeader: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: '2rem',
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

  return (
    <Document>
      <Page style={styles.page}>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View style={styles.headerColumn2}>
            <Image style={styles.imagenSc} src="img/speedCenter.png" />
          </View>
          <View style={styles.headerColumn}></View>
        </View>

        {/* Info Principal */}
        <View style={styles.section}>
          {/* Fila de Orden y Fecha */}
          <View style={styles.rowHeader}>
            <View>
              <Text>
                <Text style={styles.spanText}>Orden: </Text> {order.orderNumber}
              </Text>
            </View>
            <View>
              <Text>
                <Text style={styles.spanText}>Fecha de Creación: </Text>
                {order.uploadTime
                  ? new Date(order.uploadTime).toLocaleDateString('es-MX')
                  : 'Fecha no disponible'}
              </Text>
            </View>
          </View>

          {/* Fila de Auto y Cliente */}
          <View style={styles.rowHeader}>
            <View>
              <Text style={styles.text}>
                Auto: {`${order.brand || ''} ${order.year || ''}`}
              </Text>
            </View>
            <View>
              <Text style={styles.text}>
                Cliente: {`${order.firstName || ''} ${order.lastName || ''}`}
              </Text>
            </View>
          </View>

          {/* Fila de Teléfono y Kilometraje */}
          <View style={styles.rowHeader}>
            <View>
              <Text style={styles.text}>Teléfono: {order.mobile || 'N/A'}</Text>
            </View>
            <View>
              <Text style={styles.text}>Kilometraje: {order.kilometros || 'N/A'}</Text>
            </View>
          </View>

          {/* Fila de Placa y Método de Pago */}
          <View style={styles.rowHeader}>
            <View>
              <Text style={styles.text}>Placa: {order.placa_coche || 'N/A'}</Text>
            </View>
            <View>
              <Text style={styles.text}>
                Método de Pago: {order.paymentMethod || 'N/A'}
              </Text>
            </View>
          </View>

          {/* Agregar el campo Color */}
          <View style={styles.rowHeader}>
            <View>
              <Text style={styles.text}>Color: {order.color || 'N/A'}</Text>
            </View>
          </View>

          {/* Productos */}
          <View style={{ marginTop: 40 }}>
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

          {/* Total */}
          <View style={{ flexDirection: 'row', borderTop: '1 solid black', paddingTop: 5 }}>
            <Text style={{ width: '75%', fontWeight: '700', textAlign: 'right', paddingRight: 10 }}>Total:</Text>
            <Text style={{ width: '25%', fontWeight: 'bold', textAlign: 'left' }}>
              ${total.toFixed(2)}
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

          <View style={styles.asesorContainer}>
            <Text style={styles.text}>Asesor: {order.inCharge}</Text>
            <Text style={styles.text}>Estado: {order.estado_orden || 'Presupuesto'}</Text>
          </View>
        </View>

        <Text style={styles.footer}>Firma Cliente</Text>
      </Page>
    </Document>
  );
};

export default OrderPDF;
