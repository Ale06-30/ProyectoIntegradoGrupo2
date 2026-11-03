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
import { getAuth } from 'firebase/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { firebaseConfig } from '../firebase/FirebaseConfig';
import { initializeApp } from 'firebase/app';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mostrarPassword, setMostrarPassword] = useState(false);

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const Registro = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                alert("Usuario Registrado");
            })
            .catch(error => {
                alert(error);
            });
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
                <StatusBar style="dark" />

                <View style={styles.header}>
                    <View style={styles.houseIcon}>
                        <Ionicons
                            name="home-outline"
                            size={42}
                            color="#53624E"
                        />
                    </View>

                    <Text style={styles.title}>
                        Mi Casa
                    </Text>

                    <Text style={styles.subtitle}>
                        Crea tu cuenta
                    </Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.accountIcon}>
                        <Ionicons
                            name="person-add-outline"
                            size={30}
                            color="#FFFFFF"
                        />
                    </View>

                    <Text style={styles.cardTitle}>
                        Crear una cuenta
                    </Text>

                    <Text style={styles.cardSubtitle}>
                        Regístrate para continuar
                    </Text>

                    <Text style={styles.label}>
                        Correo:
                    </Text>

                    <View style={styles.inputContainer}>
                        <Ionicons
                            name="mail-outline"
                            size={21}
                            color="#687363"
                        />

                        <TextInput
                            placeholder="Ingresa tu correo"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            style={styles.input}
                            placeholderTextColor="#999"
                        />
                    </View>

                    <Text style={styles.label}>
                        Contraseña:
                    </Text>

                    <View style={styles.inputContainer}>
                        <Ionicons
                            name="lock-closed-outline"
                            size={21}
                            color="#687363"
                        />

                        <TextInput
                            placeholder="Ingresa tu contraseña"
                            secureTextEntry={!mostrarPassword}
                            value={password}
                            onChangeText={setPassword}
                            style={styles.input}
                            placeholderTextColor="#999"
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
                                color="#687363"
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
        backgroundColor: '#F2F0EA',
    },

    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        paddingBottom: 30,
    },

    header: {
        width: '100%',
        height: 250,
        backgroundColor: '#D8DED2',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
    },

    houseIcon: {
        width: 70,
        height: 70,
        backgroundColor: '#F2F0EA',
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },

    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#394739',
    },

    subtitle: {
        fontSize: 15,
        color: '#667064',
        marginTop: 5,
    },

    card: {
        width: '88%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 25,
        marginTop: -30,
        alignItems: 'center',
        elevation: 4,
    },

    accountIcon: {
        width: 60,
        height: 60,
        backgroundColor: '#71816A',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },

    cardTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#394739',
        marginBottom: 5,
    },

    cardSubtitle: {
        fontSize: 14,
        color: '#777',
        textAlign: 'center',
        marginBottom: 25,
    },

    label: {
        width: '90%',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#394739',
        marginBottom: 7,
    },

    inputContainer: {
        width: '90%',
        height: 50,
        backgroundColor: '#F7F7F3',
        borderWidth: 1,
        borderColor: '#D5D9D0',
        borderRadius: 10,
        paddingHorizontal: 12,
        marginBottom: 18,
        flexDirection: 'row',
        alignItems: 'center',
    },

    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        paddingHorizontal: 10,
    },

    registerButton: {
        width: '90%',
        height: 50,
        backgroundColor: '#4A5D4A',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 5,
        marginBottom: 15,
    },

    registerButtonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: 'bold',
        marginLeft: 8,
    },

    button: {
        flexDirection: 'row',
        marginTop: 5,
    },

    linkText: {
        color: '#777',
        fontSize: 14,
    },

    linkTextBold: {
        color: '#4A5D4A',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 5,
    },
});