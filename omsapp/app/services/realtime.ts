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
  try {
    if (hubConnection.state === HubConnectionState.Disconnected) {
      await hubConnection.start();
      console.log("Conexión iniciada");
    }
    if (hubConnection.state === HubConnectionState.Connected) {
      const message = `Latitud: ${latitude}, Longitud: ${longitude}, RouteId: ${routeId}, Route: ${route}, BusId: ${busId}`;

      const coordenadasObj: Coordenadas = {
        latitude: latitude || "",
        longitude: longitude || "",
        RouteId: routeId.toString(),
        Route: route,
        BusId: busId,
        ConnectionId: "connection123",
      };
      console.log(coordenadasObj)
      hubConnection
        .invoke("SendMessageToB", coordenadasObj)
        .then(() => {
          console.log(`Coordenadas enviadas al servidor: ${coordenadasObj}`);
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
    const coordenadasObj: Coordenadas = {
      latitude: null,
      longitude: null ,
      RouteId: null,
      Route: null,
      BusId: null,
      ConnectionId: "connection123",
    };
    await hubConnection.invoke("SendMessageToB", coordenadasObj).then()
    await hubConnection.stop();
    console.log("Conexión finalizada desde la Aplicación B");
  }
};