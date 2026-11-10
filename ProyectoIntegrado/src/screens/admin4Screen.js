import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity
} from 'react-native';

export default function admin4Screen({ navigation }) {
    const [filtro, setFiltro] = useState('Todos');

    const filtros = [
        'Todos',
        'Pendiente',
        'En preparación',
        'Enviado',
        'Entregado',
        'Cancelado'
    ];

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
                        <Text style={styles.resumenNumero}>—</Text>
                        <Text style={styles.resumenTexto}>Pendientes</Text>
                    </View>

                    <View style={styles.resumenCard}>
                        <Text style={styles.resumenNumero}>—</Text>
                        <Text style={styles.resumenTexto}>
                            En preparación
                        </Text>
                    </View>

                    <View style={styles.resumenCard}>
                        <Text style={styles.resumenNumero}>—</Text>
                        <Text style={styles.resumenTexto}>Enviados</Text>
                    </View>
                </View>

                {/* FILTROS */}
                <Text style={styles.sectionTitle}>
                    Pedidos registrados
                </Text>

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

                {/* CONTENIDO */}
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>📦</Text>

                    <Text style={styles.emptyTitle}>
                        Próximamente
                    </Text>

                    <Text style={styles.emptyText}>
                        Aquí aparecerán las compras realizadas por
                        los usuarios de Mystery Box.
                    </Text>

                    <Text style={styles.emptySubtext}>
                        Los pedidos se cargarán directamente desde
                        nuestra base de datos MySQL.
                    </Text>
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

    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginHorizontal: 20,
        marginBottom: 15
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
        marginBottom: 12
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
    }
});