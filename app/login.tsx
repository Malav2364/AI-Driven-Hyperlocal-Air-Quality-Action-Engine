import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
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

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const data = await api.login(email, password);
      if (data.token) {
        await setToken(data.token);
        router.replace('/(tabs)/dashboard');
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
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
      
      {/* Top Image Section */}
      <View style={styles.imageContainer}>
        <Image 
          source={require('../assets/login_asset1.png')} 
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Bottom Content Section */}
      <View style={styles.contentContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.descriptionContainer}>
            <Text style={{fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 8}}>Welcome Back</Text>
            <Text style={styles.descriptionText}>
              Sign in to access your dashboard and insights.
            </Text>
            <View style={styles.descriptionDivider} />
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            
            {/* Email Input */}
            <View>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color="#6B7280" />
                <TextInput 
                  placeholder="name@example.com" 
                  style={styles.textInput}
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* Password Input */}
            <View>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
                <TextInput 
                  placeholder="........" 
                  style={styles.textInput}
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPasswordButton}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text style={styles.submitButtonText}>Log In</Text>
                  <Ionicons name="arrow-forward" size={20} color="white" />
                </>
              )}
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/signup')}>
                <Text style={styles.footerLink}>Register Now</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageContainer: {
    height: '45%',
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -40,
    paddingTop: 32,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 9999,
    padding: 4,
    marginBottom: 24,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 300,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 9999,
  },
  tabButtonActive: {
    backgroundColor: '#2B5F6C',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  tabTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  tabTextInactive: {
    color: '#6B7280',
    fontWeight: '600',
  },
  descriptionContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  descriptionText: {
    color: '#1F2937', // gray-800
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 24,
  },
  descriptionDivider: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB', // gray-200
    marginTop: 12,
    borderRadius: 9999,
  },
  formContainer: {
    gap: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6B7280',
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  textInput: {
    flex: 1,
    marginLeft: 12,
    color: '#1F2937',
    fontWeight: '500',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    color: '#2B5F6C',
    fontWeight: '600',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#2B5F6C',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#2B5F6C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 8,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  footerText: {
    color: '#6B7280',
  },
  footerLink: {
    color: '#1F2937',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
