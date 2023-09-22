import React, { Component } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as signalR from '@microsoft/signalr';
import * as Location from 'expo-location';

export class SignalRClient extends Component {
  constructor(props) {
    super(props);

    this.state = {
      connection: null,
      isConnectionActive: false,
    };

    this.coordinatesInterval = null; // Variable para el intervalo
  }

  async componentDidMount() {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('https://omsappapi.azurewebsites.net/Hubs/ChatHub')
      .build();

    this.setState({ connection }, async () => {
      await this.state.connection.start()
        .then(() => {
          console.log('Conexión establecida desde la Aplicación A.');
          this.setState({ isConnectionActive: true });
          this.startCoordinatesInterval(); // Iniciar el envío de coordenadas cada 3 segundos
        })
        .catch((error) => {
          console.error('Error al iniciar la conexión:', error);
        });
    });
  }

  componentWillUnmount() {
    this.stopCoordinatesInterval(); // Detener el intervalo cuando se desmonta el componente
  }

  render() {
    const { isConnectionActive } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.text}>SignalR Client</Text>
        <Button
          title={isConnectionActive ? "Detener Conexión" : "Iniciar Conexión"}
          onPress={isConnectionActive ? this.stopConnection : this.startConnection}
        />
      </View>
    );
  }

  startConnection = async () => {
    const { connection } = this.state;

    await connection.start()
      .then(() => {
        console.log('Conexión establecida desde la Aplicación A.');
        this.setState({ isConnectionActive: true });
        this.startCoordinatesInterval(); // Iniciar el envío de coordenadas cada 3 segundos
      })
      .catch((error) => {
        console.error('Error al iniciar la conexión:', error);
      });
  };

  stopConnection = async () => {
    const { connection } = this.state;

    await connection.stop()
      .then(() => {
        console.log('Conexión cerrada desde la Aplicación A.');
        this.setState({ isConnectionActive: false });
        this.stopCoordinatesInterval(); // Detener el envío de coordenadas cuando se detiene la conexión
      })
      .catch((error) => {
        console.error('Error al detener la conexión:', error);
      });
  };

  startCoordinatesInterval = () => {
    this.coordinatesInterval = setInterval(this.sendCoordinatesToServer, 1000); // Intervalo de 3 segundos
  };

  stopCoordinatesInterval = () => {
    if (this.coordinatesInterval) {
      clearInterval(this.coordinatesInterval); // Detener el intervalo si está en marcha
    }
  };

  sendCoordinatesToServer = async () => {
    const { connection } = this.state;

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permiso de ubicación denegado');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;
    const message = `Latitud: ${latitude}, Longitud: ${longitude}`;

    connection.invoke('SendMessageToB', message)
      .then(() => {
        console.log(`Mensaje enviado desde la Aplicación A: ${message}`);
      })
      .catch((error) => {
        console.error('Error al enviar el mensaje:', error);
      });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default SignalRClient;
