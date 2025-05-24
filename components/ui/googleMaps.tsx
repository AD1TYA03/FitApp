import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_DEFAULT, PROVIDER_GOOGLE, Region } from "react-native-maps";
import * as Location from "expo-location";
import { router } from "expo-router";
import { serverURI } from "@/utils/serverAddress";

interface ICoord {
    latitude: number;
    longitude: number;
}

interface IPath {
    route: {
        coordinates: [number, number][];
    };
    _id: string;
    pathName: string;
    description: string;
    createdAt: string;
    endLocation: ICoord;
    startLocation: ICoord;
    type: string;

}

interface Props {
    location: ICoord;
    setLocation: (loc: ICoord) => void;
    startLocation: any;
    endLocation: any;
    setStartLocation: (loc: any) => void;
    setEndLocation: (loc: any) => void;
    routeCoords: ICoord[];
}

const GoogleMaps = ({
    location,
    setLocation,
    startLocation,
    endLocation,
    setStartLocation,
    setEndLocation,
    routeCoords,
}: Props) => {
    const [nearbyPaths, setNearbyPaths] = useState<IPath[]>([]);
    const [loading, setLoading] = useState(true);



    const fetchNearbyPaths = useCallback(async (latitude: number, longitude: number) => {
        try {
            const res = await fetch(`${serverURI}:8002/api/paths/nearby-paths?latitude=${latitude}&longitude=${longitude}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to fetch paths.");
            setNearbyPaths(data.paths);
        } catch (err) {
            console.error("Error fetching paths:", err);
            Alert.alert("Error", "Unable to fetch nearby paths.");
        }
    }, []);

    useEffect(() => {
        const initLocation = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permission Denied", "Location permission is required.");
                return;
            }

            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
            setLocation(coords);
            fetchNearbyPaths(coords.latitude, coords.longitude);
            setLoading(false);
        };

        initLocation();
    }, []);

    const handleDragEnd = (type: "start" | "end", coordinate: ICoord) => {
        if (type === "start") {
            setStartLocation({ ...coordinate, active: true });
        } else {
            setEndLocation({ ...coordinate, active: true });
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" style={{ flex: 1 }} />;
    }

    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_DEFAULT}
                style={styles.map}
                showsUserLocation
                followsUserLocation
                initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >

                {startLocation.active && (
                    <Marker
                        coordinate={startLocation}
                        draggable
                        onDragEnd={(e) => handleDragEnd("start", e.nativeEvent.coordinate)}
                        title="Start"
                        pinColor="green"
                    />
                )}
                {endLocation.active && (
                    <Marker
                        coordinate={endLocation}
                        draggable
                        onDragEnd={(e) => handleDragEnd("end", e.nativeEvent.coordinate)}
                        title="End"
                        pinColor="red"
                    />
                )}
                {routeCoords.length > 0 && (
                    <Polyline coordinates={routeCoords} strokeWidth={4} strokeColor="blue" />
                )}
                {nearbyPaths.map((path, index) => (
                    <Polyline
                        tappable
                        onPress={() => router.push(`/(run)/PathDetails?route=${JSON.stringify(path.route)}&pathName=${path.pathName}&description=${path.description}&id=${path._id}`)}
                        key={index}
                        coordinates={path.route.coordinates.map(([lng, lat]) => ({ latitude: lat, longitude: lng }))}
                        strokeWidth={5}
                        strokeColor={'#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}
                    />
                ))}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { width: "100%", height: "100%" },
});

export default GoogleMaps;
