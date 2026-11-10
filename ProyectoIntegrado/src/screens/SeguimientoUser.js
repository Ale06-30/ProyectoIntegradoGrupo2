
// src/screens/SeguimientoUser.js

import React, { useState, useEffect, useCallback } from 'react';

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { auth } from '../firebase/FirebaseConfig';

const API_URL = 'http://192.168.1.62:3000/api/pedidos';

const estadosEnvio = [
    {
        estado: 'Pendiente',
        titulo: 'Pedido recibido',
        descripcion: 'Hemos recibido tu pedido y está pendiente de preparación.',
        icono: 'receipt-long'
    },
    {
        estado: 'En preparación',
        titulo: 'Preparando Mystery Box',
        descripcion: 'Tu caja sorpresa está siendo preparada.',
        icono: 'inventory-2'
    },
    {
        estado: 'Enviado',
        titulo: 'En camino a tu dirección',
        descripcion: 'Tu pedido ha salido y está en camino.',
        icono: 'local-shipping'
    },
    {
        estado: 'Entregado',
        titulo: 'Entregado con éxito',
        descripcion: 'Tu Mystery Box ha sido entregada. ¡Disfruta la experiencia!',
        icono: 'check-circle'
    }
];

export default function SeguimientoUser() {

    const [pedidos, setPedidos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [actualizando, setActualizando] = useState(false);

    // CONSULTAR PEDIDOS DEL USUARIO
    const cargarPedidos = useCallback(async (recarga = false) => {

        try {

            if (recarga) {
                setActualizando(true);
            } else {
                setCargando(true);
            }

            const usuario = auth.currentUser;

            if (!usuario || !usuario.email) {
                throw new Error('No se encontró una sesión de usuario activa.');
            }

            const respuesta = await fetch(API_URL);

            if (!respuesta.ok) {
                throw new Error('No se pudieron consultar los pedidos.');
            }

            const datos = await respuesta.json();

            if (!Array.isArray(datos)) {
                throw new Error('La respuesta del servidor no es válida.');
            }

            // MOSTRAR ÚNICAMENTE LOS PEDIDOS DEL USUARIO ACTUAL
            const misPedidos = datos.filter(pedido =>
                pedido.correo?.toLowerCase() === usuario.email.toLowerCase()
            );

            setPedidos(misPedidos);

        } catch (error) {

            console.log('[ERROR] Seguimiento:', error.message);

            Alert.alert('Error', error.message);

        } finally {

            setCargando(false);
            setActualizando(false);

        }

    }, []);

    useEffect(() => {
        cargarPedidos();
    }, [cargarPedidos]);

    // OBTENER EL PASO ACTUAL SEGÚN EL ESTADO
    const obtenerPaso = (estado) => {

        const indice = estadosEnvio.findIndex(
            item => item.estado === estado
        );

        return indice === -1 ? 0 : indice + 1;

    };

    // FORMATEAR FECHA
    const formatearFecha = (fecha) => {

        if (!fecha) return 'Fecha no disponible';

        const fechaObjeto = new Date(fecha);

        if (isNaN(fechaObjeto.getTime())) {
            return 'Fecha no disponible';
        }

        return fechaObjeto.toLocaleString();

    };

    // RENDERIZAR LINEA DE TIEMPO
    const renderizarSeguimiento = (pedido) => {

        if (pedido.estado === 'Cancelado') {

            return (
                <View style={styles.canceladoContainer}>

                    <MaterialIcons
                        name="cancel"
                        size={35}
                        color="#EF4444"
                    />

                    <Text style={styles.canceladoTitulo}>
                        Pedido cancelado
                    </Text>

                    <Text style={styles.canceladoDescripcion}>
                        Este pedido ha sido cancelado.
                    </Text>

                </View>
            );

        }

        const pasoActual = obtenerPaso(pedido.estado);

        return (
            <View style={styles.panelControl}>

                <Text style={styles.sectionTitle}>
                    Línea de tiempo del envío
                </Text>

                {estadosEnvio.map((item, index) => {

                    const estaCompletado = index + 1 < pasoActual;
                    const estaActivo = index + 1 === pasoActual;

                    return (

                        <View key={item.estado} style={styles.stepRow}>

                            <View style={styles.indicatorColumn}>

                                <View style={[
                                    styles.nodeCircle,
                                    estaActivo && styles.nodeActive,
                                    estaCompletado && styles.nodeCompleted
                                ]}>

                                    <MaterialIcons
                                        name={item.icono}
                                        size={18}
                                        color={
                                            estaActivo || estaCompletado
                                                ? '#FFFFFF'
                                                : '#71719A'
                                        }
                                    />

                                </View>

                                {index < estadosEnvio.length - 1 && (

                                    <View style={[
                                        styles.connectorLine,
                                        estaCompletado && styles.lineCompleted
                                    ]} />

                                )}

                            </View>

                            <View style={[
                                styles.stepContentCard,
                                estaActivo && styles.cardActive
                            ]}>

                                <View style={styles.stepHeader}>

                                    <Text style={[
                                        styles.stepTitle,
                                        estaActivo && styles.textActive
                                    ]}>
                                        {item.titulo}
                                    </Text>

                                    <View style={[
                                        styles.ledStatus,
                                        estaActivo
                                            ? styles.ledGreen
                                            : estaCompletado
                                                ? styles.ledBlue
                                                : styles.ledOff
                                    ]} />

                                </View>

                                <Text style={styles.stepDesc}>
                                    {item.descripcion}
                                </Text>

                            </View>

                        </View>

                    );

                })}

            </View>
        );

    };

    return (

        <SafeAreaView style={styles.areaSegura}>

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >

                <View style={styles.container}>

                    {/* CABECERA */}

                    <View style={styles.headerContainer}>

                        <Text style={styles.title}>
                            Seguimiento
                        </Text>

                        <Text style={styles.subtitle}>
                            📦 Estado de tus Mystery Box
                        </Text>

                    </View>

                    {/* ACTUALIZAR */}

                    <TouchableOpacity
                        style={styles.btnActualizar}
                        onPress={() => cargarPedidos(true)}
                        disabled={actualizando}
                    >

                        <MaterialIcons
                            name="refresh"
                            size={20}
                            color="#FFFFFF"
                        />

                        <Text style={styles.btnActualizarText}>
                            {actualizando
                                ? 'Actualizando...'
                                : 'Actualizar pedidos'}
                        </Text>

                    </TouchableOpacity>

                    {/* CARGANDO */}

                    {cargando && (

                        <View style={styles.estadoContainer}>

                            <ActivityIndicator
                                size="large"
                                color="#A78BFA"
                            />

                            <Text style={styles.estadoTexto}>
                                Consultando tus pedidos...
                            </Text>

                        </View>

                    )}

                    {/* SIN PEDIDOS */}

                    {!cargando && pedidos.length === 0 && (

                        <View style={styles.emptyContainer}>

                            <MaterialIcons
                                name="inventory-2"
                                size={55}
                                color="#7C3AED"
                            />

                            <Text style={styles.emptyTitle}>
                                No tienes pedidos
                            </Text>

                            <Text style={styles.emptyText}>
                                Cuando realices una compra, podrás consultar
                                aquí el progreso de tu Mystery Box.
                            </Text>

                        </View>

                    )}

                    {/* LISTA DE PEDIDOS */}

                    {!cargando && pedidos.map(pedido => (

                        <View
                            key={pedido.id}
                            style={styles.pedidoCard}
                        >

                            <View style={styles.pedidoHeader}>

                                <Text style={styles.pedidoTitulo}>
                                    Pedido #{pedido.id}
                                </Text>

                                <Text style={styles.pedidoEstado}>
                                    {pedido.estado}
                                </Text>

                            </View>

                            <Text style={styles.datoPedido}>
                                Fecha: {formatearFecha(pedido.fecha_pedido)}
                            </Text>

                            <View style={styles.separador} />

                            <Text style={styles.sectionTitle}>
                                Productos
                            </Text>

                            {pedido.detalles?.map(detalle => (

                                <View
                                    key={detalle.id}
                                    style={styles.productoFila}
                                >

                                    <Text style={styles.productoNombre}>
                                        {detalle.nombre_producto} x{detalle.cantidad}
                                    </Text>

                                    <Text style={styles.productoPrecio}>
                                        Q{Number(detalle.subtotal).toFixed(2)}
                                    </Text>

                                </View>

                            ))}

                            <View style={styles.totalContainer}>

                                <Text style={styles.totalTexto}>
                                    Total
                                </Text>

                                <Text style={styles.totalPrecio}>
                                    Q{Number(pedido.total).toFixed(2)}
                                </Text>

                            </View>

                            <View style={styles.separador} />

                            {renderizarSeguimiento(pedido)}

                        </View>

                    ))}

                </View>

            </ScrollView>

        </SafeAreaView>

    );

}

const styles = StyleSheet.create({

    areaSegura: {
        flex: 1,
        backgroundColor: '#0B0B0F'
    },

    scrollContainer: {
        flexGrow: 1,
        padding: 24
    },

    container: {
        flex: 1
    },

    headerContainer: {
        marginBottom: 20,
        alignItems: 'center'
    },

    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#F4F4F6',
        letterSpacing: 1
    },

    subtitle: {
        fontSize: 13,
        color: '#A78BFA',
        marginTop: 4,
        letterSpacing: 0.5,
        fontWeight: '600'
    },

    btnActualizar: {
        backgroundColor: '#7C3AED',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 13,
        borderRadius: 12,
        marginBottom: 20,
        gap: 8
    },

    btnActualizarText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 13
    },

    estadoContainer: {
        alignItems: 'center',
        padding: 35
    },

    estadoTexto: {
        color: '#A1A1AA',
        marginTop: 15,
        fontSize: 14
    },

    emptyContainer: {
        backgroundColor: '#13131A',
        borderRadius: 16,
        padding: 30,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#232331'
    },

    emptyTitle: {
        color: '#FACC15',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 10
    },

    emptyText: {
        color: '#9CA3AF',
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 20
    },

    pedidoCard: {
        backgroundColor: '#13131A',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#232331',
        marginBottom: 22
    },

    pedidoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        gap: 8
    },

    pedidoTitulo: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FACC15'
    },

    pedidoEstado: {
        color: '#A78BFA',
        fontSize: 11,
        fontWeight: 'bold',
        backgroundColor: '#1E1B4B',
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 10
    },

    datoPedido: {
        color: '#9CA3AF',
        fontSize: 12,
        marginBottom: 8
    },

    separador: {
        height: 1,
        backgroundColor: '#232331',
        marginVertical: 15
    },

    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#71719A',
        marginBottom: 20,
        textTransform: 'uppercase',
        letterSpacing: 1.2
    },

    productoFila: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        gap: 10
    },

    productoNombre: {
        color: '#D4D4D8',
        fontSize: 12,
        flex: 1
    },

    productoPrecio: {
        color: '#D4D4D8',
        fontSize: 12
    },

    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12
    },

    totalTexto: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold'
    },

    totalPrecio: {
        color: '#FACC15',
        fontSize: 17,
        fontWeight: 'bold'
    },

    stepRow: {
        flexDirection: 'row',
        marginBottom: 16
    },

    indicatorColumn: {
        alignItems: 'center',
        marginRight: 14
    },

    nodeCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#1A1A24',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2D2D42',
        zIndex: 2
    },

    nodeActive: {
        backgroundColor: '#7C3AED',
        borderColor: '#8B5CF6'
    },

    nodeCompleted: {
        backgroundColor: '#059669',
        borderColor: '#10B981'
    },

    connectorLine: {
        width: 2,
        flex: 1,
        backgroundColor: '#232331',
        marginVertical: -4
    },

    lineCompleted: {
        backgroundColor: '#059669'
    },

    stepContentCard: {
        flex: 1,
        backgroundColor: '#1A1A24',
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: '#2D2D42'
    },

    cardActive: {
        borderColor: '#7C3AED',
        backgroundColor: '#1E1B4B'
    },

    stepHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6
    },

    stepTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#E4E4E7',
        flex: 1,
        marginRight: 8
    },

    textActive: {
        color: '#FACC15'
    },

    stepDesc: {
        fontSize: 12,
        color: '#9CA3AF',
        lineHeight: 18
    },

    ledStatus: {
        width: 8,
        height: 8,
        borderRadius: 4
    },

    ledGreen: {
        backgroundColor: '#FACC15',
        shadowColor: '#FACC15',
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 3
    },

    ledBlue: {
        backgroundColor: '#10B981'
    },

    ledOff: {
        backgroundColor: '#4B5563'
    },

    canceladoContainer: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#2A151A',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#7F1D1D'
    },

    canceladoTitulo: {
        color: '#EF4444',
        fontSize: 17,
        fontWeight: 'bold',
        marginTop: 10
    },

    canceladoDescripcion: {
        color: '#D4D4D8',
        fontSize: 12,
        marginTop: 6,
        textAlign: 'center'
    }

});
