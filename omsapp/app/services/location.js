import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";

const LOCATION_TASK_NAME = "background-location-task";
TaskManager.defineTask(LOCATION_TASK_NAME, ({ data: { locations }, error }) => {
  if (error) {
    console.log(error.message);
    return;
  }
  console.log(locations);
});
export const startLocation = async () => {
  const { status } = await Location.requestBackgroundPermissionsAsync();
  if (status === "granted") {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.High,
      timeInterval: 500,
      distanceInterval: 10,
    });
  }
};

export const stopLocation = async () => {
  await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  console.log("La tarea de transmisión de información se ha detenido.");
};
