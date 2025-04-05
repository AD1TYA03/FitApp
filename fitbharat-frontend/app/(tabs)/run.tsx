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
      const res = await fetch("http://192.168.204.25:8001/api/paths/save-path", {
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
