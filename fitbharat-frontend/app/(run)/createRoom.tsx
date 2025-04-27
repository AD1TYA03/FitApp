import { useState, useEffect, useLayoutEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from '@react-navigation/native';
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";

export default function CreateRoom() {
    const { route } = useLocalSearchParams();
    console.log(route);

    let coords;
    try {
        coords = typeof route === 'string' ? JSON.parse(route) : null;
        console.log('Parsed coordinates:', coords.coordinates);
    } catch (error) {
        console.error('Error parsing route:', error);
        coords = null; // Handle parsing errors gracefully
    }


    const [roomName, setRoomName] = useState("");
    const [description, setDescription] = useState("");
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Create Room',
        });
    }, [navigation]);


    const handleCreateRoom = async () => {
        if (!roomName.trim() || !description.trim()) {
            Alert.alert("Missing Fields", "Please fill all fields.");
            return;
        }

        const userData = await AsyncStorage.getItem('user');
        if (userData) {
            try {
                const response = await fetch("http://192.168.28.25:8003/room/create-room", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: roomName,
                        description: description,
                        coordinates: coords.coordinates,
                    }),
                });

                // Check if the response is JSON
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();

                    if (data.success) {
                        console.log("Room created successfully:", data.room);
                        router.push(`/(run)/livemap?roomcode=${data.room.roomCode}`);
                    } else {
                        console.log("Failed to create room:", data.error);
                        Alert.alert("Error", data.error || "Failed to create room.");
                    }
                } else {
                    // Handle non-JSON response
                    const text = await response.text();
                    console.error("Unexpected response:", text);
                    Alert.alert("Error", "Unexpected response from the server.");
                }
            } catch (error) {
                console.error("Error creating room:", error);
                Alert.alert("Error", "Failed to create room. Please try again.");
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="people-circle" size={60} color="#4a90e2" />
                <Text style={styles.title}>Create a Room</Text>
                <Text style={styles.subtitle}>Let's Go Together Live 🚀</Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Room Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter room name"
                    placeholderTextColor="#999"
                    value={roomName}
                    onChangeText={setRoomName}
                />

                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="What's this room about?"
                    placeholderTextColor="#999"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                />

                <TouchableOpacity style={styles.button} onPress={handleCreateRoom}>
                    <Ionicons name="rocket-outline" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Create Room</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    header: {
        alignItems: "center",
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        color: "#111",
        fontWeight: "bold",
        marginTop: 10,
    },
    subtitle: {
        fontSize: 16,
        color: "#444",
        marginTop: 5,
    },
    form: {
        marginTop: 10,
    },
    label: {
        color: "#444",
        marginBottom: 5,
        marginTop: 15,
        fontSize: 16,
    },
    input: {
        backgroundColor: "#ccc",
        color: "#222",
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 10,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
    },
    codeBox: {
        backgroundColor: "#aaa",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 5,
    },
    codeText: {
        color: "#111",
        fontSize: 24,
        fontWeight: "bold",
        letterSpacing: 2,
    },
    button: {
        marginTop: 30,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#4a90e2",
        padding: 15,
        borderRadius: 12,
        justifyContent: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 10,
    },
});
