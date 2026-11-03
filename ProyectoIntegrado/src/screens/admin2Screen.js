// src/screens/HomeScreen.js
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image } from 'react-native';

export default function admin2Screen({ navigation }) {
  // Valores fijos de stock que podrás conectar o modificar más adelante
  const stockAmazon = 12;
  const stockMercadoLibre = 5;

  return (
    <SafeAreaView style={styles.areaSegura}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          
          {/* Cabecera minimalista */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>RoboArm</Text>
            <Text style={styles.subtitle}>Control de Stock e Inventario</Text>
          </View>

          {/* LISTA DE PRODUCTOS Y STOCK */}
          <View style={styles.panelControl}>
            <Text style={styles.sectionTitle}>Existencias Actuales</Text>

            {/* Producto 1 */}
            <View style={styles.productCard}>
              <View style={styles.imagePlaceholder}>
                <Image 
                  source={{ uri: 'https://via.placeholder.com/300' }} 
                  style={styles.productImage}
                  resizeMode="cover"
                />
              </View>

              <View style={styles.productInfo}>
                <Text style={styles.productName}>Amazon Mystery Box Tech</Text>
                
                {/* Contador de Stock */}
                <View style={styles.stockContainer}>
                  <Text style={styles.stockLabel}>Stock Disponible:</Text>
                  <View style={styles.stockBadge}>
                    <Text style={styles.stockText}>{stockAmazon} unidades</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Producto 2 */}
            <View style={styles.productCard}>
              <View style={styles.imagePlaceholder}>
                <Image 
                  source={{ uri: 'https://via.placeholder.com/300' }} 
                  style={styles.productImage}
                  resizeMode="cover"
                />
              </View>

              <View style={styles.productInfo}>
                <Text style={styles.productName}>Mercado Libre Mega Box</Text>
                
                {/* Contador de Stock */}
                <View style={styles.stockContainer}>
                  <Text style={styles.stockLabel}>Stock Disponible:</Text>
                  <View style={styles.stockBadge}>
                    <Text style={styles.stockText}>{stockMercadoLibre} unidades</Text>
                  </View>
                </View>
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
  productCard: {
    backgroundColor: '#27272A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3F3F46',
  },
  imagePlaceholder: {
    height: 120,
    width: '100%',
    backgroundColor: '#18181B',
    borderRadius: 8,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#3F3F46',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    marginBottom: 4,
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F4F4F5',
    marginBottom: 10,
  },
  stockContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#18181B',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  stockLabel: {
    fontSize: 12,
    color: '#A1A1AA',
    fontWeight: '500',
  },
  stockBadge: {
    backgroundColor: '#27272A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  stockText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F4F4F5',
  },
});