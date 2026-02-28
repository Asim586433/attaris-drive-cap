import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api';

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState('guest1@example.com');
    const [password, setPassword] = useState('password123');

    const handleLogin = async () => {
        try {
            const res = await api.post('/auth/login', { email, password });
            await AsyncStorage.setItem('token', res.data.token);
            await AsyncStorage.setItem('role', res.data.user.role);

            if (res.data.user.role === 'HOST') {
                navigation.replace('HostTabs');
            } else {
                navigation.replace('GuestTabs');
            }
        } catch (e: any) {
            Alert.alert('Login Failed', e.response?.data?.error || 'Network error');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Attaris Drive Cap</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
    title: { fontSize: 32, fontWeight: 'bold', color: '#2563EB', textAlign: 'center', marginBottom: 40 },
    inputContainer: { marginBottom: 20 },
    label: { fontSize: 16, color: '#333', marginBottom: 8 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 15, fontSize: 16 },
    button: { backgroundColor: '#2563EB', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
