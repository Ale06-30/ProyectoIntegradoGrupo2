
import { StatusBar } from 'expo-status-bar';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Modal
} from 'react-native';
import { useState } from 'react';
import {
    getAuth,
    signInWithEmailAndPassword
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebase/FirebaseConfig';
import { Ionicons } from '@expo/vector-icons';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Contraseña adicional para confirmar al administrador
const CLAVE_ADMIN = 'Admin123';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mostrarPassword, setMostrarPassword] = useState(false);

    // Tipo de cuenta
    const [tipoUsuario, setTipoUsuario] = useState('usuario');

    // Ventana para confirmar al administrador
    const [modalAdmin, setModalAdmin] = useState(false);
    const [claveAdmin, setClaveAdmin] = useState('');
    const [mostrarClaveAdmin, setMostrarClaveAdmin] = useState(false);

    // Iniciar sesión con Firebase
    const iniciarSesionFirebase = () => {
        signInWithEmailAndPassword(auth, email.trim(), password)
            .then(() => {
                setModalAdmin(false);
                setClaveAdmin('');
                navigation.navigate('Home');
            })
            .catch((error) => {
                Alert.alert(
                    'Error de autenticación',
                    'El correo o la contraseña son incorrectos.'
                );
            });
    };

    // Al presionar el botón principal
    const Login = () => {
        if (!email.trim() || !password) {
            Alert.alert(
                'Campos vacíos',
                'Ingresa tu correo y contraseña.'
            );
            return;
        }

        if (tipoUsuario === 'administrador') {
            setClaveAdmin('');
            setMostrarClaveAdmin(false);
            setModalAdmin(true);
        } else {
            iniciarSesionFirebase();
        }
    };

    // Confirmar la contraseña adicional del administrador
    const confirmarAdmin = () => {
        if (!claveAdmin) {
            Alert.alert(
                'Campo vacío',
                'Ingresa la contraseña de administrador.'
            );
            return;
        }

        if (claveAdmin !== CLAVE_ADMIN) {
            Alert.alert(
                'Acceso denegado',
                'La contraseña de administrador es incorrecta.'
            );
            setClaveAdmin('');
            return;
        }

        setModalAdmin(false);
        iniciarSesionFirebase();
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

                    <Text style={styles.title}>Mi Casa</Text>

                    <Text style={styles.subtitle}>
                        Bienvenido de nuevo
                    </Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.accountIcon}>
                        <Ionicons
                            name="person-outline"
                            size={30}
                            color="#FFFFFF"
                        />
                    </View>

                    <Text style={styles.cardTitle}>
                        Iniciar Sesión
                    </Text>

                    <Text style={styles.cardSubtitle}>
                        Ingresa a tu cuenta para continuar
                    </Text>

                    {/* Selección del tipo de cuenta */}
                    <Text style={styles.label}>
                        Tipo de cuenta:
                    </Text>

                    <View style={styles.optionsContainer}>
                        <TouchableOpacity
                            style={[
                                styles.optionButton,
                                tipoUsuario === 'usuario' &&
                                    styles.optionSelected
                            ]}
                            onPress={() => setTipoUsuario('usuario')}
                        >
                            <Ionicons
                                name="person-outline"
                                size={21}
                                color={
                                    tipoUsuario === 'usuario'
                                        ? '#FFFFFF'
                                        : '#53624E'
                                }
                            />

                            <Text
                                style={[
                                    styles.optionText,
                                    tipoUsuario === 'usuario' &&
                                        styles.optionTextSelected
                                ]}
                            >
                                Usuario
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.optionButton,
                                tipoUsuario === 'administrador' &&
                                    styles.optionSelected
                            ]}
                            onPress={() =>
                                setTipoUsuario('administrador')
                            }
                        >
                            <Ionicons
                                name="shield-checkmark-outline"
                                size={21}
                                color={
                                    tipoUsuario === 'administrador'
                                        ? '#FFFFFF'
                                        : '#53624E'
                                }
                            />

                            <Text
                                style={[
                                    styles.optionText,
                                    tipoUsuario === 'administrador' &&
                                        styles.optionTextSelected
                                ]}
                            >
                                Administrador
                            </Text>
                        </TouchableOpacity>
                    </View>

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
                            autoCorrect={false}
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
                            autoCapitalize="none"
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
                                        ? 'eye-off-outline'
                                        : 'eye-outline'
                                }
                                size={22}
                                color="#687363"
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={Login}
                    >
                        <Ionicons
                            name="log-in-outline"
                            size={20}
                            color="#FFFFFF"
                        />

                        <Text style={styles.loginButtonText}>
                            Iniciar Sesión
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Registrar')}
                    >
                        <Text style={styles.linkText}>
                            ¿No tienes cuenta?
                        </Text>

                        <Text style={styles.linkTextBold}>
                            Regístrate
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Ventana de confirmación del administrador */}
            <Modal
                visible={modalAdmin}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalAdmin(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalCard}>
                        <View style={styles.modalIcon}>
                            <Ionicons
                                name="shield-checkmark-outline"
                                size={34}
                                color="#FFFFFF"
                            />
                        </View>

                        <Text style={styles.modalTitle}>
                            Confirmar administrador
                        </Text>

                        <Text style={styles.modalSubtitle}>
                            Ingresa la clave adicional para
                            confirmar que eres administrador.
                        </Text>

                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={21}
                                color="#687363"
                            />

                            <TextInput
                                placeholder="Clave de administrador"
                                value={claveAdmin}
                                onChangeText={setClaveAdmin}
                                secureTextEntry={!mostrarClaveAdmin}
                                autoCapitalize="none"
                                style={styles.input}
                                placeholderTextColor="#999"
                                onSubmitEditing={confirmarAdmin}
                                returnKeyType="done"
                            />

                            <TouchableOpacity
                                onPress={() =>
                                    setMostrarClaveAdmin(
                                        !mostrarClaveAdmin
                                    )
                                }
                            >
                                <Ionicons
                                    name={
                                        mostrarClaveAdmin
                                            ? 'eye-off-outline'
                                            : 'eye-outline'
                                    }
                                    size={22}
                                    color="#687363"
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={confirmarAdmin}
                        >
                            <Ionicons
                                name="checkmark-circle-outline"
                                size={20}
                                color="#FFFFFF"
                            />

                            <Text style={styles.loginButtonText}>
                                Confirmar
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => {
                                setModalAdmin(false);
                                setClaveAdmin('');
                            }}
                        >
                            <Text style={styles.cancelText}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        height: 260,
        backgroundColor: '#D8DED2',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
        paddingTop: 20,
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

    optionsContainer: {
        width: '90%',
        flexDirection: 'row',
        gap: 8,
        marginBottom: 20,
    },

    optionButton: {
        flex: 1,
        minHeight: 52,
        paddingHorizontal: 8,
        backgroundColor: '#F7F7F3',
        borderWidth: 1,
        borderColor: '#D5D9D0',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },

    optionSelected: {
        backgroundColor: '#4A5D4A',
        borderColor: '#4A5D4A',
    },

    optionText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#53624E',
    },

    optionTextSelected: {
        color: '#FFFFFF',
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

    loginButton: {
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

    loginButtonText: {
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

    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    modalCard: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        elevation: 8,
    },

    modalIcon: {
        width: 65,
        height: 65,
        backgroundColor: '#71816A',
        borderRadius: 33,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },

    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#394739',
        textAlign: 'center',
        marginBottom: 8,
    },

    modalSubtitle: {
        fontSize: 14,
        color: '#777',
        textAlign: 'center',
        marginBottom: 22,
    },

    cancelButton: {
        width: '90%',
        paddingVertical: 10,
        alignItems: 'center',
    },

    cancelText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#9A5A55',
    },
});