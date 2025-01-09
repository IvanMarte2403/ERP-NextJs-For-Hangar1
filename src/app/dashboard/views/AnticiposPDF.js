import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

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
  footer: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 50,
  },
});

Font.register({
  family: 'Inter',
  fonts: [
    { src: '/fonts/Inter.ttf', fontWeight: '400' }, // Regular
    { src: '/fonts/Inter.ttf', fontWeight: '700' }, // Bold
  ],
});

// Componente que genera el PDF
const AnticiposPDF = ({ order }) => (
  <Document>
    <Page style={styles.page}>
      {/* Título */}
      <Text style={styles.title}>Historial de Anticipos</Text>

      {/* Historial de Pagos */}
      <View style={styles.section}>
        {order.abonos && order.abonos.length > 0 ? (
          <>
            {/* Encabezados de la tabla */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, styles.cellFolio]}>Folio</Text>
              <Text style={[styles.tableCell, styles.cellCantidad]}>Cantidad</Text>
              <Text style={[styles.tableCell, styles.cellMetodo]}>Método de Pago</Text>
              <Text style={[styles.tableCell, styles.cellFecha]}>Fecha</Text>
            </View>

            {/* Filas de pagos */}
            {order.abonos.map((abono, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.cellFolio]}>{abono.folio || 'N/A'}</Text>
                <Text style={[styles.tableCell, styles.cellCantidad]}>${abono.cantidad_abono}</Text>
                <Text style={[styles.tableCell, styles.cellMetodo]}>{abono.metodo_pago}</Text>
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

      <Text style={styles.footer}>Firma Cliente</Text>
    </Page>
  </Document>
);

export default AnticiposPDF;
