// src/screens/HomeScreen.js
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';

export default function admin2Screen({ navigation }) {
  return (
    <SafeAreaView style={styles.areaSegura}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Arduino Controller</Text>
          
          <Text style={styles.subtitle}>Controla un Arduino desde tu teléfono</Text>
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Esta aplicación permite controlar y monitorear un Arduino UNO R3 de forma remota.
            </Text>
          </View>

          <View style={styles.cardContainer}>
            <TouchableOpacity 
              style={[styles.card, styles.cardBlue]}
              onPress={() => navigation.navigate('ControlLED')}
            >
              <Text style={styles.cardTitle}>Control LED</Text>
              <Text style={styles.cardDescription}>Enciende o apaga el LED</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.card, styles.cardGreen]}
              onPress={() => navigation.navigate('SensorHumedad')}
            >
              <Text style={[styles.cardTitle, { marginHorizontal: -12}]}>Sensor de Humedad</Text>
              <Text style={styles.cardDescription}>Monitorea la humedad del suelo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>Instrucciones</Text>
            <Text style={styles.infoBoxText}>
              1. Conecta tu Arduino al puerto USB{'\n'}
              2. Asegúrate de que el servidor esté corriendo{'\n'}
              3. Conecta la app al mismo servidor{'\n'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  areaSegura: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#1565C0',
    textAlign: 'center',
    lineHeight: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardBlue: {
    backgroundColor: '#e3f2fd',
  },
  cardGreen: {
    backgroundColor: '#e8f5e9',
  },
  cardEmoji: {
    fontSize: 36,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoBoxTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoBoxText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 24,
  },
});