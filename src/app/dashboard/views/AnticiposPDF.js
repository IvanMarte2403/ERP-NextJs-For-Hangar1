import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import stylesPDF from './OrderPDFStyles';

// Estilos base del PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Inter',
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
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
  // Tabla de abonos
  tableHeader: {
    flexDirection: 'row',
    borderBottom: '1 solid black',
    paddingBottom: 5,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 5,
    marginTop: 5,
  },
  tableCell: {
    fontSize: 12,
    padding: 5,
  },
  cellFolio: {
    width: '20%',
  },
  cellCantidad: {
    width: '25%',
  },
  cellMetodo: {
    width: '30%',
  },
  cellFecha: {
    width: '25%',
  },
});

// Registrar fuentes
Font.register({
  family: 'Inter',
  fonts: [
    { src: '/fonts/Inter.ttf', fontWeight: '400' },
    { src: '/fonts/Inter.ttf', fontWeight: '700' },
  ],
});

// Componente que genera el PDF de Anticipos
const AnticiposPDF = ({ order }) => {
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
        {/* Encabezado */}
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

          {/* Logo o imagen */}
          <View style={stylesPDF.containerCategoriaImagen}>
            <Image style={stylesPDF.imagesnSc} src="img/speedCenter.png" />
          </View>
        </View>

        {/* Título principal */}
        <Text style={styles.title}>Historial de Anticipos</Text>

        {/* Datos del usuario y coche */}
        <View style={stylesPDF.containerNameUser}>
          <View style={stylesPDF.userView}>
            <Image style={stylesPDF.imageUser} src="icons/user.png" />
            <Text style={stylesPDF.firstName}>
              {`${order.firstName || ''} ${order.lastName || ''}`}
            </Text>
          </View>
        </View>

        <View style={stylesPDF.containerDatos}>
          {/* Usuario */}
          <View style={stylesPDF.containerUsuario}>
            <Text style={stylesPDF.infoText}>
              Teléfono: {order.mobile || 'N/A'}
            </Text>
            <Text style={stylesPDF.infoText}>
              Correo: prueba@hangar1.com.mx
            </Text>
            <Text style={stylesPDF.infoText}>
              Asesor: {order.inCharge || 'N/A'}
            </Text>
            <Text style={stylesPDF.infoText}>
              Método de Pago: {order.paymentMethod || 'N/A'}
            </Text>
          </View>

          {/* Coche */}
          <View style={stylesPDF.containerCoche}>
            <View style={stylesPDF.carIconContainer}>
              <Image style={stylesPDF.carIcon} src="icons/car.png" />
              <Text style={stylesPDF.infoText}>
                {order.brand || ''}
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

        {/* Tabla de abonos */}
        <View style={styles.section}>
          {order.abonos && order.abonos.length > 0 ? (
            <>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCell, styles.cellFolio]}>Folio</Text>
                <Text style={[styles.tableCell, styles.cellCantidad]}>Cantidad</Text>
                <Text style={[styles.tableCell, styles.cellMetodo]}>Método de Pago</Text>
                <Text style={[styles.tableCell, styles.cellFecha]}>Fecha</Text>
              </View>

              {order.abonos.map((abono, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.cellFolio]}>
                    {abono.folio || 'N/A'}
                  </Text>
                  <Text style={[styles.tableCell, styles.cellCantidad]}>
                    ${abono.cantidad_abono}
                  </Text>
                  <Text style={[styles.tableCell, styles.cellMetodo]}>
                    {abono.metodo_pago}
                  </Text>
                  <Text style={[styles.tableCell, styles.cellFecha]}>
                    {new Date(abono.fecha_abono).toLocaleDateString('es-MX')}
                  </Text>
                </View>
              ))}
            </>
          ) : (
            <Text>No hay pagos registrados</Text>
          )}
        </View>   

        {/* Pie de página */}
        <Text style={styles.footer}>Firma Cliente</Text>
      </Page>
    </Document>
  );
};

export default AnticiposPDF;
