import React, { useEffect, useState } from 'react';
import api from '../api';

const Users = () => {
    const [users, setUsers] = useState<any[]>([]);

    const fetchUsers = () => {
        api.get('/admin/users').then(res => setUsers(res.data)).catch(console.error);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleApproveKyc = async (id: string) => {
        if (confirm('Approve KYC for this user?')) {
            await api.put(`/admin/users/${id}/kyc-approve`);
            fetchUsers();
        }
    };

    const handleSuspend = async (id: string) => {
        if (confirm('Suspend this user account?')) {
            await api.put(`/admin/users/${id}/suspend`);
            fetchUsers();
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">User Management & KYC</h1>
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="min-w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-gray-500 font-medium">Email</th>
                            <th className="px-6 py-3 text-gray-500 font-medium">Role</th>
                            <th className="px-6 py-3 text-gray-500 font-medium">KYC Status</th>
                            <th className="px-6 py-3 text-gray-500 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map(u => (
                            <tr key={u.id}>
                                <td className="px-6 py-4">{u.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                            u.role === 'HOST' ? 'bg-blue-100 text-blue-700' :
                                                u.role === 'SUSPENDED' ? 'bg-red-100 text-red-700' :
                                                    'bg-gray-100 text-gray-700'
                                        }`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${u.kyc_status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                            u.kyc_status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {u.kyc_status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    {u.kyc_status === 'PENDING' && (
                                        <button onClick={() => handleApproveKyc(u.id)} className="text-sm text-green-600 hover:underline">Approve KYC</button>
                                    )}
                                    {u.role !== 'ADMIN' && u.role !== 'SUSPENDED' && (
                                        <button onClick={() => handleSuspend(u.id)} className="text-sm text-red-600 hover:underline">Suspend</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;
