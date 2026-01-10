import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MarketScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Green Market</Text>
        <TouchableOpacity style={styles.iconButton}>
             <Ionicons name="cart-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        {/* Banner */}
        <LinearGradient
            colors={['#84CC16', '#4D7C0F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.banner}
        >
            <View>
                <Text style={styles.bannerTitle}>Sell Your Harvest</Text>
                <Text style={styles.bannerDesc}>Connect directly with buyers and industries.</Text>
                <TouchableOpacity style={styles.bannerButton}>
                    <Text style={styles.bannerButtonText}>List Item</Text>
                </TouchableOpacity>
            </View>
            <Ionicons name="leaf" size={80} color="rgba(255,255,255,0.2)" style={{position: 'absolute', right: -10, bottom: -10}} />
        </LinearGradient>

        <View style={styles.placeholderContainer}>
            <Image 
                source={{uri: 'https://img.freepik.com/free-vector/farmers-market-concept-illustration_114360-8919.jpg'}} // Placeholder
                style={styles.placeholderImage}
                resizeMode="contain"
            />
            <Text style={styles.placeholderText}>Marketplace Coming Soon</Text>
            <Text style={styles.placeholderSubText}>We are building a platform for you to sell sustainable produce and eco-friendly products.</Text>
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
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  iconButton: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
  },
  content: {
    padding: 20,
  },
  banner: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  bannerDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 20,
    maxWidth: '70%',
  },
  bannerButton: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: '#4D7C0F',
    fontWeight: 'bold',
    fontSize: 14,
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  placeholderImage: {
    width: 250,
    height: 200,
    marginBottom: 24,
    opacity: 0.8,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  placeholderSubText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 22,
  },
});
