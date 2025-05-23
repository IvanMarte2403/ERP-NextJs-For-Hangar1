// AnticiposPDF.js
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { Html } from 'react-pdf-html';          // ← import correcto
import stylesPDF from './OrderPDFStyles';

/* ---------- Estilos internos ---------- */
const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Inter' },
  title: { fontSize: 18, marginBottom: 10, textAlign: 'center', fontWeight: 'bold' },
  section: { marginBottom: 10, padding: 10, fontSize: 12 },
  footer: { fontSize: 10, textAlign: 'center', marginTop: 50 },
});

/* ---------- Tipografía ---------- */
Font.register({
  family: 'Inter',
  fonts: [
    { src: '/fonts/Inter.ttf', fontWeight: '400' },
    { src: '/fonts/Inter.ttf', fontWeight: '700' },
  ],
});

/* ---------- Utilidades ---------- */
const formatIsoDate = (iso = '') => {
  if (!iso) return 'N/A';
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
};

/* ---------- Componente PDF ---------- */
const AnticiposPDF = ({ order }) => {
  if (!order?.orderNumber) {
    return (
      <Document>
        <Page style={styles.page}>
          <Text>Cargando datos de la orden...</Text>
        </Page>
      </Document>
    );
  }

  /* ---------- Tabla Anticipos ---------- */
  const tableRowsHtml =
    order.abonos
      ?.map(
        (ab) => `
        <tr style="padding-top:8px">
          <td style="width:33%;text-align:left;">$${(+ab.cantidad_abono).toFixed(2)}</td>
          <td style="width:34%;text-align:left;">${ab.metodo_pago}</td>
          <td style="width:33%;text-align:left;">${formatIsoDate(ab.fecha_abono)}</td>
        </tr>
      `,
      )
      .join('') || '';

  const tableHtml = `
    <table style="width:100%;border-collapse:collapse;font-size:9px;">
      <thead>
        <tr>
          <th style="width:33%;text-align:left;font-size:10px;font-weight:bold;border-bottom:1px solid #000;padding-bottom:5px;">Cantidad</th>
          <th style="width:34%;text-align:left;font-size:10px;font-weight:bold;border-bottom:1px solid #000;padding-bottom:5px;">Método de Pago</th>
          <th style="width:33%;text-align:left;font-size:10px;font-weight:bold;border-bottom:1px solid #000;padding-bottom:5px;">Fecha</th>
        </tr>
      </thead>
      <tbody>
        ${
          order.abonos?.length
            ? tableRowsHtml
            : '<tr><td colspan="3" style="text-align:left;padding-top:5px;">No hay pagos registrados</td></tr>'
        }
      </tbody>
    </table>
  `;

  /* ---------- Render ---------- */
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
              {order.uploadTime ? formatIsoDate(order.uploadTime) : 'Fecha no disponible'}
            </Text>
          </View>
          <View style={stylesPDF.containerCategoriaImagen}>
            <Image style={stylesPDF.imagenSc} src="img/speedCenter.png" />
          </View>
        </View>

        {/* Título */}
        <Text style={styles.title}>Historial de Anticipos</Text>

        {/* Datos Usuario / Coche */}
        <View style={stylesPDF.containerNameUser}>
          <View style={stylesPDF.userView}>
            <Image style={stylesPDF.imageUser} src="icons/user.png" />
            <Text style={stylesPDF.firstName}>{`${order.firstName || ''} ${order.lastName || ''}`}</Text>
          </View>
        </View>

        <View style={stylesPDF.containerDatos}>
          <View style={stylesPDF.containerUsuario}>
            <Text style={stylesPDF.infoText}>Teléfono: {order.mobile || 'N/A'}</Text>
            <Text style={stylesPDF.infoText}>Correo: prueba@hangar1.com.mx</Text>
            <Text style={stylesPDF.infoText}>Asesor: {order.inCharge || 'N/A'}</Text>
            <Text style={stylesPDF.infoText}>Método de Pago: {order.paymentMethod || 'N/A'}</Text>
          </View>
          <View style={stylesPDF.containerCoche}>
            <View style={stylesPDF.carIconContainer}>
              <Image style={stylesPDF.carIcon} src="icons/car.png" />
              <Text style={stylesPDF.infoText}>{`${order.brand || ''}${
                order.model ? ' ' + order.model : ''
              }`}</Text>
            </View>
            <Text style={stylesPDF.infoText}>Color: {order.color || 'N/A'}</Text>
            <Text style={stylesPDF.infoText}>Placa: {order.placa_coche || 'N/A'}</Text>
            <Text style={stylesPDF.infoText}>Kilometraje: {order.kilometros || 'N/A'}</Text>
            <Text style={stylesPDF.infoText}>Año: {order.year || ''}</Text>
          </View>
        </View>

        {/* Tabla Anticipos */}
        <View style={styles.section}>
          <Html>{tableHtml}</Html>
        </View>

        <Text style={styles.footer}>Firma Cliente</Text>
      </Page>
    </Document>
  );
};

export default AnticiposPDF;
