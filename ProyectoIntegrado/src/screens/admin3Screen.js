import React from 'react';
import { View, Text, StyleSheet,Button } from 'react-native';

export default function admin3Screen({navigation}) {

    return (
        <View style={styles.container}>

            <Text style={styles.title}>Perfil</Text>

            <Text style={styles.text}>Usuario: Comprador</Text>

            <Button
                title="Cerrar sesión"
                onPress={() => navigation.navigate('Login')}
            />
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
    },

    text: {
        fontSize: 18,
        marginBottom: 20,
    }

});