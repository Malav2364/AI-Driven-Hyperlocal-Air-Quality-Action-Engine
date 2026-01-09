import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';

const { width } = Dimensions.get('window');

const FILTER_CHIPS = [
  { id: 'pm25', label: 'PM2.5' },
  { id: 'no2', label: 'NO₂' },
  { id: 'traffic', label: 'Traffic' },
  { id: 'sensors', label: 'Sensors' },
];

export default function MapScreen() {
  const [activeFilter, setActiveFilter] = useState('pm25');
  const mapRef = useRef<MapView>(null);
  
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      };
      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 1000);
    })();
  }, []);

  const handleZoomIn = () => {
    const newRegion = {
      ...region,
      latitudeDelta: region.latitudeDelta / 2,
      longitudeDelta: region.longitudeDelta / 2,
    };
    setRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 300);
  };

  const handleZoomOut = () => {
    const newRegion = {
      ...region,
      latitudeDelta: region.latitudeDelta * 2,
      longitudeDelta: region.longitudeDelta * 2,
    };
    setRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 300);
  };

  const handleLocateMe = async () => {
    let location = await Location.getCurrentPositionAsync({});
    const newRegion = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    };
    setRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 1000);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
          <View style={styles.headerTitles}>
            <Text style={styles.appName}>Envirosense</Text>
            <View style={styles.locationContainer}>
              <Text style={styles.locationText}>Map Overview</Text>
              <Ionicons name="chevron-down" size={12} color="#374151" />
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications" size={24} color="#1F2937" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView 
          ref={mapRef}
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
          customMapStyle={[
            {
              "featureType": "all",
              "elementType": "geometry",
              "stylers": [{ "color": "#F3F4F6" }] // Light gray base
            },
            {
              "featureType": "road",
              "elementType": "geometry",
              "stylers": [{ "color": "#ffffff" }] // White roads
            }
          ]}
        >
          {/* Intervention Zone Circle Overview (Dashed simulated by transparent stroke + component?) 
              Native maps don't support dashed circles easily. 
              We'll use a semi-transparent fill for the zone.
          */}
          <Circle 
            center={region}
            radius={400}
            strokeColor="rgba(239, 68, 68, 0.6)" // Red stroke
            strokeWidth={2}
            fillColor="rgba(239, 68, 68, 0.05)" // Very light red fill
            lineDashPattern={[5, 5]} // Works on iOS
          />

          {/* Markers */}


          <Marker coordinate={{ latitude: 37.784, longitude: -122.435 }}>
            <View style={[styles.markerCircle, { backgroundColor: '#EAB308' }]}>
              <Text style={styles.markerText}>85</Text>
            </View>
          </Marker>

          <Marker coordinate={{ latitude: 37.791, longitude: -122.428 }}>
            <View style={[styles.markerCircle, { backgroundColor: '#22C55E' }]}>
              <Text style={styles.markerText}>42</Text>
            </View>
          </Marker>

        </MapView>

        {/* Floating Filters */}
        <View style={styles.filterScrollContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContent}
          >
            {FILTER_CHIPS.map((chip) => {
              const isActive = activeFilter === chip.id;
              return (
                <TouchableOpacity 
                  key={chip.id} 
                  style={[styles.filterChip, isActive && styles.filterChipActive]}
                  onPress={() => setActiveFilter(chip.id)}
                >
                  <View style={styles.chipContent}>
                    {isActive && <Ionicons name="layers" size={14} color="white" style={{ marginRight: 4 }} />}
                    <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                      {chip.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Map Controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity style={styles.controlButton} onPress={handleLocateMe}>
            <Ionicons name="locate" size={20} color="#374151" />
          </TouchableOpacity>
          <View style={styles.zoomControls}>
            <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
              <Ionicons name="add" size={24} color="#374151" />
            </TouchableOpacity>
            <View style={styles.zoomDivider} />
            <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
              <Ionicons name="remove" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Detail Card */}
        <View style={styles.detailCard}>
          <View style={styles.dragHandle} />
          
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Sector 4 Industrial Zone</Text>
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, { backgroundColor: '#22C55E' }]} />
                <Text style={styles.statusText}>Live Data • Updated 1m ago</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.chevronButton}>
              <Ionicons name="chevron-forward" size={20} color="#374151" />
            </TouchableOpacity>
          </View>

          <View style={styles.cardContent}>
            
            {/* AQI Box */}
            <View style={styles.aqiBox}>
              <Ionicons name="medical" size={20} color="#EA580C" style={{ marginBottom: 4 }} />
              <Text style={styles.cardAqiValue}>154</Text>
              <Text style={styles.cardAqiLabel}>AQI</Text>
            </View>

            {/* Pollutant Info */}
            <View style={{ flex: 1, marginLeft: 16 }}>
              <View style={styles.pollutantInfoRow}>
                <Text style={styles.pollutantInfoLabel}>Primary Pollutant: PM2.5</Text>
                <Text style={[styles.pollutantInfoLabel, { color: '#F97316', fontWeight: 'bold' }]}>High</Text>
              </View>
              
              {/* Progress Bar */}
              <View style={styles.pollutantBarBg}>
                <View style={[styles.pollutantBarFill, { width: '75%', backgroundColor: '#F97316' }]} />
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtonsRow}>
                <TouchableOpacity style={styles.actionPill}>
                  <Text style={styles.actionPillText}>Traffic Restriction</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionPill}>
                  <Text style={styles.actionPillText}>Dust Control</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

      </View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 10,
    backgroundColor: 'white',
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    marginRight: 12,
  },
  headerTitles: {
    justifyContent: 'center',
  },
  appName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginRight: 4,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: 'white',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  filterScrollContainer: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  filterChipActive: {
    backgroundColor: '#264E58', // Dark teal
  },
  chipContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 13,
  },
  filterTextActive: {
    color: 'white',
  },
  markerCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  markerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  markerArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#F97316',
    alignSelf: 'center',
    marginTop: -2,
  },
  mapControls: {
    position: 'absolute',
    right: 20,
    top: 80,
    gap: 12,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  zoomControls: {
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    paddingVertical: 4,
  },
  zoomButton: {
    width: 44,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomDivider: {
    width: 24,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  detailCard: {
    position: 'absolute',
    bottom: 24, // above bottom nav which is separate in this layout structure? No, mapContainer takes flex 1. bottom nav is outside. 
    // Actually, detailCard should be floating over the map, just above the bottom nav area if visual.
    // Wait, the design suggests the bottom sheet IS the bottom. But we have a bottom nav.
    // In design, the bottom nav is usually fixed at screen bottom.
    // So the card is above it.
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 0, // margin handled by container?
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  chevronButton: {
    padding: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  cardContent: {
    flexDirection: 'row',
  },
  aqiBox: {
    width: 72,
    height: 84,
    backgroundColor: '#FFF7ED', // Light orange
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  cardAqiValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EA580C',
  },
  cardAqiLabel: {
    fontSize: 10,
    color: '#EA580C',
    fontWeight: '600',
    marginTop: 2,
  },
  pollutantInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pollutantInfoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  pollutantBarBg: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    marginBottom: 12,
    overflow: 'hidden',
  },
  pollutantBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionPill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#264E58',
  },

});
