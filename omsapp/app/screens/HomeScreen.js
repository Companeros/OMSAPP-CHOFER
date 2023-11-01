import React, { useState, useEffect, useRef} from "react";
import { Text, StyleSheet, View, Modal } from "react-native";
import { Color, FontSize } from "../styles/GlobalStyles";
import SubmitButton from "../molecules/SubmitButton";
import Toast from "react-native-toast-message";
import * as Location from "expo-location";
import { sendRealtime, stopRealtime } from "../services/realtime";

export const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isTurnStarted, setIsTurnStarted] = useState(false);
  const [locationSubscription, setLocationSubscription] = useState(null);
  const [latestLocation, setLatestLocation] = useState(null);
  const isMounted = useRef(true);

  const showToast = (type, title, subtitle) => {
    Toast.show({
      type: type,
      text1: title,
      text2: subtitle,
      visibilityTime: 3000,
    });
  };

  useEffect(() => {
    const startLocationTracking = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          showToast('error', 'Permiso denegado', 'No se puede obtener la ubicación sin permiso.');
          return;
        }

        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 3000,
            distanceInterval: 0,
          },
          (location) => {
            if (isMounted.current) {
              setLatestLocation(location);
            }
          }
        );

        if (isMounted.current) {
          sendRealtime(latestLocation?.coords.latitude, latestLocation?.coords.longitude, 14);
        }

        return () => {
          subscription.remove();
          stopRealtime();
        };
      } catch (error) {
        showToast('error', 'Error al obtener la ubicación', error.message);
      }
    };

    if (isTurnStarted) {
      startLocationTracking();
    }

    return () => {
      isMounted.current = false;
    };
  }, [isTurnStarted]);

  useEffect(() => {
    sendRealtime(latestLocation?.coords.latitude, latestLocation?.coords.longitude, 14)
  }, [locationSubscription])

  const handleStartTurn = async () => {
    setModalVisible(false);
    setIsTurnStarted(true);
    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 3000,
        distanceInterval: 0,
      },
      (location) => {
        setLatestLocation(location);
      }
    );
    setLocationSubscription(subscription);
  };
  const handleEndTurn = () => {
    showToast(
      "success",
      "Ha finalizado su turno",
      "La transmisión de su localización ha sido concluido exitosamente"
    );
    setIsTurnStarted(false);
    if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
    }
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
      <Text>Latitude: {latestLocation ? latestLocation.coords.latitude : "N/A"}</Text>
      <Text>Latitude: {latestLocation ? latestLocation.coords.longitude : "N/A"}</Text>
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
