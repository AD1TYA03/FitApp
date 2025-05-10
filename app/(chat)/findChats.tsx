import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { serverURI } from "@/utils/serverAddress";
import { router } from "expo-router";

interface IUser {
    _id: string;
    name: string;
    email: string;
    userid: string;
}

const FriendSearchScreen = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const userStr = await AsyncStorage.getItem("user");
            const storeduser = userStr ? JSON.parse(userStr) : null;
            if (storeduser && storeduser.userid) setUser(storeduser);
        };
        fetchUser();
    }, []);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        try {
            const res = await fetch(`${serverURI}:8001/find/search?query=${query}`);
            const data = await res.json();
            setResults(data.users || []);
        } catch (error) {
            console.error("Search failed:", error);
            Alert.alert("Error", "Failed to search users");
        } finally {
            setLoading(false);
        }
    };

    const handleAddFriend = async (friend: IUser) => {
        try {
            const res = await fetch(`${serverURI}:8001/saveChat/private`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user1: user, user2: friend }),
            });
            const data = await res.json();
            console.log("Add friend response:", data, res.ok);
            if (res.ok) {
                Alert.alert("Success", "Friend added to chat list!");
                router.push(`/(tabs)/chat`)
            } else {
                throw new Error(data.message || "Failed to add friend");
            }
        } catch (error) {
            console.error("Add friend failed:", error);
            Alert.alert("Error", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Find Friends</Text>
            <TextInput
                placeholder="Search by name or email..."
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={handleSearch}
                style={styles.input}
            />
            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.resultItem}>
                            <View>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.email}>{item.email}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => handleAddFriend(item)}
                            >
                                <Text style={styles.addButtonText}>Add</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

export default FriendSearchScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 16,
    },
    resultItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
    },
    email: {
        fontSize: 14,
        color: "#666",
    },
    addButton: {
        backgroundColor: "#4A90E2",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    addButtonText: {
        color: "#fff",
        fontWeight: "600",
    },
});
