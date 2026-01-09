import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const TIME_RANGES = ['Day', 'Week', 'Month', 'Year'];

export default function AnalyticsScreen() {
  const [selectedRange, setSelectedRange] = useState('Week');
  const [locationName, setLocationName] = useState<string>('Detecting Location...');
  const [loadingLocation, setLoadingLocation] = useState(true);

  // Re-implement location fetching for consistency in header
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationName('Permission Denied');
          setLoadingLocation(false);
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
           setLocationName('Unknown Location');
        }
      } catch (error) {
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
            <Text style={styles.appName}>Envirosense</Text>
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
        
        {/* Time Filter Tabs */}
        <View style={styles.tabContainer}>
          {TIME_RANGES.map((range) => {
            const isSelected = selectedRange === range;
            return (
              <TouchableOpacity
                key={range}
                onPress={() => setSelectedRange(range)}
                style={[styles.tabButton, isSelected && styles.tabButtonActive]}
              >
                <Text style={[styles.tabText, isSelected && styles.tabTextActive]}>
                  {range}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Key Metrics Row */}
        <View style={styles.metricsRow}>
          {/* Avg AQI Card */}
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <View style={[styles.iconBox, { backgroundColor: '#FFF7ED' }]}>
                <Ionicons name="stats-chart" size={18} color="#F97316" />
              </View>
              <Text style={styles.metricTitle}>Avg AQI</Text>
            </View>
            <View style={styles.metricValueRow}>
              <Text style={styles.metricValue}>142</Text>
              <Text style={styles.metricStatus}>Unhealthy</Text>
            </View>
            <Text style={styles.metricSubtext}>+12% vs last week</Text>
          </View>

          {/* Interventions Card */}
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <View style={[styles.iconBox, { backgroundColor: '#F0F9FF' }]}>
                 <Ionicons name="trending-down" size={18} color="#0EA5E9" />
              </View>
              <Text style={styles.metricTitle}>Interventions</Text>
            </View>
             <View style={styles.metricValueRow}>
              <Text style={styles.metricValue}>85%</Text>
              <Text style={[styles.metricStatus, { color: '#22C55E' }]}>Effective</Text>
            </View>
            <Text style={styles.metricSubtext}>PM2.5 Reduction</Text>
          </View>
        </View>

        {/* Pollution Trends Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartTitle}>Pollution Trends</Text>
              <Text style={styles.chartSubtitle}>PM2.5 levels over past 7 days</Text>
            </View>
            <TouchableOpacity style={styles.reportButton}>
              <Text style={styles.reportButtonText}>View Report</Text>
            </TouchableOpacity>
          </View>

          <LineChart
            data={{
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              datasets: [
                {
                  data: [50, 80, 130, 160, 110, 95, 120],
                  // @ts-ignore: library requires a key for some reason internally or wrapper issue
                  key: 'dataset-1' 
                }
              ]
            }}
            width={width - 56} // Card padding (16*2) + Screen padding (20*2) - approx adj
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            withInnerLines={true}
            withOuterLines={false}
            withVerticalLines={false}
            withHorizontalLines={true}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              fillShadowGradientFrom: "#F97316",
              fillShadowGradientTo: "#ffffff",
              fillShadowGradientOpacity: 0.2,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(249, 115, 22, ${opacity})`, // Orange line
              labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "5",
                strokeWidth: "2",
                stroke: "#F97316",
                fill: "#fff" 
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
              paddingRight: 32, // Accommodate right labels
            }}
            renderDotContent={({x, y, index, indexData}) => {
                if (index === 3) {
                    return (
                        <View
                            key={index}
                            style={{
                                position: 'absolute',
                                top: y - 48, // Adjust offset to be above the point
                                left: x - 30, // Center horizontally approx
                                width: 60,
                                height: 40,
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 100,
                                elevation: 5,
                            }}
                        >
                            <View style={{ backgroundColor: '#1F2937', padding: 6, borderRadius: 8 }}>
                                <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>158 AQI</Text>
                            </View>
                            {/* Triangle */}
                            <View style={{ 
                                width: 0, 
                                height: 0, 
                                borderTopWidth: 6, 
                                borderLeftWidth: 6, 
                                borderRightWidth: 6, 
                                borderTopColor: '#1F2937', 
                                borderLeftColor: 'transparent', 
                                borderRightColor: 'transparent',
                                marginTop: -1 
                            }} />
                        </View>
                    )
                }
                return null;
            }}
          />
        </View>

        {/* Pollution Sources List */}
        <View style={styles.sourcesCard}>
          <Text style={styles.sectionTitle}>Pollution Sources</Text>
          
          <View style={styles.sourceRow}>
            <View style={styles.sourceHeader}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Ionicons name="car-sport" size={20} color="#374151" style={{marginRight: 8}} />
                    <Text style={styles.sourceLabel}>Vehicular Traffic</Text>
                </View>
                <Text style={styles.sourcePercent}>45%</Text>
            </View>
            <View style={styles.progressBarBg}>
                <View style={[styles.progressFill, { width: '45%', backgroundColor: '#2B5F6C' }]} />
            </View>
          </View>

          <View style={styles.sourceRow}>
            <View style={styles.sourceHeader}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Ionicons name="business" size={20} color="#374151" style={{marginRight: 8}} />
                    <Text style={styles.sourceLabel}>Industrial Emissions</Text>
                </View>
                <Text style={styles.sourcePercent}>30%</Text>
            </View>
            <View style={styles.progressBarBg}>
                <View style={[styles.progressFill, { width: '30%', backgroundColor: '#475569' }]} />
            </View>
          </View>

          <View style={styles.sourceRow}>
            <View style={styles.sourceHeader}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Ionicons name="construct" size={20} color="#374151" style={{marginRight: 8}} />
                    <Text style={styles.sourceLabel}>Construction Dust</Text>
                </View>
                <Text style={styles.sourcePercent}>15%</Text>
            </View>
            <View style={styles.progressBarBg}>
                <View style={[styles.progressFill, { width: '15%', backgroundColor: '#FCD34D' }]} />
            </View>
          </View>

        </View>

      </ScrollView>


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
    maxWidth: 200,
  },
  notificationButton: {
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
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    padding: 4,
    marginBottom: 24,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  tabButtonActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    color: '#6B7280',
    fontWeight: '600',
    fontSize: 14,
  },
  tabTextActive: {
    color: '#2B5F6C',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  metricTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginRight: 8,
  },
  metricStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#F97316',
  },
  metricSubtext: {
    fontSize: 10,
    color: '#6B7280',
  },
  chartCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  chartSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  reportButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  reportButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  sourcesCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
  },
  sourceRow: {
    marginBottom: 16,
  },
  sourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sourceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  sourcePercent: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },

});
