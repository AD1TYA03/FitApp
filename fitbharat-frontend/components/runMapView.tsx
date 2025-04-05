// components/runMapView.tsx

import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';

interface RunMapViewProps {
  polylines: { id: string; coordinates: { latitude: number; longitude: number }[] }[];
  onPolylinePress: (polylineId: string) => void;
  liveLocations: { userId: string; location: { latitude: number; longitude: number } }[];
  userLocation: { latitude: number; longitude: number } | null;
  onPolylineCreated: (points: { lat: number; lng: number }[]) => void;
}

const RunMapView: React.FC<RunMapViewProps> = ({
  polylines,
  onPolylinePress,
  liveLocations,
  userLocation,
  onPolylineCreated,
}) => {
  const webViewRef = useRef<WebView>(null);
  const [selectedPoints, setSelectedPoints] = useState<{ lat: number; lng: number }[]>([]);
  const [loadingRoute, setLoadingRoute] = useState(false);

  useEffect(() => {
    if (webViewRef.current) {
      webViewRef.current.postMessage(
        JSON.stringify({
          type: 'mapData',
          polylines,
          liveLocations,
          userLocation,
        })
      );
    }
  }, [polylines, liveLocations, userLocation]);

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'polylinePress' && onPolylinePress) {
        onPolylinePress(data.polylineId);
      } else if (data.type === 'selectPoint') {
        setSelectedPoints((prevPoints) => {
          const newPoints = [...prevPoints, data.latlng];
          if (newPoints.length >= 2) {
            fetchRoute(newPoints);
          }
          return newPoints;
        });
      } else if (data.type === 'polylineCreated' && onPolylineCreated) {
        onPolylineCreated(data.points);
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  const fetchRoute = async (points) => {
    setLoadingRoute(true);
    const coordinates = points.map(({ lng, lat }) => `${lng},${lat}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/foot/${coordinates}?overview=full&geometries=geojson`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0].geometry.coordinates;
        webViewRef.current?.postMessage(
          JSON.stringify({ type: 'addRoute', route, markers: points })
        );
      } else {
        webViewRef.current?.postMessage(JSON.stringify({ type: 'routeError', message: 'Route not found' }));
      }
    } catch (error) {
      webViewRef.current?.postMessage(JSON.stringify({ type: 'routeError', message: 'Error fetching route' }));
    } finally {
      setLoadingRoute(false);
    }
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Run Map</title>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.js"></script>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css"/>
      <style>
        body, html, #map {
          height: 100%;
          margin: 0;
        }
        #map {
          width: 100%;
          height: 100%;
          z-index: 1;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        let map;
        let markers = [];
        let selectedPoints = [];
        
        document.addEventListener("DOMContentLoaded", function() {
          initializeMap();
        });

        function initializeMap() {
          if (!map) {
            map = L.map('map').setView([0, 0], 13);

            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
              attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
            }).addTo(map);

            map.on('click', function(e) {
              if (selectedPoints.length < 5) {
                const marker = L.marker(e.latlng, { draggable: true }).addTo(map);
                marker.bindPopup(\`Point \${selectedPoints.length + 1}\`).openPopup();
                marker.on('dragend', function() {
                  updateMarkerPosition(marker, e.latlng);
                });
                markers.push(marker);
                selectedPoints.push(e.latlng);
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'selectPoint', latlng: e.latlng }));
              }
            });

            map.on('draw:created', function (e) {
              const layer = e.layer;
              const points = layer.getLatLngs().map(latlng => ({ lat: latlng.lat, lng: latlng.lng }));
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'polylineCreated', points }));
            });

            const drawnItems = new L.FeatureGroup();
            map.addLayer(drawnItems);
            const drawControl = new L.Control.Draw({
              draw: {
                polygon: false,
                circle: false,
                circlemarker: false,
                rectangle: false,
                marker: false,
                polyline: true,
              },
              edit: {
                featureGroup: drawnItems,
              }
            });
            map.addControl(drawControl);
          }
        }

        function updateMarkerPosition(marker, latlng) {
          const index = markers.indexOf(marker);
          if (index !== -1) {
            selectedPoints[index] = latlng;
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'selectPoint', latlng }));
          }
        }

        window.addEventListener('message', (event) => {
          const data = JSON.parse(event.data);
          if (data.type === 'mapData') {
            renderMap(data.polylines, data.liveLocations, data.userLocation);
          } else if (data.type === 'addRoute') {
            addRouteToMap(data.route, data.markers);
          } else if(data.type === "routeError"){
            alert(data.message);
          }
        });

        function renderMap(polylines, liveLocations, userLocation) {
          map.eachLayer((layer) => {
            if (layer instanceof L.Polyline || layer instanceof L.Marker) {
              map.removeLayer(layer);
            }
          });

          markers = [];
          selectedPoints = [];

          if (userLocation) {
            L.marker([userLocation.latitude, userLocation.longitude],{icon: new L.Icon.Default()}).addTo(map).bindPopup("Your Location");
            map.setView([userLocation.latitude, userLocation.longitude], 13);
          } else {
            map.setView([0,0],13);
          }

          polylines.forEach(polyline => {
            const coords = polyline.coordinates.map(coord => [coord.latitude, coord.longitude]);
            L.polyline(coords, { color: 'blue' }).addTo(map).on('click', () => {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'polylinePress', polylineId: polyline.id }));
            });
          });

          liveLocations.forEach(liveLocation => {
              L.marker([liveLocation.location.latitude, liveLocation.location.longitude], {
                  icon: new L.Icon.Default()
              }).addTo(map).bindPopup(\`User: \${liveLocation.userId}\`);
          });
        }

        function addRouteToMap(route, markersData) {
          const polyline = L.polyline(route.map(([lng, lat]) => [lat, lng]), { color: 'green' }).addTo(map);
          markersData.forEach((point, index) => {
            const marker = L.marker([point.lat, point.lng], {
              icon: index === 0 || index === markersData.length - 1 ? new L.Icon({
                iconUrl: index === 0 ? 'start-icon.png' : 'end-icon.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
              }) : undefined,
            }).addTo(map).bindPopup(\`Waypoint \${index + 1}\`);
          });
        }
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      {loadingRoute && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Calculating Route...</Text>
        </View>
      )}
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        style={styles.webView}
        onMessage={handleWebViewMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccessFromFileURLs={true}
        originWhitelist={['*']}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
    width: '100%',
    height: '100%',
    minHeight: 400,
  },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    loadingText: {
        color: 'white',
        marginTop: 10,
    }
});

export default RunMapView;