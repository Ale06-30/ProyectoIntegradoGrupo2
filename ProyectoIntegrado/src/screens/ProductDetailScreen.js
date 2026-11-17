
import React, { useContext, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CartContext } from '../navigation/CartContext';

const URL_SERVIDOR = 'http://192.168.1.90:3000';

export default function ProductDetailScreen({ route, navigation }) {

    const { producto } = route.params;

    const { agregarAlCarrito } = useContext(CartContext);

    const [productosRecomendados, setProductosRecomendados] = useState([]);

    // OBTENER DIRECCION COMPLETA DE LA IMAGEN
    const obtenerUrlImagen = (ruta) => {
        if (!ruta) return null;

        return ruta.startsWith('http')
            ? ruta
            : `${URL_SERVIDOR}${ruta}`;
    };

    // OBTENER PRODUCTOS DE LA MISMA CATEGORIA
    useEffect(() => {

        const obtenerRecomendados = async () => {

            try {

                const respuesta = await fetch(
                    `${URL_SERVIDOR}/api/productos`
                );

                if (!respuesta.ok) {
                    throw new Error('No se pudieron obtener los productos.');
                }

                const productos = await respuesta.json();

                const recomendados = productos
                    .filter(item =>
                        item.id !== producto.id &&
                        item.categoria &&
                        producto.categoria &&
                        item.categoria.trim().toLowerCase() ===
                        producto.categoria.trim().toLowerCase()
                    )
                    .slice(0, 4);

                setProductosRecomendados(recomendados);

            } catch (error) {

                console.log(
                    'Error al obtener productos recomendados:',
                    error.message
                );

            }
        };

        obtenerRecomendados();

    }, [producto.id, producto.categoria]);

    const manejarAgregar = () => {
        agregarAlCarrito(producto);

        Alert.alert(
            'Producto agregado',
            `${producto.nombre} se agregó correctamente al carrito.`,
            [
                {
                    text: 'Seguir comprando',
                    style: 'cancel'
                },
                {
                    text: 'Ver carrito',
                    onPress: () => navigation.navigate('Carrito')
                }
            ]
        );
    };

    // ABRIR DETALLE DE OTRO PRODUCTO
    const abrirProducto = (item) => {
        navigation.push(route.name, {
            producto: item
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.contenido}>

                <TouchableOpacity
                    style={styles.botonVolver}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.textoVolver}>← Volver a productos</Text>
                </TouchableOpacity>

                <View style={styles.tarjeta}>

                    <View style={styles.imagen}>
                        {obtenerUrlImagen(producto.imagen) ? (
                            <Image
                                source={{
                                    uri: obtenerUrlImagen(producto.imagen)
                                }}
                                style={styles.imagenProducto}
                                resizeMode="contain"
                            />
                        ) : (
                            <Text style={styles.icono}>📦</Text>
                        )}
                    </View>

                    <Text style={styles.nombre}>{producto.nombre}</Text>

                    <Text style={styles.precio}>
                        Q{Number(producto.precio).toFixed(2)}
                    </Text>

                    <Text style={styles.etiqueta}>Descripción</Text>
                    <Text style={styles.descripcion}>
                        {producto.descripcion}
                    </Text>

                    <Text style={styles.etiqueta}>Categoría</Text>
                    <Text style={styles.texto}>
                        {producto.categoria || 'Sin categoría'}
                    </Text>

                    <Text style={styles.etiqueta}>Disponibilidad</Text>
                    <Text style={styles.texto}>
                        {producto.stock > 0
                            ? `${producto.stock} unidades disponibles`
                            : 'Agotado'}
                    </Text>

                    <TouchableOpacity
                        style={[
                            styles.boton,
                            producto.stock <= 0 && styles.botonDesactivado
                        ]}
                        disabled={producto.stock <= 0}
                        onPress={manejarAgregar}
                    >
                        <Text style={styles.textoBoton}>
                            Agregar al carrito
                        </Text>
                    </TouchableOpacity>

                </View>

                {/* PRODUCTOS RECOMENDADOS */}
                {productosRecomendados.length > 0 && (
                    <View style={styles.seccionRecomendados}>

                        <Text style={styles.tituloRecomendados}>
                            Productos recomendados
                        </Text>

                        <Text style={styles.subtituloRecomendados}>
                            Más productos de la categoría {producto.categoria}
                        </Text>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        >
                            {productosRecomendados.map((item) => (

                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.tarjetaRecomendada}
                                    onPress={() => abrirProducto(item)}
                                >

                                    <View style={styles.imagenRecomendada}>
                                        {obtenerUrlImagen(item.imagen) ? (
                                            <Image
                                                source={{
                                                    uri: obtenerUrlImagen(item.imagen)
                                                }}
                                                style={styles.imagenProductoRecomendado}
                                                resizeMode="contain"
                                            />
                                        ) : (
                                            <Text style={styles.iconoRecomendado}>
                                                📦
                                            </Text>
                                        )}
                                    </View>

                                    <Text
                                        style={styles.nombreRecomendado}
                                        numberOfLines={2}
                                    >
                                        {item.nombre}
                                    </Text>

                                    <Text style={styles.precioRecomendado}>
                                        Q{Number(item.precio).toFixed(2)}
                                    </Text>

                                </TouchableOpacity>

                            ))}
                        </ScrollView>

                    </View>
                )}

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B0B0F'
    },
    contenido: {
        padding: 20,
        paddingBottom: 35
    },
    botonVolver: {
        marginBottom: 20
    },
    textoVolver: {
        color: '#C084FC',
        fontSize: 16,
        fontWeight: 'bold'
    },
    tarjeta: {
        backgroundColor: '#17171F',
        borderRadius: 20,
        padding: 22,
        alignItems: 'center'
    },
    imagen: {
        width: 180,
        height: 180,
        borderRadius: 20,
        backgroundColor: '#252535',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        overflow: 'hidden'
    },
    imagenProducto: {
        width: '100%',
        height: '100%'
    },
    icono: {
        fontSize: 75
    },
    nombre: {
        color: '#FFFFFF',
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10
    },
    precio: {
        color: '#C084FC',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 25
    },
    etiqueta: {
        color: '#C084FC',
        fontSize: 16,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginTop: 15
    },
    descripcion: {
        color: '#E5E5E5',
        fontSize: 15,
        alignSelf: 'flex-start',
        marginTop: 6
    },
    texto: {
        color: '#E5E5E5',
        fontSize: 15,
        alignSelf: 'flex-start',
        marginTop: 6
    },
    boton: {
        backgroundColor: '#9333EA',
        padding: 16,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
        marginTop: 30
    },
    botonDesactivado: {
        backgroundColor: '#555555'
    },
    textoBoton: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold'
    },

    // ESTILOS DE PRODUCTOS RECOMENDADOS
    seccionRecomendados: {
        marginTop: 30
    },
    tituloRecomendados: {
        color: '#FFFFFF',
        fontSize: 21,
        fontWeight: 'bold',
        marginBottom: 6
    },
    subtituloRecomendados: {
        color: '#A1A1AA',
        fontSize: 14,
        marginBottom: 18
    },
    tarjetaRecomendada: {
        width: 155,
        backgroundColor: '#17171F',
        borderRadius: 15,
        padding: 12,
        marginRight: 12
    },
    imagenRecomendada: {
        width: '100%',
        height: 125,
        backgroundColor: '#252535',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        overflow: 'hidden'
    },
    imagenProductoRecomendado: {
        width: '100%',
        height: '100%'
    },
    iconoRecomendado: {
        fontSize: 45
    },
    nombreRecomendado: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        minHeight: 35
    },
    precioRecomendado: {
        color: '#C084FC',
        fontSize: 16,
        fontWeight: 'bold'
    }
});
