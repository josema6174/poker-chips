import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.mesa}>
      <Text style={styles.textoFondo}>¡La mesa está lista!</Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  mesa: {
    flex: 1, // Ocupa toda la pantalla
    backgroundColor: '#166534', // Un verde oscuro estilo mesa de póker (equivalente a green-800 en Tailwind)
    alignItems: 'center', // Centra horizontalmente
    justifyContent: 'center', // Centra verticalmente
  },
  textoFondo: {
    color: '#ffffff', // Texto blanco
    fontSize: 30, // Equivalente a text-3xl
    fontWeight: 'bold',
  }
});
