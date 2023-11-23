import React, { useState, useEffect, useRef, useContext } from "react";
import { Text, StyleSheet, View, Modal } from "react-native";
import { Color, FontSize } from "../styles/GlobalStyles";
import SubmitButton from "../molecules/SubmitButton";
import Toast from "react-native-toast-message";
import { sendRealtime, stopRealtime } from "../services/realtime";
import { startLocation, stopLocation } from "../services/location";
import { useFetch, useSend } from "../services/hooks";
import { UserContext } from '../../UserContext';
import * as TaskManager from "expo-task-manager";
import { encryptData } from "../services/Criptography"
export const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isTurnStarted, setIsTurnStarted] = useState(false);
  const { data: info, fetchData } = useFetch();
  const { data: message, error, sendData, statusCode,clearState  } = useSend();
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
    if (locations) {
      // Haz algo con las ubicaciones capturadas
      sendRealtime(encryptData(locations[0].coords.latitude), encryptData(locations[0].coords.longitude), info[0].routeId, info[0].bRouteDescription, info[0].busId)
    }
     
  });

  useEffect(() => {
    fetchData(`/Assignment/GetInfoDriver`, { id: user.userinfo.id });
  }, [])
  useEffect(() => {
    ToastStartBiffurc()
  }, [statusCode])


  const ToastStartBiffurc =  () =>{
    let title1="";
    let Type1="success";
    let subtitle2="";
    if (statusCode == 201)
    {
      if(isTurnStarted== false)
      {
        setIsTurnStarted(true)
      startLocation();
      Type1= "success";
      title1 =  "Ha iniciado su turno";
      subtitle2="La transmisión de su localización ha sido iniciada exitosamente";
    }
    else if (isTurnStarted== true){
      setIsTurnStarted(false)
      Type1= "success";
      title1 =  "Ha finalizado su turno";
      subtitle2="La transmisión de su localización ha sido concluido exitosamente";
    }
     


    }
 else if(statusCode == 406)
    {
      Type1 = "error";
      title1 = "Fuera de tiempo";
      subtitle2 = "Validar que su horario laboral";
  }
  else if(statusCode == 404)
  {
    Type1 = "error";
    title1 = "No tiene turno asignado";
    subtitle2 = "Validar que se a registrado su tanda laboral";
 
}
else if (statusCode == 200)
{
  Type1 = "error";
  title1 = "Turno ya iniciado";
  subtitle2 = "Este turno ya ha sido iniciado";
}
if(statusCode != 0) {


  showToast(
    Type1,
    title1 ,
    subtitle2
  )
  clearState()
}
  }
  const handleStartTurn = async () => {
    setModalVisible(false);

try{
     await sendData(
      "/WorkingDay/SetWorkingDay",
      {
        accept: "text/plain",
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.results}`,
      },
      {
        id: 0,
        wDay_start_finish: true,
        person_identification: user.userinfo.id,
        wDay_condition: true,
      })
        console.log("status ",statusCode)
       
      
      
      
      }
      catch (error) {
        // Manejar el error de la llamada a la API
        console.error("Error al iniciar el turno:", error);
        ToastStartBiffurc(); // Mostrar el mensaje de error correspondiente
      }
  };

  const handleEndTurn = async () => {
     sendData(
      "/WorkingDay/SetWorkingDay",
      {
        accept: "text/plain",
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.results}`,
      },
      {
        id: 0,
        wDay_start_finish: false,
        person_identification: user.userinfo.id,
        wDay_condition: true,
      }).then(() => {
        console.log("status ",statusCode)
        
      }
    ).catch(
      
    )
    stopLocation()
    stopRealtime()
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