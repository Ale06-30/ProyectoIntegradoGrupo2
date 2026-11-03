// src/screens/SesionUser.js
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';

export default function SesionUser({ navigation }) {
  const cerrarSesion = () => {
    // Redirige al Login (ajusta el nombre de la ruta si tu stack principal usa otro nombre como 'LoginStackNavigator')
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.areaSegura}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          
          {/* Cabecera temática */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Cerrar Sesión</Text>
          </View>

          {/* PANEL PRINCIPAL DE PERFIL */}
          <View style={styles.panelControl}>
            <Text style={styles.sectionTitle}>Estado de Sesión</Text>

            <View style={styles.profileCard}>
              {/* Ficha de Rol */}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Tipo de Usuario:</Text>
                <Text style={styles.infoValue}>Comprador</Text>
              </View>

              {/* Botón de Cerrar Sesión con acento rojo de alerta */}
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
    backgroundColor: '#0B0B0F',
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
    fontWeight: '800',
    color: '#F4F4F6',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 13,
    color: '#A78BFA',
    marginTop: 4,
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  panelControl: {
    backgroundColor: '#13131A',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#232331',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#71719A',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  profileCard: {
    backgroundColor: '#1A1A24',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2D2D42',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#13131A',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#232331',
  },
  infoLabel: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FACC15', // Amarillo oro brillante característico de la vista de usuario
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
    letterSpacing: 0.5,
  },
});