import { Text, StyleSheet, View, Image } from "react-native";
import React, { Component } from "react";
import { Color, FontSize } from "../styles/GlobalStyles";
import SubmitButton from "../molecules/SubmitButton";
import { useNavigation } from '@react-navigation/native';
 
const StartScreen = () => {
  const navigation = useNavigation(); // Obtiene el objeto de navegación

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.line,
          { backgroundColor: Color.light_gray, left: -50, top: 185 },
        ]}
      />
      <View
        style={[
          styles.line,
          { backgroundColor: Color.dim_gray, right: -50, top: 150 },
        ]}
      />
      <Image
        source={require("../../assets/start.png")}
        style={styles.imageStyle}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Bienvenido a OMSAPP</Text>
        <Text style={styles.subtitle}>Por un transporte más eficiente</Text>
        <View style={styles.buttonContainer}>
          <SubmitButton
            title="Empezar"
            backgroundColor="white"
            width={"100%"}
            textColor={Color.aqua_500}
            onPress={() => {    navigation.navigate("Login"); // Redirige a la pantalla HomeScreen
          }}
          />
          <View
            style={[
              styles.line,
              { backgroundColor: "white", right: -50, top: 150 },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color.aqua_500,
  },
  imageStyle: {
    height: "40%",
    width: "100%",
    resizeMode: "contain",
  },
  content: {
    flex: 0.7,
    alignItems: "flex-start",
    width: "80%",
    paddingVertical: 50,
  },
  title: {
    fontSize: FontSize.big_header,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 20,
    color: "white",
  },
  buttonContainer: {
    width: "100%",
    paddingVertical: 50,
  },
  line: { width: "50%", height: 40, position: "absolute" },
});

export default StartScreen;
