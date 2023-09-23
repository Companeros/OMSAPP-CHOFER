import React, { useState, useEffect, useContext } from "react";

import { Text, StyleSheet, View, Modal } from "react-native";
import { Button } from "../atoms/Button";
import { Color, FontSize } from "../styles/GlobalStyles";
import SubmitButton from "../molecules/SubmitButton";
import axios from 'axios';
import * as Location from 'expo-location';
import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { UserContext } from '../../UserContext';

export const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [locationActive, setLocationActive] = useState(false);
  const [connection, setConnection] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [isTurnStarted, setIsTurnStarted] = useState(false);
  const {user} = useContext(UserContext); // Accede a las propiedades del contexto

  const sendRequestToAPI = async (wDay_start_finish) => {
    try {
      console.log(user.id)
      console.log(wDay_start_finish)
      const response = await axios.post(
        'https://omsappapi.azurewebsites.net/api/WorkingDay/SetWorkingDay',
        {
          id: 0,
          wDay_start_finish: true,
          person_identification: "RD4354545",
          wDay_condition: true
        },
        {
          headers: {
            'accept': 'text/plain',
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response)

      if (response.status === 201) {
        console.log('Solicitud a la API exitosa. Status 201.');
        // Luego, puedes iniciar la transmisión por SignalR o realizar otras acciones necesarias.
        // Por ejemplo:
        // iniciarSignalR();
      } else {
        console.log('La solicitud a la API no devolvió un status 201.');
      }
    } catch (error) {
      console.error('Error al realizar la solicitud a la API:', error.message);
    }
  };

  useEffect(() => {
    const createConnection = async () => {
      if (connection && connection.state === HubConnectionState.Disconnected) {
        try {
          await connection.start();
          console.log('Conexión SignalR establecida con éxito.');
        } catch (error) {
          console.error('Error al iniciar la conexión SignalR:', error);
        }
      } else if (!connection) {
        const hubConnection = new HubConnectionBuilder()
          .withUrl('https://omsappapi.azurewebsites.net/Hubs/ChatHub')
          .build();

        hubConnection.on('ReceiveCoordinates', (message) => {
          console.log(`Coordenadas recibidas desde el servidor: ${message}`);
        });

        setConnection(hubConnection);

        try {
          await hubConnection.start();
          console.log('Conexión SignalR establecida con éxito.');
        } catch (error) {
          console.error('Error al iniciar la conexión SignalR:', error);
        }
      } else {
        console.warn('La conexión ya está en un estado diferente a Disconnected.');
      }
    };

    createConnection();

    return () => {
      if (connection && connection.state === HubConnectionState.Connected) {
        connection.stop();
        console.log('Conexión SignalR detenida.');
      }
    };
  }, [connection]);

  const sendCoordinatesToServer = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permiso de ubicación denegado');
      return;
    }

    const newIntervalId = setInterval(async () => {
      let location = await Location.getCurrentPositionAsync({});
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;
      const message = `Latitud: ${latitude}, Longitud: ${longitude}`;

      if (connection && connection.state === HubConnectionState.Connected) {
        connection.invoke('SendMessageToB', message)
          .then(() => {
            console.log(`Coordenadas enviadas al servidor: ${message}`);
          })
          .catch((error) => {
            console.error('Error al enviar las coordenadas:', error);
          });
      } else {
        console.error('La conexión SignalR no está en estado Connected para enviar coordenadas.');
      }
    }, 3000); // Enviar coordenadas cada 3 segundos

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
    sendRequestToAPI(true);
    setLocationActive(true);
  };

  const handleEndTurn = () => {
    stopSendingCoordinates();
    sendRequestToAPI(false);
    setLocationActive(false);
  };

  return (
    <View style={styles.container}>
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
          {!locationActive ? (
            <Button
              title={isTurnStarted ? "Finalizar Turno" : "Iniciar Turno"}
              width={250}
              height={50}
              backgroundColor={isTurnStarted ? Color.red : Color.aqua_500}
              onPress={isTurnStarted ? handleEndTurn : () => setModalVisible(true)}
              textColor="white"
            />
          ) : (
            <Button
              title="Finalizar Turno"
              width={250}
              height={50}
              backgroundColor={Color.red}
              onPress={handleEndTurn}
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
