
// src/screens/RegisterScreen.js
import { StatusBar } from 'expo-status-bar';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/FirebaseConfig';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mostrarPassword, setMostrarPassword] = useState(false);

    const Registro = async () => {
        try {
            // 1. REGISTRAR USUARIO EN FIREBASE
            const resultado = await createUserWithEmailAndPassword(
                auth,
                email.trim(),
                password
            );

            // 2. OBTENER DATOS DE FIREBASE
            const firebase_uid = resultado.user.uid;
            const correo = resultado.user.email;

            // 3. ENVIAR DATOS AL SERVIDOR PARA GUARDAR EN MYSQL
            const respuesta = await fetch(
                'http://192.168.1.62:3000/api/usuarios',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        firebase_uid,
                        correo
                    })
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    datos.mensaje || 'Error al registrar usuario en MySQL'
                );
            }

            // 4. CONFIRMAR REGISTRO
            alert('Usuario registrado correctamente');

        } catch (error) {
            console.log('[ERROR] Registro:', error.message);
            alert(error.message);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.mainContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <StatusBar style="light" />

                <View style={styles.header}>
                    <View style={styles.houseIcon}>
                        <Ionicons
                            name="person-add-outline"
                            size={42}
                            color="#60A5FA"
                        />
                    </View>

                    <Text style={styles.title}>
                        RoboArm
                    </Text>

                    <Text style={styles.subtitle}>
                        Crea tu nueva cuenta
                    </Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.accountIcon}>
                        <Ionicons
                            name="cube-outline"
                            size={30}
                            color="#FFFFFF"
                        />
                    </View>

                    <Text style={styles.cardTitle}>
                        Registro
                    </Text>

                    <Text style={styles.cardSubtitle}>
                        Ingresa tus datos para comenzar
                    </Text>

                    <Text style={styles.label}>
                        Correo:
                    </Text>

                    <View style={styles.inputContainer}>
                        <Ionicons
                            name="mail-outline"
                            size={21}
                            color="#94A3B8"
                        />

                        <TextInput
                            placeholder="Ingresa tu correo"
                            placeholderTextColor="#71717A"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            style={styles.input}
                        />
                    </View>

                    <Text style={styles.label}>
                        Contraseña:
                    </Text>

                    <View style={styles.inputContainer}>
                        <Ionicons
                            name="lock-closed-outline"
                            size={21}
                            color="#94A3B8"
                        />

                        <TextInput
                            placeholder="Ingresa tu contraseña"
                            placeholderTextColor="#71717A"
                            secureTextEntry={!mostrarPassword}
                            value={password}
                            onChangeText={setPassword}
                            style={styles.input}
                        />

                        <TouchableOpacity
                            onPress={() =>
                                setMostrarPassword(!mostrarPassword)
                            }
                        >
                            <Ionicons
                                name={
                                    mostrarPassword
                                        ? "eye-off-outline"
                                        : "eye-outline"
                                }
                                size={22}
                                color="#94A3B8"
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.registerButton}
                        onPress={Registro}
                    >
                        <Ionicons
                            name="person-add-outline"
                            size={20}
                            color="#FFFFFF"
                        />

                        <Text style={styles.registerButtonText}>
                            Registrarse
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.linkText}>
                            ¿Ya tienes cuenta?
                        </Text>

                        <Text style={styles.linkTextBold}>
                            Inicia Sesión
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#121214',
    },

    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        paddingBottom: 30,
    },

    header: {
        width: '100%',
        height: 260,
        backgroundColor: '#18181B',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
        borderBottomWidth: 1,
        borderBottomColor: '#27272A',
    },

    houseIcon: {
        width: 70,
        height: 70,
        backgroundColor: '#27272A',
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#3F3F46',
    },

    title: {
        fontSize: 30,
        fontWeight: '700',
        color: '#F4F4F5',
        letterSpacing: 0.5,
    },

    subtitle: {
        fontSize: 13,
        color: '#93C5FD',
        marginTop: 5,
        fontWeight: '500',
        letterSpacing: 0.2,
    },

    card: {
        width: '88%',
        backgroundColor: '#18181B',
        borderRadius: 20,
        padding: 25,
        marginTop: -30,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#27272A',
        elevation: 4,
    },

    accountIcon: {
        width: 60,
        height: 60,
        backgroundColor: '#27272A',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#3F3F46',
    },

    cardTitle: {
        fontSize: 25,
        fontWeight: '700',
        color: '#F4F4F5',
        marginBottom: 5,
    },

    cardSubtitle: {
        fontSize: 14,
        color: '#A1A1AA',
        textAlign: 'center',
        marginBottom: 25,
    },

    label: {
        width: '90%',
        fontSize: 13,
        fontWeight: '600',
        color: '#A1A1AA',
        marginBottom: 7,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },

    inputContainer: {
        width: '90%',
        height: 50,
        backgroundColor: '#27272A',
        borderWidth: 1,
        borderColor: '#3F3F46',
        borderRadius: 10,
        paddingHorizontal: 12,
        marginBottom: 18,
        flexDirection: 'row',
        alignItems: 'center',
    },

    input: {
        flex: 1,
        fontSize: 16,
        color: '#F4F4F5',
        paddingHorizontal: 10,
    },

    registerButton: {
        width: '90%',
        height: 50,
        backgroundColor: '#0369A1',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 5,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#0284C7',
    },

    registerButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 8,
        letterSpacing: 0.3,
    },

    button: {
        flexDirection: 'row',
        marginTop: 5,
    },

    linkText: {
        color: '#A1A1AA',
        fontSize: 14,
    },

    linkTextBold: {
        color: '#60A5FA',
        fontSize: 14,
        fontWeight: '700',
        marginLeft: 5,
    },
});
