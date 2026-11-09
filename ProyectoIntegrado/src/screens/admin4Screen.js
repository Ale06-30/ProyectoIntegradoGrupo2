import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function admin4Screen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Gestión de pedidos</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B0B0F',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold'
    }
});