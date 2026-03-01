import { useEffect, useState } from 'react';
import api from '../api';

const Cars = () => {
    const [cars, setCars] = useState<any[]>([]);

    useEffect(() => {
        api.get('/admin/cars').then(res => setCars(res.data)).catch(console.error);
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to remove this listing?')) {
            await api.delete(`/cars/${id}`);
            setCars(cars.filter(c => c.id !== id));
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Fleet Management</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map(c => {
                    let imgs = [];
                    try { imgs = JSON.parse(c.images); } catch (e) { }
                    const img = imgs[0] || 'https://via.placeholder.com/300x200?text=No+Image';

                    return (
                        <div key={c.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 relative group">
                            <img src={img} alt={c.title} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg">{c.title}</h3>
                                    <span className="bg-green-100 text-green-700 font-bold px-2 py-1 rounded text-sm">${c.price_per_day}/d</span>
                                </div>
                                <p className="text-gray-500 text-sm mb-4">📍 {c.location}</p>
                                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-xs text-gray-400">Host: {c.host?.email}</span>
                                    <button onClick={() => handleDelete(c.id)} className="text-sm text-red-500 hover:text-red-700 font-medium">
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Cars;
