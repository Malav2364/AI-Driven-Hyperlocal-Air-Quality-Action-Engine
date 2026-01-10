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
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import MapView, { Circle, Marker, Polygon } from 'react-native-maps';
import { api } from '../services/api';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const [locationName, setLocationName] = useState<string>('Detecting Location...');
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [userRole, setUserRole] = useState<string>('Citizen');
  const [userName, setUserName] = useState('Citizen');
  const [greeting, setGreeting] = useState('Hello');


  const [inletPPM, setInletPPM] = useState('');
  const [outletPPM, setOutletPPM] = useState('');
  const [efficiency, setEfficiency] = useState<number | null>(null);

  const calculateEfficiency = () => {
    const inlet = parseFloat(inletPPM);
    const outlet = parseFloat(outletPPM);
    if (!isNaN(inlet) && !isNaN(outlet) && inlet > 0) {
      const eff = ((1 - (outlet / inlet)) * 100);
      setEfficiency(eff);
      if (eff >= 90) Alert.alert("Efficiency Check", `System is operating at ${eff.toFixed(1)}% efficiency. PASS.`);
      else Alert.alert("Efficiency Warning", `System is only at ${eff.toFixed(1)}%. Maintenance Required.`);
    } else {
        Alert.alert("Invalid Input", "Please enter valid PPM values.");
    }
  };

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
        if (user) {
          if (user.name) setUserName(user.name);
          if (user.role) setUserRole(user.role);
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

  const [acres, setAcres] = useState('');
  const [biomass, setBiomass] = useState('');
  const [earnings, setEarnings] = useState(15000);

  const renderFarmerDashboard = () => (
      <View>
          {/* Fire Risk Advisory */}
          <Text style={styles.sectionTitle}>Fire Risk Advisory</Text>
          <View style={[styles.card, { backgroundColor: '#FEF2F2', borderColor: '#FCA5A5', borderWidth: 1 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Ionicons name="warning" size={24} color="#DC2626" />
                  <Text style={[styles.actionTitle, { marginLeft: 10, color: '#DC2626' }]}>High Risk Alert</Text>
              </View>
              <Text style={styles.actionDesc}>
                  Wind Speed is LOW (Bowl Effect). Do NOT burn stubble today. 
                  <Text style={{fontWeight: 'bold', color: '#DC2626'}}> Fine Risk: HIGH.</Text>
              </Text>
          </View>

          {/* Sell Stubble */}
          <Text style={styles.sectionTitle}>Sell Stubble (Biomass)</Text>
          <View style={styles.card}>
              <View style={{flexDirection: 'row', gap: 16}}>
                  <View style={{flex: 1}}>
                      <Text style={styles.inputLabel}>Acres of Land</Text>
                      <TextInput 
                          style={styles.input} 
                          placeholder="e.g. 5" 
                          keyboardType="numeric"
                          value={acres}
                          onChangeText={setAcres}
                      />
                  </View>
                  <View style={{flex: 1}}>
                       <Text style={styles.inputLabel}>Est. Biomass (kg)</Text>
                      <TextInput 
                          style={styles.input} 
                          placeholder="e.g. 2000" 
                          keyboardType="numeric"
                          value={biomass}
                          onChangeText={setBiomass}
                      />
                  </View>
              </View>
              
              <TouchableOpacity style={styles.uploadButton}>
                  <Ionicons name="camera" size={20} color="#4B5563" />
                  <Text style={styles.uploadButtonText}>Upload Site Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.calculateButton, { backgroundColor: '#15803D' }]} onPress={() => Alert.alert("Success", "Listing created! Power plants will bid shortly.")}>
                  <Text style={styles.calculateButtonText}>Submit for Bid</Text>
              </TouchableOpacity>
          </View>

           {/* Earnings Wallet */}
           <Text style={styles.sectionTitle}>Earnings Wallet</Text>
           <View style={[styles.card, { backgroundColor: '#F0FDF4' }]}>
               <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                   <View>
                       <Text style={{ fontSize: 14, color: '#166534', fontWeight: '500' }}>Pending Payment</Text>
                       <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#15803D' }}>₹ {earnings.toLocaleString()}</Text>
                   </View>
                   <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center' }}>
                       <Ionicons name="wallet" size={24} color="#15803D" />
                   </View>
               </View>
               <TouchableOpacity style={{ marginTop: 16 }}>
                   <Text style={{ color: '#15803D', fontWeight: 'bold', fontSize: 14 }}>View Transaction History &rarr;</Text>
               </TouchableOpacity>
           </View>

           {/* Map Overlay */}
           <Text style={styles.sectionTitle}>Local Map</Text>
            <View style={styles.mapPlaceholder}>
                <MapView
                    style={styles.mapImage}
                    initialRegion={{
                        latitude: 28.7041,
                        longitude: 77.1025,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                >
                    {/* Collection Centers */}
                    <Marker coordinate={{ latitude: 28.7041, longitude: 77.1025 }} title="Collection Center 1">
                         <View style={[styles.mapMarker, { backgroundColor: '#15803D' }]}>
                            <Text style={{fontSize: 12}}>♻️</Text>
                        </View>
                    </Marker>
                    <Marker coordinate={{ latitude: 28.7241, longitude: 77.0825 }} title="Collection Center 2">
                         <View style={[styles.mapMarker, { backgroundColor: '#15803D' }]}>
                            <Text style={{fontSize: 12}}>♻️</Text>
                        </View>
                    </Marker>

                    {/* Fire Incidents */}
                     <Marker coordinate={{ latitude: 28.6941, longitude: 77.1125 }} title="Fire Incident">
                         <View style={[styles.mapMarker, { backgroundColor: '#EF4444' }]}>
                            <Text style={{fontSize: 12}}>🔥</Text>
                        </View>
                    </Marker>
                </MapView>
            </View>
      </View>
  );

  const renderGovernmentDashboard = () => (
    <View>
      {/* Live Pollution Feed */}
      <Text style={styles.sectionTitle}>Live Pollution Feed</Text>
      <View style={styles.feedCard}>
          <View style={styles.feedItem}>
              <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 6}}>
                  <Text style={styles.alertTag}>🔴 ALERT</Text>
                  <Text style={styles.feedLocation}>Okhla Phase 3: High Sulfur</Text>
              </View>
              <Text style={styles.feedDetails}>AI Confidence: 92% • Source: INDUSTRY</Text>
              <TouchableOpacity style={styles.dispatchButton}>
                  <Text style={styles.dispatchButtonText}>DISPATCH AUDIT TEAM</Text>
              </TouchableOpacity>
          </View>
      </View>

      {/* Dispatch Manager */}
      <Text style={styles.sectionTitle}>Dispatch Manager</Text>
      <View style={styles.card}>
          <View style={styles.ticketItem}>
              <View style={styles.ticketHeader}>
                  <Text style={styles.ticketTitle}>Fire Squad en route to Nangloi</Text>
                  <View style={[styles.statusBadge, { backgroundColor: '#FEF3C7' }]}>
                      <Text style={[styles.statusText, { color: '#D97706' }]}>In Progress</Text>
                  </View>
              </View>
              <Text style={styles.ticketTime}>Assigned: 10 min ago</Text>
          </View>
           <View style={styles.divider} />
           <View style={styles.ticketItem}>
              <View style={styles.ticketHeader}>
                  <Text style={styles.ticketTitle}>Patrol Unit at Sector 62</Text>
                  <View style={[styles.statusBadge, { backgroundColor: '#ECFDF5' }]}>
                      <Text style={[styles.statusText, { color: '#059669' }]}>Resolved</Text>
                  </View>
              </View>
               <Text style={styles.ticketTime}>Resolved: 1 h ago</Text>
          </View>
      </View>


      {/* Top Offenders */}
      <Text style={styles.sectionTitle}>Top Offenders (This Week)</Text>
      <View style={styles.card}>
          <View style={styles.offenderRow}>
              <Text style={styles.rank}>#1</Text>
              <View style={{flex: 1, marginLeft: 12}}>
                  <Text style={styles.offenderName}>SteelWorks Pvt Ltd</Text>
                  <Text style={styles.offenderZone}>Industrial Area A</Text>
              </View>
              <Text style={styles.violationCount}>12 Violations</Text>
          </View>
           <View style={styles.divider} />
           <View style={styles.offenderRow}>
              <Text style={styles.rank}>#2</Text>
              <View style={{flex: 1, marginLeft: 12}}>
                  <Text style={styles.offenderName}>Global Chem</Text>
                  <Text style={styles.offenderZone}>Zone B</Text>
              </View>
              <Text style={styles.violationCount}>8 Violations</Text>
          </View>
      </View>

       {/* Hotspot Map Overlay */}
       <Text style={styles.sectionTitle}>Hotspot Map Overlay</Text>
       <View style={styles.mapPlaceholder}>
           <MapView
                style={styles.mapImage}
                initialRegion={{
                    latitude: 28.6139,
                    longitude: 77.2090,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
           >
               {/* Hotspot Polygon */}
               <Polygon
                coordinates={[
                    { latitude: 28.6139, longitude: 77.2090 },
                    { latitude: 28.6239, longitude: 77.2190 },
                    { latitude: 28.6339, longitude: 77.2090 },
                    { latitude: 28.6239, longitude: 77.1990 },
                ]}
                fillColor="rgba(239, 68, 68, 0.4)"
                strokeColor="rgba(239, 68, 68, 0.8)"
                strokeWidth={2}
               />
               
               {/* Markers */}
               <Marker coordinate={{ latitude: 28.6239, longitude: 77.2090 }} title="Industry Fault">
                   <View style={[styles.mapMarker, { backgroundColor: '#EF4444' }]}>
                       <Text style={{fontSize: 12}}>🏭</Text>
                   </View>
               </Marker>
               
                <Marker coordinate={{ latitude: 28.6189, longitude: 77.2150 }} title="Farm Fire">
                   <View style={[styles.mapMarker, { backgroundColor: '#F59E0B' }]}>
                       <Text style={{fontSize: 12}}>🔥</Text>
                   </View>
               </Marker>

                <Marker coordinate={{ latitude: 28.6100, longitude: 77.2000 }} title="Traffic Jam">
                   <View style={[styles.mapMarker, { backgroundColor: '#EF4444' }]}>
                       <Text style={{fontSize: 12}}>🚗</Text>
                   </View>
               </Marker>
           </MapView>
       </View>

    </View>
  );

  const renderIndustryDashboard = () => (
      <View>
          {/* Real-Time Emissions Gauge */}
          <Text style={styles.sectionTitle}>Real-Time Emissions</Text>
          <View style={styles.card}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
                  <View style={{alignItems: 'center'}}>
                      <Text style={styles.gaugeValue}>38</Text>
                      <Text style={styles.gaugeLabel}>Your SO2 (PPM)</Text>
                  </View>
                  <View style={{width: 1, height: 40, backgroundColor: '#E5E7EB'}} />
                  <View style={{alignItems: 'center'}}>
                      <Text style={[styles.gaugeValue, { color: '#6B7280'}]}>40</Text>
                      <Text style={styles.gaugeLabel}>Govt Limit</Text>
                  </View>
              </View>
              
               {/* Visual Bar */}
               <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: '95%', backgroundColor: '#F59E0B' }]} />
              </View>
              <Text style={{fontSize: 10, color: '#F59E0B', marginTop: 4, textAlign: 'right'}}>Nearing Limit</Text>

              {/* AI Warning */}
              <View style={[styles.aiWarningBox, { marginTop: 16 }]}>
                   <Ionicons name="warning" size={16} color="#B45309" />
                   <Text style={styles.aiWarningText}>
                       anomaly detected: Check Sensor Calibration immediately to avoid fraud flag.
                   </Text>
              </View>
          </View>

          {/* Proof of Filter Upload */}
          <Text style={styles.sectionTitle}>Proof of Filter Efficiency</Text>
          <View style={styles.card}>
              <Text style={styles.inputLabel}>Inlet PPM</Text>
              <TextInput 
                  style={styles.input} 
                  placeholder="e.g. 500" 
                  keyboardType="numeric"
                  value={inletPPM}
                  onChangeText={setInletPPM}
              />

              <Text style={styles.inputLabel}>Outlet PPM</Text>
               <TextInput 
                  style={styles.input} 
                  placeholder="e.g. 25" 
                  keyboardType="numeric"
                  value={outletPPM}
                  onChangeText={setOutletPPM}
              />
              
              <TouchableOpacity style={styles.calculateButton} onPress={calculateEfficiency}>
                  <Text style={styles.calculateButtonText}>Calculate & Submit Proof</Text>
              </TouchableOpacity>
            
             {efficiency !== null && (
                  <View style={[styles.efficiencyResult, { backgroundColor: efficiency >= 90 ? '#ECFDF5' : '#FEF2F2' }]}>
                      <Text style={[styles.efficiencyText, { color: efficiency >= 90 ? '#059669' : '#EF4444' }]}>
                          Efficiency Score: {efficiency.toFixed(1)}% - {efficiency >= 90 ? 'PASS' : 'FAIL'}
                      </Text>
                  </View>
             )}
          </View>
          
          {/* Audit Request Button */}
           <TouchableOpacity style={styles.reinspectButton} onPress={async () => {
                const res = await api.requestReInspection("Industry initiated re-inspection request via Dashboard.");
                if (res) {
                    Alert.alert("Request Sent", "A government auditor has been notified and your status is now 'Re-Audit Requested'.");
                } else {
                    Alert.alert("Error", "Could not send request. Please try again.");
                }
           }}>
                <Ionicons name="shield-checkmark" size={20} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.reinspectButtonText}>Request Re-Inspection</Text>
           </TouchableOpacity>


          {/* Factory Location Overlay */}
          <Text style={styles.sectionTitle}>Factory Safety Zone</Text>
          <View style={styles.mapPlaceholder}>
                <MapView
                    style={styles.mapImage}
                    initialRegion={{
                        latitude: 28.55,
                        longitude: 77.27,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                >
                    <Marker coordinate={{ latitude: 28.55, longitude: 77.27 }} title="My Factory">
                         <View style={[styles.mapMarker, { backgroundColor: '#10B981' }]}>
                            <Text style={{fontSize: 12}}>🏭</Text>
                        </View>
                    </Marker>
                     <Circle 
                        center={{ latitude: 28.55, longitude: 77.27 }}
                        radius={300}
                        fillColor="rgba(16, 185, 129, 0.2)"
                        strokeColor="rgba(16, 185, 129, 0.6)"
                     />
                </MapView>
          </View>

      </View>
  );

  const renderCitizenDashboard = () => (
    <View>
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
    </View>
  );

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
        {userRole === 'Government' ? renderGovernmentDashboard() : 
         userRole === 'Industry' ? renderIndustryDashboard() :
         userRole === 'Farmer' ? renderFarmerDashboard() :
         renderCitizenDashboard()}
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
  
  // Government Dashboard Styles
  feedCard: {
      backgroundColor: '#FEF2F2',
      borderRadius: 16,
      padding: 16,
      marginBottom: 24,
      borderLeftWidth: 4,
      borderLeftColor: '#EF4444',
  },
  feedItem: {},
  alertTag: {
      color: '#EF4444',
      fontWeight: 'bold',
      fontSize: 12,
      marginRight: 8,
  },
  feedLocation: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#1F2937',
  },
  feedDetails: {
      fontSize: 12,
      color: '#4B5563',
      marginBottom: 12,
  },
  dispatchButton: {
      backgroundColor: '#EF4444',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      alignSelf: 'flex-start',
  },
  dispatchButtonText: {
      color: 'white',
      fontSize: 12,
      fontWeight: 'bold',
  },
  card: { // Generic card style if not exists
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  ticketItem: {
      marginBottom: 12,
  },
  ticketHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
  },
  ticketTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: '#1F2937',
  },
  statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 12,
  },
  statusText: {
      fontSize: 10,
      fontWeight: 'bold',
  },
  ticketTime: {
      fontSize: 12,
      color: '#9CA3AF',
  },
  divider: {
      height: 1,
      backgroundColor: '#F3F4F6',
      marginVertical: 12,
  },
  offenderRow: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  rank: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#6B7280',
      width: 24,
  },
  offenderName: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#1F2937',
  },
  offenderZone: {
      fontSize: 12,
      color: '#6B7280',
  },
  violationCount: {
      fontSize: 12,
      fontWeight: '600',
      color: '#EF4444',
  },
  mapPlaceholder: {
      height: 200,
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: 32,
      backgroundColor: '#E5E7EB',
      position: 'relative',
  },
  mapImage: {
      width: '100%',
      height: '100%',
  },
  mapOverlay: {
      ...StyleSheet.absoluteFillObject,
  },
  mapMarker: {
      position: 'absolute',
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'white',
  },
  gaugeValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#1F2937',
  },
  gaugeLabel: {
      fontSize: 12,
      color: '#6B7280',
  },
  aiWarningBox: {
      flexDirection: 'row',
      backgroundColor: '#FEF3C7',
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
  },
  aiWarningText: {
      fontSize: 12,
      color: '#B45309',
      marginLeft: 8,
      flex: 1,
  },
  inputLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: '#374151',
      marginBottom: 6,
      marginTop: 12,
  },
  input: {
      backgroundColor: '#F9FAFB',
      borderWidth: 1,
      borderColor: '#D1D5DB',
      borderRadius: 8,
      padding: 12,
      fontSize: 14,
  },
  calculateButton: {
      backgroundColor: '#2B5F6C',
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 16,
  },
  calculateButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 14,
  },
  efficiencyResult: {
      marginTop: 16,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
  },
  efficiencyText: {
      fontWeight: 'bold',
      fontSize: 14,
  },
  reinspectButton: {
      backgroundColor: '#059669',
      paddingVertical: 16,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
      marginTop: 8,
      shadowColor: '#059669',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
  },
  reinspectButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    marginBottom: 16,
    marginTop: 16,
  },
  uploadButtonText: {
    color: '#4B5563',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
  },
});
