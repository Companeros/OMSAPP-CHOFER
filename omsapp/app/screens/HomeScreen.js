import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import React, { Component } from "react";
import { startLocation, stopLocation } from "../services/location";
import { Button } from "../atoms/Button";
import { Color } from "../styles/GlobalStyles";

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.outerCircle}>
        <View style={styles.innnerCircle}>
          <Button
            title="Iniciar Turno"
            width={250}
            height={50}
            backgroundColor={Color.aqua_500}
            onPress={startLocation}
            textColor="white"
          />
          <Button
            title="Finalizar Turno"
            width={250}
            height={50}
            backgroundColor={Color.red}
            onPress={stopLocation}
            textColor="white"
          />
        </View>
      </View>
      <View
        style={[
          styles.line,
          { backgroundColor: Color.aqua_500, top: 125, left: 250 },
        ]}
      />
      <View
        style={[
          styles.line,
          { backgroundColor: Color.aqua_500, bottom: 100, right: 250 },
        ]}
      />
      <View
        style={[
          styles.line,
          { backgroundColor: Color.light_gray, bottom: 200, left: 250 },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  outerCircle: {
    backgroundColor: Color.super_light_gray,
    width: 300,
    height: 300,
    borderRadius: 150,
    alignItems: "center",
    justifyContent: "center",
  },
  innnerCircle: {
    backgroundColor: Color.semi_gray,
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  line: {
    width: "60%",
    height: 35,
    position: "absolute",
  },
});

export default HomeScreen;
