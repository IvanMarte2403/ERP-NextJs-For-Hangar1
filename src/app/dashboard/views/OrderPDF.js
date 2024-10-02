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
    width: '150%',
    objectFit: 'cover',
  },
  rowHeader: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: '2rem',
    marginTop:  15,
  },
  spanText:{
    fontWeight: 800,
  },
  asesorContainer:{
    marginTop: 80,
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

        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View style={styles.headerColumn2}>
            <Image
              style={styles.imagenSc}
              src="img/speedCenter.png"
            />
          </View>

          <View style={styles.headerColumn}>
            
          </View>  
        </View>      

        {/* Info Principal */}
        <View style={styles.section}> 

          {/* Row Header */}
          <View style={styles.rowHeader}>
            {/* Elemenent  */}
            <View>

            <Text> <Text style={styles.spanText}> Orden. N</Text> 2024</Text>

           
            </View>
            {/* Element */}
            <View>
              <Text> <Text style={styles.spanText}>Fecha de Creación: </Text> 24/04/2003</Text>
            </View>
          </View>
          
            {/* Row Header */}
          <View style={styles.rowHeader}>

              {/* Elemenent  */}
              <View>
              <Text> <Text style={styles.spanText}>Folio de Garantía </Text> 109020</Text>
              </View>
              {/* Element */}
              <View>
              <Text style={styles.text}>Auto: {`${order.brand || ''} ${order.model || ''}`}</Text>
              </View>
          </View>

            
            {/* Row Header */}
            <View style={styles.rowHeader}>

              {/* Elemenent  */}
              <View>
              <Text style={styles.text}>Cliente: {`${order.firstName || ''} ${order.lastName || ''}`}</Text>
              </View>
              {/* Element */}
              <View>
              <Text style={styles.text}>Teléfono: {order.mobile || 'N/A'}</Text>

              </View>
            
            </View>

                {/* Row Header */}
            <View style={styles.rowHeader}>

                 {/* Elemenent  */}
                <View>
                    <Text style={styles.text}>Método de Pago: {order.paymentMethod || 'N/A'}</Text>
                </View>
                      {/* Element */}
                <View>
                </View>

              </View>

          {/*Productos */}
        
            <View style={{ marginTop: 40 }}>
           {/* Encabezados de la tabla */}
                  <View style={{ flexDirection: 'row', borderBottom: '1 solid black', paddingBottom: 5 }}>
                    <Text style={{ width: '30%', fontWeight: 'bold', textAlign: 'left' }}>Producto</Text>
                    <Text style={{ width: '15%', fontWeight: 'bold', textAlign: 'left' }}>Marca</Text>
                    <Text style={{ width: '15%', fontWeight: 'bold', textAlign: 'left' }}>Costo</Text>
                    <Text style={{ width: '10%', fontWeight: 'bold', textAlign: 'left' }}>Cantidad</Text>
                    <Text style={{ width: '15%', fontWeight: 'bold', textAlign: 'left' }}>Impuestos</Text> {/* Nueva columna de impuestos */}
                    <Text style={{ width: '15%', fontWeight: 'bold', textAlign: 'left' }}>Subtotal</Text>
                  </View>

                {/* Filas de productos */}
                {order.inspectionItems && order.inspectionItems.length > 0 ? (
  order.inspectionItems.map((item, index) => (
    <View key={index} style={{ flexDirection: 'row', marginBottom: 10, marginTop: 5 }}>
      <Text style={{ width: '30%' }}>{item.inspectionItemName}</Text>
      <Text style={{ width: '15%' }}>{item.brand || 'N/A'}</Text>
      <Text style={{ width: '15%' }}>${(item.partUnitPrice || 0).toFixed(2)}</Text>
      <Text style={{ width: '10%' }}>{item.quantity || 0}</Text>
      <Text style={{ width: '15%' }}>${((item.partUnitPrice || 0) * (item.quantity || 0) * 0.16).toFixed(2)}</Text>
      <Text style={{ width: '15%' }}>${((item.partUnitPrice || 0) * (item.quantity || 0)).toFixed(2)}</Text>
    </View>
  ))
) : (
  <Text>No hay productos o servicios asociados</Text>
)}

              </View>
              
                {/* Total al final de la tabla */}
                <View style={{ flexDirection: 'row', borderTop: '1 solid black', paddingTop: 5 }}>
                  <Text style={{ width: '100%', fontWeight: '700', textAlign: 'right' }}>Total:</Text>
                  <Text style={{ width: '25%', fontWeight: 'bold', textAlign: 'left' }}>
                    ${order.inspectionItems && order.inspectionItems.length > 0
                      ? order.inspectionItems.reduce((acc, item) => acc + ((item.partUnitPrice || 0) * (item.quantity || 0)), 0).toFixed(2)
                      : '0.00'}
                  </Text>
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
