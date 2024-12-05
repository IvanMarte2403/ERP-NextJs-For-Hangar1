import { StyleSheet, Font } from '@react-pdf/renderer';


Font.register({
    family: 'Inter',
    fonts: [
      { src: '/fonts/Inter.ttf', fontWeight: '100' }, // Thin
      { src: '/fonts/Inter.ttf', fontWeight: '400' }, // Regular
      { src: '/fonts/Inter.ttf', fontWeight: '700' }, // Bold
      { src: '/fonts/Inter.ttf', fontWeight: '800' }, // Extra Bold
    ],
  });
  
  
const stylesPDF = StyleSheet.create({

    // Header
    headerContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerOrderNumberContainer:{
        width: '80%',
    },
    containerCategoriaImagen:{
        width: '20%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // OrderNumber

    textOrderNumber:{
        fontSize: 20,
        fontWeight: '800',
        fontFamily: 'Inter'
    },
    spanText:{
        fontWeight: 800,
        fontFamily: 'Inter',
    },
    imagenSc: {
        width: '10%',
        objectFit: 'cover',
        fontFamily: 'Inter',
      },

    // Fecha

    textFecha:{
        fontSize: 10,
        fontWeight: 400,
    },
    // Client
    rowHeaderClient: {
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 15,
    },
    sectionContainer: {
        marginBottom: 10,
        padding: 10,
        fontSize: 12,
      },
    sectionUser:{
        flexDirection: 'column'
    },
    sectionAuto:{
        flexDirection: 'column',
    },
    // ContainerUserName

    containerNameUser:{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '100%',
        marginTop: '40px',
    },
    imageUser:{
        width: '10px',
        height: '13px',
        marginRight: '9px',
    },
    firstName:{
        fontSize: '15px',
    },  
    userView:{
        width: '40%',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: '10px',
    },
    containerDatos:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: '20px',
    },
    containerUsuario:{
        width: '49%',
        padding: '16px',
    },
    infoText:{
        fontSize: '12px',
        marginBottom: '5px',
    },
    // Car Info
    carIconContainer:{
        width:'40%',
        justifyContent: 'space-evenly',
        flexDirection:'row',
        alignItems: 'center',
        marginBottom: '10px',
    },
    carIcon:{
        width: '13px',
        height: '10px',
        marginRight: '8px',
    },
    containerCoche:{
        padding: '16px',
        width: '49%',
        backgroundColor: '#DFDFDF',
        borderRadius: '3px',
    }





});

export default stylesPDF; 
