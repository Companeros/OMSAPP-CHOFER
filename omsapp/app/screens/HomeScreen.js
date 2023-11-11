import React, { useState, useEffect, useRef, useContext } from "react";
import { Text, StyleSheet, View, Modal } from "react-native";
import { Color, FontSize } from "../styles/GlobalStyles";
import SubmitButton from "../molecules/SubmitButton";
import Toast from "react-native-toast-message";
import { sendRealtime, stopRealtime } from "../services/realtime";
import { startLocation, stopLocation } from "../services/location";
import { useFetch, useSend } from "../services/hooks";
import { UserContext } from '../../UserContext';
import { endTime, startTime } from "../services/validation";
import * as TaskManager from "expo-task-manager";

export const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isTurnStarted, setIsTurnStarted] = useState(null);
  const { data: info, fetchData } = useFetch();
  const { error, sendData, statusCode } = useSend();
  const { user } = useContext(UserContext);

  const showToast = (type, title, subtitle) => {
    Toast.show({
      type: type,
      text1: title,
      text2: subtitle,
      visibilityTime: 3000,
    });
  };

  TaskManager.defineTask("background-location-task", ({ data: { locations }, error }) => {
    if (error) {
      console.log(error.message);
      return;
    }
    sendRealtime(locations[0].coords.latitude, locations[0].coords.longitude, info[0].routeId, info[0].bRouteDescription, info[0].busId)
  });

  useEffect(() => {
    fetchData(`/Assignment/GetInfoDriver`, { id: user.userinfo.id })
  }, [])

  useEffect(() => {
    const sendRequestToAPI = async (wDay_start_finish) => {
      try {
        await sendData(
          "/WorkingDay/SetWorkingDay",
          {
            accept: "text/plain",
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.results}`,
          },
          {
            id: 0,
            wDay_start_finish: wDay_start_finish,
            person_identification: user.userinfo.id,
            wDay_condition: true,
          }
        );
      } catch (error) {
        console.error("Error al realizar la solicitud a la API:", error.message);
      }
    };

    if (isTurnStarted !== null) {
      sendRequestToAPI(isTurnStarted)
    }

  }, [isTurnStarted])

  const handleStartTurn = () => {
    setModalVisible(false);
    setIsTurnStarted(startTime(info[0].assignmentStartDate, info[0].assignmentStartTime, info[0].assignmentFinishDate, info[0].assignmentFinishTime));
    console.log(isTurnStarted, statusCode)
    if (isTurnStarted || isTurnStarted !== null) {
      if (statusCode == 201) {
        startLocation();
      }
    } else {
      showToast(
        "error",
        "No tiene turno asignado",
        "Validar que se a registrado su tanda laboral"
      );
    }
  };
  const handleEndTurn = () => {
    setIsTurnStarted(endTime(info[0].assignmentFinishDate, info[0].assignmentFinishTime));
    if (!isTurnStarted || isTurnStarted !== null) {
      if (statusCode == 201) {
        console.log(statusCode)
        stopLocation();
        stopRealtime();
        showToast(
          "success",
          "Ha finalizado su turno",
          "La transmisión de su localización ha sido concluido exitosamente"
        );
      }
    } else {
      showToast(
        "error",
        "Su turno no ha concluido",
        "Validar la hora de cierre de su turno"
      );
    }
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