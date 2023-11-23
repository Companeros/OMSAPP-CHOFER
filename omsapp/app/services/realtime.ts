import { HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
interface Coordenadas {
  latitude: string | null;
  longitude: string| null;
  RouteId: string| null;
  Route: string| null;
  BusId: string| null;
  ConnectionId: string| null;
}
const hubConnection = new HubConnectionBuilder()
  .withUrl("https://omsappapi.azurewebsites.net/Hubs/ChatHub")
  .withAutomaticReconnect() // Enable automatic reconnection
  .build();

hubConnection.onreconnected(() => {
  console.log("Conexión restablecida");
});

export const sendRealtime = async (latitude : string | null, longitude : string | null, routeId : number, route: string, busId : string ) => {
  if (hubConnection.state === HubConnectionState.Disconnected) {
    try {
      await hubConnection.start();
      console.log("Conexión iniciada");
    } catch (error) {
      console.error("Error al iniciar la conexión:", error);
    }
  }

  if (hubConnection.state === HubConnectionState.Connected) {
    const coordenadasObj: Coordenadas = {
      latitude: latitude || "",
      longitude: longitude || "",
      RouteId: routeId.toString(),
      Route: route,
      BusId: busId,
      ConnectionId: "connection123",
    };

    hubConnection
      .invoke("SendMessageToB", coordenadasObj)
      .then(() => {
        console.log(`Coordenadas enviadas al servidor: ${coordenadasObj}`);
      })
      .catch((error) => {
        console.error("Error al enviar las coordenadas:", error);
      });
  } else {
    console.error("La conexión no se pudo establecer");
  }
};
export const stopRealtime = async () => {
  if (hubConnection.state === HubConnectionState.Connected) {
    const coordenadasObj: Coordenadas = {
      latitude: null,
      longitude: null ,
      RouteId: null,
      Route: null,
      BusId: null,
      ConnectionId: "connection123",
    };

    try {
      await hubConnection.invoke("SendMessageToB", coordenadasObj);
      await hubConnection.stop();
      console.log("Conexión finalizada desde la Aplicación B");
    } catch (error) {
      console.error("Error al enviar las coordenadas:", error);
    }
  }
};