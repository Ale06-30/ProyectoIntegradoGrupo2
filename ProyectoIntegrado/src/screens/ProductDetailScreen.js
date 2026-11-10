
import React, { useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CartContext } from '../navigation/CartContext';

export default function ProductDetailScreen({ route, navigation }) {

    const { producto } = route.params;

    const { agregarAlCarrito } = useContext(CartContext);

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
                        <Text style={styles.icono}>📦</Text>
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
        marginBottom: 20
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
    }
});
