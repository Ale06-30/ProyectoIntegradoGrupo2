import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

const API_URL = 'http://192.168.1.17:3000/api/productos';

export default function admin2Screen({ navigation }) {

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  // CONSULTAR PRODUCTOS DESDE MYSQL
  const obtenerProductos = async () => {
    try {
      setCargando(true);
      setError(false);

      const respuesta = await fetch(API_URL);

      if (!respuesta.ok) {
        throw new Error('No se pudieron obtener los productos');
      }

      const datos = await respuesta.json();

      setProductos(datos);

    } catch (err) {
      console.log('[ERROR] Al obtener productos:', err.message);
      setError(true);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  // FORMATO DEL PRECIO
  const formatearPrecio = (precio) => {
    return `$${Number(precio).toFixed(2)}`;
  };

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* ENCABEZADO */}
        <View style={styles.header}>
          <Text style={styles.headerIcon}>📦</Text>

          <Text style={styles.headerTitle}>
            Mystery Box
          </Text>

          <Text style={styles.headerSubtitle}>
            Control de Stock e Inventario
          </Text>
        </View>

        {/* TITULO */}
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>
            Inventario de productos
          </Text>

          <Text style={styles.sectionSubtitle}>
            Productos registrados en la tienda
          </Text>
        </View>

        {/* BOTON ACTUALIZAR */}
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={obtenerProductos}
          disabled={cargando}
        >
          <Text style={styles.refreshButtonText}>
            ↻ Actualizar inventario
          </Text>
        </TouchableOpacity>

        {/* CARGANDO */}
        {cargando ? (

          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#A78BFA" />

            <Text style={styles.messageText}>
              Cargando productos...
            </Text>
          </View>

        ) : error ? (

          /* ERROR DE CONEXION */
          <View style={styles.centerContainer}>
            <Text style={styles.messageText}>
              No se pudieron cargar los productos.
            </Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={obtenerProductos}
            >
              <Text style={styles.retryButtonText}>
                Intentar nuevamente
              </Text>
            </TouchableOpacity>
          </View>

        ) : productos.length === 0 ? (

          /* INVENTARIO VACIO */
          <View style={styles.centerContainer}>
            <Text style={styles.emptyIcon}>📦</Text>

            <Text style={styles.messageText}>
              No hay productos registrados.
            </Text>
          </View>

        ) : (

          /* LISTA DE PRODUCTOS */
          <View style={styles.productsContainer}>

            {productos.map((producto) => (

              <View
                key={producto.id}
                style={styles.productCard}
              >

                <View style={styles.productImage}>
                  <Text style={styles.productEmoji}>
                    📦
                  </Text>
                </View>

                <View style={styles.productInfo}>

                  <Text style={styles.productName}>
                    {producto.nombre}
                  </Text>

                  <Text style={styles.productPrice}>
                    {formatearPrecio(producto.precio)}
                  </Text>

                  <View style={styles.stockContainer}>
                    <Text style={styles.stockLabel}>
                      Stock disponible:
                    </Text>

                    <Text style={styles.stockValue}>
                      {producto.stock} unidades
                    </Text>
                  </View>

                </View>

              </View>

            ))}

          </View>

        )}

      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#0B0B0F',
  },

  scrollContent: {
    paddingBottom: 30,
  },

  header: {
    backgroundColor: '#18181B',
    paddingTop: 45,
    paddingBottom: 35,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  headerIcon: {
    fontSize: 55,
    marginBottom: 10,
  },

  headerTitle: {
    fontSize: 29,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  headerSubtitle: {
    fontSize: 14,
    color: '#A78BFA',
    marginTop: 5,
  },

  titleContainer: {
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  sectionSubtitle: {
    fontSize: 13,
    color: '#A1A1AA',
    marginTop: 5,
  },

  refreshButton: {
    backgroundColor: '#7C3AED',
    marginHorizontal: 20,
    padding: 13,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },

  refreshButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },

  productsContainer: {
    paddingHorizontal: 15,
  },

  productCard: {
    backgroundColor: '#18181B',
    borderRadius: 18,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#27272A',
  },

  productImage: {
    width: 95,
    height: 105,
    backgroundColor: '#27272A',
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },

  productEmoji: {
    fontSize: 43,
  },

  productInfo: {
    flex: 1,
  },

  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },

  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FACC15',
    marginBottom: 10,
  },

  stockContainer: {
    backgroundColor: '#27272A',
    padding: 9,
    borderRadius: 9,
  },

  stockLabel: {
    fontSize: 11,
    color: '#A1A1AA',
  },

  stockValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#A78BFA',
    marginTop: 3,
  },

  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 35,
  },

  messageText: {
    color: '#A1A1AA',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 15,
  },

  emptyIcon: {
    fontSize: 45,
  },

  retryButton: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 15,
  },

  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

});