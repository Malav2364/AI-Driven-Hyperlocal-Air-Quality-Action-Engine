import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const API_URL = 'http://localhost:5000'; // For iOS simulator
// For Android Emulator use: 'http://10.0.2.2:5000'
// For Physical Device use your machine's IP: 'http://192.168.x.x:5000'

// Helper to determine fetch URL based on platform if needed, 
// using localhost for now as default for web/ios
const getBaseUrl = () => {
    // Attempting to use the machine's LAN IP which works for Emulators and Physical Devices on the same network
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
        return 'http://172.20.10.4:5000';
    }
    return 'http://localhost:5000';
};

const BASE_URL = getBaseUrl();

export const setToken = async (token: string) => {
    if (Platform.OS === 'web') {
        localStorage.setItem('token', token);
    } else {
        await SecureStore.setItemAsync('token', token);
    }
};

export const getToken = async () => {
    if (Platform.OS === 'web') {
        return localStorage.getItem('token');
    } else {
        return await SecureStore.getItemAsync('token');
    }
};

export const removeToken = async () => {
    if (Platform.OS === 'web') {
        localStorage.removeItem('token');
    } else {
        await SecureStore.deleteItemAsync('token');
    }
};

export const api = {
    login: async (email: string, password: string) => {
        const res = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        return res.json();
    },

    signup: async (name: string, email: string, password: string, role: string, age: string, city: string, pincode: string, companyName: string) => {
        try {
            const response = await fetch(`${BASE_URL}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role, age, city, pincode, companyName }),
            });
            return await response.json();
        } catch (error) {
            return { error: true, message: 'Network error', details: error };
        }
    },

    requestReInspection: async (details: any) => {
        const token = await getToken();
        try {
            const response = await fetch(`${BASE_URL}/audit/request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ details })
            });
            return await response.json();
        } catch (error) {
            console.error("Re-Inspection Request Error", error);
            return null;
        }
    },

    getAudits: async () => {
        const token = await getToken();
        try {
            const response = await fetch(`${BASE_URL}/audits`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return await response.json();
        } catch (error) {
            console.error("Get Audits Error", error);
            return [];
        }
    },

    getMe: async () => {
        const token = await getToken();
        const res = await fetch(`${BASE_URL}/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return res.json();
    },

    updateUser: async (data: any) => {
        const token = await getToken();
        const res = await fetch(`${BASE_URL}/me`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return res.json();
    }
};

export default api;
