import { StyleSheet, Font } from '@react-pdf/renderer';

/* Registro de tipografía */
Font.register({
  family: 'Inter',
  fonts: [
    { src: '/fonts/Inter.ttf', fontWeight: '100' }, // Thin
    { src: '/fonts/Inter.ttf', fontWeight: '400' }, // Regular
    { src: '/fonts/Inter.ttf', fontWeight: '700' }, // Bold
    { src: '/fonts/Inter.ttf', fontWeight: '800' }, // Extra Bold
  ],
});

/* Estilos globales del PDF */
const stylesPDF = StyleSheet.create({
  /* ------------ Encabezado ------------ */
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerOrderNumberContainer: {
    width: '80%',
  },
  containerCategoriaImagen: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textOrderNumber: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'Inter',
  },
  spanText: { fontWeight: 800, fontFamily: 'Inter' },
  imagenSc: { width: '10%', objectFit: 'cover', fontFamily: 'Inter' },
  textFecha: { fontSize: 10, fontWeight: 400 },

  /* ------------ Cliente / Auto ------------ */
  rowHeaderClient: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 15,
  },
  sectionUser: { flexDirection: 'column' },
  sectionAuto: { flexDirection: 'column' },
  containerNameUser: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    marginTop: '20px',
  },
  imageUser: { width: '9px', height: '10px', marginRight: '9px' },
  firstName: { fontSize: '10px' },
  userView: {
    width: '40%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '4px',
  },
  containerDatos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '7px',
  },
  containerUsuario: { width: '49%', padding: '5px' },
  infoText: { fontSize: '9px', marginBottom: '5px' },
  carIconContainer: {
    width: '40%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '3px',
  },
  carIcon: { width: '11px', height: '8px', marginRight: '8px' },
  containerCoche: { padding: '5px', width: '49%', borderRadius: '3px' },

  /* ------------ Tabla de productos ------------ */
  /* Encabezados */
  thProduct:  { width: '38%', fontSize: 10, fontWeight: 'bold', textAlign: 'left' },
  thBrand:    { width: '22%', fontSize: 10, fontWeight: 'bold', textAlign: 'left' },
  thCost:     { width: '12%', fontSize: 10, fontWeight: 'bold', textAlign: 'left' },
  thQty:      { width: '8%',  fontSize: 10, fontWeight: 'bold', textAlign: 'right' },
  thSubtotal: { width: '20%', fontSize: 10, fontWeight: 'bold', textAlign: 'right' },

  /* Celdas */
  tdProduct:  { width: '38%', fontSize: 9, textAlign: 'left', paddingRight: 6 },
  tdBrand:    { width: '22%', fontSize: 9, textAlign: 'left' },
  tdNumber:   { fontSize: 9, textAlign: 'right' },

  /* Otros */
  titleAbonos: { fontSize: '10px' },
});

export default stylesPDF;
