import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../api';

export default function HostTabs() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await api.get('/bookings');
            setBookings(res.data);
        } catch (e) {
            console.log('Fetch error', e);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string, status: string) => {
        if (status !== 'PENDING') return;
        try {
            await api.put(`/bookings/${id}/approve`);
            alert('Booking approved!');
            fetchBookings();
        } catch (e) {
            alert('Approval failed');
        }
    };

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#10B981" /></View>;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Host Dashboard</Text>
            <FlatList
                data={bookings}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <Text style={styles.title}>{item.car?.title}</Text>
                            <Text style={styles.price}>${item.total_price.toFixed(2)}</Text>
                        </View>
                        <Text style={styles.details}>Guest: {item.guest?.email}</Text>
                        <Text style={styles.details}>Status: {item.status}</Text>
                        <Text style={styles.details}>Start: {new Date(item.start_date).toLocaleDateString()}</Text>
                        <Text style={styles.details}>End: {new Date(item.end_date).toLocaleDateString()}</Text>

                        {item.status === 'PENDING' && (
                            <TouchableOpacity style={styles.btnApprove} onPress={() => handleApprove(item.id, item.status)}>
                                <Text style={styles.btnText}>Approve Booking</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { flex: 1, backgroundColor: '#f3f4f6' },
    header: { fontSize: 24, fontWeight: 'bold', padding: 20, paddingTop: 60, backgroundColor: '#fff', color: '#10B981' },
    card: { backgroundColor: '#fff', margin: 15, borderRadius: 12, padding: 15, elevation: 2 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    title: { fontSize: 18, fontWeight: 'bold' },
    price: { fontSize: 18, color: '#10B981', fontWeight: 'bold' },
    details: { color: '#666', marginBottom: 5 },
    btnApprove: { backgroundColor: '#10B981', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    btnText: { color: '#fff', fontWeight: 'bold' }
});
