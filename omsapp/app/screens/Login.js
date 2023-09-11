import React, { useState } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import SubmitButton from "../molecules/SubmitButton";
import PasswordInput from "../molecules/PasswordInput";
import EmailInput from "../molecules/EmailInput";
import { Color, FontSize } from "../styles/GlobalStyles";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
            title="Iniciar Sesion"
            onPress={() => {}}
            width={"100%"}
            backgroundColor={Color.aqua_500}
            textColor={"white"}
          />
        </View>
      </View>
      <View style={styles.footer}></View>
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
