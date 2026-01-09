import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { api, removeToken } from '../services/api';

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
        try {
            const data = await api.getMe();
            setUser(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive", 
          onPress: async () => {
            await removeToken();
            router.replace('/login');
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />
      
      {/* Header (Transparent/Minimal) */}
      <View style={styles.headerSpacer} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          {/* ... Avatar ... */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarBorder}>
                <Image 
                source={{ uri: 'https://i.pravatar.cc/150?img=11' }} 
                style={styles.avatar} 
                />
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil" size={16} color="#374151" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>{user?.name || 'Citizen'}</Text>
          <Text style={styles.userRole}>{user?.role || 'User'}</Text>
          
          <View style={styles.tagsRow}>
            <View style={styles.verifiedTag}>
                <Text style={styles.verifiedText}>Verified {user?.role || 'User'}</Text>
            </View>
            <View style={styles.memberTag}>
                <Text style={styles.memberText}>Joined {user?.createdAt ? new Date(user.createdAt).getFullYear() : 'Recently'}</Text>
            </View>
          </View>
        </View>

        {/* Location Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
             <Ionicons name="location" size={20} color="#264E58" style={{marginRight: 8}} />
             <Text style={styles.cardTitle}>Location Details</Text>
          </View>
          
          <View style={styles.detailsRow}>
             <Text style={styles.detailsLabel}>City</Text>
             <Text style={styles.detailsValue}>{user?.city || 'Not Set'}</Text>
          </View>
          <View style={styles.detailsDivider} />
          
           <View style={styles.detailsRow}>
             <Text style={styles.detailsLabel}>Neighborhood</Text>
             <Text style={styles.detailsValue}>{user?.pincode ? `Area Code: ${user.pincode}` : 'Not Set'}</Text>
          </View>
          <View style={styles.detailsDivider} />

           <View style={styles.detailsRow}>
             <Text style={styles.detailsLabel}>Country</Text>
             <Text style={styles.detailsValue}>India</Text>
          </View>
        </View>

        {/* Contact Information Card */}
        <View style={styles.card}>
           <View style={styles.cardHeader}>
             <Ionicons name="person" size={20} color="#264E58" style={{marginRight: 8}} />
             <Text style={styles.cardTitle}>Contact Information</Text>
          </View>

          <View style={styles.contactItem}>
            <View style={styles.contactIconBox}>
                <Ionicons name="mail" size={18} color="#374151" />
            </View>
            <View>
                <Text style={styles.contactLabel}>EMAIL ADDRESS</Text>
                <Text style={styles.contactValue}>{user?.email || 'email@example.com'}</Text>
            </View>
          </View>

          {/* ... */}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#EF4444" style={{ marginRight: 8 }} />
            <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerSpacer: {
      height: Platform.OS === 'android' ? 40 : 20,
      backgroundColor: 'white'
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarBorder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#264E58', // Teal border
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: '#FFD8B0', // Fallback color
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 6,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  verifiedTag: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  verifiedText: {
    color: '#047857',
    fontSize: 12,
    fontWeight: '600',
  },
  memberTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  memberText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '500',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailsLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailsValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  detailsDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  contactIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contactLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  contactValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    marginBottom: 24,
    marginTop: 8,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#EF4444',
  },

});
