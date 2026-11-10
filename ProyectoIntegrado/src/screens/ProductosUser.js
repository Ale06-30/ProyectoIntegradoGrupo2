
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

// Agregar su propia IP en esta parte
const URL_API = 'http://192.168.1.62:3000/api/productos';

export default function ProductosUser({ navigation }) {

    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(false);

    // CONSULTAR PRODUCTOS DESDE MYSQL
    const cargarProductos = async () => {
        try {
            setCargando(true);
            setError(false);

            const respuesta = await fetch(URL_API);

            if (!respuesta.ok) {
                throw new Error('Error al consultar productos');
            }

            const datos = await respuesta.json();

            setProductos(datos);

        } catch (error) {
            console.log('[ERROR] Al cargar productos:', error.message);
            setError(true);

        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarProductos();
    }, []);

    // ABRIR DETALLES DEL PRODUCTO
    const manejarDetalles = (producto) => {
        navigation.navigate('ProductDetail', {
            producto: producto
        });
    };

    return (
        <SafeAreaView style={styles.areaSegura}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.container}>

                    {/* ENCABEZADO */}
                    <View style={styles.headerContainer}>

                        <TouchableOpacity
                            style={styles.botonCarrito}
                            onPress={() => navigation.navigate('Carrito')}
                        >
                            <Text style={styles.iconoCarrito}>🛒</Text>
                        </TouchableOpacity>

                        <Text style={styles.title}>Mystery Box</Text>

                        <Text style={styles.subtitle}>
                            Descubre lo inesperado
                        </Text>

                        <View style={styles.decoracion} />
                    </View>

                    {/* TITULO DEL CATALOGO */}
                    <View style={styles.catalogoHeader}>
                        <View>
                            <Text style={styles.sectionTitle}>
                                Nuestras Mystery Box
                            </Text>

                            <Text style={styles.sectionSubtitle}>
                                Encuentra tu próxima sorpresa
                            </Text>
                        </View>

                        <View style={styles.productCount}>
                            <Text style={styles.countText}>
                                {productos.length} productos
                            </Text>
                        </View>
                    </View>

                    {/* CATALOGO DE PRODUCTOS */}
                    <View style={styles.productsContainer}>

                        {cargando ? (
                            <View style={styles.mensajeContainer}>
                                <ActivityIndicator
                                    size="large"
                                    color="#A78BFA"
                                />
                                <Text style={styles.mensajeTexto}>
                                    Cargando productos...
                                </Text>
                            </View>

                        ) : error ? (
                            <View style={styles.mensajeContainer}>
                                <Text style={styles.mensajeTexto}>
                                    No se pudieron cargar los productos.
                                </Text>

                                <TouchableOpacity
                                    style={styles.btnDetalles}
                                    onPress={cargarProductos}
                                >
                                    <Text style={styles.btnText}>
                                        Intentar nuevamente
                                    </Text>
                                </TouchableOpacity>
                            </View>

                        ) : productos.length === 0 ? (
                            <View style={styles.mensajeContainer}>
                                <Text style={styles.mensajeTexto}>
                                    Todavía no hay productos disponibles.
                                </Text>
                            </View>

                        ) : (
                            productos.map((producto) => (
                                <View
                                    key={producto.id}
                                    style={styles.productCard}
                                >

                                    {/* ESPACIO PARA LA IMAGEN */}
                                    <View style={styles.imageContainer}>
                                        <Text style={styles.boxEmoji}>
                                            📦
                                        </Text>

                                        <Text style={styles.imageText}>
                                            MYSTERY BOX
                                        </Text>
                                    </View>

                                    {/* INFORMACION */}
                                    <View style={styles.productInfo}>
                                        <Text style={styles.productName}>
                                            {producto.nombre}
                                        </Text>

                                        <Text style={styles.productDesc}>
                                            {producto.descripcion}
                                        </Text>

                                        <Text style={styles.productPrice}>
                                            Q{Number(producto.precio).toFixed(2)}
                                        </Text>
                                    </View>

                                    {/* BOTON */}
                                    <TouchableOpacity
                                        style={styles.btnDetalles}
                                        onPress={() => manejarDetalles(producto)}
                                    >
                                        <Text style={styles.btnText}>
                                            Ver detalles
                                        </Text>
                                    </TouchableOpacity>

                                </View>
                            ))
                        )}

                    </View>

                    {/* PIE DE PAGINA */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            MYSTERY BOX
                        </Text>

                        <Text style={styles.footerSubtitle}>
                            Cada caja es una nueva sorpresa.
                        </Text>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    areaSegura: {
        flex: 1,
        backgroundColor: '#0B0B0F',
    },

    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 18,
        paddingBottom: 25,
    },

    container: {
        flex: 1,
    },

    // ENCABEZADO
    headerContainer: {
        alignItems: 'center',
        paddingTop: 35,
        paddingBottom: 30,
    },

    botonCarrito: {
        position: 'absolute',
        right: 0,
        top: 30,
        width: 45,
        height: 45,
        backgroundColor: '#21172F',
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#392653',
        zIndex: 1,
    },

    iconoCarrito: {
        fontSize: 22,
    },

    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#F4F4F6',
        letterSpacing: 1.5,
    },

    subtitle: {
        fontSize: 14,
        color: '#A78BFA',
        marginTop: 7,
        fontWeight: '600',
        letterSpacing: 1,
    },

    decoracion: {
        width: 55,
        height: 3,
        backgroundColor: '#7C3AED',
        borderRadius: 5,
        marginTop: 16,
    },

    // TITULO DEL CATALOGO
    catalogoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },

    sectionTitle: {
        fontSize: 19,
        fontWeight: '800',
        color: '#F4F4F6',
    },

    sectionSubtitle: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 5,
    },

    productCount: {
        backgroundColor: '#21172F',
        borderRadius: 20,
        paddingHorizontal: 11,
        paddingVertical: 7,
    },

    countText: {
        color: '#C4A2FF',
        fontSize: 11,
        fontWeight: '700',
    },

    // PRODUCTOS
    productsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },

    productCard: {
        width: '48.5%',
        backgroundColor: '#171720',
        borderRadius: 15,
        padding: 11,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#2D2D42',
    },

    imageContainer: {
        height: 125,
        backgroundColor: '#21172F',
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#392653',
    },

    boxEmoji: {
        fontSize: 43,
        marginBottom: 7,
    },

    imageText: {
        color: '#A78BFA',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.5,
    },

    // INFORMACION
    productInfo: {
        flex: 1,
        marginBottom: 12,
    },

    productName: {
        fontSize: 14,
        fontWeight: '800',
        color: '#F4F4F6',
        marginBottom: 7,
        minHeight: 35,
    },

    productDesc: {
        fontSize: 11,
        color: '#9CA3AF',
        lineHeight: 16,
        minHeight: 65,
    },

    productPrice: {
        fontSize: 17,
        fontWeight: '900',
        color: '#FACC15',
        marginTop: 10,
    },

    // BOTON
    btnDetalles: {
        backgroundColor: '#7C3AED',
        paddingVertical: 11,
        borderRadius: 9,
        alignItems: 'center',
        marginTop: 5,
    },

    btnText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '800',
    },

    // MENSAJES
    mensajeContainer: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 35,
    },

    mensajeTexto: {
        color: '#A78BFA',
        fontSize: 13,
        textAlign: 'center',
        marginTop: 12,
    },

    // PIE DE PAGINA
    footer: {
        alignItems: 'center',
        marginTop: 20,
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: '#292936',
    },

    footerText: {
        color: '#A78BFA',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 2,
    },

    footerSubtitle: {
        color: '#77717F',
        fontSize: 11,
        marginTop: 6,
    },

});
