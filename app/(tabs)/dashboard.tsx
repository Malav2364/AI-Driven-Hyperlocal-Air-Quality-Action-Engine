import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { api } from '../services/api';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const [locationName, setLocationName] = useState<string>('Detecting Location...');
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [userName, setUserName] = useState('Citizen');
  const [greeting, setGreeting] = useState('Hello');

  useEffect(() => {
    // Determine Greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Fetch User Data
    const fetchUser = async () => {
      try {
        const user = await api.getMe();
        if (user && user.name) {
          setUserName(user.name);
        }
      } catch (error) {
        console.log('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationName('Permission Denied');
          setLoadingLocation(false);
          Alert.alert('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        
        try {
          let geocode = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          });

          if (geocode && geocode.length > 0) {
            const address = geocode[0];
            const name = address.city || address.district || address.region || 'Unknown Location';
            const subName = address.name || address.street || '';
            setLocationName(subName ? `${subName}, ${name}` : name);
          } else {
            setLocationName('Location Found');
          }
        } catch (geoError) {
          console.log('Geocoding error:', geoError);
          // Fallback if geocoding fails (e.g., service unavailable or network issue)
          setLocationName('My Location');
        }
      } catch (error) {
        console.log('Location error:', error);
        setLocationName('Location Unavailable');
      } finally {
        setLoadingLocation(false);
      }
    })();
  }, []);

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
            <Text style={styles.appName}>{greeting}, {userName.split(' ')[0]}</Text>
            <View style={styles.locationContainer}>
              {loadingLocation ? (
                <ActivityIndicator size="small" color="#6B7280" />
              ) : (
                <>
                  <Text style={styles.locationText} numberOfLines={1}>
                    {locationName}
                  </Text>
                  <Ionicons name="chevron-down" size={10} color="#374151" />
                </>
              )}
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications" size={24} color="#1F2937" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Main AQI Card */}
        <LinearGradient
          colors={['#FF9900', '#FF5500']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.aqiCard}
        >
          <View style={styles.aqiHeader}>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Live Monitoring</Text>
            </View>
            <View style={styles.maskIconContainer}>
              <Ionicons name="medical" size={20} color="white" />
            </View>
          </View>

          <View style={styles.aqiMain}>
            <Text style={styles.aqiValue}>154</Text>
            <Text style={styles.aqiStatus}>Unhealthy</Text>
          </View>

          <View style={styles.aqiDivider} />

          <View style={styles.aqiFooter}>
            <View>
              <Text style={styles.aqiFooterLabel}>Primary Pollutant</Text>
              <Text style={styles.aqiFooterValue}>PM2.5</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.aqiFooterLabel}>Forecast (2h)</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.aqiFooterValue}>162</Text>
                <Ionicons name="trending-up" size={16} color="white" style={{ marginLeft: 4 }} />
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Pollutant Breakdown */}
        <Text style={styles.sectionTitle}>Pollutant Breakdown</Text>
        <View style={styles.pollutantRow}>
          <View style={styles.pollutantCard}>
            <Text style={styles.pollutantName}>PM2.5</Text>
            <Text style={styles.pollutantValue}>65</Text>
            <Text style={styles.pollutantUnit}>µg/m³</Text>
          </View>
          <View style={styles.pollutantCard}>
            <Text style={styles.pollutantName}>NO₂</Text>
            <Text style={styles.pollutantValue}>42</Text>
            <Text style={styles.pollutantUnit}>ppb</Text>
          </View>
          <View style={styles.pollutantCard}>
            <Text style={styles.pollutantName}>O₃</Text>
            <Text style={styles.pollutantValue}>55</Text>
            <Text style={styles.pollutantUnit}>ppb</Text>
          </View>
        </View>

        {/* Source Attribution */}
        <View style={styles.sourceCard}>
          <View style={styles.sourceHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="bar-chart" size={20} color="#2B5F6C" />
              <Text style={styles.sourceTitle}>Source Attribution</Text>
            </View>
            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>AI Analysis</Text>
            </View>
          </View>

          <View style={styles.sourceItem}>
            <View style={styles.sourceLabelRow}>
              <Text style={styles.sourceLabel}>Vehicular Emissions</Text>
              <Text style={styles.sourceValue}>45%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '45%', backgroundColor: '#2B5F6C' }]} />
            </View>
          </View>

          <View style={styles.sourceItem}>
            <View style={styles.sourceLabelRow}>
              <Text style={styles.sourceLabel}>Industrial Zone A</Text>
              <Text style={styles.sourceValue}>30%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '30%', backgroundColor: '#84CC16' }]} />
            </View>
          </View>

          <View style={styles.sourceItem}>
            <View style={styles.sourceLabelRow}>
              <Text style={styles.sourceLabel}>Construction Dust</Text>
              <Text style={styles.sourceValue}>15%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '15%', backgroundColor: '#64748B' }]} />
            </View>
          </View>
        </View>

        {/* Actionable Intelligence */}
        <Text style={styles.sectionTitle}>Actionable Intelligence</Text>
        <View style={styles.actionCard}>
          <View style={[styles.actionIconContainer, { backgroundColor: '#FEF2F2' }]}>
             <Ionicons name="warning" size={24} color="#EF4444" />
          </View>
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={styles.actionTitle}>Restrict Heavy Traffic</Text>
            <Text style={styles.actionDesc}>Recommended for Sector 4 due to peak NOx.</Text>
          </View>
        </View>

      </ScrollView>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 10,
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
    fontSize: 10,
    fontWeight: '200',
    color: '#111827',
    marginRight: 4,
    maxWidth: 200,
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
    borderColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  aqiCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#FF5500',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  aqiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
    marginRight: 6,
  },
  liveText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  maskIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aqiMain: {
    marginTop: 24,
    marginBottom: 24,
  },
  aqiValue: {
    fontSize: 64,
    fontWeight: 'bold',
    color: 'white',
    lineHeight: 70,
  },
  aqiStatus: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  aqiDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 16,
  },
  aqiFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  aqiFooterLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginBottom: 4,
  },
  aqiFooterValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  pollutantRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 12,
  },
  pollutantCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  pollutantName: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  pollutantValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  pollutantUnit: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  sourceCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sourceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  aiBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  aiBadgeText: {
    color: '#0284C7',
    fontSize: 10,
    fontWeight: 'bold',
  },
  sourceItem: {
    marginBottom: 16,
  },
  sourceLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sourceLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  sourceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2B5F6C',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  actionCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  actionDesc: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },

});
