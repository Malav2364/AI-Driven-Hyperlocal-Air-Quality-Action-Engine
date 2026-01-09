import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { api, setToken } from './services/api';

export default function SignupScreen() {
  const [role, setRole] = useState<'Citizen' | 'Authority'>('Citizen');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pledgeAccepted, setPledgeAccepted] = useState(false);

  const handleSignup = async () => {
    if (!pledgeAccepted) {
        Alert.alert('Pledge Required', 'Please accept the Responsible Use Pledge to continue.');
        return;
    }
    if (!name || !email || !password) {
        Alert.alert('Error', 'Please fill in all fields.');
        return;
    }

    setLoading(true);
    try {
        const data = await api.signup(name, email, password, role, city, pincode);
        if (data.token) {
            await setToken(data.token);
            // Navigate to the tabs dashboard
            router.replace('/(tabs)/dashboard');
        } else {
            Alert.alert('Signup Failed', data.message || 'Something went wrong');
        }
    } catch (error) {
        Alert.alert('Error', 'Network error or server unavailable');
        console.error(error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <Stack.Screen options={{ 
        title: 'Create Account',
        headerTitleAlign: 'center',
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
        ),
        headerShadowVisible: false,
        headerTitleStyle: { fontSize: 18, fontWeight: 'bold' },
        headerStyle: { backgroundColor: '#F9FAFB' }
      }} />

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        
        {/* Hero Card */}
        <View style={styles.heroCard}>
          <Image 
            source={require('../assets/signup_asset1.png')} 
            style={styles.heroImage}
            resizeMode="cover"
          />
          <LinearGradient 
            colors={['transparent', 'rgba(0,0,0,0.8)']} 
            style={styles.heroOverlay}
          >
            <View style={styles.heroBadge}>
              <Ionicons name="cloud" size={14} color="white" style={{ marginRight: 6 }} />
              <Text style={styles.heroBadgeText}>AIR QUALITY NETWORK</Text>
            </View>
            <Text style={styles.heroTitle}>Join the solution.</Text>
            <Text style={styles.heroSubtitle}>Contribute to safer environments.</Text>
          </LinearGradient>
        </View>

        {/* User Role */}
        <View style={styles.section}>
          <Text style={styles.label}>SELECT USER ROLE</Text>
          <TouchableOpacity 
            style={styles.roleSelector}
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="business" size={20} color="#2B5F6C" style={{ marginRight: 12 }} />
              <Text style={styles.roleText}>{role}</Text>
            </View>
            <Ionicons name={isDropdownOpen ? "chevron-up" : "chevron-down"} size={20} color="#6B7280" />
          </TouchableOpacity>
          {isDropdownOpen && (
            <View style={styles.dropdownContainer}>
              <TouchableOpacity 
                style={styles.dropdownItem}
                onPress={() => {
                  setRole('Citizen');
                  setIsDropdownOpen(false);
                }}
              >
                <Text style={[styles.roleText, role === 'Citizen' && { color: '#2B5F6C', fontWeight: 'bold' }]}>Citizen</Text>
                {role === 'Citizen' && <Ionicons name="checkmark" size={16} color="#2B5F6C" />}
              </TouchableOpacity>
              <View style={styles.dropdownDivider} />
              <TouchableOpacity 
                style={styles.dropdownItem}
                onPress={() => {
                  setRole('Authority');
                  setIsDropdownOpen(false);
                }}
              >
                <Text style={[styles.roleText, role === 'Authority' && { color: '#2B5F6C', fontWeight: 'bold' }]}>Authority</Text>
                {role === 'Authority' && <Ionicons name="checkmark" size={16} color="#2B5F6C" />}
              </TouchableOpacity>
            </View>
          )}
          <Text style={styles.helperText}>
            Track personal exposure, contribute data, and receive local alerts.
          </Text>
        </View>

        {/* Top Form Fields */}
        <View style={styles.formGroup}>
          <View>
            <Text style={styles.label}>Full Name</Text>
            <TextInput 
              placeholder="e.g. Sarah Connor" 
              style={styles.input} 
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View>
            <Text style={styles.label}>Email Address</Text>
            <TextInput 
              placeholder="name@email.com" 
              style={styles.input} 
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput 
                placeholder="Create a strong password" 
                style={styles.passwordInput} 
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off" : "eye-off"} size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            {/* Password Strength */}
            <View style={styles.strengthContainer}>
              <View style={[styles.strengthBar, { backgroundColor: '#22C55E' }]} />
              <View style={[styles.strengthBar, { backgroundColor: '#22C55E' }]} />
              <View style={[styles.strengthBar, { backgroundColor: '#E5E7EB' }]} />
              <View style={[styles.strengthBar, { backgroundColor: '#E5E7EB' }]} />
            </View>
            <Text style={styles.strengthText}>Strength: Medium</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Location Details */}
        <View style={styles.section}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Ionicons name="location" size={20} color="#2B5F6C" style={{ marginRight: 8 }} />
            <Text style={styles.sectionTitle}>Location Details</Text>
          </View>
          
          <View style={styles.formGroup}>
            <View>
              <Text style={styles.label}>City of Residence</Text>
              <TextInput 
                placeholder="e.g. San Francisco" 
                style={styles.input} 
                placeholderTextColor="#9CA3AF"
                value={city}
                onChangeText={setCity}
              />
            </View>
            <View>
              <Text style={styles.label}>Area / Pincode <Text style={{fontWeight: '400', color: '#6B7280'}}>(Optional)</Text></Text>
              <TextInput 
                placeholder="e.g. 94103" 
                style={styles.input} 
                placeholderTextColor="#9CA3AF"
                value={pincode}
                onChangeText={setPincode}
              />
            </View>
          </View>
        </View>

        {/* Pledge */}
        <TouchableOpacity 
          style={styles.pledgeContainer} 
          onPress={() => setPledgeAccepted(!pledgeAccepted)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, pledgeAccepted && styles.checkboxChecked]}>
            {pledgeAccepted && <Ionicons name="checkmark" size={14} color="white" />}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.pledgeTitle}>Responsible Use Pledge</Text>
            <Text style={styles.pledgeText}>
              I agree to use the insights provided by this platform ethically for public betterment. I understand this data influences disaster response protocols.
            </Text>
          </View>
        </TouchableOpacity>

        {/* Register Button */}
        <TouchableOpacity 
          style={styles.registerButton}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
             <ActivityIndicator color="white" />
          ) : (
             <>
                 <Text style={styles.registerButtonText}>Register Account</Text>
                 <Ionicons name="arrow-forward" size={20} color="white" />
             </>
          )}
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.footerLink}>Log In</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  heroCard: {
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: '#2B5F6C',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingTop: 40,
    // Background gradient handles visibility
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  heroBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  heroTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  roleSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dropdownContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 8,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  roleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    lineHeight: 18,
  },
  formGroup: {
    gap: 16,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  strengthContainer: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 8,
    marginBottom: 4,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    color: '#6B7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 24,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  pledgeContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6', // light gray
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: 'white',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#2B5F6C',
    borderColor: '#2B5F6C',
  },
  pledgeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  pledgeText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  registerButton: {
    backgroundColor: '#2B5F6C',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2B5F6C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    marginBottom: 24,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#6B7280',
    fontSize: 14,
  },
  footerLink: {
    color: '#1F2937',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
