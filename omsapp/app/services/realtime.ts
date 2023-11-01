import { HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";

const hubConnection = new HubConnectionBuilder()
  .withUrl("https://omsappapi.azurewebsites.net/Hubs/ChatHub")
  .withAutomaticReconnect() // Enable automatic reconnection
  .build();

hubConnection.onreconnected(() => {
  console.log("Conexión restablecida");
});

export const sendRealtime = async (latitude : string | null, longitude : string | null, route : number) => {
  try {
    if (hubConnection.state === HubConnectionState.Disconnected) {
      await hubConnection.start();
      console.log("Conexión iniciada");
    }
    if (hubConnection.state === HubConnectionState.Connected) {
      const message = `Latitud: ${latitude}, Longitud: ${longitude}, Route: ${route}`;
      hubConnection
        .invoke("SendMessageToB", message)
        .then(() => {
          console.log(`Coordenadas enviadas al servidor: ${message}`);
        })
        .catch((error) => {
          console.error("Error al enviar las coordenadas:", error);
        });
    } else {
      console.log("La conexión no está en el estado 'Connected'");
    }
  } catch (error) {
    console.error("Error al iniciar la conexión:", error);
    throw error;
  }
};

export const stopRealtime = async () => {
  if (hubConnection.state !== HubConnectionState.Disconnected) {
    await hubConnection.stop();
    console.log("Conexión finalizada desde la Aplicación B");
  }
};