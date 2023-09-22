// PerfilScreen.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Color, FontSize } from "../styles/GlobalStyles";

export const PerfilScreen = () => {
  // Simula información de usuario
  const usuario = {
    nombre: "John",
    apellido: "Doe",
    licencia: "1234567890",
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Perfil de Usuario</Text>
        <View style={styles.userInfo}>
          <Text style={styles.label}>Nombre:</Text>
          <Text style={styles.value}>{usuario.nombre}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.label}>Apellido:</Text>
          <Text style={styles.value}>{usuario.apellido}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.label}>Licencia:</Text>
          <Text style={styles.value}>{usuario.licencia}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  title: {
    fontSize: FontSize.header,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  userInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontSize: FontSize.normal,
    fontWeight: "bold",
  },
  value: {
    fontSize: FontSize.normal,
  },
});

export default PerfilScreen;
