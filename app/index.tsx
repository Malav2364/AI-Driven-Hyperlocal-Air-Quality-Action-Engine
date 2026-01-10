import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const roles = [
  {
    id: 'Citizen',
    title: 'Citizen',
    icon: 'person',
    description: 'Track air quality and stay safe.',
    color: '#2B5F6C', // Teal
  },
  {
    id: 'Industry',
    title: 'Industry',
    icon: 'business',
    description: 'Monitor emissions and compliance.',
    color: '#F97316', // Orange
  },
  {
    id: 'Government',
    title: 'Government',
    icon: 'shield-checkmark',
    description: 'Manage policy and response.',
    color: '#3B82F6', // Blue
  },
  {
    id: 'Farmer',
    title: 'Farmer',
    icon: 'leaf',
    description: 'Crop health and weather alerts.',
    color: '#84CC16', // Green
  }
];

export default function RoleSelectionScreen() {
  const router = useRouter();

  const handleSelectRole = (role: string) => {
    // Navigate to Signup with pre-selected role
    router.push({ pathname: '/signup', params: { role } });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Background with overlay */}
      <Image 
        source={require('../assets/login_asset1.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)']}
        style={styles.gradientOverlay}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Envirosense</Text>
          <Text style={styles.subtitle}>Who are you?</Text>
          <Text style={styles.helperText}>Select your role to get started</Text>
        </View>

        <View style={styles.grid}>
          {roles.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.card}
              onPress={() => handleSelectRole(item.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon as any} size={32} color={item.color} />
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity onPress={() => router.push('/login')} style={styles.loginLink}>
            <Text style={styles.loginText}>Already have an account? <Text style={{fontWeight: 'bold', textDecorationLine: 'underline'}}>Log In</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 16,
    color: '#D1D5DB',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  card: {
    width: (width - 48 - 16) / 2, // (Screen width - padding - gap) / 2
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)', // Works on web, ignored on native but clear enough
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDesc: {
    color: '#9CA3AF', // gray-400
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  loginLink: {
      marginTop: 40,
      alignSelf: 'center',
  },
  loginText: {
      color: '#D1D5DB',
      fontSize: 14,
  }
});
