import React, { useContext } from "react"; // Importa useContext desde React
import { View, Text, StyleSheet, Button } from "react-native";
import { UserContext } from '../../UserContext';


export const PerfilScreen = ({ navigation }) => {
 
  const {user} = useContext(UserContext); // Accede a las propiedades del contexto

  console.log(user.tittle);

  const usuario = {
    nombre: "John",
    apellido: "Doe",
    licencia: "1234567890",
  };

  const handleCerrarSesion = () => {
    navigation.navigate("Login"); // Redirige a la pantalla HomeScreen

  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Perfil de Usuario</Text>
        <View style={styles.userInfo}>
          <Text style={styles.label}>Nombre:</Text>
          <Text style={styles.value}>{user.tittle}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.label}>Apellido:</Text>
          <Text style={styles.value}>{usuario.apellido}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.label}>Licencia:</Text>
          <Text style={styles.value}>{usuario.licencia}</Text>
        </View>
        <Button
          title="Cerrar Sesión"
          onPress={handleCerrarSesion}
          color="red"
        />
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
    fontSize: 24,
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
    fontSize: 16,
    fontWeight: "bold",
  },
  value: {
    fontSize: 16,
  },
});

export default PerfilScreen;
