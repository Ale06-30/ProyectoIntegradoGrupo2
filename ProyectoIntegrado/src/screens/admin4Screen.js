
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

const API_URL = 'http://192.168.1.62:3000/api/pedidos';

export default function admin4Screen({ navigation }) {
    const [filtro, setFiltro] = useState('Todos');
    const [pedidos, setPedidos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [actualizando, setActualizando] = useState(false);
    const [error, setError] = useState('');

    const filtros = [
        'Todos',
        'Pendiente',
        'En preparación',
        'Enviado',
        'Entregado',
        'Cancelado'
    ];

    // CONSULTAR PEDIDOS DESDE MYSQL
    const cargarPedidos = useCallback(async (recarga = false) => {
        try {
            if (recarga) {
                setActualizando(true);
            } else {
                setCargando(true);
            }

            setError('');

            const respuesta = await fetch(API_URL);

            if (!respuesta.ok) {
                throw new Error('No se pudieron consultar los pedidos');
            }

            const datos = await respuesta.json();

            if (!Array.isArray(datos)) {
                throw new Error('La respuesta del servidor no es válida');
            }

            setPedidos(datos);

        } catch (err) {
            console.log('[ERROR] Pedidos:', err.message);
            setError(err.message);

        } finally {
            setCargando(false);
            setActualizando(false);
        }
    }, []);

    // CARGAR AL ABRIR LA PANTALLA
    useEffect(() => {
        cargarPedidos();
    }, [cargarPedidos]);

    // ACTUALIZAR ESTADO DEL PEDIDO
    const actualizarEstado = (pedido, nuevoEstado) => {
        Alert.alert(
            'Actualizar pedido',
            `¿Deseas cambiar el pedido #${pedido.id} a "${nuevoEstado}"?`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Confirmar',
                    onPress: async () => {
                        try {
                            const respuesta = await fetch(
                                `${API_URL}/${pedido.id}/estado`,
                                {
                                    method: 'PATCH',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        estado: nuevoEstado
                                    })
                                }
                            );

                            const datos = await respuesta.json();

                            if (!respuesta.ok) {
                                throw new Error(
                                    datos.mensaje ||
                                    'No se pudo actualizar el pedido'
                                );
                            }

                            Alert.alert(
                                'Pedido actualizado',
                                datos.mensaje
                            );

                            await cargarPedidos(true);

                        } catch (error) {
                            console.log(
                                '[ERROR] Estado del pedido:',
                                error.message
                            );

                            Alert.alert('Error', error.message);
                        }
                    }
                }
            ]
        );
    };

    // CONTAR PEDIDOS POR ESTADO
    const contarEstado = (estado) => {
        return pedidos.filter(
            pedido => pedido.estado === estado
        ).length;
    };

    // APLICAR FILTRO
    const pedidosFiltrados = pedidos.filter(pedido => {
        return filtro === 'Todos' || pedido.estado === filtro;
    });

    // FORMATEAR FECHA
    const formatearFecha = (fecha) => {
        if (!fecha) return 'Fecha no disponible';

        const fechaObjeto = new Date(fecha);

        if (isNaN(fechaObjeto.getTime())) {
            return 'Fecha no disponible';
        }

        return fechaObjeto.toLocaleString();
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >

                {/* ENCABEZADO */}
                <View style={styles.header}>
                    <Text style={styles.headerIcon}>🛍️</Text>
                    <Text style={styles.headerTitle}>RoboArm</Text>
                    <Text style={styles.headerSubtitle}>
                        Gestión de pedidos
                    </Text>
                </View>

                {/* RESUMEN */}
                <View style={styles.resumenContainer}>
                    <View style={styles.resumenCard}>
                        <Text style={styles.resumenNumero}>
                            {contarEstado('Pendiente')}
                        </Text>
                        <Text style={styles.resumenTexto}>
                            Pendientes
                        </Text>
                    </View>

                    <View style={styles.resumenCard}>
                        <Text style={styles.resumenNumero}>
                            {contarEstado('En preparación')}
                        </Text>
                        <Text style={styles.resumenTexto}>
                            En preparación
                        </Text>
                    </View>

                    <View style={styles.resumenCard}>
                        <Text style={styles.resumenNumero}>
                            {contarEstado('Enviado')}
                        </Text>
                        <Text style={styles.resumenTexto}>
                            Enviados
                        </Text>
                    </View>
                </View>

                {/* TITULO Y ACTUALIZAR */}
                <View style={styles.tituloContainer}>
                    <Text style={styles.sectionTitle}>
                        Pedidos registrados
                    </Text>

                    <TouchableOpacity
                        style={styles.actualizarButton}
                        onPress={() => cargarPedidos(true)}
                        disabled={actualizando}
                    >
                        <Text style={styles.actualizarTexto}>
                            {actualizando
                                ? 'Actualizando...'
                                : '↻ Actualizar'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* FILTROS */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filtrosContainer}
                >
                    {filtros.map((item) => (
                        <TouchableOpacity
                            key={item}
                            style={[
                                styles.filtroButton,
                                filtro === item && styles.filtroActivo
                            ]}
                            onPress={() => setFiltro(item)}
                        >
                            <Text
                                style={[
                                    styles.filtroTexto,
                                    filtro === item && styles.filtroTextoActivo
                                ]}
                            >
                                {item}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* CARGANDO */}
                {cargando && (
                    <View style={styles.estadoContainer}>
                        <ActivityIndicator
                            size="large"
                            color="#A78BFA"
                        />
                        <Text style={styles.estadoTexto}>
                            Cargando pedidos...
                        </Text>
                    </View>
                )}

                {/* ERROR */}
                {!cargando && error !== '' && (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>⚠️</Text>

                        <Text style={styles.emptyTitle}>
                            Error de conexión
                        </Text>

                        <Text style={styles.emptyText}>
                            {error}
                        </Text>

                        <TouchableOpacity
                            style={styles.reintentarButton}
                            onPress={() => cargarPedidos()}
                        >
                            <Text style={styles.reintentarTexto}>
                                Reintentar
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* LISTA VACIA */}
                {!cargando &&
                    error === '' &&
                    pedidosFiltrados.length === 0 && (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyIcon}>📦</Text>

                            <Text style={styles.emptyTitle}>
                                {pedidos.length === 0
                                    ? 'Sin pedidos registrados'
                                    : 'No hay pedidos en este estado'}
                            </Text>

                            <Text style={styles.emptyText}>
                                {pedidos.length === 0
                                    ? 'Aquí aparecerán las compras realizadas por los usuarios de Mystery Box.'
                                    : 'No se encontraron pedidos con el filtro seleccionado.'}
                            </Text>

                            <Text style={styles.emptySubtext}>
                                Los pedidos se consultan directamente desde MySQL.
                            </Text>
                        </View>
                    )}

                {/* LISTA DE PEDIDOS */}
                {!cargando &&
                    error === '' &&
                    pedidosFiltrados.map((pedido) => (
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
                                Cliente: {pedido.correo}
                            </Text>

                            <Text style={styles.datoPedido}>
                                Fecha: {formatearFecha(pedido.fecha_pedido)}
                            </Text>

                            <View style={styles.separador} />

                            <Text style={styles.productosTitulo}>
                                Productos
                            </Text>

                            {pedido.detalles &&
                                pedido.detalles.length > 0 ? (
                                    pedido.detalles.map((detalle) => (
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
                                    ))
                                ) : (
                                    <Text style={styles.datoPedido}>
                                        Sin detalles disponibles
                                    </Text>
                                )}

                            <View style={styles.separador} />

                            {/* TOTAL */}
                            <View style={styles.totalContainer}>
                                <Text style={styles.totalTexto}>
                                    Total
                                </Text>

                                <Text style={styles.totalPrecio}>
                                    Q{Number(pedido.total).toFixed(2)}
                                </Text>
                            </View>

                            {/* BOTONES PARA ACTUALIZAR ESTADO */}
                            {pedido.estado !== 'Entregado' &&
                                pedido.estado !== 'Cancelado' && (
                                    <>
                                        <View style={styles.separador} />

                                        <Text style={styles.productosTitulo}>
                                            Gestionar pedido
                                        </Text>

                                        <View style={styles.botonesEstado}>
                                            <TouchableOpacity
                                                style={styles.botonEntregado}
                                                onPress={() =>
                                                    actualizarEstado(
                                                        pedido,
                                                        'Entregado'
                                                    )
                                                }
                                            >
                                                <Text style={styles.textoBotonEstado}>
                                                    ✓ Entregado
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={styles.botonCancelado}
                                                onPress={() =>
                                                    actualizarEstado(
                                                        pedido,
                                                        'Cancelado'
                                                    )
                                                }
                                            >
                                                <Text style={styles.textoBotonEstado}>
                                                    ✕ Cancelar
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                )}
                        </View>
                    ))}

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B0B0F'
    },

    scroll: {
        paddingBottom: 30
    },

    header: {
        height: 220,
        backgroundColor: '#18181B',
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 25
    },

    headerIcon: {
        fontSize: 45,
        marginBottom: 8
    },

    headerTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#FACC15'
    },

    headerSubtitle: {
        fontSize: 15,
        color: '#A1A1AA',
        marginTop: 5
    },

    resumenContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        marginBottom: 30
    },

    resumenCard: {
        backgroundColor: '#18181B',
        width: '31%',
        paddingVertical: 20,
        borderRadius: 18,
        alignItems: 'center',
        elevation: 4
    },

    resumenNumero: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#A78BFA'
    },

    resumenTexto: {
        color: '#D4D4D8',
        fontSize: 11,
        textAlign: 'center',
        marginTop: 7
    },

    tituloContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        marginBottom: 15
    },

    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold'
    },

    actualizarButton: {
        backgroundColor: '#27272A',
        paddingVertical: 9,
        paddingHorizontal: 12,
        borderRadius: 12
    },

    actualizarTexto: {
        color: '#A78BFA',
        fontSize: 12,
        fontWeight: 'bold'
    },

    filtrosContainer: {
        paddingLeft: 15,
        marginBottom: 25
    },

    filtroButton: {
        backgroundColor: '#27272A',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 8
    },

    filtroActivo: {
        backgroundColor: '#7C3AED'
    },

    filtroTexto: {
        color: '#A1A1AA',
        fontSize: 12,
        fontWeight: '600'
    },

    filtroTextoActivo: {
        color: '#FFFFFF'
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
        backgroundColor: '#18181B',
        marginHorizontal: 18,
        padding: 30,
        borderRadius: 22,
        alignItems: 'center',
        elevation: 4
    },

    emptyIcon: {
        fontSize: 55,
        marginBottom: 15
    },

    emptyTitle: {
        color: '#A78BFA',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center'
    },

    emptyText: {
        color: '#D4D4D8',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 22
    },

    emptySubtext: {
        color: '#71717A',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 15,
        lineHeight: 19
    },

    reintentarButton: {
        backgroundColor: '#7C3AED',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 12,
        marginTop: 20
    },

    reintentarTexto: {
        color: '#FFFFFF',
        fontWeight: 'bold'
    },

    pedidoCard: {
        backgroundColor: '#18181B',
        marginHorizontal: 18,
        marginBottom: 18,
        padding: 20,
        borderRadius: 20,
        elevation: 4
    },

    pedidoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15
    },

    pedidoTitulo: {
        color: '#FACC15',
        fontSize: 18,
        fontWeight: 'bold'
    },

    pedidoEstado: {
        color: '#A78BFA',
        fontSize: 12,
        fontWeight: 'bold',
        backgroundColor: '#27272A',
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 10
    },

    datoPedido: {
        color: '#A1A1AA',
        fontSize: 13,
        marginBottom: 8
    },

    separador: {
        height: 1,
        backgroundColor: '#3F3F46',
        marginVertical: 13
    },

    productosTitulo: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 12
    },

    productoFila: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },

    productoNombre: {
        color: '#D4D4D8',
        fontSize: 13,
        flex: 1,
        marginRight: 10
    },

    productoPrecio: {
        color: '#D4D4D8',
        fontSize: 13
    },

    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    totalTexto: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold'
    },

    totalPrecio: {
        color: '#FACC15',
        fontSize: 19,
        fontWeight: 'bold'
    },

    // NUEVOS ESTILOS PARA GESTIONAR PEDIDOS
    botonesEstado: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        gap: 10
    },

    botonEntregado: {
        flex: 1,
        backgroundColor: '#166534',
        paddingVertical: 13,
        borderRadius: 12,
        alignItems: 'center'
    },

    botonCancelado: {
        flex: 1,
        backgroundColor: '#991B1B',
        paddingVertical: 13,
        borderRadius: 12,
        alignItems: 'center'
    },

    textoBotonEstado: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold'
    }
});
