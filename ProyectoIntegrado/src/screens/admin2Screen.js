
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Direcciones de la API
const API_BASE_URL = 'http://192.168.1.62:3000';
const API_URL = `${API_BASE_URL}/api/productos`;
const API_ADMIN_URL = `${API_BASE_URL}/api/admin/productos`;

export default function admin2Screen({ navigation }) {

    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [actualizandoId, setActualizandoId] = useState(null);

    // Datos del formulario
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState('');
    const [stock, setStock] = useState('');
    const [categoria, setCategoria] = useState('');

    // Comprobar si un producto está habilitado
    const productoHabilitado = (estado) => {
        return estado === true || estado === 1 || estado === '1';
    };

    // Obtener todos los productos, incluso los deshabilitados
    const obtenerProductos = async () => {
        try {
            setCargando(true);
            setError(false);

            const respuesta = await fetch(API_ADMIN_URL);

            if (!respuesta.ok) {
                throw new Error('No se pudieron obtener los productos.');
            }

            const datos = await respuesta.json();
            setProductos(datos);

        } catch (err) {
            console.log('Error al obtener productos:', err);
            setError(true);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        obtenerProductos();
    }, []);

    // Registrar producto en MySQL
    const registrarProducto = async () => {

        if (
            nombre.trim() === '' ||
            precio.trim() === '' ||
            stock.trim() === ''
        ) {
            Alert.alert(
                'Campos incompletos',
                'Ingresa el nombre, precio y stock del producto.'
            );
            return;
        }

        const precioNumero = Number(precio);
        const stockNumero = Number(stock);

        if (!Number.isFinite(precioNumero) || precioNumero <= 0) {
            Alert.alert('Precio inválido', 'Ingresa un precio mayor que cero.');
            return;
        }

        if (!Number.isInteger(stockNumero) || stockNumero < 0) {
            Alert.alert(
                'Stock inválido',
                'Ingresa una cantidad entera igual o mayor que cero.'
            );
            return;
        }

        try {
            setGuardando(true);

            const respuesta = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: nombre.trim(),
                    descripcion: descripcion.trim(),
                    precio: precioNumero,
                    stock: stockNumero,
                    categoria: categoria.trim()
                })
            });

            const resultado = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    resultado.mensaje || 'No se pudo registrar el producto.'
                );
            }

            // Limpiar formulario
            setNombre('');
            setDescripcion('');
            setPrecio('');
            setStock('');
            setCategoria('');

            // Actualizar inventario
            await obtenerProductos();

            Alert.alert(
                'Producto registrado',
                'El producto se guardó correctamente.'
            );

        } catch (err) {
            console.log('Error al registrar producto:', err);

            Alert.alert(
                'Error',
                err.message || 'No se pudo conectar con el servidor.'
            );
        } finally {
            setGuardando(false);
        }
    };

    // Habilitar o deshabilitar un producto
    const cambiarEstadoProducto = (producto) => {

        const estaHabilitado = productoHabilitado(producto.estado);
        const nuevoEstado = !estaHabilitado;

        const accion = nuevoEstado ? 'habilitar' : 'deshabilitar';

        Alert.alert(
            'Confirmar acción',
            `¿Estás seguro de que deseas ${accion} "${producto.nombre}"?`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Confirmar',
                    onPress: async () => {
                        try {
                            setActualizandoId(producto.id);

                            const respuesta = await fetch(
                                `${API_URL}/${producto.id}/estado`,
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

                            const resultado = await respuesta.json();

                            if (!respuesta.ok) {
                                throw new Error(
                                    resultado.mensaje ||
                                    'No se pudo cambiar el estado.'
                                );
                            }

                            await obtenerProductos();

                            Alert.alert(
                                'Operación exitosa',
                                resultado.mensaje
                            );

                        } catch (err) {
                            console.log('Error al cambiar estado:', err);

                            Alert.alert(
                                'Error',
                                err.message ||
                                'No se pudo conectar con el servidor.'
                            );
                        } finally {
                            setActualizandoId(null);
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >

                {/* ENCABEZADO */}
                <View style={styles.header}>
                    <Text style={styles.headerIcon}>📦</Text>

                    <Text style={styles.headerTitle}>
                        RoboArm
                    </Text>

                    <Text style={styles.headerSubtitle}>
                        Control de Stock e Inventario
                    </Text>
                </View>

                {/* FORMULARIO */}
                <View style={styles.formCard}>

                    <Text style={styles.sectionTitle}>
                        Registrar nuevo producto
                    </Text>

                    <Text style={styles.label}>Nombre del producto</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Ej. Mystery Box Premium"
                        placeholderTextColor="#71717A"
                        value={nombre}
                        onChangeText={setNombre}
                    />

                    <Text style={styles.label}>Descripción</Text>

                    <TextInput
                        style={[styles.input, styles.descriptionInput]}
                        placeholder="Describe el producto..."
                        placeholderTextColor="#71717A"
                        value={descripcion}
                        onChangeText={setDescripcion}
                        multiline
                    />

                    <Text style={styles.label}>Precio</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Ej. 55.00"
                        placeholderTextColor="#71717A"
                        value={precio}
                        onChangeText={setPrecio}
                        keyboardType="decimal-pad"
                    />

                    <Text style={styles.label}>Stock disponible</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Ej. 10"
                        placeholderTextColor="#71717A"
                        value={stock}
                        onChangeText={setStock}
                        keyboardType="number-pad"
                    />

                    <Text style={styles.label}>Categoría</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Ej. Mystery Box"
                        placeholderTextColor="#71717A"
                        value={categoria}
                        onChangeText={setCategoria}
                    />

                    <TouchableOpacity
                        style={[
                            styles.registerButton,
                            guardando && styles.disabledButton
                        ]}
                        onPress={registrarProducto}
                        disabled={guardando}
                    >
                        {guardando ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.registerButtonText}>
                                + Registrar producto
                            </Text>
                        )}
                    </TouchableOpacity>

                </View>

                {/* INVENTARIO */}
                <View style={styles.inventoryHeader}>
                    <Text style={styles.sectionTitle}>
                        Inventario de productos
                    </Text>

                    <TouchableOpacity
                        style={styles.refreshButton}
                        onPress={obtenerProductos}
                        disabled={cargando}
                    >
                        <Text style={styles.refreshText}>
                            ↻ Actualizar
                        </Text>
                    </TouchableOpacity>
                </View>

                {cargando ? (

                    <ActivityIndicator
                        size="large"
                        color="#A78BFA"
                        style={styles.loader}
                    />

                ) : error ? (

                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyText}>
                            No se pudieron cargar los productos.
                        </Text>

                        <TouchableOpacity
                            style={styles.retryButton}
                            onPress={obtenerProductos}
                        >
                            <Text style={styles.retryText}>
                                Intentar nuevamente
                            </Text>
                        </TouchableOpacity>
                    </View>

                ) : productos.length === 0 ? (

                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyIcon}>📦</Text>

                        <Text style={styles.emptyText}>
                            Todavía no hay productos registrados.
                        </Text>
                    </View>

                ) : (

                    productos.map((producto) => {

                        const habilitado = productoHabilitado(producto.estado);

                        return (
                            <View
                                key={producto.id}
                                style={styles.productCard}
                            >

                                <View style={styles.productIcon}>
                                    <Text style={styles.packageEmoji}>
                                        📦
                                    </Text>
                                </View>

                                <View style={styles.productInfo}>

                                    <Text style={styles.productName}>
                                        {producto.nombre}
                                    </Text>

                                    <Text style={styles.productDescription}>
                                        {producto.categoria || 'Sin categoría'}
                                    </Text>

                                    <Text style={styles.productPrice}>
                                        Q{Number(producto.precio).toFixed(2)}
                                    </Text>

                                    <Text style={styles.productStock}>
                                        Stock: {producto.stock} unidades
                                    </Text>

                                    <Text
                                        style={[
                                            styles.productStatus,
                                            habilitado
                                                ? styles.statusActive
                                                : styles.statusInactive
                                        ]}
                                    >
                                        {habilitado
                                            ? '● Producto habilitado'
                                            : '● Producto deshabilitado'}
                                    </Text>

                                    <TouchableOpacity
                                        style={[
                                            styles.stateButton,
                                            habilitado
                                                ? styles.disableButton
                                                : styles.enableButton,
                                            actualizandoId === producto.id &&
                                            styles.disabledButton
                                        ]}
                                        onPress={() => cambiarEstadoProducto(producto)}
                                        disabled={actualizandoId === producto.id}
                                    >
                                        {actualizandoId === producto.id ? (
                                            <ActivityIndicator color="#FFFFFF" />
                                        ) : (
                                            <Text style={styles.stateButtonText}>
                                                {habilitado
                                                    ? 'Deshabilitar producto'
                                                    : 'Habilitar producto'}
                                            </Text>
                                        )}
                                    </TouchableOpacity>

                                </View>

                            </View>
                        );
                    })

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

    scrollContent: {
        paddingBottom: 35
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
        fontSize: 55,
        marginBottom: 10
    },

    headerTitle: {
        color: '#FFFFFF',
        fontSize: 30,
        fontWeight: 'bold'
    },

    headerSubtitle: {
        color: '#A78BFA',
        fontSize: 14,
        marginTop: 5
    },

    formCard: {
        backgroundColor: '#18181B',
        marginHorizontal: 18,
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#27272A',
        marginBottom: 28
    },

    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20
    },

    label: {
        color: '#D4D4D8',
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '600'
    },

    input: {
        backgroundColor: '#27272A',
        borderRadius: 10,
        padding: 13,
        color: '#FFFFFF',
        fontSize: 14,
        marginBottom: 17
    },

    descriptionInput: {
        height: 85,
        textAlignVertical: 'top'
    },

    registerButton: {
        backgroundColor: '#7C3AED',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 5
    },

    disabledButton: {
        opacity: 0.6
    },

    registerButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 15
    },

    inventoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 18,
        marginBottom: 15
    },

    refreshButton: {
        backgroundColor: '#27272A',
        paddingVertical: 9,
        paddingHorizontal: 12,
        borderRadius: 10
    },

    refreshText: {
        color: '#A78BFA',
        fontWeight: 'bold'
    },

    loader: {
        marginTop: 30
    },

    emptyCard: {
        backgroundColor: '#18181B',
        marginHorizontal: 18,
        padding: 25,
        borderRadius: 18,
        alignItems: 'center'
    },

    emptyIcon: {
        fontSize: 40,
        marginBottom: 10
    },

    emptyText: {
        color: '#A1A1AA',
        textAlign: 'center'
    },

    retryButton: {
        backgroundColor: '#7C3AED',
        padding: 12,
        borderRadius: 10,
        marginTop: 15
    },

    retryText: {
        color: '#FFFFFF',
        fontWeight: 'bold'
    },

    productCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#18181B',
        marginHorizontal: 18,
        marginBottom: 13,
        padding: 17,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#27272A'
    },

    productIcon: {
        width: 65,
        height: 65,
        borderRadius: 15,
        backgroundColor: '#27272A',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15
    },

    packageEmoji: {
        fontSize: 35
    },

    productInfo: {
        flex: 1
    },

    productName: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4
    },

    productDescription: {
        color: '#A1A1AA',
        fontSize: 12,
        marginBottom: 7
    },

    productPrice: {
        color: '#FACC15',
        fontSize: 16,
        fontWeight: 'bold'
    },

    productStock: {
        color: '#A78BFA',
        fontSize: 13,
        marginTop: 5
    },

    productStatus: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 10
    },

    statusActive: {
        color: '#4ADE80'
    },

    statusInactive: {
        color: '#F87171'
    },

    stateButton: {
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 12
    },

    disableButton: {
        backgroundColor: '#9F3434'
    },

    enableButton: {
        backgroundColor: '#15803D'
    },

    stateButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 13
    }

});
