import React, { useEffect, useState } from 'react';
import api from '../api';
import { Users, Car, Calendar, DollarSign } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        api.get('/admin/analytics').then(res => setStats(res.data)).catch(console.error);
    }, []);

    if (!stats) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Platform Analytics</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={stats.totalUsers} icon={<Users size={24} className="text-primary" />} />
                <StatCard title="Total Cars" value={stats.totalCars} icon={<Car size={24} className="text-accent" />} />
                <StatCard title="Total Bookings" value={stats.totalBookings} icon={<Calendar size={24} className="text-blue-500" />} />
                <StatCard title="Revenue (10% Fee)" value={`$${stats.revenue.toFixed(2)}`} icon={<DollarSign size={24} className="text-green-600" />} />
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm flex items-center space-x-4 border border-gray-100">
        <div className="p-4 bg-gray-50 rounded-full">{icon}</div>
        <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

export default Dashboard;
