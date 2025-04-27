import { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";

export default function JoinRoom() {
    const [roomCode, setRoomCode] = useState('');
    const router = useRouter();

    const handleJoin = () => {
        if (!roomCode) {
            Alert.alert('Error', 'Please enter both Room Code and Your Name.');
            return;
        }

        // Navigate to LiveMap page and send userName and roomCode
        router.push(`/(run)/livemap?roomCode=${roomCode}`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Join a Room</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter Room Code"
                value={roomCode}
                onChangeText={setRoomCode}
            />

            <TouchableOpacity style={styles.button} onPress={handleJoin}>
                <Text style={styles.buttonText}>Join Room</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f2f2",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 30,
    },
    input: {
        width: "100%",
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    button: {
        backgroundColor: "#4a90e2",
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
        elevation: 5,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});
