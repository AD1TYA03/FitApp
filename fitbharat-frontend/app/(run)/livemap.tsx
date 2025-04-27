import { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Text } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { io, Socket } from "socket.io-client";
import { useLocalSearchParams } from "expo-router";

interface IUserLocation {
    userId: string;
    latitude: number;
    longitude: number;
}

export default function LiveMap({ route }: any) {
    const { roomCode } = useLocalSearchParams();
    const [pathPoints, setPathPoints] = useState<{ latitude: number; longitude: number }[]>([]);
    const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
    const [users, setUsers] = useState<IUserLocation[]>([]);
    const mapRef = useRef<MapView>(null);
    const socketRef = useRef<Socket | null>(null);


    useEffect(() => {
        const fetchPath = async () => {
            try {
                const response = await fetch(`http://192.168.28.25:8003/path/${roomCode}`);
                const data = await response.json();
                if (data.path) {
                    const coordinates = data.path.route.coordinates.map(([lng, lat]: [number, number]) => ({
                        latitude: lat,
                        longitude: lng,
                    }));
                    setPathPoints(coordinates);
                } else {
                    console.error("No path found for the given room code.");
                }
            } catch (error) {
                console.error("Error fetching path:", error);
            }
        };
        fetchPath();
    }, [roomCode]);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission to access location was denied');
                return;
            }

            let loc = await Location.getCurrentPositionAsync({});
            setLocation(loc.coords);

            // Create socket connection only once
            socketRef.current = io("http://192.168.28.25:8003", {
                transports: ["websocket"], // Important to avoid polling multiple times
            });

            socketRef.current.on("connect", () => {
                console.log("Socket connected:", socketRef.current?.id);
                socketRef.current?.emit("join-room", { roomCode, userId });
            });

            socketRef.current.on("room-users", (users: IUserLocation[]) => {
                setUsers(users);
            });
        })();

        return () => {
            socketRef.current?.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!location || !socketRef.current) return;

        const locationInterval = setInterval(async () => {
            let loc = await Location.getCurrentPositionAsync({});
            setLocation(loc.coords);

            socketRef.current?.emit("update-location", {
                roomCode,
                userId,
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
            });
        }, 5000); // update every 5 seconds

        return () => clearInterval(locationInterval);
    }, [location]);

    return (
        <View style={styles.container}>
            {location && (
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                    showsUserLocation
                >
                    {users.map((user) => (
                        <Marker
                            key={user.userId}
                            coordinate={{
                                latitude: user.latitude,
                                longitude: user.longitude,
                            }}
                            anchor={{ x: 0.5, y: 1 }} // Important: makes the pointy part touch the location
                        >
                            {pathPoints.length > 0 && (
                                <Polyline
                                    coordinates={pathPoints}
                                    strokeColor="#4A90E2"
                                    strokeWidth={4}
                                    lineDashPattern={[10, 3]}
                                />
                            )}
                            <View style={styles.markerContainer}>
                                <View
                                    style={[
                                        styles.markerPin,
                                        {
                                            backgroundColor: user.userId === userId ? "#4A90E2" : "#FF5A5F",
                                            borderColor: user.userId === userId ? "#003f91" : "#B22222",
                                        },
                                    ]}
                                >
                                    <Text style={styles.markerText}>
                                        {user.userId.slice(0, 5).toUpperCase()}
                                    </Text>
                                </View>
                                <View style={styles.markerPointer} />
                            </View>
                        </Marker>
                    ))}


                </MapView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    markerView: {
        backgroundColor: "white",
        padding: 3,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "black",
    },
    markerContainer: {
        alignItems: "center",
    },
    markerPin: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#4A90E2",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    markerText: {
        color: "white",
        fontSize: 10,
    },
    markerPointer: {
        width: 0,
        height: 0,
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderTopWidth: 10,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: "#4A90E2", // Same as pin color
        marginTop: -1,
    },

});
