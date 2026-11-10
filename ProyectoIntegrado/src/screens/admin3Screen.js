// src/screens/admin3Screen.js
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function admin3Screen({ navigation }) {
  const cerrarSesion = () => {
    // Aquí puedes agregar lógica adicional de Firebase auth si lo requieres (ej. signOut)
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.areaSegura}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          
          {/* Cabecera minimalista */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Cerrar Sesión</Text>
          </View>

          {/* PANEL DE PERFIL */}
          <View style={styles.panelControl}>
            <Text style={styles.sectionTitle}>Información de Sesión</Text>

            <View style={styles.profileCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Rol del Usuario:</Text>
                <Text style={styles.infoValue}>Administrador</Text>
              </View>

              {/* Botón de cerrar sesión con estilo industrial */}
              <TouchableOpacity 
                style={styles.btnLogout}
                onPress={cerrarSesion}
              >
                <Text style={styles.btnText}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>

          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  areaSegura: {
    flex: 1,
    backgroundColor: '#121214',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F4F4F5',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#71717A',
    marginTop: 4,
    letterSpacing: 0.2,
  },
  panelControl: {
    backgroundColor: '#18181B',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A1A1AA',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  profileCard: {
    backgroundColor: '#27272A',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#3F3F46',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#18181B',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  infoLabel: {
    fontSize: 13,
    color: '#A1A1AA',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#38BDF8', // Acento azulado limpio para el rol
  },
  btnLogout: {
    backgroundColor: '#991B1B', // Rojo oscuro de alerta industrial
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B91C1C',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});