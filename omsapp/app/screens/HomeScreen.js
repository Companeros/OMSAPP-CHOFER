import { Text, StyleSheet, View, Modal } from "react-native";
import React, { useState } from "react";
import { startLocation, stopLocation } from "../services/location";
import { Button } from "../atoms/Button";
import { Color, FontSize } from "../styles/GlobalStyles";
import SubmitButton from "../molecules/SubmitButton";

const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [locationActive, setlocationActive] = useState(false);

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>¿Desea iniciar su turno?</Text>
            <Text style={styles.modalText}>
              Una vez iniciado, solo podrá concluir una vez cumpla con su
              horario
            </Text>
            <View style={{ marginBottom: 15 }}>
              <SubmitButton
                title="Aceptar"
                width={250}
                height={50}
                backgroundColor={Color.aqua_500}
                textColor="white"
                onPress={() => {
                  startLocation();
                  setlocationActive(!locationActive);
                  setModalVisible(!modalVisible);
                }}
              />
            </View>
            <View style={{ marginBottom: 15 }}>
              <SubmitButton
                title="Cancelar"
                width={250}
                height={50}
                backgroundColor="white"
                borderWidth={2}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.outerCircle}>
        <View style={styles.innnerCircle}>
          {!locationActive ? (
            <Button
              title="Iniciar Turno"
              width={250}
              height={50}
              backgroundColor={Color.aqua_500}
              onPress={() => setModalVisible(true)}
              textColor="white"
            />
          ) : (
            <Button
              title="Finalizar Turno"
              width={250}
              height={50}
              backgroundColor={Color.red}
              onPress={() => {
                stopLocation();
                setlocationActive(!locationActive);
              }}
              textColor="white"
            />
          )}
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
  centeredView: {
    backgroundColor: Color.super_light_gray,
    opacity: 0.9,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
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
});

export default HomeScreen;
