import React, { useState, useEffect, useContext } from "react";
import { Text, StyleSheet, View, Modal } from "react-native";
import { Button } from "../atoms/Button";
import { Color, FontSize } from "../styles/GlobalStyles";
import SubmitButton from "../molecules/SubmitButton";
import axios from 'axios';
import * as Location from 'expo-location';
import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { UserContext } from '../../UserContext';
import Toast from "react-native-toast-message";

export const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [locationActive, setLocationActive] = useState(false);
  const [connection, setConnection] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [isTurnStarted, setIsTurnStarted] = useState(false);
  const [startButtonTitle, setStartButtonTitle] = useState("Iniciar Turno");
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useContext(UserContext);
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const showSuccessToast = () => {
    Toast.show({
      type: "success",
      text1: "Inicio de sesión correcto",
      text2: "Se ha iniciado sesión correctamente",
      visibilityTime: 2000,
      onHide: () => navigateToHomeScreen(),
    });
  };

  const showSErrorToast = () => {
    Toast.show({
      type: "error",
      text1: "Inicio de sesión incorrecto",
      text2: "Se ha producido un error al iniciar sesión",
      onShow: () => {
        // Modificar método de limpiado de campos
        setEmail("");
        setPassword("");
      },
    });
  };

  const sendRequestToAPI = async (wDay_start_finish) => {
    try {
      console.log(user.userinfo);
      const requestData = {
        id: 0,
        wDay_start_finish: wDay_start_finish,
        person_identification: user.userinfo.id,
        wDay_condition: true,
      };

      const headers = {
        accept: "text/plain",
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.results}`, // Reemplaza YOUR_ACCESS_TOKEN con tu token real
      };

      const response = await axios.post(
        "https://omsappapi.azurewebsites.net/api/WorkingDay/SetWorkingDay",
        requestData,
        { headers }
      );

      console.log(response.status);
      if (response.status === 201) {
        console.log("Solicitud a la API exitosa. Status 201.");
        if (connection && connection.state === HubConnectionState.Connected) {
          connection.invoke("SendMessageToB", "Turno iniciado");
        }
        if (isTurnStarted === false) {
          setIsTurnStarted(true);
          setStartButtonTitle("Terminar Turno");

          setModalVisible(false);
          sendCoordinatesToServer();
        }
      } else {
        console.log(response.data.singleData.mensaje);
        setErrorMessage(response.data.singleData.mensaje);
        setErrorModalVisible(true);
        console.log("La solicitud a la API no devolvió un status 201.");
      }
    } catch (error) {
      console.error("Error al realizar la solicitud a la API:", error.message);
    }
  };

  useEffect(() => {
    const createConnection = async () => {
      if (connection && connection.state === HubConnectionState.Disconnected) {
        try {
          await connection.start();
          console.log("Conexión SignalR establecida con éxito.");
        } catch (error) {
          console.error("Error al iniciar la conexión SignalR:", error);
        }
      } else if (!connection) {
        const hubConnection = new HubConnectionBuilder()
          .withUrl("https://omsappapi.azurewebsites.net/Hubs/ChatHub")
          .build();

        hubConnection.on("ReceiveCoordinates", (message) => {
          console.log(`Coordenadas recibidas desde el servidor: ${message}`);
        });

        setConnection(hubConnection);

        try {
          await hubConnection.start();
          console.log("Conexión SignalR establecida con éxito.");
        } catch (error) {
          console.error("Error al iniciar la conexión SignalR:", error);
        }
      } else {
        console.warn(
          "La conexión ya está en un estado diferente a Disconnected."
        );
      }
    };

    createConnection();

    return () => {
      if (connection && connection.state === HubConnectionState.Connected) {
        connection.stop();
        console.log("Conexión SignalR detenida.");
      }
    };
  }, [connection]);

  const sendCoordinatesToServer = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.error("Permiso de ubicación denegado");
      return;
    }

    const newIntervalId = setInterval(async () => {
      try {
        let location = await Location.getCurrentPositionAsync({});
        const latitude = location.coords.latitude;
        const longitude = location.coords.longitude;
        const message = `Latitud: ${latitude}, Longitud: ${longitude}`;

        if (connection && connection.state === HubConnectionState.Connected) {
          connection
            .invoke("SendMessageToB", message)
            .then(() => {
              console.log(`Coordenadas enviadas al servidor: ${message}`);
            })
            .catch((error) => {
              console.error("Error al enviar las coordenadas:", error);
            });
        } else {
          console.error(
            "La conexión SignalR no está en estado Connected para enviar coordenadas."
          );
        }
      } catch (error) {
        console.error("Error al obtener las coordenadas:", error);
      }
    }, 1000);

    setIntervalId(newIntervalId);
    setIsTurnStarted(true);
    setModalVisible(false);
  };

  const stopSendingCoordinates = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsTurnStarted(false);
  };

  const handleStartTurn = () => {
    console.log("Iniciar turno");
    sendRequestToAPI(true);
    setLocationActive(true);
  };

  const handleEndTurn = () => {
    console.log("Terminar turno");
    stopSendingCoordinates();
    sendRequestToAPI(false);
    setLocationActive(false);
    setStartButtonTitle("Iniciar Turno");
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible || errorModalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setErrorModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {errorMessage ? (
              <>
                <Text style={styles.modalTitle}>{errorMessage}</Text>
                <View style={{ marginBottom: 15 }}>
                  <SubmitButton
                    title="Aceptar"
                    width={250}
                    height={50}
                    backgroundColor={Color.aqua_500}
                    textColor="white"
                    onPress={() => {
                      setModalVisible(false);
                      setErrorModalVisible(false);
                      setErrorMessage("");
                    }}
                  />
                </View>
              </>
            ) : (
              <>
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
              </>
            )}
          </View>
        </View>
      </Modal>
      <View style={styles.outerCircle}>
        <View style={styles.innnerCircle}>
          <Button
            title={startButtonTitle}
            width={250}
            height={50}
            backgroundColor={isTurnStarted ? Color.red : Color.aqua_500}
            onPress={
              isTurnStarted ? handleEndTurn : () => setModalVisible(true)
            }
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
