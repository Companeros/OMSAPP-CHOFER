import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
} from "react-native";
import SubmitButton from "../molecules/SubmitButton";
import PasswordInput from "../molecules/PasswordInput";
import EmailInput from "../molecules/EmailInput";
import { Color, FontSize } from "../styles/GlobalStyles";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { useUser } from "../../UserContext"; // Importa useUser para acceder al contexto
import { useSend } from "../services/hooks";

const Login = () => {
  const initialState = {
    user: "",
    password: "",
  };
  const [formData, setFormData] = useState(initialState);
  const navigation = useNavigation();
  const { login, logout } = useUser();
  const { data, error, isLoading, sendData } = useSend();

  const showSuccessToast = () => {
    Toast.show({
      type: "success",
      text1: "Inicio de sesión exitoso",
      text2: "Ha iniciado sesión correctamente",
      visibilityTime: 1000,
      onHide: () => {
        navigation.navigate("Main");
      },
    });
  };

  const showErrorToast = () => {
    Toast.show({
      type: "error",
      text1: "Credenciales incorrectas",
      text2: "Favor ingrese nuevamente sus credenciales",
      visibilityTime: 3000,
      onShow: () => {
        setFormData({ ...initialState });
      },
    });
  };

  const handleLogin = async () => {
    await sendData("/Users/login", formData, "*/*", null);
  };

  useEffect(() => {
    if (Object.keys(data).length !== 0) {
      try {
        if (data.success === true) {
          login(data);
          showSuccessToast();
        } else {
          showErrorToast();
        }
      } catch (error) {
        console.error("Error de solicitud:", error);
      }
    }
  }, [data]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/bus.png")}
        style={styles.imageStyle}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Iniciar Sesión</Text>
        <EmailInput
          value={formData.user}
          onChange={(user) => setFormData({ ...formData, user })}
        />
        <PasswordInput
          value={formData.password}
          onChange={(password) => setFormData({ ...formData, password })}
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
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default Login;
