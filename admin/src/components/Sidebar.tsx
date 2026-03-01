import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, CarFront, LogOut } from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="w-64 bg-white shadow-md h-screen flex flex-col">
            <div className="p-6 border-b">
                <h1 className="text-2xl font-bold text-primary">Attaris Admin</h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                <NavLink to="/" className={({ isActive }) => `flex items-center space-x-3 p-3 rounded-lg ${isActive ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/users" className={({ isActive }) => `flex items-center space-x-3 p-3 rounded-lg ${isActive ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                    <Users size={20} />
                    <span>Users & KYC</span>
                </NavLink>
                <NavLink to="/cars" className={({ isActive }) => `flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary ${isActive ? 'bg-blue-50 text-primary border-r-4 border-primary' : ''}`}>
                    <CarFront className="w-5 h-5 mr-3" />
                    Fleet
                </NavLink>
            </nav>
            <div className="p-4 border-t">
                <button onClick={handleLogout} className="flex items-center space-x-3 p-3 text-red-600 hover:bg-red-50 rounded-lg w-full">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
