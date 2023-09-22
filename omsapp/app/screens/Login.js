import React, { useState } from "react";
import { StyleSheet, View, Text, Image, Modal, TouchableOpacity } from "react-native";
import SubmitButton from "../molecules/SubmitButton";
import PasswordInput from "../molecules/PasswordInput";
import EmailInput from "../molecules/EmailInput";
import { Color, FontSize } from "../styles/GlobalStyles";
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../UserContext"; // Importa useUser para acceder al contexto

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [credentialsValid, setCredentialsValid] = useState(true);
  const navigation = useNavigation(); // Obtiene el objeto de navegación
  const { login, logout } = useUser(); // Obtén la función login y logout del contexto

  const handleLogin = async () => {
    try {
      console.log(email);
      console.log(password);
      const response = await axios.post(
        'https://omsappapi.azurewebsites.net/api/Users/login',
        null, // No necesitas enviar datos en el cuerpo, ya que los parámetros están en la URL
        {
          params: {
            user: email,
            password: password
          },
          headers: {
            'accept': '*/*'
          }
        }
      );
  
      console.log("esta es la respuesta ", response.data); // Accede a la respuesta en response.data
  
      if (response.status === 200) {
        setCredentialsValid(true);
        login(response.data.userinfo); // Guarda la información del usuario en el contexto
        console.log()
        setModalVisible(true);
      } else {
        setCredentialsValid(false);
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Error de solicitud:', error);
      setCredentialsValid(false);
      setModalVisible(true);
    }
  };

  const handleLogout = () => {
    logout(); // Cierra la sesión y limpia la información del usuario
  };

  const navigateToHomeScreen = () => {
    setEmail(""); // Establece el campo de correo electrónico en blanco
    setPassword(""); // Establece el campo de contraseña en blanco
    navigation.navigate("Main"); // Redirige a la pantalla HomeScreen
  };
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/bus.png")}
        style={styles.imageStyle}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Iniciar Sesión</Text>
        <EmailInput value={email} onChange={setEmail} />
        <PasswordInput
          value={password}
          onChange={setPassword}
          placeholder="Password"
        />
        <View style={styles.buttonContainer}>
          <SubmitButton
            title="Iniciar Sesión"
            onPress={handleLogin}
            width={"100%"}
            backgroundColor={Color.aqua_500}
            textColor={"white"}
          />
        </View>
      </View>
      <View style={styles.footer}></View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {credentialsValid ? (
              <>
                <Text style={styles.modalTitle}>Inicio de Sesión Exitoso</Text>
                <Text style={styles.modalText}>
                  ¡Bienvenido! Su inicio de sesión fue exitoso.
                </Text>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: Color.aqua_500 }]}
                  onPress={navigateToHomeScreen} // Redirige al HomeScreen
                  // Puedes redirigir al HomeScreen o la pantalla que desees
                >
                  <Text style={[styles.modalButtonText, { color: "white" }]}>
                    Continuar
                  </Text>
                </TouchableOpacity>
              
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>Error de Inicio de Sesión</Text>
                <Text style={styles.modalText}>
                  Credenciales incorrectas. Por favor, inténtelo nuevamente.
                </Text>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: Color.red }]}
                  onPress={() => {
                    setModalVisible(false);
                  }}
                >
                  <Text style={[styles.modalButtonText, { color: "white" }]}>
                    Cerrar
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "start",
    width: "100%",
    paddingHorizontal: 30,
  },
  buttonContainer: {
    alignItems: "flex-end",
    marginVertical: 20,
  },
  imageStyle: {
    height: "40%",
    width: "100%",
    resizeMode: "contain",
  },
  footer: {
    backgroundColor: Color.aqua_500,
    width: "120%",
    height: "3%",
    position: "absolute",
    alignSelf: "center",
    bottom: 0,
  },
  title: { fontSize: FontSize.header, marginBottom: 30 },
  content: { justifyContent: "space-between" },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: FontSize.header,
    fontWeight: "bold",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalButton: {
    width: 250,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  modalButtonText: {
    fontSize: FontSize.body,
    fontWeight: "bold",
  },
});

export default Login;
