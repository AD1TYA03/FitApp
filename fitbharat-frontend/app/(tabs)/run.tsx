// (tabs)/run.tsx

import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Modal, Text, TouchableOpacity, TextInput, Button ,SafeAreaView } from 'react-native';
import io from 'socket.io-client';
import * as Location from 'expo-location';
import RunMapView from '../../components/runMapView';


const socket = io('http://192.168.29.91:3000'); // Replace with your IP

const RunPage = () => {
  const [polylines, setPolylines] = useState([]);
  const [selectedPolylineId, setSelectedPolylineId] = useState(null);
  const [showPolylineInfo, setShowPolylineInfo] = useState(false);
  const [liveLocations, setLiveLocations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [locationSubscription, setLocationSubscription] = useState(null);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('locationUpdate', (data) => {
      setLiveLocations((prevLocations) => {
        const updatedLocations = prevLocations.filter((loc) => loc.userId !== data.userId);
        return [...updatedLocations, data];
      });
    });

    socket.on('chatMessage', (data) => {
      setChatMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);

      const randomPolylines = generateRandomPolylines(location.coords);
      setPolylines(randomPolylines);
    })();
  }, []);

  const generateRandomPolylines = (center) => {
    const polylines = [];
    for (let i = 0; i < 3; i++) {
      const coordinates = [];
      for (let j = 0; j < 5; j++) {
        coordinates.push({
          latitude: center.latitude + (Math.random() - 0.5) * 0.05,
          longitude: center.longitude + (Math.random() - 0.5) * 0.05,
        });
      }
      polylines.push({ id: `${i}`, coordinates });
    }
    return polylines;
  };

  const handlePolylineCreated = (points) => {
    const newPolyline = {
      id: String(Date.now()),
      coordinates: points.map((point) => ({
        latitude: point.lat,
        longitude: point.lng,
      })),
    };
    setPolylines((prevPolylines) => [...prevPolylines, newPolyline]);
  };

  const onPolylinePress = (polylineId) => {
    setSelectedPolylineId(polylineId);
    setShowPolylineInfo(true);
  };

  const startRunning = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      return;
    }

    setIsTracking(true);
    const subscription = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.BestForNavigation, timeInterval: 5000 },
      (location) => {
        setUserLocation(location.coords);
        sendLocation(location.coords);
      }
    );
    setLocationSubscription(subscription);
  };

  const stopRunning = () => {
    setIsTracking(false);
    if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
    }
  };

  const sendLocation = (location) => {
    if (isTracking) {
      socket.emit('locationUpdate', { polylineId: selectedPolylineId, location, userId: 'user123' });
    }
  };

  const sendMessage = () => {
    if (chatInput) {
      socket.emit('chatMessage', { polylineId: selectedPolylineId, message: chatInput, userId: 'user123' });
      setChatInput('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <RunMapView
        polylines={polylines}
        onPolylinePress={onPolylinePress}
        liveLocations={liveLocations}
        userLocation={userLocation}
        onPolylineCreated={handlePolylineCreated}
      />

      <Modal visible={showPolylineInfo} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <Text>Polyline ID: {selectedPolylineId}</Text>
          {isTracking ? (
            <TouchableOpacity style={styles.stopButton} onPress={stopRunning}>
              <Text>Stop Running</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.startButton} onPress={startRunning}>
              <Text>Start Running</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => setShowPolylineInfo(false)}>
            <Text>Close</Text>
          </TouchableOpacity>
          <View style={styles.chatContainer}>
            {chatMessages.map((message, index) => (
              <Text key={index}>{message.userId}: {message.message}</Text>
            ))}
            <TextInput
              style={styles.chatInput}
              value={chatInput}
              onChangeText={setChatInput}
              placeholder="Type a message..."
            />
            <Button title="Send" onPress={sendMessage} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  startButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  stopButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  chatContainer: {
    width: '100%',
    marginTop: 20,
  },
  chatInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginTop: 10,
  },
  webView: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default RunPage;