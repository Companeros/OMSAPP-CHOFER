import React, { Component } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as signalR from '@microsoft/signalr';

class SignalRClient extends Component {
  constructor(props) {
    super(props);

    this.state = {
      connection: null,
      isConnectionActive: false,
    };
  }

  componentDidMount() {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('https://omsappapi.azurewebsites.net/Hubs/ChatHub')
      .build();

    this.setState({ connection }, () => {
      this.state.connection.start()
        .then(() => {
          console.log('Conexión establecida desde la Aplicación A.');
          this.setState({ isConnectionActive: true });
          this.sendCoordinatesToServer();
        })
        .catch((error) => {
          console.error('Error al iniciar la conexión:', error);
        });
    });
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

  startConnection = () => {
    const { connection } = this.state;

    connection.start()
      .then(() => {
        console.log('Conexión establecida desde la Aplicación A.');
        this.setState({ isConnectionActive: true });
        this.sendCoordinatesToServer();
      })
      .catch((error) => {
        console.error('Error al iniciar la conexión:', error);
      });
  };

  stopConnection = () => {
    const { connection } = this.state;

    connection.stop()
      .then(() => {
        console.log('Conexión cerrada desde la Aplicación A.');
        this.setState({ isConnectionActive: false });
      })
      .catch((error) => {
        console.error('Error al detener la conexión:', error);
      });
  };

  sendCoordinatesToServer = () => {
    const { connection } = this.state;

    for (let i = 0; i < 100; i++) {
      const latitude = Math.random() * (90.0 - (-90.0)) - 90.0;
      const longitude = Math.random() * (180.0 - (-180.0)) - 180.0;
      const message = `Latitud: ${latitude}, Longitud: ${longitude}`;

      connection.invoke('SendMessageToB', message)
        .then(() => {
          console.log(`Mensaje enviado desde la Aplicación A: ${message}`);
        })
        .catch((error) => {
          console.error('Error al enviar el mensaje:', error);
        });
    }
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
