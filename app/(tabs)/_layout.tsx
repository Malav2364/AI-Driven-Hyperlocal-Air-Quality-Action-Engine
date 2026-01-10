import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import { api } from '../services/api';

export default function TabLayout() {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = await api.getMe();
         if (user && user.role) {
           setUserRole(user.role);
         }
      } catch (error) {
        console.log('Error fetching role:', error);
      }
    };
    fetchUserRole();
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          height: Platform.OS === 'android' ? 80 : 100,
          paddingBottom: Platform.OS === 'android' ? 22 : 34,
          paddingTop: 12,
        },
        tabBarActiveTintColor: '#2B5F6C',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Monitor',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? '#ECFDF5' : 'transparent',
              width: 48,
              height: 32,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Ionicons name={focused ? "grid" : "grid-outline"} size={22} color={color} />
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="market"
        options={{
          title: 'Market',
          href: userRole === 'Farmer' ? undefined : null,
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? '#ECFDF5' : 'transparent',
              width: 48,
              height: 32,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Ionicons name={focused ? "leaf" : "leaf-outline"} size={22} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          href: userRole !== 'Farmer' ? undefined : null,
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? '#ECFDF5' : 'transparent',
              width: 48,
              height: 32,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Ionicons name={focused ? "map" : "map-outline"} size={22} color={color} />
            </View>
          ),
        }}
      />

      {/* Hide inactive tabs from the bar by using href: null if we really wanted to suppress them, 
          but expo-router requires the name to match the file. 
          If we conditionally render Tabs.Screen, it controls the visibility in the specific slot.
          However, usually we want to preserve the order.
      */}

      {/* Since map/market are mutually exclusive in this slot, the above ternary works for the 2nd position. 
          Note: If 'market.tsx' is in the folder, it is still a route. 
          If we don't include a <Tabs.Screen name="market" /> when role != Farmer, 
          it will not show in the tab bar, effectively hiding it, which is what we want.
      */}
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          href: userRole !== 'Government' ? undefined : null,
          tabBarIcon: ({ color, focused }) => (
             <View style={{
              backgroundColor: focused ? '#ECFDF5' : 'transparent',
              width: 48,
              height: 32,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Ionicons name={focused ? "stats-chart" : "stats-chart-outline"} size={22} color={color} />
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="audit"
        options={{
          title: 'Audit',
          href: userRole === 'Government' ? undefined : null,
          tabBarIcon: ({ color, focused }) => (
             <View style={{
              backgroundColor: focused ? '#ECFDF5' : 'transparent',
              width: 48,
              height: 32,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Ionicons name={focused ? "clipboard" : "clipboard-outline"} size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
             <View style={{
              backgroundColor: focused ? '#ECFDF5' : 'transparent',
              width: 48,
              height: 32,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Ionicons name={focused ? "person" : "person-outline"} size={22} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
