import { HubConnectionBuilder } from "@microsoft/signalr";

const hubConnection = new HubConnectionBuilder()
  .withUrl("https://omsappapi.azurewebsites.net/Hubs/ChatHub")
  .build();

export const sendRealtime = async (latitude : string | null, longitude : string | null, route : number) => {
    try {
      await hubConnection.start();
      console.log("Conexión establecida desde la Aplicación B");
      const message = `Latitud: ${latitude}, Longitud: ${longitude}, Route: ${route}`;
      hubConnection
      .invoke("SendMessageToB", message)
            .then(() => {
              console.log(`Coordenadas enviadas al servidor: ${message}`);
            })
            .catch((error) => {
              console.error("Error al enviar las coordenadas:", error);
            });
    } catch (error) {
      console.error("Error al iniciar la conexión:", error);
      throw error;
    }
  };

export const stopRealtime = async () => {
    await hubConnection.stop();
}