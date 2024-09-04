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
    marginTop: 20,
  },

  // Header
  headerContainer:{
    width: '100%',  
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 40,
  },
  headerColumn:{
    width: '55%',
  },
  headerColumn2:{
    width: '30%',
  },
  textInfo: {
    fontSize: 12,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  imagenSc: {
    width: '100%',
    objectFit: 'cover',
  }
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

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.headerContainer}>
          <View style={styles.headerColumn2}>
            <Image
              style={styles.imagenSc}
              src="img/speedCenter.png"
            />
          </View>

          <View style={styles.headerColumn}>
            <Text style={styles.textInfo}>
              Hangar 1 Centro Automotor de Alto Rendimiento {"\n"}
              Avenida Cuauhtémoc 740-742, CP 03020 Narvarte {"\n"} Poniente, Benito Juárez, {"\n"} CDMX, México
            </Text>
          </View>  
        </View>      

        <View style={styles.section}>
          <Text style={styles.text}>Orden N°: {order.orderNumber}</Text>
          <Text style={styles.text}>Cliente: {`${order.firstName || ''} ${order.lastName || ''}`}</Text>
          <Text style={styles.text}>Asesor: {order.inCharge}</Text>
          <Text style={styles.text}>Teléfono: {order.mobile || 'N/A'}</Text>
          <Text style={styles.text}>Auto: {`${order.brand || ''} ${order.model || ''}`}</Text>
          <Text style={styles.text}>Método de Pago: {order.paymentMethod || 'N/A'}</Text>
          <Text style={styles.text}>Estado: {order.estado_orden || 'Presupuesto'}</Text>
        </View>

        {/* Aquí puedes agregar más detalles sobre los productos o servicios si es necesario */}
        <Text style={styles.footer}>Gracias por confiar en nosotros</Text>
      </Page>
    </Document>
  );
};

export default OrderPDF;
