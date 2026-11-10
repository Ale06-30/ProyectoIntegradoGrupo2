// src/screens/HomeScreen.js
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function admin1Screen({ navigation }) {
  const manejarControl = (comando) => {
    console.log(`Ejecutando comando: ${comando}`);
  };

  return (
    <SafeAreaView style={styles.areaSegura}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          
          {/* Cabecera minimalista */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>RoboArm</Text>
            <Text style={styles.subtitle}>Control de Garra y Articulaciones</Text>
          </View>

          {/* PANEL PRINCIPAL DE CONTROL */}
          <View style={styles.panelControl}>
            <Text style={styles.sectionTitle}>Panel Operativo</Text>

            {/* 1. Base (2 botones: Izquierda / Derecha) */}
            <View style={styles.controlGroup}>
              <Text style={styles.groupLabel}>Base Rotatoria</Text>
              <View style={styles.rowButtons}>
                <TouchableOpacity 
                  style={[styles.btnControl, styles.btnBase]}
                  onPress={() => manejarControl('BASE_IZQ')}
                >
                  <Text style={styles.btnText}>◀ Base Izq</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.btnControl, styles.btnBase]}
                  onPress={() => manejarControl('BASE_DER')}
                >
                  <Text style={styles.btnText}>Base Der ▶</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 2. Servos Izquierdos y Derechos (4 botones) */}
            <View style={styles.controlGroup}>
              <Text style={styles.groupLabel}>Ejes Articulares</Text>
              
              {/* Servos Lado Izquierdo */}
              <View style={styles.rowButtons}>
                <TouchableOpacity 
                  style={styles.btnControl}
                  onPress={() => manejarControl('SERVO_IZQ_ARRIBA')}
                >
                  <Text style={styles.btnText}>Servo Izq ▲</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.btnControl}
                  onPress={() => manejarControl('SERVO_IZQ_ABAJO')}
                >
                  <Text style={styles.btnText}>Servo Izq ▼</Text>
                </TouchableOpacity>
              </View>

              {/* Servos Lado Derecho */}
              <View style={styles.rowButtons}>
                <TouchableOpacity 
                  style={styles.btnControl}
                  onPress={() => manejarControl('SERVO_DER_ARRIBA')}
                >
                  <Text style={styles.btnText}>Servo Der ▲</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.btnControl}
                  onPress={() => manejarControl('SERVO_DER_ABAJO')}
                >
                  <Text style={styles.btnText}>Servo Der ▼</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 3. Garra (2 botones: Abrir / Cerrar con acento naranja y rojo) */}
            <View style={styles.controlGroup}>
              <Text style={styles.groupLabel}>Efector Final (Garra)</Text>
              <View style={styles.rowButtons}>
                <TouchableOpacity 
                  style={[styles.btnControl, styles.btnGarraAbrir]}
                  onPress={() => manejarControl('GARRA_ABRIR')}
                >
                  <Text style={styles.btnTextGarra}>Abrir Garra</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.btnControl, styles.btnGarraCerrar]}
                  onPress={() => manejarControl('GARRA_CERRAR')}
                >
                  <Text style={styles.btnTextGarra}>Cerrar Garra</Text>
                </TouchableOpacity>
              </View>
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
    backgroundColor: '#121214', // Gris ultra oscuro, elegante y sobrio
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
    backgroundColor: '#18181B', // Gris oscuro para tarjetas
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
  controlGroup: {
    marginBottom: 16,
  },
  groupLabel: {
    fontSize: 11,
    color: '#71717A',
    marginBottom: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  btnControl: {
    flex: 1,
    backgroundColor: '#27272A', // Gris medio para botones estándar
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3F3F46',
  },
  btnBase: {
    backgroundColor: '#27272A',
    borderColor: '#52525B',
  },
  btnGarraAbrir: {
    backgroundColor: '#C2410C', // Naranja industrial intenso
    borderColor: '#EA580C',
  },
  btnGarraCerrar: {
    backgroundColor: '#991B1B', // Rojo oscuro de alerta
    borderColor: '#B91C1C',
  },
  btnText: {
    color: '#E4E4E7',
    fontSize: 13,
    fontWeight: '600',
  },
  btnTextGarra: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});