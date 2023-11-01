import React, { useState, useEffect, useRef} from "react";
import { Text, StyleSheet, View, Modal } from "react-native";
import { Color, FontSize } from "../styles/GlobalStyles";
import SubmitButton from "../molecules/SubmitButton";
import Toast from "react-native-toast-message";
import * as Location from "expo-location";
import { sendRealtime, stopRealtime } from "../services/realtime";
import { startLocation, stopLocation } from "../services/location";

export const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isTurnStarted, setIsTurnStarted] = useState(false);

  const showToast = (type, title, subtitle) => {
    Toast.show({
      type: type,
      text1: title,
      text2: subtitle,
      visibilityTime: 3000,
    });
  };

  const handleStartTurn = async () => {
    setModalVisible(false);
    setIsTurnStarted(true);
    startLocation();
  };
  const handleEndTurn = () => {
    showToast(
      "success",
      "Ha finalizado su turno",
      "La transmisión de su localización ha sido concluido exitosamente"
    );
    setIsTurnStarted(false);
    stopLocation();
    stopRealtime();
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setErrorModalVisible(false);
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
                onPress={handleStartTurn}
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
                  setModalVisible(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.outerCircle}>
        <View style={styles.innnerCircle}>
          {isTurnStarted ? (
            <SubmitButton
              title="Finalizar Turno"
              width={250}
              height={50}
              backgroundColor={Color.red}
              textColor="white"
              onPress={() => handleEndTurn()}
            />
          ) : (
            <SubmitButton
              title="Iniciar Turno"
              width={250}
              height={50}
              backgroundColor={Color.aqua_500}
              textColor="white"
              onPress={() => setModalVisible(true)}
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
      <Toast />
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