import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Login = () => {
    const [email, setEmail] = useState('admin@attaris.com');
    const [password, setPassword] = useState('password123');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            if (res.data.user.role === 'ADMIN') {
                localStorage.setItem('token', res.data.token);
                navigate('/');
            } else {
                setError('Unauthorized access');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
                <h2 className="text-3xl font-bold text-center text-primary mb-6">Admin Login</h2>
                {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm text-center">{error}</div>}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring focus:ring-primary/50"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring focus:ring-primary/50"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-primary text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
