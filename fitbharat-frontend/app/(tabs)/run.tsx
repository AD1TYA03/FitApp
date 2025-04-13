import GoogleMaps from "@/components/ui/googleMaps";
import { Colors } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export interface IPointLocation {
  active?: boolean;
  latitude: number;
  longitude: number;
}

export default function Path() {
  const [routeCoords, setRouteCoords] = useState<IPointLocation[]>([]);
  const [location, setLocation] = useState<IPointLocation>({ latitude: 0, longitude: 0 });
  const [startLocation, setStartLocation] = useState<IPointLocation>({ active: false, latitude: 0, longitude: 0 });
  const [endLocation, setEndLocation] = useState<IPointLocation>({ active: false, latitude: 0.1, longitude: 0.1 });

  const fetchRoute = async () => {
    const osrmUrl = `https://router.project-osrm.org/route/v1/walking/${startLocation.longitude},${startLocation.latitude};${endLocation.longitude},${endLocation.latitude}?overview=full&geometries=geojson`;
    try {
      const res = await fetch(osrmUrl);
      const data = await res.json();
      if (data.code !== "Ok") throw new Error(data.message);

      const coords = data.routes[0].geometry.coordinates.map(
        ([lng, lat]: [number, number]) => ({ latitude: lat, longitude: lng })
      );
      setRouteCoords(coords);
    } catch (err) {
      console.error("Fetch route error:", err);
      Alert.alert("Error", "Could not fetch route.");
    }
  };

  const saveRoute = async () => {
    if (!startLocation.active || !endLocation.active || routeCoords.length === 0) {
      Alert.alert("Missing Info", "Please set start/end points and fetch route first.");
      return;
    }
    

    try {
      const res = await fetch("http://192.168.29.119:8002/api/paths/save-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startLocation,
          endLocation,
          route: routeCoords,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      Alert.alert("Success", "Route saved!");
    } catch (err) {
      console.error("Save error:", err);
      Alert.alert("Error", "Failed to save route.");
    }
  };

  return (
    <View style={styles.container}>
      <GoogleMaps
        location={location}
        setLocation={setLocation}
        setStartLocation={setStartLocation}
        setEndLocation={setEndLocation}
        startLocation={startLocation}
        endLocation={endLocation}
        routeCoords={routeCoords}
      />
      <SafeAreaView style={styles.overlay}>
        <View style={styles.controls}>
          {[["Start", "blue", setStartLocation], ["End", "red", setEndLocation]].map(([label, color, setter], idx) => (
            <View style={styles.inputGroup} key={idx}>
              <TextInput
                placeholder={`${label} Point`}
                placeholderTextColor="#aaa"
                style={styles.input}
                value={
                  (idx === 0 ? startLocation : endLocation).active
                    ? `${(idx === 0 ? startLocation : endLocation).latitude.toFixed(5)}, ${(idx === 0 ? startLocation : endLocation).longitude.toFixed(5)}`
                    : ""
                }
              />
              <MaterialIcons
                name="add-location-alt"
                size={24}
                color={color as string}
                onPress={() =>
                  setter({
                    active: true,
                    latitude: location.latitude + idx * 0.001,
                    longitude: location.longitude + idx * 0.001,
                  })
                }
              />
            </View>
          ))}

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.button} onPress={fetchRoute}>
              <MaterialIcons name="alt-route" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={saveRoute}>
              <MaterialIcons name="save-alt" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    position: "absolute",
    width: "100%",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  controls: {
    flexDirection: "column",
    backgroundColor: "#1e1e1eaa",
    padding: 10,
    borderRadius: 10,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "#333",
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingVertical: 5,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#666",
    padding: 10,
    borderRadius: 50,
  },
});


// // run.tsx
// import React, { useState, useEffect } from 'react';
// import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { MaterialIcons } from '@expo/vector-icons';
// import GoogleMaps from '@/components/ui/googleMaps'; // Adjust the import path as needed
// import { Colors } from '@/constants/Colors'; // Adjust the import path as needed
// import * as Location from 'expo-location';

// export interface IPointLocation {
//   latitude: number;
//   longitude: number;
// }

// export default function Run() {
//   const [currentLocation, setCurrentLocation] = useState<IPointLocation | null>(null);
//   const [isRunning, setIsRunning] = useState(false);
//   const [pathCoordinates, setPathCoordinates] = useState<IPointLocation[]>([]);
//   const [startTime, setStartTime] = useState<Date | null>(null);
//   const [elapsedTime, setElapsedTime] = useState(0);
//   const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission denied', 'Please enable location services for this app.');
//         return;
//       }

