import * as Location from "expo-location";

const LOCATION_TASK_NAME = "background-location-task";

export const startLocation = async () => {
  const { status } = await Location.requestBackgroundPermissionsAsync();
  console.log("Location permission status:", status);

  if (status === "granted") {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.High,
      timeInterval: 500,
      distanceInterval: 0,
    });
    console.log("Location updates started.");
  }
};

export const stopLocation = async () => {

  if(Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME)){
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    console.log("Location updates stopped.");
  }
  else{
    console.log("Location updates not started.");
  }
};
