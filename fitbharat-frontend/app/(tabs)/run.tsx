import GoogleMaps from "@/components/ui/googleMaps";
import { serverURI } from "@/utils/serverAddress";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";




export interface IPointLocation {
  active?: boolean;
  latitude: number;
  longitude: number;
}

const reloadPage = () => {
  router.reload();
};

export default function Path() {
  const [routeCoords, setRouteCoords] = useState<IPointLocation[]>([]);
  const [location, setLocation] = useState<IPointLocation>({ latitude: 0, longitude: 0 });
  const [startLocation, setStartLocation] = useState<IPointLocation>({ active: false, latitude: 0, longitude: 0 });
  const [endLocation, setEndLocation] = useState<IPointLocation>({ active: false, latitude: 0.001, longitude: 0.001 });
  const [fetchLoading, setFetchLoading] = useState<boolean>(false);

  // New states for modal
  const [modalVisible, setModalVisible] = useState(false);
  const [pathName, setPathName] = useState("");
  const [description, setDescription] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);




  const fetchRoute = async () => {
    setFetchLoading(true);
    if (!startLocation.active || !endLocation.active) {
      Alert.alert("Set Start and End locations first.");
      setFetchLoading(false);
      return;
    }
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
    setFetchLoading(false);
  };

  const openSaveModal = () => {
    if (!startLocation.active || !endLocation.active || routeCoords.length === 0) {
      Alert.alert("Missing Info", "Please set start/end points and fetch route first.");
      return;
    }
    setModalVisible(true);
  };

  const saveRoute = async () => {
    if (!pathName.trim()) {
      Alert.alert("Validation", "Please enter a path name.");
      return;
    }
    setSaveLoading(true);
    try {
      const res = await fetch(`${serverURI}:8002/api/paths/save-path`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startLocation,
          endLocation,
          route: routeCoords,
          name: pathName,
          description: description,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      Alert.alert("Success", "Route saved!");
      setModalVisible(false);
      setPathName("");
      setDescription("");
    } catch (err) {
      console.error("Save error:", err);
      Alert.alert("Error", "Failed to save route.");
    }
    setSaveLoading(false);
  };

  const adjustLocation = (idx: number) => {
    const offset = idx === 0 ? 0.0 : 0.002;
    return {
      active: true,
      latitude: location.latitude + offset,
      longitude: location.longitude + offset,
    };
  };

  const handleOpenJoinRoom = () => {
    router.push("/(run)/joinRoom");  // 👈 make sure this matches your route path
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
          <View style={styles.inputsRow}>
            {[
              ["Start", "blue", setStartLocation],
              ["End", "red", setEndLocation],
            ].map(([label, color, setter]: [string, string, React.Dispatch<React.SetStateAction<IPointLocation>>], idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.inputButton}
                onPress={() => setter(adjustLocation(idx))}
              >
                <MaterialIcons name="add-location-alt" size={20} color={color as string} />
                <Text style={styles.buttonText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.actionButton} onPress={fetchRoute}>
              {fetchLoading ? <ActivityIndicator size="small" color="#fff" /> : <MaterialIcons name="alt-route" size={20} color="#fff" />}
              <Text style={styles.buttonText}>Route</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={openSaveModal}>
              <MaterialIcons name="save-alt" size={20} color="#fff" />
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Save Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Save Path</Text>

            <TextInput
              placeholder="Path Name"
              placeholderTextColor="#ccc"
              value={pathName}
              onChangeText={setPathName}
              style={styles.input}
            />

            <Text style={styles.label}>Start Location:</Text>
            <Text style={styles.value}>{startLocation.latitude.toFixed(5)}, {startLocation.longitude.toFixed(5)}</Text>

            <Text style={styles.label}>End Location:</Text>
            <Text style={styles.value}>{endLocation.latitude.toFixed(5)}, {endLocation.longitude.toFixed(5)}</Text>

            <TextInput
              placeholder="Description"
              placeholderTextColor="#ccc"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              style={[styles.input, { height: 80 }]}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: "#ccc" }]} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={saveRoute}>
                {saveLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.modalButtonText}>Save</Text>}
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
      <TouchableOpacity style={styles.button} onPress={handleOpenJoinRoom}>
        <Text style={styles.buttonText}>Join a Room</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    position: "absolute",
    top: 5,
    left: 0,
    right: 0,
    paddingHorizontal: 5,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 3,
  },
  controls: {
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 12,
    elevation: 5,
  },
  inputsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  inputButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    padding: 8,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4a90e2",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    marginLeft: 5,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#444",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: "#fff",
    marginBottom: 10,
  },
  label: {
    color: "#aaa",
    marginTop: 10,
    fontSize: 14,
  },
  value: {
    color: "#fff",
    marginBottom: 5,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: "#4a90e2",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
