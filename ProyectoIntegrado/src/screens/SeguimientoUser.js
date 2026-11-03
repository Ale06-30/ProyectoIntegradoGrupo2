// src/screens/SeguimientoUser.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function SeguimientoUser() {
  // CAMBIA ESTE NÚMERO (del 1 al 4) para probar cómo avanza el estado del envío dinámicamente:
  // 1: Empacando | 2: En camino a central | 3: En ruta de entrega | 4: Entregado
  const [pasoActual, setPasoActual] = useState(2); 

  // Definición de los estados del envío (puedes editar nombres o agregar más aquí)
  const estadosEnvio = [
    {
      id: 1,
      titulo: 'Empacando Mystery Box',
      descripcion: 'Tu caja sorpresa está siendo seleccionada y sellada con seguridad.',
      icono: 'inventory-2',
    },
    {
      id: 2,
      titulo: 'En camino a central',
      descripcion: 'El paquete salió del almacén principal rumbo al centro de distribución.',
      icono: 'local-shipping',
    },
    {
      id: 3,
      titulo: 'En ruta de entrega',
      descripcion: 'El repartidor va en camino hacia tu dirección asignada.',
      icono: 'flight-takeoff',
    },
    {
      id: 4,
      titulo: 'Entregado con éxito',
      descripcion: 'Tu Mystery Box ha sido entregada. ¡Disfruta la experiencia!',
      icono: 'check-circle',
    },
  ];

  return (
    <SafeAreaView style={styles.areaSegura}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          
          {/* Cabecera temática */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Seguimiento</Text>
            <Text style={styles.subtitle}>📦 Estado de tu Mystery Box en tiempo real</Text>
          </View>

          {/* PANEL PRINCIPAL */}
          <View style={styles.panelControl}>
            <Text style={styles.sectionTitle}>Línea de Tiempo del Envío</Text>

            {/* Renderizado dinámico de los pasos */}
            {estadosEnvio.map((item, index) => {
              const estaCompletado = item.id < pasoActual;
              const estaActivo = item.id === pasoActual;

              return (
                <View key={item.id} style={styles.stepRow}>
                  
                  {/* Columna de la línea y el indicador LED / Icono */}
                  <View style={styles.indicatorColumn}>
                    <View style={[
                      styles.nodeCircle, 
                      estaActivo && styles.nodeActive,
                      estaCompletado && styles.nodeCompleted
                    ]}>
                      <MaterialIcons 
                        name={item.icono} 
                        size={18} 
                        color={estaActivo || estaCompletado ? '#FFFFFF' : '#71719A'} 
                      />
                    </View>
                    {/* Línea conectora (se oculta en el último elemento) */}
                    {index < estadosEnvio.length - 1 && (
                      <View style={[
                        styles.connectorLine, 
                        item.id < pasoActual && styles.lineCompleted
                      ]} />
                    )}
                  </View>

                  {/* Columna de Texto y Detalles */}
                  <View style={[
                    styles.stepContentCard, 
                    estaActivo && styles.cardActive
                  ]}>
                    <View style={styles.stepHeader}>
                      <Text style={[styles.stepTitle, estaActivo && styles.textActive]}>
                        {item.titulo}
                      </Text>
                      {/* Indicador LED de Estado */}
                      <View style={[
                        styles.ledStatus, 
                        estaActivo ? styles.ledGreen : (estaCompletado ? styles.ledBlue : styles.ledOff)
                      ]} />
                    </View>
                    <Text style={styles.stepDesc}>{item.descripcion}</Text>
                  </View>

                </View>
              );
            })}

          </View>

          {/* Botón de prueba temporal (Puedes borrarlo al conectar tu lógica de Arduino) */}
          <TouchableOpacity 
            style={styles.btnSimular} 
            onPress={() => setPasoActual(pasoActual >= 4 ? 1 : pasoActual + 1)}
          >
            <Text style={styles.btnSimularText}>Simular Siguiente Paso (Prueba)</Text>
          </TouchableOpacity>

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
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  indicatorColumn: {
    alignItems: 'center',
    marginRight: 14,
  },
  nodeCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1A1A24',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2D2D42',
    zIndex: 2,
  },
  nodeActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#8B5CF6',
  },
  nodeCompleted: {
    backgroundColor: '#059669',
    borderColor: '#10B981',
  },
  connectorLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#232331',
    marginVertical: -4,
  },
  lineCompleted: {
    backgroundColor: '#059669',
  },
  stepContentCard: {
    flex: 1,
    backgroundColor: '#1A1A24',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2D2D42',
  },
  cardActive: {
    borderColor: '#7C3AED',
    backgroundColor: '#1E1B4B',
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E4E4E7',
    flex: 1,
    marginRight: 8,
  },
  textActive: {
    color: '#FACC15',
  },
  stepDesc: {
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 18,
  },
  ledStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  ledGreen: {
    backgroundColor: '#FACC15',
    shadowColor: '#FACC15',
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  ledBlue: {
    backgroundColor: '#10B981',
  },
  ledOff: {
    backgroundColor: '#4B5563',
  },
  btnSimular: {
    marginTop: 20,
    backgroundColor: '#27272A',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3F3F46',
  },
  btnSimularText: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});