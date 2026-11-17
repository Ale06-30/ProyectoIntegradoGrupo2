
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
import { Ionicons } from '@expo/vector-icons';

const API_URL = 'http://192.168.1.90:3000';

export default function AnalisisScreen() {

    const [analisis, setAnalisis] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [actualizando, setActualizando] = useState(false);
    const [error, setError] = useState(false);

    const cargarAnalisis = useCallback(async (actualizar = false) => {
        try {
            if (actualizar) {
                setActualizando(true);
            } else {
                setCargando(true);
            }

            setError(false);

            const respuesta = await fetch(
                `${API_URL}/api/admin/analisis-inventario`
            );

            if (!respuesta.ok) {
                throw new Error('No se pudo obtener el análisis');
            }

            const datos = await respuesta.json();

            setAnalisis(datos);

        } catch (err) {
            console.log('[ERROR] Al cargar análisis:', err.message);
            setError(true);

            Alert.alert(
                'Error',
                'No se pudo conectar con el servidor para obtener el análisis.'
            );

        } finally {
            setCargando(false);
            setActualizando(false);
        }
    }, []);

    useEffect(() => {
        cargarAnalisis();
    }, [cargarAnalisis]);

    const TarjetaResumen = ({ titulo, cantidad, icono, color, fondo }) => (
        <View style={[styles.resumenCard, { backgroundColor: fondo }]}>
            <Ionicons name={icono} size={27} color={color} />

            <Text style={[styles.resumenCantidad, { color }]}>
                {cantidad}
            </Text>

            <Text style={styles.resumenTitulo}>{titulo}</Text>
        </View>
    );

    const ProductoItem = ({ producto }) => (
        <View style={styles.productoItem}>
            <View style={styles.productoIcono}>
                <Ionicons name="cube-outline" size={23} color="#4A5D4A" />
            </View>

            <View style={styles.productoInfo}>
                <Text style={styles.productoNombre}>
                    {producto.nombre}
                </Text>

                <Text style={styles.productoCategoria}>
                    {producto.categoria || 'Sin categoría'}
                </Text>
            </View>

            <Text style={styles.productoStock}>
                {Number(producto.stock)} unidades
            </Text>
        </View>
    );

    const SeccionProductos = ({ titulo, productos, color }) => (
        <View style={styles.seccion}>
            <View style={styles.seccionHeader}>
                <Text style={styles.seccionTitulo}>{titulo}</Text>

                <Text style={[styles.seccionCantidad, { color }]}>
                    {productos.length}
                </Text>
            </View>

            {productos.length === 0 ? (
                <Text style={styles.sinProductos}>
                    No hay productos en esta categoría.
                </Text>
            ) : (
                productos.map(producto => (
                    <ProductoItem
                        key={producto.id}
                        producto={producto}
                    />
                ))
            )}
        </View>
    );

    if (cargando) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.cargandoContainer}>
                    <ActivityIndicator size="large" color="#4A5D4A" />
                    <Text style={styles.cargandoTexto}>
                        Analizando inventario...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error && !analisis) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Ionicons
                        name="cloud-offline-outline"
                        size={55}
                        color="#9A5A55"
                    />

                    <Text style={styles.errorTitulo}>
                        No se pudo cargar el análisis
                    </Text>

                    <Text style={styles.errorTexto}>
                        Comprueba que el servidor esté funcionando.
                    </Text>

                    <TouchableOpacity
                        style={styles.botonActualizar}
                        onPress={() => cargarAnalisis()}
                    >
                        <Text style={styles.botonActualizarTexto}>
                            Intentar nuevamente
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const resumen = analisis.resumen;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.header}>
                    <View style={styles.headerIcono}>
                        <Ionicons
                            name="analytics-outline"
                            size={38}
                            color="#394739"
                        />
                    </View>

                    <Text style={styles.headerTitulo}>
                        Análisis de inventario
                    </Text>

                    <Text style={styles.headerSubtitulo}>
                        Control y estado de tus existencias
                    </Text>
                </View>

                <View style={styles.contenido}>

                    <View style={styles.tituloSeccion}>
                        <Text style={styles.tituloPrincipal}>
                            Resumen general
                        </Text>

                        <Text style={styles.descripcion}>
                            Estado actual de los productos
                        </Text>
                    </View>

                    <View style={styles.resumenGrid}>
                        <TarjetaResumen
                            titulo="Agotados"
                            cantidad={resumen.agotados}
                            icono="alert-circle-outline"
                            color="#9A5A55"
                            fondo="#F4E6E4"
                        />

                        <TarjetaResumen
                            titulo="Stock bajo"
                            cantidad={resumen.stockBajo}
                            icono="warning-outline"
                            color="#A87825"
                            fondo="#FFF1D8"
                        />

                        <TarjetaResumen
                            titulo="Suficientes"
                            cantidad={resumen.stockSuficiente}
                            icono="checkmark-circle-outline"
                            color="#4A5D4A"
                            fondo="#E5EFE2"
                        />

                        <TarjetaResumen
                            titulo="Total"
                            cantidad={resumen.totalProductos}
                            icono="cube-outline"
                            color="#555D78"
                            fondo="#E8EAF1"
                        />
                    </View>

                    <View style={styles.seccion}>
                        <Text style={styles.tituloPrincipal}>
                            Recomendaciones
                        </Text>

                        <Text style={styles.descripcion}>
                            Productos que necesitan atención
                        </Text>

                        {analisis.recomendaciones.length === 0 ? (
                            <View style={styles.mensajeCorrecto}>
                                <Ionicons
                                    name="checkmark-circle"
                                    size={25}
                                    color="#4A5D4A"
                                />

                                <Text style={styles.mensajeCorrectoTexto}>
                                    Todos los productos tienen stock suficiente.
                                </Text>
                            </View>
                        ) : (
                            analisis.recomendaciones.map(item => (
                                <View
                                    key={item.id}
                                    style={styles.recomendacionCard}
                                >
                                    <View style={styles.recomendacionHeader}>
                                        <Text style={styles.recomendacionNombre}>
                                            {item.producto}
                                        </Text>

                                        <View style={[
                                            styles.prioridad,
                                            item.prioridad === 'Alta'
                                                ? styles.prioridadAlta
                                                : styles.prioridadMedia
                                        ]}>
                                            <Text style={[
                                                styles.prioridadTexto,
                                                item.prioridad === 'Alta'
                                                    ? styles.textoAlta
                                                    : styles.textoMedia
                                            ]}>
                                                {item.prioridad}
                                            </Text>
                                        </View>
                                    </View>

                                    <Text style={styles.recomendacionStock}>
                                        Stock actual: {item.stock} unidades
                                    </Text>

                                    <Text style={styles.recomendacionTexto}>
                                        {item.recomendacion}
                                    </Text>
                                </View>
                            ))
                        )}
                    </View>

                    <SeccionProductos
                        titulo="Productos agotados"
                        productos={analisis.productosAgotados}
                        color="#9A5A55"
                    />

                    <SeccionProductos
                        titulo="Productos con stock bajo"
                        productos={analisis.productosStockBajo}
                        color="#A87825"
                    />

                    <SeccionProductos
                        titulo="Productos con stock suficiente"
                        productos={analisis.productosStockSuficiente}
                        color="#4A5D4A"
                    />

                    <TouchableOpacity
                        style={styles.botonActualizar}
                        onPress={() => cargarAnalisis(true)}
                        disabled={actualizando}
                    >
                        {actualizando ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <>
                                <Ionicons
                                    name="refresh-outline"
                                    size={20}
                                    color="#FFFFFF"
                                />

                                <Text style={styles.botonActualizarTexto}>
                                    Actualizar análisis
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F0EA'
    },

    scrollContent: {
        paddingBottom: 30
    },

    header: {
        height: 220,
        backgroundColor: '#D8DED2',
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },

    headerIcono: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#F2F0EA',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12
    },

    headerTitulo: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#394739'
    },

    headerSubtitulo: {
        fontSize: 14,
        color: '#667064',
        marginTop: 5
    },

    contenido: {
        paddingHorizontal: 18
    },

    tituloSeccion: {
        marginBottom: 15
    },

    tituloPrincipal: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#394739'
    },

    descripcion: {
        fontSize: 13,
        color: '#777D72',
        marginTop: 4,
        marginBottom: 12
    },

    resumenGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 25
    },

    resumenCard: {
        width: '48%',
        borderRadius: 18,
        padding: 17,
        marginBottom: 12
    },

    resumenCantidad: {
        fontSize: 29,
        fontWeight: 'bold',
        marginTop: 9
    },

    resumenTitulo: {
        fontSize: 14,
        color: '#50574D',
        marginTop: 3
    },

    seccion: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 18,
        marginBottom: 17,
        elevation: 3
    },

    seccionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 13
    },

    seccionTitulo: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#394739'
    },

    seccionCantidad: {
        fontSize: 18,
        fontWeight: 'bold'
    },

    productoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEA'
    },

    productoIcono: {
        width: 43,
        height: 43,
        borderRadius: 22,
        backgroundColor: '#E5EFE2',
        alignItems: 'center',
        justifyContent: 'center'
    },

    productoInfo: {
        flex: 1,
        marginLeft: 11
    },

    productoNombre: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#394739'
    },

    productoCategoria: {
        fontSize: 12,
        color: '#888D84',
        marginTop: 3
    },

    productoStock: {
        fontSize: 12,
        fontWeight: '600',
        color: '#555D50'
    },

    sinProductos: {
        color: '#888D84',
        fontSize: 13,
        paddingVertical: 12
    },

    recomendacionCard: {
        backgroundColor: '#F8F7F3',
        borderRadius: 13,
        padding: 14,
        marginTop: 10
    },

    recomendacionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    recomendacionNombre: {
        flex: 1,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#394739',
        marginRight: 8
    },

    prioridad: {
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5
    },

    prioridadAlta: {
        backgroundColor: '#F4E6E4'
    },

    prioridadMedia: {
        backgroundColor: '#FFF1D8'
    },

    prioridadTexto: {
        fontSize: 11,
        fontWeight: 'bold'
    },

    textoAlta: {
        color: '#9A5A55'
    },

    textoMedia: {
        color: '#A87825'
    },

    recomendacionStock: {
        fontSize: 12,
        color: '#777D72',
        marginTop: 8
    },

    recomendacionTexto: {
        fontSize: 13,
        color: '#50574D',
        marginTop: 5,
        lineHeight: 19
    },

    mensajeCorrecto: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E5EFE2',
        borderRadius: 13,
        padding: 13,
        marginTop: 10
    },

    mensajeCorrectoTexto: {
        flex: 1,
        color: '#4A5D4A',
        fontSize: 13,
        marginLeft: 9
    },

    botonActualizar: {
        backgroundColor: '#4A5D4A',
        borderRadius: 14,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 20
    },

    botonActualizarTexto: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 8
    },

    cargandoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    cargandoTexto: {
        marginTop: 12,
        color: '#667064',
        fontSize: 15
    },

    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 25
    },

    errorTitulo: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#394739',
        marginTop: 15
    },

    errorTexto: {
        fontSize: 14,
        color: '#777D72',
        textAlign: 'center',
        marginTop: 8
    }
});
