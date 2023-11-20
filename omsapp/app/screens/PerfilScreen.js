import React, { useContext } from "react"; // Importa useContext desde React
import { View, Text, StyleSheet, Image } from "react-native";
import { UserContext } from "../../UserContext";
import { Color } from "../styles/GlobalStyles";
import SubmitButton from "../molecules/SubmitButton";
import { decryptData} from "../services/Criptography"
import { stopLocation } from "../services/location";
import { stopRealtime } from "../services/realtime";
import { useSend } from "../services/hooks";


export const PerfilScreen = ({ navigation }) => {
  const { user } = useContext(UserContext); // Accede a las propiedades del contexto
  const {sendData, statusCode  } = useSend();
  console.log(user.userinfo.tittle)
  const handleSignOut = () => {
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
        stopRealtime();
        stopLocation();
      }
    ).catch(
      
    )
    navigation.navigate("StartScreen"); // Redirige a la pantalla HomeScreen
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.line,
          { backgroundColor: Color.dim_gray, right: -50, top: 150 },
        ]}
      />
      <View
        style={[
          styles.line,
          { backgroundColor: Color.aqua_500, left: 0, top: 400 },
        ]}
      />
      <Image
        source={require("../../assets/profile.png")}
        style={styles.imageStyle}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Información</Text>
        <View style={styles.form}>
          <View style={styles.userInfo}>
            <Text style={styles.label}>Nombre:</Text>
            <Text style={styles.value}>{decryptData(user.userinfo.tittle)}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.label}>Número:</Text>
            <Text style={styles.value}>{decryptData(user.userinfo.personPhone)}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.label}>Licencia:</Text>
            <Text style={styles.value}>{decryptData(user.userinfo.personLicense)}</Text>
          </View>
        </View>
        <SubmitButton
          title="Cerrar Sesión"
          onPress={handleSignOut}
          width={"100%"}
          backgroundColor={Color.dim_gray}
          textColor="black"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageStyle: {
    height: "50%",
    width: "100%",
    resizeMode: "contain",
  },
  content: {
    flex: 0.8,
    alignItems: "flex-start",
    width: "80%",
    paddingVertical: 20,
  },
  form: {
    marginVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  userInfo: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
  },
  value: {
    fontSize: 20,
  },
  line: { width: "50%", height: 40, position: "absolute" },
});

export default PerfilScreen;