//       let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
//       setCurrentLocation({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//       });
//     })();
//   }, []);

//   useEffect(() => {
//     if (isRunning) {
//       setStartTime(new Date());
//       const interval = setInterval(async () => {
//         try {
//           let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
//           const newCoordinate: IPointLocation = {
//             latitude: location.coords.latitude,
//             longitude: location.coords.longitude,
//           };
//           setPathCoordinates((prevCoords) => [...prevCoords, newCoordinate]);
//           setElapsedTime((prevTime) => prevTime + 1); // Increment every second
//         } catch (error: any) {
//           console.error("Error getting location during run:", error);
//           Alert.alert("Location Error", "Could not retrieve current location. Stopping run.");
//           setIsRunning(false);
//         }
//       }, 1000);
//       setIntervalId(interval);
//     } else if (intervalId) {
//       clearInterval(intervalId);
//       setIntervalId(null);
//     }

//     return () => {
//       if (intervalId) {
//         clearInterval(intervalId);
//       }
//     };
//   }, [isRunning]);

//   const formatTime = (totalSeconds: number): string => {
//     const minutes = Math.floor(totalSeconds / 60);
//     const seconds = totalSeconds % 60;
//     const formattedMinutes = String(minutes).padStart(2, '0');
//     const formattedSeconds = String(seconds).padStart(2, '0');
//     return `${formattedMinutes}:${formattedSeconds}`;
//   };

//   const toggleRun = () => {
//     setIsRunning((prev) => !prev);
//     if (!isRunning) {
//       setPathCoordinates([]); // Clear previous path on starting a new run
//       setElapsedTime(0);
//     }
//   };

//   const saveRun = async () => {
//     if (pathCoordinates.length > 1 && startTime) {
//       try {
//         const endTime = new Date();
//         const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

//         const res = await fetch("http://192.168.249.86:8001/api/runs/save-run", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             startTime: startTime.toISOString(),
//             endTime: endTime.toISOString(),
//             duration: duration,
//             path: pathCoordinates,
//           }),
//         });

//         const data = await res.json();
//         if (!res.ok) throw new Error(data.error || "Save failed");
//         Alert.alert("Success", "Run saved!");
//         setPathCoordinates([]);
//         setElapsedTime(0);
//         setStartTime(null);
//       } catch (err) {
//         console.error("Save run error:", err);
//         Alert.alert("Error", "Failed to save run.");
//       }
//     } else {
//       Alert.alert("Info", "No run data to save.");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {currentLocation && (
//         <GoogleMaps
//           initialRegion={{
//             latitude: currentLocation.latitude,
//             longitude: currentLocation.longitude,
//             latitudeDelta: 0.02,
//             longitudeDelta: 0.02,
//           }}
//           currentLocation={currentLocation}
//           pathCoordinates={pathCoordinates}
//         />
//       )}

//       <SafeAreaView style={styles.overlay}>
//         <View style={styles.controls}>
//           <View style={styles.infoContainer}>
//             <Text style={styles.infoText}>Status: {isRunning ? 'Running' : 'Stopped'}</Text>
//             <Text style={styles.infoText}>Time: {formatTime(elapsedTime)}</Text>
//             <Text style={styles.infoText}>Coordinates: {currentLocation ? `${currentLocation.latitude.toFixed(5)}, ${currentLocation.longitude.toFixed(5)}` : 'Fetching...'}</Text>
//           </View>

//           <TouchableOpacity style={[styles.runButton, { backgroundColor: isRunning ? 'red' : 'green' }]} onPress={toggleRun}>
//             <Text style={styles.runButtonText}>{isRunning ? 'Stop' : 'Start'} Run</Text>
//           </TouchableOpacity>

//           {pathCoordinates.length > 1 && !isRunning && startTime && (
//             <TouchableOpacity style={styles.saveButton} onPress={saveRun}>
//               <MaterialIcons name="save-alt" size={24} color="#fff" />
//               <Text style={styles.saveButtonText}>Save Run</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </SafeAreaView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   overlay: {
//     position: 'absolute',
//     bottom: 20,
//     left: 20,
//     right: 20,
//   },
//   controls: {
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     borderRadius: 10,
//     padding: 15,
//   },
//   infoContainer: {
//     marginBottom: 15,
//   },
//   infoText: {
//     color: '#fff',
//     fontSize: 16,
//     marginBottom: 5,
//   },
//   runButton: {
//     backgroundColor: 'green',
//     paddingVertical: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   runButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   saveButton: {
//     backgroundColor: '#3f51b5',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 10,
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   saveButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginLeft: 8,
//   },
// });