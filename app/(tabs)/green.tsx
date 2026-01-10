import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    ImageBackground,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { api } from '../services/api';

const { width } = Dimensions.get('window');

export default function GreenActionsScreen() {
  const [credits, setCredits] = useState(450);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  // Complaint State
  const [complaintDesc, setComplaintDesc] = useState('');
  const [complaintLoc, setComplaintLoc] = useState('');
  const [complaintImage, setComplaintImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // ... useEffect ...

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setComplaintImage(result.assets[0].uri);
    }
  };

  const submitComplaint = async () => {
      if (!complaintDesc || !complaintLoc || !complaintImage) {
          Alert.alert("Missing Details", "Please provide location, description and an image.");
          return;
      }
      setSubmitting(true);
      
      const formData = new FormData();
      formData.append('description', complaintDesc);
      formData.append('location', complaintLoc);
      
      // Append Image
      const uriParts = complaintImage.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      formData.append('image', {
          uri: complaintImage,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
      } as any);

      try {
          const res = await api.reportPollution(formData);
          setSubmitting(false);
          if (res && res._id) { // Check for ID or success indicator
             Alert.alert("Report Submitted", "Your complaint has been registered. You will earn credits once cleared by the government.");
             setComplaintDesc('');
             setComplaintLoc('');
             setComplaintImage(null);
          } else {
              Alert.alert("Error", "Failed to submit report.");
          }
      } catch (e) {
          setSubmitting(false);
          Alert.alert("Error", "Network error.");
      }
  };

  useFocusEffect(
      React.useCallback(() => {
          const fetchUser = async () => {
              try {
                  const user = await api.getMe();
                  if (user && user.role) setUserRole(user.role);
              } catch (e) {
                  console.log(e);
              }
          };
          fetchUser();
      }, [])
  );
  
  const handlePlantTree = () => {
    Alert.alert(
        "Planting Protocol Initiated",
        "Step 1: Analyzing GPS Location for viability...",
        [
            { text: "Cancel", style: "cancel" },
            { text: "Proceed", onPress: () => {
                setTimeout(() => {
                     Alert.alert("Success", "Photo Verified! Local sapling identified. +100 Green Credits added to your wallet.", [
                         { text: "Awesome!", onPress: () => setCredits(c => c + 100) }
                     ]);
                }, 1000);
            }}
        ]
    );
  };

  const handleScan = () => {
      Alert.alert(
          "Green Scanner",
          "Choose a mode to earn credits:",
          [
              { text: "Bus QR", onPress: () => Alert.alert("Scanned", "Bus Ride Verified. +10 Credits") },
              { text: "Metro QR", onPress: () => Alert.alert("Scanned", "Metro Ride Verified. +20 Credits") },
              { text: "Carpool", onPress: () => Alert.alert("Scanned", "Carpool Partner Verified. +15 Credits") },
              { text: "Cancel", style: "cancel" }
          ]
      );
  };

  if (userRole === 'Government') {
      return (
          <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
              <Text>This section is for Citizens and Industry/Farmers only.</Text>
          </View>
      );
  }

  return (
    <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar style="dark" />

        <View style={styles.header}>
            <Text style={styles.headerTitle}>Green Actions</Text>
            <View style={styles.pointsBadge}>
                <Ionicons name="leaf" size={16} color="#15803D" />
                <Text style={styles.pointsText}>{credits} pts</Text>
            </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            {/* Points Wallet & Leaderboard */}
            <View style={styles.walletCard}>
                <View>
                    <Text style={styles.walletLabel}>Green Credits</Text>
                    <Text style={styles.walletBalance}>{credits}</Text>
                    <TouchableOpacity>
                        <Text style={styles.redeemText}>Redeem for Metro &rarr;</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <View style={styles.rankBadge}>
                        <Ionicons name="trophy" size={14} color="#B45309" />
                        <Text style={styles.rankText}>Top 5%</Text>
                    </View>
                    <Text style={styles.leaderboardText}>in Delhi</Text>
                </View>
            </View>

            {/* Green Scanner Action */}
            <TouchableOpacity style={styles.fabButton} onPress={handleScan}>
                <LinearGradient
                    colors={['#22C55E', '#16A34A']}
                    style={styles.fabGradient}
                >
                    <Ionicons name="qr-code-outline" size={28} color="white" />
                    <Text style={styles.fabText}>Green Scanner</Text>
                </LinearGradient>
            </TouchableOpacity>

            {/* Plant a Tree Action */}
            <ImageBackground 
                source={require('../../assets/plant_image.png')} 
                style={styles.plantCard}
                imageStyle={{ borderRadius: 16, opacity: 0.9 }} // Visual tweak
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
                    style={styles.plantGradientOverlay}
                >
                    <View style={styles.plantContent}>
                        <Text style={[styles.plantTitle, { color: 'white' }]}>Plant a Tree, Earn Credits</Text>
                        <Text style={[styles.plantDesc, { color: '#E5E7EB' }]}>Upload a photo of a new sapling. AI verifies location and species.</Text>
                        <TouchableOpacity style={[styles.plantButton, { backgroundColor: 'white' }]} onPress={handlePlantTree}>
                            <Text style={[styles.plantButtonText, { color: '#15803D' }]}>Plant Now (+100 🌿)</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </ImageBackground>

            {/* Report Pollutant */}
            <Text style={styles.sectionTitle}>Report Pollutant</Text>
            <View style={styles.walletCard}>
                <View style={{ width: '100%' }}>
                     <Text style={styles.inputLabel}>Location</Text>
                     <TextInput 
                        style={styles.input} 
                        placeholder="e.g. Sector 4, Industrial Area" 
                        value={complaintLoc}
                        onChangeText={setComplaintLoc}
                     />
                     
                     <Text style={styles.inputLabel}>Description</Text>
                     <TextInput 
                        style={[styles.input, { height: 80, textAlignVertical: 'top' }]} 
                        placeholder="Describe the pollution source..." 
                        multiline
                        numberOfLines={3}
                        value={complaintDesc}
                        onChangeText={setComplaintDesc}
                     />
                     
                     <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                        {complaintImage ? (
                            <Image source={{ uri: complaintImage }} style={{ width: '100%', height: 150, borderRadius: 8 }} />
                        ) : (
                            <>
                                <Ionicons name="camera-outline" size={24} color="#6B7280" />
                                <Text style={styles.uploadButtonText}>Upload Evidence Photo</Text>
                            </>
                        )}
                     </TouchableOpacity>
                     
                     <TouchableOpacity 
                        style={[styles.plantButton, { alignSelf: 'stretch', alignItems: 'center', marginTop: 8 }]} 
                        onPress={submitComplaint}
                        disabled={submitting}
                     >
                        {submitting ? <ActivityIndicator color="white" /> : <Text style={styles.plantButtonText}>Submit Complaint</Text>}
                     </TouchableOpacity>
                </View>
            </View>

            {/* Green Routes Map */}
            <Text style={styles.sectionTitle}>Green Routes & AQI</Text>
            <View style={styles.mapPlaceholder}>
                <MapView
                    style={styles.mapImage}
                    initialRegion={{
                        latitude: 28.6139,
                        longitude: 77.2090,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                >
                    {/* Green Route Polyline */}
                    <Polyline 
                        coordinates={[
                            { latitude: 28.6139, longitude: 77.2090 },
                            { latitude: 28.6200, longitude: 77.2150 },
                            { latitude: 28.6300, longitude: 77.2200 },
                        ]}
                        strokeColor="#22C55E"
                        strokeWidth={4}
                        lineDashPattern={[1]}
                    />
                    <Marker coordinate={{ latitude: 28.6139, longitude: 77.2090 }} title="You">
                        <View style={[styles.mapMarker, { backgroundColor: '#3B82F6' }]}>
                            <View style={{width: 8, height: 8, borderRadius: 4, backgroundColor: 'white'}} />
                        </View>
                    </Marker>
                    <Marker coordinate={{ latitude: 28.6300, longitude: 77.2200 }} title="Destination">
                        <Ionicons name="location" size={32} color="#EF4444" />
                    </Marker>

                    {/* Live AQI Pins along route */}
                    <Marker coordinate={{ latitude: 28.6200, longitude: 77.2150 }}>
                        <View style={[styles.statusBadge, { backgroundColor: '#7fea34ff' }]}>
                            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 10}}>100</Text>
                        </View>
                    </Marker>
                </MapView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#111827',
  },
  pointsBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#DCFCE7',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
  },
  pointsText: {
      fontWeight: 'bold',
      color: '#166534',
      marginLeft: 6,
  },
  scrollContent: {
      padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
    marginTop: 8,
  },
  walletCard: {
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 20,
      marginBottom: 24,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
  },
  walletLabel: {
      fontSize: 14,
      color: '#6B7280',
      fontWeight: '500',
      marginBottom: 4,
  },
  walletBalance: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#166534',
      marginBottom: 8,
  },
  redeemText: {
      color: '#16A34A',
      fontWeight: 'bold',
      fontSize: 12,
  },
  rankBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FEF3C7',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginBottom: 4,
  },
  rankText: {
      color: '#B45309',
      fontSize: 12,
      fontWeight: 'bold',
      marginLeft: 4,
  },
  leaderboardText: {
      fontSize: 12,
      color: '#6B7280',
  },
  fabButton: {
      marginBottom: 24,
      shadowColor: '#16A34A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
  },
  fabGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      borderRadius: 16,
  },
  fabText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 12,
  },
  plantCard: {
      backgroundColor: 'white',
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
  },
  plantImage: {
      width: '100%',
      height: 140,
  },
  plantGradientOverlay: {
      padding: 16,
      justifyContent: 'flex-end',
      height: 180, // Explicit height for the card now
  },
  plantContent: {
      // Remove padding if moved to overlay, or keep it.
      // previous was padding: 16.
      // If overlay has padding, then this might be double.
      // I generally prefer overlay to handle layout.
  },
  plantTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#1F2937',
      marginBottom: 4,
  },
  plantDesc: {
      fontSize: 12,
      color: '#6B7280',
      marginBottom: 16,
      lineHeight: 18,
  },
  plantButton: {
      backgroundColor: '#15803D',
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: 'center',
      alignSelf: 'flex-start',
      paddingHorizontal: 20,
  },
  plantButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 12,
  },
  mapPlaceholder: {
      height: 250,
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
  mapMarker: {
      width: 16,
      height: 16,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'white',
  },
  statusBadge: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 8,
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
      minHeight: 50,
  },
  uploadButtonText: {
    color: '#6B7280',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
  },
});
