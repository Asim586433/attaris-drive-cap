import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../api';

export default function GuestTabs() {
    const [cars, setCars] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            const res = await api.get('/cars');
            setCars(res.data);
        } catch (e) {
            console.log('Fetch error', e);
        } finally {
            setLoading(false);
        }
    };

    const handleBook = async (carId: string) => {
        try {
            // Mock booking for 3 days starting tomorrow
            const start = new Date();
            start.setDate(start.getDate() + 1);
            const end = new Date(start);
            end.setDate(start.getDate() + 3);

            await api.post('/bookings', {
                car_id: carId,
                start_date: start.toISOString(),
                end_date: end.toISOString()
            });
            alert('Car booked successfully! Awaiting host approval.');
        } catch (e: any) {
            alert(e.response?.data?.error || 'Booking failed');
        }
    };

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#2563EB" /></View>;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Available Cars</Text>
            <FlatList
                data={cars}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    let imgs = [];
                    try { imgs = JSON.parse(item.images); } catch (e) { }
                    const img = imgs[0] || 'https://via.placeholder.com/300x200?text=No+Image';

                    return (
                        <View style={styles.card}>
                            <Image source={{ uri: img }} style={styles.image} />
                            <View style={styles.info}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.price}>${item.price_per_day} / day</Text>
                                <Text style={styles.location}>📍 {item.location}</Text>
                                <TouchableOpacity style={styles.button} onPress={() => handleBook(item.id)}>
                                    <Text style={styles.buttonText}>Book Now (Mock Stripe)</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                }}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { flex: 1, backgroundColor: '#f3f4f6' },
    header: { fontSize: 24, fontWeight: 'bold', padding: 20, paddingTop: 60, backgroundColor: '#fff' },
    card: { backgroundColor: '#fff', margin: 15, borderRadius: 12, overflow: 'hidden', elevation: 2 },
    image: { width: '100%', height: 200 },
    info: { padding: 15 },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
    price: { fontSize: 16, color: '#10B981', fontWeight: 'bold', marginBottom: 5 },
    location: { color: '#666', marginBottom: 15 },
    button: { backgroundColor: '#2563EB', padding: 12, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: 'bold' }
});
