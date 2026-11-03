// src/screens/ProductosUser.js
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';

export default function ProductosUser({ navigation }) {
  const manejarDetalles = (producto) => {
    console.log(`Viendo detalles de: ${producto}`);
  };

  return (
    <SafeAreaView style={styles.areaSegura}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          
          {/* Cabecera temática de misterio */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Mystery Box</Text>
            <Text style={styles.subtitle}>✨ Descubre lo inesperado</Text>
          </View>

          {/* LISTA DE PRODUCTOS */}
          <View style={styles.panelControl}>
            <Text style={styles.sectionTitle}>Cajas Disponibles</Text>

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
                <View style={styles.rowHeader}>
                  <Text style={styles.productName}>Amazon Mystery Box Tech</Text>
                  <Text style={styles.productPrice}>$45.00</Text>
                </View>
                <Text style={styles.productDesc}>Caja sorpresa con dispositivos electrónicos y accesorios de marcas aliadas.</Text>
              </View>

              <TouchableOpacity 
                style={styles.btnDetalles}
                onPress={() => manejarDetalles('Amazon Mystery Box')}
              >
                <Text style={styles.btnText}>Ver Detalles</Text>
              </TouchableOpacity>
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
                <View style={styles.rowHeader}>
                  <Text style={styles.productName}>Mercado Libre Mega Box</Text>
                  <Text style={styles.productPrice}>$38.50</Text>
                </View>
                <Text style={styles.productDesc}>Lote sorpresa con artículos de inventario seleccionado y novedades.</Text>
              </View>

              <TouchableOpacity 
                style={styles.btnDetalles}
                onPress={() => manejarDetalles('Mercado Libre Mega Box')}
              >
                <Text style={styles.btnText}>Ver Detalles</Text>
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
    backgroundColor: '#0B0B0F', // Fondo oscuro profundo y misterioso
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
    color: '#A78BFA', // Tono violeta claro/neón sutil que da temática de misterio y sorpresa
    marginTop: 4,
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  panelControl: {
    backgroundColor: '#13131A', // Contenedor oscuro principal con un matiz violeta sutil
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
  productCard: {
    backgroundColor: '#1A1A24', // Tarjetas en un tono gris-violeta oscuro elegante
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2D2D42',
  },
  imagePlaceholder: {
    height: 120,
    width: '100%',
    backgroundColor: '#121218',
    borderRadius: 8,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2D2D42',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    marginBottom: 12,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F4F4F6',
    flex: 1,
    marginRight: 8,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FACC15', // Amarillo oro brillante de alto impacto para resaltar el valor con estilo sorpresa
  },
  productDesc: {
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 18,
  },
  btnDetalles: {
    backgroundColor: '#7C3AED', // Violeta eléctrico/profundo que emana misterio y llama a la acción
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});