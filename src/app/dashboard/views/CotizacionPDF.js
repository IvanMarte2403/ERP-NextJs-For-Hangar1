// CotizacionPDF.js
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { Html } from 'react-pdf-html';
import stylesPDF from './OrderPDFStyles';

/* ---------- Estilos internos ---------- */
const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Inter' },
  title: { fontSize: 18, marginBottom: 10, textAlign: 'center' },
  section: { marginBottom: 10, padding: 10, fontSize: 12 },
  footer: { fontSize: 10, textAlign: 'center', marginTop: 50 },
});

/* Registro tipografía */
Font.register({
  family: 'Inter',
  fonts: [
    { src: '/fonts/Inter.ttf', fontWeight: '100' },
    { src: '/fonts/Inter.ttf', fontWeight: '400' },
    { src: '/fonts/Inter.ttf', fontWeight: '700' },
    { src: '/fonts/Inter.ttf', fontWeight: '800' },
  ],
});

/* ---------- Componente PDF ---------- */
const CotizacionPDF = ({ order }) => {
  if (!order?.orderNumber) {
    return (
      <Document>
        <Page style={styles.page}>
          <Text>Cargando datos de la orden...</Text>
        </Page>
      </Document>
    );
  }

  /* ---------- Cálculos de importes ---------- */
  const calculateSubtotal = (item) => {
    const price = parseFloat(item.partUnitPrice) || 0;
    const quantity = parseInt(item.quantity) || 0;
    const taxRate = item.impuestos === '16' ? 0.16 : 0;
    const costWithVAT = price * (1 + taxRate);
    const subtotal = costWithVAT * quantity;
    return { costWithVAT, subtotal };
  };

  const total = order.inspectionItems.reduce((acc, i) => acc + calculateSubtotal(i).subtotal, 0);
  const discountAmount = order.discount?.cantidad_dinero ? +order.discount.cantidad_dinero : 0;
  const grandTotal = total - discountAmount;

  /* ---------- Construcción de la tabla mediante HTML ---------- */
  const tableRowsHtml =
    order.inspectionItems
      ?.map((item) => {
        const { costWithVAT } = calculateSubtotal(item);
        const quantity = parseInt(item.quantity) || 0;
        return `
          <tr style="padding-top:8px">
            <td style="width:12%;text-align:center;">${quantity}</td>
            <td style="width:28%;text-align:left;padding-right:5px;">${item.inspectionItemName}</td>
            <td style="width:24%;text-align:left;padding-right:5px;">${item.characteristics || item.caracteristicas || ''}</td>
            <td style="width:20%;text-align:left;">${item.brand || 'N/A'}</td>
            <td style="width:16%;text-align:left;">$${costWithVAT.toFixed(2)}</td>
          </tr>
        `;
      })
      .join('') || '';

  const tableHtml = `
    <table style="width:100%;border-collapse:collapse;font-size:9px;">
      <thead>
        <tr>
          <th style="width:12%;text-align:left;font-size:10px;font-weight:bold;border-bottom:1px solid #000;padding-bottom:5px;">Cantidad</th>
          <th style="width:28%;text-align:left;font-size:10px;font-weight:bold;border-bottom:1px solid #000;padding-bottom:5px;">Producto</th>
          <th style="width:24%;text-align:left;font-size:10px;font-weight:bold;border-bottom:1px solid #000;padding-bottom:5px;">Características</th>
          <th style="width:20%;text-align:left;font-size:10px;font-weight:bold;border-bottom:1px solid #000;padding-bottom:5px;">Marca</th>
          <th style="width:16%;text-align:left;font-size:10px;font-weight:bold;border-bottom:1px solid #000;padding-bottom:5px;">Costo</th>
        </tr>
      </thead>
      <tbody>
        ${
          order.inspectionItems?.length
            ? tableRowsHtml
            : '<tr><td colspan="5" style="text-align:left;padding-top:5px;">No hay productos o servicios asociados</td></tr>'
        }
      </tbody>
    </table>
  `;

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
              {order.uploadTime ? new Date(order.uploadTime).toLocaleDateString('es-MX') : 'Fecha no disponible'}
            </Text>
          </View>
          <View style={stylesPDF.containerCategoriaImagen}>
            <Image style={stylesPDF.imagenSc} src="img/speedCenter.png" />
          </View>
        </View>

        {/* Nombre de usuario */}
        <View style={stylesPDF.containerNameUser}>
          <View style={stylesPDF.userView}>
            <Image style={stylesPDF.imageUser} src="icons/user.png" />
            <Text style={stylesPDF.firstName}>{`${order.firstName || ''} ${order.lastName || ''}`}</Text>
          </View>
        </View>

        {/* Datos Usuario / Coche */}
        <View style={stylesPDF.containerDatos}>
          <View style={stylesPDF.containerUsuario}>
            <Text style={stylesPDF.infoText}>Teléfono: {order.mobile || 'N/A'}</Text>
            <Text style={stylesPDF.infoText}>Correo: prueba@hangar1.com.mx</Text>
            <Text style={stylesPDF.infoText}>Asesor: {order.inCharge}</Text>
            <Text style={stylesPDF.infoText}>Método de Pago: {order.paymentMethod || 'N/A'}</Text>
          </View>
          <View style={stylesPDF.containerCoche}>
            <View style={stylesPDF.carIconContainer}>
              <Image style={stylesPDF.carIcon} src="icons/car.png" />
              <Text style={stylesPDF.infoText}>{`${order.brand || ''}${order.model ? ' ' + order.model : ''}`}</Text>
            </View>
            <Text style={stylesPDF.infoText}>Color: {order.color || 'N/A'}</Text>
            <Text style={stylesPDF.infoText}>Placa: {order.placa_coche || 'N/A'}</Text>
            <Text style={stylesPDF.infoText}>Kilometraje: {order.kilometros || 'N/A'}</Text>
            <Text style={stylesPDF.infoText}>Año: {order.year || ''}</Text>
          </View>
        </View>

        {/* Tabla de Productos */}
        <View style={styles.section}>
          <Html>{tableHtml}</Html>

          {/* Totales */}
          <View
            style={{
              flexDirection: 'row',
              borderTop: '1 solid black',
              paddingTop: 10,
              marginTop: 40,
              width: '50%',
            }}
          >
            <Text style={{ width: '75%', fontWeight: '700', paddingRight: 10, fontSize: 10 }}>Subtotal:</Text>
            <Text style={{ width: '25%', fontSize: 10 }}>$ {total.toFixed(2)}</Text>
          </View>
          <View style={{ flexDirection: 'row', paddingTop: 10, width: '50%' }}>
            <Text style={{ width: '75%', fontWeight: '700', paddingRight: 10, fontSize: 10 }}>Descuentos:</Text>
            <Text style={{ width: '25%', fontSize: 10 }}>$ {discountAmount.toFixed(2)}</Text>
          </View>
          <View style={{ flexDirection: 'row', paddingTop: 10, width: '50%' }}>
            <Text style={{ width: '75%', fontWeight: '700', paddingRight: 10, fontSize: 10 }}>Total:</Text>
            <Text style={{ width: '25%', fontSize: 10 }}>$ {grandTotal.toFixed(2)}</Text>
          </View>
        </View>

        <Text style={styles.footer}>Firma Cliente</Text>
      </Page>
    </Document>
  );
};

export default CotizacionPDF;
