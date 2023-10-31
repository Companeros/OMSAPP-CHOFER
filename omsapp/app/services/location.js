import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";

const LOCATION_TASK_NAME = "background-location-task";
let latestLocationsPromise = null;

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data: { locations }, error }) => {
  if (error) {
    console.log(error.message);
    return;
  }
  if (latestLocationsPromise) {
    latestLocationsPromise.resolve(locations);
  }
  latestLocationsPromise = Promise.resolve(locations);
});

export const startLocation = async () => {
  const { status } = await Location.requestBackgroundPermissionsAsync();
  console.log("Location permission status:", status);

  if (status === "granted") {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.High,
      timeInterval: 500,
      distanceInterval: 10,
    });
    console.log("Location updates started.");
  }
};

export const stopLocation = async () => {
  await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  console.log("Location updates stopped.");
};

export const getLatestLocations = () => {
  if (latestLocationsPromise) {
    return latestLocationsPromise;
  }
  return Promise.resolve(null);
};
