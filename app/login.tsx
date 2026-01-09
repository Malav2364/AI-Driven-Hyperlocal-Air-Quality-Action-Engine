import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [activeTab, setActiveTab] = useState<'authority' | 'citizen'>('authority');
  const [showPassword, setShowPassword] = useState(false);

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
          
          {/* Toggle Switch */}
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              onPress={() => setActiveTab('authority')}
              style={[styles.tabButton, activeTab === 'authority' ? styles.tabButtonActive : {}]}
            >
              <Ionicons name="shield-checkmark" size={16} color={activeTab === 'authority' ? 'white' : '#6B7280'} style={{marginRight: 6}} />
              <Text style={activeTab === 'authority' ? styles.tabTextActive : styles.tabTextInactive}>
                Authority
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => setActiveTab('citizen')}
              style={[styles.tabButton, activeTab === 'citizen' ? styles.tabButtonActive : {}]}
            >
              <Ionicons name="person" size={16} color={activeTab === 'citizen' ? 'white' : '#6B7280'} style={{marginRight: 6}} />
              <Text style={activeTab === 'citizen' ? styles.tabTextActive : styles.tabTextInactive}>
                Citizen
              </Text>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>
              {activeTab === 'authority' 
                ? 'Secure access for disaster management and critical decision support.'
                : 'Stay informed and safe with real-time pollution and disaster updates.'}
            </Text>
            <View style={styles.descriptionDivider} />
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            
            {activeTab === 'authority' ? (
              <>
                {/* Email Input */}
                <View>
                  <Text style={styles.inputLabel}>Official Email</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="mail-outline" size={20} color="#6B7280" />
                    <TextInput 
                      placeholder="name@gov.agency" 
                      style={styles.textInput}
                      placeholderTextColor="#9CA3AF"
                      autoCapitalize="none"
                      keyboardType="email-address"
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
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            ) : (
              <>
                {/* Mobile Number Input */}
                <View>
                  <Text style={styles.inputLabel}>Mobile Number</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="call-outline" size={20} color="#6B7280" />
                    <TextInput 
                      placeholder="+91 98765 43210" 
                      style={styles.textInput}
                      placeholderTextColor="#9CA3AF"
                      keyboardType="phone-pad"
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
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPasswordButton}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton}>
              <Text style={styles.submitButtonText}>
                {activeTab === 'authority' ? 'Access Decision Dashboard' : 'Login as Citizen'}
              </Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity>
                <Text style={styles.footerLink}>
                  {activeTab === 'authority' ? 'Request Access' : 'Register Now'}
                </Text>
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
