
import React, { useContext, useState } from 'react';
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
import { auth } from '../firebase/FirebaseConfig';

const API_URL = 'http://192.168.1.62:3000';

export default function CarritoScreen({ navigation }) {

    const {
        carrito,
        aumentarCantidad,
        disminuirCantidad,
        eliminarDelCarrito,
        vaciarCarrito
    } = useContext(CartContext);

    const [cargando, setCargando] = useState(false);

    const total = carrito.reduce(
        (suma, producto) =>
            suma + Number(producto.precio) * producto.cantidad,
        0
    );

    // CONFIRMAR Y REGISTRAR PEDIDO
    const confirmarPedido = async () => {

        if (carrito.length === 0) {
            Alert.alert('Carrito vacío', 'Agrega productos antes de confirmar.');
            return;
        }

        const usuario = auth.currentUser;

        if (!usuario || !usuario.email) {
            Alert.alert(
                'Sesión no encontrada',
                'Debes iniciar sesión para realizar un pedido.'
            );
            return;
        }

        try {
            setCargando(true);

            const respuesta = await fetch(`${API_URL}/api/pedidos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    correo: usuario.email,
                    productos: carrito.map(producto => ({
                        id: producto.id,
                        cantidad: producto.cantidad
                    }))
                })
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    datos.mensaje || 'No se pudo registrar el pedido.'
                );
            }

            // VACIAR CARRITO SOLO SI EL PEDIDO SE REGISTRÓ
            vaciarCarrito();

            Alert.alert(
                '¡Pedido registrado!',
                `Tu pedido número ${datos.id} se registró correctamente.\n\nTotal: Q${Number(datos.total).toFixed(2)}\nEstado: ${datos.estado}`,
                [
                    {
                        text: 'Aceptar',
                        onPress: () => navigation.navigate('ProductosUser')
                    }
                ]
            );

        } catch (error) {
            console.log('[ERROR] Al confirmar pedido:', error.message);

            Alert.alert(
                'Error al realizar el pedido',
                error.message || 'No fue posible conectar con el servidor.'
            );

        } finally {
            setCargando(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.contenido}
                showsVerticalScrollIndicator={false}
            >

                {/* ENCABEZADO */}
                <View style={styles.header}>
                    <Text style={styles.titulo}>Mi carrito</Text>
                    <Text style={styles.subtitulo}>
                        Tus próximas sorpresas
                    </Text>
                </View>

                {/* CARRITO VACIO */}
                {carrito.length === 0 ? (

                    <View style={styles.vacio}>
                        <Text style={styles.iconoVacio}>🛒</Text>

                        <Text style={styles.textoVacio}>
                            Tu carrito está vacío
                        </Text>

                        <Text style={styles.descripcionVacio}>
                            Explora nuestras Mystery Box y encuentra tu próxima sorpresa.
                        </Text>

                        <TouchableOpacity
                            style={styles.botonComprar}
                            onPress={() => navigation.navigate('ProductosUser')}
                        >
                            <Text style={styles.textoBoton}>
                                Ver productos
                            </Text>
                        </TouchableOpacity>
                    </View>

                ) : (

                    <>
                        {/* LISTA DE PRODUCTOS */}
                        <View style={styles.listaProductos}>

                            {carrito.map((producto) => (

                                <View
                                    key={producto.id}
                                    style={styles.tarjeta}
                                >

                                    <View style={styles.imagen}>
                                        <Text style={styles.icono}>📦</Text>
                                    </View>

                                    <View style={styles.informacion}>

                                        <Text style={styles.nombre}>
                                            {producto.nombre}
                                        </Text>

                                        <Text style={styles.precio}>
                                            Q{Number(producto.precio).toFixed(2)}
                                        </Text>

                                        <View style={styles.controles}>

                                            <TouchableOpacity
                                                style={styles.botonCantidad}
                                                onPress={() => disminuirCantidad(producto.id)}
                                            >
                                                <Text style={styles.textoCantidad}>−</Text>
                                            </TouchableOpacity>

                                            <Text style={styles.cantidad}>
                                                {producto.cantidad}
                                            </Text>

                                            <TouchableOpacity
                                                style={styles.botonCantidad}
                                                disabled={producto.cantidad >= producto.stock}
                                                onPress={() => aumentarCantidad(producto.id)}
                                            >
                                                <Text style={styles.textoCantidad}>+</Text>
                                            </TouchableOpacity>

                                        </View>

                                        <Text style={styles.subtotal}>
                                            Subtotal: Q{(
                                                Number(producto.precio) *
                                                producto.cantidad
                                            ).toFixed(2)}
                                        </Text>

                                    </View>

                                    <TouchableOpacity
                                        style={styles.botonEliminar}
                                        onPress={() => eliminarDelCarrito(producto.id)}
                                    >
                                        <Text style={styles.textoEliminar}>
                                            ✕
                                        </Text>
                                    </TouchableOpacity>

                                </View>

                            ))}

                        </View>

                        {/* RESUMEN */}
                        <View style={styles.resumen}>

                            <Text style={styles.tituloResumen}>
                                Resumen de compra
                            </Text>

                            <View style={styles.filaResumen}>
                                <Text style={styles.textoResumen}>
                                    Productos
                                </Text>

                                <Text style={styles.textoResumen}>
                                    {carrito.reduce(
                                        (suma, producto) => suma + producto.cantidad,
                                        0
                                    )}
                                </Text>
                            </View>

                            <View style={styles.divisor} />

                            <View style={styles.filaTotal}>
                                <Text style={styles.textoTotal}>
                                    Total
                                </Text>

                                <Text style={styles.precioTotal}>
                                    Q{total.toFixed(2)}
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={[
                                    styles.botonConfirmar,
                                    cargando && styles.botonDeshabilitado
                                ]}
                                onPress={confirmarPedido}
                                disabled={cargando}
                            >
                                <Text style={styles.textoBoton}>
                                    {cargando ? 'Registrando pedido...' : 'Confirmar pedido'}
                                </Text>
                            </TouchableOpacity>

                        </View>

                    </>
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

    header: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30
    },

    titulo: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: '900'
    },

    subtitulo: {
        color: '#A78BFA',
        fontSize: 14,
        marginTop: 7
    },

    vacio: {
        alignItems: 'center',
        backgroundColor: '#17171F',
        borderRadius: 18,
        padding: 30,
        marginTop: 20
    },

    iconoVacio: {
        fontSize: 65,
        marginBottom: 15
    },

    textoVacio: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold'
    },

    descripcionVacio: {
        color: '#9CA3AF',
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 20,
        marginTop: 10
    },

    botonComprar: {
        backgroundColor: '#7C3AED',
        padding: 14,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        marginTop: 25
    },

    listaProductos: {
        gap: 15
    },

    tarjeta: {
        flexDirection: 'row',
        backgroundColor: '#17171F',
        borderRadius: 15,
        padding: 13,
        borderWidth: 1,
        borderColor: '#2D2D42',
        alignItems: 'center'
    },

    imagen: {
        width: 75,
        height: 85,
        backgroundColor: '#21172F',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },

    icono: {
        fontSize: 35
    },

    informacion: {
        flex: 1,
        marginLeft: 12
    },

    nombre: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold'
    },

    precio: {
        color: '#C084FC',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 5
    },

    controles: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },

    botonCantidad: {
        backgroundColor: '#35234D',
        width: 28,
        height: 28,
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center'
    },

    textoCantidad: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold'
    },

    cantidad: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
        marginHorizontal: 13
    },

    subtotal: {
        color: '#9CA3AF',
        fontSize: 11,
        marginTop: 7
    },

    botonEliminar: {
        padding: 8,
        alignSelf: 'flex-start'
    },

    textoEliminar: {
        color: '#F87171',
        fontSize: 18,
        fontWeight: 'bold'
    },

    resumen: {
        backgroundColor: '#17171F',
        borderRadius: 16,
        padding: 20,
        marginTop: 25,
        borderWidth: 1,
        borderColor: '#2D2D42'
    },

    tituloResumen: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20
    },

    filaResumen: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    textoResumen: {
        color: '#9CA3AF',
        fontSize: 14
    },

    divisor: {
        height: 1,
        backgroundColor: '#393544',
        marginVertical: 17
    },

    filaTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    textoTotal: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: 'bold'
    },

    precioTotal: {
        color: '#FACC15',
        fontSize: 22,
        fontWeight: '900'
    },

    botonConfirmar: {
        backgroundColor: '#7C3AED',
        padding: 16,
        borderRadius: 11,
        alignItems: 'center',
        marginTop: 25
    },

    botonDeshabilitado: {
        opacity: 0.6
    },

    textoBoton: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold'
    }

});
