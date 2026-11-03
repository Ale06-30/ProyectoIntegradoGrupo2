import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SesionUser() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Este es el cierre de sesión</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  text: { fontSize: 18, textAlign: 'center' },
});