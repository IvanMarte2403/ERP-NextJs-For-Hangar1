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
        fontSize: 10,
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
        marginTop: '20px', 
    },
    imageUser:{
        width: '9px',
        height: '10px',
        marginRight: '9px',
    },
    firstName:{
        fontSize: '10px',
    },  
    userView:{
        width: '40%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: '4px',
    },
    containerDatos:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: '7px',
    },
    containerUsuario:{
        width: '49%',
        padding: '5px',
    },
    infoText:{
        fontSize: '9px',
        marginBottom: '5px',
    },
    // Car Info
    carIconContainer:{
        width:'40%',
        flexDirection:'row',
        alignItems: 'center',
        marginBottom: '3px',
    },
    carIcon:{
        width: '11px',
        height: '8px',
        marginRight: '8px',
    },
    containerCoche:{
        padding: '5px',
        width: '49%',
        borderRadius: '3px',
    },

    //Table 
    
    titleTable:{
        fontSize: '15px'
    },
    numberTable:{
        fontSize: '10px',
        textAlign: 'left',
    },
    titleAbonos:{
        fontSize: '10px'
    },



});

export default stylesPDF; 
