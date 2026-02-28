import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// In Expo, localhost points to the device, we need to use the computer's IP address or 10.0.2.2 for Android emulator
// For simplicity, we use a placeholder or local IP. Change this to your local IP running backend
export const API_URL = 'http://192.168.1.100:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
