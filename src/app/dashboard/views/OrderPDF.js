// OrderPDF.js
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import stylesPDF from './OrderPDFStyles';

/* ---------- Estilos internos ---------- */
const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Inter' },
  section: { marginBottom: 10, padding: 10, fontSize: 12 },
  footer: { fontSize: 10, textAlign: 'center', marginTop: 50 },
  productName: { fontSize: 9, textAlign: 'left', paddingRight: 5 },
  productBrand: { fontSize: 9, color: '#555', textAlign: 'left' },
  titleTableLeft: { fontSize: 10, fontWeight: 'bold', textAlign: 'left' },
  titleTableRight: { fontSize: 10, fontWeight: 'bold', textAlign: 'right' },
  numberTable: { fontSize: 10, textAlign: 'right' },
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

/* ---------- Utilidades ---------- */
const formatIsoDate = (iso = '') => {
  if (!iso) return 'N/A';
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
};
const formatCurrency = (v = 0) =>
  `$${(+v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/* ---------- Componente PDF ---------- */
const OrderPDF = ({ order }) => {
  if (!order?.orderNumber) {
    return (
      <Document>
        <Page style={styles.page}>
          <Text>Cargando datos de la orden...</Text>
        </Page>
      </Document>
    );
  }

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
            <Image style={stylesPDF.imagesnSc} src="img/speedCenter.png" />
          </View>
        </View>

        {/* Datos Cliente / Coche */}
        <View style={stylesPDF.containerDatos}>
          <View style={stylesPDF.containerUsuario}>
            <View style={stylesPDF.userView}>
              <Image style={stylesPDF.imageUser} src="icons/user.png" />
              <Text style={stylesPDF.firstName}>{`${order.firstName || ''} ${order.lastName || ''}`}</Text>
            </View>
            <Text style={stylesPDF.infoText}>Telefono: {order.mobile || 'N/A'}</Text>
            <Text style={stylesPDF.infoText}>Correo: prueba@hangar1.com.mx</Text>
            <Text style={stylesPDF.infoText}>Asesor: {order.inCharge}</Text>
            <Text style={stylesPDF.infoText}>Folio Garantía: {order.garantia_number}</Text>
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
          <View>
            {/* Encabezados */}
            <View style={{ flexDirection: 'row', borderBottom: '1 solid black', paddingBottom: 5 }}>
              <Text style={[{ width: '35%' }, styles.titleTableLeft]}>Producto</Text>
              <Text style={[{ width: '20%' }, styles.titleTableLeft]}>Marca</Text>
              <Text style={[{ width: '10%' }, styles.titleTableRight]}>Costo</Text>
              <Text style={[{ width: '18%' }, styles.titleTableRight]}>Cantidad</Text>
              <Text style={[{ width: '18%' }, styles.titleTableRight]}>Subtotal</Text>
            </View>

            {/* Filas */}
            {order.inspectionItems?.length ? (
              order.inspectionItems.map((item, idx) => {
                const { costWithVAT, subtotal } = calculateSubtotal(item);
                const quantity = parseInt(item.quantity) || 0;
                return (
                  <View key={idx} style={{ flexDirection: 'row', marginVertical: 5 }}>
                    <Text style={{ width: '35%', fontSize: 9, textAlign: 'left', paddingRight: 5 }}>
                      {item.inspectionItemName}
                    </Text>
                    <Text style={{ width: '20%', fontSize: 9, textAlign: 'left' }}>
                      {item.brand || 'N/A'}
                    </Text>
                    <Text style={[{ width: '15%' }, styles.numberTable]}>{formatCurrency(costWithVAT)}</Text>
                    <Text style={[{ width: '12%' }, styles.numberTable]}>{quantity}</Text>
                    <Text style={[{ width: '18%' }, styles.numberTable]}>{formatCurrency(subtotal)}</Text>
                  </View>
                );
              })
            ) : (
              <Text>No hay productos o servicios asociados</Text>
            )}
          </View>

          {/* Totales */}
          <View style={{ flexDirection: 'row', borderTop: '1 solid black', paddingTop: 10, marginTop: 40, width: '50%' }}>
            <Text style={{ width: '75%', fontWeight: '700', paddingRight: 10, fontSize: 10 }}>Subtotal:</Text>
            <Text style={[{ width: '25%' }, styles.numberTable]}>{formatCurrency(total)}</Text>
          </View>
          <View style={{ flexDirection: 'row', paddingTop: 10, width: '50%' }}>
            <Text style={{ width: '75%', fontWeight: '700', paddingRight: 10, fontSize: 10 }}>Descuentos:</Text>
            <Text style={[{ width: '25%' }, styles.numberTable]}>{formatCurrency(discountAmount)}</Text>
          </View>
          <View style={{ flexDirection: 'row', paddingTop: 10, width: '50%' }}>
            <Text style={{ width: '75%', fontWeight: '700', paddingRight: 10, fontSize: 13 }}>Total:</Text>
            <Text style={[{ width: '25%' }, styles.numberTable]}>{formatCurrency(grandTotal)}</Text>
          </View>

          {/* Anticipos */}
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 10 }}>Anticipos</Text>
            {order.abonos?.length ? (
              <>
                <View style={{ flexDirection: 'row', borderBottom: '1 solid black', paddingBottom: 5 }}>
                  <Text style={[{ width: '33%' }, styles.titleTableLeft]}>Cantidad</Text>
                  <Text style={[{ width: '33%' }, styles.titleTableLeft]}>Método de Pago</Text>
                  <Text style={[{ width: '34%' }, styles.titleTableLeft]}>Fecha</Text>
                </View>
                {order.abonos.map((a, i) => (
                  <View key={i} style={{ flexDirection: 'row', marginVertical: 5 }}>
                    <Text style={{ width: '33%' }}>{formatCurrency(a.cantidad_abono)}</Text>
                    <Text style={{ width: '33%' }}>{a.metodo_pago}</Text>
                    <Text style={{ width: '34%' }}>{formatIsoDate(a.fecha_abono)}</Text>
                  </View>
                ))}
              </>
            ) : (
              <Text style={stylesPDF.titleAbonos}>No hay pagos registrados</Text>
            )}
          </View>
        </View>

        <Text style={styles.footer}>Firma Cliente</Text>
      </Page>
    </Document>
  );
};

export default OrderPDF;
